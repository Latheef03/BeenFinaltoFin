import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Common_Color,TitleHeader } from '../../../Assets/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChartView from 'react-native-highcharts';


var Highcharts = 'Highcharts';
var Sharedmonth = "";

const options = {
  global: {
    useUTC: false
  },
  lang: {
    decimalPoint: ',',
    thousandsSep: '.'
  }
};

export default class UserEngagement extends Component {

  constructor(props) {
    super(props)
    this.state = {
      LikeCountArr: [],
      CommentCountArr: [],
      SavedCountArr: [],
      ShareCountArr: [],
      chartData: this.conf,
      Likemonth: '',
      Commentmonth: '',
      Savedmonth: '',
      Sharedmonth: '',
    };
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
      categories: ['Likes', 'Comments', 'Saved', 'Shared']


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

        name: 'User Engagement',
        data: []
        //[25.5,12.7,35,70]
      },

    ]

  };
  componentDidMount() {
    this.getUEDatas()
  }

  getUEDatas = async () => {
    let UserEngagementDatas = this.props.UESource
    //UTSource
    this.setState({
      chartData: {
        ...this.state.chartData,
        series: [{ data: UserEngagementDatas }]
      }
    })
    LikeCountArr = await AsyncStorage.getItem('LikeCount');
     CommentCountArr = await AsyncStorage.getItem('CommentCount');
     SavedCountArr = await AsyncStorage.getItem('SavedCount');
     ShareCountArr = await AsyncStorage.getItem('ShareCount');

    console.log('SavedCountArr',ShareCountArr)

      if (FollowersArr != null ) {
    var splitRes = LikeCountArr.split(",");
    let monthArr = splitRes.map(r => ({ mn: r.split('-') }))
      , Likemonth = monthArr.map(a => a.mn[1])
      this.setState({
        Likemonth:Likemonth,
      })
      }
    // console.log('Likemonth',Likemonth)
    if (UnFollowersArr != null ) {
    var splitRes1 = CommentCountArr.split(",");
    let monthArr1 = splitRes1.map(rm => ({ mnt: rm.split('-') }))
      , Commentmonth = monthArr1.map(ab => ab.mnt[1])
      this.setState({
        Commentmonth:Commentmonth,
      })
   }


     if (FollowersArr != null ) {
    var splitRes2 = SavedCountArr.split(",");
    let monthArr2 = splitRes2.map(r2 => ({ mn2: r2.split('-') }))
      , Savedmonth = monthArr2.map(a2 => a2.mn2[1])
      this.setState({
        Savedmonth:Savedmonth,
      })
     }

    // //  if (UnFollowersArr != null ) {
      if(ShareCountArr != null){
    var splitRes3 = ShareCountArr.split(",");
    let monthArr3 = splitRes3.map(rm3 => ({ mnt3: rm3.split('-') }))
      , Sharedmonth = monthArr3.map(ab3 => ab3.mnt3[1])
      this.setState({
        Sharedmonth:Sharedmonth,
      })
      }
    
    // //  }

    // this.setState({
    //   Likemonth: Likemonth,
    //   Commentmonth: Commentmonth,
    //   Savedmonth: Savedmonth,
    //    Sharedmonth: ShareCountArr != null?Sharedmonth:0,
      

    // })
    // this.conf.series[0].data = UserEngagementDatas
     console.log('user traffic file',this.state.Sharedmonth);
  }

  monthSelection(itemValue, itemIndex) {
   // debugger;
    this.setState({ language: itemValue })
    console.log('itemValue', itemValue)
    if(LikeCountArr != null){
     var SelectedLikemonth = this.state.Likemonth.filter(e1 => e1 === itemValue).length;
    }if(CommentCountArr != null){
     var SelectedCommentmonth = this.state.Commentmonth && this.state.Commentmonth.filter(e2 => e2 === itemValue).length;
      } if(SavedCountArr != null){
        var SelectedSavedmonth = this.state.Savedmonth.filter(e3 => e3 === itemValue).length;
      }if(ShareCountArr != null){
        var SelectedSharedmonth = this.state.Sharedmonth.filter(e4 => e4 === itemValue).length;
        }

    var finalArr = [LikeCountArr != null?SelectedLikemonth:0,CommentCountArr != null? SelectedCommentmonth:0, SavedCountArr != null?SelectedSavedmonth:0,ShareCountArr != null?SelectedSharedmonth:0];
    this.setState({
      chartData: {
        ...this.state.chartData,
        series: [{ data: finalArr }]
      }
    })
  }

  render() {

    return (
      <View>

        <View style={{
          backgroundColor: '#0000', width: wp('95%'), height: hp('50%'),
          marginLeft: 10,
        }}>
         
          <Text style={{ fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, marginBottom: 10,marginLeft:7 }}>User Engagement</Text>
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
            originWhitelist={['']}>

          </ChartView>
          
        </View>

      </View>
    )
  }
}