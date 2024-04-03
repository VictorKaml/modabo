import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const NumberKeyboard: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleNumberPress = (number: number) => {
    setInputValue((prevValue) => prevValue + number.toString());
  };

  const handleDeletePress = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  return (
    <View style={styles.keyboardContainer}>
      <TextInput
        style={styles.input}
        placeholder="Type here"
        value={inputValue}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        {[1, 2, 3].map((number) => (
          <TouchableOpacity
            key={number}
            style={styles.button}
            onPress={() => handleNumberPress(number)}
          >
            <Text style={styles.buttonText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {[4, 5, 6].map((number) => (
          <TouchableOpacity
            key={number}
            style={styles.button}
            onPress={() => handleNumberPress(number)}
          >
            <Text style={styles.buttonText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {[7, 8, 9].map((number) => (
          <TouchableOpacity
            key={number}
            style={styles.button}
            onPress={() => handleNumberPress(number)}
          >
            <Text style={styles.buttonText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={handleDeletePress}>
          <Text style={styles.buttonText}>DEL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNumberPress(0)}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default NumberKeyboard;