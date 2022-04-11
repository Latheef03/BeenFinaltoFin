import React, { Component,useState } from 'react';

import Modal from "react-native-modal";
import {
    ActivityIndicator, Share,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,ScrollView,
    Image, Text, StatusBar, TextInput, KeyboardAvoidingView, Platform, Alert, ToastAndroid
  } from 'react-native';
  import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style';
import {initiateChat} from '../Chats/chatHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SD extends Component{

    componentDidMount(){
        initiateChat()
    }
    render(){
        return(

          <View style={{flex:1}}>
            <Modal 
            // pause={isPause}
            onBackdropPress={false}
            onBackButtonPress={false}
            isVisible={true}
            // onRequestClose={onStoryClose}
            >
            <View style={styles1.modalContent}>
              <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

              <View style={{ marginTop: 15,backgroundColor:'red',width:'100%' }}>
                <Text
                  style={styles1.modalText}>
                  Share status
                   </Text>
              </View>

              <View style={styles1.horizontalSeparator} />

              <View style={{ marginTop: 7,backgroundColor:'green',width:'100%' }}>
                <Text onPress={() => share_option()} style={styles1.modalText}>
                  Share
              </Text>
              </View>


              <View style={styles1.horizontalSeparator} />

              <View style={{ marginTop: 7,backgroundColor:'yellow',width:'100%' }} >
                <Text onPress={() => unFollow()}
                  style={styles1.modalText} >
                  Unfollow account
                </Text>
              </View>

              <View style={styles1.horizontalSeparator} />

              <View style={{ marginTop: 7, marginBottom: 15,backgroundColor:'teal',width:'100%' }}>
                <Text onPress={() => openReport()} style={[styles1.modalText, { color: '#708fd5' }]}>
                  Report
                </Text>
              </View>

            </View>
          </Modal>
          </View>
            
          //   <Modal
          //   onBackdropPress={false}
          //   // onBackButtonPress={onSendMessageReportClose}
          //   isVisible={this.props.visible}
          //   // onRequestClose={onSendMessageReportClose}

          // >
            
          
              // <ScrollView style={{
              //     backgroundColor: '#fff',
              //     borderWidth: .5, borderColor: '#000',
              //     borderRadius: 20, marginLeft: 5,position: 'absolute', bottom:5
              //   }}
              //   contentContainerStyle={{flexDirection: 'row', justifyContent: 'center',
              //   alignItems: 'center', }}
              //   keyboardShouldPersistTaps='always'

              // >
                
                // < TextInput
                //  style={[Common_Style.searchTextInput,{ width: wp('90%'),}]}
                // //   style={{ fontSize: 14, color: '#010101', 
                // //   fontFamily: Common_Color.fontMedium, width: wp('90%'), height: 40,
                // //    paddingLeft:20 }}
                // //   value={''}
                //   //onFocus={sendMessage}
                //   onChangeText={(text) => null}
                //   placeholder="Type here"
                //   autoFocus={true}
                //   placeholderTextColor='#010101'
                //   selectionColor={'#f0275d'}
                //   multiline={true}
                // />
                // {/* {messageName != "" ? sendMessageToOther(story)*/}
                //   <TouchableOpacity style={{  backgroundColor:'red', padding:10,
                //       alignItems: 'center',right:0,position:'absolute',textAlign:'center'
                //      }} 
                //      onPress={() => alert('asd')}>
                //     <Text>send</Text>
                //     {/* <Image source={require('../../Assets/Images/send.png')} style={styles.ImageStyle} /> */}
                //   </TouchableOpacity> 
                // {/* : 
                // null */}
              // {/* //  <Image style={styles.ImageStyle} />
              // } */}
               
              // </ScrollView>
              // {/* </View> */}
              // {/* </View> */}

          //     {/* <View style={{ width: wp('10%'), marginLeft: 10,backgroundColor:'red' }}>
          //       <Image
          //         style={{ width: 24, height: 24, marginTop: 5, }} />
          //     </View> */}
           
          // </Modal>
         
        )
    }
}

const styles1={
  modalContent: { backgroundColor: "#FFF", borderRadius:25,borderColor: "rgba(0, 0, 0, 0.1)", justifyContent:'center',alignItems:'center' },
  modalText: {  textAlign:'center',fontSize: profilename.FontSize, fontFamily: profilename.Font,width:'100%',padding:10 },
  horizontalSeparator:{ borderBottomColor: "#f4f4f4", borderBottomWidth: 1,marginTop:0,marginBottom:0,width:'100%' },
}