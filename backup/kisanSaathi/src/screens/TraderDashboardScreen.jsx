import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import DashboardCard from '../components/DashboardCard';

export default function TraderDashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Welcome, Trader</Text>
      <Text style={styles.sub}>राम सिंह</Text>

      <DashboardCard title="Find Crops" description="Search farmer listings and place bids" icon="🌾" onPress={() => navigation.navigate('SearchCrops')} />
      <DashboardCard title="Market Prices" description="Check current mandi rates" icon="📈" onPress={() => navigation.navigate('MarketPrice')} />
      <DashboardCard title="My Bids" description="Track your placed offers" icon="📋" onPress={() => navigation.navigate('MyBids')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f6fff6' },
  header: { fontSize: 22, fontWeight: '800', color: '#165c12' },
  sub: { marginBottom: 12, color: '#4a664a' },
});
