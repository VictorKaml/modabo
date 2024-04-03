import { useRef, useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { LineChart, yAxisSides } from 'react-native-gifted-charts'
const App = () => {
  const ref = useRef(null)
  const ptData = [
    { value: 160, date: '1 Apr 2022' },
    { value: 180, date: '2 Apr 2022' },
    { value: 190, date: '3 Apr 2022' },
    { value: 180, date: '4 Apr 2022' },
    { value: 140, date: '5 Apr 2022' },
    { value: 145, date: '6 Apr 2022' },
    { value: 160, date: '7 Apr 2022' },
    { value: 200, date: '8 Apr 2022' },

    { value: 220, date: '9 Apr 2022' },
    {
      value: 240,
      date: '10 Apr 2022',
      label: '10 Apr',
    },
    { value: 280, date: '11 Apr 2022' },
    { value: 260, date: '12 Apr 2022' },
    { value: 340, date: '13 Apr 2022' },
    { value: 385, date: '14 Apr 2022' },
    { value: 280, date: '15 Apr 2022' },
    { value: 390, date: '16 Apr 2022' },

    { value: 370, date: '17 Apr 2022' },
    { value: 285, date: '18 Apr 2022' },
    { value: 295, date: '19 Apr 2022' },
    {
      value: 300,
      date: '20 Apr 2022',
      label: '20 Apr',
    },
    { value: 280, date: '21 Apr 2022' },
    { value: 295, date: '22 Apr 2022' },
    { value: 260, date: '23 Apr 2022' },
    { value: 255, date: '24 Apr 2022' },

    { value: 190, date: '25 Apr 2022' },
    { value: 220, date: '26 Apr 2022' },
    { value: 205, date: '27 Apr 2022' },
    { value: 230, date: '28 Apr 2022' },
    { value: 210, date: '29 Apr 2022' },
    {
      value: 200,
      date: '30 Apr 2022',
      label: '30 Apr',
    },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
  ]

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const showOrHidePointer = (ind) => {
    ref.current?.scrollTo({
      x: ind * 200 - 25,
    }) // adjust as per your UI
  }

  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: ' white',
      }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginBottom: 5 }}>
        {months.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 10,
                margin: 5,
                backgroundColor: 'white',
                borderRadius: 8,
              }}
              onPress={() => showOrHidePointer(index)}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'Nunito-Black',
                  textAlign: 'center',
                  letterSpacing: 1,
                }}>
                {months[index]}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <View
        style={{
          borderRadius: 14,
          paddingVertical: 10,
          marginHorizontal: 10,
          backgroundColor: 'black',
        }}>
        <LineChart
          isAnimated
          curved
          areaChart
          hideDataPoints
          scrollRef={ref}
          animateOnDataChange
          animationDuration={3000}
          onDataChangeAnimationDuration={100}
          data={ptData}
          rotateLabel={false}
          width={Dimensions.get('window').width}
          dataPointsColor="#00ff83"
          spacing={10}
          scrollToEnd
          color="#00ff83"
          thickness={1}
          startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
          startOpacity={0.9}
          endOpacity={0}
          initialSpacing={0}
          maxValue={600}
          hideRules
          hideAxesAndRules
          xAxisLabelTextStyle={{
            color: 'white',
            fontFamily: 'Nunito-Black',
            width: 60,
            flex: 1,
            textAlign: 'center',
            letterSpacing: 1,
          }}
          yAxisTextStyle={{ color: 'gray' }}
          yAxisSide={yAxisSides.RIGHT}
          xAxisColor="lightgray"
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items) => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    justifyContent: 'center',
                    marginTop: -10,
                    marginLeft: -40,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      marginBottom: 6,
                      textAlign: 'center',
                    }}>
                    {items[0].date}
                  </Text>

                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: 'white',
                    }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{'$' + items[0].value + '.0'}</Text>
                  </View>
                </View>
              )
            },
          }}
        />
      </View>
    </View>
  )
}

export default App
