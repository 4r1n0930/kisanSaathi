import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import DashboardCard from '../components/DashboardCard';
import VoiceAssistant from '../components/VoiceAssistant';

export default function FarmerDashboardScreen({ navigation }) {
  const [voiceVisible, setVoiceVisible] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>Welcome, Farmer</Text>
          <Text style={styles.sub}>किसान साथी</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <DashboardCard title="Create Crop Listing" description="List your produce for sale" icon="🌾" onPress={() => navigation.navigate('CreateCropListing')} />
        <DashboardCard title="Market Prices" description="Check current mandi rates" icon="📈" onPress={() => navigation.navigate('MarketPrice')} />
        <DashboardCard title="My Bids" description="View bids on your crops" icon="📋" onPress={() => navigation.navigate('FarmerMyBids')} />
        <DashboardCard title="Voice Assistant" description="बोलकर काम करें" icon="🎤" onPress={() => setVoiceVisible(true)} />
      </View>

      <VoiceAssistant visible={voiceVisible} onClose={() => setVoiceVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f6fff6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  header: { fontSize: 24, fontWeight: '800', color: '#165c12' },
  sub: { fontSize: 14, color: '#4a664a', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
