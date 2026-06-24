import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import PrimaryButton from './PrimaryButton';

export default function ConfirmDealModal({ visible, onClose, onConfirm, title, message }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title || 'Confirm Deal'}</Text>
          <Text style={styles.message}>{message || 'Are you sure?'}</Text>
          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <View style={{ width: 12 }} />
            <PrimaryButton title="Confirm" onPress={onConfirm} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  title: { fontSize: 18, fontWeight: '700', color: '#165c12', marginBottom: 8 },
  message: { fontSize: 14, color: '#4a664a', marginBottom: 20, lineHeight: 20 },
  actions: { flexDirection: 'row' },
  cancelBtn: { flex: 1, borderRadius: 16, borderWidth: 1, borderColor: '#cfe6cf', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  cancelText: { fontSize: 16, fontWeight: '700', color: '#4a664a' },
});
