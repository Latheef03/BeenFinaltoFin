import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ToastAndroid,
  Platform,
  BackHandler,
  TextInput,
  KeyboardAvoidingView,
  FlatList
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from "react-native-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {
  Header,
  Container,
  Footer,
  FooterTab,
  Content,
  Button,
  Spinner,
  Toast
} from "native-base";
import { Dropdown } from "react-native-material-dropdown";
const { width } = Dimensions.get("window");
import { toastMsg } from "./assets/scripts/helper";
import { Slider } from "react-native-elements";
import serviceUrl from "./../component/assets/scripts/service";
import Family from "./assets/styles/family";
import family from "./assets/styles/family";

const myself = [
  {
    value: "Myself"
  },
  {
    value: "Family&Friends"
  }
];
const partner = [
  {
    label: "Partner Looking For",
    value: "Partner Looking For"
  },
  {
    label: "Friends Looking For",
    value: "Friends Looking For"
  }
];
const gender = [
  {
    value: "Male"
  },
  {
    value: "Female"
  }
];

const job = [
  { value: "Actor" },
  { value: "Crew" },
  { value: "Doctor" },
  { value: "Engineer" }
];
const education = [
  { value: "Masters" },
  { value: "Bachelor" },
  { value: "Diploma" },
  { value: "Engineer" }
];
const countryLiving = [
  { value: "India" },
  { value: "USA" },
  { value: "British" },
  { value: "Europe" }
];
const ethnicity = [
  { value: "Indian" },
  { value: "American" },
  { value: "European" }
];
export default class SearchFilter extends Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this.state = {
      value: 50,
      partnerLookingFor: "",
      mySelf: "",
      partner: "",
      gender: "",
      job: "",
      education: "",
      countryLivingIn: "",
      ethnicity: "",
      distance: "",
      distance1: 20,
      minDistance: 0,
      maxDistance: 100,
      distance2: 25,
      minDistance2: 18,
      maxDistance2: 90,
      searchResult: "",
      nameStore: "",
      flatlistMethod: false,
      jobsNameData: [],
      nameData: [],
      educationsNameData: [],
      countrylivinginsNameData: [],
      ethnicitiesNameData: [],
      countryNameData: []
    };
    this.arrayholder = [];
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }

  backPressed = () => {
    this.props.navigation.goBack();
    return true;
  };

  partnerLookingFor = value => {
    this.setState({
      partnerLookingFor: value
    });
  };
  mySelf = value => {
    this.setState({
      mySelf: value
    });
  };
  gender = value => {
    this.setState({
      gender: value
    });
  };
  job = value => {
    this.setState({
      job: value
    });
  };
  education = value => {
    this.setState({
      education: value
    });
  };
  countryLivingIn = value => {
    this.setState({
      countryLivingIn: value
    });
  };
  ethnicity = value => {
    this.setState({
      ethnicity: value
    });
  };

  JobStatusApi() {
   // debugger;
    fetch("http://18.204.139.44:3003/JobStatus", {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.result);
        this.setState({
          jobsNameData: res.result
        });
      })

      .catch(function(error) {
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  NationalityStatusApi() {
    fetch("http://18.204.139.44:3003/NationalityStatus", {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.result);
        this.setState({
          nameData: res.result
        });
      })

      .catch(function(error) {
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  EducationStatusApi() {
    fetch("http://18.204.139.44:3003/EducationStatus", {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.result);
        this.setState({
          educationsNameData: res.result
        });
      })

      .catch(function(error) {
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  CountryLivingInStatusApi() {
    fetch("http://18.204.139.44:3003/CountryLivingInStatus", {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.result);
        this.setState({
          countrylivinginsNameData: res.result
        });
      })

      .catch(function(error) {
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  EthinicityApi() {
    fetch("http://18.204.139.44:3003/Ethinicity", {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.result);
        this.setState({
          ethnicitiesNameData: res.result
        });
      })

      .catch(function(error) {
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  countryApi() {
    fetch("http://18.204.139.44:3003/country", {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.result);
        this.setState({
          countryNameData: res.result
        });
      })

      .catch(function(error) {
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  dashboard() {
    this.props.navigation.navigate("Dashboard");
  }
  suggests() {
    this.props.navigation.navigate("Suggestions");
  }
  chat() {
    this.props.navigation.navigate("Chats");
  }
  notifications() {
    this.props.navigation.navigate("Notifications");
  }

  lifePartners() {
    this.props.navigation.navigate("LifePartners");
  }
  searchFilter() {
    this.props.navigation.navigate("SearchResults");
  }
  flat = text => {
    if (this.state.flatlistMethod === false) {
      this.setState({
        flatlistMethod: true
      });
    } else {
      this.setState({
        flatlistMethod: false
      });
    }
  };
  componentWillMount() {
   // debugger;

    this.JobStatusApi();
    this.NationalityStatusApi();
    this.EducationStatusApi();
    this.CountryLivingInStatusApi();
    this.EthinicityApi();
    this.countryApi();

    BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    this.ConnectedFamilyList();
  }
  otherDash(otherDash) {
    AsyncStorage.setItem("other_id", otherDash._id);
    this.props.navigation.navigate("Other_Users_Dashboard");
  }
  selectId(newData) {
    AsyncStorage.setItem("tagid", newData._id);
    this.setState({
      nameStore: newData.name,
      flatlistMethod: false
    });
  }

  ConnectedFamilyList = async () => {
    this.setState({
      isLoading: true
    });
    var id1 = await AsyncStorage.getItem("_id");
    var data = {
      userId: id1
    };
    var base_url = serviceUrl.end_user + "/FriendsAndFamilyList";
    console.log(data);
    fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTUyNDczOTQxfQ.RMCTA6kusTuGAmKqN12ByEgAlu0m3Un18NEQejSmFz4"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            searchResult: responseJson.result
          }
          // function () {
          //     this.arrayholder = responseJson.result;
          // }
        );
      })
      .catch(function(error) {
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  };

  createData() {
    return this.state.jobsNameData.map(el => ({ value: el.jobsName }));
  }

  createData1() {
    return this.state.nameData.map(el => ({ value: el.name }));
  }

  createData2() {
    return this.state.educationsNameData.map(el => ({
      value: el.educationsName
    }));
  }
  createData3() {
    return this.state.countrylivinginsNameData.map(el => ({
      value: el.countrylivinginsName
    }));
  }

  createData4() {
    return this.state.ethnicitiesNameData.map(el => ({
      value: el.ethnicitiesName
    }));
  }
  createData5() {
    return this.state.countryNameData.map(el => ({ value: el.countryName }));
  }

  addSearchData = async () => {
    var id1 = await AsyncStorage.getItem("_id");
    var data = {
      userId: id1,
      partnerfor:
        this.state.nameStore == "undefined" || null ? "" : this.state.nameStore,
      searchType:
        this.state.partner == "undefined" || null ? "" : this.state.partner,
      gender: this.state.gender == "undefined" || null ? "" : this.state.gender,
      job: this.state.job == "undefined" || null ? "" : this.state.job,
      distance:
        this.state.distance1 == "undefined" || null ? "" : this.state.distance1,
      age:
        this.state.distance2 == "undefined" || null ? "" : this.state.distance2,
      education: this.state.education == "" || null ? "" : this.state.education,
      countryLiving:
        this.state.countryLivingIn == "undefined" || null
          ? ""
          : this.state.countryLivingIn,
      ethnicity:
        this.state.ethnicity == "undefined" || null ? "" : this.state.ethnicity
    };
    var method = serviceUrl.method;
    var headers = serviceUrl.headers;
    var base_url = serviceUrl.end_user + "/AddSearchData";

    fetch(base_url, { method, headers, body: JSON.stringify(data) })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "True") {
          //toastMsg("success", responseJson.message);
          this.props.navigation.navigate("SearchResults");
        } else {
          //toastMsg("danger", responseJson.message);
        }
      })

      .catch(function(error) {
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
        this.setState({ isLoading: false });
      });
  };

  render() {
    const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
    const { value } = this.state;
    const jobsNameData = this.createData();
    const nameData = this.createData1();
    const educationsNameData = this.createData2();
    const countrylivinginsNameData = this.createData3();
    const ethnicitiesNameData = this.createData4();
    const countryNameData = this.createData5();

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <Container>
          <Header style={{ height: 80 }}>
            <View style={styles.textWrapper}>
              <ImageBackground
                style={{ width: "100%", height: "100%" }}
                source={require("./images/Mask.png")}
              >
                <View
                  style={{
                    width: wp("100%"),
                    height: hp("100%"),
                    flexDirection: "row",
                    marginTop: "3%"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <Image
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 20,
                        marginTop: 20
                      }}
                      source={require("./images/back_arrow.png")}
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      width: 20,
                      flex: 1,
                      flexDirection: "row",
                      marginLeft: "25%",
                      marginTop: "5%"
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        fontFamily: "ProximaNovaAltBold",
                        fontSize: 20
                      }}
                    >
                      Search Settings
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </Header>
          <Content>
            <ScrollView>
              <View style={styles.RectangleShapeView}>
                <View style={styles.container4}>
                  <Dropdown
                    style={{
                      fontFamily: "ProximaNova-Regular",
                      fontSize: 14,
                      textAlign: "center"
                    }}
                    containerStyle={{
                      width: "75%",
                      height: 50,
                      paddingLeft: 4
                    }}
                    itemTextStyle={{
                      margin: "auto",
                      textAlign: "center",
                      marginTop: 10
                    }}
                    placeholder=" Partner Looking For"
                    placeholderTextColor="#000"
                    dropdownPosition={0}
                    data={partner}
                    onChangeText={partner => this.setState({ partner })}
                  />
                </View>

                {/* <View style={styles.container5}>
                                    <Dropdown
                                        style={{ fontFamily: 'ProximaNova-Regular', fontSize: 14, textAlign: 'center' }}
                                        containerStyle={{ width: '75%', height: 50, paddingLeft: 4 }}
                                        itemTextStyle={{ margin: "auto", textAlign: 'center', marginTop: 10, }}
                                        placeholder='Myself'
                                        placeholderTextColor="#000"
                                        dropdownPosition={0}
                                        data={myself}
                                        onChangeText={(mySelf) => this.setState({ mySelf })} />
                                </View> */}

                <View>
                  <View style={styles.container5}>
                    <TouchableOpacity onPress={() => this.flat()}>
                      <TextInput
                        style={{
                          fontFamily: "ProximaNova-Regular",
                          fontSize: 14,
                          marginTop: 25,
                          height: 50,
                          paddingLeft: 4,
                          width: "65%"
                        }}
                        // onChangeText={this.flat}
                        value={this.state.nameStore}
                        placeholder="Myself"
                        underlineColorAndroid="transparent"
                        editable={false}
                        autoCorrect={false}
//  keyboardType="visible-password"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* { this.state.searchResult !="" || null || undefined ?
                                // <View style={{ flex: 1, flexDirection: "row", width: wp("100%"),backgroundColor:'grey',marginTop:10,height:'100%'}}>
                                    */}

              {this.state.flatlistMethod === true ? (
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <FlatList
                    style={{ borderRadius: 120 }}
                    data={this.state.searchResult}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          width: wp("50%"),
                          margin: 10,
                          marginLeft: 180
                        }}
                      >
                        <TouchableOpacity
                          style={{ width: "100%" }}
                          onPress={() => this.selectId(item)}
                        >
                          <TouchableOpacity
                            onPress={() => this.otherDash(item)}
                          >
                            <Image
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 40 / 2
                              }}
                              source={{
                                uri:
                                  "http://18.204.139.44/Yaass/uploads/" +
                                  item.singlePic
                              }}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              marginLeft: 60,
                              marginTop: -35,
                              fontSize: 16
                            }}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              ) : null}

              {/* </View> : null} */}

              <View style={[styles.RectangleShapeView1, { marginTop: 40 }]}>
                <View style={{ width: wp("10%") }}></View>
                <View style={{ width: wp("35%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    Gender
                  </Text>
                </View>
                <View style={styles.container6}>
                  <Dropdown
                    style={{
                      fontFamily: "ProximaNova-Regular",
                      fontSize: 14,
                      textAlign: "center"
                    }}
                    containerStyle={{
                      width: "70%",
                      height: 50,
                      paddingLeft: 8
                    }}
                    itemTextStyle={{ margin: "auto", textAlign: "center" }}
                    placeholder="Gender"
                    placeholderTextColor="#000"
                    dropdownPosition={0}
                    data={gender}
                    onChangeText={gender => this.setState({ gender })}
                  />
                </View>
              </View>

              <View style={[styles.RectangleShapeView1, { marginTop: 40 }]}>
                <View style={{ width: wp("10%") }}></View>
                <View style={{ width: wp("35%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    Search Distance:
                  </Text>
                </View>

                <View style={{ width: wp("22%") }}></View>
                <View style={{ width: wp("30%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    {this.state.distance1 + "km."}
                  </Text>
                </View>
              </View>

              <View style={[styles.RectangleShapeView1, { marginTop: 30 }]}>
                <Slider
                  style={{
                    marginTop: 10,
                    justifyContent: "center",
                    width: "80%",
                    marginLeft: 35
                  }}
                  thumbTintColor="#fefefe"
                  maximumTrackTintColor="#f2f2f2"
                  minimumTrackTintColor="#4c98f9"
                  thumbStyle={{
                    shadowColor: "#000",
                    shadowRadius: 10,
                    shadowOpacity: 1,
                    elevation: 8,
                    shadowOffset: { width: 0, height: 4 }
                  }}
                  step={1}
                  minimumValue={this.state.minDistance}
                  maximumValue={this.state.maxDistance}
                  value={this.state.distance1}
                  onValueChange={val => this.setState({ distance1: val })}
                  // step={0}
                  // maximumValue={100}
                  // value={value}
                  trackStyle={{ height: 7 }}
                />
              </View>

              <View style={[styles.RectangleShapeView1, { marginTop: 40 }]}>
                <View style={{ width: wp("10%") }}></View>
                <View style={{ width: wp("35%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    Show Ages:
                  </Text>
                </View>

                <View style={{ width: wp("22%") }}></View>
                <View style={{ width: wp("30%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    18-{this.state.distance2}
                  </Text>
                </View>
              </View>

              <View style={[styles.RectangleShapeView1, { marginTop: 30 }]}>
                <Slider
                  style={{
                    marginTop: 10,
                    justifyContent: "center",
                    width: "80%",
                    marginLeft: 35
                  }}
                  thumbTintColor="#fefefe"
                  maximumTrackTintColor="#f2f2f2"
                  minimumTrackTintColor="#4c98f9"
                  thumbStyle={{
                    shadowColor: "#000",
                    shadowRadius: 10,
                    shadowOpacity: 1,
                    elevation: 8,
                    shadowOffset: { width: 0, height: 4 }
                  }}
                  step={1}
                  minimumValue={this.state.minDistance2}
                  maximumValue={this.state.maxDistance2}
                  value={this.state.distance2}
                  onValueChange={val => this.setState({ distance2: val })}
                  trackStyle={{ height: 7 }}
                />
              </View>

              <View style={[styles.RectangleShapeView1, { marginTop: 40 }]}>
                <View style={{ width: wp("10%") }}></View>
                <View style={{ width: wp("35%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    Job
                  </Text>
                </View>
                <View style={styles.container6}>
                  <Dropdown
                    style={{
                      fontFamily: "ProximaNova-Regular",
                      fontSize: 14,
                      textAlign: "center"
                    }}
                    containerStyle={{
                      width: "70%",
                      height: 50,
                      paddingLeft: 8
                    }}
                    itemTextStyle={{ margin: "auto", textAlign: "center" }}
                    placeholder="Actor"
                    placeholderTextColor="#000"
                    dropdownPosition={0}
                    data={jobsNameData}
                    onChangeText={job => this.setState({ job })}
                  />
                </View>
              </View>

              <View style={[styles.RectangleShapeView1, { marginTop: 40 }]}>
                <View style={{ width: wp("10%") }}></View>
                <View style={{ width: wp("35%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    Education
                  </Text>
                </View>
                <View style={styles.container6}>
                  <Dropdown
                    style={{
                      fontFamily: "ProximaNova-Regular",
                      fontSize: 14,
                      textAlign: "center"
                    }}
                    containerStyle={{
                      width: "70%",
                      height: 50,
                      paddingLeft: 8
                    }}
                    itemTextStyle={{ margin: "auto", textAlign: "center" }}
                    placeholder="Masters"
                    placeholderTextColor="#000"
                    dropdownPosition={0}
                    data={educationsNameData}
                    onChangeText={education => this.setState({ education })}
                  />
                </View>
              </View>

              <View style={[styles.RectangleShapeView1, { marginTop: 40 }]}>
                <View style={{ width: wp("10%") }}></View>
                <View style={{ width: wp("35%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    Country Living In
                  </Text>
                </View>
                <View style={styles.container6}>
                  <Dropdown
                    style={{
                      fontFamily: "ProximaNova-Regular",
                      fontSize: 14,
                      textAlign: "center"
                    }}
                    containerStyle={{
                      width: "70%",
                      height: 50,
                      paddingLeft: 8
                    }}
                    itemTextStyle={{ margin: "auto", textAlign: "center" }}
                    placeholder="USA"
                    placeholderTextColor="#000"
                    dropdownPosition={0}
                    data={countrylivinginsNameData}
                    onChangeText={countryLivingIn =>
                      this.setState({ countryLivingIn })
                    }
                  />
                </View>
              </View>

              <View
                style={[
                  styles.RectangleShapeView1,
                  { marginTop: 40, marginBottom: 20 }
                ]}
              >
                <View style={{ width: wp("10%") }}></View>
                <View style={{ width: wp("35%") }}>
                  <Text
                    style={{
                      marginTop: 25,
                      fontFamily: "ProximaNova-Regular",
                      color: "#000"
                    }}
                  >
                    Ethnicity
                  </Text>
                </View>
                <View style={styles.container6}>
                  <Dropdown
                    style={{
                      fontFamily: "ProximaNova-Regular",
                      fontSize: 14,
                      textAlign: "center"
                    }}
                    containerStyle={{
                      width: "70%",
                      height: 50,
                      paddingLeft: 8
                    }}
                    itemTextStyle={{ margin: "auto", textAlign: "center" }}
                    placeholder="India"
                    placeholderTextColor="#000"
                    dropdownPosition={0}
                    data={ethnicitiesNameData}
                    onChangeText={ethnicity => this.setState({ ethnicity })}
                  />
                </View>
              </View>

              <View
                style={{
                  width: "90%",
                  height: 30,
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 16,
                  marginBottom: 2,
                  marginLeft: "5%"
                }}
              >
                <TouchableOpacity
                  style={{ width: "100%" }}
                  style={styles.submit}
                  underlayColor="#fff"
                >
                  <Text style={styles.submitText}>
                    Don't Accept Invites From
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: "100%",
                  height: 30,
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 16,
                  marginBottom: 30
                }}
              >
                <TouchableOpacity onPress={() => this.addSearchData()}>
                  <LinearGradient
                    start={{ x: 0, y: 0.75 }}
                    end={{ x: 1, y: 0.25 }}
                    style={styles.loginButton}
                    colors={["#69b3f6", "#25d0de"]}
                  >
                    <Text style={styles.LoginButtontxt}>Search</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Content>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { width: wp("100%"), height: hp("100%") },
  RectangleShapeView: {
    flexDirection: "row",
    marginTop: 22,
    marginRight: 15,
    marginLeft: 15,
    width: wp("90%"),
    height: 35,
    justifyContent: "space-around"
  },
  RectangleShapeView1: {
    flexDirection: "row",
    marginTop: 22,
    marginRight: 22,
    marginLeft: 22,
    width: wp("90%"),
    height: 35
  },
  txt_beach2: {
    marginLeft: 10,
    width: wp("50%"),
    height: 15,
    fontSize: 12,
    fontFamily: "ProximaNova-Regular",
    color: "white"
  },
  card: {
    borderWidth: 3,
    borderRadius: 14,
    borderColor: "#000",
    width: wp("90%"),
    height: 463,
    padding: 10,
    marginTop: 22
  },
  cardImage: {
    height: hp("64%"),
    width: wp("90%"),
    borderColor: "#000",
    padding: 10,
    marginTop: 22,
    marginLeft: 22
  },
  container4: {
    width: wp("50%"),
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  container5: {
    width: wp("30%"),
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  container6: {
    width: wp("43%"),
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  container0: {
    width: wp("50%"),
    marginVertical: 10,
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "grey"
  },
  submit: {
    width: "96%",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#a3c7f6",
    height: 42
  },
  submitText: {
    color: "#4eb7fc",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    fontFamily: "ProximaNova-Regular ",
    fontSize: 12
  },
  loginButton: {
    backgroundColor: "#87cefa",
    alignItems: "center",
    height: hp("7%"),
    width: wp("86%"),
    color: "blue",
    justifyContent: "center",
    textAlign: "center"
  },
  LoginButtontxt: {
    color: "white",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "ProximaNova-Regular"
  }
});
