import React, { Component, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Picker,
  StyleSheet,
} from "react-native";
import Profile_Style from "../../Assets/Styles/Profile_Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Container,
  Title,
  Content,
  Button,
  Header,
  Toast,
  Badge,
  Left,
  Right,
  Body,
} from "native-base";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import {
  deviceHeight as dh,
  deviceWidth as dw,
  invalidText,
} from "../_utils/CommonUtils";
import moment from "moment";
import Modal from "react-native-modal";
import ImagePicker from "react-native-image-picker";
import serviceUrl from "../../Assets/Script/Service";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
let Common_Api = require("../../Assets/Json/Common.json");
import { Toolbar } from "../commoncomponent";
import { TextInput, Menu, Divider } from "react-native-paper";
import common_styles from "../../Assets/Styles/Common_Style";
import {
  Common_Color,
  TitleHeader,
  Username,
  profilename,
  Description,
  Viewmore,
  UnameStory,
  Timestamp,
  Searchresult,
} from "../../Assets/Colors";
import Loader from "../../Assets/Script/Loader";
import { Platform } from "react-native";
import ModalBox from "react-native-modalbox";
import { toastMsg } from "../../Assets/Script/Helper";

export default class Edit_Profile extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(prop) {
    super(prop);
    this.state = {
      id: "",
      dobText: "",
      dobDate: null,
      visibleModal: null,
      name: "",
      userName: "",
      website: "",
      bio: "",
      email: "",
      mobile: "",
      gender: "",
      dobFmt: "",
      photo: null,
      photo1: "",
      searchText: "",
      data: "",
      localGuide: "",
      locationEditable: true,
      isPlacesModal: false,
      coords: "",
      location: "",
      editPhoto: "",
      isLoader: false,
      genderList: ["Male", "Female", "Others"],
    };
    this.GPREF = null;
  }
  componentDidMount() {
    this.onLoad();
  }
  componentWillMount() {
    this.onLoad();
  }

  FlatListItemSeparator = () => {
    return (
      <View style={{ height: 0.8, width: "100%", backgroundColor: "#ddd" }} />
    );
  };

  setSelectedValue = (value) => {
    this.refs.listmodal.close();
    console.log("selected value", value);
    this.setState({
      gender: value,
    });
    // console.log('selected currency is', this.state.selectedCurrency)
  };

  onLoad = async () => {
    debugger;
    var data = { userId: await AsyncStorage.getItem("userId") };
    const url = serviceUrl.been_url1 + "/UserProfile";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("user profile", responseJson);
        if (responseJson.status == "True") {
          AsyncStorage.setItem(
            "profileType",
            responseJson.result[0].UserDetails[0].ProfileType.toString()
          );
          this.setState({
            id: responseJson.result[0].UserDetails[0]._id,
            userName: responseJson.result[0].UserDetails[0].UserName,
            dobFmt:
              responseJson.result[0].UserDetails[0].DOB != "null"
                ? responseJson.result[0].UserDetails[0].DOB
                : "",
            email:
              responseJson.result[0].UserDetails[0].Email != "null"
                ? responseJson.result[0].UserDetails[0].Email
                : "",
            name:
              responseJson.result[0].UserDetails[0].name == "null"
                ? ""
                : responseJson.result[0].UserDetails[0].name,
            profilePic:
              this.state.photo != "null" || null
                ? responseJson.result[0].UserDetails[0].ProfilePic
                : null,
            website:
              responseJson.result[0].UserDetails[0].Website == "null"
                ? ""
                : responseJson.result[0].UserDetails[0].Website,
            bio:
              responseJson.result[0].UserDetails[0].Bio == "null"
                ? ""
                : responseJson.result[0].UserDetails[0].Bio,
            location: responseJson.result[0].UserDetails[0].HomeLocation,
            gender:
              responseJson.result[0].UserDetails[0].Gender == "null"
                ? ""
                : responseJson.result[0].UserDetails[0].Gender,
          });
          this.GPRef?.current?.setAddressText(
            responseJson.result[0].UserDetails[0].HomeLocation
          );
        }
      })
      .catch((error) => {});
  };

  name = (text) => {
    this.setState({ name: text });
  };
  userName = (text) => {
    this.setState({ userName: text });
  };
  website = (text) => {
    this.setState({ website: text });
  };
  bio = (text) => {
    this.setState({ bio: text });
  };
  email = (text) => {
    this.setState({ email: text });
  };
  mobile = (text) => {
    this.setState({ mobile: text });
  };
  location = (text) => {
    this.setState({ location: text });
  };

  onDOBPress = () => {
    let dobDate = this.state.dobDate;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate,
      });
    }
    //To open the dialog
    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date(), //To restirct future date
    });
  };

  onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dobFmt: moment(date).format("DD-MMM-YYYY"),
    });
  };

  handleChoosePhoto = () => {
    // debugger;
    const options = {
      noData: true,
      rotation: 360,
      // isVertical: true,
      // originalRotation: 0,
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log("response", response);
      if (response.uri) {
        this.setState({
          photo: response.uri,
          photo1: response.path,
          fileName: response.fileName,
          fileType: response.type,
          visibleModal: null,
        });
      }
    });
  };

  handleChoosePhoto1 = () => {
    // debugger;
    const options = {
      noData: true,
      rotation: 360,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("response", response.path);
      if (response.uri) {
        this.setState({
          photo: response.uri,
          photo1: response.path,
          fileName: response.fileName,
          fileType: response.type,
          visibleModal: null,
        });
      }
    });
  };

  deleteProfilePhoto = () => {
    debugger;
    this.setState({
      photo: null,
      editPhoto: "Delete",
      visibleModal: null,
    });
    this.onLoad();
  };

  done(photo) {
    debugger;
    // console.log('the photo path',photo);
    this.setState({ isLoader: true });
    if (photo == null) {
      const url = serviceUrl.been_url + "/updatelist";
      const header = serviceUrl.headers;
      Common_Api.updateList._id = this.state.id;
      (Common_Api.updateList.name =
        this.state.name == "undefined" || null ? "" : this.state.name),
        (Common_Api.updateList.Website =
          this.state.website == "undefined" || null ? "" : this.state.website),
        (Common_Api.updateList.Bio =
          this.state.bio == "undefined" || null ? "" : this.state.bio),
        (Common_Api.updateList.Gender =
          this.state.gender == "undefined" || null ? "" : this.state.gender),
        (Common_Api.updateList.DOB =
          this.state.dobFmt == "undefined" || null ? "" : this.state.dobFmt);
      (Common_Api.updateList.HomeLocation =
        this.state.location == "undefined" || null ? "" : this.state.location),
        (Common_Api.updateList.ProfilePic =
          this.state.editPhoto == "Delete" ? "Delete" : this.state.editPhoto);
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo",
        },
        body: JSON.stringify(Common_Api.updateList),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(
            "if response ",
            responseJson.result[0] || responseJson.result
          );
          this.setState({ isLoader: false });
          if (responseJson.status == "True") {
            const result = responseJson.result[0] || responseJson.result;
            AsyncStorage.setItem(
              "website",
              invalidText(result?.Website) ? "" : result.Website
            );
            AsyncStorage.setItem(
              "bio",
              invalidText(result?.Bio) ? "" : result.Bio
            );
            AsyncStorage.setItem(
              "Originalname",
              invalidText(result?.name) ? "" : result.name
            );
            AsyncStorage.setItem(
              "DOB",
              invalidText(result?.DOB) ? "" : result.DOB
            );
            AsyncStorage.setItem(
              "name",
              invalidText(result?.UserName) ? "" : result.UserName
            );
            AsyncStorage.setItem(
              "homeLocation",
              invalidText(result?.HomeLocation) ? "" : result.HomeLocation
            );
            //toastMsg("success", "Details updated successfully")
            this.props.navigation.goBack();
          } else {
          }
        })
        .catch((error) => {
          console.log("Line nuber 176", error);
          this.setState({ isLoader: false });
        });
    } else {
      const url = serviceUrl.been_url1 + "/updateprofile";
      const data2 = new FormData();
      data2.append("ProfilePic", {
        uri: Platform.OS === "ios" ? photo : "file://" + this.state.photo1,
        name: this.state.fileName,
        type: this.state.fileType,
      });
      data2.append(
        "name",
        this.state.name == "undefined" || null ? "" : this.state.name
      );
      data2.append(
        "Website",
        this.state.website == "undefined" || null ? "" : this.state.website
      );
      data2.append(
        "Bio",
        this.state.bio == "undefined" || null ? "" : this.state.bio
      );
      data2.append(
        "Gender",
        this.state.gender == "undefined" || null ? "" : this.state.gender
      );
      data2.append(
        "DOB",
        this.state.dobFmt == "undefined" || null ? "" : this.state.dobFmt
      );
      data2.append(
        "_id",
        this.state.id == "undefined" || null ? "" : this.state.id
      );
      data2.append(
        "HomeLocation",
        this.state.location == "undefined" || null ? "" : this.state.location
      );
      fetch(url, {
        method: "POST",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo",
        },
        body: data2,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("else response ", responseJson);
          this.setState({ isLoader: false });
          if (responseJson.status == "True") {
            const result = responseJson.result[0] || responseJson.result;
            //toastMsg('success', responseJson.message)
            AsyncStorage.setItem(
              "ProfilePic",
              invalidText(result?.ProfilePic) ? "" : result.ProfilePic
            );
            AsyncStorage.setItem(
              "website",
              invalidText(result?.Website) ? "" : result.Website
            );
            AsyncStorage.setItem(
              "bio",
              invalidText(result?.Bio) ? "" : result.Bio
            );
            AsyncStorage.setItem(
              "Originalname",
              invalidText(result?.name) ? "" : result.name
            );
            AsyncStorage.setItem(
              "DOB",
              invalidText(result?.DOB) ? "" : result.DOB
            );
            this.props.navigation.goBack();
          } else {
            toastMsg("danger", responseJson.message);
          }
        })
        .catch((error) => {
          console.log("Line nuber 176", error);
          this.setState({ isLoader: false });
        });
    }
  }
  _onfocus = () => {
    this.setState({
      locationEditable: false,
      isPlacesModal: true,
    });
  };
  _handlePress = (data, details) => {
    // debugger;
    let addr = details.formatted_address.split(", ");
    let locName = addr[0],
      counName = addr[addr.length - 1];

    let lat = details.geometry ? details.geometry.location.lat : null,
      lng = details.geometry ? details.geometry.location.lng : null;
    var geom = {
      latitude: lat,
      longitude: lng,
    };

    this.setState({
      location: locName,
      country: counName,
      // isPlacesModal: false,
      coords: JSON.stringify(geom),
    });
    // Alert.alert("loc",JSON.stringify(locName))
  };

  onReadMoreClose = (isModal) => {
    // alert('as')
    this.setState({
      isPlacesModal: false,
      // locationEditable : true,
    });
  };

  renderRightImgdone() {
    const { isLoader } = this.state;
    return isLoader ? (
      <Loader size="small" />
    ) : (
      <View>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => this.done(this.state.photo)}
        >
          <Text
            onPress={() => this.done(this.state.photo)}
            style={Profile_Style.Done_txt}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  onFocusMethod() {
    this.setState({ visibleModal: 1 });
  }

  onFocusMethod = () => {
    this.setState({ isfocus: false });
  };

  googlePlcac() {
    alert("focused");
    alert(this.textInputRef.isFocused());
  }

  render() {
    const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: 0 }}
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <Container>
          <Toolbar
            {...this.props}
            centerTitle="  Edit Profile"
            rightImgView={this.renderRightImgdone()}
          />

          <View style={Profile_Style.Profile_Img_View}>
            {this.state.photo != null ? (
              <ImageBackground
                imageStyle={{ borderRadius: 50 }}
                source={{ uri: this.state.photo }}
                style={Profile_Style.Profile_Img}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ visibleModal: 1 })}
                >
                  <Badge
                    style={[Profile_Style.Badge_View, { alignItems: "center" }]}
                  >
                    <Text style={Profile_Style.Badge_txt}>+</Text>
                  </Badge>
                </TouchableOpacity>
              </ImageBackground>
            ) : this.state.profilePic != null ? (
              <ImageBackground
                imageStyle={{ borderRadius: 50 }}
                source={{ uri: serviceUrl.profilePic + this.state.profilePic }}
                style={Profile_Style.Profile_Img}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ visibleModal: 1 })}
                >
                  <Badge style={Profile_Style.Badge_View}>
                    <Text style={Profile_Style.Badge_txt}>+</Text>
                  </Badge>
                </TouchableOpacity>
              </ImageBackground>
            ) : (
              <ImageBackground
                source={require("../../Assets/Images/profile.png")}
                imageStyle={{ borderRadius: 50 }}
                style={Profile_Style.Profile_Img}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ visibleModal: 1 })}
                >
                  <Badge style={Profile_Style.Badge_View}>
                    <Text style={Profile_Style.Badge_txt}>+</Text>
                  </Badge>
                </TouchableOpacity>
              </ImageBackground>
            )}
          </View>
          <Modal
            isVisible={this.state.visibleModal === 1}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            onBackdropPress={() => this.setState({ visibleModal: null })}
            onBackButtonPress={() => this.setState({ visibleModal: null })}
          >
            <View style={common_styles.modalContent}>
              <StatusBar
                backgroundColor="rgba(0,0,0,0.7)"
                barStyle="light-content"
              />
              <View style={{ flexDirection: "row" }}>
                <Text
                  onPress={this.handleChoosePhoto}
                  style={[Profile_Style.modalTextView, { marginTop: 10 }]}
                >
                  Take New Photo
                </Text>
              </View>

              <View style={Profile_Style.horizontalSeparator} />
              <View style={{ flexDirection: "row" }}>
                <Text
                  onPress={this.deleteProfilePhoto}
                  style={[Profile_Style.modalTextView]}
                >
                  Delete Profile Photo
                </Text>
              </View>
              <View style={Profile_Style.horizontalSeparator} />
              <View style={{ flexDirection: "row" }}>
                <Text
                  onPress={this.handleChoosePhoto1}
                  style={[Profile_Style.modalTextView, { marginBottom: 10 }]}
                >
                  Choose Profile Photo
                </Text>
              </View>
            </View>
          </Modal>
          <Content>
            <TextInput
              label="Name"
              placeholderStyle={{
                fontWeight: "bold",
                fontSize: 20,
                color: "red",
              }}
              mode="outlined"
              value={this.state.name}
              onChangeText={this.name}
              autoCorrect={false}
              style={[common_styles.textInputSignUp, { width: "97%" }]}
              selectionColor={"#f0275d"}
              theme={{
                roundness: 10,
                colors: {
                  placeholder: "#000",
                  text: "#000",
                  primary: "#000",
                  underlineColor: "#000",
                  fontSize: 16,
                  paddingLeft: 5,
                },
              }}
            />

            <TextInput
              label="Username"
              mode="outlined"
              editable={false}
              value={this.state.userName}
              autoCorrect={false}
              style={[common_styles.textInputSignUp, { width: "97%" }]}
              selectionColor={"#f0275d"}
              theme={{
                roundness: 10,
                colors: {
                  placeholder: "#000",
                  text: "#000",
                  primary: "#000",
                  underlineColor: "#000",
                  fontSize: 16,
                  paddingLeft: 5,
                },
              }}
            />

            <TextInput
              label="Website"
              mode="outlined"
              value={this.state.website}
              onChangeText={this.website}
              autoCorrect={false}
              style={[common_styles.textInputSignUp, { width: "97%" }]}
              selectionColor={"#f0275d"}
              theme={{
                roundness: 10,
                colors: {
                  placeholder: "#000",
                  text: "#000",
                  primary: "#000",
                  underlineColor: "#000",
                  fontSize: 16,
                  paddingLeft: 5,
                },
              }}
            />

            <TextInput
              label="Bio"
              mode="outlined"
              multiline={true}
              maxLength={120}
              value={this.state.bio}
              onChangeText={this.bio}
              autoCorrect={false}
              style={
                (this.state.text == ""
                  ? common_styles.textInputNew
                  : [common_styles.textInputNew, { width: "97%" }],
                {
                //   height: "auto",
                  width: "97%",
                  alignSelf: "center",
                  backgroundColor: "#fff",
                  marginTop: 8,
                  marginBottom: 8,
                  fontSize: Common_Color.userNameFontSize,
                  fontFamily: Common_Color.fontLight,
                })
              }
              selectionColor={"#f0275d"}
              theme={{
                roundness: 10,
                colors: {
                  placeholder: "#000",
                  text: "#000",
                  primary: "#000",
                  underlineColor: "#000",
                  fontSize: 16,
                  paddingLeft: 5,
                },
              }}
            />

            <TextInput
              label="Email/Mobile"
              mode="outlined"
              editable={false}
              autoCorrect={false}
              value={this.state.email}
              style={[common_styles.textInputSignUp, { width: "97%" }]}
              selectionColor={"#f0275d"}
              theme={{
                roundness: 10,
                colors: {
                  placeholder: "#000",
                  text: "#000",
                  primary: "#000",
                  underlineColor: "#000",
                  fontSize: 16,
                  paddingLeft: 5,
                },
              }}
            />

            <TouchableOpacity onPress={() => this.refs.listmodal.open()}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#000",
                  marginTop: "4%",
                  backgroundColor: "#fff",
                  width: "97%",
                  height: 45,
                  alignSelf: "center",
                  borderRadius: 10,
                }}
              >
                <View style={{ bottom: 12, width: "96%" }}>
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 12,
                      backgroundColor: "#fff",
                      width: "14%",
                      marginLeft: 10,
                      marginTop: 2,
                    }}
                  >
                    {" "}
                    Gender
                  </Text>

                  {/* {this.state.gender !=  null || this.state.gender != null
                                    ?
                                    <Text style={{margin:5,paddingLeft:7 }}>{this.state.gender}</Text> : */}
                  <Text style={{ margin: 5, paddingLeft: 7 }}>
                    {this.state.gender}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* <View style={{ bottom: 12, width: '90%', marginTop: '5%', alignSelf: 'center', }}> */}
            <View
              style={{ width: dw, marginLeft: -3, marginTop: "5%", bottom: 12 }}
            >
              <Text
                style={{
                  position: "absolute",
                  top: 2,
                  zIndex: 1,
                  left: 20,
                  backgroundColor: "#fff",
                }}
              >
                {" "}
                {this.state.location}{" "}
              </Text>
              <GooglePlacesAutocomplete
                ref={this.GPREF}
                placeholder="Add Location"
                minLength={1}
                autoFocus={false}
                returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={"light"} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed={false} // true/false/undefined
                fetchDetails={true}
                // value={this.state.location}
                onChangeText={this.location}
                renderDescription={(row) => row.description} // custom description render
                onPress={(data, details = null) => {
                  this._handlePress(data, details);
                }}
                getDefaultValue={() => this.state.location}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: "AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20",
                  //our Key (Been) => AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20
                  //git key (Uber clone) => AIzaSyB1O8amubeMkw_7ok2jUhtVj9IkME9K8sc
                  language: "en", // language of the results
                  types: "", // default: 'geocode' || ,cities
                }}
                styles={searchInputStyle}
                currentLocation={false}
                currentLocationLabel="Current location"
                nearbyPlacesAPI="GooglePlacesSearch"
                GoogleReverseGeocodingQuery={{}}
                GooglePlacesSearchQuery={{
                  rankby: "distance,keyword,name",
                  type: "cafe",
                }}
                GooglePlacesDetailsQuery={{
                  fields: "formatted_address,name,geometry",
                }}
                filterReverseGeocodingByTypes={[
                  "country",
                  "locality",
                  "street_address",
                  "food",
                  "address",
                  "administrative_area_level_1",
                  "administrative_area_level_2",
                  "administrative_area_level_3",
                  "geometry",
                ]}
                debounce={200}
              />
            </View>
            {/* </View> */}

            <TouchableOpacity style={{}} onPress={this.onDOBPress.bind(this)}>
              {/* <TextInput
                                onPressIn= {this.onDOBPress.bind(this)}
                                editable={true}
                                label='Date of Birth'
                                mode="outlined"
                                autoCorrect={false}
                                value={this.state.dobFmt}
                                onChangeText={this.onDOBDatePicked}
                                style={[common_styles.textInputNew,{width:'97%',marginTop: '-2%',zIndex:0,...StyleSheet.absoluteFillObject}]}
                                selectionColor={'#f0275d'}
                                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />
                            <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} /> */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#000",
                  marginTop: "4%",
                  backgroundColor: "#fff",
                  width: "97%",
                  height: 45,
                  alignSelf: "center",
                  borderRadius: 10,
                }}
              >
                <View style={{ bottom: 12, width: "96%" }}>
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 12,
                      backgroundColor: "#fff",
                      width: "22%",
                      marginLeft: 10,
                      marginTop: 2,
                    }}
                  >
                    {" "}
                    Date of Birth
                  </Text>
                  <Text style={{ margin: 5, paddingLeft: 7 }}>
                    {this.state.dobFmt}
                  </Text>
                  <DatePickerDialog
                    ref="dobDialog"
                    onDatePicked={this.onDOBDatePicked.bind(this)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Content>

          <ModalBox
            style={{
              width: dw * 0.9,
              height: dh * 0.6,
              backgroundColor: "#00000000",
              alignItems: "center",
            }}
            position={"bottom"}
            ref={"listmodal"}
            entry="bottom"
            useNativeDriver={true}
            backButtonClose={true}
            animationDuration={100}
            swipeToClose={true}
          >
            <View
              style={{
                width: dw * 0.9,
                backgroundColor: "#FFF",
                justifyContent: "center",
                overflow: "hidden",
                alignItems: "center",
                borderRadius: 20,
              }}
            >
              <StatusBar
                backgroundColor="rgba(0,0,0,0.5)"
                barStyle="light-content"
              />
              <FlatList
                data={this.state.genderList}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => this.setSelectedValue(item)}>
                    <View
                      key={`id${index}`}
                      style={{ width: dw * 0.9, justifyContent: "center" }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          padding: 15,
                          fontSize: 16,
                          fontFamily: Common_Color.fontMedium,
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </ModalBox>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

const searchInputStyle = {
  textInputContainer: {
    width: "97%",
    backgroundColor: "rgba(0,0,0,0)",
    borderWidth: 0.7,
    borderColor: "#000",
    margin: 9,
    borderRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  description: {
    fontWeight: "bold",
    color: "#4c4c4c",
  },
  predefinedPlacesDescription: {
    // color: '#1faadb'
  },
  textInput: {
    // backgroundColor:'#c1c1c1',
    height: 33,
    fontSize: 14,
    paddingLeft: 0,
  },
};
