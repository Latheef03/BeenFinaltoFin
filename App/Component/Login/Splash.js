import React, { Component } from 'react';
import { View, Text, Alert, StatusBar,Image,AppState } from 'react-native';
import { Container, Content, } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Common_Style from '../../Assets/Styles/Common_Style';
import serviceUrl from '../../Assets/Script/Service';
// import firebase from "react-native-firebase";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { initiateChat } from '../Chats/chatHelper';
import {invalidText} from '../_utils/CommonUtils';
// import type { Notification, NotificationOpen } from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
import firebase from "@react-native-firebase/app"

const iosCredentials = {
  clientId: "1094983005989-271n3ujr49c6p74h1nrl4976a9r6ai7p.apps.googleusercontent.com",
  appId: "1:1094983005989:ios:ee115c30f23caf5161cccc",
  apiKey: "AIzaSyCyqfTmq1885Tla0I2qDPd7O2aAbGDaits",
  databaseURL: "https://been-df967.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "",
  projectId: "been-df967",
};

const config = {
  name: "SECONDARY_APP",
};

// firebase.initializeApp(iosCredentials, config)
export default class Splash extends Component {

  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.state = {
      fcmToken: "",
      id1: ''
    };
    AppState.addEventListener('change',this.trackAppState)
  }

  trackAppState = (state) =>{
    // console.log('app state',state);
    if(state.match(/inactive|background/)){
      this.changeAppStatus(false)
    }else{
      this.changeAppStatus(true)
    }
  }

  changeAppStatus = async(state) =>{
    
      //debugger
      // console.log('the sate',state);
      var url = serviceUrl.been_url + "/SplashScreen";
      var id1 = await AsyncStorage.getItem("userId");
      var data1 = { _id: id1 , SignedIn : state };
      const savedLoginInfo = await AsyncStorage.getItem('savedLogin');
      const getapplogoutkey = await AsyncStorage.getItem('appLogout');
      const AppLogout = !invalidText(getapplogoutkey) ? JSON.parse(getapplogoutkey) : false;
    
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTUyNDczOTQxfQ.RMCTA6kusTuGAmKqN12ByEgAlu0m3Un18NEQejSmFz4"
        },
        body: JSON.stringify(data1)
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('changed appstatus',responseJson);
          // if (responseJson.status == "True") {
          //   this.props.navigation.navigate("MyPager");
          // } else if (responseJson.status == "False") {
          //   this.props.navigation.navigate("Login");
          // }
        })
        .catch((error) =>{
          console.log("Error login", error);
          reject(new Error(`Unable to retrieve events.\n${error.message}`));
        });
  }
  
  // async getToken() {
  //   let fcmToken = await AsyncStorage.getItem('fcmToken');
  //   if (!fcmToken) {
  //     fcmToken = await firebase.messaging().getToken();
  //     if (fcmToken) {
  //       await AsyncStorage.setItem('fcmToken', fcmToken);
  //     }
  //   }
  // }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();

    } catch (error) {
      console.log('permission rejected');
    }
  }

  async componentDidMount() {

    // firebase.notifications().getInitialNotification()
    //   .then((notificationOpen: NotificationOpen) => {
    //     if (notificationOpen) {
    //       const { title, body } = notification;
    //       this.showAlert(title, body);
    //       const action = notificationOpen.action;
    //       const notification: Notification = notificationOpen.notification;
    //       const PageName = notification.Page_Name;
    //       console.log("PageName", PageName);
    //       if (PageName == undefined) {
    //         this.onetimelogin();
    //       }
    //       else if (PageName == "Notification for Followers") {
    //         this.props.navigation.navigate("Notifications1");
    //       }
    //     }
    //   })

    console.log('did mount entered')

    const authStatus = await messaging().requestPermission();
    
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('enabled',enabled);
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }


    initiateChat();
     this.getToken()
    // const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
    // firebase.notifications().android.createChannel(channel);
    // this.checkPermission();
    // this.createNotificationListeners();
  }


  async createNotificationListeners() {
    //debugger
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      //const { title, body } = notification;
      const PageName = notification.data.Page_Name;
      console.log("PageName is come or not", PageName);
      if (PageName == undefined) {
        this.onetimelogin();
      }
      else if (PageName == "Notification for Followers") {
        this.props.navigation.navigate("Notifications1");
      }
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      //const { title, body } = notificationOpen.notification;
      const PageName = notificationOpen.notification.data.Page_Name;
      if (PageName == undefined) {
        this.onetimelogin();
      }
      else if (PageName == "Notification for Followers") {
        this.props.navigation.navigate("Notifications1");
      }
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      console.log("PageName is come or not", PageName);
      const PageName = notificationOpen.notification.data.Page_Name;
      if (PageName == undefined) {
        this.onetimelogin();
      }
      else if (PageName == "Notification for Followers") {
        this.props.navigation.navigate("Notifications1");
      }
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  }



  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  componentWillUnmount() {
    // this.notificationDisplayedListener();
    this.notificationListener
    this.notificationOpenedListener
    this.createNotificationListeners();
    AppState.removeEventListener('change',this.trackAppState)
  }

  async getToken() {
    debugger
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    this.onetimelogin();
    console.log("before fcmToken: ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      this.setState({
        fcmToken: AsyncStorage.getItem("fcmToken")
      });
      if (fcmToken) {
        console.log("after fcmToken: ", fcmToken);
        await AsyncStorage.setItem("fcmToken", fcmToken);
        this.setState({
          fcmToken: AsyncStorage.getItem("fcmToken")
        });
      }
    }
  }

  async requestPermission() {
    //debugger
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log("permission rejected");
      });
  }

  async checkPermission() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("Permission granted");
          this.getToken();
        } else {
          console.log("Request Permission");
          this.requestPermission();
          this.getToken();
        }
      });
  }

  async onetimelogin() {
    //debugger
    var url = serviceUrl.been_url + "/SplashScreen";
    var id1 = await AsyncStorage.getItem("userId");
    var data1 = { _id: id1 , SignedIn : true };
    const savedLoginInfo = await AsyncStorage.getItem('savedLogin');
    const getapplogoutkey = await AsyncStorage.getItem('appLogout');
    const AppLogout = !invalidText(getapplogoutkey) ? JSON.parse(getapplogoutkey) : false;
    
    console.log('the app logout ',AppLogout,'savedlogininfo',invalidText(savedLoginInfo));
    
    if(!invalidText(savedLoginInfo) && AppLogout){
      const parseAsJsonInfo = JSON.parse(savedLoginInfo);
      if(parseAsJsonInfo){
        this.props.navigation.navigate("Login");
        return false;
      }
    }
    // else{
      // this.props.navigation.navigate("MyPager");
    // }

    // if(!AppLogout || id1){
    //   this.props.navigation.navigate("MyPager");
    //   return false;
    // }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTUyNDczOTQxfQ.RMCTA6kusTuGAmKqN12ByEgAlu0m3Un18NEQejSmFz4"
      },
      body: JSON.stringify(data1)
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "True") {
          this.props.navigation.navigate("MyPager");
        } else if (responseJson.status == "False") {
          this.props.navigation.navigate("Login");
        }
      })
      .catch(function (error) {
        console.log("Error login", error);
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });

  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
        <View style={Common_Style.Splash_View}>
          {/* <Text style={Common_Style.splashText}>been</Text> */}
          <Image style={{ width: wp(20), height: hp(20), alignSelf: 'center', alignItems: 'center', alignContent: 'center' }}
            source={require('../../Assets/Images/Logo.jpg')}
            resizeMode={'contain'}
          />
        </View>
        {/* <Text style={[Common_Style.splashProductText]}>A Product by,</Text>
        <Text style={[Common_Style.splashProductText1]}>Enjam Social Networks Private Limited</Text> */}
      </Container>
    );
  }
}

