import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'

import Dot from './Dot'
import { OnboardingData } from '../data/data'

type Props = {
  data: OnboardingData[]
  buttonVal: SharedValue<number>
}
const Pagination = ({ data, buttonVal }: Props) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => {
        return <Dot index={index} buttonVal={buttonVal} key={index} />
      })}
    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
  },
})
