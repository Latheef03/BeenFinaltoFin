import React, { Component } from 'react';
import { View, Text, Image, ImageBackground,  Picker,
  TouchableOpacity,StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Common_Color,TitleHeader } from '../../../Assets/Colors'
import ChartView from 'react-native-highcharts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modalbox';
import {deviceWidth as dw , deviceHeight as dh} from '../../_utils/CommonUtils';

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

export default class Age extends Component {

  constructor(props) {
    super(props)
    this.state = {
      AgeCountArr: [],ageDatasArr:[],fulldata:[],
      chartData: this.conf
    }
    this.conf = this.conf
  } conf = {
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
      categories: ['18-27', '28-37', '38-47', '48-57', '58-67', '68-77', '78-87', '88-97']
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

        name: 'Age',
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
    let ageDatas = this.props.AGESource
    console.log('age is', ageDatas)
    let fulldata = this.props.age
    console.log('fulldata is', fulldata)
    this.setState({
      fulldata:fulldata,
      chartData: {
        ...this.state.chartData,
        series: [{ data: ageDatas }]

      }
    })
    AgeCountArr = await AsyncStorage.getItem('ageRatio');
    ageDatasArr = await AsyncStorage.getItem('age');
    var ages = ageDatasArr.split(',')
    this.setState({
      ageDatasArr: ages,
      AgeCountArr:AgeCountArr
    })
    console.log('AgeCountArr', AgeCountArr)


  }
  monthSelection(itemValue, itemIndex) {
   // debugger;
    this.setState({ language: itemValue })
    // console.log('the item value is ',itemValue);
    if (itemValue == "All") {
      let ageDatas = this.props.AGESource
      console.log('age is', ageDatas)
      this.setState({
        chartData: {
          ...this.state.chartData,
          series: [{ data: ageDatas }]
        }
      })
    }
    else if (itemValue == "Male" || itemValue == 'Men') {
      // console.log('itemValue is', itemValue)
     
    
      var agecount = this.state.fulldata;
      console.log('the fchck',agecount)
      
      const maleArr = agecount.length>0 && agecount.filter(m => m.Gender == 'Male')
      console.log('the maleArr',maleArr)
      let ageRatio = [0, 0, 0, 0, 0, 0],
      
        ratioCount = 0, ratioCount1=0,ratioCount2=0,ratioCount3=0,ratioCount4=0;
        maleArr.length>0 && maleArr.map((f, i) => {
        // console.log('the f',f)
        
        if ((f.Age >= 18 && f.Age <= 27)) {
          ratioCount++
          ageRatio[0] = ratioCount
          console.log('f.age==', f.agecount);
          }
         else if ((f.Age >= 28 && f.Age <= 37)) {
            ratioCount1++
            ageRatio[1] = ratioCount1
            console.log('f.age==', f.agecount);
          }
          else if ((f.Age >= 38 && f.Age <= 47)) {
            ratioCount2++
            ageRatio[2] = ratioCount2
            console.log('f.age==', f.agecount2);
          }
          else if ((f.Age >= 48 && f.Age <= 57)) {
            ratioCount3++
            ageRatio[3] = ratioCount3
            console.log('f.age==', f.agecount3);
          }
          else if ((f.Age >= 58 && f.Age <= 67)) {
            ratioCount4++
            ageRatio[4] = ratioCount4
            console.log('f.age==', f.agecount4);
          }
          else if ((f.Age >= 68 && f.Age <= 77)) {
            ratioCount5++
            ageRatio[5] = ratioCount5
            console.log('f.age==', f.agecount5);
          }
        
      });
     

      this.setState({
        chartData: {
          ...this.state.chartData,
          series: [{ data: ageRatio }]
        }
      })
    }

    else if (itemValue == "Female" || itemValue =='Women') {
      // console.log('itemValue is', itemValue)
      var agecount = this.state.fulldata;
      console.log('the fchck',agecount)
      const maleArr = agecount.length>0 && agecount.filter(m => m.Gender == 'Female')
      console.log('the maleArr',maleArr)
      let ageRatio = [0, 0, 0, 0, 0, 0],
      ratioCount = 0, ratioCount1=0,ratioCount2=0,ratioCount3=0,ratioCount4=0;
      maleArr.length>0 && maleArr.map((f, i) => {
      // console.log('the f',f)
      
      if ((f.Age >= 18 && f.Age <= 27)) {
        ratioCount++
        ageRatio[0] = ratioCount
        console.log('f.age==', f.agecount);
        }
       else if ((f.Age >= 28 && f.Age <= 37)) {
          ratioCount1++
          ageRatio[1] = ratioCount1
          console.log('f.age==', f.agecount);
        }
        else if ((f.Age >= 38 && f.Age <= 47)) {
          ratioCount2++
          ageRatio[2] = ratioCount2
          console.log('f.age==', f.agecount2);
        }
        else if ((f.Age >= 48 && f.Age <= 57)) {
          ratioCount3++
          ageRatio[3] = ratioCount3
          console.log('f.age==', f.agecount3);
        }
        else if ((f.Age >= 58 && f.Age <= 67)) {
          ratioCount4++
          ageRatio[4] = ratioCount4
          console.log('f.age==', f.agecount4);
        }
        else if ((f.Age >= 68 && f.Age <= 77)) {
          ratioCount5++
          ageRatio[5] = ratioCount5
          console.log('f.age==', f.agecount5);
        }
      
    });
      console.log('the 18-27 ratio', ageRatio)
      console.log('the 18-27 ratio', ratioCount)

      this.setState({
        chartData: {
          ...this.state.chartData,
          series: [{ data: ageRatio }]
        }
      })
    }
  }

  render() {

    return (
      <View>

        <View style={{
          backgroundColor: '#0000', width: wp('95%'), height: hp('50%'),
          marginLeft: 10,
        }}>
          <Text style={{ fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, marginBottom: 10,marginLeft:7 }}>Age</Text>
         
          <ChartView
            style={{ height: 300 }}
            config={this.state.chartData}
            options={options}
            originWhitelist={['']}
          />

          {/* <Picker
            selectedValue={this.state.language}
            style={{
              height: 50, width: '30%', top: 30, right: 5, position: "absolute",
              borderRadius: 10, borderWidth: 2,color:'grey'
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.monthSelection(itemValue, itemIndex)
            }>
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Men" value="Male" />
            <Picker.Item label="Women" value="Female" />
          </Picker> */}
        <View style={{width:'30%',right:10,top:45,position:'absolute',justifyContent: 'center' }}>
               <TouchableOpacity onPress={()=>this.props.makeActiveModal() }>
                 <View style={{ flexDirection: 'row',height:'100%',width:'100%',  paddingRight: 15, paddingLeft: 15,
                 justifyContent: 'center',padding:10,
                }}>
                   <Text style={{ textAlign: 'center',fontSize:12,fontFamily:Common_Color.fontMedium, }}>
                      {this.props.activeOption}
                   </Text>
                   <Image source={require('../../../Assets/Images/pickerIcon.png')}
                   // resizeMode={'center'}
                     style={{
                       width: 10, height: 10,marginLeft:3,alignSelf:'center'
                     }}
                   />
                 </View>
               </TouchableOpacity>
            {/* </View>   */}
            </View> 
        </View>

      </View>
    )
  }
}