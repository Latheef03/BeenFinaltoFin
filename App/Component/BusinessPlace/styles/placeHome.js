
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {Common_Color,TitleHeader} from '../../../Assets/Colors'

const styles={
    headerText:{marginTop:hp('2%'),color:'#010101',marginLeft:wp('2%'),fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font,},
    badgeView:{width:wp('100%'),height:hp('37%'),marginTop:hp('2%'),borderRadius:10,flexDirection:'row',marginBottom:'5%',},
    imageView:{width:wp('32%'),height:'100%',marginLeft:wp('2%')},
    imageLayout : {width:wp('40%'),height:'98%',marginLeft:wp('2%'),borderRadius:15,overflow: 'hidden',},
    badgesimage:{width:wp('30%'),height:hp(15),marginLeft:wp('2%')},
    text:{textAlign:"center",color:'#FFF'},
    text1:{textAlign:"center",color:'#ebebeb'},
    BuPlMap:{width:wp('95%'),height:hp('11%'),marginLeft:wp('2.5%')},
    BuPlMap1:{textAlign:"center",color:'#ebebeb'},
    profileImage:{width:wp('30%'),height:hp('15%')},
    profileView:{ position: 'absolute', top:hp(7), backgroundColor:'#c1c1c1', left:wp(35),height:110, width:110, borderRadius: 110/2,   overflow: 'hidden',  },
    userPic:{ width: wp(8.5), height: hp(4.5), borderRadius: 50,top: 20, left: 10, position: 'absolute',borderWidth:2.5,borderColor:'#fff' },
    userText:{ color: '#fff', marginLeft: 5,bottom:10, left: 10, position: 'absolute',fontSize:16,},
    buttons:{width:wp('100%'),height:hp('6%'),flexDirection:'row'},
    modalText:{ alignSelf: 'center', textAlign: 'center', fontSize: 16, marginLeft: 15, marginRight: 15,marginBottom:15, marginTop: 20, color: '#989898', lineHeight: 20,fontFamily:'Roboto-Black' },
    locationView:{},
    modalMainText:{textAlign:'center',fontSize:22,color:'#fb0143',margin:10},
    buttonImage:{width:wp('29%'),height:hp('5%')},
    buttonImage1:{flexDirection:'row',marginTop:'auto',marginBottom:'auto',marginLeft:'auto',marginRight:'auto',alignContent:'center'},
    buttonName:{width:wp(8),height:hp(2.5)},
    buttonIcons:{width:wp(5),height:hp(2.5),marginLeft:wp('1%')},
    sector:{width:wp('30%'),height:hp('5%'),marginLeft:wp('3%'),marginRight:wp('3%')},
    viewProfile:{width:wp('30%'),height:hp('5%'),borderRadius:10,backgroundColor:'#37a1eb'},
    View: { borderColor: 'lightgray', borderWidth: 0, borderRadius: 20, alignItems: 'center', justifyContent: 'center', height: 120, width: 150 },
    buttonText: { textAlign: 'center', marginBottom: 'auto', color: '#4A4A4A', fontSize: 14, fontFamily: Common_Color.fontMedium },
    StarImage: { width: 35, height: 35, borderWidth: .6, resizeMode: 'cover', },
    childView: { justifyContent: 'center', flexDirection: 'row', marginTop: 30, },
    reviewText: { fontSize: 20, color: '#010101', margin: 5, fontFamily: Common_Color.fontRegular, },
    rateText: { fontSize: 16, textAlign: 'center', color: '#010101', marginTop: 8, marginBottom: 8, fontFamily: Common_Color.fontLight, },
    middleView: { alignItems: 'center', alignContent: 'center', alignSelf: 'center' },
    star: { height: hp(3), width: wp(5), fontFamily: Common_Color.fontMedium },
    hasNoMem: { justifyContent: 'center', alignItems: 'center', },
    ratingText: { fontSize: 36, color: '#000', fontFamily: Common_Color.fontBold, textAlign: 'center' }
}


export default styles