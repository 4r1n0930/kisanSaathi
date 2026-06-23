import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_ROLE_KEY = 'selectedRole';

export async function saveSelectedRole(role) {
  await AsyncStorage.setItem(SELECTED_ROLE_KEY, role);
}

export async function getSelectedRole() {
  return AsyncStorage.getItem(SELECTED_ROLE_KEY);
}

export async function removeSelectedRole() {
  await AsyncStorage.removeItem(SELECTED_ROLE_KEY);
}
