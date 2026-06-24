import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function DashboardCard({ title, description, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0f0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 17, fontWeight: '800', color: '#165c12', textAlign: 'center', marginBottom: 6 },
  desc: { fontSize: 13, color: '#4a664a', textAlign: 'center' },
});
