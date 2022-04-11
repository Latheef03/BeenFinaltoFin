import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import {StyleSheet}from 'react-native'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../../Assets/Colors'


const styles = StyleSheet.create({
    view:{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' },
    view1:{ marginLeft: wp('3%') },
    heading:{  marginTop: wp('2%'),fontSize:Username.FontSize,fontFamily:Username.Font },
    text:{  marginTop: wp('2%'), fontSize: profilename.FontSize ,lineHeight:17,fontFamily:profilename.Font},
    bullet:{  marginTop: wp('2%'), marginLeft:wp('4%'),fontSize: profilename.FontSize ,fontFamily:profilename.Font},
    contact:{ marginTop: wp('2%'), marginBottom:wp('5%'),fontSize: profilename.FontSize ,fontFamily:profilename.Font},

})

export default (styles) 