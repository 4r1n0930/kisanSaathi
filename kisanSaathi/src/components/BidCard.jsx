import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function BidCard({ bid }) {
  const cropName = bid.crop?.cropName || 'अज्ञात फसल';
  const cropImage = bid.crop?.images?.[0];

  return (
    <View style={styles.card}>
      {cropImage ? (
        <Image source={{ uri: cropImage }} style={styles.image} />
      ) : (
        <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#999' }}>कोई छवि नहीं</Text>
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{cropName}</Text>
        <Text>आपका प्रस्ताव: ₹{bid.price}</Text>
        <Text>मात्रा: {bid.quantity}</Text>
        <Text>स्थिति: {bid.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginVertical: 8, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#eee' },
  name: { fontWeight: '700', color: '#165c12' },
});
