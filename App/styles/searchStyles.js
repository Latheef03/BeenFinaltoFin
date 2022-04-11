import React, { StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../Assets/Colors';

export default StyleSheet.create({

    SectionStyle: { flexDirection: 'row',justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderWidth: .5,borderColor: '#000',  height: 40,borderRadius: 5 , width:wp('80%'), borderRadius:50, margin: 10  },
    ImageStyle: {padding: 10, margin: 15, height:18, width: 18, resizeMode : 'stretch',alignItems: 'center'},
    header:{backgroundColor:'#fff',height:130,flexDirection:'column',justifyContent:'flex-start'},
    CancelText:{fontSize:14,color:'#010101',fontWeight:'normal',textAlign:'center',justifyContent:'center',alignSelf:'center',fontFamily:Common_Color.fontMedium},
    textView:{flexDirection:'row',justifyContent:'space-around',height:30,marginTop:8,backgroundColor:'#fff'},
    tabText:{fontSize:TitleHeader.FontSize,textAlign:'center',justifyContent:'center',alignSelf:'center',fontFamily:TitleHeader.Font},
    viewPager: {   flex: 1,backgroundColor:'grey',height:hp('100%'),width:wp('100%')  },
})