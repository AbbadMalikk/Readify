import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import Layout from './Layout';
import axiosInstance from './Constants/axiosInstance'; 
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom'; 

export default function ProductList() {
  const user = useRecoilValue(userAtom); // Get the logged-in user
  const [products, setProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products", {
        params: { userId: user.userId }
      });
      setProducts(response.data.products); 
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleDelete = async (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axiosInstance.delete(`/products/${productId}`);
              if (response.data.message === 'Product deleted successfully') {
                setProducts((prevProducts) =>
                  prevProducts.filter((product) => product._id !== productId)
                );
                Alert.alert('Success', 'Product deleted successfully!');
              } else {
                Alert.alert('Error', 'Failed to delete product');
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Something went wrong!');
            }
          },
        },
      ]
    );
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setUpdatedName(product.product_name);
    setUpdatedPrice(product.product_price.toString());
    setUpdatedQuantity(product.product_quantity.toString());
    setModalVisible(true);
  };

  const saveUpdatedProduct = async () => {
    if (!updatedName || !updatedPrice || !updatedQuantity) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
  
    const updatedProduct = {
      product_name: updatedName,
      product_price: parseFloat(updatedPrice),
      product_quantity: parseInt(updatedQuantity, 10),
      images: selectedProduct.product_pictures 
    };
  
    try {
      const response = await axiosInstance.put(`/products/${selectedProduct._id}`, updatedProduct);
      if (response.data.message === 'Product updated successfully') {
        const updatedProducts = products.map((product) =>
          product._id === selectedProduct._id ? { ...product, ...updatedProduct } : product
        );
        setProducts(updatedProducts);
        setModalVisible(false);
        Alert.alert('Success', 'Product updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product', err);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.textAndButtons}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productDetailsText}>Price: Rs {item.product_price}</Text>
        <Text style={styles.productDetailsText}>Quantity: {item.product_quantity}</Text>
        <Text style={styles.productDetailsText}>
          Pictures: {item.product_pictures.length} attached
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditProduct(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image
        source={{ uri: item.product_pictures[0] }}
        style={styles.productImage}
      />
    </View>
  );
  

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Product List</Text>
        </View>
        {products.length === 0 ? (
          <Text style={styles.emptyText}>No products available.</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderProductItem}
          />
        )}
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeading}>Edit Product</Text>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={updatedName}
              onChangeText={setUpdatedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Product Price"
              keyboardType="numeric"
              value={updatedPrice}
              onChangeText={setUpdatedPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Product Quantity"
              keyboardType="numeric"
              value={updatedQuantity}
              onChangeText={setUpdatedQuantity}
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveUpdatedProduct}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  textAndButtons: {
    flex: 1,
    marginRight: 10, // Add space between text/buttons and the image
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetailsText: {
    fontSize: 14,
    color: '#555',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: '#B22222',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
    fontSize: 16,
    marginBottom: 15,
    paddingVertical: 8,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#B22222',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
    marginTop: 20,
  },
});