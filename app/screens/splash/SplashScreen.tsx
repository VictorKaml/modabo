import 'react-native-url-polyfill/auto';
import React, {useState, useEffect, useCallback} from 'react';
import {Session} from '@supabase/supabase-js';
import {supabase} from '../../../lib/supabase';
import LoginScreen from '../signin/SignInScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import TabNavigator from '../navigator/TabNavigator';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import {Linking} from 'react-native';
import LockScreen from '../lockProfiled/LockedScreen';
import HomeScreen from '../main/Home';

export default function App() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [session, setSession] = useState<Session | null>(null);

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

  useEffect(() => {
    initializeApp();
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      return isFirstLaunch === null;
    } catch (error) {
      console.error('Error checking first launch:', error);
      return false;
    }
  };

  const [isEnabled, setIsEnabled] = useState<boolean>();

  useEffect(() => {
    VerifyIsEnabled();
    // Subscribe to changes in the transaction table
    supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'profiles'},
        VerifyIsEnabled,
      )
      .subscribe();
  }, [VerifyIsEnabled]);

  async function VerifyIsEnabled() {
    try {
      // Get logged in user id
      let {data: users} = await supabase.auth.getUser();

      const client_id = users.user?.id;

      // Check if the profile is enabled or not
      const {data: profiles, error} = await supabase
        .from('profiles')
        .select('enabled')
        .eq('id', client_id)
        .single();

      if (error) {
        console.log('Error:', error);
      }

      console.log('Is profile enabled?', profiles?.enabled);

      if (profiles?.enabled === false) {
        setIsEnabled(false);
        // just hide the splash screen after navigation ready
      } else {
        setIsEnabled(true);
        return;
      }
    } catch (error) {
      console.log('Error cheching if accound is enabled', error);
    }
  }

  return session && session.user ? (
    <HomeScreen key={session.user.id} session={session} />
  ) : (
    <LoginScreen />
  );
}

// return session && session.user && isEnabled === true ? (
//     <TabNavigator key={session.user.id} session={session} />
//   ) : !session && isEnabled === false ? (
//     <LoginScreen />
//   ) : (
//     session &&
//     session.user &&
//     isEnabled === false && <LockScreen navigation={navigation} />
//   );
// }
