import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getServerUrl, getWebBaseUrl } from '../config';
import { copyToClipboard } from '../lib/clipboard';
import { useToast } from '../contexts/ToastContext';
import { useLocale } from '../contexts/LocaleContext';
import type { Transaction, ExpenseTransaction, TransferTransaction, SettleItem } from '../types';
import { AddEntry } from '../components/AddEntry';
import { EditEntry } from '../components/EditEntry';
import { AddTrans } from '../components/AddTrans';
import { EditTrans } from '../components/EditTrans';
import { EditEvent } from '../components/EditEvent';

function round(num: number | null | undefined): string | number {
  if (num == null) return 0;
  const s = num.toString().split('.')[1];
  return s?.length > 2 ? Number(num).toFixed(2) : num;
}

function renderTime(time: number): string {
  const d = new Date(time);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours();
  const min = d.getMinutes();
  return `${y}/${m}/${day}, ${h}:${min < 10 ? '0' + min : min}`;
}

function processTransactions(transactions: Transaction[]): Record<string, number> {
  const balances: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === 'transfer') {
      balances[t.payer] = (balances[t.payer] || 0) + t.value;
      balances[t.receiver] = (balances[t.receiver] || 0) - t.value;
    } else {
      const expense = t as ExpenseTransaction;
      balances[expense.payer] = (balances[expense.payer] || 0) + expense.value;
      for (const [person, share] of Object.entries(expense.shares)) {
        balances[person] = (balances[person] || 0) - share;
      }
    }
  });
  return balances;
}

function minimizeTransactions(balances: Record<string, number>): SettleItem[] {
  const result: SettleItem[] = [];
  const keys = Object.keys(balances);

  while (true) {
    keys.sort((a, b) => balances[a] - balances[b]);
    const debtor = keys[0];
    const creditor = keys[keys.length - 1];
    if (balances[debtor] >= 0 || balances[creditor] <= 0) break;
    const amount = Math.min(-balances[debtor], balances[creditor]);
    balances[debtor] += amount;
    balances[creditor] -= amount;
    result.push({ debtor, creditor, settledAmount: amount });
  }
  return result;
}

