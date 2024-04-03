// LoginScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import Animated, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native';
import {supabase} from '../../../lib/supabase';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  FlatList,
} from 'react-native-gesture-handler';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {payoutRequest} from './backend/payments';
import 'react-native-get-random-values';
import {storage} from '../mmkv/instance';
import {useNavigation} from '@react-navigation/native';

const WalletScreens = () => {
  const navigation = useNavigation();

  return <View style={{flex: 1, backgroundColor: Colors.black}}></View>;
};
export default WalletScreens;
