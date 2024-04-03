import React, {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  SlideInDown,
  SlideInUp,
} from 'react-native-reanimated';
import {supabase} from '../../../lib/supabase';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const RequestScreen = ({navigation}) => {
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
            <Icon name={'chevron-back'} size={24} color={Colors.white} />
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
          <View
            style={{
              height: 24,
              width: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name={'share-social'} size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
      ),
    });
    fetchData();
  }, [navigation]);

  const [qrValue, setQrValue] = useState('');

  async function fetchData() {
    try {
      let {data: users} = await supabase.auth.getUser();
      const currentUser = users.user?.id;
      let {
        data: client,
        error,
        status,
      } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUser)
        .single();
      if (error && status != 406) {
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }
      const username = client?.username || '';
      setQrValue(username);
    } catch (error) {
      console.log('Error', error);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            padding: 20,
            elevation: 4,
            borderRadius: 14,
            backgroundColor: Colors.grin,
            borderColor: 'black',
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 50,
          }}>
          <QRCode
            value="This is my username"
            size={Dimensions.get('window').width / 1.8}
            color="black"
            backgroundColor={Colors.grin}
          />
        </View>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'space-evenly',
            width: Dimensions.get('window').width / 1.8 + 40,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Scanner');
            }}
            style={{
              elevation: 4,
              width: Dimensions.get('window').width / 4,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'black',
              borderColor: Colors.grin,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 14,
                color: 'white',
                textAlign: 'center',
                letterSpacing: 1,
              }}>
              Scan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RequestScreen;
