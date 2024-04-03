function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: 'black',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={LoginScreen}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Transfer"
        component={TransferScreen}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Deposit"
        component={DepositScreen}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
