// CustomButton.tsx
import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
}

const TransferBtn: React.FC<CustomButtonProps> = ({title, ...props}) => {
  return (
    <TouchableOpacity style={styles.button1} {...props}>
      <Text style={styles.transferBtnTxt}>{title}</Text>
    </TouchableOpacity>
  );
};

const backBtn: React.FC<CustomButtonProps> = ({title, ...props}) => {
  return (
    <TouchableOpacity style={styles.button2} {...props}>
      <Text style={styles.transferBtnTxt}>{title}</Text>
    </TouchableOpacity>
  );
};

const CustomButton2: React.FC<CustomButtonProps> = ({title, ...props}) => {
  return (
    <TouchableOpacity style={styles.button2} {...props}>
      <Text style={styles.buttonText2}>{title}</Text>
    </TouchableOpacity>
  );
};

const SignInBtn: React.FC<CustomButtonProps> = ({title}) => {
  return (
    <TouchableOpacity style={styles.signInBtn}>
      <Text style={styles.signInBtnTxt}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button1: {
    width: '80%',
    height: 50,
    marginBottom: 16,
    backgroundColor: 'black', // Set your desired background color
    padding: 10,
    borderRadius: 18,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button3: {
    width: '37.5%',
    height: 50,
    marginBottom: 16,
    backgroundColor: 'black', // Set your desired background color
    padding: 10,
    borderRadius: 24,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferBtnTxt: {
    color: 'white', // Set your desired text color
    fontSize: 14,
    fontFamily: 'Nunito-Black',
    letterSpacing: 1,
  },
  button2: {
    width: '25%',
    height: 60,
    backgroundColor: '#00ffa8', // Set your desired background color
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText2: {
    color: 'black', // Set your desired text color
    fontSize: 14,
    fontFamily: 'Nunito-Black',
    letterSpacing: 1,
  },
  signInBtn: {
    width: '80%',
    height: 60,
    backgroundColor: '#00ffa8', // Set your desired background color
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInBtnTxt: {
    color: 'red', // Set your desired text color
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default TransferBtn;
CustomButton2;
SignInBtn;
backBtn;
