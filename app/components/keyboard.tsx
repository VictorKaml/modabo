import * as React from 'react'
import Button from './Button'
import { View, Text, Image, TouchableOpacity, Vibration } from 'react-native'
import { Styles } from '../styles/GlobalStyles'
import { myColors } from '../styles/Colors'
import { useState } from 'react'

export default function MyKeyboard() {
  const [firstNumber, setFirstNumber] = React.useState('')
  const [result, setResult] = React.useState<number | null>(null)

  const [showAnotherScreen, setShowAnotherScreen] = useState(false)

  const toggleAnotherScreen = () => {
    setShowAnotherScreen(showAnotherScreen)
  }

  const limit = 99999

  const handleNumberPress = (buttonValue: string) => {
    if (firstNumber.length < 10) {
      setFirstNumber(firstNumber + buttonValue)
      Vibration.vibrate(1)
    }
  }

  const firstNumberDisplay = () => {
    if (result !== null) {
      return (
        <Text
          style={
            result < 99999
              ? [Styles.screenFirstNumber, { color: myColors.result }]
              : [Styles.screenFirstNumber, { fontSize: 32, color: myColors.result }]
          }>
          {result?.toString()}
        </Text>
      )
    }
    if (firstNumber && firstNumber.length < 6) {
      return <Text style={Styles.screenFirstNumber}>${firstNumber}</Text>
    }
    if (firstNumber === '') {
      return <Text style={Styles.screenFirstNumber}>{'$0.00'}</Text>
    }
    if (firstNumber.length > 5 && firstNumber.length < 8) {
      return <Text style={Styles.screenFirstNumber}>${firstNumber}</Text>
    }
    if (firstNumber.length > 7) {
      return <Text style={Styles.screenFirstNumber}>${firstNumber}</Text>
    }
  }

  return (
    <View
      style={[
        Styles.viewBottom,
        {
          flex: 1,
          width: '100%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          position: 'absolute',
          bottom: 50,
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
            height: 60,
            paddingHorizontal: 20,
            marginBottom: 50,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          {firstNumberDisplay()}
        </View>
        <View style={Styles.row}>
          <Button title="7" onPress={() => handleNumberPress('7')} />
          <Button title="8" onPress={() => handleNumberPress('8')} />
          <Button title="9" onPress={() => handleNumberPress('9')} />
        </View>
        <View style={Styles.row}>
          <Button title="4" onPress={() => handleNumberPress('4')} />
          <Button title="5" onPress={() => handleNumberPress('5')} />
          <Button title="6" onPress={() => handleNumberPress('6')} />
        </View>
        <View style={Styles.row}>
          <Button title="1" onPress={() => handleNumberPress('1')} />
          <Button title="2" onPress={() => handleNumberPress('2')} />
          <Button title="3" onPress={() => handleNumberPress('3')} />
        </View>
        <View style={Styles.row}>
          <Button title="." onPress={() => handleNumberPress('.')} />
          <Button title="0" onPress={() => handleNumberPress('0')} />
          <TouchableOpacity
            style={Styles.btnLight}
            onPress={() => setFirstNumber(firstNumber.slice(0, -1))}
            onLongPress={() => setFirstNumber(firstNumber.slice(0, -10))}>
            <Image
              source={require('../assets/img/interface/delete.png')}
              resizeMode="contain"
              style={{
                height: 20,
                width: 20,
                tintColor: 'black',
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
            height: 60,
            width: '80%',
            backgroundColor: 'yellow',
            borderRadius: 18,
          }}
          onPress={() => {}}>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              fontFamily: 'Nunito-Black',
              textAlign: 'center',
              letterSpacing: 2,
            }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
