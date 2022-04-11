import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  BackHandler,
  Alert,
  Animated,
  ImageBackground,
  StyleSheet,
  StatusBar,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { PROVIDER_GOOGLE, Callout } from "react-native-maps";

import { Dstyles } from "./Styles";
import serviceUrl from "../../Assets/Script/Service";

let Common_Api = require("../../Assets/Json/Common.json");
const { height, width } = Dimensions.get("window");
import Stories from "../Story/Stories";
import Stories1 from "../Story/Stories1";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Modal from "react-native-modalbox";

import { getPixels } from "../_utils/CommonUtils";
import dummypic from "../../Assets/Images/profile.png";
//import { initiateChat } from "../Chats/chatHelper";

var screenName = Map;
var setTimeOut;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 5;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
//longitudeDelta
//latitudeDelta
//let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)

const initialViewPort = [
  {
    latitude: 37.114508,
    longitude: 75.533515,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  {
    latitude: 3.257575,
    longitude: 77.340507,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  {
    latitude: 28.045189,
    longitude: 100.832472,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  {
    latitude: 24.930805,
    longitude: 61.803493,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
];

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      statusLists: "",
      openPanel: false,
      move: true,
      gestureName: "none",
      markers: [],
      mWc: initialViewPort,
      backgroundColor: "transparent",
      isModelOpen: false,
      reqCount: 0,
      notificationCount: 0,
      swipeOpened: false,
    };
    this.map = null;
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    //initiateChat();
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        // this.getStory();
        // this.getCount();
      }
    );
  }

  componentWillUnmount() {
    this.onLayout();
    this.map = null;
    if (setTimeOut) {
      clearTimeout(setTimeOut);
    }
  }

  handleBackButton = () => {
    Alert.alert(
      "Exit Application",
      "Are you sure  want to Exit ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      }
    );
    return true;
  };

  getStory = async () => {
    //debugger;
    console.log("after called from story redirection");
    this.setState({ isLoader: true });
    var id = await AsyncStorage.getItem("userId");
    Common_Api.PostUserId.userId = id;
    const url = serviceUrl.been_url1 + "/GetStoryList";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo",
      },
      body: JSON.stringify(Common_Api.PostUserId),
    })
      .then(async (response) => response.json())
      .then(async (responseJson) => {
        const type = typeof responseJson.userStory[0].UserProfilePic
        if (responseJson.status == "True") {
          AsyncStorage.setItem(
            "ProfilePic", type == 'object' ? "null" : responseJson.userStory[0].UserProfilePic
          );
          
          // console.log("resultts", responseJson.result);
          let markersWithCords = [];
          let coords =
            responseJson.result.length > 0 &&
            responseJson.result.map((m, i) => {
              console.log("the coorde", m.coords);
              console.log("the type ==> ", typeof m.coords);
              let c = m.coords ? m.coords : null;
              console.log("the cc ==>", c);
              if (c != null) {
                m.coordinates = {
                  latitude: c.latitude,
                  longitude: c.longitude,
                };
                markersWithCords[i] = {
                  latitude: c.latitude,
                  longitude: c.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                };
              }
              m.userPic =
                m.UserProfilePic == null || m.UserProfilePic == "null"
                  ? dummypic
                  : { uri: serviceUrl.profilePic + m.UserProfilePic };
              m.storyId = m._id;
              m.isSeen = false;

              return m;
            });

          console.log("the final coords", coords);
          if (coords != false) {
            this.setState({ markers: coords, mWc: markersWithCords }, () => {
              this.onLayout();
            });
          }
        } else {
          this.setState({ isLoader: false });
          //toastMsg('danger', response.data.message)
        }
      })
      .catch(function(error) {
        console.log(error);
        this.setState({ isLoader: false });
        //toastMsg('danger', 'Sorry..something network error.Please try again.')
      });
  };

  onLayout = () => {
    debugger
    if (this.state.mWc.length != 0 && this.map !== null) {
      console.log("the cakks markers", this.state.mWc);
      const nextTick = new Promise((resolve) => setTimeout(resolve, 0));
      nextTick.then(() => {
        setTimeOut = setTimeout(() => {
          if (this.map !== null) {
            this.map.fitToCoordinates(this.state.mWc, {
              edgePadding: {
                right: getPixels(80),
                left: getPixels(80),
                top: getPixels(80),
                bottom: getPixels(80),
              },
              animated: true,
            });
          }
        }, 500);
      });
    }
  };

  async getCount() {
    var data = { userId: await AsyncStorage.getItem("userId") };
    const url = serviceUrl.been_url1 + "/ReqList";
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
        this.setState({
          notificationCount: responseJson.NotificationCount,
          reqCount: responseJson.ReqCount,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  profileChanger = async () => {
    let local;
    let businessProfile;

    var data = { userId: await AsyncStorage.getItem("userId") };
    const getType = await AsyncStorage.getItem("profileType");
    const pType = parseInt(getType);
    const localP = await AsyncStorage.getItem("localProfile");
    console.log("the ptype ", getType, " and its type ", typeof pType);

    if (localP && localP == "Yes") {
      this.props.navigation.navigate("LocalUserProfile");
    } else if (pType === 2) {
      this.props.navigation.navigate("BusinessPlaceProfile");
    } else {
      console.log("the ptype ", pType, " and its type profile1 ", typeof pType);
      this.props.navigation.navigate("Profile");
    }
  };

  addStories() {
    this.props.navigation.navigate("Camera1");
  }
  Profile() {
    this.props.navigation.navigate("Profile");
  }
  Story() {
    this.props.navigation.navigate("Newsfeed");
  }
  notification() {
    this.props.navigation.navigate("Notifications");
  }
  localProfile() {
    this.props.navigation.navigate("User_profile");
  }
  planner() {
    this.props.navigation.navigate("Planner");
  }

  newsFeed(statusDetails) {
    var data = { storiesData: statusDetails };
    this.props.navigation.navigate("StoryRead", { data: data });
  }

  // _animatedValue = new Animated.Value(0);

  // _panResponderUp = PanResponder.create({
  //   onMoveShouldSetPanResponder: (evt, gestureState) => {
  //     if (this.state.move) {
  //       return true;
  //     }
  //     return false;
  //   },
  //   onPanResponderMove: (evt, gestureState) => {
  //     console.log("onPanResponderMove met");
  //     this._animatedValue.setValue(gestureState.moveY);
  //   },
  //   onPanResponderTerminationRequest: (evt, gestureState) => true,
  //   onPanResponderRelease: (evt, gestureState) => {
  //     if (Math.floor(gestureState.moveY) >= 10) {
  //       // console.log('condit met')
  //       this.toggleDetails(true);
  //     } else {
  //       // console.log('else met')
  //       Animated.timing(this._animatedValue, {
  //         toValue: 0,
  //         duration: 250,
  //         useNativeDriver: true,
  //       }).start();
  //     }
  //   },
  //   onPanResponderTerminate: (evt, gestureState) => {
  //     Animated.timing(this._animatedValue, {
  //       toValue: 0,
  //       duration: 250,
  //       useNativeDriver: true,
  //     }).start();
  //   },
  // });

  onReadMoreClose = (isModal) => {
    this.setState({
      isModelOpen: isModal,
      swipeOpened: false,
    });
  };

  newsFeed(statusDetails) {
    debugger;
    var data = { storiesData: statusDetails };
    this.props.navigation.navigate("StoryRead", { data: data });
  }

  toggleDetails = (shouldOpen) => {
    this.setState({
      isModelOpen: shouldOpen,
      swipeOpened: true,
    });
  };
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    //translucent
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />

        {/* <StatusBar backgroundColor="#FFF" barStyle='dark-content' /> */}
        <View style={{ height: "100%" }}>
          <MapView
            ref={(el) => (this.map = el)}
            // ref={(ref) => { this.map = ref }}
            style={styles.map}
            rotateEnabled={false}
            followUserLocation={true}
            zoomEnabled={true}
            showsUserLocation={true}
            showsCompass={true}
            customMapStyle={Dstyles.mapStyle}
            moveOnMarkerPress={true}
            // onMapReady = {this.onLayout}
            onLayout={this.onLayout}
            // onRegionChangeComplete={this.handleRegionChange} //onchangeRegion
          >
            {/* {this.state.markers.length > 0 &&
              this.state.markers.map((marker, index) => (
                
                <MapView.Marker
                  key={index}
                  identifier={`id${index}`}
                  coordinate={marker.coordinates}
                > */}
                  {/* {console.log('isseen' + marker.isSeen)} */}
                  {/* {marker.isSeen === true ? (
                    <View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          width: 100,
                          height: 100,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      > */}
                        {/* <ImageBackground
                          source={require("../../Assets/Images/loc_marker_seen.png")}
                          style={{
                            width: 41,
                            height: 45,
                            justifyContent: "center",
                          }}
                          resizeMode={"stretch"}
                        >
                          <Image
                            source={marker.userPic}
                            style={{
                              height: 35,
                              width: 35,
                              borderRadius: 35,
                              marginLeft: "7%",
                              marginBottom: "12%",
                            }}
                            resizeMode={"cover"}
                          />
                        </ImageBackground>
                      </View>
                    </View> */}
                  {/* ) : (
                    <View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          width: 100,
                          height: 100,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ImageBackground
                          source={require("../../Assets/Images/loc_marker_unseen.png")}
                          style={{
                            width: 41,
                            height: 45,
                            justifyContent: "center",
                          }}
                          resizeMode={"stretch"}
                        >
                          <Image
                            source={marker.userPic}
                            style={{
                              height: 35,
                              width: 35,
                              borderRadius: 35,
                              marginLeft: "7%",
                              marginBottom: "12%",
                            }}
                            resizeMode={"cover"}
                          />
                        </ImageBackground>
                      </View>
                    </View>
                  )}
                </MapView.Marker>
              ))} */}
          </MapView>
          <View
            style={[styles.mapDrawerOverlayLeft]}
            //{...this._panResponder.panHandlers}
          />
          <View
            style={[styles.mapDrawerOverlayRight]}
            //{...this._panResponder1.panHandlers}
          />
          <View
            style={[styles.mapDrawerOverlayUp]}
            // {...this._panResponderUp.panHandlers}
          />
          {/*Transparnt  #0000 */}
          <View
            style={{
              width: 50,
              height: 50,
              alignSelf: "flex-end",
              marginTop: "5%",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("ChatUserList", {
                  origin: "map",
                })
              }
              style={{ alignSelf: "center", marginRight: 25 }}
            >
              <Image
                source={require("../../Assets/Images/sendButtons.png")}
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: "flex-end",
                  margin: 15,
                }}
              />
              {/* <View style={{ width: 20, height: 20, backgroundColor: '#e80c68', position: 'absolute', right: 10, top: 12,borderRadius: 10  }}>
              <Text style={{ textAlign: 'center', color: '#fff', alignSelf: 'center', fontSize: 8, position: 'absolute', top: 4 }}>
                0
              </Text>
            </View> */}
            </TouchableOpacity>
          </View>
          <View
            style={{ bottom: 30, position: "absolute", alignSelf: "flex-end" }}
          >
            <TouchableOpacity
              style={{ width: 85, height: 50, justifyContent: "center" }}
              onPress={() => this.localProfile()}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 48 / 2,
                  backgroundColor: "#FFF",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginLeft: 5,
                  shadowColor: "#000000",
                  shadowOpacity:Platform.OS === 'ios' ? 0.5 : 1,
                  shadowRadius:Platform.OS === 'ios' ? 2 :  10,
                  shadowOffset: { height:Platform.OS === 'ios' ? 0: 5, width:Platform.OS === 'ios' ? 0: 5 },
                  elevation: Platform.OS === 'ios' ? 1: 2,
                }}
              >
                <Image
                  source={require("../../Assets/Images/local_profile.png")}
                  style={{
                    width: 35,
                    height: 35,
                    alignSelf: "center",
                    marginRight: 5,
                  }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.planner()}>
              <View>
                <Image
                  source={require("../../Assets/Images/Planner.png")}
                  style={{
                    width: 50,
                    height: 50,
                    alignSelf: "flex-end",
                    margin: 15,
                    marginBottom: 0,
                  }}
                />
                {this.state.reqCount != 0 ? (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#e80c68",
                      position: "absolute",
                      right: 10,
                      top: 12,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        alignSelf: "center",
                        fontSize: 8,
                        position: "absolute",
                        top: 4,
                      }}
                    >
                      {this.state.reqCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.notification()}>
              <View>
                <Image
                  source={require("../../Assets/Images/Notification.png")}
                  style={{
                    width: 50,
                    height: 50,
                    alignSelf: "flex-end",
                    margin: 15,
                    marginBottom: 0,
                  }}
                />
                {this.state.notificationCount != 0 ? (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#e80c68",
                      position: "absolute",
                      right: 10,
                      top: 12,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        alignSelf: "center",
                        fontSize: 8,
                        position: "absolute",
                        top: 4,
                      }}
                    >
                      {this.state.notificationCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.profileChanger()}>
              <Image
                source={require("../../Assets/Images/Traveler.png")}
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: "flex-end",
                  margin: 15,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              bottom: 40,
              position: "absolute",
              width:48,
              height:48,
              borderRadius: 48/ 2,
              overflow:'hidden',
              justifyContent: "center",
              marginLeft: 10,
            }}
          >
            <TouchableOpacity
              style={{ width: "100%", height: "100%" }}
              onPress={() => this.addStories()}
            >
              <Image
                source={require("../../Assets/Images/Home_add_story.png")}
                style={{ width:50, height:50,overflow:'hidden'  }}
                resizeMode={"stretch"}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{ bottom: 15, position: "absolute", alignSelf: "center" }}
          >
            <TouchableOpacity
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
                marginTop: 20,
                backdropColor: "grey",
              }}
              onPress={() => {
                this.toggleDetails(true);
              }}
            >
              {!this.state.swipeOpened && (
                <Image
                  source={require("../../Assets/Images/backArrow.png")}
                  style={{
                    width: 25,
                    height: 25,
                    alignSelf: "flex-start",
                    transform: [{ rotate: "90deg" }],
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          style={styles.modal}
          position="bottom"
          isOpen={this.state.isModelOpen}
          // swipeToClose = {false}
          onClosed={() => this.onReadMoreClose(false)}
          backdropColor="transparent"
        >
          <View style={styles.bar} />
          {/* <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" /> */}
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              justifyContent: "center",
              alignSelf: "center",
              alignContent: "center",
            }}
            onPress={() => this.setState({ isModelOpen: false })}
          >
            <Image
              source={require("../../Assets/Images/backArrow.png")}
              style={{
                width: 20,
                height: 20,
                justifyContent: "center",
                alignSelf: "center",
                alignContent: "center",
                transform: [{ rotate: "-90deg" }],
              }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <ScrollView
              horizontal={true}
              // style={{backgroundColor:'rgba(0,0,0,0.5)',}}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                paddingStart: 5,
                paddingEnd: 5,
              }}
            >
              <Stories1 navigation={this.props.navigation} /> 
              <Stories navigation={this.props.navigation} />
            </ScrollView>
          </View>
          {/* </View> */}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  mapStyle: {
    backgroundColor: "#fff",
  },
  circle: {
    width: wp("100%"),
  },
  calloutView1: { width: "100%", height: hp("20%"), flexDirection: "row" },
  imageStyle: { height: 40, width: 40, borderRadius: 35 },
  imageStyle1: { height: 44, width: 44, borderRadius: 35 },
  subView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#b0cae0",
    height: 195,
    borderRadius: 25,
  },
  closeButtonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 12,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#b0cae0",
  },

  bottomContainer: {
    flex: 1,
    width: wp("100%"),
    justifyContent: "space-between",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  mapDrawerOverlayLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.5,
    height: Dimensions.get("window").height,
    width: wp("10%"),
    backgroundColor: "#00000000",
  },
  mapDrawerOverlayRight: {
    position: "absolute",
    right: 0,
    top: 0,
    opacity: 0.5,
    height: Dimensions.get("window").height,
    width: wp("10%"),
    backgroundColor: "#00000000",
  },
  mapDrawerOverlayUp: {
    position: "absolute",
    // top: hp(92.5),
    bottom: 0,
    opacity: 0.5,
    height: hp(6),
    width: wp("100%"),
    backgroundColor: "#00000000",
  },

  swipesGestureContainer: {
    height: "100%",
    width: "100%",
  },
  modal: {
    width: window.width,
    height: "31%",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    borderTopWidth: 30,
    borderTopColor: "transparent",
  },
  bar: {
    alignSelf: "center",
  },
});
