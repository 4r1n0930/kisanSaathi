import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import styles from '../theme/styles';
import colors from '../theme/colors';
import { login } from '../services/auth';
import { saveSelectedRole, removeSelectedRole } from '../services/storage';

const DASHBOARD_MAP = {
  FARMER: 'FarmerDashboard',
  TRADER: 'TraderDashboard',
  INSPECTOR: 'InspectorDashboard',
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);
      const role = result?.role;
      if (role && DASHBOARD_MAP[role]) {
        await saveSelectedRole(role);
        navigation.reset({ index: 0, routes: [{ name: DASHBOARD_MAP[role] }] });
      } else {
        setError('Unknown role returned from server.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to login. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.page, styles.scroll]} style={styles.screen}>
      <Text style={styles.header}>Login</Text>
      <Text style={styles.subHeader}>Access your KisanSaathi account and continue managing crops, trade, and inspections.</Text>
      <View style={styles.section}>
        <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
        <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <PrimaryButton title={loading ? 'Signing in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <PrimaryButton
        title="Clear selected role"
        onPress={async () => {
          await removeSelectedRole();
          Alert.alert('Role cleared', 'Your selected role has been removed.');
        }}
        style={{ marginTop: 16, backgroundColor: colors.secondary }}
      />
      <Text style={styles.linkText} onPress={() => navigation.navigate('RoleSelection')}>
        Select your role and register
      </Text>
    </ScrollView>
  );
};

export default LoginScreen;
