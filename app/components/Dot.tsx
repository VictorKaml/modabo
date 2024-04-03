import React from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  index: number
  buttonVal: SharedValue<number>
}

const Dot = ({ index, buttonVal }: Props) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions()

  const animatedDotStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      buttonVal.value,
      [(index - 1) * SCREEN_HEIGHT, index * SCREEN_HEIGHT, (index + 1) * SCREEN_HEIGHT],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    )
    return {
      width: buttonVal.value === 0 ? withSpring(20) : buttonVal.value === 2 * SCREEN_HEIGHT ? withSpring(20) : withSpring(20),
      opacity: opacityAnimation,
    }
  })

  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(buttonVal.value, [0, SCREEN_HEIGHT, 2 * SCREEN_HEIGHT], ['black', 'black', 'black'])

    return {
      backgroundColor,
    }
  })

  return <Animated.View style={[styles.dots, animatedDotStyle, animatedColor]} />
}

export default Dot

const styles = StyleSheet.create({
  dots: {
    height: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
})
