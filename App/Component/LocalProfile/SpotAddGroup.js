import React, { Component } from 'react';
import { View, Text, Image,  FlatList, TouchableOpacity, KeyboardAvoidingView, StatusBar, Alert, ScrollView, ImageBackground } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { Toolbar } from '../commoncomponent'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style'
import styles1 from '../../styles/NewfeedImagePost';
const imagepath1 = '../../Assets/Images/';
import common_styles from "../../Assets/Styles/Common_Style"
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';
const imagepath = '../../Assets/Images/localProfile/';
export default class SpotAddGroup extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(prop) {
    super(prop);
    this.state = {
      modalVisible: '', addHangout: '', place: '', data: '', placeId: '', datahangout: '', message: "", RemovePlace: '', folderId: '', spotName: '', masterData: '', groupName: ''

    }
  }

  sendModalTimeout;

  componentDidMount() {
    // console.log("This props is ",this.props.navigation);
   //const folder = this.props.navigation.params.data
   //this.setState({ folderId: folder._id, masterData: folder.Hangoutid, groupName: folder.GroupName })
    // this.focusSubscription = this.props.navigation.addListener(
    //   "focus",
    //   () => {

    //     let hangout = this.state.masterData.length > 0 && this.state.masterData.map(d => {
    //       d.selected = false;
    //       return d;
    //     })
    //     console.log()
    //     this.setState({ masterData: hangout })
    //     console.log('hi', this.state.masterData)
    //     this.allHangout();

    //   });
  }

  componentWillUnmount = () => {
    clearTimeout(this.sendModalTimeout)
   
  }

  async UNSAFE_componentWillMount() {
   // debugger;
// console.log('the props',this.props.route);
    const folder = this.props.route?.params?.data
    this.setState({ folderId: folder?._id, masterData: folder.Hangoutid, groupName: folder.GroupName })
    this.allHangout();
  }

  addSpot() {
    this.setState({
      spotName: false,
    },()=>{
      this.sendModalTimeout = setTimeout(()=>{
        // console.log("is called")
        this.setState({
          addHangout: true
        })
      },600)
    })
    this.allHangout();
  }

  RemovePlace() { 
    this.setState({
      spotName: false,
    },()=>{
      this.sendModalTimeout = setTimeout(()=>{
        console.log("is called")
        this.setState({
          RemovePlace: true
        })
      },600)
    })
  }

  _selectedListForDel = (data) => {

    data.selected = !data.selected;
    const index = this.state.masterData.findIndex(
      item => data._id === item._id
    );
    this.state.masterData[index] = data;
    this.setState({
      masterData: this.state.masterData,
    });
    //console.log('selected delete items are',data);
  };

  _selectedListForAdd = (data) => {
    // alert(JSON.stringify(data))
    data.selected = !data.selected;
    const index = this.state.datahangout.findIndex(
      item => data._id === item._id
    );
    // alert(index)
    this.state.masterData[index] = data;
    this.setState({
      datahangout: this.state.datahangout,
    });
    //console.log('selected delete items are',data);
  };
  
  async allHangout() {
   // debugger;
    var data = {
      //   Userid: "5e219b53bd333366c1be32ec"
      Userid: await AsyncStorage.getItem('userId')
    };
    const url = serviceUrl.been_url + "/GetHangouts";
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('album responses', responseJson);
        if (responseJson.status == 'True') {

          this.setState({
            datahangout: responseJson.HangoutsList
          })
        }
        else {

          this.setState({ message: responseJson.message });
          console.log(this.state.message)
        }

      })
      .catch((error) => {
        //console.error(error);
      });
  };

  AddSpotApi = async () => {
    // debugger;
    //  console.log('data' + this.state.datahangout)
     const { datahangout } = this.state;
     let id = datahangout.filter(d => d.selected)
       .map(d => d._id);
 
     if (datahangout.length == 0) {
       toastMsg1('danger', 'Select atleast one to delete.')
     //  Alert.alert('Warning', 'Select atleast one to delete.');
       return;
     }
     var data = {
       Userid: await AsyncStorage.getItem('userId'),
       // Userid:'5e219b53bd333366c1be32ec',
       HangFolderid: this.state.folderId,
       Hangout: id
     };
     const url = serviceUrl.been_url1 + '/Addhangoutgroup'
     return fetch(url, {
       method: "POST",
       headers: serviceUrl.headers,
       body: JSON.stringify(data)
     })
       .then((response) => response.json())
       .then((responseJson) => {
         console.log('album responses', responseJson);
         if (responseJson.status == 'True') {
           this.setState({ modalVisible: false, addHangout: false, placeId: '', })
          //  place = ''
           this.props.navigation.goBack();
          //  this.allHangout();
         }
       })
       .catch((error) => {
         console.log('addhang err',error);
         this.setState({ modalVisible: false, addHangout: false, placeId: '', })
         toastMsg1('danger', error.message || 'Sorry..something network error.Try again please.')
       });
   };
  deletePlace() {
   // debugger;
    const { masterData } = this.state;
    let id = masterData.filter(d => d.selected)
      .map(d => d._id);

    if (masterData.length == 0) {
      toastMsg1('danger', 'Select atleast one to delete.')
     // Alert.alert('Warning', 'Select atleast one to delete.');
      return;
    }
    console.log('data' + id)
    var data = {

      _id: this.state.folderId,
      Hangoutid: [id],
    };
    const url = serviceUrl.been_url + '/DeleteHangoutGroup'
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('album responses', responseJson);
        if (responseJson.status == 'True') {
          //toastMsg('success', 'Deleted successfully')
          this.setState({ RemovePlace: '' })
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        // console.log(error);
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  }
  optionImg() {
    return (
      <View style={{ width: '25%' }}>
        <TouchableOpacity hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }} onPress={() => {
          this.setState({ spotName: true })
        }}>
          <Image source={require('../../Assets/Images/3dots.png')} 
         // resizeMode={'center'} 
          style={{ width: 16, height: 16, marginTop: '0.5%' }} />
        </TouchableOpacity>
      </View>
    )
  }

 

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <Toolbar {...this.props} centerTitle='' rightImgView={this.optionImg()} />

        <Content>
          <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
          <View style={{ marginTop: '-5%' }}>
            <View style={{ alignItems: 'center', marginTop: '5%' }}>
              <Text style={{
                fontSize: 26, fontFamily: Common_Color.fontMedium
              }}>{this.state.groupName}</Text>
              <Image source={require(imagepath + 'blackLocation.png')}
                style={{ height: hp(4.5), width: wp(7.5), borderRadius: 5, marginTop: '6%' }} />
              <Text style={{ textAlign: 'center', fontSize: Searchresult.FontSize,marginTop:10 }}> {this.state.masterData.length} Hangout Spots</Text>
            </View>
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', alignSelf: 'center', width: '60%', marginTop: '2%' }} />
            <View style={{ margin: '5%' }}>
              <FlatList
                data={this.state.masterData}
                renderItem={({ item }) => (<View>
                  <View style={{ marginVertical: '5%' }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={require(imagepath + 'blackLocation.png')}
                        style={{ height: hp(3), width: wp(5), }} />
                      <Text style={{ fontSize: 15, paddingLeft: '3%', fontFamily: Common_Color.fontMedium }}>
                        {item?.SpotName},{item?.country}
                      </Text>
                    </View>
                  </View>

                </View>)}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}
              />
            </View>
          </View>
        </Content>


        <Modal
          onBackdropPress={() => this.setState({ spotName: false })}
          onBackButtonPress={() => this.setState({ spotName: false })}
          animationType='fade'
          isVisible={this.state.spotName}
          onRequestClose={() => { this.setState({ spotName: false }); }}>
          <View style={styles1.modalContent}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <View style={{ marginTop: 15, }}>
              <TouchableOpacity
                onPress={() => { this.addSpot() }} >
                <Text style={[styles1.modalText, { color: '#00a8cc' }]}>
                  Add Spot</Text>
              </TouchableOpacity>
            </View>
            <View style={styles1.horizontalSeparator} />

            <View style={{ marginTop: 7, marginBottom: 15 }}>
              <TouchableOpacity
                onPress={() => { this.RemovePlace() }
                }>
                <Text style={[styles1.modalText, { color: 'red' }]}>Remove spot</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {/* new model */}
        <Modal
          isVisible={this.state.addHangout}
          onBackdropPress={() => this.setState({ addHangout: false })}
          onBackButtonPress={() => this.setState({ addHangout: false })}
          onSwipeComplete={() => { this.setState({ addHangout: false }) }}
          swipeDirection={['down']}
          style={styles.view}>
          <View style={{ backgroundColor: '#fff', height: 500, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderColor: 'rgba(0, 0, 0, 0.1)', }}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
           
            <Content contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10, marginTop: '2%' }}>
              <View style={{ height: 280, marginLeft: '10%',marginTop:8 }}>
                <FlatList
                  data={this.state.datahangout}
                  // ItemSeparatorComponent={this.seperator()}
                  extraData={this.state}
                  renderItem={({ item, index }) => (
                    <ScrollView>
                      <TouchableOpacity onPress={() => { this._selectedListForAdd(item) }}>
                        <View style={{ flexDirection: 'row', height: hp('5%'), width: wp('100%'), justifyContent: 'flex-start' }}>
                          <Image source={require(imagepath + 'blackLocation.png')}
                            style={{ height: 20, width: 15, }} />
                          <View style={{ width: wp('2%') }} />

                          <View style={{ width: wp('65%'), }}>
                            <Text style={{ fontSize: 16, marginLeft: 5, fontFamily: Common_Color.fontMedium }}>
                              {item?.SpotName},{item?.country}
                            </Text>
                          </View>

                          {item.selected === true ?
                            <Image style={{ width: 22, height: 22, }}
                              source={require('../../Assets/Images/check.png')} />
                            : null
                          }
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={false}
                />
              </View>
            </Content>
            
            <View style={[Common_Style.Common_button, { width: wp(87) }]}>

            <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.AddSpotApi() }}>
              <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                borderRadius={10}
              >
                
                  <Text style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Add</Text>
               
              </ImageBackground>
              </TouchableOpacity>

            </View>
            <View style={[Common_Style.Common_button, { width: wp(87) }]}>
              <TouchableOpacity onPress={() => { this.setState({ addHangout: false }) }}>
                <Text onPress={() => { this.setState({ addHangout: false }) }} style={[Common_Style.Common_btn_txt,{color: Common_Color.common_black,}]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <Modal
          isVisible={this.state.RemovePlace} 
           onBackdropPress={() => this.setState({ RemovePlace: false })}
          onBackButtonPress={() => this.setState({ RemovePlace: false })}
          onSwipeComplete={this.close}
          swipeDirection={['down']}
          style={styles.view}>
          <View style={{ backgroundColor: '#fff', height: 500, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderColor: 'rgba(0, 0, 0, 0.1)', }}>
          <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <Content contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}>
              <View style={{ height: 280,marginTop:10 }}>
                <FlatList
                  data={this.state.masterData}
                  // ItemSeparatorComponent={this.seperator()}
                  extraData={this.state}
                  renderItem={({ item, index }) => (
                    <ScrollView>
                      <TouchableOpacity onPress={() => { this._selectedListForDel(item) }}>
                        <View style={{ flexDirection: 'row', height: hp('5%'), width: wp('100%'), justifyContent: 'flex-start' }}>
                          <Image source={require(imagepath + 'blackLocation.png')}
                            style={{ height: 20, width: 15, marginLeft: '5%' }} />
                          <View style={{ width: wp('2%') }} />

                          <View style={{ width: wp('70%'), }}>
                            <Text style={{ fontSize: 16, marginLeft: 5, fontFamily: Common_Color.fontMedium }}>
                              {item?.SpotName},{item?.country}
                            </Text>
                          </View>

                          {item.selected === true ?
                            <Image style={{ width: 22, height: 22, }}
                              source={require('../../Assets/Images/check.png')} />
                            : null
                          }
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={false}
                />
              </View>
            </Content>

            <TouchableOpacity activeOpacity={1} onPress={() => this.deletePlace()}>

              <View style={[common_styles.Common_button, { width: wp('85%'), marginBottom: 10 }]}>
                <ImageBackground source={require('../../Assets/Images/button.png')}
                  style={{ width: '100%', height: '100%' }}
                  borderRadius={10}
                >
                  <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                    onPress={() => this.deletePlace()}>
                    <Text style={common_styles.Common_btn_txt}>Delete</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </TouchableOpacity>

          </View>
        </Modal>


      </Container>
    )
  }
}

