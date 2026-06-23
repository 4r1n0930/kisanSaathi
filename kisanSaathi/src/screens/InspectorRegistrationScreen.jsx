import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import DocumentUploader from '../components/DocumentUploader';
import styles from '../theme/styles';
import { registerInspector } from '../services/auth';

const InspectorRegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [identityType, setIdentityType] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async () => {
    setError('');

    if (!name || !phone || !email || !password || !identityType || !identityNumber || !documentUrl) {
      setError('Please fill all fields and upload the identity document.');
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
      await registerInspector({
        name,
        phone,
        email,
        password,
        role: 'INSPECTOR',
        identityType,
        identityNumber,
        documents: [documentUrl],
      });
      Alert.alert('Success', 'Inspector account created successfully. Please login.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to register. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.page}>
              <View>
                <Text style={styles.header}>Inspector Registration</Text>
                <Text style={styles.subHeader}>Verify identity documents and join the inspection network.</Text>
                <View style={styles.section}>
                  <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Enter full name" />
                  <InputField label="Mobile" value={phone} onChangeText={setPhone} placeholder="Enter mobile number" keyboardType="phone-pad" />
                  <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
                  <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
                  <InputField label="Identity Type" value={identityType} onChangeText={setIdentityType} placeholder="Enter identity type" />
                  <InputField label="Identity Number" value={identityNumber} onChangeText={setIdentityNumber} placeholder="Enter identity number" />
                  <DocumentUploader label="Upload Identity Document" uploadedUrl={documentUrl} onUploadComplete={setDocumentUrl} />
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
              </View>
              <View>
                <PrimaryButton title={loading ? 'Registering...' : 'Register as Inspector'} onPress={handleRegister} disabled={loading} />
                <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
                  Already registered? Login
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default InspectorRegistrationScreen;
