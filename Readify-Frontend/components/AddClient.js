import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axiosInstance from './Constants/axiosInstance'; // Import Axios instance
import Layout from './Layout'; // Import Layout wrapper
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';

export default function AddClient({ navigation }) {
  const user = useRecoilValue(userAtom);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleAddClient = async () => {
    if (!name || !address || !phoneNo) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    const userId = user.userId;
    const newClient = { userId, name, address, phoneNo };

    setLoading(true); // Start loading
    try {
      const response = await axiosInstance.post('/clients', newClient);
      const data = response.data;
      if (data.message === 'Client added successfully') {
        Alert.alert('Success', 'Client added successfully!');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      Alert.alert('Error', 'Something went wrong!');
    } finally {
      setLoading(false); // Stop loading
    }

    // Clear the inputs after submission
    setName('');
    setAddress('');
    setPhoneNo('');
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.heading}>Add Client</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter client name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter client address"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter client phone number"
          keyboardType="phone-pad"
          value={phoneNo}
          onChangeText={setPhoneNo}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddClient}
          disabled={loading} // Disable the button while loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // Loading spinner
          ) : (
            <Text style={styles.buttonText}>Add Client</Text>
          )}
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  heading: {
    fontSize: 28, // Larger and more prominent
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#B22222', // Vibrant brick-red color
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333', // Darker for contrast
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 15, // Rounded corners
    paddingHorizontal: 15,
    marginBottom: 25,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  button: {
    height: 50,
    borderRadius: 25, // Pill-shaped button
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B22222', // Vibrant brick-red background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF', // White text for contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
});
