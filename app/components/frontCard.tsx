import React from 'react';
import {View, Image, Text} from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Colors from '../utils/Colors';

const frontCard = () => {
  return (
    <Animated.View
      entering={FadeIn.duration(3000)}
      style={[
        {
          height: 300,
          width: 470,
          borderRadius: 14,
          borderWidth: 0.5,
          borderColor: Colors.gray,
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
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View>
          <Image
            source={require('../assets/img/malawi_flag.png')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 5,
            }}
          />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text
            style={{
              fontFamily: 'UberMoveBold',
              fontSize: 16,
              color: Colors.black,
              fontWeight: 'bold',
              letterSpacing: 1,
            }}>
            Republic of Malawi / Nyasaland
          </Text>
          <Text
            style={{
              fontFamily: 'UberMoveBold',
              fontSize: 12,
              color: Colors.black,
              textAlign: 'left',
            }}>
            Chiphaso cha Nzika / Citizen Identification
          </Text>
        </View>
        <View>
          <Image
            source={require('../assets/img/malawi_coat.png')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
            }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 20,
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View
          style={{
            marginTop: '15%',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/img/chip.png')}
            style={{
              width: 50,
              height: 40,
              borderRadius: 8,
            }}
          />
          <Text
            style={{
              fontFamily: 'UberMoveBold',
              fontSize: 16,
              color: Colors.black,
              fontWeight: 'bold',
            }}>
            MWI
          </Text>
        </View>
        <View>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'UberMoveMedium',
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.black,
                fontWeight: 'bold',
              }}>
              Surname
            </Text>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
              }}>
              KAMLOMO
            </Text>
          </View>
          <View style={{justifyContent: 'center', marginVertical: 10}}>
            <Text
              style={{
                fontFamily: 'UberMoveMedium',
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.black,
                fontWeight: 'bold',
              }}>
              Name, Other Names
            </Text>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
              }}>
              VICTOR
            </Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'UberMoveMedium',
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.black,
                fontWeight: 'bold',
              }}>
              Sex
            </Text>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
              }}>
              M
            </Text>
          </View>
          <View style={{justifyContent: 'center', marginVertical: 10}}>
            <Text
              style={{
                fontFamily: 'UberMoveMedium',
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.black,
                fontWeight: 'bold',
              }}>
              Identification No
            </Text>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
              }}>
              00V84SN9
            </Text>
          </View>
          <View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'UberMoveMedium',
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: Colors.black,
                  fontWeight: 'bold',
                }}>
                Date of Issue
              </Text>
              <Text
                style={{
                  fontFamily: 'UberMoveBold',
                  fontSize: 12,
                  color: Colors.black,
                  textAlign: 'left',
                }}>
                29 Nov 2017 .
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'UberMoveMedium',
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.black,
                fontWeight: 'bold',
              }}>
              Eyes
            </Text>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
              }}>
              Brown
            </Text>
          </View>
          <View style={{justifyContent: 'center', marginVertical: 10}}>
            <Text
              style={{
                fontFamily: 'UberMoveMedium',
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.black,
                fontWeight: 'bold',
              }}>
              Height
            </Text>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
              }}>
              1.65m
            </Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'UberMoveMedium',
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.black,
                fontWeight: 'bold',
              }}>
              Date of Birth
            </Text>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
              }}>
              14 Sep 2000
            </Text>
          </View>
          <View style={{justifyContent: 'center', marginVertical: 10}}>
            <Text
              style={{
                fontFamily: 'UberMoveMedium',
                fontSize: 12,
                fontStyle: 'italic',
                color: Colors.black,
                fontWeight: 'bold',
              }}>
              Nationality
            </Text>
            <Text
              style={{
                fontFamily: 'UberMoveBold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
              }}>
              MWI
            </Text>
          </View>
          <View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'UberMoveMedium',
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: Colors.black,
                  fontWeight: 'bold',
                }}>
                Date of Expiry
              </Text>
              <Text
                style={{
                  fontFamily: 'UberMoveBold',
                  fontSize: 12,
                  color: Colors.black,
                  textAlign: 'left',
                }}>
                14 Sep 2018
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Image
            source={require('../assets/img/profile/balaclava2.jpg')}
            style={{
              width: 80,
              height: 100,
              borderRadius: 8,
            }}
          />
          <Image
            source={require('../assets/img/codex.png')}
            style={{
              width: 80,
              height: 50,
              marginTop: 10,
              borderRadius: 8,
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default frontCard;
