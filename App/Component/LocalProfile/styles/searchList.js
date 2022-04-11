
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const searchList = {

    searchView: { borderWidth: 1, borderColor: 'lightgray', borderRadius: 20, height: hp(7), width: '80%' },
    textInput: { marginLeft: '5%', width: '100%', height: '100%' },

    userProfile: { height: hp('40%'), width: '98%',alignSelf:'center' },
    planner: { height: hp(3), width: wp(4) },
    star: { height: hp(3.5), width: wp(5.5),marginLeft:4 },
    textColor: {
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        
        // fontWeight:'bold',
    }
}

export default (searchList)