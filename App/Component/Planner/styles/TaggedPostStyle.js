import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react'
import { StyleSheet } from 'react-native';
import {Common_Color} from '../../../Assets/Colors'


export default StyleSheet.create({

container:{ width: '100%', marginLeft: 'auto', marginRight: 'auto', height:hp( '90.5%') },
card: {
    width: '95%', borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    

    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 3,
},
shadowOpacity: 0.27,
shadowRadius: 4.65,

elevation: 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop:hp(1),
    marginBottom:hp(1.3),
    backgroundColor: '#fff',
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
    marginTop: "25%"
  },
  modalText: {
    fontSize: 16,
    //fontFamily: "ProximaNova-Regular ",
    color: "#989898",
    margin: 5,
    marginBottom: 5,
    marginTop: 14,
    marginLeft: 15
    ,fontFamily:Common_Color.fontMedium
  },
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
  cardView:{ width: '90%', marginLeft: 'auto', marginRight: 'auto', },
  locationView:{ marginTop: '2%', width:wp('75%'), },
  locationViewText:{ color: '#888888', fontSize: 16 },
  threeDotsImage:{ width: wp(6.5), height:hp(2.5), marginLeft: 'auto', marginRight: 'auto', marginTop: '10%' },
  postImage:{ width: '100%', height:hp('50%'), marginTop: '2%' },
  cameraImage:{ width:wp(10), height:hp(4), marginTop: '7%' },
  profileImage:{ width: 25, height: 25,borderRadius:50 },
  userName:{ width: '80%', marginLeft: '5%', marginTop: 5, color: '#000' },
  description:{ width: '80%', height: 70, marginTop: '10%', },
  likeicon:{ width:wp(5), height:hp(3), },
  commentIcon:{ width:wp(5), height:hp(3), marginTop: '20%'},
  bookmarkIcon:{width:wp(4.5), height:hp(3), marginTop: '20%',  },
  // countText:{ fontSize: 10, textAlign: 'center' },
  textCount:{ fontSize: 10, textAlign: 'center' }
})