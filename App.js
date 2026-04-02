import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/db/database';
import { COLORS } from './src/utils/constants';
import { fonts } from './src/theme/typography';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    initDB()
      .then(() => setDbReady(true))
      .catch((e) => {
        console.error('DB init failed:', e);
        setError(e.message);
      });
  }, []);

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: COLORS.danger, fontSize: 15 }}>
          Failed to initialise database: {error}
        </Text>
      </View>
    );
  }

  if (!dbReady || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Duka Credit...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});
