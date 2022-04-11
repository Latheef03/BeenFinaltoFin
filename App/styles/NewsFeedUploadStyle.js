import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dimensions, } from 'react-native';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../Assets/Colors'
const styles = {
    horizontalSeparator:{ borderBottomColor: "#f4f4f4", borderBottomWidth: 1,width:'100%' },
    modal: {
        width: window.width,
        height: '65%',
        backgroundColor: '#b0cae38c',
        //'#b0cae38c', og-color
        // '#b0cae3',
        // opacity:0.5,
        borderTopLeftRadius: 55,
        borderTopRightRadius: 55,
        borderTopWidth: 30,
        borderTopColor: 'transparent'
    },
    touchOpcity: {top:8,bottom:8,left:8,right:8},
    viewPager: {
        width: 250, height: 120
    },
    card: {
        width: '95%', height: '97%', borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 10,
        shadowRadius: 10,
        elevation: 4,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        backgroundColor: '#fff',
    },
    cameraContainer: {
        width: '100%',
        height: hp('92%'),
        flexDirection: 'column',
        backgroundColor: 'black',
        alignSelf: 'stretch'
    },
    preview: {
        width: wp('100%'),
        height: hp('90%')
    },
    filter: { width: 90, height: 100, marginRight: 10 },
    filterText:{textAlign:'center',fontSize:15,fontFamily:'Roboto-Medium',color:'#c4c4c4',marginLeft:5},
    filter1:{ width: 120, height: 100, marginRight: 10,borderWidth:.8,borderColor:'#000',margin:5},
    locationText: { borderRadius: 10, width: '85%', margin: 10, height: 40, borderColor: '#000', borderWidth: 1, justifyContent: 'center', padding: 12, fontSize: profilename.FontSize, fontFamily: profilename.Font,},
    descriptionText: { borderRadius: 10, width: '90%', margin: 10, height: 100, borderColor: '#000', borderWidth: 1,fontFamily:Common_Color.fontMedium},
    imageBinding: { width: wp(96), height: hp(47), margin: 7, borderRadius: 20, },
    headerText: { color: '#868686', textAlign: 'center', fontFamily: 'OpenSans-Bold', alignSelf: 'center', fontSize: 18 },
}
export default styles;