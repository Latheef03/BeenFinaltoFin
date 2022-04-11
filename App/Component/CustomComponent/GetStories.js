import React, { Component } from "react";
import {
  Text,
  StatusBar,
  StyleSheet,
  Image,
  FlatList,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ToggleSwitch from "toggle-switch-react-native";
import serviceUrl from "../../Assets/Script/Service";
import { toastMsg } from "../../Assets/Script/Helper";
import Loader from "../../Assets/Script/Loader";
import {Toolbar} from '../commoncomponent'
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { been_url, method, headers, been_image_urlExplore } = serviceUrl;

export default class GetStories extends Component {
  static navigationOptions = {
    header : null
  }

  constructor(props) {
    super(props);
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      storiesData: [],
      respectiveLocation: "",
      viewLayoutHeight: 50,
      updatedHeight: 0,
      expand: false,
      loading: false,
      loadingApi: false,
    };
  }

  componentWillMount() {
    this.getMyStories();
    this.getLocation();
  }

  animated_sliding_view = (selectedCount) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (selectedCount > 0) {
      this.setState({
        updatedHeight: this.state.viewLayoutHeight,
        expand: true,
      });
    } else {
      this.setState({
        updatedHeight: 0,
        expand: false,
      });
    }
  };

  getMyStories = async () => {
    var userid = await AsyncStorage.getItem("userId");
    var data = { Userid: userid };
    console.log('the user id',data);
    const url = been_url + "/GetVisitStory";
    this.setState({ loading: true });
    fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("the getStories", responseJson);
        if (responseJson.status == "true") {
          responseJson.result =
            responseJson.result.length > 0 &&
            responseJson.result.map((item) => {
              item.isSelect = false;
              // item.selectedClass = styles.list;

              return item;
            });
          console.log(responseJson.result);
          this.setState({ storiesData: responseJson.result, loading: false });
        } else {
          this.setState({ loading: false });
          //toastMsg('danger', responseJson.message)
        }
      })
      .catch((err) => {
        console.log("Error:Error in 78 getstories file", err);
        this.setState({ loading: false });
        //toastMsg('danger', 'Sorry..Something network error.please try again once.')
      });
  };

  getLocation = () => {
    const { navigation,route } = this.props;
    const loc = route?.params?.location;
    const item = route?.params?.item
    console.log('the items',item);
    this.setState({
      respectiveLocation: loc,
    });
  };
  
  selectItem(data) {
    data.isSelect = !data.isSelect;
    // data.selectedClass = data.isSelect ? styles.selected : styles.list;
    const index = this.state.storiesData.findIndex(
      (item) => data._id === item._id
    );
    this.state.storiesData[index] = data;
    this.setState({
      storiesData: this.state.storiesData,
    });

    const itemNumber = this.state.storiesData.filter((item) => item.isSelect)
      .length;
    this.animated_sliding_view(itemNumber);
  }

  async goVisits() {
    let selectedData = this.state.storiesData.filter((item) => item.isSelect);
    let permittedValues = selectedData.map((value) => value._id);
    var userid = await AsyncStorage.getItem("userId");
    const storyid = this.props.route?.params?.item?._id
    let data = {
      Userid: userid,
      ImgId: permittedValues,
      PlaceName: this.state.respectiveLocation,
      storyId : storyid
    };
    console.log('the getsotries data',data);
    const url = been_url + "/VisitsAddMore";
    this.setState({ loadingApi: true });
    fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "True") {
          this.setState({ loadingApi: false });
          this.props.navigation.navigate("Visits");
        } else {
          this.setState({ loadingApi: false });
          //toastMsg('danger', response.message)
        }
      })
      .catch((err) => {
        this.setState({ loadingApi: false });
        console.log("Error:Line 175,Getstories", err);
        //toastMsg('danger', 'Sorry..Something network error.please try again once.')
      });
  }

  render() {
    const itemNumber = this.state.storiesData.filter((item) => item.isSelect)
      .length;
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <Loader />
        </View>
      );
    }
    return (
      <>
      <View
        style={{ backgroundColor: "#fff", marginTop: 0 ,flex:1}}
      >
      <Toolbar {...this.props} centerTitle='Stories      ' rightImgView={<View  />} />
      
        
        <View
          style={{
            height: this.state.updatedHeight,
            overflow: "hidden",
            backgroundColor: "#fff",
            borderBottomColor: "#000",
            borderBottomWidth: 1,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              textAlign: "left",
              padding: 12,
              fontSize: 16,
              fontWeight: "bold",
            }}
            // onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}
          >
            {`Selected ${itemNumber}`}
          </Text>
          <TouchableWithoutFeedback
            activeOpacity={0.5}
            onPress={() => this.goVisits()}
          >
            <View
              style={{
                alignSelf: "center",
                right: 0,
                position: "absolute",
                height: "100%",
                padding: 10,
              }}
            >
              {!this.state.loadingApi ? (
                <Image
                  source={require("../../Assets/Images/check.png")}
                  style={{ width: 25, height: 25, alignSelf: "center" }}
                />
              ) : (
                <View style={styles.loader}>
                  <Loader size="small" />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        <FlatList
          data={this.state.storiesData}
          extraData={this.state}
          renderItem={({ item }) => (
            <View>
              <View
                style={{
                  width: wp("33.3%"),
                  height: hp("20%"),
                  backgroundColor: "#c1c1c1",
                }}
              >
                <TouchableOpacity onPress={() => this.selectItem(item)}>
                  <Image
                    source={{ uri: been_image_urlExplore + item.pic }}
                    style={{
                      width: wp("33.3%"),
                      height: hp("20%"),
                      opacity: item.isSelect ? 0.4 : 1,
                    }}
                    resizeMode={"cover"}
                  />
                </TouchableOpacity>
              </View>
              {/* #2196F3-blue */}
              {item.isSelect ? (
                <View style={styles.selectedIconView}>
                  <Image
                    source={require("../../Assets/Images/check_white.png")}
                    style={{
                      width: 12,
                      height: 12,
                      alignSelf: "center",
                      top: 4,
                    }}
                  />
                </View>
              ) : null}
            </View>
          )}
          keyExtractor={(item) => item._id}
          horizontal={false}
          numColumns={3}
        />
      </View>
      </>
    );
  }
}

const styles = {
  images: { width: wp("33.3%"), height: hp("20%") },
  selectedIconView: {
    backgroundColor: "#2196F3",
    width: 25,
    height: 25,
    borderRadius: 12.5,
    position: "absolute",
    margin: 5,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
};
