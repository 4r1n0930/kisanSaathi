import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import PrimaryButton from './PrimaryButton';

export default function CropCamera({ onChange }) {
  const [images, setImages] = useState([]);

  const takePhoto = async () => {
    const result = await launchCamera({ mediaType: 'photo', cameraType: 'back', saveToPhotos: false });
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const next = [...images, { uri: asset.uri || '', fileName: asset.fileName, type: asset.type }];
      setImages(next);
      onChange(next);
    }
  };

  const removeImage = (index) => {
    const next = images.filter((_, i) => i !== index);
    setImages(next);
    onChange(next);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <PrimaryButton onPress={takePhoto} title={'📷  फसल की फोटो लें'} />

      <ScrollView horizontal style={{ marginTop: 10 }}>
        {images.map((img, idx) => (
          <View key={idx} style={styles.preview}>
            <Image source={{ uri: img.uri }} style={styles.image} />
            <TouchableOpacity onPress={() => removeImage(idx)} style={styles.retake}>
              <Text style={{ color: '#fff' }}>Retake</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { width: 140, height: 140, marginRight: 10, position: 'relative' },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  retake: { position: 'absolute', bottom: 6, right: 6, backgroundColor: '#2b7a0b', padding: 6, borderRadius: 6 },
});
