import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRecoilValue } from 'recoil';
import { userAtom } from './atoms/userAtom'; // Import userAtom
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import { View, Text, ActivityIndicator } from 'react-native';

// Import the components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AddClient from './components/AddClient';
import ClientList from './components/ClientList';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import AddOrder from './components/AddOrder';
import OrderList from './components/OrderList';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import InvoicePage from './components/InvoicePage';


const Drawer = createDrawerNavigator();

// Authentication Wrapper
const AuthWrapper = ({ children }) => {
    const user = useRecoilValue(userAtom);

    if (user === undefined) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    // Redirect to Login if no user is present
    if (!user?.token) {
        return <Login />;
    }

    return children;
};

export default function App() {
    return (
        <RecoilRoot>
            <NavigationContainer>
                <Drawer.Navigator
                    initialRouteName="Login"
                    screenOptions={{ headerShown: false }}
                >
                    {/* Auth Screens */}
                    <Drawer.Screen
                        name="Login"
                        component={Login}
                        options={{ drawerLabel: 'Login' }}
                    />
                    <Drawer.Screen
                        name="Signup"
                        component={Signup}
                        options={{ drawerLabel: 'Signup' }}
                    />

                    {/* Protected Routes */}
                    <Drawer.Screen
                        name="Dashboard"
                        options={{ drawerLabel: 'Dashboard' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <Dashboard />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>
                    <Drawer.Screen
                        name="AddClient"
                        options={{ drawerLabel: 'Add Client' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <AddClient />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>

                    <Drawer.Screen
                        name="ClientList"
                        options={{ drawerLabel: 'Client List' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <ClientList />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>

                    <Drawer.Screen
                        name="AddProduct"
                        options={{ drawerLabel: 'Add Product' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <AddProduct />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>

                    <Drawer.Screen
                        name="ProductList"
                        options={{ drawerLabel: 'Product List' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <ProductList />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>

                    <Drawer.Screen
                        name="AddOrder"
                        options={{ drawerLabel: 'Add Order' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <AddOrder />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>

                    <Drawer.Screen
                        name="OrderList"
                        options={{ drawerLabel: 'Order List' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <OrderList />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>

                    <Drawer.Screen
                        name="InvoicePage"
                        options={{ drawerLabel: 'Invoice Page' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <InvoicePage />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>

                    <Drawer.Screen
                        name="Contact"
                        options={{ drawerLabel: 'Contact' }}
                    >
                        {() => (
                            <AuthWrapper>
                                <Contact />
                            </AuthWrapper>
                        )}
                    </Drawer.Screen>

                  

                </Drawer.Navigator>
            </NavigationContainer>
        </RecoilRoot>
    );
}
