import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Error() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>找不到頁面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { fontSize: 18 },
});
