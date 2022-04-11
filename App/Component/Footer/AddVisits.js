import React, { Component } from 'react';
import {
  Text, StyleSheet, Image, FitImage, ImageBackground,
  View, ToastAndroid, TextInput, ActivityIndicator, TouchableOpacity, ScrollView, FlatList
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {deviceWidth as dw ,deviceHeight as dh} from '../_utils/CommonUtils'
import Modal from "react-native-modal";
import { Toolbar,FooterTabBar } from '../commoncomponent'
import {Common_Color} from '../../Assets/Colors'
import { toastMsg } from '../../Assets/Script/Helper';
import plannerStyles from '../Planner/styles/plannerStyles';
const imagePath = '../../Assets/Images/';

export default class AddVisits extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      userName: '',
      getAlbumData: '',
      getMemoryData: '',
      isModalVisible: false,
      deleteimage: '',
      visitData: [],
      activeTab : 2
    }
  }

  UNSAFE_componentWillMount() {
    debugger
    const visitData = this.props.route.params.visitData
    console.log('vistdatas', visitData)
    this.setState({
      visitData: visitData,
    })
  }

  deleteData(data) {
    this.setState({
      deleteimage: data._id,
      imageDeleteModal: true
    });
  }

  async delete() {
   // debugger;
    var userid = await AsyncStorage.getItem('userId');
    var id = this.state.deleteimage;
    var data = { UserId: userid, _id: id, isVisitDel: "Yup" };
    const url = serviceUrl.been_url + '/DeleteStory';

    fetch(url, {
      method: 'post', headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
      },
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .then((responseJson) => {
        // console.log('response',responseJson)
        if (responseJson.status == "True") {

          this.setState({ imageDeleteModal: false })
          toastMsg('success', responseJson.message)
         // ToastAndroid.show(responseJson.message, ToastAndroid.LONG);
          this.props.navigation.navigate('Visits');

        }
        else {
          this.setState({ imageDeleteModal: false })
          //toastMsg('danger', response.message)
        }
      })
      .catch(err => {
        this.setState({ imageDeleteModal: false })
        console.log("Error:Line 144,Addvisits", err)
        //toastMsg('danger', 'Sorry..Something network error.please try again once.')
      })


  }

  backArrow() {
    this.props.navigation.navigate('Profile');
  }
  memories() {
    this.props.navigation.navigate('UserProfileMemories');
  }
  albums() {
    this.props.navigation.navigate('UserProfileAlbums');
  }
  modalCondition() {
    this.setState({ isModalVisible: true })
  }
  makeActive = (tab) =>{
    this.setState({
         activeTab : tab
     });

     if(tab === 1 ){
        this.memories()
      }
      else if(tab === 2){
        this.visits()
      }
      else if(tab === 3){
        this.albums()
      }
      else if(tab === 4){
        this.vlog()
      }

 };

 memories = () => {
  var data = {
    screenName: "BusinessProfile",loader:true
  }
  this.props.navigation.navigate('UserProfileMemories', { data: data });
}
visits = () => {
  this.props.navigation.navigate('Visits');
}
albums(){
  this.props.navigation.navigate('UserProfileAlbums');
}
vlog(){
  this.props.navigation.navigate('VlogGet')
}

  renderRightImgdone() {
    return <View >
      <TouchableOpacity style={{ height: '80%', }} onPress={() => this.props.navigation.navigate('Visits')} >
        <Text style={{ color: '#1d5bf0', marginTop: 5 }}>Done</Text>
      </TouchableOpacity>
    </View>
  }

  render() {
    const {activeTab} = this.state
    return (
      <View style={{ flex: 1,marginTop:0 ,backgroundColor:'#fff'}}>

         <Toolbar {...this.props} icon={"Down"} centerTitle="Visits"
          rightImgView={this.renderRightImgdone()} />
           <ScrollView>
      
          {/* main container */}
            <ScrollView>
              <View>
                <FlatList 
                 style={{marginBottom:80}}
                 data={this.state.visitData}
                 renderItem={({ item,index }) => (
                    <View key={`id${index}`}>
                      {item.visitsDelete === "Yup" ? null : (
                      <View style={{}}>
                        <View style={{ flexDirection: 'row',width:dw,height:dh * 0.05,marginHorizontal:10}}>
                           <View style={{width:dw * 0.80,height:'100%',justifyContent:'center',
                            alignSelf:'center'}} >
                            <Text style={{...styles.visitFont, textAlign:'left',}}>
                              {item._id},{item.data[0].Country} ({item.count})
                            </Text>
                          </View>
                          {/* <TouchableOpacity></TouchableOpacity> */}
                          <View style={{width:dw * 0.15,height:'100%',justifyContent:'center',paddingTop:8}}> 
                            <Text style={{ color: '#F0275D',textAlign:'right',}}>
                              Hide
                            </Text>
                          </View>
                        </View>
                        <ScrollView horizontal={true} contentContainerStyle={{paddingLeft:5}} style={{}}
                          showsHorizontalScrollIndicator={false}
                        >
                          {item.data.map((data) => {
                            return (
                              !data.storyId &&
                              <View style={{flex:1}}>
                                {data.visitsDelete === "Yup" ? null : (
                                   
                                  <View >
                                  
                                   {/* <View style={[styles.closeIconView,{width:'100%',backgroundColor:'yellow'}]}>
                                    <TouchableOpacity onPress={() => { this.deleteData(data) }}>
                                      <Image source={require('../../Assets/Images/clear.png')} style={{ width: 30, height: 30, }} />
                                    </TouchableOpacity>
                                   </View> */}
                                   
                                    <View style={styles.addView}>
                                      {/* 
                                        <View style={{top:-5,position:'absolute',alignSelf:'flex-end',zIndex:0}}>
                                          <TouchableOpacity onPress={() => { this.deleteData(data) }}>
                                            <Image source={require('../../Assets/Images/clear.png')} style={{ width: 30, height: 30, }} />
                                          </TouchableOpacity>
                                        </View> */}

                                      <View style={{ marginTop: hp('1%'), marginRight: wp('3%'), marginLeft: 8, width: wp(25), height: hp(21), borderRadius: 8, overflow: 'hidden', backgroundColor: '#c1c1c1',shadowOffset: { width: 10, height: 10 }, shadowColor: 'grey', shadowOpacity: 1, elevation: 8,}}>
                                        <ImageBackground source={{ uri: serviceUrl.StatusImage + data.pic}}
                                          resizeMode={'cover'} style={{ width: '100%', height: '100%', }} >
                                            
                                          <TouchableOpacity onPress={() => { this.deleteData(data) }} 
                                           style={{alignSelf:'flex-end',}}>
                                            <Image source={require('../../Assets/Images/clear.png')} style={{ width: 30, height: 30, }} />
                                          </TouchableOpacity>
                                        
                                        </ImageBackground>
                                      </View>
                                     
                                      <TouchableOpacity onPress={() => this.props.navigation.navigate('GetStories', { location: item._id,item:data })}>
                                        <Text style={styles.addMore}>+AddMore</Text>
                                      </TouchableOpacity>
                                      
                                    </View>
                                    

                                  </View>
                                )}
                              </View>)}
                          )}
                        </ScrollView>
                      </View>)}
                    </View>)}
                 keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </ScrollView>
          {/* Modal screen */}
          <Modal isVisible={this.state.imageDeleteModal} onBackdropPress={() => this.setState({ imageDeleteModal: false })}
            onBackButtonPress={() => this.setState({ imageDeleteModal: false })} >
            <View style={styles.modalView} >
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                <TouchableOpacity onPress={() => { this.delete() }}>
                  <Text style={styles.modalText}>
                    Delete
                            </Text>
                </TouchableOpacity>
              </View>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                <TouchableOpacity onPress={() => { this.setState({ deleteimage: '', imageDeleteModal: false }) }}>
                <Text style={styles.modalText}>
                    Cancel
                           </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Modal screen end*/}
       
        </ScrollView>
        {/* <FooterTabBar {...this.props} tab={2} /> */}
        <View style={styles.footer}>
                <TouchableOpacity style={styles.bottomButtons} onPress={() => this.makeActive(1)}>
                  <Image source={activeTab == 1  ? require(imagePath + 'cameraRed.png') : require(imagePath + 'camera.png')}
                    style={{ width: 30, height:30 }} />
                  <Text style={[styles.footerText, { color: activeTab == 1 ? '#ec0355' : 'black' }]}>Memories</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomButtons} onPress={() => this.makeActive(2)}>
                  <Image source={activeTab == 2 ? require(imagePath + 'visitsRed.png') : require(imagePath + 'visits.png')}
                    style={{ width: 25, height:25 }} 
                    // resizeMode={'center'} 
                    />
                  <Text style={[plannerStyles.footerText, { color: activeTab == 2 ? '#ec0355' : 'black' }]}>Visits</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomButtons} onPress={() => this.makeActive(3)}>
                  <Image source={activeTab == 3? require(imagePath + 'imageRed.png') : require(imagePath + 'image.png')}
                    style={{ width:30, height: 30 }} />
                  <Text style={[styles.footerText, { color: activeTab == 3 ? '#ec0355' : 'black' }]}>Albums</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomButtons} onPress={() => this.makeActive(4)}>
                  <Image source={activeTab == 4 ? require(imagePath + 'videoRed.png') : require(imagePath + 'video.png')}
                    style={{ width: 25, height: 25, }}  />
                  <Text style={[styles.footerText, { color: activeTab == 4 ? '#ec0355' : 'black' }]}>VLog</Text>
                </TouchableOpacity>

              </View>
      </View>

    )
  }
}

