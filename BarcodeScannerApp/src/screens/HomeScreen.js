import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route, navigation }) => {
  const { theme = { background: '#F5F5F5', text: '#333333', primary: '#6200EE', card: '#FFFFFF' } } = route.params || {};
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodes, setBarcodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('HomeScreen mounted');
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      fetchBarcodes();
    })();
  }, []);

  const fetchBarcodes = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/barcode/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBarcodes(res.data);
    } catch (error) {
      console.error('Fetch barcodes error:', error.response?.data || error.message);
      alert('Failed to fetch barcodes');
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/barcode/scan',
        { barcode: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      fetchBarcodes();
    } catch (error) {
      alert(error.response?.data?.message || 'Scan failed');
    }
  };

  const searchBarcode = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/barcode/search?barcode=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.exists ? `Barcode exists, status: ${res.data.status}` : 'Barcode does not exist');
    } catch (error) {
      alert('Search failed');
    }
  };

  const deleteBarcode = (barcode) => {
    Alert.alert(
      'Confirm Deletion',
      'Do you want to delete this barcode?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () =>
            Alert.alert(
              'Final Confirmation',
              'Do you really want to delete this barcode?',
              [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes',
                  onPress: async () => {
                    const token = await AsyncStorage.getItem('token');
                    try {
                      const res = await axios.post(
                        'http://localhost:5000/api/barcode/delete',
                        { barcode },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      alert(res.data.message);
                      fetchBarcodes();
                    } catch (error) {
                      alert('Delete failed');
                    }
                  },
                },
              ]
            ),
        },
      ]
    );
  };

  const undoDelete = async (barcode) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/barcode/undo',
        { barcode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      fetchBarcodes();
    } catch (error) {
      alert('Undo failed');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Button
          title="Allow Camera"
          onPress={async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
          color={theme.primary}
        />
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Barcode Scanner</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      {scanned && <Button title="Scan Again" onPress={() => setScanned(false)} color={theme.primary} />}
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Search Barcode"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={searchBarcode} color={theme.primary} />
      <FlatList
        data={barcodes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.barcodeItem, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text }}>{item.barcode} - {item.status}</Text>
            {item.status !== 'deleted' && (
              <Button title="Delete" onPress={() => deleteBarcode(item.barcode)} color={theme.primary} />
            )}
            {item.status === 'deleted' && (
              <Button title="Undo" onPress={() => undoDelete(item.barcode)} color={theme.primary} />
            )}
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  scanner: { height: 300, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  list: { marginTop: 20 },
  barcodeItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HomeScreen;