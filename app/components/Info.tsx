import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

const contents = [
  '1. 輸入成員並建立活動',
  '2. 記住並分享活動連結',
  '3. 開始記帳！',
  '4. 點擊帳目可以查看詳細資訊！',
  '⚠️ 所有擁有連結的人都可以編輯活動內容，請勿分享連結給不認識的人。',
];

interface InfoProps {
  visible: boolean;
  onClose: () => void;
}

export function Info({ visible, onClose }: InfoProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>How2split</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>關閉</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.body}>
            {contents.map((c, i) => (
              <Text key={i} style={styles.item}>
                {c}
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
