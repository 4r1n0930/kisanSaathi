import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MarketPriceCard({ price }) {
  if (!price) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>मंडी भाव</Text>
      <Text>न्यूनतम: ₹{price.minimum}</Text>
      <Text>अधिकतम: ₹{price.maximum}</Text>
      <Text style={styles.recommended}>सुझाव: ₹{price.recommended}</Text>
      <Text style={styles.tip}>आप अपनी कीमत ₹{price.recommended} के आसपास रख सकते हैं</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, backgroundColor: '#e8f5e9', borderRadius: 8, marginVertical: 10 },
  title: { fontWeight: '700', marginBottom: 6 },
  recommended: { fontWeight: '700', marginTop: 6 },
  tip: { marginTop: 8, color: '#2b7a0b' },
});
