
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const ProfileFullView={
View:{ borderColor: 'lightgray', borderWidth:0, borderRadius: 20, alignItems: 'center', justifyContent: 'center', height: 120, width: 150 },
 wholeFlagView:{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '5%' },
 icons:{ height: wp(14), width: hp(8), },
 icons1:{ height: hp('13%'), width: wp('27%'), },
reviewCount:{  color: '#ca7c01',textAlign:'center',},
}


export default(ProfileFullView)  