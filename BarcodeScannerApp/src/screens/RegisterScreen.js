import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation, route }) => {
  const { theme = { background: '#F5F5F5', text: '#333333', primary: '#6200EE' } } = route.params || {};
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        companyName,
        email,
        mobile,
        password,
      });
      alert('Registration successful! Awaiting admin approval.');
      navigation.navigate('Login', { theme });
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Register</Text>
      <TextInput style={[styles.input, { borderColor: theme.primary, color: theme.text }]} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={[styles.input, { borderColor: theme.primary, color: theme.text }]} placeholder="Company Name" value={companyName} onChangeText={setCompanyName} />
      <TextInput style={[styles.input, { borderColor: theme.primary, color: theme.text }]} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={[styles.input, { borderColor: theme.primary, color: theme.text }]} placeholder="Mobile" value={mobile} onChangeText={setMobile} />
      <TextInput style={[styles.input, { borderColor: theme.primary, color: theme.text }]} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default RegisterScreen;