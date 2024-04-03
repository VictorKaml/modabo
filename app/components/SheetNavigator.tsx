import { BottomSheetModal, useBottomSheetModal, useBottomSheetSpringConfigs, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet'
import { forwardRef, useMemo, useState } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { Easing, SlideInDown } from 'react-native-reanimated'
import React from 'react'

import { View } from '@motify/components'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../screens/navigator/RootNavigator'

export type Ref = BottomSheetModal

const TabNav = forwardRef<Ref>((props, ref) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const snapPoints = useMemo(() => ['1%', '15%'], [])
  const { dismiss } = useBottomSheetModal()
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 0,
    easing: Easing.ease,
  })

  const animationSpringConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  })

  const [showAnotherScreen, setShowAnotherScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const resetState = () => {
    setShowAnotherScreen(false)
  }

  async function settings() {
    dismiss()
    navigation.navigate('Settings')
  }
  async function notifications() {
    dismiss()
    navigation.navigate('Notifications')
  }
  async function qr() {
    dismiss()
    navigation.navigate('Settings')
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
        backgroundColor: 'transparent',
        flex: 1,
        borderRadius: 14,
        height: 70,
      }}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      handleIndicatorStyle={{
        backgroundColor: 'white',
        height: 10,
        width: '15%',
        borderRadius: 5,
      }}
      enableHandlePanningGesture={true}
      bottomInset={10}
      detached={false}
      style={styles.sheetContainer}>
      <Animated.View
        entering={SlideInDown}
        style={{
          flex: 1,
          width: '100%',
          borderRadius: 14,
          height: 70,
          marginHorizontal: 10,
          borderColor: 'orange',
          justifyContent: 'space-evenly',
          backgroundColor: 'orange',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
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
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              dismiss()
            }}>
            <Image
              source={require('../assets/img/interface/home.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              dismiss()
            }}>
            <Image
              source={require('../assets/img/interface/square-plus.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              notifications()
            }}>
            <Image
              source={require('../assets/img/interface/bells.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              settings()
            }}>
            <Image
              source={require('../assets/img/interface/settings.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
              }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BottomSheetModal>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  sheetContainer: { marginHorizontal: 10 },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  error: {
    fontSize: 12,
    fontFamily: 'Nunito-Black',
    color: 'white',
    marginBottom: 20,
    letterSpacing: 2,
    alignSelf: 'center',
  },
})

export default TabNav
