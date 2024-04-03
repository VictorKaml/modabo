import { useState, useLayoutEffect } from 'react'
import React, { Image, TouchableOpacity, View, Text, Animated, StyleSheet, ActivityIndicator } from 'react-native'

import { categoryData } from '../../data/data'
import Colors from '../../utils/Colors'
import Icon from 'react-native-vector-icons/Ionicons'

const MusicScreen = ({ navigation }) => {
  const scrollY = new Animated.Value(0)

  useLayoutEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Main');
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 24,
              width: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name={'chevron-back'} size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation])

  const [selectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const filteredData = selectedCategory === 'All' ? categoryData : categoryData.filter((item) => item.category === selectedCategory)

  const SPACING = 20
  const AVATAR_SIZE = 70
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
  })

  return (
    <View style={styles.container}>
      {/* <Image source={require('../../assets/img/pic7.jpg')} style={StyleSheet.absoluteFillObject} /> */}
      <Animated.FlatList
        contentContainerStyle={{
          padding: SPACING,
          paddingBottom: AVATAR_SIZE,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator
        data={filteredData}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item, index }) => {
          const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 0.8)]
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
                backgroundColor: 'rgba(255,255,255,1)',
                elevation: 4,
                borderRadius: 14,
                opacity,
                transform: [{ scale }],
              }}>
              <Image
                source={item.image}
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  resizeMode: 'contain',
                  marginRight: SPACING / 2,
                }}
              />
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Nunito-Black',
                    color: 'black',
                  }}>
                  {item.product}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Nunito-Black',
                      color: 'gray',
                      textDecorationLine: 'line-through',
                    }}>
                    {item.previous}
                  </Text>
                  <Text
                    style={{
                      marginStart: 5,
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'Nunito-Black',
                        color: 'green',
                      }}>
                      {item.current}
                    </Text>
                    <View style={{ width: 5 }} />
                    <Text
                      style={{
                        fontSize: 8,
                        fontFamily: 'Nunito-Black',
                        color: 'green',
                      }}>
                      {item.discount} OFF
                    </Text>
                  </Text>
                </View>
              </View>
            </Animated.View>
          )
        }}
        ListFooterComponent={() => loading && <ActivityIndicator color={Colors.grin} size={'large'}/>}
      />
    </View>
  )
}

const AnimatedFlat = Animated.createAnimatedComponent(MusicScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})

export default AnimatedFlat
