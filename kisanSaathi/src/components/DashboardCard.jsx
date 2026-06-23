import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function DashboardCard({ title, description, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f6fff6', borderRadius: 10, marginVertical: 8 },
  icon: { fontSize: 28, marginRight: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#165c12' },
  desc: { color: '#4a664a', marginTop: 4 },
});
