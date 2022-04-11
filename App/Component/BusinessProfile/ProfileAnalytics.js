import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Picker,
  StatusBar,
  TouchableNativeFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import businessProfileStyle from "./styles/businessProfileStyle";
import { ScrollView } from "react-native-gesture-handler";
import { UserTraffic, UserEngagement, Age, Region } from "./charts";
import { Toolbar } from "../commoncomponent";
import stylesFromToolbar from "../commoncomponent/Toolbar/styles";
import Modal from "react-native-modalbox";
import { deviceWidth as dw, deviceHeight as dh } from "../_utils/CommonUtils";
import { Common_Color } from "../../Assets/Colors";

export default class ProfileAnalytics extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      userTrafficData: [],
      userEngData: [],
      ageData: [],
      regionData: [],
      listOption: "All",
    };
    
  }
  ageRef = React.createRef();
  renderRightImgdone() {
    return (
      <View style={[stylesFromToolbar.leftIconContainer]}>
        <View>
          <Image style={{ width: 20, height: 20 }} />
        </View>
      </View>
    );
  }

  openModal = () => {
    this.refs.listmodal.open();
  };

  setOptionForAge = (value) => {
    this.setState({
      listOption: value,
    });
    console.log('the Age section',this.ageRef.monthSelection());
    this.refs.listmodal.close();
    if(this.ageRef && this.ageRef.monthSelection){
      // console.log('the values in here',value);
      this.ageRef.monthSelection(value)
    }
    
  };

  render() {
    const { userTrafficData, listOption } = this.state;
    const { navigation } = this.props;
    let analysUTF =this.props.route.params.analytics.uTd
    // navigation.getParam("analytics").uTd;
    let analysUENGMT = this.props.route.params.analytics.uEngmt
    //navigation.getParam("analytics").uEngmt;
    let analysAGE = this.props.route.params.analytics.uAge
    //navigation.getParam("analytics").uAge;
    let age = this.props.route.params.analytics.age
    //navigation.getParam("analytics").age;
    let analysREGION = this.props.route.params.analytics.uReg
    //navigation.getParam("analytics").uReg;
    let regDuplicateCountry = this.props.route.params.analytics.regDuplicateCountry
    //navigation.getParam("analytics").regDuplicateCountry;
    let regFilterDuplicateCountryCount = this.props.route.params.analytics.regFilterDuplicateCountryCount
     //navigation.getParam("analytics").regFilterDuplicateCountryCount;

    console.log("the dataa", analysREGION);
    return (
      <View style={{ flex: 1 ,backgroundColor:'#fff'}}>
        <Toolbar
          {...this.props}
          centerTitle="Profile Analytics"
          rightImgView={this.renderRightImgdone()}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <UserTraffic UTSource={analysUTF} />
          <UserEngagement UESource={analysUENGMT} />
          <Age
            ref={events => this.ageRef = events}
            AGESource={analysAGE}
            age={age}
            makeActiveModal={this.openModal}
            activeOption={listOption}

          />
          <Region
            RESource={analysREGION}
            regFilterDuplicateCountryCount={regFilterDuplicateCountryCount}
            regDuplicateCountry={regDuplicateCountry}
          />
        </ScrollView>

        <Modal
          style={modalStyle.modal}
          position={"center"}
          ref={"listmodal"}
          entry="bottom"
          useNativeDriver={true}
          backButtonClose={true}
          animationDuration={100}
          swipeToClose={true}
        >
          <View style={modalStyle.parentView}>
            <StatusBar
              backgroundColor="rgba(0,0,0,0)"
              barStyle="light-content"
            />

            <View style={{ width: dw * 0.9, justifyContent: "center" }}>
              <TouchableNativeFeedback
                onPress={() => this.setOptionForAge("All")}
              >
                <View style={{ width: "100%" }}>
                  <Text style={modalStyle.textStyle}>All</Text>
                </View>
              </TouchableNativeFeedback>

              <TouchableNativeFeedback
                onPress={() => this.setOptionForAge("Men")}
              >
                <View style={{ width: "100%" }}>
                  <Text style={modalStyle.textStyle}>Men</Text>
                </View>
              </TouchableNativeFeedback>

              <TouchableNativeFeedback
                onPress={() => this.setOptionForAge("Women")}
              >
                <View style={{ width: "100%" }}>
                  <Text style={modalStyle.textStyle}>Women</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const modalStyle = {
  modal: {
    width: dw * 0.9,
    height: dh,
    backgroundColor: "#00000000",
    justifyContent: "center",
  },
  parentView: {
    width: dw * 0.9,
    height: dh * 0.2,
    backgroundColor: "#FFF",
    justifyContent: "center",
    overflow: "hidden",
    alignItems: "center",
    borderRadius: 20,
  },
  textStyle: {
    textAlign: "center",
    padding: 12,
    fontSize: 12,
    fontFamily: Common_Color.fontMedium,
  },
};
