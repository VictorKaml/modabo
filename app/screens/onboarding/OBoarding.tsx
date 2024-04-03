import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Canvas, Circle, Group, Image, Mask, SkImage, makeImageFromView } from '@shopify/react-native-skia'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, BackHandler, PixelRatio, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import CustomButton from '../../components/CustomButtonOnb'
import Pagination from '../../components/Pagination'
import RenderItem from '../../components/RenderItemOnb'
import { data } from '../../data/data'
import { RootStackParamList } from '../navigator/RootNavigator'

const OnBoardingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const pd = PixelRatio.get()
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions()
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [overlay, setOverlay] = useState<SkImage | null>(null)
  const mask = useSharedValue(0)
  const buttonVal = useSharedValue(0)

  const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const handlePress = async () => {
    if (currentIndex === data.length - 1 && !active) {
      console.log('END')
      navigation.navigate('Login')
      return
    }
    if (!active) {
      setActive(true)

      setCurrentIndex((prev) => prev + 1)
      mask.value = withTiming(SCREEN_HEIGHT, { duration: 500 })
      buttonVal.value = withTiming(buttonVal.value + SCREEN_HEIGHT)
      await wait(500)

      mask.value = 0
      setActive(false)
    }
  }

  return (
    <View style={styles.container}>
      <View ref={ref} collapsable={false}>
        {data.map((item, index) => {
          return currentIndex === index && <RenderItem item={item} key={index} />
        })}
      </View>
      <CustomButton handlePress={handlePress} buttonVal={buttonVal} />
      <Pagination data={data} buttonVal={buttonVal} />
    </View>
  )
}

export default OnBoardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  credit: {
    position: 'absolute',
    bottom: 22,
    color: 'white',
  },
})
