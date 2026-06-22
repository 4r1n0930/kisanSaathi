import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Alert,
  StatusBar,
} from 'react-native';

interface Task {
  id: string;
  text: string;
  limit: string;
  points: number;
  duration: number;
  completed: boolean;
  isMust: boolean;
}

const App: React.FC = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [limitText, setLimitText] = useState<string>('');
  const [points, setPoints] = useState<number>(1);
  const [duration, setDuration] = useState<number>(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dayCount, setDayCount] = useState<number>(0);
  const [lastDayTaskStatus, setLastDayTaskStatus] = useState<Task[]>([]);
  const [showUndo, setShowUndo] = useState(false);

  const loadPenaltyData = async () => {
    const savedDayCount = await AsyncStorage.getItem('DAY_COUNT');
    if (savedDayCount) setDayCount(parseInt(savedDayCount, 10));
  };

  useFocusEffect(
    useCallback(() => {
      loadPenaltyData();
    }, [])
  );

  // 1. CALCULATE PENALTY (Simplified)
  const getPenalty = () => {
    let penalty = 0;
    const hasUnfinishedMust = tasks.some(t => t.isMust && !t.completed);
    if (hasUnfinishedMust) return -10;

    tasks.forEach(task => {
      if (!task.completed) {
        penalty -= task.points;
      }
    });
    return penalty;
  };

  const handleUndo = () => {
  Alert.alert(
    'Undo End Day?',
    'This will revert the last end day action.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          if (!lastDayTaskStatus || lastDayTaskStatus.length === 0){
            setTasks(prev => prev.map(task => ({ ...task, isMust: false, completed: false })));
            return;
          }

          // ✅ restore previous tasks
          setTasks([...lastDayTaskStatus]);

          // Revert day count
          if (dayCount > 0) {
            setDayCount(prev => prev - 1);
          } else {
            setDayCount(6);
          }

          // Revert history for Bank page
          const savedHistory = await AsyncStorage.getItem('PENALTY_HISTORY');
          const history = savedHistory ? JSON.parse(savedHistory) : [];
          if (history.length > 0) {
            history.pop();
            await AsyncStorage.setItem('PENALTY_HISTORY', JSON.stringify(history));
          }

          setShowUndo(false);
        },
      },
    ],
  );
  };

  // 2. END DAY (Resets status only)
  const handleEndDay = () => {
  Alert.alert(
    'End Day & Reset?',
    'This will reset completed tasks and mark unfinished ones as MUST.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          const dailyPenalty = getPenalty();
          sendWhatsAppUpdate();

          // Update day count logic
          if (dayCount < 6) {
            setDayCount(dayCount + 1);
          } else {
            setDayCount(0);
          }

          // Persist for Bank page
          const savedHistory = await AsyncStorage.getItem('PENALTY_HISTORY');
          const history = savedHistory ? JSON.parse(savedHistory) : [];
          history.push(dailyPenalty);
          await AsyncStorage.setItem('PENALTY_HISTORY', JSON.stringify(history));

          setTasks(prev => {
            // ✅ copy array (not reference)
            setLastDayTaskStatus([...prev]);

            return prev.map(task => ({
              ...task,
              isMust: !task.completed,
              completed: false,
            }));  
          });
            setShowUndo(true);
            setTimeout(() => {
            setShowUndo(false);
          }, 5 * 60 * 1000);
        },
      },
    ],
  );
  };

  const generateDailySummary = () => {
    const penalty = getPenalty();
    const mustTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    let message = `Final Penalty: ${penalty}\n\n`;
    const formatTask = (t: Task) =>
      `${t.text}${t.limit ? ` [${t.limit}]` : ''} (${t.points}pts)`;

    if (mustTasks.length > 0) {
      message += ` UNFINISHED:\n`;
      mustTasks.forEach(t => {
        message += `❗ ${formatTask(t)}\n`;
      });
      message += `\n`;
    }

    if (completedTasks.length > 0) {
      message += ` COMPLETED:\n`;
      completedTasks.forEach(t => {
        message += `✅ ${formatTask(t)}\n`;
      });
    }
    return message;
  };

  const sendWhatsAppUpdate = () => {
    const message = generateDailySummary();
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => Alert.alert('WhatsApp not installed'));
  };

  // PERSISTENCE
  useEffect(() => {
    const loadData = async () => {
      const savedTasks = await AsyncStorage.getItem('TASKS');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedDayCount = await AsyncStorage.getItem('DAY_COUNT');
      if (savedDayCount) setDayCount(parseInt(savedDayCount, 10));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    AsyncStorage.setItem('DAY_COUNT', dayCount.toString());
  }, [dayCount]);

  const addTask = () => {
    if (!inputText.trim()) return;

    // UPDATE MODE
    if (editingId) {
      setTasks(
        tasks.map(t =>
          t.id === editingId
            ? {
                ...t,
                text: inputText.trim(),
                limit: limitText.trim(),
                points: points,
                duration: duration,
              }
            : t,
        ),
      );

      setEditingId(null);
    }
    // ADD MODE
    else {
      const todayTotal = tasks.reduce((sum, t) => sum + t.points, 0);

      if (todayTotal + points > 10) {
        Alert.alert('Limit reached', 'Max 10 points allowed.');
        return;
      }

      const newTask: Task = {
        id: Date.now().toString(),
        text: inputText.trim(),
        limit: limitText.trim(),
        points: points,
        duration: duration,
        completed: false,
        isMust: false,
      };

      setTasks([...tasks, newTask]);
    }

    // RESET INPUTS
    setInputText('');
    setLimitText('');
    setPoints(1);
    setDuration(5);
    Keyboard.dismiss();
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task?.isMust && !task.completed) {
      Alert.alert('Must Task', 'Complete this before deleting.');
      return;
    }
    setTasks(tasks.filter(t => t.id !== id));
  };
  const editTask = (task: Task) => {
  if (task.isMust && !task.completed) {
    Alert.alert(
      'Must Task',
      'Complete this task before editing.'
    );
    return;
  }

  setInputText(task.text);
  setLimitText(task.limit);
  setPoints(task.points);
  setDuration(task.duration || 5);
  setEditingId(task.id);
};

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        onPress={() => toggleTask(item.id)}
      >
        {item.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.taskText,
            item.completed && styles.completedText,
            item.isMust && { color: '#d63031', fontWeight: '700' },
          ]}
        >
          {item.text}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          {item.limit ? (
            <Text style={styles.subText}>🎯 {item.limit}</Text>
          ) : null}
          <Text style={styles.pointsText}>💎 {item.points} pts</Text>
        </View>
      </View>
      <TouchableOpacity
  style={[
    styles.editButton,
    item.isMust && !item.completed && { opacity: 0.4 }
  ]}
  onPress={() => editTask(item)}
  disabled={item.isMust && !item.completed}
