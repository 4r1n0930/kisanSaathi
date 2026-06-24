import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import DashboardCard from '../components/DashboardCard';

export default function InspectorDashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Welcome, Inspector</Text>
      <Text style={styles.sub}>निरीक्षक</Text>

      <DashboardCard title="New Inspection" description="Capture verification photos with camera" icon="📷" onPress={() => navigation.navigate('UploadInspection')} />
      <DashboardCard title="Market Prices" description="Check current mandi rates" icon="📈" onPress={() => navigation.navigate('MarketPrice')} />
      <DashboardCard title="Reports" description="View inspection reports" icon="📄" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f6fff6' },
  header: { fontSize: 22, fontWeight: '800', color: '#165c12' },
  sub: { marginBottom: 12, color: '#4a664a' },
});
