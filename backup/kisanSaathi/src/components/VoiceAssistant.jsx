import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Modal, Pressable, StyleSheet, Animated, Platform, PermissionsAndroid } from 'react-native';
import Voice from '@react-native-community/voice';
import { api } from '../services/api';

export default function VoiceAssistant({ visible, onClose }) {
  const [inputText, setInputText] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!Voice) return;
    Voice.onSpeechResults = (e) => {
      const text = e.value?.[0] || '';
      setInputText((prev) => prev + text);
    };
    Voice.onSpeechError = (e) => {
      setError(e.error?.message || 'Speech recognition failed');
      setIsListening(false);
    };
    Voice.onSpeechEnd = () => setIsListening(false);

    return () => {
      try {
        Voice.destroy().then(() => Voice.removeAllListeners()).catch(() => {});
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    pulseAnim.setValue(1);
  }, [isListening]);

  const requestMicPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        { title: 'Mic Permission', message: 'KisanSaathi needs access to your microphone for voice input.', buttonPositive: 'Allow', buttonNegative: 'Deny' },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const handleMicPress = async () => {
    setError('');
    if (!Voice) {
      setError('वॉइस मॉड्यूल उपलब्ध नहीं है');
      return;
    }
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        const hasPermission = await requestMicPermission();
        if (!hasPermission) {
          setError('माइक की अनुमति आवश्यक है');
          return;
        }
        setIsListening(true);
        let available = false;
        try { available = await Voice.isAvailable(); } catch { available = true; }
        if (!available) {
          setError('वॉइस रिकॉग्निशन उपलब्ध नहीं है');
          setIsListening(false);
          return;
        }
        const locale = Platform.OS === 'android' ? 'hi-IN' : 'hi_IN';
        await Voice.start(locale);
      }
    } catch (e) {
      setError(e?.message || 'माइक शुरू नहीं हो पाया');
      setIsListening(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setReply('');
    setError('');
    const text = inputText;
    setInputText('');
    try {
      const res = await api.post('/voice/query', { text, userId: 'farmer-1' });
      setReply(res.data.reply || 'समझ नहीं आया। कृपया फिर से बोलें।');
    } catch (err) {
      setReply('सर्वर से कनेक्ट नहीं हो पाया। कृपया बाद में प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>🎤 वॉइस असिस्टेंट</Text>
          <Text style={styles.subtitle}>बोलें या टाइप करें</Text>

          <Animated.View style={[styles.micContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Pressable
              style={[styles.micButton, isListening && styles.micButtonActive]}
              onPress={handleMicPress}
            >
              <Text style={styles.micIcon}>{isListening ? '🔴' : '🎤'}</Text>
            </Pressable>
          </Animated.View>
          <Text style={styles.micLabel}>
            {isListening ? 'बोल रहा हूँ...' : error || 'माइक दबाएं'}
          </Text>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="या यहाँ टाइप करें..."
            placeholderTextColor="#999"
            multiline
          />

          {reply ? (
            <View style={styles.replyBox}>
              <Text style={styles.replyText}>{reply}</Text>
            </View>
          ) : null}

          <View style={styles.buttons}>
            <Pressable style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleSend} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'सोच रहा हूँ...' : 'भेजें'}</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.closeBtn]} onPress={onClose}>
              <Text style={styles.buttonText}>बंद करें</Text>
            </Pressable>
          </View>

          <Text style={styles.hint}>कह सकते हैं: "मुझे गेहूं बेचना है", "आज मंडी का रेट बताओ", "मेरी लिस्टिंग दिखाओ"</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { width: '90%', backgroundColor: '#fff', borderRadius: 16, padding: 24, maxHeight: '80%', marginTop: 40 },
  title: { fontSize: 20, fontWeight: '700', color: '#165c12', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#4a664a', textAlign: 'center', marginBottom: 24 },
  micContainer: { alignSelf: 'center', marginBottom: 8 },
  micButton: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#2b7a0b' },
  micButtonActive: { backgroundColor: '#ffcdd2', borderColor: '#c62828' },
  micIcon: { fontSize: 40 },
  micLabel: { textAlign: 'center', fontSize: 13, color: '#4a664a', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#cfe6cf', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#f9fff9', marginBottom: 12, minHeight: 60, textAlignVertical: 'top' },
  replyBox: { backgroundColor: '#e8f5e9', borderRadius: 10, padding: 12, marginBottom: 12 },
  replyText: { fontSize: 16, color: '#165c12', lineHeight: 22 },
  buttons: { flexDirection: 'row', gap: 10 },
  button: { flex: 1, backgroundColor: '#2b7a0b', padding: 14, borderRadius: 10, alignItems: 'center' },
  closeBtn: { backgroundColor: '#8bb08f' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  hint: { marginTop: 16, fontSize: 12, color: '#999', textAlign: 'center' },
});
