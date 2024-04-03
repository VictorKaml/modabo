import React from 'react';
import {View, Image, Text, Dimensions} from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Colors from '../utils/Colors';
import QRCode from 'react-native-qrcode-svg';

const backCard = () => {
  return (
    <Animated.View
      entering={FadeIn.duration(3000)}
      style={[
        {
          height: 300,
          width: 470,
          borderRadius: 14,
          borderWidth: 0.5,
          borderColor: Colors.white,
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'flex-start',
          transform: [{rotate: '-90deg'}],
          paddingHorizontal: 10,
          paddingVertical: 10,
        },
      ]}>
      {/* <ImageBackground
          source={require('../assets/img/pattern2.jpg')}
          style={[StyleSheet.absoluteFill, { height: 300,
          width: 470,borderRadius: 14}]}
        /> */}
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 16,
                color: Colors.black,
                letterSpacing: 1,
              }}>
              National Registration Bureau
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View
            style={{
              padding: 10,
              backgroundColor: Colors.white,
              borderColor: 'white',
              borderWidth: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <QRCode
              value="This is my username"
              size={90}
              color="black"
              backgroundColor={Colors.white}
            />
          </View>
          <View
            style={{
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/img/codex.png')}
              style={{
                width: 100,
                height: 50,
              }}
            />
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                letterSpacing: 1,
              }}>
              Authorized Signature
            </Text>
          </View>
          <View
            style={{
              padding: 10,
              borderRadius: 14,
              backgroundColor: Colors.white,
              borderColor: 'white',
              borderWidth: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/img/fingerprint.png')}
              resizeMode="contain"
              style={{
                width: 90,
                height: 90,
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}>
        <Text
          style={{
            fontFamily: 'UberMoveBold',
            fontSize: 16,
            color: Colors.black,
            letterSpacing: 0,
            textAlign: 'justify',
            width: '100%',
          }}>
          IXMWI00V84SN9X5XXXXXXXXXXXXXXX0009140M2609142MWIXXXXXXXXXXX0KAMLOMOXXVICTORXXXXXXXXXXXXXX
        </Text>
      </View>
    </Animated.View>
  );
};

export default backCard;
