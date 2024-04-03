import {BarChart} from 'react-native-gifted-charts';
import {View, Text, Dimensions} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

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

  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: tabBarHeight + 20,
      }}>
      <BarChart
        showLine={false}
        showFractionalValues
        disablePress={false}
        disableScroll
        intactTopLabel
        topLabelTextStyle={{
          color: 'white',
          fontFamily: 'Nunito-Black',
          fontSize: 12,
        }}
        hideYAxisText={true}
        xAxisLabelTextStyle={{
          color: 'gray',
          fontFamily: 'Nunito-Black',
          fontSize: 12,
        }}
        isAnimated
        scrollAnimation
        hideRules={true}
        height={100}
        width={Dimensions.get('window').width - 10}
        barWidth={19.5}
        spacing={28}
        noOfSections={3}
        frontColor={'#00ff83'}
        barBorderRadius={18}
        data={barData}
        maxValue={600}
        yAxisThickness={0}
        xAxisThickness={0}
        renderTooltip={(item, index) => {
          return (
            <View
              style={{
                marginBottom: 5,
                marginLeft: -7,
                backgroundColor: 'white',
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 18,
                borderWidth: 1,
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
