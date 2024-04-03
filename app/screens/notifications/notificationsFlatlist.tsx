import { useState, useEffect, useLayoutEffect } from 'react'
import React, { Image, TouchableOpacity, View, Text, Animated, StyleSheet, ActivityIndicator } from 'react-native'

import { categoryData } from '../../data/data'
import { supabase } from '../../../lib/supabase'

const MusicScreen = () => {
  const scrollY = new Animated.Value(0)

  const [selectedCategory] = useState('All')
  const [transacctions, setTransactions] = useState([])

  useEffect(() => {
    async function fetchTransactions() {
      try {
        let { data: users } = await supabase.auth.getUser()

        const currentUser = users.user?.id

        const { data } = await supabase.from('transactions').select('*')

        console.log('Your data', data)
        setTransactions(data)
      } catch (error) {}
    }

    fetchTransactions
  })

  const filteredData = selectedCategory === 'All' ? categoryData : categoryData.filter((item) => item.category === selectedCategory)

  const SPACING = 20
  const AVATAR_SIZE = 70
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
  })

  return (
    <View style={styles.container}>
      <Animated.FlatList
        contentContainerStyle={{
          padding: SPACING,
          paddingBottom: 0,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator
        data={transacctions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 6)]
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          })
          const opacityInputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)]
          const opacity = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0],
          })
          return (
            <Animated.View
              style={{
                flexDirection: 'row',
                padding: SPACING,
                marginBottom: SPACING,
                backgroundColor: 'rgba(0,0,0,1)',
                elevation: 4,
                borderRadius: 14,
                opacity,
                transform: [{ scale }],
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Nunito-Black',
                    color: 'white',
                    letterSpacing: 0.6,
                  }}>
                  Transfer Complete! 🎉 You've successfully sent ${item.amount} to {item.receiver_username}. Your transaction ID is
                  TRX-202412345 🚀
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'Nunito-Black',
                    color: 'limegreen',
                    marginTop: 5,
                  }}>
                  {item.created_at}
                </Text>
              </View>
            </Animated.View>
          )
        }}
      />
    </View>
  )
}

const AnimatedFlat = Animated.createAnimatedComponent(MusicScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
  },
})

export default AnimatedFlat
