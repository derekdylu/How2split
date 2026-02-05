import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useLocale } from '../contexts/LocaleContext';

const contentKeys = ['info.step1', 'info.step2', 'info.step3', 'info.step4', 'info.warning'] as const;

interface InfoProps {
  visible: boolean;
  onClose: () => void;
}

export function Info({ visible, onClose }: InfoProps) {
  const { t } = useLocale();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('info.title')}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>{t('info.close')}</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.body}>
            {contentKeys.map((key) => (
              <Text key={key} style={styles.item}>
                {t(key)}
              </Text>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontWeight: '700', fontSize: 18 },
  close: { color: '#1890ff', fontSize: 16 },
  body: { padding: 16 },
  item: { marginBottom: 12, fontSize: 15 },
});
