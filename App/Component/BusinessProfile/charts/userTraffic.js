import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Common_Color, TitleHeader } from '../../../Assets/Colors'
import ChartView from 'react-native-highcharts';
import AsyncStorage from '@react-native-async-storage/async-storage';


var Highcharts = 'Highcharts';
const options = {
  global: {
    useUTC: false
  },
  lang: {
    decimalPoint: ',',
    thousandsSep: '.',
  }
};

export default class UserTraffic extends Component {

  constructor(props) {
    super(props)
    this.state = {
      FollowersArr: [],
      UnFollowersArr: [],
      visitorsArr: [],
      monthStore: '',
      Followmonth: '',
      Unfollowmonth: '',
      Visitmonth: '',
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
      categories: ['Followed', 'UnFollowed', 'Visitors']
      // tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: ''
      },
      gridLineColor: 'transparent',

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

        name: 'User Traffic',
        data: []
        //[49.9,20.9,60.5]
      },

    ]


  };


  componentDidMount() {
    this.getUTDatas()
  }

  getUTDatas = async () => {
    debugger
    let UserTrafficDatas = this.props.UTSource

    this.setState({
      chartData: {
        ...this.state.chartData,
        series: [{ data: UserTrafficDatas }]
      }
    })
    FollowersArr = await AsyncStorage.getItem('Followers');
    UnFollowersArr = await AsyncStorage.getItem('UnFollowers');
    visitorsArr = await AsyncStorage.getItem('visitors');
   
      if (FollowersArr != null ) {
    var splitRes = FollowersArr && FollowersArr.split(",");
    let monthArr = splitRes && splitRes.map(r => ({ mn: r.split('-') }))
      , Followmonth = monthArr && monthArr.map(a => a.mn[1])
      this.setState({
        Followmonth: Followmonth ,
      })
      }
  
    if (UnFollowersArr != null ) {
      var splitRes1 = UnFollowersArr.split(",");
      
     let monthArr1 = splitRes1.map(rm => ({ mnt: rm.split('-') }))
        , Unfollowmonth = monthArr1.map(ab => ab.mnt[1])
        this.setState({       
         Unfollowmonth: Unfollowmonth,
        })
      }
    

    // if (visitorsArr.length > 0) {
    //   var splitRes2 = visitorsArr.split(",");
    //   let monthArr = splitRes2.map(r => ({ mn: r.split('-') }))
    //     , Visitmonth = monthArr.map(a => a.mn[1])
    // }
    this.setState({
    //   Followmonth: Followmonth ,
    //  Unfollowmonth: Unfollowmonth,
    // //  UnFollowersArr != null ? Unfollowmonth : 0,
    //   // Visitmonth: Visitmonth
      Visitmonth:  visitorsArr 
    })




    
  }

  monthSelection(itemValue, itemIndex) {
   // debugger;
    this.setState({ language: itemValue })
    if(itemValue == "00"){
      let UserTrafficDatas = this.props.UTSource
      console.log('hhh',UserTrafficDatas)
      this.setState({
        chartData: {
          ...this.state.chartData,
          series: [{ data: UserTrafficDatas }]
        }
      })
    }

    console.log('the follwrs array',FollowersArr);
    if (FollowersArr != null ) {
    var SelectedfollowArr =  this.state.Followmonth.filter(e => e === itemValue).length;
     } 
     if (UnFollowersArr != null ) {
     var SelectedUnfollowArr = this.state.Unfollowmonth.filter(e => e === itemValue).length;
     }
     //  UnFollowersArr != null ? this.state.Unfollowmonth.filter(e => e === itemValue).length:0;
   
     // var SelectedVisitorArr = this.state.Visitmonth.filter(e => e === itemValue).length;
    var finalArr = [FollowersArr != null?SelectedfollowArr:0, UnFollowersArr != null?SelectedUnfollowArr:0, this.state.visitorsArr];
    this.setState({
      chartData: {
        ...this.state.chartData,
        series: [{ data: finalArr }]
      }
    })
  }


  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'#fff' }}>

        <View style={{ backgroundColor: '#0000', width: wp('95%'), height: hp('50%'), marginLeft: 10 }}>
          <Text style={{ fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, marginBottom: 10,marginLeft:7 }}>User Traffic</Text>
          <View style={{position:'absolute', height: 50, width: '100%',...StyleSheet.absoluteFillObject,zIndex:1}}>
            <Picker
              selectedValue={this.state.language}
              // style={{
              //   // height: 50, width: '30%', top: 30, right: 5, position: "absolute",
              //   // borderRadius: 10, borderWidth: 2,color:'grey'
              // }}
              itemStyle={{
                height: 50, width: '30%', backgroundColor: '#fff', borderRadius: 10, borderWidth: .5,
                left: wp('100%') / 1.5, top: 25, position: 'absolute',fontSize:14
              }}
              onValueChange={(itemValue, itemIndex) =>
                this.monthSelection(itemValue, itemIndex)
              }>
              <Picker.Item label="Month" value="00" />
              <Picker.Item label="January" value="01" />
              <Picker.Item label="February" value="02" />
              <Picker.Item label="March" value="03" />
              <Picker.Item label="April" value="04" />
              <Picker.Item label="May" value="05" />
              <Picker.Item label="June" value="06" />
              <Picker.Item label="July" value="07" />
              <Picker.Item label="August" value="08" />
              <Picker.Item label="September" value="09" />
              <Picker.Item label="October" value="10" />
              <Picker.Item label="November" value="11" />
              <Picker.Item label="December" value="12" />
            </Picker>
          </View>
          <ChartView
            ref={ref => this.UTRef = ref}
            style={{ height: 300 }}
            config={this.state.chartData}
            options={options}
            originWhitelist={['']}
          >

          </ChartView>
          
        </View>

      </View>
    )
  }
}