export function Event() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const id = route.params?.id as string;
  const { showToast } = useToast();
  const { t } = useLocale();

  const [eventName, setEventName] = useState('');
  const [accounts, setAccounts] = useState<string[]>([]);
  const [data, setData] = useState<Transaction[] | null>(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const [openEntryModal, setOpenEntryModal] = useState(false);
  const [openEntryEditModal, setOpenEntryEditModal] = useState(false);
  const [openTransModal, setOpenTransModal] = useState(false);
  const [openTransEditModal, setOpenTransEditModal] = useState(false);
  const [openEventEditModal, setOpenEventEditModal] = useState(false);
  const [dataIndex, setDataIndex] = useState(-1);
  const [showSettle, setShowSettle] = useState(false);
  const [settleData, setSettleData] = useState<SettleItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const res = await fetch(`${getServerUrl()}/events/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.name && result.accounts) {
        setEventName(result.name);
        setAccounts(result.accounts);
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${getServerUrl()}/events/${id}/transactions`);
      if (res.status === 404) {
        setData([]);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      const list = Array.isArray(result) ? result : [];
      setData(list.length === 0 ? [] : list.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp));
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
    fetchData();
  }, [fetchEvent, fetchData]);

  const reload = useCallback(
    async (updatedEvent = false) => {
      try {
        const res = await fetch(`${getServerUrl()}/events/${id}/transactions`);
        if (res.status === 404) {
          setData([]);
          setSettleData([]);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        const list = Array.isArray(result) ? result : [];
        setData(list.length === 0 ? [] : list.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp));
        if (list.length > 0) {
          const balances = processTransactions(list);
          setSettleData(minimizeTransactions({ ...balances }));
        } else {
          setSettleData([]);
        }
        if (updatedEvent) fetchEvent();
      } catch (e) {
        console.error(e);
      }
    },
    [id, fetchEvent]
  );

  const handleCloseEventEdit = (changed: boolean) => {
    if (changed) reload(true);
    setOpenEventEditModal(false);
  };

  const handleNavigateAfterEditEvent = (newId: string) => {
    navigation.replace('Event', { id: newId });
  };

  const handleOpenEntryEdit = (index: number) => {
    setDataIndex(index);
    setOpenEntryEditModal(true);
  };
  const handleOpenTransEdit = (index: number) => {
    setDataIndex(index);
    setOpenTransEditModal(true);
  };

  const confirmAdded = () => {
    showToast(t('toast.entryAdded'));
    reload();
  };
  const confirmEdited = () => {
    showToast(t('toast.entryUpdated'));
    reload();
  };

  const confirmDelete = (transactionId: string) => {
    Alert.alert(t('event.deleteTitle'), t('event.deleteMessage'), [
      { text: t('event.cancel'), style: 'cancel' },
      {
        text: t('event.deleteOk'),
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${getServerUrl()}/transactions/${transactionId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            showToast(t('toast.entryDeleted'), 'info');
            reload();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  const confirmSettle = (item: SettleItem) => {
    Alert.alert(t('event.settleConfirmTitle'), t('event.settleConfirmMessage'), [
      { text: t('event.cancel'), style: 'cancel' },
      {
        text: t('event.settleConfirmOk'),
        onPress: async () => {
          try {
            const res = await fetch(`${getServerUrl()}/transactions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                eventId: id,
                timestamp: Date.now(),
                type: 'transfer',
                value: item.settledAmount,
                payer: item.debtor,
                receiver: item.creditor,
              }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            showToast(t('toast.settleAdded'));
            reload();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  const runSettle = () => {
    if (!data || data.length === 0) return;
    setLoading(true);
    setSettleData([]);
    const balances = processTransactions(data);
    setSettleData(minimizeTransactions({ ...balances }));
    setLoading(false);
    setShowSettle(true);
  };

  const doCopyLink = async () => {
    const link = `${getWebBaseUrl()}/events/${id}`;
    await copyToClipboard(link);
    showToast(t('toast.linkCopied'));
  };

  if (data === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const settleList = settleData.filter((item) => item.settledAmount >= 0.005);
  const currentEntry = dataIndex >= 0 && data[dataIndex] ? data[dataIndex] : null;
  const isExpense = (t: Transaction): t is ExpenseTransaction => t.type === 'expense';

  return (
    <>
      {openEventEditModal && (
        <EditEvent
          visible={openEventEditModal}
          onClose={handleCloseEventEdit}
          data={{ name: eventName, accounts }}
          eventId={id}
          onNavigate={handleNavigateAfterEditEvent}
        />
      )}
      {openEntryModal && (
        <AddEntry
          visible={openEntryModal}
          onClose={() => setOpenEntryModal(false)}
          onSuccess={confirmAdded}
          accounts={accounts}
          eventId={id}
        />
      )}
      {openEntryEditModal && currentEntry && isExpense(currentEntry) && (
        <EditEntry
          visible={openEntryEditModal}
          onClose={() => setOpenEntryEditModal(false)}
          onSuccess={confirmEdited}
          accounts={accounts}
          eventId={id}
          transactionId={currentEntry._id}
          data={currentEntry}
        />
      )}
      {openTransModal && (
        <AddTrans
          visible={openTransModal}
          onClose={() => setOpenTransModal(false)}
          onSuccess={() => {
            showToast(t('toast.transferAdded'));
            reload();
          }}
          accounts={accounts}
          eventId={id}
        />
      )}
      {openTransEditModal && currentEntry && !isExpense(currentEntry) && (
        <EditTrans
          visible={openTransEditModal}
          onClose={() => setOpenTransEditModal(false)}
          onSuccess={() => {
            showToast(t('toast.transferUpdated'));
            reload();
          }}
          accounts={accounts}
          eventId={id}
          transactionId={currentEntry._id}
          data={currentEntry}
        />
      )}

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.eventName}>{eventName}</Text>
          <Pressable onPress={() => setOpenEventEditModal(true)} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>✎</Text>
          </Pressable>
        </View>
        <View style={styles.buttonRow}>
          <Pressable style={[styles.btn, styles.btnSecondary]} onPress={doCopyLink}>
            <Text>{t('event.copyLink')}</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => setOpenEntryModal(true)}>
            <Text>{t('event.addExpense')}</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => setOpenTransModal(true)}>
            <Text>{t('event.addTransfer')}</Text>
          </Pressable>
          {loading ? (
            <Pressable style={[styles.btn, styles.btnPrimary]} disabled>
              <ActivityIndicator size="small" color="#fff" />
            </Pressable>
          ) : (
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={runSettle}>
              <Text style={styles.btnPrimaryText}>{t('event.settle')}</Text>
            </Pressable>
          )}
        </View>

        {showSettle && (
          <View style={styles.settleSection}>
            {settleList.length > 0 ? (
              <>
                {settleList.map((item, i) => (
                  <View key={i} style={styles.settleItem}>
                    <Text style={styles.settleText}>
                      {t('event.settleLine', {
                        debtor: item.debtor,
                        creditor: item.creditor,
                        amount: round(item.settledAmount) as number,
                      })}
                    </Text>
                    <Pressable style={styles.settleBtn} onPress={() => confirmSettle(item)}>
                      <Text style={styles.settleBtnText}>{t('event.settleClear')}</Text>
                    </Pressable>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.noSettle}>{t('event.noSettle')}</Text>
            )}
            <Pressable onPress={() => setShowSettle(false)}>
              <Text style={styles.hideSettle}>{t('event.hideSettle')}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.divider} />
        {data.map((item, i) => (
          <View key={item._id} style={styles.transItem}>
            <Pressable
              onPress={() => setOpenIndex(openIndex === i ? -1 : i)}
              style={styles.transHeader}
            >
              {item.type === 'expense' && (
                <>
                  <View style={styles.transMain}>
                    <Text style={styles.transText}>
                      {t('event.expenseLine', {
                        name: (item as ExpenseTransaction).name,
                        payer: (item as ExpenseTransaction).payer,
                        value: round((item as ExpenseTransaction).value) as number,
                      })}
                    </Text>
                    <View style={styles.transActions}>
                      <Pressable onPress={() => handleOpenEntryEdit(i)} style={styles.smallBtn}>
                        <Text>✎</Text>
                      </Pressable>
                      <Pressable onPress={() => confirmDelete(item._id)} style={[styles.smallBtn, styles.dangerBtn]}>
                        <Text style={styles.dangerText}>{t('event.deleteShort')}</Text>
                      </Pressable>
                    </View>
                  </View>
                  {openIndex === i && (
                    <View style={styles.transDetail}>
                      {Object.entries((item as ExpenseTransaction).shares).map(([member, share]) => (
                        <Text key={member} style={styles.detailRow}>
                          {t('event.shareLine', { member, amount: round(share) || 0 })}
                        </Text>
                      ))}
                      <Text style={styles.detailMeta}>
                        {renderTime(item.timestamp)} - {(item as ExpenseTransaction).method === 1 ? t('event.methodEqual') : t('event.methodCustom')}
                      </Text>
                    </View>
                  )}
                </>
              )}
              {item.type === 'transfer' && (
                <>
                  <View style={styles.transMain}>
                    <Text style={styles.transText}>
                      {t('event.transferLine', {
                        payer: item.payer,
                        receiver: item.receiver,
                        value: round(item.value) as number,
                      })}
                    </Text>
                    <View style={styles.transActions}>
                      <Pressable onPress={() => handleOpenTransEdit(i)} style={styles.smallBtn}>
                        <Text>✎</Text>
                      </Pressable>
                      <Pressable onPress={() => confirmDelete(item._id)} style={[styles.smallBtn, styles.dangerBtn]}>
                        <Text style={styles.dangerText}>{t('event.deleteShort')}</Text>
                      </Pressable>
                    </View>
                  </View>
                  {openIndex === i && (
                    <Text style={styles.detailMeta}>{renderTime(item.timestamp)}</Text>
                  )}
                </>
              )}
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  eventName: { fontWeight: '700', fontSize: 18, flex: 1 },
  iconBtn: { padding: 8 },
  iconBtnText: { fontSize: 16 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnSecondary: { backgroundColor: '#f0f0f0' },
  btnPrimary: { backgroundColor: '#1890ff' },
  btnPrimaryText: { color: '#fff' },
  settleSection: { marginBottom: 16 },
  settleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 6 },
  settleText: { fontSize: 15 },
  settleBtn: { paddingVertical: 4, paddingHorizontal: 12, backgroundColor: '#ff4d4f', borderRadius: 8 },
  settleBtnText: { color: '#fff' },
  noSettle: { paddingVertical: 16 },
  hideSettle: { color: '#1890ff', marginTop: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  transItem: { marginBottom: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 8, overflow: 'hidden' },
  transHeader: { padding: 12 },
  transMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transText: { flex: 1, fontSize: 15 },
  transActions: { flexDirection: 'row', gap: 4 },
  smallBtn: { padding: 6 },
  dangerBtn: {},
  dangerText: { color: '#ff4d4f' },
  transDetail: { marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#eee' },
  detailRow: { marginBottom: 4 },
  detailMeta: { fontSize: 12, color: '#666', marginTop: 4 },
});