const styles = StyleSheet.create(
  {
    image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' },

    imageView1: { height: 333, width: "97%" },
    view: { justifyContent: 'flex-end', margin: 10, },
    container2: { flexDirection: 'row', width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop:'1.5%',position:'absolute',bottom:24 },
    icon: { width: 15, height: 20 },
    footer: {
      position: 'absolute',
      flex:0.1,
      left: 0,
      right: 0,
      bottom:0,
      backgroundColor:'#fff',
      flexDirection:'row',
      height:70,
      marginTop:0,
      alignItems:'center',
      justifyContent:'center'
    },
    bottomButtons: {
      alignItems:'center',
      justifyContent: 'center',
      marginBottom:8,
      flex:1,
    },
    footerText: {
      // fontFamily:Common_Color.fontMedium,
      fontFamily:Common_Color.fontLight,
      alignItems:'center',
      // fontSize:14,
      fontSize:9
    },
    footericon: { width: '23%', marginLeft: '5%' },
    fontColor: { color: '#b4b4b4' },
    // footer font
    fontsize: { fontSize: 12, color: '#010101', fontWeight: 'normal', },
    footerIconImage: { width: wp(8), height: hp(4.5), },
    modalView: { width: wp('90%'),backgroundColor: '#fff', borderRadius: 5, marginLeft: 'auto', marginRight: 'auto' },
    modalText:{ color: '#000', marginTop: hp('2%'), textAlign:'center', marginBottom: hp('1.3%'),fontFamily:Common_Color.fontMedium },
    visitFont: { color: '#000', marginTop: hp('2%'),fontFamily:Common_Color.fontMedium },

    //add visit style
    addView: { marginTop: hp('2%'), marginRight: wp('3%') },
    imageBackground: { width: wp(20), height: hp(15) },
    imageBackgroundView: { width: wp(4), height: hp(2.5), top: 0 },
    addMore: { fontSize: wp(2.8), textAlign: 'center', marginTop: hp(0.5), color: '#39A0EC' },
    closeIconView: { width: 30, height: 30, top: 8,right:14, position: 'absolute'}

  },
)