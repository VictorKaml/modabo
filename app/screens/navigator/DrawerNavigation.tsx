import { View, Text, Image } from 'react-native'
import React from 'react'
import { DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import TabNavigator from './TabNavigator'
import SettingsScreen from '../settings/SettingsScreen'

const Drawer = createDrawerNavigator()

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <SafeAreaView>
            <View
              style={{
                height: 200,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
              }}>
              <Image
                source={require('../../assets/img/splash1.png')}
                style={{
                  height: 72,
                  width: 72,
                  tintColor: 'black',
                  marginTop: 20,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Nunito-Black',
                  color: 'black',
                  marginTop: 10,
                }}>
                Modabo
              </Text>
            </View>
            <DrawerItemList {...props} />
          </SafeAreaView>
        )
      }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'white',
          width: 250,
        },
        headerStyle: {
          backgroundColor: 'black',
        },
        headerShown: false,
        headerTintColor: 'black',
        drawerLabelStyle: {
          color: 'black',
          fontSize: 14,
          marginLeft: -10,
        },
      }}>
      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
          headerTitleStyle: {
            fontFamily: 'Nunito-Black',
          },
          headerShadowVisible: false,
          drawerIcon: () => (
            <Image
              source={require('../../assets/img/interface/home.png')}
              style={{
                height: 24,
                width: 24,
                tintColor: 'black',
              }}
            />
          ),
        }}
        component={TabNavigator}
      />
    </Drawer.Navigator>
  )
}

export default DrawerNavigation
