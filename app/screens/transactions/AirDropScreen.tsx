// LoginScreen.tsx
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  TextInput,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Vibration,
  TouchableWithoutFeedback,
  Pressable,
  RefreshControl,
  ImageBackground,
} from 'react-native';

import Animated, {
  Easing,
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
  FlatList,
} from 'react-native-gesture-handler';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  useBottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {BlurView} from '@react-native-community/blur';
import notifee, {
  AndroidColor,
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {storage} from '../mmkv/instance';
import PagerView from 'react-native-pager-view';

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

const AirDropScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const [transfers, setTransfers] = useState([]);
  const [airdrops, setAirdrops] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState('');

  const goToTabScreen = screenName => {
    navigation.navigate('Home', {
      screen: screenName,
    });
  };

  // Call goToTabScreen with the name of the screen you want to navigate to
  // For example:
  // goToTabScreen('Main');

  useEffect(() => {
    fetchAirdrops();
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
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
            <Icon name={'arrow-back'} size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setScreenIndex(0);
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/img/interface/airdrop.png')}
            resizeMode="contain"
            style={{
              height: 20,
              width: 20,
              tintColor: Colors.white,
            }}
          />
        </TouchableOpacity>
      ),
    });
    loadHiddenItems();
  }, [navigation]);

  useEffect(() => {
    notifee.onForegroundEvent(async ({detail}) => {
      if (
        EventType.ACTION_PRESS &&
        detail.pressAction.id === 'OPEN_NOTIFICATION'
      ) {
        // Navigate to the Notification screen
        navigation.navigate('Notifications');
      }
    });
    // Create a function to handle inserts
    const handleInserts = async payload => {
      // Get logged in user id
      let {data: users} = await supabase.auth.getUser();

      const client_id = users.user?.id;

      // Extract relevant data from the payload
      const {new: newRow} = payload;
      const {sender_username, receiver_id, amount} = newRow;

      if (client_id === receiver_id) {
        const message = '$' + amount + ' airdrop from @' + sender_username;

        onDisplayNotification(message);
        console.log('You have received $', amount);
        console.log('This is ther logged in user', client_id);
        console.log('This is the receiver', receiver_id);
      }
      console.log('Change received!', payload);
    };
    // Subscribe to changes in the transaction table
    supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'transactions'},
        handleInserts,
      )
      .subscribe();
  });

  useEffect(() => {
    // Subscribe to changes in the transaction table
    supabase
      .channel('airdrops')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'airdrops'},
        fetchAirdrops,
      )
      .subscribe();

    // Subscribe to changes in the transaction table
    supabase
      .channel('airdrops')
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'airdrops'},
        fetchAirdrops,
      )
      .subscribe();
  });

  async function onDisplayNotification(message) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      badge: true,
      vibration: true,
      lights: true,
      lightColor: AndroidColor.GREEN,
      vibrationPattern: [300, 500],
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Airdrop 💰',
      body: message,
      android: {
        channelId,
        lights: [AndroidColor.GREEN, 300, 500],
        vibrationPattern: [300, 500],
        visibility: AndroidVisibility.PRIVATE,
        autoCancel: false,
        importance: AndroidImportance.HIGH,
        largeIcon: require('../../assets/img/ic_flat.png'), // optional, defaults to 'ic_launcher'.
        timestamp: Date.now(), // 8 minutes ago
        showTimestamp: true,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
        asForegroundService: true,
      },
    });
  }

  async function fetchAirdrops() {
    try {
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      let {data: users} = await supabase.auth.getUser();

      const currentUser = users.user?.id;

      const {data, error} = await supabase
        .from('airdrops')
        .select('*')
        .gt('amount', 0)
        .order('id', {ascending: false});

      if (error) {
        console.log('Your error', data);
      } else {
        setAirdrops(data);
        console.log('Your data', data);
      }
    } catch (error) {
      console.log('Fetching error', error);
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

  const [screenIndex, setScreenIndex] = useState(0);

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

  const SPACING = 20;
  const AVATAR_SIZE = 70;
  const CELL_SIZE = Dimensions.get('window').width - SPACING * 7;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
  const FULL_SIZE = CELL_SIZE + SPACING;
  const CC_SIZE = Dimensions.get('window').width - 20;

  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [duration, setDuration] = useState('' || 0);
  const [amount, setAmount] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [hiddenItems, setHiddenItems] = useState([]);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOption, setDeleteOption] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [deletedItem, setDeletedItem] = useState();
  const [airdropDeleted, setAirdropDeleted] = useState(false);
  const [isBlur, setIsBlur] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const bottomSheetComplete = useRef<BottomSheetModal>(null);
  const presentSheet = () => bottomSheetRef.current?.present();
  const presentCompleteSheet = () => bottomSheetComplete.current?.present();
  const openSheet = () => {
    setIsBlur(true);
    presentSheet();
  };

  const [searchQuery, setSearchQuery] = useState('');

  async function handleSearch() {
    try {
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      let {data: users} = await supabase.auth.getUser();

      const currentUser = users.user?.id;

      const {data} = await supabase
        .from('airdrops')
        .select('*')
        .textSearch('creator_username', searchQuery, {
          type: 'plain',
          config: 'English',
        });

      console.log('Query found:', data);

      setAirdrops(data);
    } catch (error) {
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

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

  const handleSelectSuggestion = suggestion => {
    setSelectedSuggestion(suggestion);
    setDuration(suggestion);
  };

  const handleTranfer = (amount, item) => {
    storage.set('@airdropAmount', item);
    storage.set('@airdropId', item);
    openSheet();
  };

  const handleDeleteItem = item => {
    saveHiddenItem(item);
  };

  const loadHiddenItems = async () => {
    try {
      const hiddenItemsString = await AsyncStorage.getItem('@hiddenItems');
      if (hiddenItemsString) {
        setHiddenItems(JSON.parse(hiddenItemsString));
        console.log(JSON.parse(hiddenItemsString));
      }
    } catch (error) {
      console.log('Error loading hidden items:', error);
    }
  };

  const saveHiddenItem = async id => {
    try {
      const updatedHiddenItems = [...hiddenItems, id];
      await AsyncStorage.setItem(
        '@hiddenItems',
        JSON.stringify(updatedHiddenItems),
      );
      // const itemId = await AsyncStorage.getItem('id');
      setHiddenItems(updatedHiddenItems);
      fetchAirdrops();
    } catch (error) {
      console.error('Error saving hidden items:', error);
    }
  };

  const isHidden = id => hiddenItems.includes(id);

  // Delete airdrop where airdrop created_by is equal logged in users
  async function handleDeleteAirdrop(item) {
    try {
      let {data: users} = await supabase.auth.getUser();

      const userId = users.user?.id;

      // Fetch balance where user id is logged in user
      let {data: balance} = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', userId)
        .single();

      // Fetch row where id is selectedd item id
      let {data: airdrop, error} = await supabase
        .from('airdrops')
        .select('*')
        .eq('id', item)
        .single();

      if (error) {
        console.log('Getting airdrop data error', error);
      }

      const airdropCreator = airdrop?.created_by;
      const airdropAmount = airdrop?.amount;
      const currentUserBalance = balance?.balance;

      // Chcek if logged in user is equal to the selected airdrop creator
      // If not equal then return
      if (userId === airdropCreator) {
        setIsLoading(true);
        // update user account balance with selected to delete airdrop item
        const updatedBalance = currentUserBalance + JSON.parse(airdropAmount); // Calculate new balance
        const {error: updateError} = await supabase
          .from('accounts')
          .update({balance: updatedBalance})
          .eq('id', userId);

        if (updateError) {
          Alert.alert('Error updating user balance');
          return;
        }

        // Delete selected airdrop item
        const {data, error} = await supabase
          .from('airdrops')
          .delete()
          .eq('id', item);

        if (error) {
          console.log('Error deleting airdrop in database', error);
        }

        setIsLoading(false);
        setAirdropDeleted(true);
        setSelectedItem(item);
        setDeletedItem(item);
        fetchAirdrops();
        // Return the created airdrop data
        console.log('Your airdrop', data);
      } else {
        console.log(
          'Current user is not airdrop creator. Cannot delete airdrop selected',
        );
        setIsLoading(false);
        setDeleteOption(false);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error deleting airdrop', error);
    }
  }

  // Backend Logic (Supabase serverless function)
  async function createAirdrop() {
    setIsLoading(true);
    try {
      let {data: users} = await supabase.auth.getUser();

      const created_by = users.user?.id;
      //check airdrop amount is less than or equal to current user balance
      let {data: user} = await supabase
        .from('profiles')
        .select('username')
        .eq('id', created_by)
        .single();

      const username = user?.username;

      console.log('Profile username: ', username);

      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + duration);

      //check airdrop amount is less than or equal to current user balance
      let {data: balance} = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', created_by)
        .single();

      const currentUserBalance = balance?.balance;

      if (amount <= currentUserBalance) {
        // update user account balance
        const updatedBalance = currentUserBalance - JSON.parse(amount); // Calculate new balance
        const {error: updateError} = await supabase
          .from('accounts')
          .update({balance: updatedBalance})
          .eq('id', created_by);

        if (updateError) {
          Alert.alert('Error updating sender balance');
          return;
        }

        // Insert a new row in the 'airdrops' table with the calculated expiry time
        const {data, error} = await supabase.from('airdrops').insert({
          amount: amount,
          duration: duration,
          verification_code: verificationCode,
          expiry_time: expiryTime,
          creator_username: username,
          created_by: created_by,
        });

        if (error) {
          console.log('Error inserting airdrop in database', error);
        }

        setIsLoading(false);
        fetchAirdrops();
        setScreenIndex(0);
        // Return the created airdrop data
        console.log('Your airdrop', data);
      } else {
        console.log('Airdrop amount is greator than current balance');
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error creating airdrop', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTransfer = async code => {
    setIsLoading(true);
    // setScreenIndex(3);
    // setStatus('Complete');
    const amount = storage.getNumber('@airdropAmount');
    const item = storage.getNumber('@airdropId');

    let {data: users} = await supabase.auth.getUser();

    const currentUser = users.user?.id;

    try {
      // Query user data by userId
      let {data: users} = await supabase
        .from('accounts')
        .select('*')
        .eq('id', currentUser)
        .single();

      if (users) {
        console.log('User data', users);
      } else {
        console.log('Error getting user data');
        Vibration.vibrate(100);
        return;
      }

      // Query airdop creator by id selected
      let {data, error, status} = await supabase
        .from('airdrops')
        .select('*')
        .eq('id', item)
        .single();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      } else {
        console.log('Airdrop by id data', data);
      }

      const creator = data?.created_by;

      if (currentUser === creator) {
        // Prevent the transaction and display a message to the user
        Alert.alert('You cannot send money to your own account.');
        return;
      } else {
        console.log('Airdrop by creator id', creator);
      }

      // Deduct amount from sender's balance
      // Update recipient's balance
      // Store transaction details in the transactions table

      // Deduct amount from sender's balance
      const currentUserBalance = users?.balance;

      try {
        const airdropAmount = data?.amount;
        const minAmount = parseFloat(airdropAmount) / 50; // Convert amount to float

        // Implement your logic to check if the sender has sufficient balance
        // You may also want to check for minimum balance, daily transaction limits, etc.
        if (airdropAmount < minAmount) {
          // Display an error message and prevent the transaction
          Alert.alert('You dont have money, add funds to acount.');
          return;
        }

        const currentTimestamp = new Date();
        const expiryTime = new Date(data?.expiry_time);
        console.log(currentTimestamp, expiryTime);

        if (currentTimestamp < expiryTime) {
          // Transfer the specified amount to the user's account balance
          // Implement your logic here

          // Prompt user to confirm the transaction with their password
          // You might want to implement OTP or more secure authentication
          const confirmed = await confirmAirdropVerificationCode(code, item);

          if (!confirmed) {
            Alert.alert('Transaction not confirmed');
            return;
          }

          const updatedReceiverBalance = currentUserBalance + minAmount; // Calculate new balance
          const {error: updateReceiverError} = await supabase
            .from('accounts')
            .update({balance: updatedReceiverBalance})
            .eq('id', currentUser);

          if (updateReceiverError) {
            Alert.alert('Error updating sender balance');
            return;
          }

          const updatedAirdropBalance = airdropAmount - minAmount; // Calculate new balance

          // Update airdrop balance
          const {error: updateAirdropError} = await supabase
            .from('airdrops')
            .update({amount: updatedAirdropBalance}) // Decrement balance
            .eq('id', item);

          if (updateAirdropError) {
            Alert.alert('Error updating recipient balance');
            return;
          }

          const {data} = await supabase
            .from('profiles')
            .select('username')
            .eq('id', creator)
            .single();

          const sender_id = creator;
          const sender_username = data?.username;
          const receive_username = users?.username;

          // Insert transaction in trans table
          const {error: trasnError} = await supabase
            .from('transactions')
            .insert({
              amount: minAmount,
              sender_id: sender_id,
              sender_username: sender_username,
              receiver_id: currentUser,
              receiver_username: receive_username,
            }); // Insert transaction in trans table

          if (trasnError) {
            Alert.alert('Failed to insert transaction');

            return;
          }

          console.log('Success', 'Transaction completed successfully');
          console.log('Update airdrop balance', airdropAmount);

          // setScreenIndex(3);
          saveHiddenItem(item);
          setIsLoading(false);
          dismiss();

          const transfeeMsg = '$' + amount + ' sent to @' + receive_username;

          onDisplayNotification(transfeeMsg);
          fetchAirdrops();
        } else {
          setIsLoading(false);
          dismiss();
          // Airdrop has expired
          console.log('Airdrop has expired', expiryTime);
          return;
          // Handle expired airdrop
        }
      } catch (error) {
        console.log('error', error);
      }
      // openCompleteSheet();
    } catch (error) {
      console.log('Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAirdropVerificationCode = async (code, item) => {
    // Verify password with the user's profile data
    // Implement your authentication logic
    // For demonstration, you can compare the password with a stored hash
    let {data: users} = await supabase.auth.getUser();

    const currentUser = users.user?.id;

    const {data: userData, error: userError} = await supabase
      .from('airdrops')
      .select('verification_code')
      .eq('id', item)
      .single();

    if (userError || !userData) {
      throw new Error('Airdrop not found');
    }

    console.log('Airdrop found: ');
    // Compare the entered password with the stored hash
    // Implement your password verification logic
    const isPasswordCorrect = compareCodeHash(code, userData.verification_code);
    return isPasswordCorrect;
  };

  const compareCodeHash = (code, hash) => {
    // Implement password comparison logic (e.g., using bcrypt)
    // For demonstration, you can compare the plain password with the stored hash
    return code === hash;
  };

  const pagerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePageChange = index => {
    setActiveIndex(index);
    console.log('Current screen index:', activeIndex);
  };

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'black'}}>
      {activeIndex === 0 ? (
        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('screen').width - 20,
            marginBottom: 15,
            backgroundColor: Colors.black,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: 50,
              borderRadius: 25,
              borderWidth: 0.5,
              borderColor: Colors.gray,
            }}>
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.replace('Main');
                }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="close" size={24} color={Colors.grin} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 50,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'UberMoveBold',
                  color: 'gray',
                  fontSize: 14,
                  letterSpacing: 2,
                }}>
                Create Airdrop
              </Text>
            </View>
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setActiveIndex(1);
                }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="information-circle" size={24} color={Colors.grin} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('screen').width - 20,
            marginBottom: 15,
            backgroundColor: Colors.black,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: 50,
              borderTopLeftRadius: 25,
              borderBottomLeftRadius: 25,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              borderWidth: 0.5,
              borderColor: Colors.gray,
            }}>
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  handleSearch();
                }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="search" size={24} color={Colors.grin} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{
                height: 50,
                flex: 1,
                borderRadius: 25,
                fontFamily: 'UberMoveBold',
                color: 'white',
                fontSize: 14,
                letterSpacing: 2,
              }}
              editable
              autoCapitalize="none"
              placeholder="Search airdrops"
              placeholderTextColor="gray"
              caretHidden={false}
              cursorColor="white"
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
            />
          </View>
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              borderTopRightRadius: 25,
              borderBottomRightRadius: 25,
              borderColor: Colors.gray,
              borderWidth: 0.5,
              marginStart: 5,
            }}>
            <TouchableOpacity
              onPress={() => {
                setActiveIndex(0);
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="scan" size={24} color={Colors.grin} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <PagerView
        style={{
          flex: 1,
          backgroundColor: 'black',
        }}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={({nativeEvent}) =>
          handlePageChange(nativeEvent.position)
        }>
        <View key="1" style={{flex: 1}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
                  placeholder="Enter amount"
                  inputMode="numeric"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setAmount(text)}
                  value={amount}
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
                placeholder="Claim code"
                placeholderTextColor="black"
                caretHidden={false}
                cursorColor="black"
                onChangeText={text => setVerificationCode(text)}
                value={verificationCode}
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
                    createAirdrop();
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
          </KeyboardAvoidingView>
        </View>
        <View
          key="2"
          style={{
            flex: 1,
            width: '100%',
            alignSelf: 'center',
          }}>
          <FlatList
            collapsable
            numColumns={2}
            columnWrapperStyle={{
              width: CC_SIZE,
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginBottom: SPACING,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchAirdrops}
                colors={['#9Bd35A', '#689F38']}
                // Progress background color on iOS
                tintColor="#9Bd35A"
                // Background color on Android
              />
            }
            onRefresh={fetchAirdrops}
            refreshing
            horizontal={false}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            data={airdrops}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => {
              if (airdrops === null) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setScreenIndex(0);
                    }}
                    style={{
                      height: 100,
                      width: Dimensions.get('screen').width / 2 - 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.black,
                      borderWidth: 0.5,
                      borderColor: Colors.gray,
                      borderRadius: 14,
                    }}>
                    <Image
                      source={require('../../assets/img/interface/airdrop.png')}
                      resizeMode="contain"
                      style={{
                        height: 50,
                        width: 50,
                        tintColor: Colors.grin,
                      }}
                    />
                    {/* <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'UberMoveBold',
                              color: Colors.grin,
                              letterSpacing: 1,
                              textAlign: 'center',
                              marginTop: '5%',
                            }}>
                            Kwacha
                          </Text> */}
                  </TouchableOpacity>
                );
              } else if (airdrops.length > 0) {
                return isHidden(item.id) ? (
                  <View
                    style={{
                      width: Dimensions.get('screen').width / 2 - 20,
                      padding: SPACING - 5,
                      backgroundColor: Colors.white,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 14,
                    }}>
                    <View
                      style={{
                        height: 50,
                        paddingHorizontal: SPACING - 5,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderColor: 'black',
                        borderRadius: 14,
                        flexDirection: 'row',
                        backgroundColor: 'black',
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'UberMoveBold',
                          color: Colors.grin,
                          letterSpacing: 1,
                          textAlign: 'center',
                        }}>
                        $
                        {new Intl.NumberFormat('en-US', {
                          currency: 'USD',
                          maximumFractionDigits: 2,
                        }).format(item.amount)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'UberMoveBold',
                          color: 'gray',
                          letterSpacing: 1,
                        }}>
                        ($
                        {new Intl.NumberFormat('en-US', {
                          currency: 'USD',
                          maximumFractionDigits: 2,
                        }).format(item.amount / 50)}
                        )
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: 15,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                          style={{
                            height: 50,
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Colors.grin,
                            borderWidth: 1,
                            borderColor: 'black',
                            borderRadius: 14,
                          }}>
                          <Image
                            source={require('../../assets/img/profile/balaclava4.jpg')}
                            resizeMode="contain"
                            style={{
                              height: 46,
                              width: 46,
                              borderRadius: 12,
                            }}
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            height: 50,
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            backgroundColor: Colors.black,
                            borderColor: 'black',
                            borderRadius: 14,
                          }}>
                          <Image
                            source={require('../../assets/img/interface/lock.png')}
                            resizeMode="contain"
                            style={{
                              height: 24,
                              width: 24,
                              tintColor: Colors.grin,
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          alignSelf: 'flex-start',
                          left: '2%',
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'UberMoveBold',
                            color: 'black',
                            letterSpacing: 1,
                          }}>
                          Drop by @{item.creator_username}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <Pressable
                    onLongPress={() => {
                      setDeleteOption(true);
                      setSelectedItem(item.id);
                    }}
                    style={{
                      width: Dimensions.get('screen').width / 2 - 20,
                      padding: SPACING - 5,
                      backgroundColor: 'white',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderRadius: 14,
                    }}>
                    <View
                      style={{
                        height: 50,
                        paddingHorizontal: SPACING - 5,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderColor: 'black',
                        borderRadius: 14,
                        flexDirection: 'row',
                        backgroundColor: 'black',
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'UberMoveBold',
                          color: Colors.grin,
                          letterSpacing: 1,
                          textAlign: 'center',
                        }}>
                        $
                        {new Intl.NumberFormat('en-US', {
                          currency: 'USD',
                          maximumFractionDigits: 2,
                        }).format(item.amount)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'UberMoveBold',
                          color: 'gray',
                          letterSpacing: 1,
                        }}>
                        ($
                        {new Intl.NumberFormat('en-US', {
                          currency: 'USD',
                          maximumFractionDigits: 2,
                        }).format(item.amount / 50)}
                        )
                      </Text>
                    </View>
                    {deleteOption && selectedItem === item.id ? (
                      <View
                        style={{
                          marginTop: 15,
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              setDeleteOption(false);
                            }}
                            style={{
                              height: 50,
                              width: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: Colors.black,
                              borderWidth: 1,
                              borderColor: 'black',
                              borderRadius: 14,
                            }}>
                            <Image
                              source={require('../../assets/img/interface/cross-small.png')}
                              resizeMode="contain"
                              style={{
                                height: 24,
                                width: 24,
                                tintColor: Colors.grin,
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              handleDeleteAirdrop(item.id);
                            }}
                            style={{
                              height: 50,
                              width: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderWidth: 1,
                              backgroundColor: Colors.black,
                              borderColor: 'black',
                              borderRadius: 14,
                            }}>
                            {isLoading ? (
                              <ActivityIndicator
                                color={Colors.grin}
                                size={'small'}
                              />
                            ) : airdropDeleted && deletedItem === item.id ? (
                              <Image
                                source={require('../../assets/img/interface/check-circle2.png')}
                                resizeMode="contain"
                                style={{
                                  height: 24,
                                  width: 24,
                                  tintColor: Colors.grin,
                                }}
                              />
                            ) : (
                              <Image
                                source={require('../../assets/img/interface/trash.png')}
                                resizeMode="contain"
                                style={{
                                  height: 24,
                                  width: 24,
                                  tintColor: 'red',
                                }}
                              />
                            )}
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            alignSelf: 'flex-start',
                            left: '2%',
                            marginTop: 5,
                          }}>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'UberMoveBold',
                              color: 'black',
                              letterSpacing: 1,
                            }}>
                            Drop by @{item.creator_username}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          marginTop: 15,
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            style={{
                              height: 50,
                              width: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: Colors.grin,
                              borderWidth: 1,
                              borderColor: 'black',
                              borderRadius: 14,
                            }}>
                            <Image
                              source={require('../../assets/img/profile/balaclava4.jpg')}
                              resizeMode="contain"
                              style={{
                                height: 46,
                                width: 46,
                                borderRadius: 12,
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              handleTranfer(item.amount, item.id);
                            }}
                            style={{
                              height: 50,
                              width: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderWidth: 1,
                              backgroundColor: Colors.grin,
                              borderColor: 'black',
                              borderRadius: 14,
                            }}>
                            <Image
                              source={require('../../assets/img/interface/plus-hexagon.png')}
                              resizeMode="contain"
                              style={{
                                height: 24,
                                width: 24,
                                tintColor: 'black',
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            alignSelf: 'flex-start',
                            left: '2%',
                            marginTop: 5,
                          }}>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'UberMoveBold',
                              color: 'black',
                              letterSpacing: 1,
                            }}>
                            Drop by @{item.creator_username}
                          </Text>
                        </View>
                      </View>
                    )}
                  </Pressable>
                );
              }
            }}
          />
        </View>
      </PagerView>
      {!airdrops && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={Colors.grin} size={'large'} />
        </View>
      )}
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
            autoCapitalize="none"
            autoFocus
            showSoftInputOnFocus
            placeholder="Enter Code"
            placeholderTextColor="white"
            caretHidden={true}
            cursorColor={Colors.grin}
            onChangeText={text => setCode(text)}
            value={code}
          />
          <TouchableOpacity
            onPress={() => {
              handleTransfer(code);
            }}
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
            <Text style={[styles.buttonTxt, {color: 'black'}]}>Proceed</Text>
          </TouchableOpacity>
        </Animated.View>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
};

const customBackDrop = () => {
  return (
    <BlurView
      style={styles.absolute}
      blurType="dark"
      blurAmount={50}
      reducedTransparencyFallbackColor="white"
    />
  );
};

const SuggestionNotes = ({onSelectSuggestion}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const suggestions = [
    {label: '10Min', value: '10', color: Colors.grin},
    {label: '20Min', value: '20', color: Colors.grin},
    {label: '30Min', value: '30', color: Colors.grin},
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
            },
            styles.suggestion,
          ]}>
          <View
            style={[
              {flex: 1, justifyContent: 'center', backgroundColor: 'black'},
            ]}>
            <Text style={styles.suggestionText}>{item.label}</Text>
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
    padding: 10,
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

export default AirDropScreen;
