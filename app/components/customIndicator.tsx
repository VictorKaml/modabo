// ActivityIndicator.js
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const CustomActivityIndicator = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.overlay]}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomActivityIndicator;