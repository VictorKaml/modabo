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

const ProfileScreen = ({navigation}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [aboutMe, setAboutMe] = useState(null);
  const [type, setType] = useState(null);
  const [verified, setVerified] = useState<string | boolean>(null);
  const [avatar, setAvatar] = useState(null);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const storedUser = storage.getString('@username');
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
    syncProfile();
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

  const [selectedAvatar, setSelectedAvatar] = useState('');

  const avatars = [
    'https://i.pinimg.com/564x/e6/e5/e1/e6e5e19b1c272b54f6da65a7438111aa.jpg',
    'https://i.pinimg.com/564x/34/d0/25/34d025f4e023c74de21e6ec1c33e59df.jpg',
    'https://plus.unsplash.com/premium_photo-1681426472026-60d4bf7b69a1?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1645655892437-c5149679d223?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1633536838356-80807d2321d4?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

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
        .select('*')
        .eq('id', client_id)
        .single();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }

      storage.set('username', users?.username);
      storage.set('aboutMe', users?.about_me);
      storage.set('type', users?.type);
      storage.set('avatar', users?.avatar_url);

      // Handle successful user
      console.log('User:', users);
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      syncProfile();
    }
  }

  async function syncProfile() {
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
        .select('*')
        .eq('id', client_id)
        .single();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }
      const verified = users?.verified;
      const avatar = users?.avatar_url;
      const accType = users?.type;
      const username = storage.getString('username');
      const about = storage.getString('aboutMe');
      const type = storage.getString('type');

      if (username) {
        navigation.setOptions({
          headerTitle: '@' + username,
          headerTitleStyle: {
            fontFamily: 'UberMoveBold',
            color: 'white',
            fontSize: 16,
          },
        });
        setUsername(username);
      }
      if (about) {
        setAboutMe(about);
      }
      if (type) {
        setType(accType);
      }
      if (avatar) {
        setSelectedAvatar(avatar);
      }
      if (verified === false) {
        console.log('Status verified is: ', verified);
        setVerified(verified);
      } else if (verified === true) {
        console.log('Status verified is: ', verified);
        setVerified(verified);
      }

      // Handle successful user
      console.log('User:', users);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  const handleSelectAvatar = avatarUrl => {
    const avatar_url = String(avatarUrl);
    console.log('koma', avatar_url);
    updatePic(avatar_url);
  };

  async function updatePic(avatar) {
    let {data: users} = await supabase.auth.getUser();

    const currentUser = users.user?.id;
    console.log('My update avatar is:', avatar);

    // Show loading indicator when login button is pressed
    try {
      let {error} = await supabase
        .from('profiles')
        .update({avatar_url: avatar})
        .eq('id', currentUser)
        .select();

      let {data} = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', currentUser)
        .single();

      const url = data?.avatar_url;

      storage.set('@url', url);

      if (error) {
        console.log('Problem updating profile pic', error.message);
        Vibration.vibrate(100);
        return;
      } else {
        console.log('My update avatar is:', url);
        setSelectedAvatar(url);

        console.log('Completed updating profile pic');
      }
    } catch (error) {
      console.log(error);
    } finally {
      syncProfile();
    }
  }

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

  const [selectedFile, setSelectedFile] = useState(null);

  const pickDocument = async () => {
    try {
      const pickedFile = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });

      //   await RNFS.readFile(pickedFile.uri, 'base64').then(data => {
      //     console.log('base64', data);
      //   });
      console.log('pickedFile', pickedFile);
      // Check if the selected file is within the 5 MB limit
      const fileSize = await RNFS.stat(pickedFile.uri);
      const maxSize = 20 * 1024 * 1024; // 20 MB in bytes
      if (fileSize.size > maxSize) {
        Alert.alert(
          'File Size Limit Exceeded',
          'Please select a file up to 5 MB.',
        );
      } else {
        setSelectedFile(pickedFile);
      }
      if (selectedFile) {
        handleUpload();
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the document picker
      } else {
        throw err;
      }
    }
  };

  const uploadAudioFile = async file => {
    let {data: users} = await supabase.auth.getUser();

    const currentUser = users.user?.id;
    try {
      // const audio = selectedFile;
      // const file = audio.uri;
      const base64 = await RNFS.readFile(file.uri, 'base64');
      const filePath = `${currentUser}/${'profile'}/${'avatar'}.${
        file.type == 'image' ? 'png' : 'jpg'
      }`;
      const contentType = file.type === 'image/png' ? 'image/png' : 'image/jpg';
      // const filePath = `${user!.id}/${file.name}.${
      //   file.type == 'audio' ? 'mpeg' : 'mp3'
      // }`;
      const {data, error} = await supabase.storage
        .from('files')
        .upload(filePath, {base64}, {contentType});

      if (error) {
        console.log('Error uploading file:', error.message);
        return;
      } else {
        console.log('File uploaded successfully:', data);
        Alert.alert(
          'File Uploaded',
          `File ${file.name} has been uploaded successfully.`,
        );
        getFileUrl();
      }
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  async function getFileUrl() {
    let {data: users} = await supabase.auth.getUser();

    const currentUser = users.user?.id;
    try {
      // Get public url
      // const {data} = supabase.storage
      //   .from('bucket')
      //   .getPublicUrl('filePath.jpg');

      // console.log(data.publicUrl);

      // Get signed private url with a time limit
      const {data} = await supabase.storage
        .from('files')
        .getPublicUrl(`${currentUser}/profile/${'avatar.jpg'}`);

      const url = data.publicUrl;

      if (data) {
        console.log('Profile url is:', url);
      }
      updatePic(url);
    } catch (error) {
      console.log('Error getting url', error);
    }
  }

  const handleUpload = async () => {
    // Implement your file upload logic here
    if (selectedFile) {
      await uploadAudioFile(selectedFile);
    } else {
      Alert.alert('No File Selected', 'Please select a file to upload.');
    }
  };

  return !username && !aboutMe && !selectedAvatar && !verified ? (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
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
          {selectedAvatar ? (
            <TouchableOpacity
              onPress={() => {
                pickDocument();
              }}>
              <Animated.Image
                source={{
                  uri: selectedAvatar,
                }}
                resizeMode="contain"
                style={[
                  {
                    height: 100,
                    width: 100,
                    borderRadius: 14,
                    alignSelf: 'center',
                    marginVertical: (Dimensions.get('window').width * 5) / 100,
                  },
                ]}
              />
            </TouchableOpacity>
          ) : (
            <Animated.Image
              source={{
                uri: 'https://static.toiimg.com/thumb/msid-108438736,imgsize-27632,width-400,resizemode-4/108438736.jpg',
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
          )}
        </View>
        <View>
          {username && aboutMe ? (
            <View>
              <Text
                style={[
                  styles.labelText,
                  {
                    marginTop: (Dimensions.get('window').width * 5) / 100,
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
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleSelectAvatar(avatar);
                }}>
                <Image
                  source={{uri: avatar}}
                  resizeMode="contain"
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor:
                      selectedAvatar === avatar ? Colors.grin : 'black',
                  }}
                />
              </TouchableOpacity>
            ))}
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
              <Icon
                name="copy"
                size={20}
                color={Colors.gray}
                style={{marginRight: 8}}
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

export default ProfileScreen;
