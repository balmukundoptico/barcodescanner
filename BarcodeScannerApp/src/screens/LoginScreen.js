import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, route }) => {
  const { theme = { background: '#F5F5F5', text: '#333333', primary: '#6200EE' } } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleLogin = async () => {
    console.log('Attempting login with:', { email, password, role });
    try {
      const res = await axios.post('https://barcodescanner-8v45.onrender.com/api/auth/login', { email, password });
      console.log('Login response:', res.data);
      await AsyncStorage.setItem('token', res.data.token);
      if (res.data.user.role === 'admin') {
        console.log('Navigating to Admin');
        navigation.replace('Admin', { theme });
      } else {
        console.log('Navigating to Home');
        navigation.replace('Home', { theme });
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  // Rest of the code remains unchanged
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Login</Text>
      <Text style={[styles.label, { color: theme.text }]}>Login As:</Text>
      <Picker
        selectedValue={role}
        style={[styles.picker, { borderColor: theme.primary, color: theme.text }]}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color={theme.primary} />
      <Button
        title="Register"
        onPress={() => {
          console.log('Navigating to Register');
          navigation.navigate('Register', { theme });
        }}
        color={theme.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 10 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default LoginScreen;