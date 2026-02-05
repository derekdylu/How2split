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
import { useToast } from '../contexts/ToastContext';

interface EditEventProps {
  visible: boolean;
  onClose: (changed: boolean) => void;
  data: { name: string; accounts: string[] };
  eventId: string;
  onNavigate?: (id: string) => void;
}

export function EditEvent({ visible, onClose, data, eventId, onNavigate }: EditEventProps) {
  const { showToast } = useToast();
  const [eventName, setEventName] = useState(data.name);
  const [eventAccounts, setEventAccounts] = useState<string[]>(data.accounts);
  const [inputMember, setInputMember] = useState('');
  const [loading, setLoading] = useState(false);
  const originalAccounts = data.accounts;
  const originalName = data.name;

  const addMember = () => {
    const trimmed = inputMember.trim();
    if (!trimmed) return;
    if (eventAccounts.includes(trimmed)) {
      showToast('成員名稱重複', 'error');
      return;
    }
    setEventAccounts([...eventAccounts, trimmed]);
    setInputMember('');
  };

  const removeMember = (name: string) => {
    setEventAccounts(eventAccounts.filter((m) => m !== name));
  };

  const submitEvent = async () => {
    if (eventName === originalName && eventAccounts.length === originalAccounts.length) {
      onClose(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${getServerUrl()}/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eventName,
          accounts: eventAccounts,
          locked: false,
          password: '',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      onClose(true);
      if (onNavigate) onNavigate(result._id);
    } catch (e) {
      console.error(e);
      onClose(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={() => submitEvent()}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>編輯活動</Text>
            <Pressable onPress={() => submitEvent()} hitSlop={12}>
              <Text style={styles.close}>關閉（儲存）</Text>
            </Pressable>
          </View>
          {loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <ScrollView style={styles.body}>
              <TextInput
                style={styles.input}
                placeholder="活動名稱"
                value={eventName}
                onChangeText={setEventName}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  placeholder="成員名稱"
                  value={inputMember}
                  onChangeText={setInputMember}
                  onSubmitEditing={addMember}
                />
                <Pressable
                  style={[styles.btn, styles.btnSecondary, !inputMember.trim() && styles.btnDisabled]}
                  onPress={addMember}
                  disabled={!inputMember.trim()}
                >
                  <Text style={styles.btnText}>新增成員</Text>
                </Pressable>
              </View>
              <Text style={styles.hint}>*關閉視窗即自動更新，更新後無法刪除既有成員*</Text>
              {eventAccounts.map((member) => (
                <View key={member} style={styles.listItem}>
                  <Text style={styles.listItemText}>{member}</Text>
                  <Pressable
                    onPress={() => removeMember(member)}
                    disabled={originalAccounts.includes(member)}
                    style={originalAccounts.includes(member) ? styles.deleteBtnDisabled : styles.deleteBtn}
                  >
                    <Text style={styles.deleteBtnText}>刪除</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
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
  input: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 12 },
  inputFlex: { flex: 1, marginBottom: 0 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center' },
  hint: { fontSize: 12, color: '#666', marginBottom: 12 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 6 },
  listItemText: { fontSize: 16 },
  deleteBtn: { padding: 4 },
  deleteBtnDisabled: { padding: 4, opacity: 0.4 },
  deleteBtnText: { color: '#ff4d4f', fontSize: 14 },
  loader: { marginVertical: 32 },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnSecondary: { backgroundColor: '#f0f0f0' },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16 },
});
