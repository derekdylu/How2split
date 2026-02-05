import React from 'react';
import { View, Text, StyleSheet, Linking, Pressable, ScrollView } from 'react-native';

export function About() {
  const openUrl = (url: string) => () => Linking.openURL(url);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>關於本站</Text>
      <Text style={styles.paragraph}>
        How2split 是一款極輕量化線上帳目分攤工具，無需下載應用程式、無需註冊帳號，只要建立活動然後記住並分享連結，即可立即開始使用。
      </Text>
      <Text style={styles.paragraph}>
        此工具由{' '}
        <Text style={styles.link} onPress={openUrl('https://derekdylu.com')}>
          derekdylu
        </Text>{' '}
        設計與開發，概念取自 When2meet 的輕量化設計，一切從簡，僅保留核心功能，希望可以讓帳目分攤更加便捷。若您有任何建議與回饋，請不吝填寫{' '}
        <Text style={styles.link} onPress={openUrl('https://forms.gle/sXuG5QWCHrvB9G628')}>
          本表單
        </Text>
        ！
      </Text>
      <Text style={styles.paragraph}>
        如果您願意支持我，可以透過{' '}
        <Text style={styles.link} onPress={openUrl('https://www.buymeacoffee.com/derekdylu')}>
          Buy Me A Coffee
        </Text>{' '}
        贊助我，感謝您的支持！
      </Text>
      <Text style={styles.paragraph}>
        開發中功能：(1) 多人付款 (2) 操作記錄 (3) 私人加密活動 (4) 成員刪除與其債權歸屬 (5) English version (6) 帳目類別 (7) 統計資料與圖表 (8) 跨國幣別結算 (9) 自訂活動連結 (10) 活動刪除
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  paragraph: { marginBottom: 16, fontSize: 15, lineHeight: 22 },
  link: { color: '#1890ff', textDecorationLine: 'underline' },
});
