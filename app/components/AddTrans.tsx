import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getServerUrl } from '../config';
import { SelectOption } from './SelectOption';

interface AddTransProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts: string[];
  eventId: string;
}

export function AddTrans({ visible, onClose, onSuccess, accounts, eventId }: AddTransProps) {
  const [entryValue, setEntryValue] = useState('');
  const [payer, setPayer] = useState('');
  const [receiver, setReceiver] = useState('');
  const [entryValueError, setEntryValueError] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateValue = (v: string) => {
    const num = parseFloat(v);
    if (v !== '' && (isNaN(num) || num < 0)) {
      setEntryValueError(true);
      return;
    }
    setEntryValueError(false);
    setEntryValue(v);
  };

  const valid =
    !entryValueError &&
    !!entryValue &&
    parseFloat(entryValue) >= 0 &&
    !!payer &&
    !!receiver &&
    payer !== receiver;

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
          type: 'transfer',
          value: Number(entryValue),
          payer,
          receiver,
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
            <Text style={styles.title}>新增轉帳</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>關閉</Text>
            </Pressable>
          </View>
          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.label}>付款人</Text>
              <SelectOption value={payer} options={options} onSelect={setPayer} placeholder="付款人" />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>金額</Text>
              <TextInput
                style={[styles.input, entryValueError && styles.inputError]}
                placeholder="金額"
                value={entryValue}
                onChangeText={updateValue}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>收款人</Text>
              <SelectOption value={receiver} options={options} onSelect={setReceiver} placeholder="收款人" />
            </View>
            {loading ? (
              <ActivityIndicator style={styles.loader} />
            ) : (
              <Pressable
                style={[styles.btn, styles.btnPrimary, !valid && styles.btnDisabled]}
                onPress={submit}
                disabled={!valid}
              >
                <Text style={styles.btnPrimaryText}>新增轉帳</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  box: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontWeight: '700', fontSize: 18 },
  close: { color: '#1890ff' },
  body: { padding: 16 },
  row: { marginBottom: 12 },
  label: { marginBottom: 4, fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, padding: 10, fontSize: 16, minWidth: 140 },
  inputError: { borderColor: '#ff4d4f' },
  loader: { marginVertical: 16 },
  btn: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnPrimary: { backgroundColor: '#1890ff' },
  btnDisabled: { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 16 },
});
