import {BarChart} from 'react-native-gifted-charts';
import {View, Text, Dimensions} from 'react-native';

const App = () => {
  const barData = [
    {value: 278, label: 'Mon'},

    {value: 180, label: 'Tue'},

    {value: 120, label: 'Wed'},

    {value: 320, label: 'Thu'},

    {value: 400, label: 'Fri'},

    {value: 350, label: 'Sat'},

    {value: 300, label: 'Sun'},
  ];

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <BarChart
        showLine={false}
        disablePress={true}
        showValuesAsTopLabel
        disableScroll
        topLabelTextStyle={{
          color: 'black',
          fontFamily: 'Nunito-Black',
          fontSize: 12,
        }}
        hideYAxisText={true}
        xAxisLabelTextStyle={{
          color: 'black',
          fontFamily: 'Nunito-Black',
          fontSize: 12,
        }}
        isAnimated
        hideRules={true}
        height={100}
        width={Dimensions.get('window').width - 10}
        barWidth={20}
        spacing={28}
        noOfSections={3}
        frontColor={'lightblue'}
        barBorderRadius={18}
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        renderTooltip={(item, index) => {
          return (
            <View
              style={{
                marginBottom: 5,
                marginLeft: -7,
                backgroundColor: 'lightblue',
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: 'lightblue',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Nunito-Black',
                  fontSize: 10,
                }}>
                {item.value}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default App;
