import {TouchableOpacity, View, Image} from 'react-native';
import SettingsScreen from '../settings/SettingsScreen';
import HomeScreen from '../main/Home';
import {Session} from '@supabase/supabase-js';
import StatScreen from '../stats/statistics';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import WalletScreen from '../wallet/WalletScreen';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

export default function TabNavigator(
  {session}: {session: Session},
  {navigation},
) {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarIconStyle: {
          backgroundColor: 'gray',
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          borderTopColor: 'transparent',
          backgroundColor: 'black',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTitle: 'Modabo',
          headerTitleStyle: {
            fontFamily: 'UberMoveBold',
            color: 'white',
            fontSize: 16,
            letterSpacing: 2,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingStart: 15,
              }}>
              <View
                style={{
                  height: 24,
                  width: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../assets/img/ic_flat.png')}
                  style={{
                    width: 40,
                    height: 45,
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
                paddingEnd: 15,
              }}>
              <View
                style={{
                  height: 24,
                  width: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name={'settings-sharp'} size={24} color={Colors.grin} />
              </View>
            </TouchableOpacity>
          ),
          tabBarIcon: ({focused, color}) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={focused ? Colors.grin : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          headerShown: true,
          headerStyle: {
            elevation: 0,
            backgroundColor: 'black',
          },
          headerTitle: 'Wallet',
          headerTitleStyle: {
            fontFamily: 'UberMoveBold',
            color: 'white',
            fontSize: 16,
            letterSpacing: 2,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({focused, color}) => (
            <Icon
              name={focused ? 'wallet' : 'wallet-outline'}
              size={24}
              color={focused ? Colors.grin : 'gray'}
            />
          ),
        }}
      />
     
      <Tab.Screen
        name="Statistics"
        component={StatScreen}
        options={{
          headerShown: true,
          headerStyle: {
            elevation: 0,
            backgroundColor: 'black',
          },
          headerTitle: 'Statistics',
          headerTitleStyle: {
            fontFamily: 'UberMoveBold',
            color: 'white',
            fontSize: 16,
            letterSpacing: 2,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({focused, color}) => (
            <Icon
              name={focused ? 'analytics' : 'analytics-outline'}
              size={24}
              color={focused ? Colors.grin : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: {
            elevation: 0,
            backgroundColor: 'black',
          },
          headerTitle: 'Statistics',
          headerTitleStyle: {
            fontFamily: 'UberMoveBold',
            color: 'white',
            fontSize: 16,
            letterSpacing: 2,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({focused, color}) => (
            <Icon
              name={focused ? 'settings-sharp' : 'settings-outline'}
              size={24}
              color={focused ? Colors.grin : 'gray'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
