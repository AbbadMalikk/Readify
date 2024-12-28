import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import axiosInstance from './Constants/axiosInstance';
import Layout from './Layout'; // Import Layout wrapper

const Dashboard = () => {
  const user = useRecoilValue(userAtom);
  const [clientsCount, setClientsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  console.log("user in dashboard", user);

  useEffect(() => {
    if (user?.userId) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const clientsResponse = await axiosInstance.get(`/getClients/${user.userId}`);
      const ordersResponse = await axiosInstance.get(`/orders/${user.userId}`);

      setClientsCount(clientsResponse.data.length || 0);
      setOrdersCount(ordersResponse.data.orders.length || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {user?.name || 'User'}!</Text>

        <Text style={styles.chartTitle}>Overview</Text>
        <BarChart
          data={{
            labels: ['Orders', 'Clients'],
            datasets: [
              {
                data: [ordersCount, clientsCount],
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#6e0808',
            backgroundGradientTo: '#ad2d2d',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={styles.chart}
        />
        <Text style={styles.motivationText}>
          Great work so far! Keep pushing forward and achieving your goals. Your dedication and effort will lead to even greater success!
        </Text>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: 'center',
  },
  motivationText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
});

export default Dashboard;
