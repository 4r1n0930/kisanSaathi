import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import CropCamera from '../components/CropCamera';
import PrimaryButton from '../components/PrimaryButton';
import MarketPriceCard from '../components/MarketPriceCard';
import { uploadCropImages, createCropListing, getCropMetadata } from '../services/api';

export default function CreateCropListingScreen({ navigation }) {
  const [cropOptions, setCropOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [marketPrice, setMarketPrice] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const crops = await getCropMetadata();
        setCropOptions(crops);
        if (crops.length > 0) setCropName(crops[0].name);
      } catch (e) {
        setCropOptions([{ name: 'Wheat', hindiName: 'गेहूं' }]);
        setCropName('Wheat');
      }
      try {
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            setLocation(`${pos.coords.latitude},${pos.coords.longitude}`);
          });
        }
      } catch (e) {
      }
    })();
  }, []);

  const handleImagesChange = (imgs) => setImages(imgs);

  const handleUploadAndAnalyze = async () => {
    if (images.length === 0) return Alert.alert('कम से कम एक फोटो जोड़ें');
    if (!quantity) return Alert.alert('कृपया मात्रा दर्ज करें');

    setUploading(true);
    try {
      const files = images.map((im, idx) => ({ uri: im.uri, type: 'image/jpeg', name: `crop_${idx}.jpg` }));
      const urls = await uploadCropImages(files);

      const payload = {
        farmerId: 'demo-farmer-1',
        cropName,
        quantity,
        images: urls,
        location,
        expectedPrice: expectedPrice ? Number(expectedPrice) : undefined,
      };

      const listing = await createCropListing(payload);
      setAiResult(listing.aiAnalysis);
      setMarketPrice(listing.marketPrice);
      if (listing.marketPrice?.recommended) setExpectedPrice(String(listing.marketPrice.recommended));

      Alert.alert('लिस्टिंग बनाई गई', 'आपकी लिस्टिंग सफलतापूर्वक बनी।');
    } catch (err) {
      Alert.alert('त्रुटि', err.message || 'कुछ गलत हुआ');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>फसल लिस्टिंग बनाएं</Text>

      <CropCamera onChange={handleImagesChange} />

      <Text>फसल चुनें</Text>
      <View style={{ flexDirection: 'row', marginVertical: 8 }}>
        {cropOptions.map((c) => (
          <PrimaryButton key={c.name} title={c.hindiName || c.name} onPress={() => setCropName(c.name)} />
        ))}
      </View>

      <Text>मात्रा (उदाहरण: 50 quintal)</Text>
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="50 quintal" />

      <Text>स्थान</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="स्थान" />

      {marketPrice && <MarketPriceCard price={marketPrice} />}

      <Text>अपेक्षित कीमत (₹/quintal)</Text>
      <TextInput style={styles.input} value={expectedPrice} onChangeText={setExpectedPrice} keyboardType="numeric" />

      <PrimaryButton title={uploading ? 'प्रक्रिया...' : 'अपलोड और मूल्यांकन'} onPress={handleUploadAndAnalyze} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f6fff6' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#165c12' },
  input: { borderWidth: 1, borderColor: '#cfe6cf', padding: 10, borderRadius: 6, marginVertical: 8, backgroundColor: '#fff' },
});
