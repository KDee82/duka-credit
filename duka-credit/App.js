import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { initDB } from './src/db/database';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        setReady(true);
      } catch (e) {
        console.error('DB init failed:', e);
        setError(e.message);
      }
    };
    setup();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to start database</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.appName}>Duka Credit</Text>
        <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  logo: { fontSize: 64 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginTop: 12 },
  errorText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
  errorDetail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8, textAlign: 'center', paddingHorizontal: 20 },
});
