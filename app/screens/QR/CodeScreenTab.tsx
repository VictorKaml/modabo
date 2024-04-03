import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, AlertButton, Image, Linking, StatusBar, StyleSheet, Vibration, View } from 'react-native'
import { CameraPermissionStatus, Code, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, SAFE_AREA_PADDING } from './Constants'
import { useIsForeground } from './hooks/useIsForeground'
import { PressableOpacity } from 'react-native-pressable-opacity'
import IonIcon from 'react-native-vector-icons/Ionicons'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/core'
import { RootStackParamList } from '../navigator/RootNavigator'
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native'

const showCodeAlert = (value: string, onDismissed: () => void): void => {
  const buttons: AlertButton[] = [
    {
      text: 'Close',
      style: 'cancel',
      onPress: onDismissed,
    },
  ]
  if (value.startsWith('http')) {
    buttons.push({
      text: 'Open URL',
      onPress: () => {
        Linking.openURL(value)
        onDismissed()
      },
    })
  }
  Alert.alert('Scanned Code', value, buttons)
}
const CodeTab = () => {
  // 1. Use a simple default back camera
  const device = useCameraDevice('back')

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocused && isForeground

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false)

  // 4. On code scanned, we show an aler to the user
  const isShowingAlert = useRef(false)
  const onCodeScanned = useCallback((codes: Code[]) => {
    Vibration.vibrate(100)
    console.log(`Scanned ${codes.length} codes:`, codes)
    const value = codes[0]?.value
    if (value == null) {
      return
    }
    if (isShowingAlert.current) {
      return
    }
    showCodeAlert(value, () => {
      isShowingAlert.current = false
    })
    isShowingAlert.current = true
  }, [])

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  })

  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined')

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...')
    const permission = await Camera.requestCameraPermission()
    console.log(`Camera permission status: ${permission}`)

    if (permission === 'denied') {
      await Linking.openSettings()
    }
    setCameraPermissionStatus(permission)
  }, [])

  useEffect(() => {
    if (cameraPermissionStatus === 'granted') {
      return
    } else if (cameraPermissionStatus === 'denied') {
      requestCameraPermission()
      return
    }
  })

  return (
    <View style={styles.container}>
      {device != null && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          torch={torch ? 'on' : 'off'}
          enableZoomGesture={true}
        />
      )}

      <View style={styles.rightButtonRow}>
        <PressableOpacity style={styles.button} onPress={() => setTorch(!torch)} disabledOpacity={0.4}>
          <IonIcon name={torch ? 'flash' : 'flash-off'} color="white" size={24} />
        </PressableOpacity>
      </View>
      <Image
        source={require('../../assets/img/interface/scan.png')}
        resizeMode="contain"
        style={{
          height: Dimensions.get('window').width / 1.8,
          width: Dimensions.get('window').width / 1.8,
          tintColor: 'white',
        }}
      />
    </View>
  )
}

export default CodeTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE + 20,
    height: CONTROL_BUTTON_SIZE + 20,
    borderRadius: CONTROL_BUTTON_SIZE + 20 / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    bottom: 100,
  },
  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
})
