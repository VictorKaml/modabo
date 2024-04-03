import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Pressable, Image} from 'react-native';
import {
  GestureDetector,
  Gesture,
  Directions,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import Animated, {
  FadeIn,
  FadeOut,
  SlideOutLeft,
  SlideInRight,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigator/RootNavigator';
import {StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from '../../../lib/supabase';
import {Session} from '@supabase/supabase-js';
import Colors from '../../utils/Colors';

const onboardingSteps = [
  {
    icon: require('../../assets/img/splash.png'),
    title: 'Welcome To Modabo',
    description: 'Get access to Payments, Games, analytics and many more.',
  },
  {
    icon: require('../../assets/img/mephis6.jpg'),
    title: 'Explore Best Deals',
    description: 'Find good suprises to easily help you next time shopping.',
  },
  {
    icon: require('../../assets/img/mephis5.jpg'),
    title: 'Join Our World',
    description: 'We have been waiting for you. Register and be a part of us. ',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [screenIndex, setScreenIndex] = useState(0);

  const data = onboardingSteps[screenIndex];

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      setScreenIndex(screenIndex + 2);
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const getStarted = () => {
    console.log('Dont have an account. Sign Up');
    navigation.navigate('SignUp');
  };

  const signIn = () => {
    console.log('Already have an account. Sign In');
    navigation.navigate('Login');
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  return (
    <GestureHandlerRootView style={styles.page}>
      <StatusBar hidden />

      <GestureDetector gesture={swipes}>
        <View style={styles.pageContent} key={screenIndex}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[
              styles.header,
              {
                backgroundColor: screenIndex == 0 ? 'black' : 'transparent',
                borderRadius: 14,
                width: 200,
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Image
              resizeMode="cover"
              style={[
                styles.image,
                {
                  transform: [{rotateY: screenIndex == 3 ? '180deg' : '0deg'}],
                  borderWidth: screenIndex == 0 ? 0.5 : 0,
                  width: 200,
                  height: 200,
                },
              ]}
              source={data.icon}
            />
          </Animated.View>

          <View style={styles.footer}>
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.title}>
              {data.title}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.description}>
              {data.description}
            </Animated.Text>

            {screenIndex == 0 && (
              <View style={styles.buttonsRow}>
                <Pressable
                  onPress={signIn}
                  style={[
                    styles.button2,
                    {
                      borderColor: Colors.grin,
                      borderWidth: 1,
                      backgroundColor: 'black',
                    },
                  ]}>
                  <Text style={[styles.buttonText, {color: 'white'}]}>
                    Skip
                  </Text>
                </Pressable>
                <Pressable onPress={onContinue} style={styles.button2}>
                  <Text style={styles.buttonText}>Next</Text>
                </Pressable>
              </View>
            )}

            {screenIndex == 1 && (
              <View style={styles.buttonsRow}>
                <Pressable onPress={onContinue} style={styles.button2}>
                  <Text style={styles.buttonText}>Next</Text>
                </Pressable>
              </View>
            )}

            {screenIndex == 2 && (
              <View style={styles.buttonsRow}>
                <Pressable
                  onPress={signIn}
                  style={[
                    styles.button2,
                    {
                      borderColor: 'black',
                      borderWidth: 1,
                      backgroundColor: Colors.grin,
                    },
                  ]}>
                  <Text style={[styles.buttonText, {color: 'black'}]}>
                    Get Started
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </GestureDetector>

      <View style={styles.stepIndicatorContainer}>
        {onboardingSteps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              {
                backgroundColor: index === screenIndex ? Colors.grin : 'grey',
              },
            ]}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  page: {
    // alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'black',
  },
  pageContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 14,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'UberMoveBold',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  description: {
    color: 'gray',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'UberMoveBold',
    letterSpacing: 1,
    paddingHorizontal: 20
  },
  header: {},
  footer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsRow: {
    marginTop: '30%',
    width: '80%',
    alignSelf: 'center',
    marginBottom: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  button1: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    alignItems: 'center',
    flex: 1,
  },
  button2: {
    backgroundColor: Colors.grin,
    borderRadius: 50,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'black',
    fontFamily: 'UberMoveBold',
    fontSize: 16,
    padding: 15,
    paddingHorizontal: 25,
  },
  buttonText2: {
    color: 'black',
    fontFamily: 'UberMoveBold',
    fontSize: 16,
    padding: 15,
    paddingHorizontal: 25,
  },

  // steps
  stepIndicatorContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 15,
    marginBottom: 50,
  },
  stepIndicator: {
    height: 10,
    width: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
});
