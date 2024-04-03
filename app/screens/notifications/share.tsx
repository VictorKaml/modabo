import {StyleSheet, Button, View, Alert, StatusBar} from 'react-native';
import Share from 'react-native-share';
export default function ShareInfo() {
  const options = {
    title: 'My thoughts.',
    message: 'I want to share more with the world!',
    url: 'https://google.com',
  };
  const onShare = async (myOptions = options) => {
    try {
      await Share.open(myOptions);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Button
        onPress={async () => {
          await onShare();
        }}
        title="Share"
      />
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
