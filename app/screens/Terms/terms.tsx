import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, Button, StyleSheet, BackHandler } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RadioButton, Switch } from 'react-native-paper'

const TermsAndPrivacyScreen = ({ navigation }) => {
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    const backAction = () => {
      // Navigate back to a specific screen
      navigation.navigate('Main', {
        screen: 'Settings',
      })
      return true // Prevent default behavior (exit app)
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove() // Remove event listener on unmount
  }, [navigation])

  const handleAgree = () => {
    setAgreed(!agreed)
  }

  const handleContinue = () => {
    // Navigate to the next screen or perform desired action
    setAgreed(true)
    if (!agreed) {
      // Navigate back to a specific tab screen
      navigation.navigate('Main', {
        screen: 'Settings',
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms and Privacy Policy</Text>
      <Text style={[styles.content, { marginBottom: 5, fontSize: 18 }]}>Introduction </Text>
      <Text style={styles.content}>
        Modabo, Inc ("Modabo", "we", "us", or "our") is dedicated to safeguarding the privacy and security of our users' personal
        information. This Privacy Policy elucidates how Modabo collects, utilizes, discloses, and administers your data when you use our
        services. By accessing or using our platform, you acknowledge and consent to the terms outlined in this policy.
      </Text>
      <Text style={[styles.content, { marginBottom: 5, fontSize: 18 }]}>Data Collection: </Text>
      <Text style={styles.content}>
        Modabo may collect various types of information from users, including but not limited to: Personal Information: Name, contact
        details, date of birth, and identification documents. Financial Information: Bank account details, transaction history, and credit
        card information.
      </Text>
      <Text style={[styles.content, { marginBottom: 5, fontSize: 18 }]}>Purpose of Data Usage:</Text>
      <Text style={styles.content}>
        We utilize this data to: Authenticate users and prevent fraudulent activities. Process transactions and provide financial services.
        Customize user experiences and improve our services. Comply with legal and regulatory requirements.
      </Text>
      <Text style={[styles.content, { marginBottom: 5, fontSize: 18 }]}>Data Security:</Text>
      <Text style={styles.content}>
        Your data is stored securely and is accessible only to authorized personnel. We implement industry-standard security measures to
        protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
      </Text>
      <Text style={[styles.content, { marginBottom: 5, fontSize: 18 }]}>Data Access and Management:</Text>
      <Text style={styles.content}>
        As a user of Modabo, you have the right to: Access and review your personal information stored in our database. Update or correct
        any inaccuracies in your data. Delete or deactivate your account if desired.
      </Text>
      <Text style={[styles.content, { marginBottom: 5, fontSize: 18 }]}>Consent:</Text>
      <Text style={styles.content}>
        By using Modabo's services, you consent to the collection, processing, and storage of your data as described in this Privacy Policy.
        Any material changes to this policy will be communicated to you via email or through our platform. Your continued use of our
        services following such changes constitutes acceptance of the updated policy.
      </Text>
      <Text style={[styles.content, { marginBottom: 5, fontSize: 18 }]}>Contact Us:</Text>
      <Text style={styles.content}>
        If you have any inquiries or concerns regarding your privacy or data management practices, please contact Modabo's Privacy Team at{' '}
        <Text style={[styles.content, { color: '#00ff83' }]}>privacy@modabo.com.</Text>
      </Text>
      <Text style={styles.content}>
        Modabo, Inc strives to uphold the highest standards of privacy and security to preserve the confidentiality of your information. We
        value your trust and appreciate your collaboration in maintaining a secure environment for all our users.
      </Text>
      <View style={styles.checkboxContainer}>
        <RadioButton.Android
          value={agreed}
          onPress={() => handleAgree()}
          color="#00ff83"
          uncheckedColor="gray"
          status={agreed ? 'checked' : 'unchecked'}
        />
        <Text style={styles.checkboxLabel}>I agree to the Terms and Privacy Policy</Text>
      </View>

      {!agreed && (
        <TouchableOpacity onPress={handleContinue} style={[styles.button, { flexDirection: 'row' }]}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  button: {
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'UberMoveBold',
    marginBottom: 20,
  },
  content: {
    fontSize: 14,
    color: 'white',
    textAlign: 'justify',
    fontFamily: 'UberMoveBold',
    marginBottom: 20,
    letterSpacing: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 20,
  },

  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'UberMoveBold',
    color: 'white',
  },
  btnText: {
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: 'UberMoveBold',
    color: 'black',
  },
})

export default TermsAndPrivacyScreen
