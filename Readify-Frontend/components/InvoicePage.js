import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing react-native-vector-icons
import * as FileSystem from 'expo-file-system';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import Layout from './Layout';
import { encode as btoa } from 'base-64';

const InvoicePage = () => {
  const { params } = useRoute();
  const { orderData } = params;
  const navigation = useNavigation();

  const handleDownloadInvoice = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const { width, height } = page.getSize();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText(`Invoice for: ${orderData.client?.name}`, { x: 50, y: height - 50, size: 18, font });
      page.drawText(`Order Date: ${new Date(orderData.dateOfOrder).toLocaleDateString()}`, { x: 50, y: height - 80, size: 12, font });
      page.drawText(`Total Amount: Rs ${orderData.totalAmount}`, { x: 50, y: height - 110, size: 12, font });
      page.drawText(`Order Status: ${orderData.orderStatus}`, { x: 50, y: height - 140, size: 12, font });

      let yPosition = height - 180;
      orderData.products.forEach((product) => {
        page.drawText(`${product.product_name} - Quantity: ${product.product_quantity} - Price: Rs ${product.product_price}`, {
          x: 50,
          y: yPosition,
          size: 12,
          font,
        });
        yPosition -= 20;
      });

      const pdfBytes = await pdfDoc.save();
      const base64Pdf = btoa(String.fromCharCode(...pdfBytes));
      const pdfPath = `${FileSystem.documentDirectory}invoice.pdf`;
      await FileSystem.writeAsStringAsync(pdfPath, base64Pdf, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert('Invoice saved successfully as PDF!', pdfPath);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      Alert.alert('Failed to download invoice');
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('OrderList')} style={styles.iconButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.Buttons} onPress={handleDownloadInvoice}>
            <Text style={styles.buttonText}>Download Invoice</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/Readify.jpg')}
            style={styles.logo}
          />
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Client Name: </Text>
            {orderData.client?.name}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Address: </Text>
            {orderData.client?.address}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Phone: </Text>
            {orderData.client?.phoneNo}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Order Date: </Text>
            {new Date(orderData.dateOfOrder).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.productTable}>
          <Text style={styles.sectionTitle}>Products</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Image</Text>
            <Text style={styles.tableHeaderText}>Product</Text>
            <Text style={styles.tableHeaderText}>Price</Text>
            <Text style={styles.tableHeaderText}>Quantity</Text>
          </View>
          {orderData.products.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Image source={{ uri: product.product_pictures[0] }} style={styles.productImage} />
              <Text style={styles.tableRowText}>{product.product_name}</Text>
              <Text style={styles.tableRowText}>Rs {product.product_price}</Text>
              <Text style={styles.tableRowText}>{product.product_quantity}</Text>
            </View>
          ))}
        </View>
        <View style={styles.totalAmountSection}>
          <Text style={styles.totalAmountText}>Total Amount: Rs {orderData.totalAmount}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2024 Readify</Text>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: '#B22222',
    padding: 8,
    borderRadius: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop:20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  productTable: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  Buttons: {
    backgroundColor: '#B22222',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableRowText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  productImage: {
    flex: 1,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  totalAmountSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
});

export default InvoicePage;
