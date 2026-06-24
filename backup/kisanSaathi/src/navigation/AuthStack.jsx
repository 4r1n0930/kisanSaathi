import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import FarmerRegistrationScreen from '../screens/FarmerRegistrationScreen';
import TraderRegistrationScreen from '../screens/TraderRegistrationScreen';
import InspectorRegistrationScreen from '../screens/InspectorRegistrationScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateCropListingScreen from '../screens/CreateCropListingScreen';
import FarmerDashboardScreen from '../screens/FarmerDashboardScreen';
import TraderDashboardScreen from '../screens/TraderDashboardScreen';
import InspectorDashboardScreen from '../screens/InspectorDashboardScreen';
import SearchCropsScreen from '../screens/SearchCropsScreen';
import CreateBidScreen from '../screens/CreateBidScreen';
import MarketPriceScreen from '../screens/MarketPriceScreen';
import MyBidsScreen from '../screens/MyBidsScreen';
import FarmerMyBidsScreen from '../screens/FarmerMyBidsScreen';
import BidDetailsScreen from '../screens/BidDetailsScreen';
import ContractDetailsScreen from '../screens/ContractDetailsScreen';
import UploadInspectionScreen from '../screens/UploadInspectionScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="CreateCropListing" component={CreateCropListingScreen} />
        <Stack.Screen name="FarmerDashboard" component={FarmerDashboardScreen} />
        <Stack.Screen name="TraderDashboard" component={TraderDashboardScreen} />
        <Stack.Screen name="InspectorDashboard" component={InspectorDashboardScreen} />
        <Stack.Screen name="SearchCrops" component={SearchCropsScreen} />
        <Stack.Screen name="CreateBid" component={CreateBidScreen} />
        <Stack.Screen name="MarketPrice" component={MarketPriceScreen} />
        <Stack.Screen name="MyBids" component={MyBidsScreen} />
        <Stack.Screen name="FarmerRegistration" component={FarmerRegistrationScreen} />
        <Stack.Screen name="TraderRegistration" component={TraderRegistrationScreen} />
        <Stack.Screen name="InspectorRegistration" component={InspectorRegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="FarmerMyBids" component={FarmerMyBidsScreen} />
        <Stack.Screen name="BidDetails" component={BidDetailsScreen} />
        <Stack.Screen name="ContractDetails" component={ContractDetailsScreen} />
        <Stack.Screen name="UploadInspection" component={UploadInspectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
