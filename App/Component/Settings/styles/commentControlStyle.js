import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import {StyleSheet}from 'react-native'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../../Assets/Colors'

const styles = StyleSheet.create({
    text: {   width: wp('80%'), fontFamily:Common_Color.fontLight,fontSize:11  },
    onoff: { width: wp('100%'), flexDirection: 'row', marginTop: hp('1.5%') },
    searchIcon:{ width:wp(4),height:hp(2),marginTop:hp('2%'),marginLeft:wp('2%')},
    profileImage:{width:wp(12),height:hp(7),borderRadius:50},
    comment:{fontSize:Username.FontSize,color:'#010101',marginTop:hp('2%'),fontFamily:Username.Font},
    searchView:{width:'90%',height:hp('6%'),borderRadius:25,borderWidth:1,flexDirection:'row',marginTop:hp('2%'),borderColor:'#dfddde',marginLeft:wp('5%')},
    profileName:{marginLeft:wp('7%'),marginTop:'auto',marginBottom:'auto' ,fontFamily:Username.Font,fontSize:Username.FontSize}
})

export default (styles)