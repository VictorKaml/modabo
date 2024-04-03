/* eslint-disable import/no-duplicates */
import {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import React, {
  Animated,
  Text,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';

import {categories, categoryData} from '../../data/data';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const ECardScreen = ({navigation}) => {
  const scrollY = new Animated.Value(0);

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
  }, [navigation]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredData =
    selectedCategory === 'All'
      ? categoryData
      : categoryData.filter(item => item.category === selectedCategory);

  const SPACING = 20;
  const AVATAR_SIZE = 70;
  const CELL_SIZE = Dimensions.get('window').width - SPACING * 7;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
  const FULL_SIZE = CELL_SIZE + SPACING;

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
    },
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: 0,
      }}
      style={{
        backgroundColor: 'black',
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{
            alignSelf: 'center',
          }}
        />
      }>
      <SafeAreaView style={styles.container}>
        <FlatList
          horizontal
          contentContainerStyle={{
            paddingStart: SPACING,
          }}
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handleCategoryChange(item.id)}
              style={{
                backgroundColor:
                  selectedCategory === item.id ? Colors.grin : 'transparent',
                borderColor: 'gray',
                borderWidth: selectedCategory === item.id ? 0 : 1,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                borderRadius: 10,
                marginRight: SPACING,
              }}>
              <Text
                style={{
                  color: selectedCategory === item.id ? 'black' : 'gray',
                  fontSize: 14,
                  fontFamily: 'UberMoveBold',
                  textAlign: 'center',
                  letterSpacing: 1,
                  paddingHorizontal: SPACING,
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
        <Animated.FlatList
          horizontal
          contentContainerStyle={{
            paddingVertical: SPACING,
            paddingStart: SPACING,
          }}
          onScroll={handleScroll}
          snapToInterval={FULL_SIZE}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          data={filteredData}
          keyExtractor={item => `${item.id}`}
          renderItem={({item, index}) => {
            const inputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 0.8),
            ];
            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
            });
            const opacityInputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 1),
            ];
            const opacity = scrollY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0],
            });
            return (
              <TouchableOpacity
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE + 50,
                  marginRight: SPACING,
                  backgroundColor: 'rgba(255,255,255,1)',
                  elevation: 4,
                  borderRadius: 14,
                  opacity,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={item.image}
                  style={{
                    width: CELL_SIZE / 2,
                    height: CELL_SIZE / 2,
                    resizeMode: 'contain',
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
                      fontFamily: 'UberMoveBold',
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
                        fontFamily: 'UberMoveBold',
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
                          fontFamily: 'UberMoveBold',
                          color: 'green',
                        }}>
                        {item.current}
                      </Text>
                      <View style={{width: 5}} />
                      <Text
                        style={{
                          fontSize: 8,
                          fontFamily: 'UberMoveBold',
                          color: 'green',
                        }}>
                        {item.discount} OFF
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <Animated.FlatList
          contentContainerStyle={{paddingTop: 0, padding: SPACING}}
          onScroll={handleScroll}
          scrollsToTop
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyExtractor={item => `${item.id}`}
          renderItem={({item, index}) => {
            const inputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 0.8),
            ];
            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
            });
            const opacityInputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 1),
            ];
            const opacity = scrollY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0],
            });
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  padding: SPACING,
                  marginBottom: SPACING,
                  backgroundColor: 'rgba(255,255,255,1)',
                  elevation: 4,
                  borderRadius: 14,
                  opacity,
                  transform: [{scale}],
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
                      fontFamily: 'UberMoveBold',
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
                        fontFamily: 'UberMoveBold',
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
                          fontFamily: 'UberMoveBold',
                          color: 'green',
                        }}>
                        {item.current}
                      </Text>
                      <View style={{width: 5}} />
                      <Text
                        style={{
                          fontSize: 8,
                          fontFamily: 'UberMoveBold',
                          color: 'green',
                        }}>
                        {item.discount} OFF
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default ECardScreen;
