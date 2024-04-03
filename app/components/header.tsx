import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TouchableOpacity, View, Image} from 'react-native';
import {RootStackParamList} from '../app/screens/navigator/RootNavigator';

const navigation =
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();

interface ButtonProps {
  onPress: () => void;
  title: string;
}

const headerbtn = ({title, onPress}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress;
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
          source={require(title)}
          resizeMode="contain"
          style={{
            height: 24,
            width: 24,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};
export default headerbtn;
