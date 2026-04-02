import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

import HomeScreen from '../screens/HomeScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AddCustomerScreen from '../screens/AddCustomerScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CustomerStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700' },
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
    </HomeStack.Navigator>
  );
}

function CustomerStackNavigator() {
  return (
    <CustomerStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <CustomerStack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={({ navigation }) => ({
          title: 'Customers',
          headerRight: () => (
            <Ionicons
              name="person-add-outline"
              size={22}
              color={COLORS.white}
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate('AddCustomer')}
            />
          ),
        })}
      />
      <CustomerStack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={({ route }) => ({ title: route.params?.customerName || 'Customer' })}
      />
      <CustomerStack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ title: 'New Transaction' }}
      />
      <CustomerStack.Screen
        name="AddCustomer"
        component={AddCustomerScreen}
        options={{ title: 'New Customer' }}
      />
    </CustomerStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Customers: focused ? 'people' : 'people-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          paddingBottom: 4,
          height: 58,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Customers" component={CustomerStackNavigator} />
    </Tab.Navigator>
  );
}
