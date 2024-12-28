import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom'; // Import userAtom

export default function Layout({ children }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const setUser = useSetRecoilState(userAtom); // Set user state

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const logout = () => {
    // Clear the user state and navigate to login
    setUser(null);
    setMenuVisible(false);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/Readify.jpg')} // Replace with your logo
          style={styles.logo}
        />
        <Text style={styles.menuIcon}>READIFY</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Side Menu */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>Menu</Text>

          {/* Menu Links */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Dashboard');
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('AddClient');
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Add Client</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('ClientList');
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Client List</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('AddProduct');
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('ProductList');
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Product List</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('AddOrder');
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Add Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('OrderList');
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Order List</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Contact');
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Contact</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>

          {/* Close Menu */}
          <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Content Area */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 90,
    backgroundColor: '#B22222', // Red color applied here
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  menu: {
    flex: 1,
    backgroundColor: '#fff', // Light red background for menu
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#B22222', // Red color applied here
  },
  menuItem: {
    marginVertical: 10,
  },
  menuText: {
    fontSize: 18,
    color: '#B22222', // Red color applied here
  },
  closeButton: {
    marginTop: 30,
  },
  closeText: {
    color: '#B22222', // Red color applied here
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
});
