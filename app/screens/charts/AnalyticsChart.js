import {BarChart} from 'react-native-gifted-charts';
import {View, Text, Dimensions} from 'react-native';

const Chart = () => {
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
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <BarChart
        showLine={false}
        showValuesAsTopLabel
        topLabelTextStyle={{
          color: 'white',
          fontFamily: 'Nunito-Black',
          fontSize: 14,
        }}
        xAxisLabelTextStyle={{
          color: 'white',
          fontFamily: 'Nunito-Black',
          fontSize: 14,
        }}
        disablePress={true}
        disableScroll
        hideYAxisText
        hideRules={true}
        height={Dimensions.get('window').height / 2.5}
        width={Dimensions.get('window').width - 5}
        spacing={30}
        barWidth={18}
        frontColor={'lightblue'}
        barBorderRadius={18}
        data={barData}
        yAxisThickness={0}
        showFractionalValues={false}
        renderTooltip={(item, index) => {
          return (
            <View
              style={{
                marginBottom: 5,
                marginLeft: -7,
                backgroundColor: 'black',
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Nunito-Black',
                  fontSize: 10,
                }}>
                {item.value}
              </Text>
            </View>
          );
        }}
        xAxisThickness={0}
      />
    </View>
  );
};

export default Chart;
