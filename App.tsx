// App.tsx
import React, {useEffect} from 'react';
import RootNavigator from './app/screens/navigator/RootNavigator';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {View, Text, Dimensions} from 'react-native';

const App = () => {
  const toastConfig = {
    tomatoToast: ({text1, props}) => (
      <View
        style={{
          height: 60,
          borderRadius: 14,
          width: Dimensions.get('screen').width - 20,
          backgroundColor: 'white',
        }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <RootNavigator />
        <Toast config={toastConfig} position="bottom" />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
