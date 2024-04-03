import React, { Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { useState } from 'react'
import {  } from "moti/skeleton";

const InfoScreen = ({ navigation }) => {
  const [selectedLang, setSelectedLang] = useState('english')
  const [isEnabled, setIsEnabled] = useState(false)
  const [isOn, setIsOn] = useState(false)
  const toggleSwitch1 = () => setIsEnabled((previousState) => !previousState)
  const toggleSwitch2 = () => setIsOn((previousState) => !previousState)

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: 20,
      }}
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View style={styles.container}>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            alignSelf: 'center',
          }}>
          <Text style={styles.sectionTitle}>App info</Text> 
          <View
            style={{
              height: 150,
              width: '100%',
              borderWidth: 0.5,
              borderColor: 'black',
              borderRadius: 10,
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
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
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
                  trackColor={{ false: 'transparent', true: 'transparent' }}
                  thumbColor={isEnabled ? '#00ff83' : 'white'}
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
                  borderRadius: 15,
                  padding: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'black',
                  borderColor: 'gray',
                  borderWidth: 1,
                }}>
                <Switch
                  trackColor={{ false: 'transparent', true: 'transparent' }}
                  thumbColor={isOn ? '#00ff83' : 'white'}
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
                borderBottomEndRadius: 10,
                borderBottomStartRadius: 10,
              }}>
              <Text style={styles.labelText}>Delete account</Text>
              <Image source={require('../../assets/img/interface/trash.png')} resizeMode="contain" style={styles.labelIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  labelText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Nunito-Black',
    color: 'gray',
    letterSpacing: 1,
  },
  labelIcon: {
    height: 20,
    width: 20,
    tintColor: 'white',
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Black',
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    alignSelf: 'flex-start',
    left: 10,
    letterSpacing: 1,
    marginBottom: 10,
  },
})

export default InfoScreen
