// LoginScreen.tsx
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  BackHandler,
} from 'react-native';

import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
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
} from 'react-native-gesture-handler';
import {Vibration} from 'react-native';
import notifee, {
  AndroidColor,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import Button from '../../components/Button';
import {Styles} from '../../styles/GlobalStyles';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  useBottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import Colors from '../../utils/Colors';
import {BlurView} from '@react-native-community/blur';
import {FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
    icon: require('../../assets/img/stickers/exploration.png'),
    title: 'Explore Best Deals',
  },
  {
    icon: require('../../assets/img/stickers/exploration.png'),
    title: 'Explore Best Deals',
  },
];

const TransferScreen: React.FC<SplashScreenProps> = ({navigation, route}) => {
  useEffect(() => {
    // Initialize Firebase Admin SDK without the databaseURL
    /// admin.initializeApp({
    //   credential: admin.credential.applicationDefault(),
    // })
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: 'UberMoveBold',
        color: 'white',
        fontSize: 16,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Main');
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

    const syncBalance = async () => {
      let {data: users} = await supabase.auth.getUser();

      const client_id = users.user?.id;

      console.log(client_id);

      // Show loading indicator when login button is pressed
      try {
        let {
          data: users,
          error,
          status,
        } = await supabase
          .from('accounts')
          .select('balance')
          .eq('id', client_id)
          .single();

        if (error && status != 406) {
          console.log(error.message);
          Vibration.vibrate(100);
          return;
        }

        setBalance(users?.balance);

        // Handle successful sync balance
        console.log('User:', users?.balance);
      } catch (error) {
        console.error('Error refreshing balance in:', error);
      }
    };

    syncBalance();
  }, [navigation]);

  const {avat, user, firstname, lastname} = route.params || {};

  const [screenIndex, setScreenIndex] = useState(0);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [balance, setBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 2;
    const isSecondScreen = screenIndex === onboardingSteps.length - 3;
    const isFirstScreen = screenIndex === onboardingSteps.length - 4;
    if (isSecondScreen && !recipient) {
      Alert.alert('Enter receivers username');
      return;
    }
    if (isSecondScreen && !note) {
      Alert.alert('Enter payment note');
      return;
    }
    if (isFirstScreen && !amount) {
      Alert.alert('Enter amount');
      return;
    }
    if (isLastScreen) {
      console.log('Confirm the transfer with your password');
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  async function handleTransfer() {
    setIsLoading(true);
    // dismiss();
    // setScreenIndex(3);
    // setStatus('Complete');

    let {data: users} = await supabase.auth.getUser();

    const currentUser = users.user?.id;

    try {
      let {error, status} = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', currentUser)
        .single();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        dismiss();
        return;
      }

      let {data: receiver} = await supabase
        .from('accounts')
        .select('balance')
        .eq('username', recipient)
        .single();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        dismiss();
        return;
      }

      // Query Supabase to check if recipient exists
      const {data: recipientData, error: recipientError} = await supabase
        .from('profiles')
        .select('*')
        .eq('username', recipient)
        .single();

      if (recipientError || !recipientData) {
        setIsLoading(false);
        dismiss();
        throw new Error('Recipient not found');
      }

      // Query Supabase to check if recipient exists
      const {data: loggedInUsername} = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', currentUser)
        .single();

      if (loggedInUsername?.username === recipientData?.username) {
        // Prevent the transaction and display a message to the user
        Alert.alert('You cannot send money to your own account.');
        setIsLoading(false);
        dismiss();
        return;
      }

      // Deduct amount from sender's balance
      // Update recipient's balance
      // Store transaction details in the transactions table

      // Deduct amount from sender's balance
      const receiverBalance = receiver?.balance;

      try {
        let {
          data: users,
          error,
          status,
        } = await supabase
          .from('accounts')
          .select('balance')
          .eq('id', currentUser)
          .single();

        if (error && status != 406) {
          console.log(error.message);
          Vibration.vibrate(100);
          dismiss();
          return;
        }

        const senderBalance = users?.balance;
        const totalAmount = parseFloat(amount); // Convert amount to float

        // Implement your logic to check if the sender has sufficient balance
        // You may also want to check for minimum balance, daily transaction limits, etc.
        if (senderBalance < 0 && totalAmount > 0) {
          // Display an error message and prevent the transaction
          Alert.alert('You dont have money, add funds to acount.');
          dismiss();
          return;
        } else if (totalAmount > senderBalance) {
          Alert.alert('The amount entered is greater than your balance.');
          dismiss();
          return;
        } else if (senderBalance < totalAmount) {
          Alert.alert('Insufficient balance, add funds to account');
          dismiss();
          return;
        }

        // Prompt user to confirm the transaction with their password
        // You might want to implement OTP or more secure authentication
        const confirmed = await confirmTransactionWithPassword(password);

        if (!confirmed) {
          Alert.alert('Transaction not confirmed');
          dismiss();
          return;
        }

        const {data} = await supabase
          .from('accounts')
          .select('id')
          .eq('username', recipient)
          .single();

        if (data) {
          const updatedSenderBalance = senderBalance - totalAmount; // Calculate new balance
          const {error: updateSenderError} = await supabase
            .from('accounts')
            .update({balance: updatedSenderBalance})
            .eq('id', currentUser);

          if (updateSenderError) {
            Alert.alert('Error updating sender balance');
            dismiss();
            return;
          }

          const updatedReceiverBalance = receiverBalance + totalAmount;

          // Update recipient's balance
          const {error: updateRecipientError} = await supabase
            .from('accounts')
            .update({balance: updatedReceiverBalance}) // Increment balance
            .eq('username', recipient);

          if (updateRecipientError) {
            Alert.alert('Error updating recipient balance');
            dismiss();
            return;
          }
        } else {
          const updatedSenderBalance = senderBalance - totalAmount; // Calculate new balance
          const {error: updateSenderError} = await supabase
            .from('accounts')
            .update({balance: updatedSenderBalance})
            .eq('id', currentUser);

          if (updateSenderError) {
            Alert.alert('Error updating sender balance');
            dismiss();
            return;
          }

          const updatedReceiverBalance = receiverBalance + totalAmount;

          // Update recipient's balance
          const {error: updateRecipientError} = await supabase
            .from('accounts')
            .insert({
              id: recipientData?.id,
              balance: totalAmount,
              username: recipient,
              phone_number: recipientData?.phone_number,
            }); // Increment balance

          if (updateRecipientError) {
            Alert.alert('Error inserting recipient balance');
            dismiss();
            return;
          }
          Alert.alert('Success inserting recipient balance');
        }

        const {data: recipientId} = await supabase
          .from('profiles')
          .select('id, avatar_url')
          .eq('username', recipient)
          .single();

        // Insert transaction in trans table
        const {error: trasnError} = await supabase.from('transactions').insert({
          amount: totalAmount,
          sender_id: currentUser,
          sender_username: loggedInUsername?.username,
          receiver_id: recipientId?.id,
          receiver_username: recipient,
          sender_avatar: loggedInUsername?.avatar_url,
          receiver_avatar: recipientId?.avatar_url,
        }); // Insert transaction in trans table

        if (trasnError) {
          Alert.alert('Failed to insert transaction', trasnError);
          dismiss();
          setIsBlur(false);
          return;
        }

        Alert.alert('Success transaction');

        console.log('Success', 'Transaction completed successfully');
        console.log('Update receiver balance', receiverBalance);
        console.log('Updated sender balance', senderBalance);

        setIsLoading(false);
        dismiss();
        setScreenIndex(3);
        setStatus('Complete');

        const transfeeMsg = '$' + totalAmount + ' sent to @' + recipient;

        onDisplayNotification(transfeeMsg);
      } catch (error) {
        console.log('error', error);
      }
      // openCompleteSheet();
    } catch (error) {
      setIsLoading(false);
      console.log('Error', error);
    } finally {
      dismiss();
    }
  }

  const confirmTransactionWithPassword = async password => {
    // Verify password with the user's profile data
    // Implement your authentication logic
    // For demonstration, you can compare the password with a stored hash
    let {data: users} = await supabase.auth.getUser();

    const currentUser = users.user?.id;

    const {data: userData, error: userError} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser)
      .single();

    if (userError || !userData) {
      throw new Error('User not found');
    }

    console.log('User found: ');
    // Compare the entered password with the stored hash
    // Implement your password verification logic
    const isPasswordCorrect = comparePasswordHash(password, userData.password);
    return isPasswordCorrect;
  };

  const comparePasswordHash = (password, hash) => {
    // Implement password comparison logic (e.g., using bcrypt)
    // For demonstration, you can compare the plain password with the stored hash
    return password === hash;
  };

  async function onDisplayNotification(message) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      badge: true,
      lights: true,
      vibration: true,
      lightColor: AndroidColor.GREEN,
      vibrationPattern: [300, 500],

      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Payment Complete 💸',
      body: message,
      android: {
        channelId,
        lights: [AndroidColor.GREEN, 300, 500],
        vibrationPattern: [300, 500],
        visibility: AndroidVisibility.PRIVATE,
        autoCancel: false,
        importance: AndroidImportance.HIGH,
        largeIcon: require('../../assets/img/splash2.png'),
        timestamp: Date.now(), // 8 minutes ago
        showTimestamp: true,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const handleNumberPress = (buttonValue: string) => {
    if (amount.length < 10) {
      setAmount(amount + buttonValue);
      Vibration.vibrate(1);
    }
  };

  const prefix = '$';

  const parsedAmount = parseFloat(amount);

  const totalAmount = parsedAmount + (parsedAmount * 3.37) / 100 + 0.5;

  const [isBlur, setIsBlur] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const bottomSheetComplete = useRef<BottomSheetModal>(null);
  const presentSheet = () => bottomSheetRef.current?.present();
  const presentCompleteSheet = () => bottomSheetComplete.current?.present();
  const openSheet = () => {
    setIsBlur(true);
    presentSheet();
  };

  const snapPoints = useMemo(() => ['1%', '100%'], []);
  const {dismiss} = useBottomSheetModal();
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 0,
    easing: Easing.ease,
  });

  const [showAnotherScreen, setShowAnotherScreen] = useState(false);

  const resetState = () => {
    setShowAnotherScreen(false);
  };

  // Function to handle back button press
  const handleBackButton = () => {
    dismiss();
    return true; // Return false to let the default back button behavior happen
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    // Cleanup the event listener when component unmounts
    return () => backHandler.remove();
  });

  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');

  const handleSelectSuggestion = suggestion => {
    setSelectedSuggestion(suggestion);
    setNote(suggestion);
  };

  const handleSelectAmount = amounts => {
    setSelectedAmount(amounts);
    setAmount(amounts);
  };

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'black'}}>
      <GestureDetector gesture={swipes}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={{flex: 1, backgroundColor: 'black'}}
          key={screenIndex}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            {screenIndex == 2 && (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                <View
                  style={[
                    styles.button,
                    {
                      marginBottom: 0,
                      backgroundColor: Colors.grin,
                      borderColor: 'white',
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                    },
                  ]}>
                  <Image
                    source={
                      avat && user
                        ? {uri: avat}
                        : require('../../assets/img/profile/balaclava4.jpg')
                    }
                    resizeMode="contain"
                    style={{
                      height: 90,
                      width: 90,
                      borderRadius: 45,
                    }}
                  />
                </View>
              </View>
            )}
            {screenIndex == 3 && (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                <Animated.View
                  entering={FadeIn.delay(300)}
                  style={[
                    styles.button,
                    {
                      marginBottom: 0,
                      backgroundColor: 'black',
                      borderColor: Colors.grin,
                      borderWidth: 5,
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                    },
                  ]}>
                  <Animated.Image
                    entering={FadeIn.delay(700)}
                    source={require('../../assets/img/interface/check-circle2.png')}
                    resizeMode="contain"
                    style={{
                      height: 80,
                      width: 80,
                      tintColor: Colors.grin,
                      borderRadius: 49,
                    }}
                  />
                </Animated.View>
              </View>
            )}

            {screenIndex == 0 && (
              <View
                style={[
                  Styles.viewBottom,
                  {
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                    top: 0,
                  },
                ]}>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      marginBottom: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <TextInput
                      style={styles.keypad}
                      focusable={false}
                      editable={false}
                      autoCapitalize="none"
                      placeholder="$0.00"
                      placeholderTextColor="gray"
                      caretHidden={true}
                      onChangeText={value => {
                        // Remove the prefix before updating the state
                        if (value.startsWith(prefix)) {
                          setAmount(value.substring(prefix.length));
                        }
                      }}
                      value={
                        amount
                          ? prefix +
                            new Intl.NumberFormat('en-US', {
                              maximumFractionDigits: 2,
                            }).format(amount)
                          : ''
                      }
                      multiline={false} // Set multiline to false to limit the TextInput to one line
                      numberOfLines={1} // Ensure only one line is displayed
                    />
                  </View>
                  <SuggestionAmount onSelectAmount={handleSelectAmount} />
                  <View style={Styles.row}>
                    <Button title="7" onPress={() => handleNumberPress('7')} />
                    <Button title="8" onPress={() => handleNumberPress('8')} />
                    <Button title="9" onPress={() => handleNumberPress('9')} />
                  </View>
                  <View style={Styles.row}>
                    <Button title="4" onPress={() => handleNumberPress('4')} />
                    <Button title="5" onPress={() => handleNumberPress('5')} />
                    <Button title="6" onPress={() => handleNumberPress('6')} />
                  </View>
                  <View style={Styles.row}>
                    <Button title="1" onPress={() => handleNumberPress('1')} />
                    <Button title="2" onPress={() => handleNumberPress('2')} />
                    <Button title="3" onPress={() => handleNumberPress('3')} />
                  </View>
                  <View style={Styles.row}>
                    <Button title="." onPress={() => handleNumberPress('.')} />
                    <Button title="0" onPress={() => handleNumberPress('0')} />
                    <TouchableOpacity
                      style={[Styles.btnLight, {}]}
                      onPress={() => setAmount(amount.slice(0, -1))}
                      onLongPress={() => setAmount(amount.slice(0, -10))}>
                      <Image
                        source={require('../..//assets/img/interface/delete.png')}
                        resizeMode="contain"
                        style={{
                          height: 14,
                          width: 14,
                          tintColor: Colors.grin,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={{
                      marginTop: 7,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 50,
                      width: '80%',
                      backgroundColor: Colors.grin,
                      borderRadius: 14,
                    }}
                    onPress={onContinue}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 14,
                        fontFamily: 'UberMoveBold',
                        textAlign: 'center',
                        letterSpacing: 1,
                      }}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {screenIndex == 1 && (
              <Animated.View
                entering={SlideInLeft}
                exiting={SlideOutLeft}
                style={{
                  width: '100%',
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
                    style={[styles.inputPass]}
                    editable
                    autoCapitalize="none"
                    placeholder="Username or phone"
                    placeholderTextColor="black"
                    caretHidden={false}
                    cursorColor="black"
                    onChangeText={text => setRecipient(user ? user : text)}
                    value={user && avat ? user : recipient}
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
                  style={styles.input}
                  editable
                  autoCapitalize="none"
                  placeholder="Payment note"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setNote(text)}
                  value={note}
                />
                <SuggestionNotes onSelectSuggestion={handleSelectSuggestion} />
              </Animated.View>
            )}
            {screenIndex == 2 && (
              <Animated.View
                entering={SlideInRight}
                exiting={SlideOutRight}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
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
                    }}>
                    <Text style={[styles.buttonTxt, {color: 'gray'}]}>
                      Recipient
                    </Text>
                    <Text style={[styles.buttonTxt, {color: 'white'}]}>
                      {recipient}
                    </Text>
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
                      Amount
                    </Text>
                    {parsedAmount ? (
                      <Text style={[styles.buttonTxt, {color: 'white'}]}>
                        $
                        {new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                        }).format(parsedAmount)}
                      </Text>
                    ) : (
                      <Text style={[styles.buttonTxt, {color: Colors.grin}]}>
                        $
                        {new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
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
                      marginBottom: 16,
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'gray',
                    }}>
                    <Text style={[styles.buttonTxt, {color: 'gray'}]}>
                      Charges
                    </Text>
                    <Text style={[styles.buttonTxt, {color: 'white'}]}>
                      {new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(3.37)}
                      % + $
                      {new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(0.5)}
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
                      Total Amount
                    </Text>
                    {totalAmount ? (
                      <Text
                        style={[
                          styles.buttonTxt,
                          {
                            color: Colors.grin,
                            borderRadius: 10,
                            textAlign: 'center',
                            backgroundColor: 'black',
                            paddingVertical: 5,
                          },
                        ]}>
                        $
                        {new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totalAmount)}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.buttonTxt,
                          {
                            color: Colors.grin,
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
                </View>
              </Animated.View>
            )}
            {screenIndex == 2 && (
              <Animated.View
                entering={SlideInRight}
                exiting={SlideOutRight}
                style={[{flexDirection: 'row'}]}>
                <TouchableOpacity
                  onPress={openSheet}
                  style={[
                    styles.button,
                    {flexDirection: 'row', backgroundColor: Colors.grin},
                  ]}>
                  <Text style={[styles.buttonTxt, {color: 'black'}]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            {screenIndex == 3 && (
              <Animated.View
                entering={SlideInRight}
                exiting={SlideOutRight}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
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
                      Recipient
                    </Text>
                    <Text style={[styles.buttonTxt, {color: 'white'}]}>
                      {recipient}
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
                    {parsedAmount ? (
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
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(parsedAmount)}
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
                      20241703.{recipient}
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
                    {status === 'Complete' ? (
                      <Text style={[styles.buttonTxt, {color: Colors.grin}]}>
                        Complete
                      </Text>
                    ) : (
                      <Text style={[styles.buttonTxt, {color: 'gray'}]}>
                        Pending
                      </Text>
                    )}
                  </View>
                </View>
              </Animated.View>
            )}
            {screenIndex == 3 && (
              <Animated.View
                entering={SlideInRight}
                exiting={SlideOutRight}
                style={[{flexDirection: 'row'}]}>
                <TouchableOpacity
                  onPress={() => {
                    setScreenIndex(0);
                  }}
                  style={[
                    styles.button,
                    {flexDirection: 'row', backgroundColor: Colors.grin},
                  ]}>
                  <Text style={[styles.buttonTxt, {color: 'black'}]}>Done</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {screenIndex == 1 && (
              <Animated.View
                entering={SlideInLeft}
                exiting={SlideOutLeft}
                style={[{flexDirection: 'row'}]}>
                <TouchableOpacity
                  onPress={onContinue}
                  style={[
                    styles.button,
                    {
                      flexDirection: 'row',
                      backgroundColor: Colors.grin, // Set your desired background color
                    },
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
                  <Text style={[styles.buttonTxt, {color: 'black'}]}>Next</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
          </KeyboardAvoidingView>
        </Animated.View>
      </GestureDetector>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        onChange={resetState}
        enableDismissOnClose
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: 'transparent',
          borderRadius: 14,
        }}
        animationConfigs={animationConfigs}
        animateOnMount={true}
        handleIndicatorStyle={{
          backgroundColor: 'transparent',
          height: 10,
          width: '10%',
          borderRadius: 5,
        }}
        containerStyle={{
          paddingVertical: 10,
          alignSelf: 'center',
          marginStart: '2.5%',
          borderRadius: 14,
          width: '95%',
        }}
        backdropComponent={customBackDrop}
        enableHandlePanningGesture={true}
        bottomInset={10}
        detached={false}
        style={styles.sheetContainer}>
        <Animated.View
          entering={SlideInDown.duration(1000)}
          style={{
            flex: 1,
            width: '90%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => dismiss()}>
            <Image
              source={require('../../assets/img/interface/cross-small.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: Colors.grin,
                marginBottom: 10,
              }}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.buttonTxt,
              {fontSize: 18, color: 'white', marginBottom: 10},
            ]}>
            Confirm Payment
          </Text>
          <BottomSheetTextInput
            style={[
              styles.input,
              {
                color: 'white',
                borderWidth: 0,
                borderColor: 'black',
                backgroundColor: 'black',
              },
            ]}
            editable={true}
            textAlign="center"
            secureTextEntry
            maxLength={6}
            autoCapitalize="none"
            autoFocus
            inputMode="numeric"
            showSoftInputOnFocus
            placeholder="Enter Password"
            placeholderTextColor="white"
            caretHidden={true}
            cursorColor={Colors.grin}
            onChangeText={text => setPassword(text)}
            value={password}
          />
          <TouchableOpacity
            onPress={handleTransfer}
            style={[
              styles.button,
              {backgroundColor: Colors.grin, flexDirection: 'row'},
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
            <Text style={[styles.buttonTxt, {color: 'black'}]}>Transfer</Text>
          </TouchableOpacity>
        </Animated.View>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
};

const SuggestionNotes = ({onSelectSuggestion}) => {
  const suggestions = [
    {label: 'Birthday', value: 'Birthday 🎉', color: Colors.grin},
    {label: 'Payment', value: 'Payment 🛍️', color: Colors.grin}, // Updated suggestion
    // Add more suggestions as needed
  ];

  const handleSelectSuggestion = suggestion => {
    onSelectSuggestion(suggestion);
  };

  return (
    <FlatList
      data={suggestions}
      columnWrapperStyle={{
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      style={{
        alignSelf: 'center',
        marginBottom: 5,
      }}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2} // Change to 3 for 3 columns
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => handleSelectSuggestion(item.value)}
          style={{marginHorizontal: 5}}>
          <View
            style={[styles.suggestion, {flex: 1, backgroundColor: 'black'}]}>
            <Text style={styles.suggestionText}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const SuggestionAmount = ({onSelectAmount}) => {
  const amounts = [
    {label: '$50', value: '50', color: Colors.grin},
    {label: '$250', value: '250', color: Colors.grin},
    {label: '$300', value: '300', color: Colors.grin},
    // Add more suggestions as needed
  ];

  const handleSelectAmount = amounts => {
    onSelectAmount(amounts);
  };

  return (
    <FlatList
      data={amounts}
      columnWrapperStyle={{
        width: '100%',
        borderRadius: 14,
        justifyContent: 'space-between',
      }}
      style={{
        width: '80%',
        alignSelf: 'center',
        marginBottom: 7,
      }}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3} // Change to 3 for 3 columns
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => handleSelectAmount(item.value)}
          style={{marginHorizontal: 0}}>
          <View
            style={[styles.amounts, {flex: 1, backgroundColor: Colors.grin}]}>
            <Text style={styles.amountText}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const customBackDrop = () => {
  return (
    <BlurView
      style={styles.absolute}
      blurType="light"
      blurAmount={10}
      reducedTransparencyFallbackColor="white"
    />
  );
};

const styles = StyleSheet.create({
  suggestionsContainer: {
    alignItems: 'center',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  suggestion: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 2 - 40,
    height: 50,
    padding: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 14,
  },
  amounts: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (Dimensions.get('screen').width * 30) / 100 - 20,
    height: 50,
    padding: 5,
    borderWidth: 0.5,
    borderColor: Colors.grin,
    borderRadius: 14,
  },
  suggestionText: {
    color: Colors.grin,
    fontFamily: 'UberMoveBold',
    letterSpacing: 2,
    fontSize: 14,
  },
  amountText: {
    color: 'black',
    fontFamily: 'UberMoveBold',
    letterSpacing: 1,
    fontSize: 14,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  sheetContainer: {},
  contentContainer: {
    flex: 1,
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
  buttonTxt: {
    color: 'white', // Set your desired text color
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
    backgroundColor: 'black', // Set your desired background color
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
  inputPass: {
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
  details: {
    width: '80%',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  keypad: {
    width: Dimensions.get('window').width - 40,
    height: 70,
    lineHeight: 70,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontFamily: 'UberMoveBold',
    color: Colors.grin,
    paddingHorizontal: 16,
    fontSize: 36,
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
    borderWidth: 3,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
});

export default TransferScreen;
