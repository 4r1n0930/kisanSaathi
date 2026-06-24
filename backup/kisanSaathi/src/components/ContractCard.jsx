import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';

export default function ContractCard({ contract, onPress }) {
  const cropName = contract.crop?.cropName || contract.cropName || 'अज्ञात';
  const cropImage = contract.crop?.images?.[0];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {cropImage ? (
        <Image source={{ uri: cropImage }} style={styles.image} />
      ) : (
        <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#999', fontSize: 11 }}>कोई छवि नहीं</Text>
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{cropName}</Text>
        <Text>₹{contract.pricePerUnit}/quintal</Text>
        <Text>मात्रा: {contract.quantity}</Text>
        <Text>कुल: ₹{contract.totalAmount}</Text>
        <StatusBadge status={contract.status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginVertical: 8, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#eee' },
  name: { fontWeight: '700', color: '#165c12', marginBottom: 4 },
});
