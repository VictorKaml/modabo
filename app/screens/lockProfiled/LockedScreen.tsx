// LoginScreen.tsx
import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, View, Text, ActivityIndicator} from 'react-native';
import Colors from '../../utils/Colors';
import {supabase} from '../../../lib/supabase';

interface SplashScreenProps {
  navigation: any; // You might want to replace 'any' with the proper navigation type
}

const LockScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>();

  useEffect(() => {
    VerifyIsEnabled();
    // Subscribe to changes in the transaction table
    supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'profiles'},
        VerifyIsEnabled,
      )
      .subscribe();
  }, [VerifyIsEnabled]);

  async function VerifyIsEnabled() {
    try {
      // Get logged in user id
      let {data: users} = await supabase.auth.getUser();

      const client_id = users.user?.id;

      // Check if the profile is enabled or not
      const {data: profiles, error} = await supabase
        .from('profiles')
        .select('enabled')
        .eq('id', client_id)
        .single();

      if (error) {
        console.log('Error:', error);
      }

      console.log('Is profile enabled?', profiles?.enabled);

      if (profiles?.enabled === true) {
        setIsEnabled(true);
        setTimeout(() => {
          navigation.navigate('Main');
        }, 2000);

        // just hide the splash screen after navigation ready
      } else {
        setIsEnabled(false);
        return;
      }
    } catch (error) {
      console.log('Error cheching if accound is enabled', error);
    }
  }

  return (
    <View style={style.container}>
      {isEnabled !== null ? (
        <View>
          {isEnabled === true && (
            <Image
              source={require('../../assets/img/interface/unlock.png')}
              style={{
                height: 50,
                width: 50,
                tintColor: Colors.grin,
                alignSelf: 'center',
              }}
            />
          )}
          {isEnabled === false && (
            <Image
              source={require('../../assets/img/interface/lock.png')}
              style={{
                height: 50,
                width: 50,
                tintColor: Colors.grin,
                alignSelf: 'center',
              }}
            />
          )}
          {isEnabled === false && (
            <Text
              style={{
                color: Colors.gray,
                fontFamily: 'UberMoveBold',
                fontSize: 18,
                letterSpacing: 1,
                marginTop: 20,
                marginBottom: 10,
                textAlign: 'center',
              }}>
              Profile Locked
            </Text>
          )}
          {isEnabled === true && (
            <Text
              style={{
                color: Colors.gray,
                fontFamily: 'UberMoveBold',
                fontSize: 18,
                letterSpacing: 1,
                marginTop: 20,
                marginBottom: 10,
                textAlign: 'center',
              }}>
              Profile Unlocked
            </Text>
          )}
          {isEnabled === false && (
            <Text
              style={{
                color: Colors.gray,
                fontFamily: 'UberMoveBold',
                fontSize: 14,
                textAlign: 'center',
                letterSpacing: 1,
              }}>
              Verification in progress...
            </Text>
          )}
          {isEnabled === true && (
            <Text
              style={{
                color: Colors.grin,
                fontFamily: 'UberMoveBold',
                fontSize: 14,
                textAlign: 'center',
                letterSpacing: 1,
              }}>
              Verified
            </Text>
          )}
        </View>
      ) : (
        <ActivityIndicator color={Colors.grin} size={'large'} />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

export default LockScreen;
