import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, KeyboardAvoidingView, StatusBar, ScrollView, Alert } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RawButton, FlatList } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toolbar } from '../commoncomponent'
import serviceUrl from '../../Assets/Script/Service';
import LinearGradient from "react-native-linear-gradient";
const imagepath = '../../Assets/Images/localProfile/'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style'
import styles1 from '../../styles/NewfeedImagePost';
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';
export default class Places extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(prop) {
    super(prop);
    this.state = {
      modalVisible: '',
      spotName: '',
      place: '',
      data: '',
      RemovePlace: '',
      location: '',
      country: '',
      coords: '',
    }
  }

  componentWillMount() {
    this.getApi();
  }

  componentDidMount = () => {
    debugger
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => { this.getApi(); }
    );
  };

  addPlace() { 
    this.setState({
      modalVisible: false,
    },()=>{
      setTimeout(()=>{
        this.setState({
          spotName: true
        })
      },600)
    })
  }

  removePlace() { 
    this.setState({
      modalVisible: false,
    },()=>{
      setTimeout(()=>{
        this.setState({
          RemovePlace: true
        })
      },600)
    })
  
  }

  _handlePress = (data, details) => {
    let addr = details.formatted_address.split(', ');
    let locName = addr[0],
      counName = addr[addr.length - 1];
    let lat = details.geometry ? details.geometry.location.lat : null,
      lng = details.geometry ? details.geometry.location.lng : null;
    var geom = { latitude: lat, longitude: lng }
    this.setState({
      location: locName,
      country: counName,
      isPlacesModal: false,
      coords: JSON.stringify(geom)
    })
  }

  addPlace1 = async () => {
    debugger
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      // Userid:'5e219b53bd333366c1be32ec',
      Place: this.state.location,
      country: this.state.country,
      coords: this.state.coords

    };
    console.log(data)
    const url = serviceUrl.been_url1 + '/addplace'
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'True') {
          this.setState({ spotName: false })
          //toastMsg('success', responseJson.message)
          this.getApi();
        }
      })
      .catch((error) => {
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  };

  deletePlace() {
   // debugger;
    const { data } = this.state;
    let datahangoutIds = data.filter(d => d.selected)
      .map(d => d._id);

    if (datahangoutIds.length == 0) {
      toastMsg1('danger', 'Select atleast one to delete.')
      //Alert.alert('Warning', 'Select atleast one to delete.');
      return;
    }
    console.log('selected ids', datahangoutIds)

    var data2 = { _id: datahangoutIds };

    // var data = { _id: item._id, };
    const url = serviceUrl.been_url1 + '/DeletePlaces'
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data2)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('album responses', responseJson);
        if (responseJson.status == 'True') {
          //toastMsg('success', 'Deleted successfully')
          this.setState({ RemovePlace: false })
          this.getApi();
        }
      })
      .catch((error) => {
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  }
  getApi = async () => {
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      //  Userid:'5e219b53bd333366c1be32ec',
    };
    const url = serviceUrl.been_url1 + '/GetAllPlaces'
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
          placeCount = this.state.data.length
        }
      })
      .catch((error) => {
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  };

  optionImg() {
    return (
      <View style={{ width: '25%' }}>
        <TouchableOpacity hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }} onPress={() => { this.setState({ modalVisible: true }) }}>
        <Image source={require('../../Assets/Images/3dots.png')}
      //   resizeMode={'center'} 
         style={{ width: 16, height: 16, marginTop: '0.5%' }} />
        </TouchableOpacity>
      </View>
    )

  }
  _selectedListForDel = (data) => {

    data.selected = !data.selected;
    const index = this.state.data.findIndex(
      item => data._id === item._id
    );
    this.state.data[index] = data;
    this.setState({
      data: this.state.data,
    });
  };


  render() {
    return (
      <View style={{ flex: 1,marginTop:0,backgroundColor:'#fff' }}>
        <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
        <Toolbar {...this.props} centerTitle='' rightImgView={this.optionImg()} />

        <ScrollView style={{ height: '100%' }}>
          <View style={{marginTop:'-8%',}}>

            <View style={{ alignItems: 'center', marginTop: '5%' }}>
              <Image source={require('../../Assets/Images/new/Places.png')}
                style={{ height: wp('25%'), width: hp('20%'), }} resizeMode={'contain'} />

              <View style={{ flexDirection: 'row' }}>
              <Text style={{fontSize: Searchresult.FontSize,}}>{this.state.data.length}</Text>
                <Text style={ {fontSize: 20, textAlign: 'center', fontFamily: Common_Color.fontBold}}> Places</Text>

              </View>
            </View>
          </View>

          <View style={{ marginTop: hp('6%') }}>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => (<View>
                <View >
                  <View style={{ flexDirection: 'row', marginLeft: wp('6%'), marginBottom: hp('2%') }} >
                    <Image source={require(imagepath + 'blackLocation.png')}
                      style={{ height: 16, width: 15, marginTop: 5 }} />
                    <Text style={{ fontSize: 20, marginLeft: wp('4%'), fontFamily: Common_Color.fontMedium,color:'#6c6c6c' }}>
                      {item.Place},{item.country}
                    </Text>
                  </View>
                </View>
              </View>)}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
            />

          </View>
        </ScrollView>

       

        <Modal onBackdropPress={() => this.setState({ modalVisible: false })}
          onBackButtonPress={() => this.setState({ modalVisible: false })}
          animationType='fade'
          transparent={true}
          isVisible={this.state.modalVisible}
        >
          <View style={styles1.modalContent}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

            <View style={{ marginTop: 15, }}>
              <TouchableOpacity
                onPress={() => { this.addPlace() }}>
                <Text onPress={() => { this.addPlace() }}
                  style={[styles1.modalText, { color: '#00a8cc' }]}>
                  Add Place
                   </Text>
              </TouchableOpacity>
            </View>

            <View style={styles1.horizontalSeparator} />

            <View style={{ marginTop: 7, marginBottom: 15 }}>
              <TouchableOpacity
                onPress={() => { this.removePlace()}}>
                <Text onPress={() => { this.removePlace() }} style={[styles1.modalText, { color: 'red' }]}>
                  Remove Place
                </Text>
              </TouchableOpacity>
            </View>



          </View>
        </Modal>





        <Modal
          onBackdropPress={() => this.setState({ spotName: false })}
          onBackButtonPress={() => this.setState({ spotName: false })}
          animationType='fade'
          isVisible={this.state.spotName}
          onRequestClose={() => {
            this.setState({ modalVisible: false, RemovePlace: false, spotName: false });
          }}>
          <View style={[Common_Style.modalContent, {backgroundColor:'transparent'}]}>

            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <KeyboardAvoidingView>

              <View style={{ marginLeft: 15, width: 310, height: hp('20%'), marginTop: '1%', marginBottom: 50 }}>
                <GooglePlacesAutocomplete
                  placeholder='Search'
                  minLength={2} // minimum length of text to search
                  autoFocus={false}
                  returnKeyType={'search'}
                  keyboardAppearance={'light'}
                  listViewDisplayed={false}
                  fetchDetails={true}
                  renderDescription={row => row.description}
                  onPress={(data, details = null) => { this._handlePress(data, details); }}
                  getDefaultValue={() => ''}
                  query={{
                    key: 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20',
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

              </View>
              <View style={[Common_Style.Common_button, { width: wp(87), marginLeft: 18, marginTop: -80 }]}>

                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                  borderRadius={10}
                >
                  <TouchableOpacity onPress={() => { this.addPlace1() }}>
                    <Text onPress={() => { this.addPlace1() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Add</Text>
                  </TouchableOpacity>
                </ImageBackground>

              </View>
              <View style={[Common_Style.Common_button, { width: wp(95), }]}>
                <TouchableOpacity onPress={() => { this.setState({ spotName: false }) }}>
                  <Text onPress={() => { this.setState({ spotName: false }) }} style={[Common_Style.Common_btn_txt, { color: '#000', marginLeft: 10 }]}>Cancel</Text>
                </TouchableOpacity>

              </View>
            
            </KeyboardAvoidingView>
            <View>

            </View>
          </View>
        </Modal>


        <Modal
          isVisible={this.state.RemovePlace}
          onSwipeComplete={this.close}
          swipeDirection={['down']}
          style={styles.view}>
          <View style={{ backgroundColor: '#fff', height: 500, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderColor: 'rgba(0, 0, 0, 0.1)', }}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <View style={{ flexDirection: 'row', width: wp('100%'), justifyContent: 'space-between', height: 30, marginTop: 7 }}>

              <View style={{ justifyContent: 'flex-start', alignContent: 'flex-start' }}>
                {/* <Text style={{ fontSize: 18, color: '#a8a8a8', marginLeft: 25, fontFamily: Common_Color.fontBold, textAlign: 'left' }}>
                  Delete
                </Text> */}
              </View>
              <View>
                <TouchableOpacity hitSlop={{ top: 30, left: 30, bottom: 30, right: 30 }}
                  onPress={() => this.setState({ RemovePlace: false })}>
                  <Image style={{ width: 22, height: 22, marginRight: 35,marginTop:10,marginBottom:10 }}
                    source={require('../../Assets/Images/close.png')} />
                </TouchableOpacity>
              </View>
            </View>

            <Content contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}>
              <View style={{ height: 280 }}>
                <FlatList
                  data={this.state.data}
                  style={{marginTop:15}}
                  // ItemSeparatorComponent={this.seperator()}
                  extraData={this.state}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => { this._selectedListForDel(item) }}>
                      <View style={{ flexDirection: 'row', height: hp('6%'), width: wp('100%'), justifyContent: 'flex-start', marginTop: 5 }}>
                        <View style={{ width: wp('2%') }} />

                        <View style={{ width: wp('77%'), }}>
                          <Text style={{ fontSize: 16, marginLeft: 5, fontFamily: Common_Color.fontMedium }}>
                            {item.Place},{item.country}
                          </Text>
                        </View>

                        {item.selected === true ?
                          <Image style={{ width: 22, height: 22, }}
                            source={require('../../Assets/Images/check.png')} />
                          : null
                        }
                      </View>
                    </TouchableOpacity>

                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={false}
                />
              </View>
            </Content>

            <View style={[Common_Style.Common_button, { width: wp('85%'), marginBottom: 10 }]}>
              <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => this.deletePlace()}>
                <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' ,justifyContent: 'center',alignItems: 'center'}}>

                  <Text style={Common_Style.Common_btn_txt}>Delete</Text>

                </ImageBackground>
              </TouchableOpacity>
            </View>

            {/* <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center' }} onPress={() => { this.deletePlace() }}>
              <LinearGradient
                start={{ x: 0, y: 0.75 }}
                end={{ x: 1, y: 0.25 }}
                style={{ width: wp('35%'), height: hp('7%'), borderRadius: 30, marginBottom: 8 }}
                colors={["#f44236", "#f44236"]} >
                <Text style={{
                  textAlign: 'center', color: '#fff', marginTop: hp('2%'), fontFamily: Common_Color.fontBold
                }}>Delete</Text>
              </LinearGradient>
              <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}>
                
                  <Text style={Common_Style.Common_btn_txt}>Delete</Text>
              
              </ImageBackground>
            </TouchableOpacity> */}
          </View>
        </Modal>


      </View>
    )
  }
}

const searchInputStyle = {
  textInputContainer: {
    width: wp(87), marginLeft: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: .7,
    borderColor: '#000',
    margin: 10,
    borderRadius: 10,

  },
  description: {
    fontWeight: 'bold',
    color: "#fff",

  },
  predefinedPlacesDescription: {
    color: '#1faadb'
  },
  textInput: {
    // backgroundColor:'#c1c1c1',
    height: 33,
    fontSize: 14,
    paddingLeft: 0,
    

  }
}

const styles = {

  textcolor: {
    color: '#959595',
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
  },
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
