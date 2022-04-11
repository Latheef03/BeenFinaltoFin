import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react'
import { StyleSheet } from 'react-native';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from  '../../../Assets/Colors'

export default StyleSheet.create({

    container:{marginTop:hp('2%'),},
    textInputView:{flexDirection:'row',borderWidth:1,borderRadius:3,width:wp('95%'),height:hp('6.5%'),borderColor:'#d8d8d8',marginLeft:'auto',marginRight:'auto',marginTop:hp('2%')},
    textInput:{width:wp('84%'),fontSize:profilename.FontSize,fontFamily:profilename.Font},
    image:{width:wp(5),height:hp(2),marginTop:'auto',marginBottom:'auto'},
    button:{ width:wp('40%'),height:hp('6%'), borderWidth:1,borderRadius:4,backgroundColor:'#d8d8d8',marginLeft:wp('6.5%'),borderColor:'transparent'},
    buttonText:{textAlign:'center',marginTop:'auto',marginBottom:'auto',color:'#797979', fontSize: Username.FontSize, fontFamily: Username.Font},
})
