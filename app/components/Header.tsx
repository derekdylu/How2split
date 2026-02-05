import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLocale } from '../contexts/LocaleContext';

interface HeaderProps {
  onOpenInfo: () => void;
}

export function Header({ onOpenInfo }: HeaderProps) {
  const navigation = useNavigation<any>();
  const { t, locale, setLocale } = useLocale();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Create')}>
        <Text style={styles.brand}>How2split</Text>
      </Pressable>
      <View style={styles.right}>
        <Pressable onPress={() => setLocale(locale === 'zh' ? 'en' : 'zh')} style={styles.langSwitch}>
          <Text style={styles.link}>{locale === 'zh' ? 'EN' : '中文'}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('About')}>
          <Text style={styles.link}>{t('header.about')}</Text>
        </Pressable>
        <Pressable onPress={onOpenInfo} style={styles.linkWrap}>
          <Text style={styles.link}>{t('header.info')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  brand: { color: '#fff', fontWeight: '700', fontSize: 18 },
  right: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  link: { color: '#fff', fontSize: 16 },
  linkWrap: { marginLeft: 8 },
  langSwitch: { paddingVertical: 4, paddingHorizontal: 8, marginRight: 4 },
});
