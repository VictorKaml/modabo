import React from 'react'
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native'

import { OnboardingData } from '../data/data'

type Props = {
  item: OnboardingData
}

const RenderItem = ({ item }: Props) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions()

  return (
    <View
      style={[
        styles.itemContainer,
        {
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          backgroundColor: 'white',
        },
      ]}>
      <Image
        resizeMode="contain"
        source={item.image}
        style={{
          width: '30%',
          height: '30%',
        }}
      />
      <Text style={[styles.itemText, { color: 'black' }]}>{item.text}</Text>
      <Text style={[styles.itemDescription, { color: 'gray' }]}>{item.description}</Text>
    </View>
  )
}

export default RenderItem

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '40%',
  },
  itemText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 38,
    fontFamily: 'Nunito-Black',
    letterSpacing: 1,
    marginHorizontal: 20,
  },
  itemDescription: {
    width: 260,
    marginTop: 25,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Nunito-Black',
    letterSpacing: 1,
  },
})
