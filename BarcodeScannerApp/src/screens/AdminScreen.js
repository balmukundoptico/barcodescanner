import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = ({ route }) => {
  const { theme } = route.params || {};
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const approveUser = async (id) => {
    const token = await AsyncStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/admin/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    const token = await AsyncStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/admin/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Admin Dashboard</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.userCard, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text }}>{item.name} - {item.email}</Text>
            <Text style={{ color: theme.text }}>{item.approved ? 'Approved' : 'Pending'}</Text>
            {!item.approved && <Button title="Approve" onPress={() => approveUser(item._id)} color={theme.primary} />}
            <Button title="Delete" onPress={() => deleteUser(item._id)} color={theme.primary} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  userCard: { padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default AdminScreen;