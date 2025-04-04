import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = ({ route }) => {
  const { theme = { background: '#F5F5F5', text: '#333333', primary: '#6200EE', card: '#FFFFFF' } } = route.params || {};
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('https://barcodescanner-8v45.onrender.com/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Fetch users error:', error.response?.data || error.message);
      alert('Failed to fetch users: ' + (error.response?.data?.message || error.message));
    }
  };

  const approveUser = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`https://barcodescanner-8v45.onrender.com/api/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh user list after approval
      alert('User approved successfully');
    } catch (error) {
      console.error('Approve user error:', error.response?.data || error.message);
      alert('Failed to approve user: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`https://barcodescanner-8v45.onrender.com/api/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh user list after deletion
      alert('User deleted successfully');
    } catch (error) {
      console.error('Delete user error:', error.response?.data || error.message);
      alert('Failed to delete user: ' + (error.response?.data?.message || error.message));
    }
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
            {!item.approved && (
              <Button title="Approve" onPress={() => approveUser(item._id)} color={theme.primary} />
            )}
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
  userCard: { 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
});

export default AdminScreen;