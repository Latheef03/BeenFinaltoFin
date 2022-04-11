import React, { Component } from "react";
import { View, Image, BackHandler } from "react-native";
import { clearData } from "../../Assets/Script/Helper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from "../../Assets/Script/Service";
const { been_url1 } = serviceUrl;
import { StackActions } from '@react-navigation/native';

export default class logout extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    console.log("This props is", this.props)
    const data = {
      Userid: await AsyncStorage.getItem("userId"),
      LoggedIn: false,
    };
    console.log("the datalogout", data);
    fetch(been_url1 + "/Logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json()
        this.props.navigation.dispatch(StackActions.replace('Login'));}
        )
      .then((responseJson) => {
        // console.log("the datalogout responseJson", responseJson);
        this.props.navigation.dispatch(StackActions.replace('Login'));
        //this.props.navigation.navigate("Login");
      })
      .catch((err) => console.log("Logout Err", err));
    let clearlogin = await clearData();
  }

  render() {
    return (
      <View></View>
    )
  }
}
