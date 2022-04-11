
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const spotAddStyle={
          locationIcon:{ height:hp('17%'), width:'35%', borderRadius: 5, marginTop: '6%' },
          locationText:{ fontSize:20, textAlign: 'center', marginTop: '2%',fontWeight:'bold' },
          borderView:{ borderColor: 'gray', borderWidth:0.7, borderRadius: 20, alignItems: 'center', justifyContent: 'center', height:hp('18%'), width:wp('90%') },
          borderViewText:{ fontSize:30,justifyContent:'center',textAlign:'center'}
}

export default (spotAddStyle)