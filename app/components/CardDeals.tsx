import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CategoryData} from '../data/data';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  item: CategoryData;
  index: number;
};

const CardDeals = ({item}: Props) => {
  return (
    <View style={styles.card}>
      <Image
        source={item.image}
        style={{
          width: '100%',
          height: 60,
          resizeMode: 'contain',
          marginTop: 16,
          marginHorizontal: 16,
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          margin: 8,
        }}>
        <Text
          style={{
            fontSize: 8,
            fontFamily: 'Nunito-Black',
            color: 'black',
          }}>
          {item.product}
        </Text>
        <View
          style={{
            flex: 1,
            marginTop: 6,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              fontSize: 8,
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
                fontSize: 8,
                fontFamily: 'Nunito-Black',
                color: 'green',
              }}>
              {item.current}
            </Text>
            <View style={{width: 5}} />
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
      <View
        style={{
          width: 30,
          height: 30,
          borderColor: 'black',
          alignSelf: 'flex-end',
          marginEnd: 10,
          marginBottom: 10,
        }}>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add-circle" color={'black'} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 14,
    elevation: 4,
  },
  addButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CardDeals;
