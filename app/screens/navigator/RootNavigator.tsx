// App.tsx
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Linking,
  SafeAreaView,
  Text,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Vibration,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';

import TabNavigator from './TabNavigator';
import ECardScreen from '../digital/ECardScreen';
import SettingsScreen from '../settings/SettingsScreen';
import GameScreen from '../games/GameScreen';
import LoginScreen from '../signin/SignInScreen';
import SignUpScreen from '../signup/SignUpScreen';
import SplashScreen from '../splash/SplashScreen';
import AirDropScreen from '../transactions/AirDropScreen';
import RequestScreen from '../transactions/RequestScreen';
import TransferScreen from '../transactions/TransferScreen';
import WalletScreen from '../wallet/WalletScreen';
import OnboardingScreen from '../onboarding/onboarding';
import CodeScannerPage from '../QR/CodeScreen';
import ProfileScreen from '../profile/ProfileScreen';
import VerificationScreen from '../signup/VerificationScreen';
import ConfirmationScreen from '../transactions/ConfirmationScreen';
import UpdateProfileScreen from '../profile/UpdateProfile';
import NotificationsScreen from '../notifications/notifications';
import TermsAndPrivacyScreen from '../Terms/terms';
import QuickTransfer from '../main/Favourite';
import ForgotPasswordScreen from '../forgotPassword/forgotPassword';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {supabase} from '../../../lib/supabase';
import TopUpScreen from '../wallet/TopUp';
import UploadMusic from '../digital/Upload';
import SearchProfileScreen from '../profile/SearchProfileScreen';
import LockScreen from '../lockProfiled/LockedScreen';
import HomeScreen from '../main/Home';
import {DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer';
import StatScreen from '../stats/statistics';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import {Session} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storage} from '../mmkv/instance';
import IdentityScreen from '../identity/identity';

