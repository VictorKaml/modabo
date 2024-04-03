import {View, Text, Dimensions} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import Colors from '../../utils/Colors';
const App = () => {
  const renderLegend = (text, color) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontFamily: 'UberMoveBold',
            letterSpacing: 1,
          }}>
          {text || ''}
        </Text>
      </View>
    );
  };

   const pieData = [
     {value: 70, color: '#177AD5'},
     {value: 30, color: 'lightgray'},
   ];

  return (
    <View>
      <View
        style={{
          width: Dimensions.get('screen').width - 20,
          borderRadius: 10,
          paddingVertical: 10,
          backgroundColor: 'black',
          borderWidth: 0.5,
          borderColor: Colors.gray,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/*********************    Custom Header component      ********************/}
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontFamily: 'UberMoveBold',
            marginBottom: 12,
            letterSpacing: 1,
          }}>
          Analytics
        </Text>
        {/****************************************************************************/}

        <PieChart
          donut
          innerRadius={80}
          data={pieData}
          centerLabelComponent={() => {
            return <Text style={{fontSize: 30}}>70%</Text>;
          }}
        />

        {/*********************    Custom Legend component      ********************/}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 20,
          }}>
          {renderLegend('Jan', Colors.pink)}
          {renderLegend('Feb', Colors.grin)}
          {renderLegend('Mar', Colors.venmo)}
        </View>
        {/****************************************************************************/}
      </View>
    </View>
  );
};

export default App;
