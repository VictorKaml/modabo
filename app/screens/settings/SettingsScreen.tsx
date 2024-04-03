import React, {
  Dimensions,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {RadioButton} from 'react-native-paper';
import Colors from '../../utils/Colors';
import {useNavigation} from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [selectedLang, setSelectedLang] = useState('english');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch1 = () => setIsEnabled(previousState => !previousState);
  const toggleSwitch2 = () => setIsOn(previousState => !previousState);

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    // navigation.setOptions({
    //   headerLeft: () => (
    //     <TouchableOpacity
    //       onPress={() => {
    //         navigation.replace('Main');
    //       }}
    //       style={{
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //       }}>
    //       <View
    //         style={{
    //           height: 24,
    //           width: 24,
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //         }}>
    //         <Icon name={'chevron-back'} size={24} color={Colors.white} />
    //       </View>
    //     </TouchableOpacity>
    //   ),
    // });
  });

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: Colors.gray,
          borderWidth: 0.5,
          borderRadius: 25,
          justifyContent: 'center',
          width: Dimensions.get('screen').width - 20,
          marginBottom: 15,
          backgroundColor: Colors.black,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
          }}>
          <Text
            style={{
              fontFamily: 'UberMoveBold',
              fontSize: 16,
              letterSpacing: 1,
              color: Colors.gray,
              textAlign: 'left',
            }}>
            Settings
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            alignSelf: 'center',
          }}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View
            style={{
              height: 150,
              width: '100%',
              borderWidth: 0.5,
              borderColor: 'gray',
              borderRadius: 14,
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 14,
                borderTopEndRadius: 14,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>Two - step verification</Text>
              <View
                style={{
                  borderRadius: 16,
                  padding: 2,
                  paddingHorizontal: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'black',
                  borderColor: 'gray',
                  borderWidth: 1,
                }}>
                <Switch
                  trackColor={{false: 'transparent', true: 'transparent'}}
                  thumbColor={isEnabled ? Colors.grin : 'gray'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch1}
                  value={isEnabled}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>Notifications</Text>
              <View
                style={{
                  borderRadius: 16,
                  padding: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'black',
                  borderColor: 'gray',
                  borderWidth: 1,
                }}>
                <Switch
                  trackColor={{false: 'transparent', true: 'transparent'}}
                  thumbColor={isOn ? Colors.grin : 'gray'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch2}
                  value={isOn}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderBottomEndRadius: 14,
                borderBottomStartRadius: 14,
              }}>
              <Text style={styles.labelText}>Delete account</Text>
              <Image
                source={require('../../assets/img/interface/trash.png')}
                resizeMode="contain"
                style={styles.labelIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            alignSelf: 'center',
          }}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View
            style={{
              height: 100,
              width: '100%',
              borderWidth: 0.5,
              borderColor: 'gray',
              borderRadius: 14,
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 14,
                borderTopEndRadius: 14,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>English</Text>
              <RadioButton.Android
                value="english"
                status={selectedLang === 'english' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedLang('english')}
                color={Colors.grin}
                uncheckedColor="gray"
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderBottomEndRadius: 14,
                borderBottomStartRadius: 14,
              }}>
              <Text style={styles.labelText}>Chichewa</Text>
              <RadioButton.Android
                value="chichewa"
                status={selectedLang === 'chichewa' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedLang('chichewa')}
                color={Colors.grin}
                uncheckedColor="gray"
              />
            </View>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            alignSelf: 'center',
          }}>
          <Text style={styles.sectionTitle}>Help</Text>
          <View
            style={{
              height: 150,
              width: '100%',
              borderWidth: 0.5,
              borderColor: 'gray',
              borderRadius: 14,
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderTopStartRadius: 14,
                borderTopEndRadius: 14,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>Contact us</Text>

              <Image
                source={require('../../assets/img/interface/user-headset.png')}
                resizeMode="contain"
                style={styles.labelIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Terms');
              }}
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}>
              <Text style={styles.labelText}>Terms and Privacy Policy</Text>
              <Image
                source={require('../../assets/img/interface/form.png')}
                resizeMode="contain"
                style={styles.labelIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                borderBottomEndRadius: 14,
                borderBottomStartRadius: 14,
              }}>
              <Text style={styles.labelText}>App info</Text>
              <Image
                source={require('../../assets/img/interface/info.png')}
                resizeMode="contain"
                style={styles.labelIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    marginHorizontal: 10,
  },
  labelText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'UberMoveBold',
    color: 'gray',
    letterSpacing: 1,
  },
  labelIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.grin,
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: 'UberMoveBold',
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    alignSelf: 'flex-start',
    left: 10,
    letterSpacing: 1,
    marginBottom: 10,
  },
});

export default SettingsScreen;
