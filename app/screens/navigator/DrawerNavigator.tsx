import { createDrawerNavigator } from '@react-navigation/drawer'
import TabNavigator from './TabNavigator'
import ProfileScreen from '../profile/ProfileScreen'
import { Dimensions } from 'react-native'

const Drawer = createDrawerNavigator()

export default function MyDrawer() {
  return (
    <Drawer.Navigator
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
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  )
}
