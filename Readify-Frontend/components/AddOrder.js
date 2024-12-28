import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator, // Import ActivityIndicator for loader
} from 'react-native';
import Layout from './Layout';
import axiosInstance from './Constants/axiosInstance';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import { Picker } from '@react-native-picker/picker';

export default function AddOrder() {
  const user = useRecoilValue(userAtom);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await axiosInstance.get(`/getClients/${user.userId}`);
        const productResponse = await axiosInstance.get(`/getProducts/${user.userId}`);
        setClients(clientResponse.data || []);
        setProducts(productResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error.message || error);
        Alert.alert('Error', 'Failed to fetch data. Please try again later.');
      }
    };

    if (user?.userId) fetchData();
  }, [user.userId,clients,products]);

  const handleAddProduct = () => {
    const product = products.find((p) => p._id === selectedProduct);
    const totalPrice = product.product_price * quantity;

    setOrderItems([
      ...orderItems,
      {
        productId: product._id,
        product_name: product.product_name,
        price: product.product_price,
        quantity,
        totalPrice,
      },
    ]);
    setTotalAmount(totalAmount + totalPrice);
    setSelectedProduct('');
    setQuantity(1);
  };

  const handlePlaceOrder = async () => {
    if (!selectedClient) {
      Alert.alert('Error', 'Please select a client before placing the order.');
      return;
    }

    setLoading(true); // Start loading

    try {
      const orderData = {
        userId: user.userId,
        clientId: selectedClient,
        products: orderItems,
        totalAmount,
      };

      const response = await axiosInstance.post('/addOrder', orderData);
      if (response.status === 200) {
        Alert.alert('Success', 'Order placed successfully!');
      }
    } catch (error) {
      console.error('Error placing order:', error.message);
      Alert.alert('Error', 'Failed to place order. Please try again later.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.heading}>Add Order</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Client</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedClient}
              onValueChange={(itemValue) => setSelectedClient(itemValue)}
            >
              <Picker.Item label="Select Client" value="" />
              {clients.map((client) => (
                <Picker.Item key={client._id} label={client.name} value={client._id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Product</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedProduct}
              onValueChange={(itemValue) => setSelectedProduct(itemValue)}
            >
              <Picker.Item label="Select Product" value="" />
              {products.map((product) => (
                <Picker.Item
                  key={product._id}
                  label={product.product_name}
                  value={product._id}
                />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="numeric"
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(Number(text))}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subHeading}>Order Items</Text>
        <FlatList
          data={orderItems}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>
                {item.product_name} - {item.quantity} x Rs {item.price} = Rs {item.totalPrice}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.totalAmount}>Total Amount: Rs {totalAmount}</Text>

        {/* Show loader while placing order */}
        <TouchableOpacity
          style={styles.button}
          onPress={handlePlaceOrder}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" /> // Show loader
          ) : (
            <Text style={styles.buttonText}>Place Order</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#B22222',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 15,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B22222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orderItem: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 5,
  },
  orderText: {
    fontSize: 16,
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#B22222',
  },
});
