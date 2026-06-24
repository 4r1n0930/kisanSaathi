import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';

export default function BidCard({ bid, onPress }) {
  const cropName = bid.crop?.cropName || 'अज्ञात फसल';
  const cropImage = bid.crop?.images?.[0];
  const Container = onPress ? TouchableOpacity : View;
  const touchProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <Container style={styles.card} {...touchProps}>
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
        <StatusBadge status={bid.status} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginVertical: 8, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#eee' },
  name: { fontWeight: '700', color: '#165c12' },
});
