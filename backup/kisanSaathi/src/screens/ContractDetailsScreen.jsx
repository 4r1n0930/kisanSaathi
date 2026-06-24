import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import StatusBadge from '../components/StatusBadge';
import { acceptContract, rejectContract } from '../services/trader';

export default function ContractDetailsScreen({ route, navigation }) {
  const contract = route.params?.contract;
  const crop = contract?.crop || {};
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await acceptContract(contract._id, 'demo');
      Alert.alert('Success', res.message || 'Contract confirmed');
      navigation.goBack();
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Failed';
      Alert.alert('Error', msg);
    } finally { setLoading(false); }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const res = await rejectContract(contract._id, 'demo');
      Alert.alert('Rejected', res.message || 'Deal rejected');
      navigation.goBack();
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Failed';
      Alert.alert('Error', msg);
    } finally { setLoading(false); }
  };

  if (!contract) return <Text style={{ padding: 16 }}>No contract data</Text>;

  const isPending = contract.status === 'PENDING_TRADER';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {crop.images?.[0] && (
        <Image source={{ uri: crop.images[0] }} style={styles.image} />
      )}

      <Text style={styles.title}>{crop.cropName || 'Unknown Crop'}</Text>
      <StatusBadge status={contract.status} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contract Details</Text>
        <Text>Price: ₹{contract.pricePerUnit}/quintal</Text>
        <Text>Quantity: {contract.quantity}</Text>
        <Text>Total Amount: ₹{contract.totalAmount}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crop Info</Text>
        <Text>Expected Price: ₹{crop.expectedPrice || '-'}</Text>
        <Text>Quality Grade: {crop.aiAnalysis?.qualityGrade || '-'}</Text>
        <Text>Location: {crop.location || '-'}</Text>
      </View>

      {isPending && (
        <View style={{ marginTop: 20 }}>
          <PrimaryButton
            title={loading ? 'Processing...' : 'Accept Deal'}
            onPress={handleAccept}
            disabled={loading}
            style={{ marginBottom: 12 }}
          />
          <PrimaryButton
            title="Reject Deal"
            onPress={handleReject}
            disabled={loading}
            style={{ backgroundColor: '#b02a2a' }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f6fff6', flex: 1 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12, backgroundColor: '#eee' },
  title: { fontSize: 22, fontWeight: '800', color: '#165c12', marginBottom: 8 },
  section: { marginTop: 16, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#165c12', marginBottom: 8 },
});
