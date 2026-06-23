import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import DocumentUploader from '../components/DocumentUploader';
import styles from '../theme/styles';
import { registerFarmer } from '../services/auth';

const FarmerRegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kisanId, setKisanId] = useState('');
  const [village, setVillage] = useState('');
  const [location, setLocation] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async () => {
    setError('');

    if (!name || !phone || !email || !password || !kisanId || !village || !location || !documentUrl) {
      setError('Please fill all fields and upload the Kisan document.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    const locationParts = location.split(',').map((part) => part.trim());
    if (locationParts.length !== 2 || Number.isNaN(Number(locationParts[0])) || Number.isNaN(Number(locationParts[1]))) {
      setError('Location must be entered as latitude,longitude.');
      return;
    }

    try {
      setLoading(true);
      await registerFarmer({
        name,
        phone,
        email,
        password,
        role: 'FARMER',
        kisanId,
        village,
        location: {
          latitude: Number(locationParts[0]),
          longitude: Number(locationParts[1]),
        },
        documents: [documentUrl],
      });
      Alert.alert('Success', 'Registration completed. Please login.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to register. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.page}>
              <View>
                <Text style={styles.header}>Farmer Registration</Text>
                <Text style={styles.subHeader}>Create your farmer account to upload produce and documents with ease.</Text>
                <View style={styles.section}>
                  <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Enter full name" />
                  <InputField label="Mobile Number" value={phone} onChangeText={setPhone} placeholder="Enter mobile number" keyboardType="phone-pad" />
                  <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
                  <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
                  <InputField label="Kisan Pehchan Patra Number" value={kisanId} onChangeText={setKisanId} placeholder="Enter Kisan ID" />
                  <InputField label="Village" value={village} onChangeText={setVillage} placeholder="Enter village name" />
                  <InputField label="Location" value={location} onChangeText={setLocation} placeholder="Enter latitude,longitude" />
                  <DocumentUploader label="Upload Kisan Document" uploadedUrl={documentUrl} onUploadComplete={setDocumentUrl} />
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
              </View>
              <View>
                <PrimaryButton title={loading ? 'Registering...' : 'Register as Farmer'} onPress={handleRegister} disabled={loading} />
                <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
                  Already registered? Login
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FarmerRegistrationScreen;
