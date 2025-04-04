import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import ThemeToggle from './src/components/ThemeToggle';
import { lightTheme, darkTheme } from './src/styles/themes';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      <AppNavigator theme={theme} /> {/* Pass theme to AppNavigator */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});