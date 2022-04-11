import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react'
import { StyleSheet } from 'react-native';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../../Assets/Colors' 


export default StyleSheet.create({

    container:{flexDirection:'row',marginTop:hp('2%'),marginLeft:wp('3%')},
    text:{width:wp('80%'),fontSize:Username.FontSize,fontFamily:Username.Font}

})