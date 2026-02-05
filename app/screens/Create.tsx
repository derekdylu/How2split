import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getServerUrl } from '../config';
import { useToast } from '../contexts/ToastContext';
import { useLocale } from '../contexts/LocaleContext';

export function Create() {
  const navigation = useNavigation<any>();
  const { showToast } = useToast();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [inputEvent, setInputEvent] = useState('');
  const [inputMember, setInputMember] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const addMember = () => {
    const trimmed = inputMember.trim();
    if (!trimmed) return;
    if (members.includes(trimmed)) {
      showToast(t('toast.duplicateMember'), 'error');
      return;
    }
    setMembers([...members, trimmed]);
    setInputMember('');
  };

  const removeMember = (name: string) => {
    setMembers(members.filter((m) => m !== name));
  };

  const submitEvent = async () => {
    if (!inputEvent.trim() || members.length === 0) return;
    setLoading(true);
    const eventData = {
      name: inputEvent.trim(),
      accounts: members,
      locked: false,
      password: '',
    };
    try {
      const res = await fetch(`${getServerUrl()}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLoading(false);
      navigation.replace('Event', { id: data._id });
    } catch (e) {
      console.error(e);
      setLoading(false);
      showToast(t('toast.createEventFailed'), 'error');
    }
  };

  const canSubmit = inputEvent.trim().length > 0 && members.length > 0 && !loading;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('create.title')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('create.eventNamePlaceholder')}
        value={inputEvent}
        onChangeText={setInputEvent}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.inputFlex]}
          placeholder={t('create.memberPlaceholder')}
          value={inputMember}
          onChangeText={setInputMember}
          onSubmitEditing={addMember}
        />
        <Pressable
          style={[styles.btn, styles.btnSecondary, !inputMember.trim() && styles.btnDisabled]}
          onPress={addMember}
          disabled={!inputMember.trim()}
        >
          <Text style={styles.btnText}>{t('create.addMember')}</Text>
        </Pressable>
      </View>
      <View style={styles.list}>
        {members.map((member) => (
          <View key={member} style={styles.listItem}>
            <Text style={styles.listItemText}>{member}</Text>
            <Pressable
              onPress={() => removeMember(member)}
              style={styles.deleteBtn}
              hitSlop={8}
            >
              <Text style={styles.deleteBtnText}>{t('create.delete')}</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Text style={styles.hint}>{t('create.hint')}</Text>
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <Pressable
          style={[styles.btn, styles.btnPrimary, !canSubmit && styles.btnDisabled]}
          onPress={submitEvent}
          disabled={!canSubmit}
        >
          <Text style={[styles.btnText, styles.btnPrimaryText]}>{t('create.submit')}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 18, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  inputFlex: { flex: 1, marginBottom: 0 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center' },
  list: { marginBottom: 12 },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 6,
  },
  listItemText: { fontSize: 16 },
  deleteBtn: { padding: 4 },
  deleteBtnText: { color: '#ff4d4f', fontSize: 14 },
  hint: { fontSize: 12, color: '#666', marginBottom: 16 },
  loader: { marginTop: 16 },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSecondary: { backgroundColor: '#f0f0f0' },
  btnPrimary: { backgroundColor: '#1890ff' },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16 },
  btnPrimaryText: { color: '#fff' },
});