export type RootStackParamList = {
  Home: undefined;
  Main: undefined;
  Login: undefined;
  Transfer: undefined;
  Deposit: undefined;
  Loading: undefined;
  Profile: undefined;
  SearchProfile: undefined;
  UpdateProfile: undefined;
  Splash: undefined;
  CreditScore: undefined;
  Analytics: undefined;
  QRCode: undefined;
  Passcode: undefined;
  SignUp: undefined;
  SignUpNext: undefined;
  Settings: undefined;
  Scanner: undefined;
  Permissions: undefined;
  TransferModal: undefined;
  Request: undefined;
  Verify: undefined;
  Complete: undefined;
  OnBoarding: undefined;
  Notifications: undefined;
  Terms: undefined;
  quickTransfer: undefined;
  forgot: undefined;
  TopUp: undefined;
  Lock: undefined;
  Identity: undefined;
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  const storedAvatar = storage.getString('avatar');

  const navigation = useNavigation();

  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };
  return (
    <Drawer.Navigator
      defaultStatus="closed"
      detachInactiveScreens
      drawerContent={props => {
        return (
          <SafeAreaView style={{flex: 1}}>
            {storedAvatar ? (
              <ImageBackground
                source={{uri: storedAvatar}}
                style={StyleSheet.absoluteFillObject}
              />
            ) : (
              <ImageBackground
                source={require('../../assets/img/profile/balaclava6.jpg')}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <View
              style={{
                height: 60,
                width: '100%',
                paddingHorizontal: 25,
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: 'UberMoveBold',
                  fontSize: 24,
                  color: Colors.white,
                  letterSpacing: 1,
                }}>
                Modabo
              </Text>
              <TouchableOpacity
                onPress={() => {
                  closeDrawer();
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="close" size={24} color={Colors.grin} />
              </TouchableOpacity>
            </View>
            <DrawerItemList {...props} />
          </SafeAreaView>
        );
      }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'black',
          borderRightWidth: 0.2,
          borderRightColor: Colors.gray,
        },
        headerStyle: {
          height: 60,
          backgroundColor: 'black',
        },
        headerShown: false,
        headerTintColor: 'black',
        drawerContentStyle: {
          backgroundColor: Colors.black,
        },
        drawerItemStyle: {
          width: '90%',
          height: 50,
          alignSelf: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
        },
        drawerLabelStyle: {
          color: 'white',
          fontSize: 14,
          fontFamily: 'UberMoveBold',
        },
        drawerActiveTintColor: Colors.grin,
        drawerType: Dimensions.get('screen').width >= 768 ? 'back' : 'slide',
        drawerPosition: 'left',
        drawerStatusBarAnimation: 'fade',
      }}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="home"
              size={size}
              color={focused ? Colors.grin : Colors.gray}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="My wallet"
        component={WalletScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="wallet-outline"
              size={size}
              color={focused ? Colors.grin : Colors.gray}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Statistics"
        component={StatScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="analytics-outline"
              size={size}
              color={focused ? Colors.grin : Colors.gray}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="settings-outline"
              size={size}
              color={focused ? Colors.grin : Colors.gray}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Help & feedback"
        component={SettingsScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="information-circle-outline"
              size={size}
              color={focused ? Colors.grin : Colors.gray}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const RootNavigator = ({navigation}) => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermissionStatus(permission);
  }, []);

  const initializeApp = async () => {
    const isFirstLaunch = await checkFirstLaunch();
    if (isFirstLaunch) {
      // Perform first launch actions
      // For example, set isFirstLaunch to false to indicate app has been launched
      checkPermission();
      await AsyncStorage.setItem('isFirstLaunch', 'false');
      navigation.navigate('OnBoarding');
    }
  };

  const checkPermission = async () => {
    if (cameraPermissionStatus === 'granted') {
      return;
    } else {
      requestCameraPermission();
      return;
    }
  };

  const checkFirstLaunch = async () => {
    try {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      return isFirstLaunch === null;
    } catch (error) {
      console.error('Error checking first launch:', error);
      return false;
    }
  };

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setTimeout(() => BootSplash.hide(), 2000);
  }, []);

  useEffect(() => {
    initializeApp();
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarColor: 'black',
          statusBarStyle: 'light',
        }}>
        {session && session.user ? (
          <Stack.Group>
            <Stack.Screen
              name="Main"
              component={Root}
              options={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Home',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name={'menu'} size={24} color={Colors.grin} />
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
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name={'settings-sharp'}
                        size={24}
                        color={Colors.grin}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{
                headerShown: false,
                statusBarColor: 'black',
                statusBarStyle: 'light',
              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
                statusBarColor: 'black',
                statusBarStyle: 'light',
              }}
            />
            <Stack.Screen
              name="Lock"
              component={LockScreen}
              options={{
                headerShown: false,
                statusBarColor: 'black',
                statusBarStyle: 'light',
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Profile',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
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
                        source={require('../../assets/img/interface/cross-small.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="SearchProfile"
              component={SearchProfileScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Profile',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
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
                        source={require('../../assets/img/interface/cross-small.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="UpdateProfile"
              component={UpdateProfileScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Edit Profile',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name={'chevron-back'}
                        size={24}
                        color={Colors.grin}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="quickTransfer"
              component={QuickTransfer}
              options={{
                headerShown: true,
              }}
            />

            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Notifications',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: Colors.white,
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
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
                        source={require('../../assets/img/interface/cross-small.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                          tintColor: 'white',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="forgot"
              component={ForgotPasswordScreen}
              options={{
                headerShown: true,
                headerTitle: 'Reset Password',
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
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
                        source={require('../../assets/img/interface/arrow-small-left.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                headerShown: true,
                headerTitle: 'Sign Up',
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
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
                        source={require('../../assets/img/interface/arrow-small-left.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Settings',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}></View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Terms"
              component={TermsAndPrivacyScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Identity"
              component={IdentityScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OnBoarding"
              component={OnboardingScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Scanner"
              component={CodeScannerPage}
              options={{
                statusBarHidden: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Complete"
              component={ConfirmationScreen}
              options={{
                statusBarHidden: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Verify"
              component={VerificationScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'white',
                },
                headerTitle: 'Verification',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
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
                        source={require('../../assets/img/interface/arrow-small-left.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Music"
              component={UploadMusic}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Search Songs',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
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
                        source={require('../../assets/img/interface/arrow-small-right.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Wallet"
              component={WalletScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Top Up',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
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
                        source={require('../../assets/img/interface/arrow-small-right.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Ecards"
              component={ECardScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Find Deals',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
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
                        source={require('../../assets/img/interface/arrow-small-right.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Games"
              component={GameScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'white',
                },
                headerTitle: 'Virtual Games',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
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
                        source={require('../../assets/img/interface/cross-small.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="AirDrop"
              component={AirDropScreen}
              options={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Airdrop',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name={'chevron-back'}
                        size={24}
                        color={Colors.white}
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
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name={'chevron-back'}
                        size={24}
                        color={Colors.white}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Request"
              component={RequestScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Request',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
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
                        source={require('../../assets/img/interface/share.png')}
                        resizeMode="contain"
                        style={{
                          height: 16,
                          width: 16,
                          tintColor: 'white',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
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
                        source={require('../../assets/img/interface/cross-small.png')}
                        resizeMode="contain"
                        style={{
                          height: 24,
                          width: 24,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Transfer"
              component={TransferScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Transfer',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name={'chevron-back'}
                        size={24}
                        color={Colors.grin}
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
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name={'close'} size={24} color={Colors.black} />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="TopUp"
              component={TopUpScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitle: 'Top Up',
                headerTitleStyle: {
                  fontFamily: 'UberMoveBold',
                  color: 'white',
                  fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon
                        name={'chevron-back'}
                        size={24}
                        color={Colors.white}
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
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name={'close'} size={24} color={Colors.black} />
                    </View>
                  </TouchableOpacity>
                ),
              }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
