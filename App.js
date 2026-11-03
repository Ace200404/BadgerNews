import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import BadgerNews from './src/components/BadgerNews';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right']} style={{flex: 1}}>
        <BadgerNews />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}