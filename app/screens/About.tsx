import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { useLocale } from '../contexts/LocaleContext';

export function About() {
  const { t } = useLocale();
  const openUrl = (url: string) => () => Linking.openURL(url);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('about.title')}</Text>
      <Text style={styles.paragraph}>{t('about.intro')}</Text>
      <Text style={styles.paragraph}>
        {t('about.creditsBeforeAuthor')}
        <Text style={styles.link} onPress={openUrl('https://derekdylu.com')}>
          derekdylu
        </Text>
        {t('about.creditsAfterAuthorBeforeForm')}
        <Text style={styles.link} onPress={openUrl('https://forms.gle/sXuG5QWCHrvB9G628')}>
          {t('about.form')}
        </Text>
        {t('about.creditsAfterForm')}
      </Text>
      <Text style={styles.paragraph}>
        {t('about.supportBeforeBmc')}
        <Text style={styles.link} onPress={openUrl('https://www.buymeacoffee.com/derekdylu')}>
          {t('about.bmc')}
        </Text>
        {t('about.supportAfterBmc')}
      </Text>
      <Text style={styles.paragraph}>{t('about.roadmap')}</Text>
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
