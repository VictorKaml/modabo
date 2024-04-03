import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MotiView } from '@motify/components'
import { Animated } from 'react-native'
import { Easing } from 'react-native-reanimated'

const AnimatedDots = () => {
  return (
    <View style={[styles.dot, styles.center]}>
      {[...Array(5).keys()].map((index) => (
        <MotiView
          from={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{
            type: 'timing',
            duration: 2000,
            easing: Easing.out(Easing.ease),
            delay: index * 400,
            repeatReverse: false,
            loop: true,
          }}
          key={index}
          style={[StyleSheet.absoluteFillObject, styles.dot]}
        />
      ))}
      <Animated.Image
        source={require('../assets/img/person3.jpg')}
        resizeMode="contain"
        style={[
          {
            height: 120,
            width: 120,
            borderRadius: 25,
            padding: 5,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  dot: {
    height: 120,
    width: 120,
    borderRadius: 25,
    backgroundColor: 'purple',
    marginBottom: 15,
    alignSelf: 'center',
    borderColor: 'black',
  },
  center: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default AnimatedDots
