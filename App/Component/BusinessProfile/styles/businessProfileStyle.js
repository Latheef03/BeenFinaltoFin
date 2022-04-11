


import React, { Component } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet } from 'react-native';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from '../../../Assets/Colors'

const styles = {
    
        header:{ flexDirection:'row',width:wp('100%'),height:40,},
        headerName:{color:'#5b5b5b',fontFamily:'Roboto-Medium',fontSize:14},
        headerImage:{width:wp(5.5),height:hp(4.5),},
        createButton: { alignItems: 'center', justifyContent: 'center', height:30, width: 105,marginTop: wp('4%'), },
        headerImageNew:{width:wp(5),height:hp(5),marginLeft:wp('1%')},
        headerIconView:{ width:wp('7.5%'),marginRight:wp('2%'),marginTop:'auto',marginBottom:'auto',height:hp('5%'),},
        container2: { flexDirection: 'row', width: '95%', marginLeft: 'auto', marginRight: 'auto', },
        followFoot:{fontSize: 16, color: '#010101', fontWeight: 'normal',fontFamily:Common_Color.fontBold},
        touchView:{top:10,bottom:10,left:8,right:8,},
        fontColor: { color: '#b4b4b4'    },
        profile :{ width: 70, height: 70, borderRadius:50,},
        follow: { width: '100%', flexDirection: 'row', marginRight: '3%' },
        newText: { color: '#010101', fontSize: 14, fontFamily:Common_Color.fontMedium, textAlign: 'center' },
        newText1: { textAlign: 'left', marginBottom: 5, marginTop: 5, marginLeft: '3%',fontSize: Description.FontSize, fontFamily: Description.Font, },
        newText12: {  textAlign: 'left', marginBottom: 5, marginTop: 5, marginLeft: '3%',fontSize: Username.FontSize, fontFamily: Username.Font, },
        followCount :{ color: '#010101', fontSize: 14, fontFamily:Common_Color.fontMedium, textAlign: 'center' },
        leftContainer :{ marginLeft: '4%', marginTop: '3%' },
        editProfile:{width:wp('40%'),height: 40,borderWidth:1,borderRadius:10,marginLeft:'5%',marginRight:'4%',borderColor:'#868686'},
        textCenter:{textAlign:'center',marginTop:'auto',marginBottom:'auto',color:'#868686'},
        icon: { width: wp(6), height: hp(5.4) },
        icon1: { width: 16, height: 17, borderRadius: 5  }, 
        footericon: {     width: '23%', marginLeft: '5%'     },
        iconView: {   width: '12%',  height: '140%'   },
        fontColor: {     color: '#b4b4b4'        },
        fontsize1: { fontSize: 16, color: '#010101', fontFamily:Common_Color.fontBold},
        footerIconImage: {  width:wp(8), height:hp(4.5), },
        fontsize: { fontSize: 16, color: '#010101', fontFamily:Common_Color.fontBold},
        locationIconLocal:{ height: 18, width: 15 },
        localProfile:{ height: 120, width: 120, borderRadius: 60,marginBottom:10 },
        localProfileText:{fontSize:16,color:'#232323'},
        localLocationtxt:{fontSize:14,color:'#9f9f9f',marginLeft:4},
        verify:{width: 18, height: 18, alignSelf: 'flex-end', position: 'absolute', right:5, borderRadius: 18 / 2, borderColor: '#fff', borderWidth: 1 },
        map: { ...StyleSheet.absoluteFillObject, position: 'absolute', top: 0, left: 0, right: 0,bottom: 0, backgroundColor: "#fff"},
    
    }
    export default styles;

// export default { styles};