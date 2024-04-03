import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {Directions, Gesture} from 'react-native-gesture-handler';

import Colors from '../../utils/Colors';
import {useNavigation} from '@react-navigation/native';
import {analyticsData} from '../../data/data';
import App from '../charts/LineChart2';
import Icon from 'react-native-vector-icons/Ionicons';
import Donut from '../charts/Dchart';
import DonutChart from '../charts/DonutChart';
import LinearGradient from 'react-native-linear-gradient';

const StatScreen = () => {
  const navigation = useNavigation();

  const score = [
    {
      percentage: 7500,
      color: Colors.grin,
      max: 10000,
      strokeWidth: 20,
      radius: Dimensions.get('screen').width / 5,
      textColor: 'white',
      suffix: '$',
      prefix: '%',
      rotation: '90',
    },
  ];

  const renderFeatures = () => {
    //const handleTransferSheet = () => BottomSheetRef.current?.present();

    return (
      <View
        style={{
          flex: 1,
          width: Dimensions.get('screen').width - 20,
          alignSelf: 'center',
        }}>
        <FlatList
          numColumns={2}
          columnWrapperStyle={{
            borderRadius: 18,
            justifyContent: 'space-between',
          }}
          data={analyticsData}
          keyExtractor={item => `${item.id}`}
          renderItem={({item}) => (
            <View
              style={{
                paddingVertical: 10,
                height: 75,
                width: item.id === 5 ? '100%' : '47.5%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15,
                borderRadius: 14,
                borderWidth: 0.5,
                borderColor: Colors.gray,
                flexDirection: 'row',
              }}>
              <View>
                <Text
                  style={{
                    color: item.color,
                    fontSize: 14,
                    fontFamily: 'UberMoveBold',
                    flexWrap: 'wrap',
                    letterSpacing: 2,
                  }}>
                  {item.label}
                </Text>
                {item.id === 3 ? (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      marginTop: 5,
                      fontFamily: 'UberMoveBold',
                      flexWrap: 'wrap',
                      letterSpacing: 2,
                    }}>
                    {item.value}%
                  </Text>
                ) : item.id === 1 ? (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      marginTop: 5,
                      fontFamily: 'UberMoveBold',
                      flexWrap: 'wrap',
                      letterSpacing: 2,
                    }}>
                    {item.value}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      marginTop: 5,
                      fontFamily: 'UberMoveBold',
                      flexWrap: 'wrap',
                      letterSpacing: 2,
                    }}>
                    ${item.value}
                  </Text>
                )}
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderLegend = (text: string, color: string) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontFamily: 'UberMoveBold',
            letterSpacing: 1,
          }}>
          {text || ''}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
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
              color: Colors.white,
              textAlign: 'left',
            }}>
            My Statistics
          </Text>
        </View>
      </View>
      <View>
        <View
          style={{
            width: Dimensions.get('screen').width - 20,
            borderRadius: 10,
            paddingVertical: 10,
            backgroundColor: 'black',
            borderWidth: 0.5,
            borderColor: Colors.gray,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
          }}>
          {/*********************    Custom Header component      ********************/}
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'UberMoveBold',
              marginBottom: 20,
              letterSpacing: 1,
            }}>
            Total volume
          </Text>
          {/****************************************************************************/}

          {score.map((p, i) => {
            return (
              <Donut
                key={i}
                percentage={p.percentage}
                strokeWidth={p.strokeWidth}
                radius={p.radius}
                rotation={p.rotation}
                suffix={p.suffix}
                color={p.color}
                delay={1500}
                max={p.max}
                textColor={p.textColor}
              />
            );
          })}

          {/*********************    Custom Legend component      ********************/}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: 20,
            }}>
            {renderLegend('Jan', Colors.pink)}
            {renderLegend('Feb', Colors.grin)}
            {renderLegend('Mar', Colors.venmo)}
          </View>
          {/****************************************************************************/}
        </View>
      </View>
      {renderFeatures()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // steps
  stepIndicatorContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    marginVertical: 30,
  },
  stepIndicator: {
    height: 10,
    width: 10,
    borderWidth: 3,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
});

export default StatScreen;
