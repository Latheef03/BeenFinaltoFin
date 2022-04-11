import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from '../../../Assets/Colors'
const plannerStyles={
    parentView:{ width: wp('100%'), height: hp('100%') },
    touchView: {top:10,bottom:10,left:10,right:10,},
    menuView:{ flexDirection: 'row', width: '100%' },
   mediaImg:{ height: 30, width: 40, borderRadius: 5 },
   peopleGoing:{ color: '#eb7998',fontSize: Username.FontSize, 
//    fontFamily: Username.Font, 
},
   peopleGoingopen:{ color: '#eb7998',fontSize: Username.FontSize, 
//    fontFamily: Username.Font,
   marginLeft:40 },
   peopleGoing1:{ color: '#8a8a8a',fontSize: Username.FontSize, fontFamily: Username.Font, },
   peopleGoing2:{ color: '#7eaff2',fontSize: Username.FontSize, fontFamily: Username.Font,marginLeft:5 },
   placeText:{color: "#000000",fontSize: Username.FontSize, 
//    fontFamily: Username.Font,
 },
   travelHeader:{color: "#000000",fontSize: Username.FontSize, fontFamily: Username.Font,},
   locationText:{color: "#000000",fontSize: Username.FontSize, 
   // fontFamily: Username.Font,
   marginLeft:10,marginTop:8 },
   dateText:{ color: "#000000",fontSize: Username.FontSize, 
//    fontFamily: Username.Font, 
},
   budgetText:{ color: "#000000",fontSize: Username.FontSize, 
//    fontFamily: Username.Font,
   marginLeft:30 },
   budget:{ color: "#000000",fontSize: Username.FontSize, 
   // fontFamily: Username.Font,
   marginLeft:5 },
   budgetcolon:{ color: '#000',fontFamily:Common_Color.fontMedium,fontSize:15,marginLeft:8 },
   commonViewSquareView:{width:'90%',height:40,borderRadius:8,marginLeft:'5%',marginTop:5,borderWidth:1,borderColor:'#eeeeee',},
   buttonImg:{height: 30, width: 85, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }
}

export default(plannerStyles)