import React, { Component } from 'react';
import { Animated, Text, View, StatusBar, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Toolbar } from '../commoncomponent'
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { postServiceP01 } from '../_services';
import Modal from "react-native-modal";
import Common_Style from '../../Assets/Styles/Common_Style'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { toastMsg1, toastMsg } from '../../Assets/Script/Helper';
import { invalidText,deviceWidth as dw,deviceHeight as dh } from '../_utils/CommonUtils';
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

export default class GplacesBPlaceProfile extends Component {

  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      place_id: '',
      locName: '',
      isModalOpen: false,
      isModalOpen1: false,
      dataRequest: '',
      data:'',
      placeIdStore: '',
      reqStatus: '',
      coords: '',
      linkPlaceName:'',
      locationData:[],
      loader : false
    }
    this.scrollY = new Animated.Value(0);
    this.diffClamp = Animated.diffClamp(this.scrollY, 0, 60)
  }

  UNSAFE_componentWillMount() {
    this.getReuestData();
    this.onLoad()
  }

  onLoad = async () => {
    var placeIdStore = await AsyncStorage.getItem('placeID');
    console.log('the stored id', placeIdStore)
    this.setState({ placeIdStore: placeIdStore, })
  }

  getReuestData = async () => {
    var data = {
      userId: await AsyncStorage.getItem('userId'),
      place_id: await AsyncStorage.getItem('placeID')
    };
    console.log('ther data for get user data', data);
    const url = serviceUrl.been_url1 + '/UserProfile';
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('user112 profile', responseJson)
        let userData = responseJson.result[0].UserDetails[0]
        if (responseJson.status == "True") {
          this.setState({
            // locationData:typeof responseJson.PlaceStatus !== undefined ? responseJson.PlaceStatus[0] : 0,
            // dataRequest: typeof responseJson.PlaceStatus !== undefined && responseJson.PlaceStatus.length > 0 ? responseJson.PlaceStatus[0].ReqStatus : 0,
            // linkPlaceName: typeof responseJson.PlaceStatus !== undefined && responseJson.PlaceStatus.length > 0 ? responseJson.PlaceStatus[0].Place_Name : 0,
            locationData:typeof responseJson.LinkedData !== undefined ? responseJson.LinkedData[0] : 0,
            dataRequest: typeof responseJson.LinkedData !== undefined && responseJson.LinkedData.length > 0 ? responseJson.LinkedData[0].ReqStatus : 0,
            linkPlaceName: typeof responseJson.LinkedData !== undefined && responseJson.LinkedData.length > 0 ? responseJson.LinkedData[0].Place_Name : 0,
            placeIdStore : typeof responseJson.LinkedData !== undefined && responseJson.LinkedData.length > 0 ? responseJson.LinkedData[0].Place_id :null,
            loader : false
          })
          //AsyncStorage.mergeItem('profileType', responseJson.result[0].UserDetails[0].ProfileType);
          //AsyncStorage.setItem('profileType', responseJson.result[0].UserDetails[0].ProfileType);
          AsyncStorage.setItem('UserName', responseJson.result[0].UserDetails[0].UserName);
          console.log("Profile switch confusing", responseJson.result[0].UserDetails[0].ProfileType);
        }else{
          this.setState({
            loader : false
          })
        }
      })
      .catch((error) => {
        this.setState({
          loader : false
        })
      });
  };

  _handlePress = (data, details) => {

    let addr = details.formatted_address.split(', ');
    let locName = data ? data.structured_formatting.main_text : null,
      counName = addr[addr.length - 1];
    let lat = details.geometry ? details.geometry.location.lat : 0,
      lng = details.geometry ? details.geometry.location.lng : 0;
    var geom = {
      latitude: lat,
      longitude: lng
    }
    let data_id = '', place_id = '';
    if (data) {
      data_id = data.id;
      place_id = data.place_id
    }
    this.setState({
      locName: locName,
      country: counName,
      isPlacesModal: false,
      coords: JSON.stringify(geom),
      data_id: data_id,
      place_id: place_id,
      f_address: data ? data.structured_formatting.main_text + ', ' +
        data.structured_formatting.secondary_text : null
    })
  }


  request() {
    this.setState({
      reqStatus: "Send"
    })
    this.reqToAdmin();
  }

  cancelReq() {
    this.setState({
      reqStatus: "Cancel",
      isModalOpen: false
    });
    AsyncStorage.removeItem('placeID');
    this.reqToAdmin();
  }

  cancelLink() {
    this.setState({
      reqStatus: "CancelLink",
      isModalOpen1: false
    });
    AsyncStorage.removeItem('placeID');
    this.reqToAdmin();
  }

  requested() {
    this.setState({
      reqStatus: "Send",
      loader : true
    })
    this.reqToAdmin();
  }

  reqToAdmin = async () => {
    debugger
    const apiname = 'PlaceReqToAdmin';

    const data = {
      userId: await AsyncStorage.getItem('userId'),
      place_id: invalidText(this.state.placeIdStore) ? this.state.place_id : this.state.placeIdStore,
      PlaceName: this.state.locName,
      ReqStatus: this.state.reqStatus,
      coords:this.state.coords == "" ? null : this.state.coords
    };
    if (invalidText(data.place_id)) {
      toastMsg1('danger', 'Please select location.')
      return false;
    }
    console.log('data', data);
    postServiceP01(apiname, data).then(cb => {
      console.log('the resp', cb);
      // console.log('the resp', cb.result.Place_id);
      if (cb.status == 'True') {
        AsyncStorage.setItem("placeID", cb.result && cb.result.Place_id ? cb.result.Place_id : "");
        this.getReuestData();
      }
      else {
        toastMsg1('danger', cb.message)
        this.setState({
          loader : false
        })
        //ToastAndroid.show('Requested this location to admin', ToastAndroid.LONG)
      }
    }).catch(err => {
      console.log(err);
      toastMsg1('danger', 'something went wrong.Request not sent')
      this.setState({
        loader : false
      })
      //ToastAndroid.show('something went wrong.Request not sent', ToastAndroid.LONG)
    });
  }

  modalOpen() {
    this.setState({
      isModalOpen: true
    })
  }

  modalOpen1() {
    this.setState({
      isModalOpen1: true
    })
  }

  getLocation(data) {
    debugger;
    console.log("Location dats is ",data)
    // AsyncStorage.mergeItem('PlaceName', data.Location);
    // AsyncStorage.setItem('PlaceName', data.Location);
    this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
  }

  render() {
    const translateY = this.diffClamp.interpolate({ inputRange: [0, 55], outputRange: [0, 60] });
    const {dataRequest} = this.state
    return (
      <View style={{ flex: 1, marginTop: 0 }}>
        <View style={{ marginTop:Platform.OS === 'ios' ?50: StatusBar.currentHeight + 10, width: dw, height: dh, flexDirection: 'row', }}>
          <StatusBar barStyle='dark-content' />
         {dataRequest == "Approved" || dataRequest == "Send" ?
           <View style={{marginTop: StatusBar.currentHeight + 50,flex:1,alignContent:'center'}}>
          
            <Text onPress={() => this.getLocation(this.state.locationData)}  style={[searchInputStyle.flyit,{marginTop:20}]}>{this.state.linkPlaceName}</Text>
            <Text style={[searchInputStyle.flyit,{marginTop:20}]}>{dataRequest == "Approved" ? 'Linked' : 'Requested'}</Text>
            
            <View style={[Common_Style.Common_button,{marginTop:20,alignSelf:'center'}]}>
              <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                borderRadius={10}>
                  {dataRequest == "Approved" ? (
                    <TouchableOpacity onPress={() => this.cancelLink()}>
                      <Text style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Cancel Link</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => this.modalOpen()}>
                      <Text style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Cancel Request</Text>
                    </TouchableOpacity>
                  )}
                
              </ImageBackground>
            </View>
           </View> :

          <View style={{ width: dw * .8, }}>
            <GooglePlacesAutocomplete
              placeholder='Search'
              minLength={2} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
              listViewDisplayed={false}    // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                // console.log(data, details);
                this._handlePress(data, details);
              }}

              getDefaultValue={() => ''}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20',
                //our Key (Been) => AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20
                //git key (Uber clone) => AIzaSyB1O8amubeMkw_7ok2jUhtVj9IkME9K8sc
                language: 'en', // language of the results
                types: '' // default: 'geocode' || ,cities
              }}

              styles={searchInputStyle}
              currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
              currentLocationLabel="Current location"
              nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }}
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance,keyword,name', //distance
                type: 'cafe' //cafe
              }}
              GooglePlacesDetailsQuery={{
                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                fields: 'formatted_address,name,geometry',
              }}

              filterReverseGeocodingByTypes={['country', 'locality',
                'street_address', 'food', 'address',
                'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'geometry']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[homePlace, workPlace]}

              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            />

          </View>}
           {dataRequest != "Approved" && dataRequest != "Send" ?
           <View style={{ width: dw * .20, height: dh * .08, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={{ textAlign: 'center',fontSize: Username.FontSize, fontFamily: Username.Font, }}>
                Cancel
            </Text>
            </TouchableOpacity>
          </View> : null }
        </View>

        <Modal isVisible={this.state.isModalOpen} onBackdropPress={() => this.setState({ isModalOpen: false })}
          onBackButtonPress={() => this.setState({ isModalOpen: false })} 
          style={{flex:1}}
          >
          <View style={[searchInputStyle.modalView1,{height:hp('25%')}]} >
            <View>
              <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 14, marginLeft: 15, marginRight: 15, marginTop: 20, color: '#313131', lineHeight: 20, }}>
                Are you sure you want to cancel your request to link your profile to a location?</Text>
            </View>
            <View style={[Common_Style.Common_button, { width: wp(86), marginTop: '10%', height: '7%', marginHorizontal:8 }]}>
              <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                borderRadius={10}>
                <TouchableOpacity onPress={() => this.cancelReq()}>
                  <Text style={[Common_Style.Common_btn_txt, { marginTop: 8 }]}>Yes, Cancel</Text>
                </TouchableOpacity>
                
              </ImageBackground>
            </View>
            
              <View style={{marginTop:35,justifyContent: 'center',alignItems:'center'}}>
                <Text onPress={() => this.setState({isModalOpen:false})} style={{width:'100%',textAlign:'center'}}>No</Text>
              </View>
            
          </View>
        </Modal>

        <Modal isVisible={this.state.isModalOpen1} onBackdropPress={() => this.setState({ isModalOpen1: false })}
          onBackButtonPress={() => this.setState({ isModalOpen1: false })} >
          <View style={searchInputStyle.modalView1} >
            <View>
              <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 14, marginLeft: 15, marginRight: 15, marginTop: 20, color: '#313131', lineHeight: 20, }}>
                Are you sure you want to cancel your verified link to the location?</Text>
            </View>
            <View style={[Common_Style.Common_button, { width: wp(86), marginTop: '15%', height: '7%', marginLeft: 4 }]}>
              <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                borderRadius={10}>
                <TouchableOpacity onPress={() => this.cancelLink()}>
                  <Text style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Cancel Link</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </Modal>


        <Animated.View style={{ width: 200, height: 45, bottom:28, position: 'absolute', overflow: 'hidden', zIndex: 100, justifyContent: 'center', alignSelf: 'center', elevation: 4, transform: [{ translateY: translateY, }] }}>

          {dataRequest == "Approved" ?
            <Text style={searchInputStyle.flyit}></Text> :
            dataRequest == "Send" ?
              <Text style={searchInputStyle.flyit} > 
                {/* {Requested} */}
              </Text> :
              dataRequest == "0" ?
                <Text onPress={() => this.requested()} style={searchInputStyle.flyit}>{this.state.loader ? 'Requesting...': 'Request to Link'}</Text> :
                <Text onPress={() => this.requested()} style={searchInputStyle.flyit}>{this.state.loader ? 'Requesting...': 'Request to Link'}</Text>
          }
        </Animated.View>
      </View >
    );
  }
}

const searchInputStyle = {
  textInputContainer: {
    width: '94%',
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: .7,
    borderColor: '#000',
    margin: 10,
    borderRadius: 10,
  },
  description: {
    fontWeight: 'bold',
    color: "#4c4c4c",
  },
  predefinedPlacesDescription: {
    color: '#1faadb'
  },
  flyit: { color: '#3b9fe8', fontFamily: Common_Color.fontBold, fontSize: 20, textAlign: 'center' },
  textInput: {
    // backgroundColor:'#c1c1c1',
    height: 33,
    fontSize: 14,
    paddingLeft: 0,
  },
  modalView1: { width: wp('90%'), height: hp('25%'), backgroundColor: '#fff', borderRadius: 15 },
}
// renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
// renderRightButton={() => <Text>Custom text after the input</Text>}