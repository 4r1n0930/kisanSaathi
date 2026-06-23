import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PriceCard({ price }) {
  if (!price) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>मंडी: {price.mandiName || 'N/A'}</Text>
      <Text>₹{price.minimum} - ₹{price.maximum}</Text>
      <Text style={styles.current}>Current: ₹{price.current || price.recommended}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, backgroundColor: '#eaf7ea', borderRadius: 8, marginVertical: 8 },
  title: { fontWeight: '700', color: '#165c12', marginBottom: 6 },
  current: { marginTop: 6, fontWeight: '700' },
});
