// LoginScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  TextInput,
  FlatList,
  Alert,
  Keyboard,
} from 'react-native';

import {TouchableOpacity} from 'react-native';
import {supabase} from '../../../lib/supabase';
import Colors from '../../utils/Colors';
import {storage} from '../mmkv/instance';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-community/clipboard';
import Share from 'react-native-share';
import Animated, {
  FadeOut,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import {Directions, Gesture} from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import {FlashList} from '@shopify/flash-list';

interface SplashScreenProps {
  navigation: any; // You might want to replace 'any' with the proper navigation type
}

const NotificationsScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const [transfers, setTransfers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() => {
    fetchTransfers();
    fetchDeposits();
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
  }, []);

  async function fetchTransfers() {
    let {data: users} = await supabase.auth.getUser();

    const currentUser = users.user?.id;
    try {
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      const {data} = await supabase
        .from('transactions')
        .select('*')
        .eq('sender_id', currentUser)
        .order('id', {ascending: false})
        .limit(6);

      console.log('Your data', data);

      let {
        data: users,
        error,
        status,
      } = await supabase
        .from('transactions')
        .select('sender_username')
        .eq('sender_id', currentUser)
        .single();

      setTransfers(data);
      setUser(users?.sender_username);
    } catch (error) {
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

  async function fetchDeposits() {
    try {
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      let {data: users} = await supabase.auth.getUser();

      const currentUser = users.user?.id;

      const {data} = await supabase
        .from('transactions')
        .select('*')
        .eq('receiver_id', currentUser)
        .order('id', {ascending: false})
        .limit(6);

      console.log('Your data', data);

      setDeposits(data);
    } catch (error) {
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

  // Reverse selected transaction where transaction sender is logged in user / sender
  async function handleReverseTransaction(item, itemAmount, receiver_id) {
    try {
      let {data: users} = await supabase.auth.getUser();

      const userId = users.user?.id;

      // Fetch balance of receiver using receiver id
      let {data: amount} = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', userId)
        .single();

      // Fetch balance of receiver using receiver id
      let {data: balance, error} = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', receiver_id)
        .single();

      if (error) {
        console.log('Error getting receivers account balance:', error);
      }

      const receiverBalance = balance?.balance;
      const reverseAmount = itemAmount;
      const currentUserBalance = amount?.balance;

      // Check if receiver balance is equal to or greater than item amount
      // If not, return
      if (receiverBalance >= reverseAmount) {
        setIsLoading(true);
        // update receiver account balance, subtract reverse amount
        const updatedBalance = receiverBalance - JSON.parse(reverseAmount); // Calculate new balance
        const {error: updateError} = await supabase
          .from('accounts')
          .update({balance: updatedBalance})
          .eq('id', receiver_id);

        if (updateError) {
          console.log('Error updating receiver balance:', updateError);
          return;
        } else {
          // update sender account balance, add reverse amount
          const updatedBalance = currentUserBalance + JSON.parse(reverseAmount); // Calculate new balance
          const {error: updateError} = await supabase
            .from('accounts')
            .update({balance: updatedBalance})
            .eq('id', userId);

          if (updateError) {
            console.log('Error updating sender balance:', updateError);
            return;
          } else {
            // Delete selected transaction from transaction table
            const {data, error} = await supabase
              .from('transactions')
              .delete()
              .eq('id', item);

            if (error) {
              console.log('Error deleting transaction from database', error);
            }
          }
        }

        setIsLoading(false);
        setReverseTrans(true);
        setSelectedItem(item);
        setDeletedItem(item);
        fetchTransfers();
      } else {
        console.log(
          'Receiver balance is less than or not equal to amount:',
          receiverBalance,
        );
        setIsLoading(false);
        setDeleteOption(false);
        return;
      }
      // Fetch balance of receiver using receiver id
      let {data: newBalance} = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', userId)
        .single();

      // Fetch balance of receiver using receiver id
      let {data: newBalanceReceiver} = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', receiver_id)
        .single();

      console.log('Succeess reversing transaction.');
      console.log(
        `Sender new balance is $${newBalance?.balance} after reversing transaction`,
      );
      console.log(
        `Receiver new balance is $${newBalanceReceiver?.balance} after reversing transaction`,
      );
    } catch (error) {
      setIsLoading(false);
      console.log('Error reversing transaction:', error);
    }
  }

  async function handleSearchTransfers() {
    console.log('yes found:', searchQuery);
    try {
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      let {data: users} = await supabase.auth.getUser();

      const currentUser = users.user?.id;

      const {data} = await supabase
        .from('transactions')
        .select('*')
        .textSearch('receiver_username', searchQuery, {
          type: 'plain',
          config: 'English',
        });

      console.log('yes found:', data);
      setTransfers(data);
    } catch (error) {
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

  async function handleSearchDeposits() {
    console.log('Search query submitted:', searchDepositQuery);
    try {
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      let {data: users} = await supabase.auth.getUser();

      const currentUser = users.user?.id;

      const {data} = await supabase
        .from('transactions')
        .select('*')
        .textSearch('sender_username', searchDepositQuery, {
          type: 'plain',
          config: 'English',
        });

      console.log('melo found:', data);

      setDeposits(data);
      handleSearchSubmit;
    } catch (error) {
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDepositQuery, setSearchDepositQuery] = useState('');
  const [deleteOption, setDeleteOption] = useState(false);
  const [screenIndex, setScreenIndex] = useState(0);
  const [deletedItem, setDeletedItem] = useState();
  const [reverseTrans, setReverseTrans] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const senderAvatar = storage.getString('@url');

  const SPACING = 20;
  const AVATAR_SIZE = 70;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
  const CC_SIZE = Dimensions.get('window').width - 20;

  // const extractDateTime = createdAt => {
  //   const dateObject = new Date(createdAt);

  //   const [datePart, timePart] = createdAt.split('T');
  //   const [time, _] = timePart.split('+'); // Handle timezone offset

  //   // Extract only hours, minutes, and seconds
  //   const [hours, minutes] = time.split(':');

  //   const year = dateObject.getFullYear();
  //   const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  //   const day = String(dateObject.getDate()).padStart(2, '0');
  //   // const hours = String(dateObject.getHours()).padStart(2, '0');
  //   // const minutes = String(dateObject.getMinutes()).padStart(2, '0');
  //   // const seconds = String(dateObject.getSeconds()).padStart(2, '0');

  //   const formattedDate = datePart;
  //   const formattedTime = `${hours}:${minutes}`;

  //   return {date: formattedDate, time: formattedTime};
  // };

  // Usage
  // const createdAt = '2024-02-07T22:08:30.30823+00:00';
  // const {date, time} = extractDateTime(createdAt);
  // console.log('Date:', date); // Output: Date: 2024-02-06
  // console.log('Time:', time); // Output: Time: 00:12:26

  const onContinue = () => {
    const isLastScreen = screenIndex === 2;

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

  const options = {
    title: 'My thoughts.',
    message: 'I want to share more with the world!',
    url: 'https://google.com',
  };
  const onShare = async (myOptions = options) => {
    try {
      await Share.open(myOptions);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const pagerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePageChange = index => {
    setActiveIndex(index);
    console.log('Current screen index:', activeIndex);
  };

  const search = () => {
    if (activeIndex === 1) {
      handleSearchTransfers();
    } else if (activeIndex === 0) {
      handleSearchDeposits();
    }
  };

  const searchInputRef = useRef(null);

  const handleSearchSubmit = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return !fetchTransfers && !fetchDeposits ? (
    <ActivityIndicator
      color={Colors.grin}
      style={{flex: 1, backgroundColor: Colors.black}}
      size={'small'}
    />
  ) : (
    <View style={{flex: 1, backgroundColor: Colors.black}}>
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
          {activeIndex === 0 ? (
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
              placeholder="Search"
              placeholderTextColor="gray"
              caretHidden={false}
              cursorColor="white"
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
            />
          ) : (
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
              placeholder="Search"
              placeholderTextColor="gray"
              caretHidden={false}
              cursorColor="white"
              onChangeText={text => setSearchDepositQuery(text)}
              value={searchDepositQuery}
            />
          )}
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
          {activeIndex === 0 ? (
            <TouchableOpacity
              onPress={() => {
                handleSearchTransfers();
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="search" size={24} color={Colors.grin} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                handleSearchDeposits();
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="search" size={24} color={Colors.grin} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <PagerView
        style={{flex: 1}}
        initialPage={activeIndex}
        ref={pagerRef}
        onPageSelected={({nativeEvent}) =>
          handlePageChange(nativeEvent.position)
        }>
        <View key="1" style={{flex: 1, backgroundColor: Colors.black}}>
          <FlashList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchTransfers}
                progressBackgroundColor={Colors.grin}
                colors={[Colors.black, Colors.black]}
              />
            }
            onRefresh={fetchTransfers}
            refreshing
            horizontal={false}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            estimatedItemSize={100}
            data={transfers}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => {
              if (transfers.length > 0) {
                return (
                  <TouchableOpacity
                    onLongPress={async () => {
                      setDeleteOption(true);
                      setSelectedItem(item.id);
                      // console.log('ayyo',deleteOption);
                      // await onShare();
                    }}>
                    <Animated.View
                      entering={SlideInLeft}
                      exiting={FadeOut}
                      style={{
                        width: '95%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        alignSelf: 'center',
                      }}>
                      <Text style={[styles.sectionTitle, {color: Colors.red}]}>
                        2024-03-24 19:05
                      </Text>
                      <View
                        style={{
                          height: 100,
                          width: '100%',
                          borderWidth: 0.5,
                          borderColor: 'gray',
                          borderRadius: 14,
                          backgroundColor: 'black',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            height: 50,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            backgroundColor: 'transparent',
                            borderTopStartRadius: 14,
                            borderTopEndRadius: 14,
                            borderBottomColor: 'gray',
                            borderBottomWidth: 0.5,
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.labelText}>You've sent</Text>
                            <Text
                              style={[
                                styles.labelText,
                                {color: Colors.red, marginStart: 5},
                              ]}>
                              $
                              {new Intl.NumberFormat('en-US', {
                                maximumFractionDigits: 0,
                              }).format(item.amount)}
                            </Text>
                            <Text style={styles.labelText}>to</Text>
                            <Text
                              style={[
                                styles.labelText,
                                {color: Colors.red, marginStart: 5},
                              ]}>
                              {item.receiver_username}
                            </Text>
                          </View>

                          {deleteOption && selectedItem === item.id ? (
                            <TouchableOpacity
                              onPress={() => {
                                setDeleteOption(false);
                              }}
                              style={{
                                height: 24,
                                width: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Colors.black,
                                borderRadius: 12,
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
                          ) : (
                            <Image
                              source={require('../../assets/img/interface/clone.png')}
                              resizeMode="contain"
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 5,
                                tintColor: Colors.gray,
                              }}
                            />
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            height: 50,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            backgroundColor: 'transparent',
                            borderBottomEndRadius: 14,
                            borderBottomStartRadius: 14,
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.labelText}>Reference: </Text>
                            <Text
                              style={[
                                styles.labelText,
                                {color: Colors.red, marginStart: 5},
                              ]}>
                              20240324.1945
                            </Text>
                          </View>
                          {deleteOption && selectedItem === item.id ? (
                            <TouchableOpacity
                              onPress={() => {
                                handleReverseTransaction(
                                  item.id,
                                  item.amount,
                                  item.receiver_id,
                                );
                              }}
                              style={{
                                height: 24,
                                width: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Colors.black,
                                borderRadius: 12,
                              }}>
                              {isLoading ? (
                                <ActivityIndicator
                                  color={Colors.grin}
                                  size={24}
                                />
                              ) : reverseTrans && deletedItem === item.id ? (
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
                                  source={require('../../assets/img/interface/undo.png')}
                                  resizeMode="contain"
                                  style={{
                                    height: 24,
                                    width: 24,
                                    tintColor: Colors.grin,
                                  }}
                                />
                              )}
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() =>
                                Clipboard.setString(
                                  `You have sent $${item.amount} to ${item.receiver_username}. Reference: 20240324.1534.MD1409.`,
                                )
                              }>
                              <Image
                                source={require('../../assets/img/interface/trash.png')}
                                resizeMode="contain"
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginRight: 5,
                                  tintColor: Colors.gray,
                                }}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                );
              }
            }}
          />
        </View>
        <View key="2" style={{flex: 1, backgroundColor: Colors.black}}>
          <FlashList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchDeposits}
                progressBackgroundColor={Colors.grin}
                colors={[Colors.black, Colors.black]}
              />
            }
            onRefresh={fetchDeposits}
            refreshing
            horizontal={false}
            decelerationRate="fast"
            estimatedItemSize={100}
            data={deposits}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => {
              if (deposits.length > 0) {
                return (
                  <Animated.View
                    entering={SlideInRight.duration(500)}
                    style={{
                      width: '95%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                      alignSelf: 'center',
                    }}>
                    <Text style={[styles.sectionTitle, {color: Colors.grin}]}>
                      2024-03-24 19:05
                    </Text>
                    <View
                      style={{
                        height: 100,
                        width: '100%',
                        borderWidth: 0.5,
                        borderColor: 'gray',
                        borderRadius: 14,
                        backgroundColor: 'black',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 50,
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 10,
                          backgroundColor: 'transparent',
                          borderTopStartRadius: 14,
                          borderTopEndRadius: 14,
                          borderBottomColor: 'gray',
                          borderBottomWidth: 0.5,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.labelText}>You've received</Text>
                          <Text
                            style={[
                              styles.labelText,
                              {color: Colors.grin, marginStart: 5},
                            ]}>
                            $
                            {new Intl.NumberFormat('en-US', {
                              maximumFractionDigits: 0,
                            }).format(item.amount)}
                          </Text>
                          <Text style={styles.labelText}>from</Text>
                          <Text
                            style={[
                              styles.labelText,
                              {color: Colors.grin, marginStart: 5},
                            ]}>
                            {item.sender_username}
                          </Text>
                        </View>
                        <Image
                          source={require('../../assets/img/interface/clone.png')}
                          resizeMode="contain"
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: 5,
                            tintColor: Colors.grin,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: 50,
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 10,
                          backgroundColor: 'transparent',
                          borderBottomEndRadius: 14,
                          borderBottomStartRadius: 14,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.labelText}>Reference: </Text>
                          <Text
                            style={[
                              styles.labelText,
                              {color: Colors.grin, marginStart: 5},
                            ]}>
                            20240324.1945
                          </Text>
                        </View>
                        <TouchableOpacity>
                          <Image
                            source={require('../../assets/img/interface/trash.png')}
                            resizeMode="contain"
                            style={{
                              height: 20,
                              width: 20,
                              marginRight: 5,
                              tintColor: Colors.red,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                );
              }
            }}
          />
        </View>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  details: {
    width: '80%',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
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
    width: '47.5%',
    height: 50,
    backgroundColor: 'black', // Set your desired background color
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
  labelText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'UberMoveBold',
    color: 'gray',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: 'UberMoveBold',
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    alignSelf: 'flex-start',
    left: 10,
    letterSpacing: 1,
    marginBottom: 10,
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
    justifyContent: 'space-around',
    backgroundColor: 'black',
  },
});

export default NotificationsScreen;
