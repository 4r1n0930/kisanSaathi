import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function FilterBar({ value, onChange }) {
  return (
    <View style={styles.container}>
      <TextInput placeholder="किसान/स्थान/फसल खोजें" style={styles.input} value={value} onChangeText={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e0efe0' },
});
