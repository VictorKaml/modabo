// LoginScreen.tsx
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  AppState,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
  Keyboard,
} from 'react-native';

import {RootStackParamList} from '../navigator/RootNavigator';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {supabase} from '../../../lib/supabase';
import {Session} from '@supabase/supabase-js';
import Colors from '../../utils/Colors';
import {storage} from '../mmkv/instance';
import Spinner from 'react-native-loading-spinner-overlay';

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // If sign-in is successful, you can access the JWT token from the session
    if (session) {
      const jwtToken = session.access_token;

      storage.set('@jwtToken', jwtToken);
      console.log('JWT token:', session.access_token);
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardSpace(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardSpace(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Tells Supabase Auth to continuously refresh the session automatically if
  // the app is in the foreground. When this is added, you will continue to receive
  // `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
  // if the user's session is terminated. This should only be registered once.
  AppState.addEventListener('change', state => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  async function handleLogin() {
    validateEmail();
    validatePassword();

    // Show loading indicator when login button is pressed
    setIsLoading(true);

    try {
      const {
        data: {user},
        error,
      } = await supabase.auth.signInWithPassword({
        email: phone,
        password: password,
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }

      // Handle successful signup
      setIsLoading(false);
      console.log('User:', user);
      navigation.navigate('Main');
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('An error occurred during login.');
      console.error('Error signing in:', error);
    }
  }

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!phone) {
      setError('Enter your email.');
    } else if (!emailRegex.test(phone)) {
      setError('(e.g. janedoe@x.com)');
    } else {
      setError('');
    }
  };

  const validatePassword = () => {
    // Define your criteria for password validation
    const minLength = 6;

    if (!password) {
      setErrorPass('Enter your password.');
    } else if (password.length < minLength) {
      setErrorPass(`Enter at least ${minLength} characters.`);
    } else {
      setErrorPass('');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      {/* <Spinner visible={isLoading} color={ Colors.grin} /> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
          <View
            style={{
              borderBottomColor: Colors.grin,
              borderBottomWidth: 2,
              borderTopColor: Colors.grin,
              borderTopWidth: 2,
              borderStartColor: Colors.grin,
              borderStartWidth: 2,
              borderRadius: 8,
            }}>
            <Image
              source={require('../../assets/img/ic_flat.png')}
              style={{
                width: 24,
                height: 24,
                borderRadius: 8,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'UberMoveBold',
              color: Colors.grin,
              textAlign: 'center',
              letterSpacing: 2,
            }}>
            Modabo
          </Text>
        </View>
        <TextInput
          style={styles.input}
          editable
          autoCapitalize="none"
          autoCorrect
          autoComplete="email"
          placeholder="Email"
          placeholderTextColor="black"
          caretHidden={false}
          cursorColor="black"
          onChangeText={setPhone}
          value={phone}
          onBlur={validateEmail}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          editable
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="black"
          caretHidden={false}
          cursorColor="black"
          onChangeText={text => setPassword(text)}
          value={password}
          onBlur={validatePassword}
        />
        {errorPass ? <Text style={styles.error}>{errorPass}</Text> : null}
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('Main');
            handleLogin();
          }}
          style={[styles.button, {flexDirection: 'row'}]}>
          {isLoading && (
            <ActivityIndicator
              color="black"
              size={'small'}
              style={{
                marginRight: 10, // Adjust the position of the loading indicator
              }}
            />
          )}
          <Text style={styles.buttonTxt}>Sign In</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <View
          style={{
            width: '80%',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            onPress={() => {
              navigation.navigate('forgot');
            }}
            style={styles.forgotPassword}>
            Forgot password?
          </Text>
          <Text
            onPress={() => {
              navigation.navigate('SignUp');
            }}
            style={styles.signUp}>
            Sign Up
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 14,
  },
  error: {
    fontSize: 12,
    fontFamily: 'UberMoveBold',
    color: Colors.grin,
    marginBottom: 12,
    letterSpacing: 2,
    alignSelf: 'flex-start',
    left: '12%',
  },
  buttonTxt: {
    color: 'black', // Set your desired text color
    fontSize: 14,
    fontFamily: 'UberMoveBold',
    letterSpacing: 1,
  },
  button: {
    width: '80%',
    height: 50,
    marginBottom: 16,
    backgroundColor: Colors.grin, // Set your desired background color
    padding: 10,
    borderRadius: 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontFamily: 'UberMoveBold',
    color: 'black',
    marginTop: 8,
    marginBottom: 32,
    letterSpacing: 2,
  },
  signUp: {
    fontSize: 14,
    padding: 10,
    fontFamily: 'UberMoveBold',
    color: Colors.grin,
    alignItems: 'center',
    alignSelf: 'flex-start',
    letterSpacing: 2,
  },
  forgotPassword: {
    fontSize: 14,
    padding: 10,
    fontFamily: 'UberMoveBold',
    color: 'gray',
    alignItems: 'center',
    alignSelf: 'flex-end',
    letterSpacing: 2,
  },
  input: {
    width: '80%',
    fontFamily: 'UberMoveBold',
    height: 50,
    color: 'black',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    letterSpacing: 2,
  },
});
