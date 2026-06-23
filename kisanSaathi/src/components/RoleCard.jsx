import React from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from '../theme/styles';

const RoleCard = ({ icon, title, subtitle, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 28 }}>{icon}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{subtitle}</Text>
    </Pressable>
  );
};

export default RoleCard;
