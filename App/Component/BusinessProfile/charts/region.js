import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, FlatList, ScrollView,StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Common_Color,TitleHeader } from '../../../Assets/Colors'
import ChartView from 'react-native-highcharts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
var Highcharts = 'Highcharts';
const options = {
  global: {
    useUTC: false
  },
  lang: {
    decimalPoint: ',',
    thousandsSep: '.'
  }
};

export default class Region extends Component {

  constructor(props) {
    super(props)
    this.state = {
      LocationArr: [], reg: [], regCode: [], Locationcountry: [], result: [], language: "", 
      chartData: this.conf
    }

    this.conf = this.conf
  }

  conf = {
    chart: {
      type: 'column',
      backgroundColor: '#f1f1f1',
      borderRadius: 15,
      animation: Highcharts.svg, // don't animate in old IE
      marginRight: 0,
    },
    plotOptions: {
      series: {
        pointWidth: 35,
        borderRadiusTopLeft: 10,
        borderRadiusTopRight: 10,
        borderColor: 'rgba(0,0,0,0)'
      },
      column: {
        grouping: false,

      }
    },
    title: {
      text: ''
    },
    xAxis: {
      // type: 'category',
      // categories: ['IND', 'AUS', 'USA', 'JPN', 'UK', 'UAE',]
      categories: []

      // tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: ''
      },

      gridLineColor: 'transparent',
      // plotLines: [{
      //     value: 0,
      //     width: 1,
      //     color: '#808080'
      // }]
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [
      {

        name: 'Region',
        data: []
      },

    ]

  };


  componentDidMount() {
    this.getReg()
  }

  async getReg() {
    debugger
    // let regCode = this.props.RESource
    // let regData = [1, 5,6]
    // LocationArr = await AsyncStorage.getItem('Region');
    // LocationAr = LocationArr.split(',')
    regCode = this.props.RESource
    console.log("regCode", regCode)
    var regio = regCode.Country;

    Locationcountry = await AsyncStorage.getItem('RegionCountry');
    this.setState({
      Locationcountry: Locationcountry.split(',')
    })
    console.log("LocationArr", this.state.Locationcountry)

    var result = this.state.Locationcountry.reduce((unique, o) => {
      if (!unique.some(obj => obj === o
      )) {
        unique.push(o);
      }
      return unique;
    }, []);

    console.log("result", result)
    let Countrydup = this.props.regDuplicateCountry;
    let res = Countrydup.map(a => a.substring(0, 3))
    let CountryCountdup = this.props.regFilterDuplicateCountryCount;
    //UTSource
    this.setState({
      result: result,
      chartData: {
        ...this.state.chartData,
        xAxis: [{ categories: res }],
        series: [{ data: CountryCountdup }]
      }
    })

    LocationArr = await AsyncStorage.getItem('RegionCode');
    this.setState({
      LocationArr: LocationArr.split(',')
    })

  }
  monthSelection(itemValue, itemIndex) {
   // debugger;
    this.setState({ language: itemValue })
    console.log('+++++', itemValue)
    if (itemValue) {
      console.log('----------', this.state.Locationcountry)
      var select = this.state.Locationcountry.filter(e2 => e2 == itemValue).length;
      console.log('select dup count', select)
      FinalArr = [select]
      let chck = this.state.language;
      console.log('%%%%%', chck)
      let Countrydup = itemValue;
      let res = [Countrydup]
      let xres = res.map(a => a.substring(0, 3))
      //.substring(0,1,2,3)
      console.log('%%%%%', [res])
      this.setState({
        chartData: {
          ...this.state.chartData,
          xAxis: [{ categories: xres }],
          series: [{ data: FinalArr }]
        }
      })
      // console.log('final',this.state.chartData)
    }
    else if (itemValue == "All Countries") {
      console.log("b", itemValue == "All Countries")
      let Countrydup = this.props.regDuplicateCountry;
      let res = Countrydup.map(a => a.substring(0, 3))
      let CountryCountdup = this.props.regFilterDuplicateCountryCount;
      //UTSource
      this.setState({
        chartData: {
          ...this.state.chartData,
          xAxis: [{ categories: res }],
          series: [{ data: CountryCountdup }]
        }
      })
    }

  }
 
 
  render() {
    let LocationItems = this.state.result.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />
    });
    console.log("LocationItems", LocationItems);

    return (
      <View>

        <View style={{
          backgroundColor: '#0000', width: wp('95%'), height: hp('50%'),
          marginLeft: 10, marginBottom: 60
        }}>
          <Text style={{ fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, marginBottom: 10,marginLeft:7 }}>Region</Text>
          <View style={{ position: 'absolute', height: 50, width: '100%', ...StyleSheet.absoluteFillObject, zIndex: 1 }}>
            <Picker
              // style={{
              //   height: 50, width: '30%', top: 30, right: 5, position: "absolute",
              //   borderRadius: 10, borderWidth: 2, color: 'grey'
              // }}
              itemStyle={{
                height: 50, width: '30%', backgroundColor: '#fff', borderRadius: 10, borderWidth: .5,
                left: wp('100%') / 1.5, top: 25, position: 'absolute',fontSize:14
              }}
              selectedValue={this.state.language}
              onValueChange={(itemValue, itemIndex) =>
                this.monthSelection(itemValue, itemIndex)
              }>
              <Picker.Item label="All Countries" value="All Countries" />
              {LocationItems}
            </Picker>
          </View>
          <ChartView
            style={{ height: 300 }}
            config={this.state.chartData}
            options={options}
            originWhitelist={['']}
          />
          
       </View>

      </View>
    )
  }
}