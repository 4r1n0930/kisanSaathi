import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { createBid } from '../services/trader';

export default function CreateBidScreen({ route, navigation }) {
  const crop = route.params?.crop;
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const submit = async () => {
    if (!price || !quantity) return Alert.alert('कृपया सभी फील्ड भरें');
    try {
      await createBid({ cropId: crop._id, price: Number(price), quantity, traderId: 'demo' });
      Alert.alert('बोली सबमिट की गई');
      navigation.goBack();
    } catch (e) { Alert.alert('त्रुटि', e.message || 'Failed'); }
  };

  return (
    <View style={{ padding: 16, backgroundColor: '#f6fff6', flex: 1 }}>
      <Text style={styles.title}>{crop.cropName}</Text>
      <Text>किसान की अपेक्षित कीमत: ₹{crop.expectedPrice}</Text>
      <Text>गुणवत्ता: {crop.aiAnalysis?.qualityGrade}</Text>

      <TextInput placeholder="₹ प्रति क्विंटल" style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="क्रय मात्रा" style={styles.input} value={quantity} onChangeText={setQuantity} />

      <PrimaryButton title="Submit Bid" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({ title: { fontSize: 18, fontWeight: '700', color: '#165c12', marginBottom: 8 }, input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginVertical: 8 } });
