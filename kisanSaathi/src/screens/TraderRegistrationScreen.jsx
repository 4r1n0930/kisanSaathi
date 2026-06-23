import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import DocumentUploader from '../components/DocumentUploader';
import styles from '../theme/styles';
import { registerTrader } from '../services/auth';

const TraderRegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [panUrl, setPanUrl] = useState('');
  const [licenseUrl, setLicenseUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async () => {
    setError('');

    if (!name || !phone || !email || !password || !businessName || !panNumber || !licenseNumber || !panUrl || !licenseUrl) {
      setError('Please fill all fields and upload PAN and license documents.');
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

    try {
      setLoading(true);
      await registerTrader({
        name,
        phone,
        email,
        password,
        role: 'TRADER',
        panNumber,
        licenseNumber,
        businessName,
        documents: [panUrl, licenseUrl],
      });
      Alert.alert('Success', 'Trader account created successfully. Please login.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
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
                <Text style={styles.header}>Trader Registration</Text>
                <Text style={styles.subHeader}>Register your trading account to manage PAN and license documents easily.</Text>
                <View style={styles.section}>
                  <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Enter full name" />
                  <InputField label="Mobile" value={phone} onChangeText={setPhone} placeholder="Enter mobile number" keyboardType="phone-pad" />
                  <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
                  <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
                  <InputField label="Business Name" value={businessName} onChangeText={setBusinessName} placeholder="Enter business name" />
                  <InputField label="PAN Number" value={panNumber} onChangeText={setPanNumber} placeholder="Enter PAN number" />
                  <InputField label="Trading License Number" value={licenseNumber} onChangeText={setLicenseNumber} placeholder="Enter license number" />
                  <DocumentUploader label="Upload PAN Card" uploadedUrl={panUrl} onUploadComplete={setPanUrl} />
                  <DocumentUploader label="Upload License Document" uploadedUrl={licenseUrl} onUploadComplete={setLicenseUrl} />
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
              </View>
              <View>
                <PrimaryButton title={loading ? 'Registering...' : 'Register as Trader'} onPress={handleRegister} disabled={loading} />
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

export default TraderRegistrationScreen;
