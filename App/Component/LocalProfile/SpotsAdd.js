import React, { Component } from 'react';
import { View, Text, TextInput as RNTextInput, Image, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView, ImageBackground, StatusBar, TouchableWithoutFeedback, LayoutAnimation, Alert } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import spotAddStyle from './styles/spotAddStyle'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
const imagepath = '../../Assets/Images/localProfile/';
import serviceUrl from '../../Assets/Script/Service';
import Modal from "react-native-modal";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Toolbar } from '../commoncomponent'
import Common_Style from '../../Assets/Styles/Common_Style'
import LinearGradient from "react-native-linear-gradient";
import styles1 from '../../styles/NewfeedImagePost';
import { TextInput, Menu, Divider } from 'react-native-paper';
import common_styles from "../../Assets/Styles/Common_Style"

// import { TextInput, HelperText } from 'react-native-paper';

var places = '';
export default class SpotAdd extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(prop) {
    super(prop);
    this.state = {
      modalVisible: '', addHangout: '', place: '', data: '', placeId: '', addFolder: '', modaltext: ''
      , folderdata: '', count: '', RemovePlace: '', location: '',
      datahangout: [], datahangoutList: [],
      country: '', deleteHangout: '',
      coords: '',
      storiesData: [],
      respectiveLocation: '',
      viewLayoutHeight: 50,
      updatedHeight: 0,
      expand: false,
      loading: false,
      loadingApi: false
    }
  }
  sendModalTimeout;

  componentWillMount() {
    this.modelGetApi();
    this.allHangout();
  }
  componentDidMount() {
   // debugger;
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.modelGetApi();
      });
  }

  componentWillUnmount = () => {
    clearTimeout(this.sendModalTimeout)
   
  }


  _selectedListForDel = (data) => {

    data.selected = !data.selected;
    const index = this.state.datahangout.findIndex(
      item => data._id === item._id
    );
    this.state.datahangout[index] = data;
    this.setState({
      datahangout: this.state.datahangout,
    });
  };

  _selectedListForDelgroup = (data) => {

    data.selected = !data.selected;
    const index = this.state.data.findIndex(
      item => data._id === item._id
    );
    this.state.data[index] = data;
    this.setState({
      data: this.state.data,
    });
  };

  _deleteAlbums = async () => {
   // debugger;
    const { datahangout } = this.state;
    let datahangoutIds = datahangout.filter(d => d.selected)
      .map(d => d._id);

    if (datahangoutIds.length == 0) {
      toastMsg1('danger', 'Select atleast one to delete.')
   // Alert.alert('Warning', 'Select atleast one to delete.');
      return;
    }
    console.log('selected ids', datahangoutIds)
    var data = {
      _id: datahangoutIds
    };
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
          this.setState({ deleteHangout: false })
          this.modelGetApi();

        }
      })
      .catch((error) => {
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  };

  modelGetApi = async () => {
   // debugger;
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
    };
    const url = serviceUrl.been_url1 + "/GetHangouts"
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('the get', responseJson);
        if (responseJson.status == 'True') {
          let hangout = responseJson.HangoutsList.length > 0 && responseJson.HangoutsList.map(d => {
            d.selected = false;
            return d;
          })
          // console.log('album responses', hangout);
          this.setState({ data: responseJson.GroupDet, count: responseJson.Hangoutscount, datahangout: hangout })
        }
        else {
          this.setState({ count: null, datahangout: [] })
        }


      })
      .catch((error) => {
        //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
      });
  };

  AddSpotApi = async () => {
   // debugger;
    if (this.state.location != "" || null || undefined && this.state.country != "" || null || undefined) {
      places = this.state.location + ',' + this.state.country
      var data = {
        Userid: await AsyncStorage.getItem('userId'),
        // Userid:'5e219b53bd333366c1be32ec',
        country: places,
        SpotName: this.state.place,
        coords: this.state.coords
      };
      console.log("Add spot data",data)
      const url = serviceUrl.been_url1 + '/addhangouts'
      return fetch(url, {
        method: "POST",
        headers: serviceUrl.headers,
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("response of after add spots",responseJson)
          if (responseJson.status == 'True') {
            this.setState({ modalVisible: false, addHangout: false, placeId: '', place: '', location: '', country: '' })
            this.modelGetApi();
            place = ''
            //toastMsg('success', 'you are created successfully ')
          }
        })
        .catch((error) => {
          //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
        });
    }
    else {
      toastMsg1('danger', 'Please fill the all fields')
    }
  };

  create = async () => {
   // debugger;
    var data = {
      // Userid: "5df489bd1bc2097d72dd07c2",
      GroupName: this.state.modaltext,
      Userid: await AsyncStorage.getItem('userId')
    };
    const url = serviceUrl.been_url1 + '/CreateHangoutGroup';
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.ok) {
          return (response.json())
        } throw new Error('Request failed!')

      }, networkError => { console.log(networkError) }
      )
      .then((responseJson) => {
        console.log('album responses', responseJson);
        if (responseJson.status == 'True') {
          this.setState({ folderdata: responseJson.result._id, addFolder: false })
          //toastMsg('success', 'you are created successfully ')
          this.modelGetApi()
          console.log('hi', this.state.folderdata)
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
      return false;
    }
    var data1 = {
      _id: datahangoutIds,
    };
    const url = serviceUrl.been_url1 + '/DeleteGroupLocal'
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data1)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'True') {
          //toastMsg('success', 'Deleted successfully')
          this.setState({ RemovePlace:false })
          this.modelGetApi()
        }
      })
      .catch((error) => {
        toastMsg1('danger', error.message || 'Sorry..something network error.Try again please.')
      });
  }

  Newgroup(){
    this.setState({
      modalVisible: false,
    },()=>{
      this.sendModalTimeout = setTimeout(()=>{
        console.log("is called")
        this.setState({
          addFolder: true
        })
      },600)
    })
  }
  
  Deletespot(){
    this.setState({
      modalVisible: false,
    },()=>{
      this.sendModalTimeout = setTimeout(()=>{
        console.log("is called")
        this.setState({
          deleteHangout: true
        })
      },600)
    })
    }

  Deletegroup(){
    this.setState({
      modalVisible: false,
    },()=>{
      this.sendModalTimeout = setTimeout(()=>{
        // console.log("is called")
        this.setState({
          RemovePlace: true
        })
      },600)
    })
    }

  addSpot() {
    this.setState({
      modalVisible: false,
    },()=>{
      this.sendModalTimeout = setTimeout(()=>{
        console.log("is called")
        this.setState({
          addHangout: true
        })
      },600)
    })
    this.modelGetApi()
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
  _handlePress = (data, details) => {
    let addr = details.formatted_address.split(', ');
    let locName = addr[0],
      counName = addr[addr.length - 1];
    let lat = details.geometry ? details.geometry.location.lat : null,
      lng = details.geometry ? details.geometry.location.lng : null;
    var geom = {
      latitude: lat,
      longitude: lng
    }

    this.setState({
      location: locName,
      country: counName,
      isPlacesModal: false,
      coords: JSON.stringify(geom)
    })
  }
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
            datahangoutList: responseJson.HangoutsList
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
  navigation(item) {
    this.props.navigation.navigate('SpotAddGroup', { data: item })
  }
  optionImg() {
    return (
      <View style={{ width: '25%' }}>
        <TouchableOpacity hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }} onPress={() => { this.setState({ modalVisible: true, place: '' }) }}>
        <Image source={require('../../Assets/Images/3dots.png')}
     //  resizeMode={'center'} 
         style={{ width: 16, height: 16, marginTop: '0.5%' }} />
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    const itemNumber = this.state.storiesData.filter(item => item.isSelect).length;
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="pink" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1,marginTop:0,backgroundColor:'#fff' }}>
        <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
        <Toolbar {...this.props} centerTitle='' rightImgView={this.optionImg()} />

        <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
        <ScrollView style={{ height: '100%' }}><View style={{ marginTop: '-11%', }}>
          <View style={{ alignItems: 'center', marginTop: hp('1%') }}>
            <Image source={require('../../Assets/Images/new/HangoutSpots.png')}
              style={spotAddStyle.locationIcon} resizeMode={'contain'} />

            <View style={{ flexDirection: 'row' }}>
              <Text style={[spotAddStyle.locationText, {  fontSize: Searchresult.FontSize, }]}>{this.state.count} </Text>
              <Text style={[spotAddStyle.locationText, { fontFamily: Common_Color.fontBold }]}> Hangout Spots</Text>

            </View>
            {/* <Text style={[spotAddStyle.locationText, { fontFamily: Common_Color.fontBold }]}>{this.state.count} Hangout Spots</Text> */}

          </View>
          <View style={{ margin: '5%', marginTop: '10%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('AddHangoutSpots') }} >
                <View style={spotAddStyle.borderView}>
                  <Text style={[spotAddStyle.locationText, { fontFamily: Common_Color.fontBold }]}>All Hangout Spots</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginLeft: wp('4%') }}>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => (<View>
                <View style={{ marginTop: hp('2%'), marginBottom: hp('2%') }}>
                  <TouchableOpacity onPress={() => { this.navigation(item) }}>
                    <View style={{backgroundColor:'#ebebeb', borderRadius: 20, alignItems: 'center', justifyContent: 'center', height: hp('17%'), width: wp('41%'), marginRight: wp('10%') }}>
                      <Text style={{fontSize: TitleHeader.FontSize, fontFamily: Username.Font,color:'#000' }}>{item.GroupName}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>)}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}

            />
          </View>
        </View>
        </ScrollView>

       
        {/* Common 3 dots data */}
        <Modal onBackdropPress={() => this.setState({ modalVisible: false })}
          onBackButtonPress={() => this.setState({ modalVisible: false })}
          animationType='fade'
          transparent={true}
          isVisible={this.state.modalVisible}
        >
          <View style={styles1.modalContent}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

            <View style={{ marginTop: 15, }}>
              <TouchableOpacity onPress={() => { this.addSpot() }}>
                <Text onPress={() => { this.addSpot() }}
                  style={[styles1.modalText, { color: '#00a8cc' }]}>
                  Add Spot
                   </Text>
              </TouchableOpacity>
            </View>
            <View style={styles1.horizontalSeparator} />

            <View style={{ marginTop: 7, }}>
              <TouchableOpacity onPress={() => { this.Deletespot() }}>
                <Text onPress={() => { this.Deletespot() }} style={[styles1.modalText, { color: 'red' }]}>
                  Delete spot
              </Text>
              </TouchableOpacity>
            </View>

            <View style={styles1.horizontalSeparator} />
            <View style={{ marginTop: 7, }}>
              <TouchableOpacity onPress={() => { this.Newgroup() }}>
                <Text onPress={() => { this.Newgroup() }} style={[styles1.modalText, { color: '#00a8cc' }]}>
                  New Group
              </Text>
              </TouchableOpacity>
            </View>

            <View style={styles1.horizontalSeparator} />

            <View style={{ marginTop: 7, marginBottom: 15 }}>
              <TouchableOpacity onPress={() => { this.Deletegroup() }}>
                <Text onPress={() => { this.Deletegroup() }} style={[styles1.modalText, { color: 'red' }]}>
                  Delete Group
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>


        {/* Add spot details */}
        <Modal
          onBackdropPress={() => this.setState({ addHangout: false })}
          onBackButtonPress={() => this.setState({ addHangout: false })}
          animationType='fade'
          isVisible={this.state.addHangout}
          onRequestClose={() => { this.setState({ addHangout: false }) }}>
          <View style={{ alignItems: 'center', justifyContent: 'center',marginLeft:5,}}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <KeyboardAvoidingView>
              <View >
                <RNTextInput
                  style={{backgroundColor: '#ebebeb', width: wp('95%'), height: hp('6%'),paddingLeft:8, alignSelf: 'center',
                  flexDirection: 'row', borderWidth: .5, borderColor: '#e1e1e1', borderRadius: 10,}}
                  placeholder='     Add spot'
                  placeholderStyle={{ fontWeight: 'bold', fontSize: 20, color: '#000',paddingLeft:8 }}
                  value={this.state.place}
                  onChangeText={(text) => { this.setState({ place: text }) }}
                  theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: 'transparent', underlineColor: 'transparent', } }}
                />
              </View>

              <View style={{ width: wp(94.5), backgroundColor: '#fff', height: hp('30%'), marginLeft: 7, marginTop: '15%' }}>
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
                    this._handlePress(data, details);
                  }}
                  getDefaultValue={() => ''}
                  query={{
                    key: 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20',  language: 'en', types: ''      }}
                  styles={{
                    textInputContainer: {
                      width: '100%'
                    },
                    description: {
                      fontWeight: 'bold'
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb'
                    }
                  }}

                  currentLocation={false} 
                  currentLocationLabel="Current location"
                  nearbyPlacesAPI='GooglePlacesSearch' 
                  GoogleReverseGeocodingQuery={{
                   
                  }}
                  GooglePlacesSearchQuery={{
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

           
              <View style={[Common_Style.Common_button, { width: wp(96.5),margin:3 }]}>

                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                  borderRadius={10}
                >
                  <TouchableOpacity onPress={() => { this.AddSpotApi() }}>
                    <Text onPress={() => { this.AddSpotApi() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Add</Text>
                  </TouchableOpacity>
                </ImageBackground>

              </View>
              <View style={[Common_Style.Common_button, { width: wp(99) }]}>
                <TouchableOpacity onPress={() => { this.setState({ addHangout: false }) }}>
                  <Text onPress={() => { this.setState({ addHangout: false }) }} style={Common_Style.Common_btn_txt}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            <View>

            </View>
          </View>
        </Modal>
         
         {/* Adding add group modal */}
        <Modal
          onBackdropPress={() => this.setState({ addFolder: false })}
          onBackButtonPress={() => this.setState({ addFolder: false })}
          animationType='fade'
          isVisible={this.state.addFolder}
          onRequestClose={() => { this.setState({ addFolder: false }) }}>

          <View style={[Common_Style.modalContent,{backgroundColor:'transparent'}]} >
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <View style={{ width: wp(89), marginTop: 5, }}>

              <TextInput
                label="Type here"
                mode="outlined"
                value={this.state.is_Valid_mail}
                autoCorrect={false}
                
                onChangeText={(val) => { this.setState({ modaltext: val }) }}
                style={[common_styles.textInputSignUp, { width: '98%' }]}
                selectionColor={'#f0275d'}
                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />

            </View>

            <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 10 }]}>

              <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                borderRadius={10}
              >
                <TouchableOpacity onPress={() => { this.create() }}>
                  <Text onPress={() => { this.create() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Create</Text>
                </TouchableOpacity>
              </ImageBackground>

            </View>
            <View style={[Common_Style.Common_button, { width: wp(95), marginTop: 5, marginBottom: 5 }]}>
              <TouchableOpacity onPress={() => this.setState({ addFolder: false })} >
                <Text onPress={() => this.setState({ addFolder: false })} style={[Common_Style.Common_btn_txt, { color: '#fff', marginLeft: 5 }]}>Cancel</Text>
              </TouchableOpacity>

            </View>

          </View>
        </Modal>

      {/* Delete spot lists */}
        <Modal
          isVisible={this.state.deleteHangout}
          onBackdropPress={() => this.setState({ deleteHangout: false })}
          onBackButtonPress={() => this.setState({ deleteHangout: false})}
          onSwipeComplete={this.close}
          swipeDirection={['down']}
          style={styles.view}>
          <View style={{ backgroundColor: '#fff', height: 500, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderColor: 'rgba(0, 0, 0, 0.1)', }}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

            <Content contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}>
              <View style={{ height: 280,marginTop:10 }}>
                <FlatList
                  data={this.state.datahangout}
                  // ItemSeparatorComponent={this.seperator()}
                  extraData={this.state}
                  renderItem={({ item, index }) => (
                    <ScrollView>
                      <TouchableOpacity onPress={() => { this._selectedListForDel(item) }}>
                        <View style={{ flexDirection: 'row', height: hp('5%'), width: wp('100%'), justifyContent: 'flex-start' }}>
                          <View style={{ width: wp('1%') }} />

                          <View style={{ width: wp('77%'), flexDirection: 'row' }}>
                            <Image source={require(imagepath + 'blackLocation.png')}
                              style={{ height: 20, width: 15, marginLeft: '5%' }} />
                            <Text style={{ fontSize: 16, marginLeft: 5, fontFamily: Common_Color.fontMedium }}>
                              {item.SpotName},{item.country}
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

     
            <TouchableOpacity activeOpacity={1} onPress={() => this._deleteAlbums()}>

              <View style={[common_styles.Common_button,{width: wp('85%'), marginBottom: 10}]}>
                <ImageBackground source={require('../../Assets/Images/button.png')}
                  style={{ width: '100%', height: '100%' }}
                  borderRadius={10}
                >
                  <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                    onPress={() => this._deleteAlbums()}>
                    <Text style={common_styles.Common_btn_txt}>Delete</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </TouchableOpacity>

          </View>
        </Modal>

        {/* delete group Hangout */}
        <Modal
          isVisible={this.state.RemovePlace}
          onSwipeComplete={this.close}
          onBackdropPress={() => this.setState({ RemovePlace: false })}
          onBackButtonPress={() => this.setState({ RemovePlace: false})}
          swipeDirection={['down']}
          style={styles.view}>
          <View style={{ backgroundColor: '#fff', height: 500, width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderColor: 'rgba(0, 0, 0, 0.1)', }}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
           
            <Content contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}>
              <View style={{ height: 280,marginTop:10 }}>
                <FlatList
                  data={this.state.data}
                  // ItemSeparatorComponent={this.seperator()}
                  extraData={this.state}
                  renderItem={({ item, index }) => (

                    <TouchableOpacity onPress={() => { this._selectedListForDelgroup(item) }}>
                      <View style={{ flexDirection: 'row', height: hp('4%'), width: wp('100%'), justifyContent: 'flex-start', marginTop: 8 }}>
                        <View style={{ width: wp('1%') }} />

                        <View style={{ flexDirection: 'row', width: '80%' }} >
                          <Text style={{ fontSize: 20, marginLeft: wp('2%'), fontFamily: Common_Color.fontMedium }}>
                            {item.GroupName}
                          </Text>
                        </View>


                        {item.selected === true ?
                          <Image style={{ width: 22, height: 22, marginTop: '.5%' }}
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
            <View style={[common_styles.Common_button,{width: wp('85%'), marginBottom: 10}]}>
              <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}>
                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                  onPress={() => this.deletePlace()}>
                  <Text style={common_styles.Common_btn_txt}>Delete</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>

          </View>
        </Modal>
      </View>
    )
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
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  description: {
    fontWeight: 'bold',
    color: "#4c4c4c",

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
    paddingLeft: 20, fontFamily: Common_Color.fontMedium
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