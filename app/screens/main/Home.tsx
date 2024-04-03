import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';

import {featuresData} from '../../data/data';
import {Vibration} from 'react-native';
import {supabase} from '../../../lib/supabase';
import notifee, {
  AndroidColor,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {storage} from '../mmkv/instance';
import {
  DrawerActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import PagerView from 'react-native-pager-view';
import Toast from 'react-native-toast-message';
import SettingsScreen from '../settings/SettingsScreen';
import WalletScreens from '../wallet/WalletScreen';
import StatScreen from '../stats/statistics';
import {Session} from '@supabase/supabase-js';

function HomeScreen({session}: {session: Session}) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [balance, setBalance] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  async function handleSearch(text) {
    setSearchQuery(text);
    try {
      setShowResults(true);
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      const {data, error} = await supabase
        .from('profiles')
        .select('first_name, last_name, username, avatar_url')
        .textSearch('username', searchQuery, {
          type: 'plain',
          config: 'English',
        });

      if (error) {
        console.log('Error:', error);
      }

      console.log('Friend found:', data);

      setFriends(data);
    } catch (error) {
      console.log('Error searching for friends:', error);
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

  const header = () => {
    return (
      <View
        style={{
          height: 160,
          width: Dimensions.get('window').width - 20,
          marginBottom: 15,
          alignSelf: 'center',
          borderRadius: 14,
          alignItems: 'center',
          padding: 25,
          justifyContent: 'center',
          backgroundColor: 'black',
          borderColor: Colors.gray,
          borderWidth: 0.5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignSelf: 'center',
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            {username ? (
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'UberMoveBold',
                  flexWrap: 'wrap',
                  letterSpacing: 2,
                }}>
                Hie 👋, {username}!
              </Text>
            ) : (
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'UberMoveBold',
                  flexWrap: 'wrap',
                  letterSpacing: 2,
                }}>
                Hie 👋, {storedUser}!
              </Text>
            )}
            {balance ? (
              <Text
                style={{
                  color: 'white',
                  fontSize: 32,
                  fontFamily: 'UberMoveBold',
                  flexWrap: 'wrap',
                  letterSpacing: 2,
                }}>
                $
                {new Intl.NumberFormat('en-US', {
                  currency: 'USD',
                  maximumFractionDigits: 2,
                }).format(balance)}
              </Text>
            ) : (
              <Text
                style={{
                  color: 'black',
                  fontSize: 32,
                  fontFamily: 'UberMoveBold',
                  flexWrap: 'wrap',
                  letterSpacing: 2,
                }}>
                $
                {new Intl.NumberFormat('en-US', {
                  currency: 'USD',
                  maximumFractionDigits: 2,
                }).format(storedBalance)}
              </Text>
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontFamily: 'UberMoveBold',
                flexWrap: 'wrap',
                letterSpacing: 2,
              }}>
              Your Balance
            </Text>
          </View>
          {storedAvatar ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.replace('Profile');
                }}>
                <View
                  style={{
                    height: 90,
                    width: 90,
                    borderRadius: 45,
                    backgroundColor: Colors.grin,
                    borderWidth: 1,
                    borderColor: Colors.grin,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={{uri: storedAvatar}}
                    resizeMode="contain"
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: 40,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.replace('Profile');
                }}>
                <View
                  style={{
                    height: 110,
                    width: 70,
                    borderRadius: 14,
                    backgroundColor: 'black',
                    borderWidth: 1,
                    borderColor: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={{uri: avatar}}
                    resizeMode="contain"
                    style={{
                      height: 100,
                      width: 60,
                      borderRadius: 10,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderFeatures = () => {
    //const handleTransferSheet = () => BottomSheetRef.current?.present();

    return (
      <View
        style={{
          flex: 1,
          width: Dimensions.get('screen').width - 20,
          alignSelf: 'center',
        }}>
        {friends.length > 0 ? (
          <FlashList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                progressBackgroundColor={Colors.grin}
                colors={[Colors.black, Colors.black]}
              />
            }
            refreshing
            horizontal={false}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            estimatedItemSize={100}
            data={friends}
            keyExtractor={item => `${item.id}`}
            renderItem={({item, index}) => {
              if (friends?.length > 0) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.replace('SearchProfile', {
                        avat: item.avatar_url,
                        user: item.username,
                        firstname: item.first_name,
                        lastname: item.last_name,
                      });
                    }}>
                    <Animated.View
                      entering={FadeIn}
                      exiting={FadeOut}
                      style={{
                        height: 60,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                        paddingStart: 5,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        borderWidth: 0.5,
                        borderColor: Colors.gray,
                        backgroundColor: Colors.black,
                        borderRadius: 30,
                      }}>
                      <Image
                        source={{uri: `${item.avatar_url}`}}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                        }}
                      />
                      <View
                        style={{
                          height: 50,
                          width: '50%',
                          alignItems: 'flex-start',
                          justifyContent: 'space-around',
                        }}>
                        <Text style={[styles.labelText, {color: Colors.white}]}>
                          {item.first_name} {item.last_name}
                        </Text>
                        <Text style={[styles.labelText, {color: Colors.gray}]}>
                          @{item.username}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          name="chevron-forward"
                          size={24}
                          color={Colors.grin}
                        />
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                );
              }
            }}
          />
        ) : (
          <FlatList
            ListHeaderComponent={header()}
            numColumns={3}
            columnWrapperStyle={{
              borderRadius: 18,
              justifyContent: 'space-between',
            }}
            data={featuresData}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => (
              <View
                style={{
                  height: 100,
                  width: '30%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'black',
                  marginBottom: 15,
                  borderRadius: 14,
                  borderWidth: 0.5,
                  borderColor: Colors.gray,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    switch (item.id) {
                      case 1:
                        navigation.replace('TopUp');
                        break;
                      case 2:
                        navigation.replace('Transfer');
                        break;
                      case 3:
                        navigation.replace('Request');
                        break;
                      case 4:
                        navigation.replace('AirDrop');
                        break;
                      case 5:
                        navigation.replace('Music');
                        break;
                      case 6:
                        navigation.replace('Identity');
                        break;

                      default:
                        break;
                    }
                  }}
                  style={{
                    height: '50%',
                    width: '50%',
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: 'black',
                    backgroundColor: Colors.grin,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={item.icon}
                    resizeMode="contain"
                    style={{
                      height: 24,
                      width: 24,
                      tintColor: 'black',
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    marginTop: 5,
                    fontFamily: 'UberMoveBold',
                    flexWrap: 'wrap',
                    letterSpacing: 2,
                  }}>
                  {item.description}
                </Text>
              </View>
            )}
            ListFooterComponent={footer()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  };
  const [favorite, setFavorite] = useState([]);

  async function handleFavourites() {
    try {
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      // Get logged in user id
      let {data: users} = await supabase.auth.getUser();

      const client_id = users.user?.id;

      const {data: favorites, error} = await supabase
        .from('favorites')
        .select('favorites_name')
        .eq('favorites_of', client_id);

      if (error) {
        console.log('Error:', error);
      }

      console.log('Favourites found:', favorites);

      // Extracting usernames from favorites
      const usernames = favorites.map(favorite => favorite.favorites_name);

      // Query profiles where username is in the list of usernames
      const {data: profiles, error: profileError} = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .in('username', usernames)
        .limit(3);

      if (profileError) {
        console.log('Profile Error:', profileError);
      }

      console.log('Profiles found:', profiles);
      setFavorite(profiles);
      setRefreshing(false);
    } catch (error) {
      console.log('Error searching for favorites:', error);
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

  useEffect(() => {
    handleFavourites();
  }, []);

  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Function to scroll to the next page in a loop
    const scrollLoop = () => {
      // Calculate the next page index
      const nextPage = (currentPage + 1) % 3;

      // Scroll to the next page
      pagerRef.current?.setPageWithoutAnimation(nextPage);

      // Update the current page state
      setCurrentPage(nextPage);
    };

    // Start scrolling loop
    const intervalId = setInterval(scrollLoop, 10000);

    // Clear interval to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [currentPage]);

  const footer = () => {
    return (
      <PagerView
        ref={pagerRef}
        initialPage={0}
        orientation={'vertical'}
        onPageSelected={event => setCurrentPage(event.nativeEvent.position)}
        style={{
          flexDirection: favorite ? 'column' : 'row',
          height: 160,
          width: Dimensions.get('window').width - 20,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          elevation: 4,
        }}>
        <View
          key="1"
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            borderRadius: 14,
            backgroundColor: Colors.white,
            borderWidth: 0.5,
            borderColor: Colors.gray,
          }}>
          <Animated.Image
            source={require('../../assets/img/mephis4.jpg')}
            resizeMode="contain"
            style={{
              height: '100%',
              width: '50%',
              borderTopLeftRadius: 14,
              borderBottomLeftRadius: 14,
            }}
          />
          <Animated.Image
            source={require('../../assets/img/mephis6.jpg')}
            resizeMode="contain"
            style={{
              height: '100%',
              width: '50%',
              borderTopRightRadius: 14,
              borderBottomRightRadius: 14,
            }}
          />
        </View>
        <View
          key="2"
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderRadius: 14,
            backgroundColor: Colors.black,
            borderWidth: 0.5,
            borderColor: Colors.gray,
          }}>
          <Animated.Image
            source={require('../../assets/img/mephis1.png')}
            resizeMode="contain"
            style={{
              height: '90%',
              width: '45%',
              borderTopLeftRadius: 14,
              borderBottomLeftRadius: 14,
            }}
          />
          <Animated.Image
            source={require('../../assets/img/mephis2.png')}
            resizeMode="contain"
            style={{
              height: '90%',
              width: '45%',
              borderTopRightRadius: 14,
              borderBottomRightRadius: 14,
            }}
          />
        </View>
        <View
          key="3"
          style={{
            flex: 1,
            height: '100%',
            borderRadius: 14,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 25,
            paddingVertical: 15,
            backgroundColor: Colors.black,
            borderWidth: 0.5,
            borderColor: Colors.gray,
          }}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.white,
                fontFamily: 'UberMoveBold',
                textAlign: 'center',
                letterSpacing: 1,
              }}>
              My Favorites
            </Text>
            <View
              style={{
                backgroundColor: Colors.black,
                borderRadius: 25,
                borderColor: Colors.grin,
                borderWidth: 1,
                height: 30,
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.gray,
                  fontFamily: 'UberMoveBold',
                  textAlign: 'center',
                  letterSpacing: 1,
                }}>
                View All
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 25,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    height: 60,
                    width: 60,
                    borderWidth: 3,
                    borderColor: Colors.grin,
                    backgroundColor: Colors.black,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="add" size={24} color={Colors.grin} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 5,
                    color: Colors.gray,
                    fontFamily: 'UberMoveBold',
                    letterSpacing: 1,
                    textAlign: 'center',
                  }}>
                  Add
                </Text>
              </View>
              {favorite.map((favorite, index) => (
                <View
                  key={index}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.replace('SearchProfile', {
                        avat: favorite.avatar_url,
                        user: favorite.username,
                      });
                    }}
                    style={{
                      height: 60,
                      width: 60,
                      borderWidth: 3,
                      borderColor: Colors.grin,
                      backgroundColor: Colors.black,
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      onLoad={() => {
                        handleFavourites();
                      }}
                      source={{uri: favorite.avatar_url}}
                      resizeMode="contain"
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 5,
                      color: Colors.gray,
                      fontFamily: 'UberMoveBold',
                      textAlign: 'center',
                    }}>
                    @{favorite.username}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View
          key="4"
          style={{
            flex: 1,
            height: '100%',
            borderRadius: 14,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 25,
            paddingVertical: 15,
            backgroundColor: Colors.black,
            borderWidth: 0.5,
            borderColor: Colors.gray,
          }}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.white,
                fontFamily: 'UberMoveBold',
                textAlign: 'center',
                letterSpacing: 1,
              }}>
              My Favorites
            </Text>
            <View
              style={{
                backgroundColor: Colors.black,
                borderRadius: 25,
                borderColor: Colors.grin,
                borderWidth: 1,
                height: 30,
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.gray,
                  fontFamily: 'UberMoveBold',
                  textAlign: 'center',
                  letterSpacing: 1,
                }}>
                View All
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 25,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    height: 60,
                    width: 60,
                    borderWidth: 3,
                    borderColor: Colors.grin,
                    backgroundColor: Colors.black,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="add" size={24} color={Colors.grin} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 5,
                    color: Colors.gray,
                    fontFamily: 'UberMoveBold',
                    letterSpacing: 1,
                    textAlign: 'center',
                  }}>
                  Add
                </Text>
              </View>
              {favorite.map((favorite, index) => (
                <View
                  key={index}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.replace('SearchProfile', {
                        avat: favorite.avatar_url,
                        user: favorite.username,
                      });
                    }}
                    style={{
                      height: 60,
                      width: 60,
                      borderWidth: 3,
                      borderColor: Colors.grin,
                      backgroundColor: Colors.black,
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      onLoad={() => {
                        handleFavourites();
                      }}
                      source={{uri: favorite.avatar_url}}
                      resizeMode="contain"
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 5,
                      color: Colors.gray,
                      fontFamily: 'UberMoveBold',
                      textAlign: 'center',
                    }}>
                    @{favorite.username}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </PagerView>
    );
  };

  useEffect(() => {
    // Create a function to handle inserts
    const handleInserts = async payload => {
      // Get logged in user id
      let {data: users} = await supabase.auth.getUser();

      const client_id = users.user?.id;

      // Extract relevant data from the payload
      const {new: newRow} = payload;
      const {sender_username, receiver_id, amount} = newRow;

      if (client_id === receiver_id) {
        const message = '$' + amount + ' received from @' + sender_username;

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
      title: 'New Payment 💰',
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

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count

    const storedBalance = storage.getNumber('userBalance');
    const storedUser = storage.getString('@username');

    setBalance(storedBalance);
    setUsername(storedUser);

    if (isFocused) {
      syncBalance();
    } else {
      syncBalance;
    }
  }, [isFocused, syncBalance]);

  const storedBalance = storage.getNumber('userBalance');
  const storedUser = storage.getString('@username');
  const storedAvatar = storage.getString('avatar');

  async function syncBalance() {
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
        .select('*')
        .eq('id', client_id)
        .single();

      let {data: avatar_url} = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', client_id)
        .single();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }

      storage.set('userBalance', users?.balance);

      storage.set('@username', users?.username);

      storage.set('avatar', avatar_url?.avatar_url);

      // Handle successful sync balance
      console.log('User:', users?.balance);
    } catch (error) {
      console.error('Error refreshing balance in:', error);
    } finally {
      const storedBalance = storage.getNumber('userBalance');
      const storedUser = storage.getString('@username');
      const storedAvatar = storage.getString('avatar');

      setBalance(storedBalance);
      setUsername(storedUser);
      setAvatar(storedAvatar);

      console.log('Balance cached:', storedBalance);
      console.log('Username cached:', storedUser);
      console.log('Avatar cached:', storedAvatar);
    }
  }

  const showToast = () => {
    Toast.show({
      type: 'tomatoToast',
      text1: 'Hello',
      text2: 'This is some something 👋',
    });
  };

  const pagerReff = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const handlePageChange = (event: any) => {
    setActiveIndex(event.nativeEvent.position);
    console.log('Current screen index:', activeIndex);
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const pagerViewRef = useRef<PagerView>(null);

  const onNextPressed = index => {
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(index);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.black}}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {activeIndex === 1 ? (
          balance >= 0 && username && avatar ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
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
                    height: 50,
                    width: 50,
                    backgroundColor: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    borderColor: Colors.gray,
                    borderWidth: 0.5,
                    marginEnd: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      openDrawer();
                    }}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon name="menu" size={24} color={Colors.grin} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    height: 50,
                    borderRadius: 10,
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
                    placeholder="Find friends"
                    placeholderTextColor="gray"
                    caretHidden={false}
                    cursorColor="white"
                    onChangeText={text => handleSearch(text)}
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
                      navigation.replace('Notifications');
                    }}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon name="notifications" size={24} color={Colors.grin} />
                  </TouchableOpacity>
                </View>
              </View>
              <View>{renderFeatures()}</View>
            </View>
          ) : (
            <ActivityIndicator
              size={'large'}
              color={Colors.grin}
              style={{flex: 1}}
            />
          )
        ) : activeIndex === 2 ? (
          <View key="2" style={{flex: 1, backgroundColor: Colors.black}}>
            <WalletScreens />
          </View>
        ) : activeIndex === 3 ? (
          <View key="3" style={{flex: 1, backgroundColor: Colors.black}}>
            <StatScreen />
          </View>
        ) : (
          <View key="4" style={{flex: 1, backgroundColor: Colors.black}}>
            <SettingsScreen />
          </View>
        )}
      </View>
      <View
        style={{
          height: 50,
          width: Dimensions.get('screen').width,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => {
            setActiveIndex(1);
          }}
          style={{
            height: '100%',
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={activeIndex === 1 ? 'home' : 'home-outline'}
            size={24}
            color={activeIndex === 1 ? Colors.grin : Colors.gray}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveIndex(2);
          }}
          style={{
            height: '100%',
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={activeIndex === 2 ? 'wallet' : 'wallet-outline'}
            size={24}
            color={activeIndex === 2 ? Colors.grin : Colors.gray}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveIndex(3);
          }}
          style={{
            height: '100%',
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={activeIndex === 3 ? 'analytics' : 'analytics-outline'}
            size={24}
            color={activeIndex === 3 ? Colors.grin : Colors.gray}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveIndex(4);
          }}
          style={{
            height: '100%',
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={activeIndex === 4 ? 'settings' : 'settings-outline'}
            size={24}
            color={activeIndex === 4 ? Colors.grin : Colors.gray}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
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
});
