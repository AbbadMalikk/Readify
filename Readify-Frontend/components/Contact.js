import React from 'react';
import { View, Text, StyleSheet, Image, Linking, ScrollView } from 'react-native';
import Layout from './Layout';

export default function Contact() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.page}>
        <Image
          source={require('../assets/abbad.jpg')} // Replace with your logo
          style={styles.image}
        />
        <Text style={styles.name}>Abbad Malik</Text>
        <Text style={styles.intro}>
          Pursuing a Bachelor’s in Software Engineering, I am a passionate Web Development student dedicated to advancing web technologies. I specialize in responsive web design, full-stack development, and modern frameworks like ReactJS. My goal is to innovate and contribute to the evolving world of web development.
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.contact} onPress={() => openLink('tel:+923045498151')}>
            <Text style={styles.boldText}>Phone:</Text> +92 304 5498151
          </Text>
          <Text style={styles.contact} onPress={() => openLink('mailto:abbadmalikwork@gmail.com')}>
            <Text style={styles.boldText}>Email:</Text> abbadmalikwork@gmail.com
          </Text>
          <Text style={styles.contact} onPress={() => openLink('https://www.linkedin.com/in/your-profile')}>
            <Text style={styles.boldText}>LinkedIn:</Text> linkedin.com/in/your-profile
          </Text>
          <Text style={styles.contact} onPress={() => openLink('https://github.com/your-profile')}>
            <Text style={styles.boldText}>GitHub:</Text> github.com/your-profile
          </Text>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#B22222', // Adding a border for a more polished look
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  intro: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555', // Slightly softer color for better readability
    lineHeight: 24,
  },
  section: {
    width: '100%',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: '#B22222', // Red for the section title to maintain visual consistency
  },
  contact: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    padding: 5,
    textDecorationLine: 'underline',
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black', // Making contact labels bold and black for emphasis
  },
});
