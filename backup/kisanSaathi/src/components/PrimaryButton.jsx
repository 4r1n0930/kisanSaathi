import React from 'react';
import { Pressable, Text } from 'react-native';
import styles from '../theme/styles';

const PrimaryButton = ({ title, onPress, disabled, style }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style, disabled ? { opacity: 0.6 } : undefined]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

export default PrimaryButton;
