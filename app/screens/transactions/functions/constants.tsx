import { Alert, Vibration } from 'react-native'
import notifee, { AndroidImportance, EventType } from '@notifee/react-native'
import { supabase } from '../../../../lib/supabase'
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigator/RootNavigator'

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

export const confirmTransactionWithPassword = async (password) => {
  // Verify password with the user's profile data
  // Implement your authentication logic
  // For demonstration, you can compare the password with a stored hash
  let { data: users } = await supabase.auth.getUser()

  const currentUser = users.user?.id

  const { data: userData, error: userError } = await supabase.from('profiles').select('*').eq('id', currentUser).single()

  if (userError || !userData) {
    throw new Error('User not found')
  }

  console.log('User found: ')
  // Compare the entered password with the stored hash
  // Implement your password verification logic
  const isPasswordCorrect = comparePasswordHash(password, userData.password)
  return isPasswordCorrect
}

const comparePasswordHash = (password, hash) => {
  // Implement password comparison logic (e.g., using bcrypt)
  // For demonstration, you can compare the plain password with the stored hash
  return password === hash
}

export async function koko(amount, receiverBalance, recipient, password, screen) {
  let { data: users } = await supabase.auth.getUser()

  const client_id = users.user?.id

  console.log(client_id)

  try {
    let { data: users, error, status } = await supabase.from('accounts').select('balance').eq('id', client_id).single()

    if (error && status != 406) {
      console.log(error.message)
      Vibration.vibrate(100)
      return
    }

    const senderBalance = users?.balance
    const totalAmount = parseFloat(amount) // Convert amount to float

    // Implement your logic to check if the sender has sufficient balance
    // You may also want to check for minimum balance, daily transaction limits, etc.
    if (senderBalance < 0 && totalAmount > 0) {
      // Display an error message and prevent the transaction
      Alert.alert('You dont have money, add funds to acount.')
      return
    } else if (totalAmount > senderBalance) {
      Alert.alert('The amount entered is greater than your balance.')
      return
    } else if (senderBalance < totalAmount) {
      Alert.alert('Insufficient balance, add funds to account')
      return
    }

    // Prompt user to confirm the transaction with their password
    // You might want to implement OTP or more secure authentication
    const confirmed = await confirmTransactionWithPassword(password)

    if (!confirmed) {
      Alert.alert('Transaction not confirmed')
      return
    }

    const updatedSenderBalance = senderBalance - totalAmount // Calculate new balance
    const { error: updateSenderError } = await supabase.from('accounts').update({ balance: updatedSenderBalance }).eq('id', currentUser)

    if (updateSenderError) {
      Alert.alert('Error updating sender balance')
      return
    }

    const updatedReceiverBalance = receiverBalance + totalAmount

    // Update recipient's balance
    const { error: updateRecipientError } = await supabase
      .from('accounts')
      .update({ balance: updatedReceiverBalance }) // Increment balance
      .eq('username', recipient)

    if (updateRecipientError) {
      Alert.alert('Error updating recipient balance')
      return
    }

    console.log('Success', 'Transaction completed successfully')
    console.log('Update receiver balance', receiverBalance)
    console.log('Updated sender balance', senderBalance)

    navigation.navigate(screen)

    const transfeeMsg = '$' + totalAmount + ' sent to @' + recipient

    onDisplayNotification(transfeeMsg)
  } catch (error) {
    console.log('error', error)
  }
}

export async function verifySenderBalance(amount, receiverBalance, recipient, password, screen) {
  let { data: users } = await supabase.auth.getUser()

  const client_id = users.user?.id

  console.log(client_id)

  try {
    let { data: users, error, status } = await supabase.from('accounts').select('balance').eq('id', client_id).single()

    if (error && status != 406) {
      console.log(error.message)
      Vibration.vibrate(100)
      return
    }

    const senderBalance = users?.balance
    const totalAmount = parseFloat(amount) // Convert amount to float

    // Implement your logic to check if the sender has sufficient balance
    // You may also want to check for minimum balance, daily transaction limits, etc.
    if (senderBalance < 0 && totalAmount > 0) {
      // Display an error message and prevent the transaction
      Alert.alert('You dont have money, add funds to acount.')
      return
    } else if (totalAmount > senderBalance) {
      Alert.alert('The amount entered is greater than your balance.')
      return
    } else if (senderBalance < totalAmount) {
      Alert.alert('Insufficient balance, add funds to account')
      return
    }

    // Prompt user to confirm the transaction with their password
    // You might want to implement OTP or more secure authentication
    const confirmed = await confirmTransactionWithPassword(password)

    if (!confirmed) {
      Alert.alert('Transaction not confirmed')
      return
    }

    const updatedSenderBalance = senderBalance - totalAmount // Calculate new balance
    const { error: updateSenderError } = await supabase.from('accounts').update({ balance: updatedSenderBalance }).eq('id', currentUser)

    if (updateSenderError) {
      Alert.alert('Error updating sender balance')
      return
    }

    const updatedReceiverBalance = receiverBalance + totalAmount

    // Update recipient's balance
    const { error: updateRecipientError } = await supabase
      .from('accounts')
      .update({ balance: updatedReceiverBalance }) // Increment balance
      .eq('username', recipient)

    if (updateRecipientError) {
      Alert.alert('Error updating recipient balance')
      return
    }

    console.log('Success', 'Transaction completed successfully')
    console.log('Update receiver balance', receiverBalance)
    console.log('Updated sender balance', senderBalance)

    navigation.navigate(screen)

    const transfeeMsg = '$' + totalAmount + ' sent to @' + recipient

    onDisplayNotification(transfeeMsg)
  } catch (error) {
    console.log('error', error)
  }
}

export async function onDisplayNotification(message) {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    badge: true,
    importance: AndroidImportance.HIGH,
  })

  // Display a notification
  await notifee.displayNotification({
    title: 'Transfer Complete',
    body: message,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      largeIcon: require('../../../assets/img/profile/balaclava1.jpg'), // optional, defaults to 'ic_launcher'.
      timestamp: Date.now(), // 8 minutes ago
      showTimestamp: true,
      color: 'black',
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  })
}
