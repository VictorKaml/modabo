// LoginScreen.tsx
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, StyleSheet, Image, View, KeyboardAvoidingView, Platform, StatusBar, Alert, Dimensions } from 'react-native'

import CustomButton1 from '../../components/btn2'
import { RootStackParamList } from '../navigator/RootNavigator'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native'
import axios from 'axios'
import { supabase } from '../../../lib/supabase'
import MyKeyboard from '../../components/keyboard'
import Button, { Button2 } from '../../components/Button'
import { Styles } from '../../styles/GlobalStyles'
import { Vibration } from 'react-native'

type VerifyScreenProps = {
  route: {
    params: {
      phone: string
    }
  }
  // other props...
}

const VerificationScreen: React.FC<VerifyScreenProps> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const phone = route.params.phone

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace('SignUp')
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/img/interface/angle-small-left.png')}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
              }}
            />
          </View>
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  const [token, setToken] = useState('')

  const handleVerify = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms',
      })

      if (error) {
        console.log(error.message)
        return
      }

      console.log('Session:', session)
      navigation.navigate('Complete')
    } catch (error) {
      console.log('Error verifying:', error)
    }
  }

  const handleNumberPress = (buttonValue: string) => {
    if (token.length < 6) {
      setToken(token + buttonValue)
      Vibration.vibrate(1)
    }
  }

  const firstNumberDisplay = () => {
    return (
      <TextInput
        style={styles.input}
        maxLength={6}
        textAlign="center"
        inputMode="numeric"
        placeholder="X X X X X X"
        placeholderTextColor="black"
        caretHidden={true}
        cursorColor="black"
        onChangeText={(text) => setToken(text)}
        value={token}
      />
    )
  }

  return (
    <Animated.View entering={SlideInRight} exiting={SlideInLeft} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <View
          style={[
            Styles.viewBottom,
            {
              paddingHorizontal: 5,
              width: '90%',
              alignSelf: 'center',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            },
          ]}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <View
              style={{
                height: 50,
                width: '100%',
                marginBottom: 15,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              {firstNumberDisplay()}
            </View>
            <View style={Styles.row}>
              <Button2 title="7" onPress={() => handleNumberPress('7')} />
              <Button2 title="8" onPress={() => handleNumberPress('8')} />
              <Button2 title="9" onPress={() => handleNumberPress('9')} />
            </View>
            <View style={Styles.row}>
              <Button2 title="4" onPress={() => handleNumberPress('4')} />
              <Button2 title="5" onPress={() => handleNumberPress('5')} />
              <Button2 title="6" onPress={() => handleNumberPress('6')} />
            </View>
            <View style={Styles.row}>
              <Button2 title="1" onPress={() => handleNumberPress('1')} />
              <Button2 title="2" onPress={() => handleNumberPress('2')} />
              <Button2 title="3" onPress={() => handleNumberPress('3')} />
            </View>
            <View style={Styles.row}>
              <Button2 title="." onPress={() => handleNumberPress('.')} />
              <Button2 title="0" onPress={() => handleNumberPress('0')} />
              <TouchableOpacity
                style={Styles.btnLight2}
                onPress={() => setToken(token.slice(0, -1))}
                onLongPress={() => setToken(token.slice(0, -6))}>
                <Image
                  source={require('../../assets/img/interface/delete.png')}
                  resizeMode="contain"
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: 'white',
                  }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 21,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                width: '90%',
                backgroundColor: 'black',
                borderRadius: 18,
              }}
              onPress={handleVerify}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'Nunito-Black',
                  textAlign: 'center',
                  letterSpacing: 2,
                }}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  logo: {
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Black',
    color: 'black',
    marginTop: 8,
    marginBottom: 32,
    letterSpacing: 2,
  },
  signUp: {
    fontSize: 14,
    padding: 10,
    fontFamily: 'Nunito-Black',
    color: 'black',
    alignItems: 'center',
    alignSelf: 'flex-start',
    letterSpacing: 2,
  },
  forgotPassword: {
    fontSize: 14,
    padding: 10,
    fontFamily: 'Nunito-Black',
    color: 'black',
    alignItems: 'center',
    alignSelf: 'flex-end',
    letterSpacing: 2,
  },
  input: {
    fontFamily: 'Nunito-Black',
    height: 100,
    width: '100%',
    color: 'black',
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 5,
  },
})

export default VerificationScreen
