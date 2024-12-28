import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../atoms/userAtom';
import axiosInstance from '../Constants/axiosInstance'; // Import Axios instance

export default function Signup({ navigation }) {
  const logo = require('../../assets/Readify.jpg');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false); // Loading state

  const handleSignup = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axiosInstance.post('/auth/signup', { email, password });
      const data = response.data;
      if (data.token) {
        setUser({
          email,
          token: data.token,
          userId: data.userId,
        });
        navigation.navigate('Login');
        alert('Signup Successful!');
      } else {
        alert('Error:', data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong!');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} />
      <Text style={styles.readifyText}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> // Display spinner while loading
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 150, // Increased size
    height: 150, // Increased size
    marginBottom: 20,
    borderRadius: 75, // Adjusted for circular shape
  },
  readifyText: {
    fontSize: 32, // Made text bigger
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20, // Increased border roundness
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  submitButton: {
    width: '100%', // Full-width button
    paddingVertical: 15, // Increased padding for bigger button
    backgroundColor: '#000', // Black background
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
});
