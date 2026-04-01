import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AddCustomerScreen from '../screens/AddCustomerScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CustomerStack = createStackNavigator();

const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: '#FFF',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
    }}
  >
    <HomeStack.Screen
      name="Dashboard"
      component={HomeScreen}
      options={{ title: 'Duka Credit' }}
    />
    <HomeStack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ title: 'New Transaction' }}
    />
    <HomeStack.Screen
      name="CustomerDetail"
      component={CustomerDetailScreen}
      options={({ route }) => ({ title: route.params?.customerName || 'Customer' })}
    />
  </HomeStack.Navigator>
);

const CustomerStackNavigator = () => (
  <CustomerStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: '#FFF',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
    }}
  >
    <CustomerStack.Screen
      name="CustomerList"
      component={CustomerListScreen}
      options={{ title: 'Customers' }}
    />
    <CustomerStack.Screen
      name="CustomerDetail"
      component={CustomerDetailScreen}
      options={({ route }) => ({ title: route.params?.customerName || 'Customer' })}
    />
    <CustomerStack.Screen
      name="AddCustomer"
      component={AddCustomerScreen}
      options={{ title: 'Add Customer' }}
    />
    <CustomerStack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ title: 'New Transaction' }}
    />
  </CustomerStack.Navigator>
);

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarStyle: {
        backgroundColor: '#FFF',
        borderTopColor: COLORS.border,
        paddingBottom: 4,
        paddingTop: 4,
        height: 60,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Customers') {
          iconName = focused ? 'people' : 'people-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Customers" component={CustomerStackNavigator} />
  </Tab.Navigator>
);

export default AppNavigator;
