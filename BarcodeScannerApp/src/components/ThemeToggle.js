import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Install: expo install @expo/vector-icons

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <TouchableOpacity style={styles.toggle} onPress={toggleTheme}>
      <Ionicons
        name={isDarkMode ? 'bulb' : 'bulb-outline'}
        size={30}
        color={isDarkMode ? '#FFFFFF' : '#333333'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default ThemeToggle;