import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Layout from './Layout';
import axiosInstance from './Constants/axiosInstance';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function OrderList() {
  const user = useRecoilValue(userAtom); // Get logged-in user
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation(); // Access navigation

  useEffect(() => {
    if (user?.userId) {
      fetchOrders();
    }
  }, [user,orders]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(`/orders/${user.userId}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axiosInstance.delete(`/deleteOrder/${orderId}`);
              if (response.data.message === 'Order deleted successfully') {
                setOrders((prevOrders) =>
                  prevOrders.filter((order) => order.orderId !== orderId)
                );
                Alert.alert('Success', 'Order deleted successfully!');
              } else {
                Alert.alert('Error', 'Failed to delete order');
              }
            } catch (error) {
              console.error('Error deleting order:', error);
              Alert.alert('Error', 'Something went wrong!');
            }
          },
        },
      ]
    );
  };

  const renderOrderItem = ({ item }) => {
    if (!item) return null; // Avoid rendering null items
   
    
    // Comma-separated product names
    const productNames = item.products?.map(product => product.product_name).join(', ');

    return (
      <View style={styles.card}>
        <View style={styles.textAndButtons}>
          <Text style={styles.clientName}>
            Client: {item.client?.name || 'N/A'}
          </Text>
          <Text style={styles.productDetailsText}>
            Order Date: {new Date(item.dateOfOrder).toLocaleDateString()}
          </Text>
          <Text style={styles.productDetailsText}>
            Status: {item.orderStatus || 'N/A'}
          </Text>
          <Text style={styles.productDetailsText}>
            Total Amount: Rs {item.totalAmount || 'N/A'}
          </Text>

          {/* Display product names as comma-separated */}
          <Text style={styles.productDetailsText}>
            Products: {productNames || 'N/A'}
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.generateButton} onPress={() => navigation.navigate('InvoicePage', { orderData: item })}>
              <Text style={styles.buttonText}>Generate Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Icon name="edit" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleDeleteOrder(item.orderId)}
            >
              <Icon name="trash-2" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Render Images */}
        <View style={styles.productAndImage}>
          {item.products?.map((product, index) => (
            <View key={`${product.productId || index}`} style={styles.productContainer}>
              {product.product_pictures?.[0] && (
                <Image
                  source={{ uri: product.product_pictures[0] }}
                  style={styles.productImage}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Order List</Text>
        </View>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>No orders available.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.orderId}
            renderItem={renderOrderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  header: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B22222',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 20, // Added more space from the top
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row', // Flex row for text and image
    alignItems: 'center',  // Align items in a row
  },
  textAndButtons: {
    flex: 1,
    marginRight: 10, // Add space between text and the image
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetailsText: {
    fontSize: 14,
    color: '#555',
  },
  productAndImage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  productContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginTop: 10,
    marginBottom:35,
    margin:5,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
  },
  generateButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight:10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: 'grey',
    padding: 8,
    marginRight:10,
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: '#B22222',
    padding: 8,
    marginRight:10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    color: '#777',
  },
});