const styles = {

  textcolor: {
    color: '#959595'
    ,
  },
  modaltext: {
    width: wp('80%'),
    height: hp('7%'),
    marginTop: '5%',
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 12,
    borderColor: '#9f9f9f',
    paddingLeft: 20



  },
  modalsImage: {
    width: wp('30%'),
    height: hp('6%'),




  },
  modalView: {
    width: wp('90%'),
    height: hp('23%'),
    backgroundColor: '#fff',
    borderRadius: 7

  },
  cancelbtn: {
    width: wp('30%'),
    height: hp('6%'),
    borderWidth: 1,
    borderRadius: 7,
    marginLeft: '18%',
    borderColor: '#9f9f9f'

  },
  margins: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',


  },
  text: {
    color: '#fff'
  }
  ,
  savedImages: {
    width: wp(50), height: hp(15),
  },
  createdImages: {
    width: wp(45), height: hp(15),
  },
  createdImagesView: {
    width: wp(45), height: hp(15), margin: '2%', marginBottom: '5%'
  },
  images: { width: wp('33.3%'), height: hp('20%'), },
  selectedIconView: {
    backgroundColor: '#2196F3', width: 25, height: 25, borderRadius: 12.5,
    position: 'absolute', margin: 5, right: 0, borderWidth: 2, borderColor: "#fff", overflow: 'hidden'
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
}

