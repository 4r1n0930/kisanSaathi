import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import InspectionCamera from '../components/InspectionCamera';
import { uploadInspectionPhoto, analyzeCropImage, submitInspectionReport } from '../services/inspector';

const SECTIONS = [
  { step: 1, label: 'AI CROP QUALITY INSPECTION', sub: 'Capture crop/grain for AI analysis', icon: '🌾', key: 'cropPhoto' },
  { step: 2, label: 'LOADED VEHICLE VERIFICATION', sub: 'Capture the transport vehicle fully loaded', icon: '🚛', key: 'vehiclePhoto' },
  { step: 3, label: 'PAYMENT VERIFICATION', sub: 'Capture payment proof screenshot', icon: '💰', key: 'paymentScreenshot' },
];

export default function UploadInspectionScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState({ vehiclePhoto: null, cropPhoto: null, paymentScreenshot: null });
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);

  const allCaptured = !!(photos.vehiclePhoto && photos.cropPhoto && photos.paymentScreenshot);

  useEffect(() => {
    const timer = setTimeout(() => setCameraKey(prev => prev + 1), 400);
    return () => clearTimeout(timer);
  }, [step]);

  const handleCapture = async (sectionKey, file) => {
    setLoading(prev => ({ ...prev, [sectionKey]: true }));
    try {
      const url = await uploadInspectionPhoto(file);
      setPhotos(prev => ({ ...prev, [sectionKey]: { file, url } }));

      if (sectionKey === 'cropPhoto') {
        setLoading(prev => ({ ...prev, analyzing: true }));
        try {
          const result = await analyzeCropImage(url);
          setAiResult(result);
        } catch {
          setAiResult({ qualityGrade: 'N/A', qualityScore: 0, issues: ['Analysis failed'] });
        } finally {
          setLoading(prev => ({ ...prev, analyzing: false }));
        }
      }

      if (step < 3) {
        setStep(prev => prev + 1);
      }
    } catch (err) {
      Alert.alert('Upload Error', err?.message || 'Failed to upload photo');
    } finally {
      setLoading(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!allCaptured) {
      Alert.alert('Incomplete', 'Please capture all verification photos before submitting');
      return;
    }

    setSubmitting(true);
    try {
      await submitInspectionReport({
        inspectorId: 'demo-inspector-1',
        vehiclePhoto: photos.vehiclePhoto.url,
        cropPhoto: photos.cropPhoto.url,
        paymentScreenshot: photos.paymentScreenshot.url,
        aiAnalysis: aiResult || undefined,
      });
      Alert.alert('Success', 'Inspection report submitted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSection = (section) => {
    const photo = photos[section.key];
    const isActive = step === section.step;
    const isCompleted = !!photo;
    const isUploading = loading[section.key];

    return (
      <View key={section.step} style={[styles.section, isActive && styles.sectionActive, isCompleted && styles.sectionDone]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.stepCircle, isCompleted && styles.stepCircleDone, isActive && styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, (isCompleted || isActive) && styles.stepNumberLight]}>
              {isCompleted ? '✓' : section.step}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.sectionIcon}>{section.icon}  {section.label}</Text>
            <Text style={styles.sectionSub}>{section.sub}</Text>
            {isUploading && <Text style={styles.statusText}>Uploading...</Text>}
            {isCompleted && !isUploading && <Text style={styles.statusText}>✅ Captured & uploaded</Text>}
          </View>
        </View>

        {isActive && !isCompleted && (
          <View style={styles.cameraWrap}>
            <InspectionCamera key={cameraKey} onCapture={(file) => handleCapture(section.key, file)} />
          </View>
        )}

        {isCompleted && photo?.file?.uri && (
          <View style={styles.lockedRow}>
            <Image source={{ uri: photo.file.uri }} style={styles.thumb} resizeMode="cover" />
            <Text style={styles.lockedLabel}>🔒 Locked</Text>
          </View>
        )}

        {section.key === 'cropPhoto' && isCompleted && (
          <View style={styles.aiBox}>
            {loading.analyzing ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color="#165c12" />
                <Text style={{ color: '#4a664a' }}>AI analysis in progress...</Text>
              </View>
            ) : aiResult ? (
              <View>
                <Text style={styles.aiTitle}>AI Crop Quality Result</Text>
                <Text style={styles.aiLine}>Grade: {aiResult.qualityGrade || 'N/A'}</Text>
                <Text style={styles.aiLine}>Score: {aiResult.qualityScore ?? 'N/A'}/100</Text>
                {aiResult.issues?.length > 0 && (
                  <Text style={styles.aiLine}>Issues: {aiResult.issues.join(', ')}</Text>
                )}
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      <Text style={styles.header}>Upload Inspection</Text>
      <Text style={styles.subHeader}>Capture all verification evidence using camera only</Text>

      {SECTIONS.map(renderSection)}

      <TouchableOpacity
        style={[styles.submitBtn, !allCaptured && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={!allCaptured || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Inspection Report</Text>
        )}
      </TouchableOpacity>

      {!allCaptured && <Text style={styles.hint}>Please capture all verification photos before submitting</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fff6' },
  header: { fontSize: 22, fontWeight: '800', color: '#165c12' },
  subHeader: { fontSize: 13, color: '#4a664a', marginBottom: 16, marginTop: 4 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionActive: { borderColor: '#165c12', borderWidth: 2 },
  sectionDone: { borderColor: '#4a664a', opacity: 0.85 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: { backgroundColor: '#165c12' },
  stepCircleDone: { backgroundColor: '#2e7d32' },
  stepNumber: { fontWeight: '700', color: '#165c12', fontSize: 14 },
  stepNumberLight: { color: '#fff' },
  sectionIcon: { fontSize: 15, fontWeight: '700', color: '#165c12' },
  sectionSub: { fontSize: 12, color: '#666', marginTop: 1 },
  statusText: { fontSize: 12, color: '#2e7d32', marginTop: 2, fontWeight: '600' },
  cameraWrap: { marginTop: 14 },
  lockedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 },
  thumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
  lockedLabel: { fontSize: 12, color: '#4a664a', fontWeight: '600' },
  aiBox: {
    marginTop: 10,
    backgroundColor: '#f0faf0',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#165c12',
  },
  aiTitle: { fontWeight: '700', color: '#165c12', fontSize: 13, marginBottom: 4 },
  aiLine: { fontSize: 12, color: '#333', lineHeight: 18 },
  submitBtn: {
    backgroundColor: '#165c12',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  submitDisabled: { backgroundColor: '#a0bca0' },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  hint: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 8 },
});
