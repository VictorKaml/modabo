import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

const YourComponent = () => {
  useEffect(() => {
    // Storing value
    AsyncStorage.setItem('yourKey', 'yourValue')
      .then(() => console.log('Value stored successfully'))
      .catch((error) => console.log('Error storing value: ', error))

    // Retrieving value
    AsyncStorage.getItem('yourKey')
      .then((value) => {
        if (value !== null) {
          console.log('Retrieved value: ', value)
          // Update your component state or display the retrieved value
        } else {
          console.log('Value does not exist in AsyncStorage')
        }
      })
      .catch((error) => console.log('Error retrieving value: ', error))
  }, []) // Run once on component mount

  return (
    <View>
      <Text>Your Component</Text>
    </View>
  )
}

export default YourComponent
