// LoginScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import CustomButton1 from '../../components/btn2';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native';
import {supabase} from '../../../lib/supabase';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Colors from '../../utils/Colors';

interface SplashScreenProps {
  navigation: any; // You might want to replace 'any' with the proper navigation type
}

const onboardingSteps = [
  {
    icon: require('../../assets/img/stickers/agreement.png'),
    title: 'Track Your Funds',
  },
  {
    icon: require('../../assets/img/stickers/exploration.png'),
    title: 'Explore Best Deals',
  },
  {
    icon: require('../../assets/img/stickers/startup.png'),
    title: 'Join The Future',
  },
  {
    icon: require('../../assets/img/stickers/startup.png'),
    title: 'Join The Future',
  },
];

const SignUpScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Login');
          }}
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
                tintColor: 'white',
              }}
            />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [screenIndex, setScreenIndex] = useState(0);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [nationalId, setNationalId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const amount = 0;

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
      handleSignUp;
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      navigation.goBack('Login');
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  async function handleSignUp() {
    setIsLoading(true);

    try {
      const {
        data: {user, session},
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            dob: dob,
            type: type,
            email: email,
            phone: phone,
            gender: gender,
            amount: amount,
            country: country,
            password: password,
            username: username,
            firstname: firstname,
            lastname: lastname,
            national: nationalId,
            verification: 'Pending',
            avatar:
              'https://www.flaticon.com/free-sticker/man_4825087?term=avatar&page=1&position=7&origin=search&related_id=4825087',
          },
        },
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
        console.log(error.message);
        return;
      }

      // Handle successful signup
      if (!session)
        Alert.alert('Please check your inbox for email verification!');
      console.log('Data:', user);
      navigation.navigate('Login', {});
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('An error occurred on signin.');
      console.error('Error signing up:', error);
    }
  }

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'black'}}>
      <GestureDetector gesture={swipes}>
        <Animated.View
          style={{flex: 1, backgroundColor: 'black'}}
          key={screenIndex}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View
              style={{
                width: '80%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                marginBottom: 10,
              }}>
              {screenIndex == 0 ? (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'UberMoveBold',
                    color: Colors.grin,
                    letterSpacing: 1,
                  }}>
                  Begin
                </Text>
              ) : screenIndex == 1 ? (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'UberMoveBold',
                    color: Colors.grin,
                    letterSpacing: 1,
                  }}>
                  Different
                </Text>
              ) : screenIndex == 2 ? (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'UberMoveBold',
                    color: Colors.grin,
                    letterSpacing: 1,
                  }}>
                  Identity
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'UberMoveBold',
                    color: Colors.grin,
                    letterSpacing: 1,
                  }}>
                  Security
                </Text>
              )}
              {screenIndex == 0 ? (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'UberMoveBold',
                    color: Colors.grin,
                    letterSpacing: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontFamily: 'UberMoveBold',
                      color: Colors.grin,
                      letterSpacing: 1,
                    }}>
                    1
                  </Text>
                  /4
                </Text>
              ) : screenIndex == 1 ? (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'UberMoveBold',
                    color: Colors.grin,
                    letterSpacing: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontFamily: 'UberMoveBold',
                      color: Colors.grin,
                      letterSpacing: 1,
                    }}>
                    2
                  </Text>
                  /4
                </Text>
              ) : screenIndex == 2 ? (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'UberMoveBold',
                    color: Colors.grin,
                    letterSpacing: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontFamily: 'UberMoveBold',
                      color: Colors.grin,
                      letterSpacing: 1,
                    }}>
                    3
                  </Text>
                  /4
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: 'UberMoveBold',
                    color: Colors.grin,
                    letterSpacing: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontFamily: 'UberMoveBold',
                      color: Colors.grin,
                      letterSpacing: 1,
                    }}>
                    4
                  </Text>
                  /4
                </Text>
              )}
            </View>
            {screenIndex == 0 && (
              <Animated.View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Name"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setFirstname(text)}
                  value={firstname}
                />
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Surname"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setLastname(text)}
                  value={lastname}
                />
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Account type"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setType(text)}
                  value={type}
                />
              </Animated.View>
            )}
            {screenIndex == 1 && (
              <Animated.View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="@username"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setUsername(text)}
                  value={username}
                />
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Email"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setEmail(text)}
                  value={email}
                />
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Phone"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setPhone(text)}
                  value={phone}
                />
              </Animated.View>
            )}
            {screenIndex == 2 && (
              <Animated.View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Country"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setCountry(text)}
                  value={country}
                />
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Date of Birth"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setDob(text)}
                  value={dob}
                />
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Gender"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setGender(text)}
                  value={gender}
                />
              </Animated.View>
            )}
            {screenIndex == 3 && (
              <Animated.View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="National ID"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setNationalId(text)}
                  value={nationalId}
                />
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Password"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setPassword(text)}
                  value={password}
                />
                <TextInput
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Password"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setPassword(text)}
                  value={password}
                />
              </Animated.View>
            )}
            {screenIndex == 3 ? (
              <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, {flexDirection: 'row'}]}>
                {isLoading && (
                  <ActivityIndicator
                    color="white"
                    size={'small'}
                    style={{
                      marginRight: 10, // Adjust the position of the loading indicator
                    }}
                  />
                )}
                <Text style={styles.buttonTxt}>Submit</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onContinue}
                style={[styles.button, {flexDirection: 'row'}]}>
                {isLoading && (
                  <ActivityIndicator
                    color="white"
                    size={'small'}
                    style={{
                      marginRight: 10, // Adjust the position of the loading indicator
                    }}
                  />
                )}
                <Text style={styles.buttonTxt}>Next</Text>
              </TouchableOpacity>
            )}
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
          </KeyboardAvoidingView>
        </Animated.View>
      </GestureDetector>

      <View style={styles.stepIndicatorContainer}>
        {onboardingSteps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              {backgroundColor: index === screenIndex ? Colors.grin : 'gray'},
            ]}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emoji: {
    fontSize: 24,
  },
  logo: {
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 24,
    fontFamily: 'UberMoveBold',
    color: 'white',
    marginTop: 8,
    marginBottom: 32,
    letterSpacing: 2,
  },
  buttonTxt: {
    color: 'black', // Set your desired text color
    fontSize: 14,
    fontFamily: 'UberMoveBold',
    letterSpacing: 1,
  },
  error: {
    fontSize: 12,
    fontFamily: 'UberMoveBold',
    color: 'red',
    marginBottom: 12,
    letterSpacing: 2,
    alignSelf: 'flex-start',
    left: '12%',
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
  signUp: {
    fontSize: 14,
    padding: 10,
    fontFamily: 'UberMoveBold',
    color: 'white',
    alignItems: 'center',
    alignSelf: 'flex-start',
    letterSpacing: 2,
  },
  forgotPassword: {
    fontSize: 14,
    padding: 10,
    fontFamily: 'UberMoveBold',
    color: 'black',
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
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    letterSpacing: 2,
  },
  // steps
  stepIndicatorContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 15,
    marginBottom: 50,
  },
  stepIndicator: {
    height: 10,
    width: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
});

export default SignUpScreen;