>
        <Text style={styles.editText}>✏️</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>The Systum</Text>
      <Text style={[styles.penaltyHeader, { color: '#F56565' }]}>
        Current Loss: {getPenalty()}
      </Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.mainInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Task Name"
          placeholderTextColor="#718096"
        />
        <TextInput
          style={styles.mainInput}
          value={limitText}
          onChangeText={setLimitText}
          placeholder="Limit (e.g., 2 hours, 5 PM)"
          placeholderTextColor="#718096"
        />
        <View style={styles.inputRow}>
          <View style={{ flex: 1, alignItems: 'center', marginRight: 10 }}>
            <Text style={{ fontSize: 10, color: '#A0AEC0', marginBottom: 2 }}>Duration</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                onPress={() => duration > 5 && setDuration(d => d - 5)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <View style={styles.stepValueBox}>
                <Text style={styles.stepValueText}>{duration}m</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDuration(d => d + 5)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', marginRight: 10 }}>
            <Text style={{ fontSize: 10, color: '#A0AEC0', marginBottom: 2 }}>Points</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                onPress={() => points > 1 && setPoints(p => p - 1)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <View style={styles.stepValueBox}>
                <Text style={styles.stepValueText}>{points}</Text>
              </View>
              <TouchableOpacity
                onPress={() => points < 10 && setPoints(p => p + 1)}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={[styles.addButton, { flex: 1 }]} onPress={addTask}>
            <Text style={styles.addButtonText}>
              {editingId ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.endDayButton} onPress={handleEndDay}>
        <Text style={styles.whiteText}>🌙 End Day</Text>
      </TouchableOpacity>
      {showUndo && (
  <TouchableOpacity style={styles.endDayButton} onPress={handleUndo}>
    <Text style={styles.whiteText}>Undo</Text>
  </TouchableOpacity>
)}

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={t => t.id}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.dayPlannerButton}
        onPress={() => navigation.navigate('DayPlanner' as never)}
      >
        <Text style={styles.whiteText}>Day Planner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bankButton}
        onPress={() => navigation.navigate('Bank' as never)}
      >
        <Text style={styles.whiteText}>The Bank</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A202C',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#E2E8F0',
  },
  penaltyHeader: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '600',
  },
  inputWrapper: { marginBottom: 20 },
  mainInput: {
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4A5568',
    marginBottom: 10,
    color: '#FFF',
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A5568',
    height: 45,
    width: '100%',
  },
  stepBtn: { paddingHorizontal: 15 },
  stepBtnText: { color: '#E2E8F0', fontSize: 18 },
  stepValueBox: { width: 30, alignItems: 'center' },
  stepValueText: { color: '#FFF' },
  addButton: {
    backgroundColor: '#4299E1',
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 45,
    justifyContent: 'center',
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ECC94B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  editText: {
    fontSize: 14,
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  endDayButton: {
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  whiteText: { color: 'white', fontWeight: 'bold' },
  list: { flex: 1 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4299E1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#4299E1' },
  checkmark: { color: 'white', fontSize: 12 },
  taskText: { fontSize: 16, fontWeight: '500', color: '#E2E8F0' },
  completedText: { textDecorationLine: 'line-through', color: '#718096' },
  subText: { fontSize: 12, color: '#A0AEC0', marginRight: 10 },
  pointsText: { fontSize: 12, color: '#4299E1', fontWeight: '600' },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F56565',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  dayPlannerButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  bankButton: {
    backgroundColor: '#F56565',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default App;
