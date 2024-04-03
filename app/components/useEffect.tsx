import { useEffect } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

export const BackButton = ({ navigation }) => {
  useEffect(() => {
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
    });
  }, [navigation]);
};
