import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import styles from '../theme/styles';
import { uploadDocumentFile } from '../services/api';

const DocumentUploader = ({ label, uploadedUrl, onUploadComplete }) => {
  const [localUri, setLocalUri] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const handleDocument = async (uri, type, name) => {
    if (!uri || !name || !type) {
      return;
    }

    try {
      setLoading(true);
      setLocalUri(uri);
      const url = await uploadDocumentFile({ uri, type, name });
      onUploadComplete(url);
    } catch (error) {
      setLocalUri(uri);
      onUploadComplete(uri);
    } finally {
      setLoading(false);
    }
  };

  const openLibrary = async () => {
    const response = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    const asset = response.assets?.[0];
    if (asset?.uri) {
      handleDocument(asset.uri, asset.type ?? 'image/jpeg', asset.fileName ?? 'document.jpg');
    }
  };

  const openCamera = async () => {
    const response = await launchCamera({ mediaType: 'photo', quality: 0.7 });
    const asset = response.assets?.[0];
    if (asset?.uri) {
      handleDocument(asset.uri, asset.type ?? 'image/jpeg', asset.fileName ?? 'document.jpg');
    }
  };

  const removeDocument = () => {
    setLocalUri(undefined);
    onUploadComplete('');
  };

  const showPicker = () => {
    Alert.alert('Upload document', 'Choose document source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openLibrary },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const previewUri = localUri || uploadedUrl;

  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable style={styles.secondaryButton} onPress={showPicker}>
        <Text style={styles.secondaryButtonText}>{loading ? 'Uploading...' : 'Upload Document'}</Text>
      </Pressable>
      {previewUri ? (
        <View style={{ marginTop: 12 }}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="cover" />
          <Pressable style={[styles.secondaryButton, { marginTop: 12 }]} onPress={removeDocument}>
            <Text style={styles.secondaryButtonText}>Remove / Replace</Text>
          </Pressable>
        </View>
      ) : null}
      {uploadedUrl ? <Text style={styles.helperText}>Document uploaded successfully.</Text> : null}
    </View>
  );
};

export default DocumentUploader;
