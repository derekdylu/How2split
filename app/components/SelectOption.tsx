import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import { useLocale } from '../contexts/LocaleContext';

interface SelectOptionProps {
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function SelectOption({ value, options, onSelect, placeholder }: SelectOptionProps) {
  const { t } = useLocale();
  const resolvedPlaceholder = placeholder ?? t('select.placeholder');
  const [visible, setVisible] = useState(false);
  const label = value ? options.find((o) => o.value === value)?.label ?? value : resolvedPlaceholder;

  const handleSelect = (v: string) => {
    onSelect(v);
    setVisible(false);
  };

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={[styles.triggerText, !value && styles.placeholder]}>{label}</Text>
      </Pressable>
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.box}>
            <ScrollView>
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.option, opt.value === value && styles.optionSelected]}
                  onPress={() => handleSelect(opt.value)}
                >
                  <Text style={styles.optionText}>{opt.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    minWidth: 140,
  },
  triggerText: { fontSize: 16 },
  placeholder: { color: '#999' },
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
    maxHeight: 320,
    width: '100%',
    maxWidth: 320,
  },
  option: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  optionSelected: { backgroundColor: '#e6f7ff' },
  optionText: { fontSize: 16 },
});
