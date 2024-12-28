import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Layout from './Layout';
import axiosInstance from './Constants/axiosInstance'; // Import your Axios instance
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';

export default function ClientList() {
  const user = useRecoilValue(userAtom); // Get the logged-in user
  const [clients, setClients] = useState([]);
  const userId = user.userId
  
  useEffect(() => {
    fetchClients();
  }, [clients]);

  // Fetch clients from the server
  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get(`/clients/${user.userId}`);
      setClients(response.data.clients); // Assuming response contains clients array
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleDelete = async (clientId) => {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
             
  
              const response = await axiosInstance.delete(`/clients/${clientId}`, {
                headers: { userid: userId },
              });
              if (response.data.message === 'Client deleted successfully') {
                Alert.alert('Success', 'Client deleted successfully!');
                setClients((prevClients) =>
                  prevClients.filter((client) => client.id !== clientId)
                );
              } else {
                Alert.alert('Error', 'Failed to delete client');
              }
            } catch (error) {
              console.error('Error deleting client:', error);
              Alert.alert('Error', 'Something went wrong!');
            }
          },
        },
      ]
    );
  };
  
  

  const renderClient = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>Address: {item.address}</Text>
      <Text style={styles.details}>Phone: {item.phoneNo}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item._id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Client List</Text>
        </View>
        <FlatList
          data={clients}
          keyExtractor={(item) => item._id}
          renderItem={renderClient}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No clients available</Text>
          }
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B22222',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#B22222',
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
});