import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
const imagepath = '../../Assets/Images/localProfile/';
import {Common_Color} from '../../Assets/Colors'
var message;
var place = 'please select a location';
export default class hangoutGroup extends Component {
  static navigationOptions = {
    header: null
  };


  constructor(prop) {
    super(prop);
    this.state = {
      modalVisible: '', addHangout: '', place: '', data: '', placeId: '', datahangout: '', message: ""

    }
  }

  componentWillMount() {
    this.allHangout();
  }
  componentDidMount() {
   // debugger;
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.allHangout();

      });
  }

  modelGetApi = async () => {
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      // Userid:'5e219b53bd333366c1be32ec',

    };
    const url = serviceUrl.been_url + '/GetAllPlaces'
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('album responses', responseJson);
        if (responseJson.status == 'True') {
          this.setState({ data: responseJson.placeList })

        }
      })
      .catch((error) => {
        // console.log(error);
        //toastMsg('danger',error+'Sorry..something network error.Try again please.')
      });
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
    //// debugger;
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      // Userid:'5e219b53bd333366c1be32ec',
      Placeid: this.state.placeId,
      SpotName: this.state.place
    };
    const url = serviceUrl.been_url + '/GetAllPlaces'
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('album responses', responseJson);
        if (responseJson.status == 'True') {
          this.setState({ modalVisible: false, addHangout: false, placeId: '', })
          place = ''
          this.allHangout();
          //toastMsg('success','you are created successfully ')


        }
      })
      .catch((error) => {
        // console.log(error);
        //toastMsg('danger',error+'Sorry..something network error.Try again please.')
      });
  };

  addSpot() {
    this.modelGetApi()
    this.setState({ modalVisible: false, addHangout: true })


  }

  locationSelector(item) {
    //// debugger;
    if (item === undefined) {
      place = 'please select a location'
    }
    else {
      console.log(item)

      place = item.Place
      this.setState({ placeId: item._id })

    }


  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header style={{ backgroundColor: '#ffffff', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
          <Left>
            <TouchableOpacity hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }} onPress={() => { this.props.navigation.goBack(); }}>
              <Image source={require(imagepath + 'left-arrow.png')}
                style={{ height: hp(3), width: wp(3) }} resizeMode={'stretch'} />
            </TouchableOpacity>
          </Left>
          <Body />
          <Left style={{ alignItems: 'flex-end', paddingRight: '5%' }}>
            <TouchableOpacity hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }} onPress={() => { this.setState({ modalVisible: true }) }}>
              <Image source={require(imagepath + 'Option.png')}
                style={{ height: hp(3), width: wp(2) }} resizeMode={'stretch'} />
            </TouchableOpacity>
          </Left>
        </Header>

        <View style={{ marginTop: wp('10%') }}>
          <Text style={{ textAlign: 'center', fontFamily: Common_Color.fontMedium }}>{this.state.message}</Text>
        </View>
        <FlatList
          data={this.state.datahangout}
          renderItem={({ item }) => (<View>
            <View >
              <TouchableOpacity>
                <View style={{ flexDirection: 'row', marginLeft: wp('6%'), marginBottom: hp('2%') }} >

                  <Image source={require(imagepath + 'blackLocation.png')}
                    style={{ height: 20, width: 15, }} />
                  <Text style={{ fontSize: 20, marginLeft: wp('2%'), fontFamily: Common_Color.fontMedium }}>
                    {item.SpotName}
                  </Text>

                </View>
              </TouchableOpacity>
            </View>

          </View>)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
        />


        <Modal onBackdropPress={() => this.setState({ modalVisible: false })}
          onBackButtonPress={() => this.setState({ modalVisible: false })}
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={{ flex: 1, alignItems: 'flex-end', marginTop: hp('10%'), }}>
            <View style={{ width: wp('25%'), height: hp(7), borderWidth: 0.5, marginLeft: '4%' }}>
              <TouchableOpacity
                onPress={() => { this.addSpot() }}>
                <Text style={{ textAlign: 'center', marginTop: '2%', color: '#00a8cc',fontFamily:Common_Color.fontMedium }}>Add Spot</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: false })
                }}>
                <Text style={{ textAlign: 'center', marginTop: '2%', color: 'red',fontFamily:Common_Color.fontMedium }}>Delete spot</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.addHangout}
          onRequestClose={() => {
            this.setState({ addHangout: false })
          }}>
          <View style={{ alignItems: 'center', backgroundColor: 'rgba(10,10,10,0.70)', height: '100%' }}>
            <KeyboardAvoidingView>
              <View style={{ backgroundColor: '#fff', borderRadius: 40, marginTop: '15%', width: wp('80%') }}>
                <TextInput style={{ alignItems: 'center', height: hp('7%'),fontFamily:Common_Color.fontMedium }}  autoCorrect={false}
                           placeholder='     Add spot' value={this.state.place} onChangeText={(text) => { this.setState({ place: text }) }} />
              </View>

              <View style={{ backgroundColor: '#fff', borderRadius: 40, marginTop: '10%', width: wp('80%'), height: hp('8%') }}>

                <Text style={{ textAlign: 'center', marginTop: hp('2.5%'),fontFamily:Common_Color.fontMedium }} >{place}</Text>
              </View>

              <View style={{ backgroundColor: '#fff', width: wp('80%'), height: hp('30%'), marginTop: '15%', }}>
                <View style={{ marginTop: hp('3%') }}>

                  <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (<View>
                      <View >
                        <TouchableOpacity onPress={() => { this.locationSelector(item) }}>
                          <View style={{ flexDirection: 'row', marginLeft: wp('4%'), marginBottom: hp('2%') }} >

                            <Image source={require(imagepath + 'blackLocation.png')}
                              style={{ height: 20, width: 15, }} />
                            <Text style={{ fontSize: 20, marginLeft: wp('2%'),fontFamily:Common_Color.fontMedium }}>
                              {item.Place}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>)}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={1}
                  />
                </View>
              </View>

              <View style={{ backgroundColor: '#fff', marginTop: hp('10%'), borderRadius: 40 }} >
                <View style={{ flexDirection: 'row', alignItems: 'center', width: wp('50%'), }}>
                  <View style={{ width: wp('40%'), borderEndWidth: 1, height: hp('5%') }} >
                    <TouchableOpacity onPress={() => { this.AddSpotApi() }}>
                      <Text style={{ textAlign: 'center', marginVertical: hp('1%'), color: 'blue',fontFamily:Common_Color.fontMedium }}> Add</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: wp('40%'), height: hp('5%') }}>
                    <TouchableOpacity onPress={() => { this.setState({ addHangout: false }) }}>
                      <Text style={{ textAlign: 'center', marginVertical: hp('1%'), color: 'red',fontFamily:Common_Color.fontMedium }}> cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
            <View>
            </View>
          </View>
        </Modal>

      </View>
    )
  }
}