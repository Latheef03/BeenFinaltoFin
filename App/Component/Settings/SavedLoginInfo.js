import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import TwoFactorStyle from "./styles/TwoFactorStyle";
import ToggleSwitch from "toggle-switch-react-native";
import Common_Style from "../../Assets/Styles/Common_Style";
import { Common_Color } from "../../Assets/Colors";
import { Toolbar } from "../commoncomponent";
import { postServiceP01 } from "../_services";
import { invalidText } from "../_utils/CommonUtils";

export default class SavedLoginInfo extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(prop) {
    super(prop);
    this.state = { LoginInfo: false };
  }

  componentDidMount = async () => {
    const getLoginInfo = await AsyncStorage.getItem("savedLogin");
    if (!invalidText(getLoginInfo)){
        this.setState({
            LoginInfo : JSON.parse(getLoginInfo)
        })
    } 
  };

  toggleSwitch() {
    this.setState(
      {
        LoginInfo: !this.state.LoginInfo,
      },
      () => {
        this.callWebService();
      }
    );
  }

  callWebService = async () => {
    const { LoginInfo } = this.state;
    const apiname = "savedlogininfo";
    AsyncStorage.setItem("savedLogin", `${LoginInfo}`);
    const data = {
      Userid: await AsyncStorage.getItem("userId"),
      savedlogininfo: LoginInfo,
    };
    console.log("the data", data);
    postServiceP01(apiname, data)
      .then((data) => {
        if (data.status != "True") {
          this.setState({ LoginInfo: !LoginInfo });
        }
      })
      .catch((err) => {
        console.log("the err", err);
        this.setState({ LoginInfo: !LoginInfo });
      });
  };

  createFolderIconView = () => <View />


  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#fff",
          marginTop: 0,
        }}
      >
        <Toolbar {...this.props} leftTitle="Saved Login Info" rightImgView={this.createFolderIconView()} />

        <View style={TwoFactorStyle.container}>
          <Text style={TwoFactorStyle.text}>Saved Login Info</Text>
          <ToggleSwitch
            isOn={this.state.LoginInfo}
            onColor="#39a0eb"
            offColor="grey"
            labelStyle={{ color: "black", fontWeight: "900" }}
            size="small"
            onToggle={() => {
              this.toggleSwitch();
            }}
          />
        </View>
        <View>
          <Text style={Common_Style.settingsMediumText}>
            We will remember your login account info for you in this device you
            would not need to enter it again and again
          </Text>
        </View>
      </View>
    );
  }
}
