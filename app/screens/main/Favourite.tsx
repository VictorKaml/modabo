import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  SharedTransition,
  withSpring,
} from 'react-native-reanimated';
import Colors from '../../utils/Colors';
import {supabase} from '../../../lib/supabase';

interface SplashScreenProps {
  navigation: any; // You might want to replace 'any' with the proper navigation type
}

const Favourite: React.FC<SplashScreenProps> = ({navigation}) => {
  const [favorite, setFavorite] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function handleFavourites() {
    try {
      // Set refreshing state to true to display the loading indicator
      setRefreshing(true);

      // Get logged in user id
      let {data: users} = await supabase.auth.getUser();

      const client_id = users.user?.id;

      const {data, error} = await supabase
        .from('favorites')
        .select('favorite')
        .eq('favorite_of', client_id);

      if (error) {
        console.log('Error:', error);
      }

      console.log('Favourites found:', data?.favorite);

      const favorite = data?.favorite;

      if (data) {
        const {data, error} = await supabase
          .from('profiles')
          .select('username, avata_url')
          .eq('username', favorite);

        if (error) {
          console.log('Error:', error);
        }
        if (data) {
          console.log('Data found:', data);
          setFavorite(data);
          setRefreshing(false);
        }
      }
    } catch (error) {
      console.log('Error searching for friends:', error);
    } finally {
      // Set refreshing state back to false to hide the loading indicator
      setRefreshing(false);
    }
  }

  useEffect(() => {
    handleFavourites();
  });
  return (
   <FlashList
      contentContainerStyle={{
        padding: 10,
        backgroundColor: Colors.white,
      }}
      decelerationRate="fast"
      estimatedItemSize={50}
      refreshing
      horizontal
      data={favorite}
      keyExtractor={item => `${item.id}`}
      renderItem={({item}) => (
        <View
          style={{
             height: 100,
            width: '30%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            marginBottom: 15,
            borderRadius: 14,
          }}>
          <TouchableOpacity
            onPress={() => {
              switch (item.id) {
                case 1:
                  navigation.replace('TopUp');
                  break;
                case 2:
                  navigation.replace('Transfer');
                  break;
                case 3:
                  navigation.replace('Request');
                  break;
                case 4:
                  navigation.replace('Main');
                  break;
                case 5:
                  navigation.replace('AirDrop');
                  break;
                case 6:
                  navigation.replace('Music');
                  break;
                case 7:
                  navigation.replace('Ecards');
                  break;
                case 8:
                  navigation.replace('Games');
                  break;

                default:
                  break;
              }
            }}
            style={{
              height: '50%',
              width: '50%',
              borderRadius: 14,
              borderWidth: 1,
              borderColor: 'black',
              backgroundColor: Colors.grin,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={item.avatar_url}
              resizeMode="contain"
              style={{
                height: 24,
                width: 24,
                tintColor: 'black',
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              marginTop: 5,
              fontFamily: 'UberMoveBold',
              flexWrap: 'wrap',
              letterSpacing: 2,
            }}>
            {item.username}
          </Text>
        </View>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Favourite;
