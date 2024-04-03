import React, {Image, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native';
import { useState, useEffect } from 'react';
import Animated, { FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const GameScreen = ({ navigation }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
        onPress={() => {
              navigation.replace('Main');}}
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
                          source={require('../../assets/img/interface/cross-small.png')}
                          resizeMode="contain"
                          style={{
                            height: 24,
                            width: 24,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <Animated.View style={styles.container}>
        
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameScreen;
