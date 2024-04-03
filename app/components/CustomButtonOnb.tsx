import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native'
import Animated, { SharedValue, interpolateColor, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'

type Props = {
  handlePress: () => void
  buttonVal: SharedValue<number>
}

const CustomButton = ({ handlePress, buttonVal }: Props) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions()

  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(buttonVal.value, [0, SCREEN_HEIGHT, 2 * SCREEN_HEIGHT], ['#fd94b2', '#f8dac2', '#154f40'])

    return {
      backgroundColor,
    }
  })

  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        buttonVal.value === SCREEN_HEIGHT ? withSpring(200) : buttonVal.value === 2 * SCREEN_HEIGHT ? withSpring(260) : withSpring(140),
      height: buttonVal.value === 2 * SCREEN_HEIGHT ? withSpring(80) : withSpring(80),
      backgroundColor: 'black',
    }
  })

  const arrowAnimationStyle = useAnimatedStyle(() => {
    return {
      width: 24,
      height: 24,
      backgroundColor: 'transparent',
      opacity: buttonVal.value === 2 * SCREEN_HEIGHT ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX: buttonVal.value === 2 * SCREEN_HEIGHT ? withTiming(100) : withTiming(0),
        },
      ],
    }
  })

  const textAnimationStyle1 = useAnimatedStyle(() => {
    return {
      opacity: buttonVal.value === 2 * SCREEN_HEIGHT ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX: buttonVal.value === 2 * SCREEN_HEIGHT ? withTiming(0) : withTiming(-100),
        },
      ],
    }
  })

  const textAnimationStyle2 = useAnimatedStyle(() => {
    return {
      opacity: buttonVal.value === 0 ? withTiming(1) : buttonVal.value === SCREEN_HEIGHT ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX: buttonVal.value === 0 ? withTiming(0) : buttonVal.value === SCREEN_HEIGHT ? withTiming(0) : withTiming(-100),
        },
      ],
    }
  })

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={[styles.container, animatedColor, buttonAnimationStyle]}>
        <Animated.Text style={[styles.textButton, textAnimationStyle1]}>Let's Start</Animated.Text>
        <Animated.Text style={[styles.textButton, textAnimationStyle2]}>Next</Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    width: 80,
    height: 80,
    zIndex: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: { color: 'white', fontSize: 20, fontFamily: 'Nunito-Black', position: 'absolute', letterSpacing: 1 },
})
