import {
  BottomSheetModal,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {forwardRef, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {Easing, FadeOut, SlideInDown} from 'react-native-reanimated';
import React from 'react';

import {TextInput} from 'react-native';
import Colors from '../utils/Colors';
import {supabase} from '../../lib/supabase';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens/navigator/RootNavigator';
import {Vibration} from 'react-native';

export type Ref = BottomSheetModal;

const LogoutSheet = forwardRef<Ref>((props, ref) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const snapPoints = useMemo(() => ['1%', '30%'], []);
  const {dismiss} = useBottomSheetModal();
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 0,
    easing: Easing.ease,
  });

  const animationSpringConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const [showAnotherScreen, setShowAnotherScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetState = () => {
    setShowAnotherScreen(false);
  };

  async function handleLogout() {
    // Show loading indicator when logout button is pressed
    setIsLoading(true);

    try {
      const {error} = await supabase.auth.signOut();

      if (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
        console.log(error.message);
        Vibration.vibrate(100);
        return;
      }

      // Handle successful logout
      setIsLoading(false);
      dismiss();
      console.log('User logged out');
      navigation.navigate('Login');
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('An error occurred during logout.');
      console.error('Error logging out:', error);
      return;
    }
  }

  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      onChange={resetState}
      enableOverDrag={false}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{
        backgroundColor: 'black',
        flex: 1,
        borderRadius: 14,
      }}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      enableHandlePanningGesture={true}
      bottomInset={20}
      detached={true}
      style={styles.sheetContainer}>
      <Animated.View
        style={{
          flex: 1,
          width: '100%',
          borderRadius: 14,
          borderColor: 'white',
          borderWidth: 1,
          justifyContent: 'space-evenly',
          backgroundColor: 'white',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'UberMoveBold',
            color: 'black',
            letterSpacing: 1,
            marginTop: 20,
          }}>
          Confirm
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '80%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.grin,
              alignItems: 'center',
              justifyContent: 'center',
              width: '45%',
              height: 50,
              borderRadius: 25,
              borderColor: 'black',
              borderWidth: 1,
            }}
            onPress={() => {
              dismiss();
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'UberMoveBold',
                color: 'black',
                letterSpacing: 1,
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.grin,
              alignItems: 'center',
              justifyContent: 'center',
              width: '45%',
              height: 50,
              borderRadius: 25,
              borderColor: 'black',
              borderWidth: 1,
            }}
            onPress={handleLogout}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'UberMoveBold',
                color: 'black',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                letterSpacing: 1,
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}. Try again</Text>
        ) : null}
        {isLoading && (
          <ActivityIndicator
            color="black"
            size={'large'}
            style={{
              marginBottom: 10, // Adjust the position of the loading indicator
            }}
          />
        )}
      </Animated.View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  sheetContainer: {marginHorizontal: '5%'},
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  error: {
    fontSize: 12,
    fontFamily: 'UberMoveBold',
    color: 'white',
    marginBottom: 20,
    letterSpacing: 2,
    alignSelf: 'center',
  },
});

export default LogoutSheet;
