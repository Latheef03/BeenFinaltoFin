import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dimensions, } from 'react-native';
import { deviceHeight, deviceWidth } from '../Component/_utils/CommonUtils'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from '../Assets/Colors';
const { width, height } = Dimensions.get("window");

const styles = {
      card: { width: '100%',marginLeft: 'auto',marginRight: 'auto', marginBottom:1, backgroundColor: '#fff', borderWidth:.6, borderColor:'#c1c1c1', borderRadius:25, shadowColor: "#000",shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27,  shadowRadius: 4.65,elevation: 6,},
      cardImage:{ width: width * .96, marginLeft: 'auto', marginRight: 'auto',height:'auto',},
      imageBackGroundView:{ width: '100%',  height:deviceHeight * .64,backgroundColor:'grey',   overflow: 'hidden', borderRadius: 15,   backgroundColor: '#fff', shadowColor: "#000",shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27,  shadowRadius: 4.65,elevation: 6, },
      linearGradientButton : {marginVertical: 20, marginRight: "5%",height: hp("5%"),width: wp("23%"),borderRadius: 50,marginBottom: 25,justifyContent: "center",alignItems: "center", backgroundColor: "rgba(255,255,255,0.5)"  },
      linearGradientText:{ color: "white",textAlign: "center", justifyContent: "center"},
      modalContent: { backgroundColor: "#FFF", borderRadius:25,borderColor: "rgba(0, 0, 0, 0.1)", justifyContent:'center',alignItems:'center' },
      horizontalSeparator:{ borderBottomColor: "#f4f4f4", borderBottomWidth: 1,marginTop:0,marginBottom:0,width:'100%' },
      touchView: { width: '100%', height: '13%' },
      //f4f4f4
      imageModal: {  backgroundColor: "#FFF", padding: 10,borderRadius: 10,borderColor: "rgba(0, 0, 0, 0.1)",width: "100%", height: '80%',   margin: 10  },
      modalText: {  textAlign:'center',fontSize: profilename.FontSize, fontFamily: profilename.Font,width:'100%',padding:10 },
      // modalText: { fontSize: 16, textAlign:'center',color: "#010101",fontFamily:Common_Color.fontMedium,marginBottom:5,marginTop:5 },
      parentView: { width: "100%", borderRadius: 15, backgroundColor: "white" },
      icon: { width: wp(8), height: hp(4.5), marginLeft: '45%', marginBottom: '5%', marginTop: '5%' },
      header: {fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium,  marginTop: 10, textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#000', },
      subHeader: { marginTop: 15, fontSize: 12, textAlign: "center", alignSelf: "center", fontWeight: 'normal', color: '#959595' },
      contentView: { width: '95%', textAlign: "center", },
      content: { marginTop: 10, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#9e9e9e' },
      inputView: { borderColor: '#a5a5a5', borderWidth: 1,width: "85%", padding: 5, height: '35%', marginLeft: 25,color: "grey", marginTop: 25, marginBottom: 15, borderRadius: 5},

    buttonView: {justifyContent: "center",textAlign: "center", alignItems: "center", marginVertical: 10,marginTop: 10,  justifyContent: "space-evenly",margin: 10, marginLeft: 20  },
    // success msg  View
    headerInModalTwo: {fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium,  marginTop: 25,  textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#000', },
    contentViewInModalTwo: { width: '95%', textAlign: "center", },
    contentTextInModalTwo: { marginTop: 20, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#9e9e9e' },
    okayButton: {justifyContent: "center",textAlign: "center",alignItems: "center", marginVertical: 10, marginTop: 40,justifyContent: "space-evenly", margin: 10, marginLeft: 20, fontWeight: 'bold' },
    okayButtonText: {color: "#d12c5e",textAlign: "center",justifyContent: "center",fontSize: 25, fontWeight: 'bold',},
      
      deleteModalView: {width: '100%', backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignContent: 'center'  },
      smallColrButton: {  backgroundColor: "#87cefa", alignItems: "center", height: hp("4%"), width: wp("20%"), borderRadius: 8, justifyContent: "center", shadowColor: '#000000', shadowOffset: {width: 3,  height: 3 }, shadowRadius: 5,  shadowOpacity: 1.0   },
      addButtonTouchableOpacity: {
        borderWidth: 1,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        position: "absolute",
        bottom: 80,
        right: 10,
        height: 70,
        borderRadius: 100,
        backgroundColor: "transparent"
      },
      mapDrawerOverlayRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        opacity: 0.5,
        height: Dimensions.get('window').height,
        width: wp(3.5),
        backgroundColor: 'transparent'
      },
      mapDrawerOverlayLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        height: Dimensions.get('window').height,
        width: wp(3),
        backgroundColor: 'transparent'
      },
      touchSlop:{ top: 10, left: 10, bottom: 10, right: 10, },
      headerText:{ fontSize: 18, textAlign: 'center',justifyContent:'center',marginTop:5, color: '#000',fontWeight:'bold', },
      headerView:{ width: '84%', marginTop: 'auto', marginBottom: 'auto', marginLeft: '2%', },
      menuDot:{ width: 35, height: 30, marginLeft: 'auto', marginRight: 'auto', marginTop: '10%', },
    }
    export default styles;