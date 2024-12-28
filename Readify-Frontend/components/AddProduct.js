import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import axiosInstance from './Constants/axiosInstance';
import Layout from './Layout';

export default function AddProduct() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state
  const user = useRecoilValue(userAtom); 

  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Permission to access the media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setImages([...images, ...selectedImages]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Something went wrong while picking the image.');
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();
    const file = {
      uri: uri,
      type: 'image/png',
      name: uri.split('/').pop(),
    };

    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('cloud_name', 'dgolvpztq');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dgolvpztq/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error('Cloudinary upload failed:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productQuantity || images.length === 0) {
      Alert.alert('Error', 'All fields must be filled');
      return;
    }

    const userId = user.userId;
    setLoading(true); // Set loading to true when starting the process
    try {
      const uploadedImages = await Promise.all(images.map((image) => uploadImageToCloudinary(image)));
      const validImages = uploadedImages.filter((image) => image !== null);
      if (validImages.length === 0) {
        Alert.alert('Error', 'No valid images uploaded.');
        setLoading(false); // Stop loading on error
        return;
      }

      const response = await axiosInstance.post('/products', {
        userId,
        product_name: productName,
        product_price: parseFloat(productPrice),
        product_quantity: parseInt(productQuantity),
        images: validImages,
      });

      if (response.data.message === 'Product added successfully') {
        Alert.alert('Success', 'Product added successfully');
        setProductName('');
        setProductPrice('');
        setProductQuantity('');
        setImages([]);
      } else {
        Alert.alert('Error', 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Something went wrong!');
    } finally {
      setLoading(false); // Stop loading once the request is completed
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Add New Product</Text>

        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={productName}
          onChangeText={setProductName}
        />

        <Text style={styles.label}>Product Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product price"
          value={productPrice}
          onChangeText={setProductPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Product Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product quantity"
          value={productQuantity}
          onChangeText={setProductQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={selectImage}>
          <Text style={styles.buttonText}>Select Images</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <ScrollView horizontal style={styles.imagePreview}>
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>
        )}
        
        <TouchableOpacity style={styles.button} onPress={handleAddProduct} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" /> // Show spinner when loading
          ) : (
            <Text style={styles.buttonText}>Add Product</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 25,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  imagePreview: {
    marginVertical: 15,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 90,
    height: 90,
    marginRight: 10,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
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
    elevation: 6,
    marginTop : 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
