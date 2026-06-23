import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import RoleCard from '../components/RoleCard';
import styles from '../theme/styles';
import { saveSelectedRole } from '../services/storage';

const RoleSelectionScreen = ({ navigation }) => {
  const selectRole = async (role) => {
    await saveSelectedRole(role);
    if (role === 'FARMER') {
      navigation.navigate('FarmerRegistration');
    } else if (role === 'TRADER') {
      navigation.navigate('TraderRegistration');
    } else {
      navigation.navigate('InspectorRegistration');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.page, styles.scroll]} style={styles.screen}>
      <Text style={styles.header}>Welcome to KisanSaathi</Text>
      <Text style={styles.subHeader}>Choose your role to register and begin managing crops, trades, and inspections.</Text>
      <View style={styles.section}>
        <RoleCard icon="🌾" title="Farmer" subtitle="Sell crops directly" onPress={() => selectRole('FARMER')} />
        <RoleCard icon="🏪" title="Trader" subtitle="Buy crops from farmers" onPress={() => selectRole('TRADER')} />
        <RoleCard icon="🛡" title="Inspector" subtitle="Verify crop transactions" onPress={() => selectRole('INSPECTOR')} />
      </View>
      <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
        Already registered? Login
      </Text>
    </ScrollView>
  );
};

export default RoleSelectionScreen;
