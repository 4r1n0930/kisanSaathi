import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import DashboardCard from '../components/DashboardCard';
import VoiceAssistant from '../components/VoiceAssistant';

export default function FarmerDashboardScreen({ navigation }) {
  const [voiceVisible, setVoiceVisible] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Welcome, Farmer</Text>
      <Text style={styles.sub}>किसान साथी</Text>

      <DashboardCard title="Create Crop Listing" description="List your produce for sale" icon="🌾" onPress={() => navigation.navigate('CreateCropListing')} />
      <DashboardCard title="Market Prices" description="Check current mandi rates" icon="📈" onPress={() => navigation.navigate('MarketPrice')} />
      <DashboardCard title="My Bids" description="View bids on your crops" icon="📋" onPress={() => navigation.navigate('MyBids')} />
      <DashboardCard title="Voice Assistant" description="बोलकर काम करें" icon="🎤" onPress={() => setVoiceVisible(true)} />

      <VoiceAssistant visible={voiceVisible} onClose={() => setVoiceVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f6fff6' },
  header: { fontSize: 22, fontWeight: '800', color: '#165c12' },
  sub: { marginBottom: 12, color: '#4a664a' },
});
