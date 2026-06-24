import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthStack from './navigation/AuthStack';

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthStack />
    </SafeAreaProvider>
  );
};

export default App;
