import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocale } from '../contexts/LocaleContext';

export function Error() {
  const { t } = useLocale();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('error.notFound')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { fontSize: 18 },
});
