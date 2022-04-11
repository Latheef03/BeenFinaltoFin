import { Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { deviceWidth,deviceHeight as dh } from '../../_utils/CommonUtils';
import {Common_Color,TitleHeader,} from '../../../Assets/Colors';
//DeviceInfo.hasNotch() ? 70 :
const styles = {
    toolbarContainer: {
        //backgroundColor: "#fff",
        width: "100%",
        height:  dh * 0.06,
        flexDirection: "row",
        alignItems: "center",
        marginTop: StatusBar.currentHeight
     },
    toolbarIconCont: {
        position: Platform.OS === "ios" ? "relative" : "relative",
        left: 0, 
        alignItems:'center',
        zIndex: 1,
       
    },
    leftIconContainer: {
        justifyContent: "center",
        paddingRight:8,
        paddingLeft: 8,
        paddingTop: DeviceInfo.hasNotch() ? 20 : Platform.OS === 'ios' ? 0 : 12,
        paddingBottom: 16,
        // backgroundColor : 'plum'
    },
    leftIconContainerImage: {
        flexDirection: "row",
        marginTop:DeviceInfo.hasNotch() ? 20 : Platform.OS === 'ios' ? 0 : 0,
        //Platform.OS === 'ios' ?20 :0,
        alignItems: "center",
        paddingLeft:12,
        justifyContent: "flex-end",
    },
    toolbarTitleCenter: {
        flexDirection: "row",
        flex: 1,
        // alignItems: "center",
        // alignSelf:'center',
        marginTop:Platform.OS === 'ios' ?5:0,
        // fontFamily:Common_Color.fontBold,
        // paddingRight: 40,
        textAlign: "center",
        justifyContent: "center",
        alignSelf:'center',
       // backgroundColor:'red', 
        bottom:5
    },
    toolbarTitleuserName: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        // fontFamily:Common_Color.fontBold,
        paddingRight: 8,
        justifyContent: "flex-start",
        // backgroundColor : 'pink'
        bottom: DeviceInfo.hasNotch() ? 5 : 0
    },
    toolbarTitleLeft: {
        flexDirection: "row",
        flex:1, 
        // fontFamily:Common_Color.fontBold,
        alignItems: "center",
        paddingRight:4,
        justifyContent: "flex-start",
        bottom: DeviceInfo.hasNotch() ? 0 :  10,
        // backgroundColor : 'plum'
    },

    toolbarTitleCenter1: {
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        paddingRight: 8,
        justifyContent: "center",
        marginTop:DeviceInfo.hasNotch() ? 15 :0,
        //backgroundColor:'fff'
    },
    toolbarRightViewStyle: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 8,
        justifyContent: "flex-end",
        //justifyContent: "center",
        //backgroundColor:'red'
    },
    toolbarRightImageViewStyle: {
        // flexDirection: "row",
        // backgroundColor:'red',
        marginTop:DeviceInfo.hasNotch() ? 15 :0,
        // alignItems: "center",
        paddingRight: 8,
        justifyContent: "flex-end"
    },
    toolbarRightMultiImageViewStyle: {
        flexDirection: "row",
        //backgroundColor:'red',
        marginTop: DeviceInfo.hasNotch() ? 20 : 0  ,
        alignItems: "center",
        justifyContent:'center',
        width:deviceWidth*.34,    
  
    },
    toolbarRightTwoImageViewStyle: {
        flexDirection: "row",
       // backgroundColor:'red',
        marginTop:DeviceInfo.hasNotch() ?20 :0,
        alignItems: "center",
        paddingRight:8,
        justifyContent: "flex-end",
        width:deviceWidth*.22,        
    },
    toolbarLeftImageViewStyle: {
        flexDirection: "row",
        //backgroundColor:'red',
        marginTop:Platform.OS === 'ios' ?10 :0,
        alignItems: "center",
        justifyContent:'center'
    },

    appTitleCenter: {
        // color: "rgb(51, 51, 51)",
        textAlign: "center",
        justifyContent: "center", alignSelf:'center',
        paddingTop: DeviceInfo.hasNotch() ? 30 : Platform.OS === 'ios' ? 0 : 0,
        fontSize: TitleHeader.FontSize, 
        // fontFamily: TitleHeader.Font,
        // fontSize: Common_Color.headerFontSize, fontFamily: Common_Color.fontMedium,
    },
    appTitleUserName: {
        fontSize: TitleHeader.FontSize, 
        // fontFamily: TitleHeader.Font,
        paddingLeft:8,
        // color: "rgb(51, 51, 51)",
        paddingTop: DeviceInfo.hasNotch() ? 30 : Platform.OS === 'ios' ? 0 : 0,
        // backgroundColor : 'yellow'
        //textAlign: "center",
    },
    appTitleLeft: {
        fontSize: TitleHeader.FontSize,
        // fontWeight:'bold',
        // color: "#000",
        textAlign: "left",
        // fontFamily:TitleHeader.Font,
        paddingTop: DeviceInfo.hasNotch() ? 20 : 0,
        // backgroundColor : 'red'
        //textAlign: "center",
    },
    rightViewTextStyle: {
        fontSize: 16,
        color: "rgb(51, 51, 51)",
        textAlign: Platform.OS === "ios" ? "center" : "left",
        paddingTop: DeviceInfo.hasNotch() ? 20 : 0,
        //textAlign: "center",
    },
}

export default styles;
