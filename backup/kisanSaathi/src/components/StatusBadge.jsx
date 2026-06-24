import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const STATUS_COLORS = {
  ACTIVE: { bg: '#e3f2e9', text: '#2f7d3f' },
  SELECTED: { bg: '#fff3e0', text: '#e65100' },
  PENDING_TRADER: { bg: '#fff3e0', text: '#e65100' },
  ACCEPTED: { bg: '#e8f5e9', text: '#1b5e20' },
  REJECTED: { bg: '#fce4ec', text: '#c62828' },
  CANCELLED: { bg: '#f5f5f5', text: '#616161' },
};

const STATUS_LABELS = {
  ACTIVE: 'Active',
  SELECTED: 'Selected',
  PENDING_TRADER: 'Awaiting Trader',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#f5f5f5', text: '#616161' };
  const label = STATUS_LABELS[status] || status;

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '700' },
});
