import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  onOpenInfo: () => void;
}

export function Header({ onOpenInfo }: HeaderProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Create')}>
        <Text style={styles.brand}>How2split</Text>
      </Pressable>
      <View style={styles.right}>
        <Pressable onPress={() => navigation.navigate('About')}>
          <Text style={styles.link}>關於</Text>
        </Pressable>
        <Pressable onPress={onOpenInfo} style={styles.linkWrap}>
          <Text style={styles.link}>說明</Text>
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
  right: { flexDirection: 'row', gap: 16 },
  link: { color: '#fff', fontSize: 16 },
  linkWrap: { marginLeft: 8 },
});
