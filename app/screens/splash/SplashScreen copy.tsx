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

  const checkSession = async () => {
    if (session && session.user) {
      {
        TabuNavigator();
      }
    } else {
      navigation.navigate('Login');
      return;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    initializeApp();
    checkSession();
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

  return <LoginScreen />;
}

function TabuNavigator() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    session &&
    session.user && <TabNavigator key={session.user.id} session={session} />
  );
}
