import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CropCard({ item, onView, onBid }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.images?.[0] }} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.cropName}</Text>
        <Text>मात्रा: {item.quantity}</Text>
        <Text>गुणवत्ता: {item.aiAnalysis?.qualityGrade || '-'}</Text>
        <Text>प्रत्याशित: ₹{item.expectedPrice || '-'}</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity style={styles.button} onPress={onView}><Text style={styles.btnText}>View Details</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginLeft: 8 }]} onPress={onBid}><Text style={styles.btnText}>Place Bid</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginVertical: 8, alignItems: 'center' },
  image: { width: 90, height: 90, borderRadius: 6, backgroundColor: '#eee' },
  name: { fontWeight: '700', color: '#165c12' },
  button: { backgroundColor: '#2b7a0b', padding: 8, borderRadius: 6 },
  btnText: { color: '#fff' },
});
