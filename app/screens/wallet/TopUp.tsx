// LoginScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import Animated, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native';
import {supabase} from '../../../lib/supabase';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  FlatList,
} from 'react-native-gesture-handler';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Deposit,
  depositRequest,
  getDepositStatus,
  payoutRequest,
} from './backend/payments';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {storage} from '../mmkv/instance';

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
];

const TopUpScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  // Call goToTabScreen with the name of the screen you want to navigate to
  // For example:
  // goToTabScreen('Main');

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Main');
          }}
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
            <Icon name={'chevron-back'} size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [screenIndex, setScreenIndex] = useState(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [duration, setDuration] = useState('' || 0);
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState();

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
      setScreenIndex(0);
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      setScreenIndex(1);
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  const handleSelectSuggestion = suggestion => {
    setSelectedSuggestion(suggestion);
    setOperator(suggestion);
  };

  // Backend Logic (Supabase serverless function)
  async function depositFunds() {
    setIsLoading(true);

    if (amount < 50) {
      console.log('Minimum deposit is $50');
      setIsLoading(false);
      return;
    } else {
      depositRequest(amount, phone, operator);

      try {
        let newStatus = storage.getString('@depositStatus');
        setStatus(newStatus);

        let {data: users} = await supabase.auth.getUser();

        const UserId = users.user?.id;

        //check airdrop amount is less than or equal to current user balance
        let {data: balance} = await supabase
          .from('accounts')
          .select('balance')
          .eq('id', UserId)
          .single();

        const currentUserBalance = balance?.balance;

        if (newStatus == 'ACCEPTED') {
          // update user account balance
          const updatedBalance = currentUserBalance + JSON.parse(amount); // Calculate new balance
          const {error: updateError} = await supabase
            .from('accounts')
            .update({balance: updatedBalance})
            .eq('id', UserId);

          if (updateError) {
            Alert.alert('Error updating user balance');
            return;
          } else {
            console.log('Updated balance: $', updatedBalance);
          }

          setScreenIndex(1);
          // delete a specific key + value
          storage.delete('@depositStatus');
          setIsLoading(false);
        }

        if (newStatus == 'REJECTED') {
          // delete a specific key + value
          storage.delete('@depositStatus');
          console.log('Transaction has been rejected');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        setIsLoading(false);
        console.log('Error creating airdrop', error);
      }
    }
  }

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'black'}}>
      <GestureDetector gesture={swipes}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
          }}
          key={screenIndex}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {screenIndex === 0 && (
              <Animated.View
                entering={SlideInLeft}
                exiting={SlideOutLeft}
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderRadius: 14,
                    borderColor: 'white',
                    backgroundColor: 'white',
                    width: '80%',
                    marginBottom: 16,
                  }}>
                  <TextInput
                    style={{
                      height: 50,
                      flex: 1,
                      fontFamily: 'UberMoveBold',
                      color: 'black',
                      backgroundColor: 'white',
                      borderColor: 'white',
                      borderWidth: 2,
                      borderBottomLeftRadius: 14,
                      borderTopLeftRadius: 14,
                      paddingHorizontal: 16,
                      fontSize: 14,
                      letterSpacing: 2,
                    }}
                    editable
                    autoCapitalize="none"
                    placeholder="Phone Number"
                    keyboardAppearance="dark"
                    keyboardType="numeric"
                    placeholderTextColor="black"
                    caretHidden={false}
                    cursorColor="black"
                    onChangeText={text => setPhone(text)}
                    value={phone}
                  />
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderTopEndRadius: 14,
                      borderBottomEndRadius: 14,
                      backgroundColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.replace('Scanner');
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        borderRadius: 14,
                      }}>
                      <Image
                        source={require('../../assets/img/scanning.png')}
                        style={{
                          width: 20,
                          height: 20,
                          // borderRadius: 10,
                          tintColor: 'black',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  style={{
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
                  }}
                  editable
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  keyboardType="numeric"
                  placeholder="Amount in MWK"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setAmount(text)}
                  value={amount}
                />
                <SuggestionNotes
                  onSelectSuggestion={handleSelectSuggestion}
                  selectedSuggestion={selectedSuggestion}
                />
                <Animated.View
                  entering={SlideInLeft}
                  exiting={SlideOutLeft}
                  style={[{flexDirection: 'row'}]}>
                  <TouchableOpacity
                    onPress={() => {
                      depositFunds();
                    }}
                    style={[
                      styles.button,
                      {flexDirection: 'row', backgroundColor: Colors.grin},
                    ]}>
                    {isLoading && (
                      <ActivityIndicator
                        color="black"
                        size={'small'}
                        style={{
                          marginRight: 10, // Adjust the position of the loading indicator
                        }}
                      />
                    )}
                    <Text style={[styles.buttonTxt, {color: 'black'}]}>
                      Proceed
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            )}
            {screenIndex == 1 && (
              <Animated.View
                entering={SlideInRight}
                exiting={SlideOutRight}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Animated.View
                  entering={FadeIn.delay(300)}
                  style={[
                    styles.button,
                    {
                      marginBottom: 16,
                      backgroundColor: 'black',
                      borderColor: Colors.grin,
                      borderWidth: 5,
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                    },
                  ]}>
                  {status === 'REJECTED' && (
                    <Animated.Image
                      entering={FadeIn.delay(1000)}
                      source={require('../../assets/img/interface/info.png')}
                      resizeMode="contain"
                      style={{
                        height: 80,
                        width: 80,
                        tintColor: Colors.grin,
                        borderRadius: 49,
                      }}
                    />
                  )}
                  {status === 'ACCEPTED' && (
                    <Animated.Image
                      entering={FadeIn.delay(1000)}
                      source={require('../../assets/img/interface/check-circle2.png')}
                      resizeMode="contain"
                      style={{
                        height: 80,
                        width: 80,
                        tintColor: Colors.grin,
                        borderRadius: 49,
                      }}
                    />
                  )}
                </Animated.View>
                <View
                  style={[
                    styles.details,
                    {
                      paddingVertical: 16,
                      backgroundColor: 'black',
                      borderColor: 'gray',
                      borderWidth: 0.5,
                      justifyContent: 'space-between',
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 40,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'gray',
                      marginBottom: 16,
                    }}>
                    <Text style={[styles.buttonTxt, {color: 'gray'}]}>
                      Method
                    </Text>
                    <Text style={[styles.buttonTxt, {color: 'white'}]}>
                      {operator}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 40,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'gray',
                    }}>
                    <Text style={[styles.buttonTxt, {color: 'gray'}]}>
                      Amount
                    </Text>
                    {amount ? (
                      <Text
                        style={[
                          styles.buttonTxt,
                          {
                            color: 'white',
                            borderRadius: 10,
                            textAlign: 'center',
                            backgroundColor: 'black',
                            paddingVertical: 5,
                          },
                        ]}>
                        $
                        {new Intl.NumberFormat('en-US', {
                          maximumFractionDigits: 2,
                        }).format(amount)}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.buttonTxt,
                          {
                            color: 'white',
                            borderRadius: 10,
                            textAlign: 'center',
                            backgroundColor: 'black',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          },
                        ]}>
                        $
                        {new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(0)}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 40,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginVertical: 16,
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'gray',
                    }}>
                    <Text style={[styles.buttonTxt, {color: 'gray'}]}>
                      Reference
                    </Text>
                    <Text style={[styles.buttonTxt, {color: 'white'}]}>
                      20241703MWK
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 40,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={[styles.buttonTxt, {color: 'gray'}]}>
                      Transfer Status
                    </Text>
                    {status === 'ACCEPTED' ? (
                      <Text style={[styles.buttonTxt, {color: Colors.grin}]}>
                        Complete
                      </Text>
                    ) : (
                      <Text style={[styles.buttonTxt, {color: 'gray'}]}>
                        {status}
                      </Text>
                    )}
                  </View>
                </View>
                <Animated.View
                  entering={SlideInRight}
                  exiting={SlideOutRight}
                  style={[{flexDirection: 'row'}]}>
                  <TouchableOpacity
                    onPress={() => {
                      // depositFunds();
                      navigation.navigate('Main');
                    }}
                    style={[
                      styles.button,
                      {flexDirection: 'row', backgroundColor: Colors.grin},
                    ]}>
                    <Text style={[styles.buttonTxt, {color: 'black'}]}>
                      Return to Merchant
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            )}
          </KeyboardAvoidingView>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const SuggestionNotes = ({onSelectSuggestion}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const img1 = require('../../assets/img/mno/airtel1.png');
  const img2 = require('../../assets/img/mno/tnm2.jpg');
  const img3 = require('../../assets/img/mno/airtel1.png');
  const suggestions = [
    {label: img1, value: 'AIRTEL_MWI', color: Colors.grin},
    {label: img2, value: 'TNM_MWI', color: Colors.grin},
    {label: img3, value: '30', color: Colors.grin},
    // Add more suggestions as needed
  ];

  const handleSelectSuggestion = suggestion => {
    setSelectedSuggestion(suggestion);
    onSelectSuggestion(suggestion);
  };

  return (
    <FlatList
      data={suggestions}
      columnWrapperStyle={{
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      style={{
        alignSelf: 'center',
        marginBottom: 5,
        width: '80%',
      }}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3} // Change to 3 for 3 columns
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => {
            handleSelectSuggestion(item.value);
          }}
          style={[
            {
              borderColor:
                item.value === selectedSuggestion ? Colors.grin : 'gray',
              borderWidth: item.value === selectedSuggestion ? 1 : 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                item.value === selectedSuggestion
                  ? 'transparent'
                  : Colors.white,
            },
            styles.suggestion,
          ]}>
          <View
            style={{
              height: 40,
              width: '95%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 9,
              backgroundColor: Colors.white,
            }}>
            <Image
              source={item.label}
              resizeMode="contain"
              style={{
                width: item.label === img2 ? 45 : 30,
                height: item.label === img2 ? 45 : 30,
              }}
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  suggestionsContainer: {
    alignItems: 'center',
  },
  suggestionText: {
    color: Colors.grin,
    fontFamily: 'UberMoveBold',
    letterSpacing: 2,
    fontSize: 14,
  },
  suggestion: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: 50,
    padding: 2,
    marginBottom: 10,
    borderRadius: 14,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'black',
    marginTop: 8,
    marginBottom: 32,
    letterSpacing: 2,
  },
  details: {
    width: '80%',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
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
    color: 'black',
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
    borderColor: 'black',
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
    marginTop: 20,
    marginHorizontal: 10,
  },
  stepIndicator: {
    height: 10,
    width: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  notify: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

export default TopUpScreen;
