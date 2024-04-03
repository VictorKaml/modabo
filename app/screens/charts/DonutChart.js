import * as React from 'react'
import { Easing, TextInput, Animated, Text, View, StyleSheet } from 'react-native'
import Svg, { G, Circle, Rect, Path } from 'react-native-svg'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const Donut = ({
  percentage = 75,
  radius = 40,
  strokeWidth = 30,
  duration = 3000,
  color = 'blue',
  delay = 0,
  textColor,
  max = 100,
  suffix = '',
  prefix = '',
  rotation = '',
}) => {
  const animated = React.useRef(new Animated.Value(0)).current
  const circleRef = React.useRef()
  const inputRef = React.useRef()
  const circumference = 2 * Math.PI * radius
  const halfCircle = radius + strokeWidth

  const animation = (toValue) => {
    return Animated.timing(animated, {
      delay: 0,
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start()
  }

  React.useEffect(() => {
    animation(percentage)
    animated.addListener(
      (v) => {
        const maxPerc = (100 * v.value) / max
        const strokeDashoffset = circumference - (circumference * maxPerc) / 100
        if (inputRef?.current) {
          inputRef.current.setNativeProps({
            text: suffix + `${Math.round(v.value)}` + prefix,
          })
        }
        if (circleRef?.current) {
          circleRef.current.setNativeProps({
            strokeDashoffset,
          })
        }
      },
      [max, percentage],
    )

    return () => {
      animated.removeAllListeners()
    }
  })

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation={rotation} origin={`${halfCircle}, ${halfCircle}`}>
          <Path
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="white"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDashoffset={circumference}
            strokeDasharray={circumference}
          />
          <Path
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeOpacity=".3"
          />
        </G>
      </Svg>
      <AnimatedTextInput
        ref={inputRef}
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue="0"
        style={[StyleSheet.absoluteFillObject, { fontSize: radius / 4, color: textColor }, styles.text]}
      />
    </View>
  )
}

export default Donut

const styles = StyleSheet.create({
  text: { fontFamily: 'UberMoveBold', textAlign: 'center' },
})
