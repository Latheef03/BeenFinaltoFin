import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dimensions, } from 'react-native';
import { deviceHeight, deviceWidth } from '../Component/_utils/CommonUtils'
import {Common_Color} from '../Assets/Colors'
const { width, height } = Dimensions.get("window");
const styles = {
    image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' },
    card: {  width: '94%',marginLeft: 'auto',marginRight: 'auto', marginBottom:hp(1), backgroundColor: '#fff', borderWidth:.6, borderColor:'#c1c1c1', borderRadius:15, shadowColor: "#000",shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27,  shadowRadius: 4.65,elevation: 6,},
    cardImage:{ width: width * .84, marginLeft: 'auto', marginRight: 'auto',height:'auto',},
    imageView1: { height: 333, width: "97%" },
    imageBackGroundView:{ width: '100%',
    height:deviceHeight * .54,backgroundColor:'grey',
     overflow: 'hidden', borderRadius: 15, 
     backgroundColor: '#fff', shadowColor: "#000",shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27,  shadowRadius: 4.65,elevation: 6, },
    view: { justifyContent: 'flex-end', margin: 0, },
    container2: { flexDirection: 'row', width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop:'1.5%',position:'absolute',bottom:5 },
    icon: { width: 15, height: 20 },
    searchBar: { flexDirection: 'row', width: wp('90%'), backgroundColor: '#ffffff', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 25, padding: 15, borderWidth: 1.2, borderColor: '#ededef', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
    textInput: { width: wp('90%'), height: 45, marginBottom: 10, color: '#000', marginTop: 12, padding: 15, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
    footericon: { width: '23%', marginLeft: '5%',marginBottom:'2%', alignItems:'center', justifyContent: 'center', marginBottom:8,  flex:1, },
    fontColor: { color: '#b4b4b4' },
    smallColrButton: {  backgroundColor: "#87cefa", alignItems: "center", height: hp("4%"), width: wp("20%"), borderRadius: 8, justifyContent: "center", shadowColor: '#000000', shadowOffset: {width: 3,  height: 3 }, shadowRadius: 5,  shadowOpacity: 1.0   },
    modalText:{color:'#010101',fontSize:20,textAlign:'center',marginTop: hp('2%'),marginBottom: hp('1.3%'),fontFamily:Common_Color.fontMedium},
    modalText1:{color:'#010101',fontSize:20,textAlign:'center',marginLeft:12},
    modalVerificationText:{color:'#000000',fontSize:20,textAlign:'center',marginTop:25,marginBottom:25},
    emptyView:{width:'100%',backgroundColor:'transparent',height:40},
    childView:{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', marginTop: 20 },
    // footer font
    fontsize: { fontSize: 9, color: '#010101', fontFamily:Common_Color.fontLight,textAlign:'center'},
    modalContent: { backgroundColor: "#FFF", borderRadius: 10, borderColor: "rgba(0, 0, 0, 0.1)", marginTop: "22%",margin:5},
    horizontalSeparator:{ borderBottomColor: "#f4f4f4", borderBottomWidth: 1,marginTop:10,marginBottom:5 },
    footerIconImage: {  width:wp(8), height:hp(4.5), },
    modalView: { width: wp('90%'), height: hp('20%'), backgroundColor: '#fff', borderRadius: 5 },
    modalView1: { width: wp('90%'), height: hp('13%'), backgroundColor: '#fff', borderRadius: 8 },
    modalView2: { width: wp('90%'), height: hp('33.5%'), backgroundColor: '#fff', borderRadius: 8 },
    analyticsModalView: { width: wp('90%'), height: hp('32%'), backgroundColor: '#fff', borderRadius: 8 },
    deleteModalView: {backgroundColor: '#fff', borderRadius: 8 },
    openModalView:{ width: wp('90%'), backgroundColor: '#fff', borderRadius: 15 },
    modalButton:{ height: 40, width:260,marginLeft:'10%',marginRight:'10%' },
    visitFont: { color: '#898989', width: wp('91%') },
    loginButton: { backgroundColor: "#87cefa",  alignItems: "center", height: hp("6%"),
      width: wp("100%"), color: "blue", borderRadius: 0,justifyContent: "center",
      textAlign: "center",shadowColor: '#000000', shadowOffset: {  width: 3,  height: 3 },
      shadowRadius: 5,  shadowOpacity: 1.0,marginBottom:0
    },
    LoginButtontxt: { color: "#fff", justifyContent: "center",textAlign: "center", 
     fontSize: 16,marginBottom:5,marginTop:5,fontFamily:Common_Color.fontBold
    },
    container1: { width: "60%", height: '100%', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', },
    hasNoMem: { justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,   },
    centeredText : {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}
}
export default styles;