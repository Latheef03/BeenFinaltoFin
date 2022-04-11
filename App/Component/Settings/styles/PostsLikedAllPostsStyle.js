
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react'
import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({

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
    cardInnercontainer:{ width: '90%', marginLeft: 'auto', marginRight: 'auto', },
    modalContent: {
      backgroundColor: "#FFF",
      padding: 10,
      borderRadius: 10,
      borderColor: "rgba(0, 0, 0, 0.1)",
      width: "100%",
      marginTop: "25%"
    },
  
    threeDots:{ width:wp(6), height:hp(3), marginLeft: 'auto', marginRight: 'auto', marginTop: '10%' },
    postImage:{ width: '100%', height:hp(45), marginTop: '2%' },
    cameraImage:{ width:wp(9), height: hp(4), marginTop: '7%' },
    icons:{ width:wp(4.5), height:hp(3), marginTop: '20%', },
    counts:{ fontSize: 10, textAlign: 'center' }
  })


  export default (styles)
  