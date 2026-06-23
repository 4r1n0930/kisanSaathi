import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../theme/styles';

const InputField = ({ label, ...textInputProps }) => {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#8b8b7f"
        style={styles.input}
        {...textInputProps}
      />
    </View>
  );
};

export default InputField;
