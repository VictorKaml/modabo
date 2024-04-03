import {
  BottomSheetModal,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {forwardRef, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Animated, {Easing, FadeOut, SlideInDown} from 'react-native-reanimated';
import React from 'react';

import {TextInput} from 'react-native';
import Colors from '../utils/Colors';

export type Ref = BottomSheetModal;

const TransferSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['1%', '57%'], []);
  const {dismiss} = useBottomSheetModal();
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 500,
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

  const toggleAnotherScreen = () => {
    setShowAnotherScreen(!showAnotherScreen);
  };

  const resetState = () => {
    setShowAnotherScreen(false);
  };

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
      }}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      handleIndicatorStyle={{
        backgroundColor: 'white',
        height: 0,
        width: '15%',
        borderRadius: 5,
      }}
      enableHandlePanningGesture={true}
      topInset={10}
      bottomInset={10}
      detached={true}
      style={styles.sheetContainer}>
      {!showAnotherScreen && (
        <Animated.View
          entering={SlideInDown.duration(1000)}
          exiting={FadeOut.duration(500)}
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Nunito-Black',
              color: 'white',
              letterSpacing: 1,
              marginBottom: 10,
            }}>
            Transfer
          </Text>
          <TextInput
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              fontFamily: 'Nunito-Black',
              height: 50,
              color: 'black',
              paddingStart: 10,
              marginBottom: 10,
              backgroundColor: 'white',
              borderRadius: 14,
              fontSize: 12,
              letterSpacing: 2,
            }}
            inputMode="numeric"
            editable={true}
            placeholder="Enter mobile"
            placeholderTextColor={'black'}
            caretHidden={false}
            cursorColor={'black'}
          />
          <TextInput
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              fontFamily: 'Nunito-Black',
              height: 50,
              color: 'black',
              paddingStart: 10,
              marginBottom: 10,
              backgroundColor: 'white',
              borderRadius: 14,
              fontSize: 12,
              letterSpacing: 2,
            }}
            inputMode="numeric"
            editable={true}
            placeholder="Enter amount"
            placeholderTextColor={'black'}
            caretHidden={false}
            cursorColor={'black'}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.neon,
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              height: 50,
              borderRadius: 14,
            }}
            onPress={toggleAnotherScreen}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Nunito-Black',
                color: 'black',
                letterSpacing: 1,
              }}>
              Proceed
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {showAnotherScreen && (
        <Animated.View
          entering={SlideInDown.duration(1000)}
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Nunito-Black',
              color: 'white',
              letterSpacing: 1,
              marginBottom: 10,
            }}>
            Enter Passcode
          </Text>
          <TextInput
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              fontFamily: 'Nunito-Black',
              height: 50,
              color: 'black',
              paddingStart: 10,
              marginBottom: 10,
              backgroundColor: 'white',
              borderRadius: 14,
              fontSize: 12,
              letterSpacing: 2,
            }}
            inputMode="numeric"
            editable={true}
            placeholder="Passcode"
            placeholderTextColor={'black'}
            caretHidden={false}
            cursorColor={'black'}
          />
          <TextInput
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              fontFamily: 'Nunito-Black',
              height: 50,
              color: 'black',
              paddingStart: 10,
              marginBottom: 10,
              backgroundColor: 'white',
              borderRadius: 14,
              fontSize: 12,
              letterSpacing: 2,
            }}
            inputMode="numeric"
            editable={true}
            placeholder="Passcode"
            placeholderTextColor={'black'}
            caretHidden={false}
            cursorColor={'black'}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.neon,
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              height: 50,
              borderRadius: 14,
            }}
            onPress={() => {
              dismiss();
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Nunito-Black',
                color: 'black',
                letterSpacing: 1,
              }}>
              Transfer
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  sheetContainer: {marginHorizontal: 10},
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default TransferSheet;
