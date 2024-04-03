import React, {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
} from 'react-native-reanimated';
import {supabase} from '../../../lib/supabase';
import LogoutSheet from '../../components/SignOutBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Skeleton} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {storage} from '../mmkv/instance';
import Clipboard from '@react-native-community/clipboard';
import {color} from 'react-native-elements/dist/helpers';

const SearchProfileScreen = ({navigation, route}) => {
  const {avat, user, firstname, lastname} = route.params || {};

  const [username, setUsername] = useState<string | null>(null);
  const [aboutMe, setAboutMe] = useState(null);
  const [type, setType] = useState(null);
  const [verified, setVerified] = useState<string | boolean>(null);
  const [avatar, setAvatar] = useState(null);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
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
            <Icon name={'arrow-back'} size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Main');
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={'qr-code'} size={24} color={Colors.white} />
        </TouchableOpacity>
      ),
    });

    setProfile();
  });

  useEffect(() => {
    // Subscribe to changes in the transaction table
    supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'profiles'},
        setProfile,
      )
      .subscribe();

    // Subscribe to changes in the transaction table
    supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'profiles'},
        setProfile,
      )
      .subscribe();
  });

  const presentCormfirmation = () => bottomSheetRef.current?.present();

  const [favorite, setFavorite] = useState(false);

  async function setProfile() {
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
        .from('profiles')
        .select('about_me, type, verified, avatar_url')
        .eq('username', user)
        .single();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }

      setAboutMe(users?.about_me);
      setType(users?.type);
      setVerified(users?.verified);
      setAvatar(users?.avatar_url);

      if (user) {
        navigation.setOptions({
          headerTitle: '@' + user,
          headerTitleStyle: {
            fontFamily: 'UberMoveBold',
            color: 'white',
            fontSize: 16,
          },
        });
        setUsername(user);
        findFavoriteByUsername();
      }

      // Handle successful user
      console.log('User:', users);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  const findFavoriteByUsername = async () => {
    let {data: users} = await supabase.auth.getUser();

    const client_id = users.user?.id;

    try {
      // Query the favorites table to find if the given username exists for the logged-in user
      const {data: favoritesData, error} = await supabase
        .from('favorites')
        .select('favorites_name')
        .eq('favorites_of', client_id)
        .eq('favorites_name', user)
        .single();

      if (error) {
        console.log('Error:', error.message);
        return null;
      }

      // If data username is equal to param user, set favorite heart icon to active sharp
      if (favoritesData?.favorites_name === user) {
        setFavorite(true); // Assuming username is unique for each user
      } else {
        setFavorite(false);
        return null; // Username not found in favorites
      }
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  };

  const addToFavorite = async () => {
    let {data: users} = await supabase.auth.getUser();

    const client_id = users.user?.id;

    try {
      // If favourite is false before pressing button after press add user to favorites table
      if (favorite === false) {
        const {data, error} = await supabase
          .from('favorites')
          .insert({favorites_of: client_id, favorites_name: user});

        if (error) {
          console.log('Error:', error.message);
          return null;
        }
        setFavorite(true);
        console.log('Success adding user as a favorite contact');
      } else if (favorite === true) {
        // If favourite is true then user is already a favorite, remove user from favorites table
        console.log('User is already favorite');
        const {data, error} = await supabase
          .from('favorites')
          .delete()
          .eq('favorites_of', client_id)
          .eq('favorites_name', user);

        if (error) {
          console.log('Error:', error.message);
          return null;
        }
        setFavorite(false);
        console.log('Success removing user as a favorite contact');
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const copyTextToClipboard = () => {
    const textToCopy = 'https://www.modabo.me/@'; // Replace with the text you want to copy
    if (Platform.OS === 'android' && !Clipboard) {
      // If Clipboard is not available, show an error message
      ToastAndroid.show('Clipboard not available', ToastAndroid.SHORT);
      return;
    }
    Clipboard.setString(textToCopy);
    ToastAndroid.show('Text copied to clipboard', ToastAndroid.SHORT); // Show a toast message indicating successful copy
  };

  return !user && !aboutMe && !avat && !verified && !favorite ? (
    <View
      style={{
        flex: 1,
      }}>
      <ActivityIndicator color={Colors.grin} size={'large'} />
    </View>
  ) : (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      <Animated.View style={styles.container}>
        <View>
          <Animated.Image
            source={{
              uri: avatar ? avatar : avat,
            }}
            resizeMode="contain"
            style={[
              {
                height: 100,
                width: 100,
                borderRadius: 14,
                alignSelf: 'center',
              },
            ]}
          />
        </View>
        <View>
          {user && aboutMe ? (
            <View>
              <Text
                style={[
                  styles.labelText,
                  {
                    marginVertical: (Dimensions.get('window').width * 5) / 100,
                    color: 'gray',
                    alignSelf: 'center',
                    fontSize: 18,
                  },
                ]}>
                {aboutMe}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.labelText,
                {
                  marginVertical: (Dimensions.get('window').width * 5) / 100,
                  color: 'gray',
                  alignSelf: 'center',
                  fontSize: 18,
                },
              ]}>
              Loading...
            </Text>
          )}
        </View>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: (Dimensions.get('window').width * 5) / 100,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('Transfer', {
                  avat: avat,
                  user: user,
                });
              }}
              style={{
                height: 50,
                width: '47.5%',
                flexDirection: 'row',
                backgroundColor: Colors.grin,
                borderRadius: 14,
                borderWidth: 0.5,
                borderColor: 'gray',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Icon name="paper-plane" size={24} color={Colors.black} />
              <Text style={[styles.labelText, {color: Colors.black}]}>
                Transfer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                addToFavorite();
              }}
              style={{
                height: 50,
                width: '47.5%',
                flexDirection: 'row',
                backgroundColor: 'black',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: Colors.grin,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Icon
                name={favorite ? 'heart-sharp' : 'heart-outline'}
                size={24}
                color={favorite ? Colors.grin : Colors.gray}
              />
              <Text
                style={[
                  styles.labelText,
                  {color: favorite ? Colors.grin : Colors.gray},
                ]}>
                Favorite
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              borderWidth: 0.5,
              borderColor: 'gray',
              borderRadius: 10,
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: (Dimensions.get('window').width * 5) / 100,
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
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>{type} account</Text>
              <Image
                source={require('../../assets/img/interface/globe.png')}
                resizeMode="contain"
                style={[styles.labelIcon, {tintColor: Colors.gray}]}
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
              }}>
              {verified === false && (
                <Text style={styles.labelText}>Status pending . . .</Text>
              )}
              {verified === false && (
                <Image
                  source={require('../../assets/img/interface/pending.png')}
                  resizeMode="contain"
                  style={[styles.labelIcon, {tintColor: Colors.yellow}]}
                />
              )}
              {verified === true && (
                <Text style={styles.labelText}>Status verified</Text>
              )}
              {verified === true && (
                <Image
                  source={require('../../assets/img/interface/hexagon-check.png')}
                  resizeMode="contain"
                  style={[styles.labelIcon, {tintColor: Colors.grin}]}
                />
              )}
            </View>
          </View>
          <View
            style={{
              width: '100%',
              borderWidth: 0.5,
              borderColor: 'gray',
              borderRadius: 10,
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('UpdateProfile');
              }}
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>Update profile</Text>
              <Image
                source={require('../../assets/img/interface/form.png')}
                resizeMode="contain"
                style={[styles.labelIcon, {tintColor: Colors.gray}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>Avatar</Text>
              <Image
                source={require('../../assets/img/interface/face-awesome.png')}
                resizeMode="contain"
                style={[styles.labelIcon, {tintColor: Colors.gray}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                copyTextToClipboard();
              }}
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>Copy profile link</Text>
              <Image
                source={require('../../assets/img/interface/clone.png')}
                resizeMode="contain"
                style={[styles.labelIcon, {tintColor: Colors.gray}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={presentCormfirmation}
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
              }}>
              <Text style={styles.labelText}>Sign out</Text>
              <Image
                source={require('../../assets/img/interface/sign-out-alt.png')}
                resizeMode="contain"
                style={[styles.labelIcon, {tintColor: Colors.gray}]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <LogoutSheet ref={bottomSheetRef} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },
  labelText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'UberMoveBold',
    color: 'gray',
    letterSpacing: 1,
  },
  labelIcon: {
    height: 20,
    width: 20,
    tintColor: 'white',
    marginRight: 8,
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

export default SearchProfileScreen;
