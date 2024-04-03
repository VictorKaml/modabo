// App.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LoginScreen from '../signin/SignInScreen'
import SplashScreen from '../splash/SplashScreen'
import TransferScreen from '../transactions/TransferScreen'
import DepositScreen from '../transactions/DepositScreen'
import LoadingScreen from '../loading/LoadingScreen'
import ProfileScreen from '../profile/ProfileScreen'
import SignUpScreen from '../signup/SignUpScreen'
import SignUpScreen2 from '../signup/SignUpScreen2'
import SettingsScreen from '../settings/SettingsScreen'
import TransferSheet from '../../../components/CustomBottomSheet'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from '../main/Home'
import { TouchableOpacity, View, Image } from 'react-native'
import CodeScannerPage from '../CodeScanner/CodeScannerScreen'
import { Camera } from 'react-native-vision-camera'
import PermissionsPage from '../CodeScanner/PermissionScreen'

export type RootStackParamList = {
  Home: undefined
  Main: undefined
  Login: undefined
  Transfer: undefined
  Deposit: undefined
  Loading: undefined
  Profile: undefined
  Splash: undefined
  CreditScore: undefined
  Analytics: undefined
  QRCode: undefined
  Passcode: undefined
  SignUp: undefined
  SignUpNext: undefined
  Settings: undefined
  CodeScanner: undefined
  Permissions: undefined
  TransferModal: undefined
}

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          statusBarColor: 'white',
          statusBarStyle: 'dark',
        }}>
        <Stack.Screen name="TransferModal" component={TransferSheet} />
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Main" component={Home} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Transfer"
          component={TransferScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Deposit"
          component={DepositScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignUpNext"
          component={SignUpScreen2}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CodeScanner"
          component={CodeScannerPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Permissions"
          component={PermissionsPage}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          borderTopColor: 'white',
          backgroundColor: 'white',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerStyle: {
            elevation: 1,
            backgroundColor: 'white',
          },
          headerTitle: 'Hi Victor!',
          headerTitleStyle: {
            fontFamily: 'Nunito-Black',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../../assets/img/person3.jpg')}
                  resizeMode="contain"
                  style={{
                    height: 28,
                    width: 28,
                    borderRadius: 12,
                  }}
                />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../../assets/img/interface/bell.png')}
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                  }}
                />
              </View>
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={require('../../../assets/img/interface/home.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? 'black' : 'gray',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={CodeScannerPage}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={require('../../../assets/img/interface/qr.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? 'black' : 'gray',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Pofile"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={require('../../../assets/img/interface/bolt.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? 'black' : 'gray',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={require('../../../assets/img/interface/settings.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: focused ? 'black' : 'gray',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default Navigator
