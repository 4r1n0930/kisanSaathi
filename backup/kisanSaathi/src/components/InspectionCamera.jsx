import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';

export default function InspectionCamera({ onCapture }) {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const openCamera = async () => {
    setLoading(true);
    try {
      const response = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false,
      });

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage || 'Unable to open camera');
        return;
      }

      const asset = response.assets?.[0];
      if (asset?.uri) {
        setPhoto({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `inspection_${Date.now()}.jpg`,
          width: asset.width,
          height: asset.height,
        });
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to capture photo');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setPhoto(null);
    setTimeout(() => openCamera(), 300);
  };

  const handleConfirm = () => {
    if (photo) {
      onCapture(photo);
    }
  };

  if (!photo) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.captureButton} onPress={openCamera} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.captureText}>Capture Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.preview} resizeMode="cover" />
      <Text style={styles.hint}>Review captured image</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  captureButton: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#165c12',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a664a',
    borderStyle: 'dashed',
  },
  cameraIcon: { fontSize: 40 },
  captureText: { color: '#fff', marginTop: 8, fontWeight: '600', fontSize: 14 },
  preview: { width: '100%', height: 240, borderRadius: 12, backgroundColor: '#ddd' },
  hint: { color: '#4a664a', marginTop: 8, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 12 },
  retakeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  retakeText: { color: '#165c12', fontWeight: '700' },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#165c12',
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: '700' },
});
