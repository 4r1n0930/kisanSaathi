import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import StatusBadge from '../components/StatusBadge';
import ConfirmDealModal from '../components/ConfirmDealModal';
import { selectBid } from '../services/farmer';

export default function BidDetailsScreen({ route, navigation }) {
  const bid = route.params?.bid;
  const crop = bid?.crop || {};
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDeal = async () => {
    setConfirmVisible(false);
    setLoading(true);
    try {
      const res = await selectBid(bid._id, 'demo-farmer-1');
      Alert.alert('Success', res.message || 'Deal sent to trader for confirmation');
      navigation.goBack();
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Failed';
      Alert.alert('Error', msg);
    } finally { setLoading(false); }
  };

  if (!bid) return <Text style={{ padding: 16 }}>No bid data</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {crop.images?.[0] && (
        <Image source={{ uri: crop.images[0] }} style={styles.image} />
      )}

      <Text style={styles.title}>{crop.cropName || 'Unknown Crop'}</Text>
      <StatusBadge status={bid.status} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offer Details</Text>
        <Text>Price: ₹{bid.price}/quintal</Text>
        <Text>Quantity: {bid.quantity}</Text>
        <Text>Total: ₹{Number(bid.price) * Number(bid.quantity)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crop Details</Text>
        <Text>Expected Price: ₹{crop.expectedPrice || '-'}</Text>
        <Text>Quality Grade: {crop.aiAnalysis?.qualityGrade || '-'}</Text>
        <Text>Location: {crop.location || '-'}</Text>
      </View>

      {bid.status === 'ACTIVE' && (
        <PrimaryButton
          title={loading ? 'Processing...' : 'Confirm Deal'}
          onPress={() => setConfirmVisible(true)}
          disabled={loading}
        />
      )}

      <ConfirmDealModal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDeal}
        title="Confirm Deal"
        message="Are you sure you want to select this trader offer? Other bids for this crop will be rejected."
      />
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
