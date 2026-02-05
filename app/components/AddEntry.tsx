import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { getServerUrl } from '../config';
import { SelectOption } from './SelectOption';

function round(num: number): string | number {
  const s = num.toString().split('.')[1];
  return s?.length > 2 ? num.toFixed(2) : num;
}

interface AddEntryProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts: string[];
  eventId: string;
}

export function AddEntry({ visible, onClose, onSuccess, accounts, eventId }: AddEntryProps) {
  const [entryName, setEntryName] = useState('');
  const [entryValue, setEntryValue] = useState('');
  const [shares, setShares] = useState<number[]>(accounts.map(() => 0));
  const [checkedList, setCheckedList] = useState<string[]>([...accounts]);
  const [method, setMethod] = useState<1 | 2>(1);
  const [payer, setPayer] = useState('');
  const [entryValueError, setEntryValueError] = useState(false);
  const [sharesError, setSharesError] = useState(accounts.map(() => false));
  const [loading, setLoading] = useState(false);

  const checkAll = accounts.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < accounts.length;

  const updateEntryValue = (v: string) => {
    const num = parseFloat(v);
    if (v !== '' && (isNaN(num) || num < 0)) {
      setEntryValueError(true);
      return;
    }
    setEntryValueError(false);
    setEntryValue(v);
    if (method === 1) {
      setShares(
        accounts.map((a) => (checkedList.includes(a) ? (v ? parseFloat(v) / checkedList.length : 0) : 0))
      );
    }
  };

  const updateShare = (i: number, v: string) => {
    const num = parseFloat(v);
    if (v !== '' && (isNaN(num) || num < 0)) {
      const next = [...sharesError];
      next[i] = true;
      setSharesError(next);
      return;
    }
    const nextErr = [...sharesError];
    nextErr[i] = false;
    setSharesError(nextErr);
    const next = [...shares];
    next[i] = v ? num : 0;
    setShares(next);
  };

  const onCheckAll = () => {
    if (checkAll) {
      setCheckedList([]);
      setShares(accounts.map(() => 0));
    } else {
      setCheckedList([...accounts]);
      if (method === 1) setShares(accounts.map(() => (entryValue ? parseFloat(entryValue) / accounts.length : 0)));
    }
  };

  const toggleMember = (m: string) => {
    const next = checkedList.includes(m) ? checkedList.filter((x) => x !== m) : [...checkedList, m];
    setCheckedList(next);
    if (method === 1)
      setShares(accounts.map((a) => (next.includes(a) ? (entryValue ? parseFloat(entryValue) / next.length : 0) : 0)));
  };

  const setMethod1 = () => {
    setMethod(1);
    setShares(accounts.map((a) => (checkedList.includes(a) ? (entryValue ? parseFloat(entryValue) / checkedList.length : 0) : 0)));
  };
  const setMethod2 = () => {
    setMethod(2);
    setShares(accounts.map(() => 0));
  };

  const totalShares = shares.reduce((a, b) => a + b, 0);
  const remaining = entryValue ? parseFloat(entryValue) - totalShares : 0;
  const valid =
    !entryValueError &&
    !!entryName.trim() &&
    !!entryValue &&
    parseFloat(entryValue) >= 0 &&
    !!payer &&
    ((method === 1 && checkedList.length > 0) || (method === 2 && Math.abs(remaining) < 0.01));

  const convertShares = () => {
    const out: Record<string, number> = {};
    accounts.forEach((a, i) => {
      out[a] = Number(shares[i]) || 0;
    });
    return out;
  };

  const submit = async () => {
    if (!valid) return;
    setLoading(true);
    try {
      const res = await fetch(`${getServerUrl()}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          timestamp: Date.now(),
          type: 'expense',
          value: Number(entryValue),
          payer,
          name: entryName.trim(),
          method,
          shares: convertShares(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const options = accounts.map((a) => ({ value: a, label: a }));

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>新增支出</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>關閉</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.label}>帳目</Text>
              <TextInput
                style={styles.input}
                placeholder="帳目名稱"
                value={entryName}
                onChangeText={setEntryName}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>金額</Text>
              <TextInput
                style={[styles.input, entryValueError && styles.inputError]}
                placeholder="帳目金額"
                value={entryValue}
                onChangeText={updateEntryValue}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>付款人</Text>
              <SelectOption value={payer} options={options} onSelect={setPayer} placeholder="付款人" />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>分攤方式</Text>
              <View style={styles.radioRow}>
                <Pressable style={[styles.radio, method === 1 && styles.radioSelected]} onPress={setMethod1}>
                  <Text>平均分攤</Text>
                </Pressable>
                <Pressable style={[styles.radio, method === 2 && styles.radioSelected]} onPress={setMethod2}>
                  <Text>指定金額</Text>
                </Pressable>
              </View>
            </View>
            {method === 1 && (
              <>
                <Pressable style={styles.checkRow} onPress={onCheckAll}>
                  <Text>{checkAll ? '☑' : indeterminate ? '▣' : '☐'} 全選</Text>
                </Pressable>
                {accounts.map((m) => (
                  <Pressable key={m} style={styles.checkRow} onPress={() => toggleMember(m)}>
                    <Text>{checkedList.includes(m) ? '☑' : '☐'} {m}</Text>
                  </Pressable>
                ))}
              </>
            )}
            {accounts.map((item, i) => (
              <View key={item} style={styles.shareRow}>
                <Text>{item} 分擔 {round(shares[i]) || 0} 元</Text>
                {method === 2 && (
                  <TextInput
                    style={[styles.inputSmall, sharesError[i] && styles.inputError]}
                    placeholder="指定金額"
                    value={shares[i] ? String(shares[i]) : ''}
                    onChangeText={(v) => updateShare(i, v)}
                    keyboardType="decimal-pad"
                  />
                )}
              </View>
            ))}
            {method === 2 && (
              <Text style={styles.remaining}>剩餘金額: {round(remaining)}</Text>
            )}
            {loading ? (
              <ActivityIndicator style={styles.loader} />
            ) : (
              <Pressable
                style={[styles.btn, styles.btnPrimary, !valid && styles.btnDisabled]}
                onPress={submit}
                disabled={!valid}
              >
                <Text style={styles.btnPrimaryText}>新增支出</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  box: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontWeight: '700', fontSize: 18 },
  close: { color: '#1890ff' },
  body: { padding: 16 },
  row: { marginBottom: 12 },
  label: { marginBottom: 4, fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, padding: 10, fontSize: 16, minWidth: 140 },
  inputError: { borderColor: '#ff4d4f' },
  inputSmall: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, padding: 8, fontSize: 14, width: 100 },
  radioRow: { flexDirection: 'row', gap: 12 },
  radio: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8 },
  radioSelected: { borderColor: '#1890ff', backgroundColor: '#e6f7ff' },
  checkRow: { paddingVertical: 6 },
  shareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  remaining: { marginBottom: 12 },
  loader: { marginVertical: 16 },
  btn: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnPrimary: { backgroundColor: '#1890ff' },
  btnDisabled: { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 16 },
});
