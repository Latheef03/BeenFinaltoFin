import React, { StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {Common_Color} from '../Colors';

import { Colors } from 'react-native/Libraries/NewAppScreen';


export default StyleSheet.create({

   // // Edit Profile

    // Header
    Header: { height: 60, backgroundColor: Common_Color.common_white, borderBottomWidth: 1, borderBottomColor: Common_Color.common_gray },
    back_icon: { height: 28, width: 24, },
    Body: { color: '#000',fontWeight:'bold',fontSize: 18, alignSelf: 'flex-end' },
    Done_txt: { color: Common_Color.btn_blue, fontSize: 16},

    // Profile Img
    Profile_Img_View: { alignItems: 'center', justifyContent: 'center', height: hp('20%') },
    Profile_Img: { height: 100, width: 100 },
    Badge_View: { height: 20, width: 20, backgroundColor: '#399fe8', alignSelf: 'flex-end' },
    Badge_txt: { color: '#fff', fontSize: 14 },
    horizontalSeparator: { marginTop: "0%",borderBottomColor: "#f3f3f3", borderBottomWidth: 1,marginBottom:10},
    modalContent: { backgroundColor: "#FFF",padding:8,borderRadius: 10, borderColor: "rgba(0, 0, 0, 0.1)", width: "85%", marginTop: "22%",marginLeft:'5%',marginRight:'5%'},
    modalTextView: { marginTop: 10,fontSize: 14, marginLeft: "5%", color: "#3e3e3e",marginBottom: 10 },
    // Fields
    field_Full_View: { marginLeft: wp('8%'), marginRight: wp('8%'), marginTop: wp('3%') },
    field_txt: { fontSize: 12, color:'#000'},
    field_txtInput: { fontSize: 14 },
    field_border: { borderBottomWidth: 1, borderBottomColor: Common_Color.common_gray },

    //Custom Component
    headerText:{ fontSize: 16, alignSelf:'flex-start',color:'#fff'},
 
    //Footer Tab And Footer
    footerStyle:{ backgroundColor: "#fff", height: hp(6) },
    curveView:{width:wp('92'),marginLeft:10,marginRight:10,padding:10,backgroundColor:'#fff',flexDirection:'row',borderRadius:30,padding:10,borderWidth:.7,borderColor:'#b3b3b3'},
    //User  Image small size
     likeView:{ width: wp('100%'), flexDirection: 'row',justifyContent:'flex-start',alignItems: 'center', alignContent: 'center', },
     avatarProfile:{width: wp(10), height: hp(6),borderRadius:50,margin:7,justifyContent:'center',marginTop:10 },
     avatarProfile1:{width: wp(10), height: hp(6),borderRadius:50,margin:7,justifyContent:'center',marginTop:10 },
     userNameStyle:{fontSize:15,
      //fontFamily: "ProximaNova-Regular",
      textAlign:'center',alignSelf:'center',marginLeft:7},
})