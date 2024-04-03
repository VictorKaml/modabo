import { Dimensions, StyleSheet } from 'react-native'
import { myColors } from './Colors'
import Colors from '../utils/Colors'

export const Styles = StyleSheet.create({
  // Button
  btnBlue: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: myColors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  btnDark: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: myColors.btnDark,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  btnLight: {
    width: (Dimensions.get('screen').width * 30) / 100 - 20,
    height: 50,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'gray',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 7,
  },
  btnLight2: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  btnGray: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: myColors.btnGray,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  smallTextLight: {
    fontSize: 32,
    color: 'myColors.white',
    fontFamily: 'Nunito-Black',
  },
  smallTextDark: {
    fontSize: 14,
    color: Colors.grin,
    fontFamily: 'UberMoveBold',
  },
  // Keyboard
  row: {
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  viewBottom: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'black',
  },
  screenFirstNumber: {
    width: '100%',
    textAlign: 'center',
    fontSize: 36,
    color: 'white',
    fontFamily: 'Nunito-Black',
    alignSelf: 'center',
    letterSpacing: 1,
  },
  screenSecondNumber: {
    fontSize: 36,
    color: myColors.gray,
    fontWeight: '200',
    alignSelf: 'flex-end',
  },
});
