import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react'
import { StyleSheet } from 'react-native';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from '../../../Assets/Colors'

export default StyleSheet.create({

    container:{flexDirection:'row',marginTop:hp('2%'),marginLeft:wp('3.2%'), height: hp('8%') },
    userName:{  width: '50%', marginLeft:wp( '4%'), height: hp('5%')  },
    Text:{ marginTop: 'auto', marginBottom: 'auto', fontSize: Username.FontSize, color: '#010101',fontFamily:Username.Font
 },
    buttonView:{ width: wp('27%'), height: hp('5%'), backgroundColor: '#f0f', borderRadius:5, marginRight: wp('2.5%'), },
    buttonText:{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#fff',fontFamily:Common_Color.fontBold }

})