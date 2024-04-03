import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'

const TypingEffect = ({ numbers, speed, onFinish, fontSize }) => {
  const [displayedNumber, setDisplayedNumber] = useState('')
  const [numberIndex, setNumberIndex] = useState(0)

  useEffect(() => {
    let currentIndex = 0

    const typingInterval = setInterval(() => {
      if (currentIndex <= numbers[numberIndex]) {
        const formattedNumber = new Intl.NumberFormat('en-US', {}).format(numbers[numberIndex])
        setDisplayedNumber(numbers[numberIndex].slice(0, currentIndex))
        currentIndex += 1
      } else {
        clearInterval(typingInterval)

        if (numberIndex === numbers.length - 1) {
          // If it's the last number, call onFinish callback
          onFinish && onFinish()
        } else {
          // Move to the next number after a delay
          setTimeout(() => {
            setNumberIndex((prevIndex) => prevIndex + 1)
          }, 1000) // Change this delay as needed
        }
      }
    }, speed)

    return () => clearInterval(typingInterval)
  }, [numbers, numberIndex, speed])

  return (
    <View>
      <Text
        style={{
          color: 'black',
          fontSize: fontSize,
          fontFamily: 'Nunito-Black',
          textAlign: 'center',
          letterSpacing: 2,
        }}>
        ${displayedNumber}
      </Text>
    </View>
  )
}

export default TypingEffect
