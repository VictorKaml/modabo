// LoginScreen.tsx
import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../utils/Colors';
import 'react-native-get-random-values';
import {useNavigation} from '@react-navigation/native';
import frontCard from '../../components/frontCard';
import {rotateX} from 'react-native-redash';
import {center} from '@shopify/react-native-skia';
import Animated, {
  FadeIn,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import backCard from '../../components/BackCard ';
import Icon from 'react-native-vector-icons/Ionicons';

const IdentityScreen = ({navigation}) => {
  const rotate = useSharedValue(0);

  const frontAnimationStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [0, 180]);
    return {
      transform: [
        {rotateY: withTiming(`${rotateValue}.deg`, {duration: 1000})},
      ],
    };
  });

  const backAnimationStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [180, 360]);
    return {
      transform: [
        {rotateY: withTiming(`${rotateValue}.deg`, {duration: 1000})},
      ],
    };
  });

  const [indentification, setSelectedIdentification] = useState();
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const handleSelectSuggestion = suggestion => {
    setSelectedIdentification(suggestion);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.black,
      }}>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: Dimensions.get('screen').width - 20,
          backgroundColor: Colors.black,
          borderRadius: 25,
          borderColor: Colors.gray,
          borderWidth: 0.5,
        }}>
        <View
          style={{
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
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
            flex: 1,
            flexDirection: 'row',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'UberMoveBold',
              fontSize: 14,
              color: Colors.gray,
              letterSpacing: 1,
            }}>
            Digital ID
          </Text>
        </View>
        <View
          style={{
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              rotate.value = rotate.value ? 0 : 1;
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/img/interface/flip.png')}
              style={{width: 24, height: 24, tintColor: Colors.grin}}
            />
          </TouchableOpacity>
        </View>
      </View>
      {indentification === 'NATIONAL_ID' ? (
        <Animated.View
          entering={SlideInLeft.duration(1000)}
          style={{
            height: 470,
            width: 300,
            borderRadius: 14,
            backgroundColor: Colors.white,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animated.View style={[style.frontCard, frontAnimationStyle]}>
            {frontCard()}
          </Animated.View>
          <Animated.View style={[style.backCard, backAnimationStyle]}>
            {backCard()}
          </Animated.View>
        </Animated.View>
      ) : indentification === 'DRIVERS_ID' ? (
        <Animated.View
          entering={SlideInLeft.duration(1500)}
          style={{
            height: 470,
            width: 300,
            borderRadius: 14,
            backgroundColor: Colors.white,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animated.View style={[style.frontCard, frontAnimationStyle]}>
            {frontCard()}
          </Animated.View>
          <Animated.View style={[style.backCard, backAnimationStyle]}>
            {backCard()}
          </Animated.View>
        </Animated.View>
      ) : (
        <Animated.View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/img/stickers/log-in.png')}
            resizeMode="contain"
            style={{
              width: 100,
              height: 100,
            }}
          />
        </Animated.View>
      )}
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          width: Dimensions.get('screen').width - 20,
          backgroundColor: Colors.black,
          borderRadius: 25,
        }}>
        <SuggestionNotes
          onSelectSuggestion={handleSelectSuggestion}
          selectedSuggestion={selectedSuggestion}
        />
      </View>
    </View>
  );
};
export default IdentityScreen;

const SuggestionNotes = ({onSelectSuggestion}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const img1 = require('../../assets/img/interface/id-badge.png');
  const img2 = require('../../assets/img/interface/licensee.png');
  const img3 = require('../../assets/img/interface/id-badge.png');
  const suggestions = [
    {label: img1, value: 'NATIONAL_ID', color: Colors.grin},
    {label: img2, value: 'DRIVERS_ID', color: Colors.grin},
    {label: img3, value: 'NATIONAL_ID', color: Colors.grin},
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
        width: '100%',
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
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            },
            style.suggestion,
          ]}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={item.label}
              resizeMode="contain"
              style={{
                width: 24,
                height: 24,
                tintColor:
                  item.value === selectedSuggestion ? Colors.grin : 'gray',
              }}
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const style = StyleSheet.create({
  frontCard: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  backCard: {backfaceVisibility: 'hidden'},
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
    borderRadius: 25,
  },
});
