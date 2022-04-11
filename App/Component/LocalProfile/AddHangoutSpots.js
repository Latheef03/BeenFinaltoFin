import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, ImageBackground, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
const imagepath = '../../Assets/Images/localProfile/';
import { Toolbar } from '../commoncomponent'
import {Common_Color,TitleHeader} from '../../Assets/Colors'
import Spinner from '../../Assets/Script/Loader';
import Common_Style from '../../Assets/Styles/Common_Style'
var place = 'please select a location';


export default class AddHangoutSpots extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(prop) {
    super(prop);
    this.state = {
      modalVisible: '',
       addHangout: '', place: '', data: '', placeId: '', datahangout: '', 
       message: "", RemovePlace: '', no_record_found: false,
       isLoading: false,
    }
  }

  componentWillMount() { this.allHangout(); }

  componentDidMount() {
   // debugger;
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => { this.allHangout(); });
  }

  modelGetApi = async () => {
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      // Userid:'5e219b53bd333366c1be32ec',
    };
    const url = serviceUrl.been_url + '/GetAllPlaces'
    return fetch(url, {
      method: "POST",
      headers:serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'True') {
          this.setState({ data: responseJson.placeList })
        }
      })
      .catch((error) => {
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  };


  async allHangout() {
   // debugger;
    var data = {
      Userid: await AsyncStorage.getItem('userId')
    };
    this.setState({ isLoading: true });
    const url = serviceUrl.been_url1 + "/GetHangouts";
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
            datahangout: responseJson.HangoutsList,
            isLoading: false,
            no_record_found: false
          })
        }
        else {
          this.setState({ message: responseJson.message,
            isLoading: false,
            no_record_found: true, });
        }
      })
      .catch((error) => {
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  };


  AddSpotApi = async () => {
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      // Userid:'5e219b53bd333366c1be32ec',
      Placeid: this.state.placeId,
      SpotName: this.state.place
    };
    const url = serviceUrl.been_url1 + '/addhangouts '
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.status == 'True') {
          this.setState({ modalVisible: false, addHangout: false, placeId: '', })
          place = ''
          this.allHangout();
          //toastMsg('success', 'you are created successfully ')

        }
      })
      .catch((error) => {
        // console.log(error);
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  };

  deletePlace(item) {
   // debugger;
    console.log('data' + item)
    var data = { _id: item._id, };
    const url = serviceUrl.been_url1 + '/DeleteHangout'
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
          this.allHangout();
        }
      })
      .catch((error) => {
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  }

  addSpot() {
    this.modelGetApi()
    this.setState({ modalVisible: false, addHangout: true })
  }

  locationSelector(item) {
    if (item === undefined) {
      place = 'please select a location'
    }
    else {
      place = item.Place
      this.setState({ placeId: item._id })
    }
  }

  locationFetch(data){
    var data={
        coords:data.coords
    }
    this.props.navigation.navigate('GetLocation',{data:data})

}

  renderRightImgdone() {
    return <View>
        <View>
            
        </View>
    </View>
}
  render() {
    return (
      <View style={{ flex: 1,marginTop:0,backgroundColor:'#FFF' }}>

        <Toolbar {...this.props} centerTitle='All Hangout Spots'  rightImgView={this.renderRightImgdone()}/>

        {this.state.isLoading != true ?
          <FlatList
            data={this.state.datahangout}
            style={{marginTop:10}}
            renderItem={({ item }) => (<View>
              <View >
                <TouchableOpacity>
                  <View style={{ flexDirection: 'row', marginLeft: wp('6%'), marginBottom: hp('2%'),marginTop:8 }} >
                    <Image source={require(imagepath + 'blackLocation.png')}
                      style={{ height: 20, width: 15, }} />
                   <TouchableOpacity 
                     //onPress={()=>this.locationFetch(item)}
                     >
                    <Text style={{marginLeft: wp('2%'),  fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font }}>
                      {item.SpotName},{item.country}
                    </Text>
                    </TouchableOpacity>

                  </View>
                </TouchableOpacity>
              </View>

            </View>)}
            keyExtractor={(item, index) => index.toString()}
            numColumns={1}
          />

          :
          <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: '22%' }}>
            <Spinner color="#64b3f2" />
          </View>}

        <View style={{ width: wp("100%"), flex: 1, }}>
          {this.state.no_record_found === true ? (
            <View style={ { justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,}}>
              <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
              <Text style={Common_Style.noDataText}>{this.state.message}</Text>
            </View>
          ) : null}
        </View>


        <Modal onBackdropPress={() => this.setState({ modalVisible: false })}
          onBackButtonPress={() => this.setState({ modalVisible: false })}

          isVisible={this.state.modalVisible}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <View style={{ width: wp('25%'), height: hp(7), borderWidth: 0.5, marginLeft: '4%' }}>
              <TouchableOpacity
                onPress={() => { this.addSpot() }}>
                <Text style={Common_Style.searchBar}>Add Spot</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: false, RemovePlace: true })
                }}>
                <Text style={{ textAlign: 'center', marginTop: '2%', color: 'red', fontFamily: Common_Color.fontMedium }}>Delete spot</Text>
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
                <TextInput
                  style={{ alignItems: 'center', height: hp('7%'),paddingLeft:5 }}
                  placeholder='Add spot'
                  value={this.state.place}
                  autoCorrect={false}
                  
                  onChangeText={(text) => { this.setState({ place: text }) }} />
              </View>

              <View style={{ backgroundColor: '#fff', borderRadius: 40, marginTop: '10%', width: wp('80%'), height: hp('8%') }}>

                <Text style={{ textAlign: 'center', marginTop: hp('2.5%'), fontFamily: Common_Color.fontMedium }} >{place}</Text>
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
                            <Text style={{ fontSize: 20, marginLeft: wp('2%'), fontFamily: Common_Color.fontMedium }}>
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
                  <View style={{ width: wp('40%'), borderEndWidth: 1, height: hp('5%'), }} >
                    <TouchableOpacity onPress={() => { this.AddSpotApi() }}>
                      <Text style={{ textAlign: 'center', marginVertical: hp('1%'), color: 'blue', fontFamily: Common_Color.fontMedium }}> Add</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: wp('40%'), height: hp('5%') }}>
                    <TouchableOpacity onPress={() => { this.setState({ addHangout: false }) }}>
                      <Text style={{ textAlign: 'center', marginVertical: hp('1%'), color: 'red', fontFamily: Common_Color.fontMedium }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>

            </KeyboardAvoidingView>
            <View>

            </View>
          </View>
        </Modal>

        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.RemovePlace}
          onRequestClose={() => {
            this.setState({ modalVisible: false, RemovePlace: false, spotName: false });
          }}>
          <View style={{ alignItems: 'center', backgroundColor: 'rgba(10,10,10,0.70)', height: '100%' }}>
            <KeyboardAvoidingView>
              <View style={{ backgroundColor: '#fff', width: wp('80%'), marginTop: '20%', }}>
                <View style={{ marginTop: hp('3%') }}>
                  <FlatList
                    data={this.state.datahangout}
                    renderItem={({ item }) => (<View>
                      <View>

                        <View >
                          <TouchableOpacity onPress={() => { this.deletePlace(item) }}>
                            <View style={{ flexDirection: 'row', marginLeft: wp('6%'), marginBottom: hp('2%') }} >
                              <Image source={require(imagepath + 'blackLocation.png')}
                                style={{ height: 20, width: 15, }} />
                              <Text style={{ fontSize: 20, marginLeft: wp('2%'), fontFamily: Common_Color.fontMedium }}>
                                {item.SpotName},{item.country}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>)}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={1}
                  />
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