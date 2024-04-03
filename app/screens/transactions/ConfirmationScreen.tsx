// LoginScreen.tsx
import React, { useEffect } from 'react'
import { StyleSheet, Image, View, StatusBar, Text } from 'react-native'
import Animated, { FadeIn, SlideOutRight } from 'react-native-reanimated'

interface SplashScreenProps {
  navigation: any // You might want to replace 'any' with the proper navigation type
}

const ConfirmationScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Transfer')
    }, 5000)
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(3000)} exiting={SlideOutRight.duration(2000)}>
        <Image source={require('../../assets/img/stickers/verified.png')} style={styles.image} />
      </Animated.View>
      <Text
        style={{
          marginTop: 20,
          color: 'black',
          fontSize: 18,
          fontFamily: 'Nunito-Black',
          textAlign: 'center',
          letterSpacing: 2,
          alignSelf: 'center',
        }}>
        Redirecting...
      </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
})

export default ConfirmationScreen
