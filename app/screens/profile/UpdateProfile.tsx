import React, {
  ActivityIndicator,
  Dimensions,
  Image,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {supabase} from '../../../lib/supabase';
import LogoutSheet from '../../components/SignOutBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const UpdateProfileScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [isUsername, setIsUsername] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isAbout, setIsAbout] = useState(false);

  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  const toggleSwitch1 = () => setIsEnabled(previousState => !previousState);
  const toggleSwitch2 = () => setIsOn(previousState => !previousState);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleUsername = () => {
    if (!isUsername) {
      setIsUsername(true);
    } else {
      // Call your second function here
      updateUsername();
      console.log('Second function called');
      // Reset state to viewing mode
      setIsUsername(false);
    }
  };

  const handleEmail = () => {
    if (!isEmail) {
      setIsEmail(true);
    } else {
      // Call your second function here
      updateEmail();
      console.log('Second function called');
      // Reset state to viewing mode
      setIsEmail(false);
    }
  };

  const handlePhone = () => {
    if (!isPhone) {
      setIsPhone(true);
    } else {
      // Call your second function here
      updatePhone();
      console.log('Second function called');
      // Reset state to viewing mode
      setIsPhone(false);
    }
  };

  const handleAbout = () => {
    if (!isAbout) {
      setIsAbout(true);
    } else {
      // Call your second function here
      updateAbout();
      console.log('Second function called');
      // Reset state to viewing mode
      setIsAbout(false);
    }
  };

  async function updateAbout() {
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
        .update([{about_me: aboutMe, updated_at: new Date()}])
        .eq('id', client_id)
        .select();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }
      // Handle update profilr
      console.log('User:', users);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  async function updateUsername() {
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
        .update([{username: username, updated_at: new Date()}])
        .eq('id', client_id)
        .select();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }
      // Handle update profilr
      console.log('User:', users);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  async function updatePhone() {
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
        .update([{phone_number: phone, updated_at: new Date()}])
        .eq('id', client_id)
        .select();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }
      // Handle update profilr
      console.log('User:', users);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  async function updateEmail() {
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
        .update([{email: email, updated_at: new Date()}])
        .eq('id', client_id)
        .select();

      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }
      // Handle update profilr
      console.log('User:', users);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Profile');
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

        setUsername(users?.username);
        setPhone(users?.phone_number);
        setEmail(users?.email);
        setCountry(users?.country);
        setFirstname(users?.first_name);
        setLastname(users?.last_name);
        setAboutMe(users?.about_me);

        // Handle successful user
        console.log('User:', users);
      } catch (error) {
        console.error('Error signing in:', error);
      }
    }

    syncProfile();
  }, [navigation]);

  return !username &&
    !aboutMe &&
    !phone &&
    !email &&
    !country &&
    !firstname &&
    !lastname ? (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color={Colors.grin} size={'very-large'} />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View style={styles.container}>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
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
                paddingStart: isUsername ? 0 : 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              {isUsername ? (
                <TextInput
                  style={styles.input}
                  editable
                  autoFocus
                  autoCapitalize="none"
                  placeholder="Change username"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setUsername(text)}
                  value={username}
                  onBlur={() => setIsUsername(false)}
                />
              ) : (
                <Text style={styles.labelText}>@{username}</Text>
              )}
              <TouchableOpacity onPress={handleUsername}>
                <Image
                  source={require('../../assets/img/interface/pen-circle.png')}
                  resizeMode="contain"
                  style={[styles.labelIcon, {tintColor: Colors.grin}]}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingStart: isEmail ? 0 : 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              {isEmail ? (
                <TextInput
                  style={styles.input}
                  editable
                  autoFocus
                  autoCapitalize="none"
                  placeholder="Change email address"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setEmail(text)}
                  value={email}
                  onBlur={() => setIsEmail(false)}
                />
              ) : (
                <Text style={styles.labelText}>{email}</Text>
              )}
              <TouchableOpacity onPress={handleEmail}>
                <Image
                  source={require('../../assets/img/interface/pen-circle.png')}
                  resizeMode="contain"
                  style={[styles.labelIcon, {tintColor: Colors.grin}]}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingStart: isPhone ? 0 : 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              {isPhone ? (
                <TextInput
                  style={styles.input}
                  editable
                  autoFocus
                  autoCapitalize="none"
                  placeholder="Change phone number"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setPhone(text)}
                  value={phone}
                  onBlur={() => setIsPhone(false)}
                />
              ) : (
                <Text style={styles.labelText}>{phone}</Text>
              )}
              <TouchableOpacity onPress={handlePhone}>
                <Image
                  source={require('../../assets/img/interface/pen-circle.png')}
                  resizeMode="contain"
                  style={[styles.labelIcon, {tintColor: Colors.grin}]}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingStart: isAbout ? 0 : 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
              }}>
              {isAbout ? (
                <TextInput
                  style={styles.input}
                  editable
                  autoFocus
                  autoCapitalize="none"
                  placeholder="Change phone number"
                  placeholderTextColor="black"
                  caretHidden={false}
                  cursorColor="black"
                  onChangeText={text => setAboutMe(text)}
                  value={aboutMe}
                  onBlur={() => setIsAbout(false)}
                />
              ) : (
                <Text style={styles.labelText}>{aboutMe}</Text>
              )}
              <TouchableOpacity onPress={handleAbout}>
                <Image
                  source={require('../../assets/img/interface/pen-circle.png')}
                  resizeMode="contain"
                  style={[styles.labelIcon, {tintColor: Colors.grin}]}
                />
              </TouchableOpacity>
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
              <Text style={styles.labelText}>Account visibility</Text>
              <View
                style={{
                  borderRadius: 16,
                  padding: 2,
                  paddingHorizontal: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'black',
                  borderColor: 'gray',
                  borderWidth: 1,
                }}>
                <Switch
                  trackColor={{false: 'transparent', true: 'transparent'}}
                  thumbColor={isEnabled ? Colors.grin : 'white'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch1}
                  value={isEnabled}
                />
              </View>
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
              <Text style={styles.labelText}>Professional mode</Text>
              <View
                style={{
                  borderRadius: 16,
                  padding: 2,
                  paddingHorizontal: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'black',
                  borderColor: 'gray',
                  borderWidth: 1,
                }}>
                <Switch
                  trackColor={{false: 'transparent', true: 'transparent'}}
                  thumbColor={isOn ? Colors.grin : 'white'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch2}
                  value={isOn}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      <LogoutSheet ref={bottomSheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },
  input: {
    width: '85%',
    fontFamily: 'UberMoveBold',
    height: 50,
    color: 'white',
    backgroundColor: 'gray',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    letterSpacing: 2,
  },
  dot: {
    height: 120,
    width: 120,
    borderRadius: 25,
    backgroundColor: 'white',
    marginBottom: 15,
    alignSelf: 'center',
  },
  center: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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

export default UpdateProfileScreen;
