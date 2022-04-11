import React, { Component } from 'react';
import { View, Text, TextInput, ImageBackground, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import TwoFactorStyle from './styles/TwoFactorStyle';
import MutedAccountStyle from './styles/MutedAccountStyle';
import serviceUrl from '../../Assets/Script/Service'
import { FlatList } from 'react-native-gesture-handler';
import Common_Style from '../../Assets/Styles/Common_Style'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import styles from '../../styles/FooterStyle'
import Profile_Style from "../../Assets/Styles/Profile_Style"
import { Toolbar } from '../commoncomponent'
import UserView from '../commoncomponent/UserView';

export default class MutedAccount extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(prop) {
    super(prop);
    this.state = { masterData: '' }
  }
  async componentWillMount() {
    this.getApi();
  }
  componentDidMount = async () => {
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.getApi();
      }
    );
  };

  getApi = async () => {
    debugger
    var data = {
      Userid: await AsyncStorage.getItem('userId')
    };
    const url = serviceUrl.been_url2 + "/GetMutedusers"
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("respones get mute lists",responseJson);
        if (responseJson.status == 'True') {
          this.setState({ masterData: responseJson.result })
        }
      })
      .catch((error) => {
        console.log(error);
        //toastMsg('danger', 'Sorry..Something network error.please try again once.')
      });
  };


  unMute = async (item) => {
    var id = item._id
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Otheruserid: id
    };
    console.log("Mute data",data,item);
    const url = serviceUrl.been_url1 + '/MuteAccount'
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Respnse from mute ",responseJson);
        if (responseJson.status === 'True') {
          this.getApi();
        }
      })
      .catch((error) => {
        console.log(error);
        //toastMsg('danger', 'Sorry..Something network error.please try again once.')
      });
  };

  async OtheruserDashboard(item) {
    // debugger;
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Otheruserid: item._id
    };
    const url = serviceUrl.been_url2 + "/OtherUserStatus";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.connectionstatus === "True") {
          AsyncStorage.setItem('OtherUserId', item._id);
          AsyncStorage.setItem('reqIdForStatus', item.reqId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "Pending") {
          AsyncStorage.setItem('OtherUserId', item._id);
          AsyncStorage.setItem('reqIdForStatus', item.reqId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "False") {
          AsyncStorage.setItem('OtherUserId', item._id);
          AsyncStorage.setItem('reqIdForStatus', item.reqId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item._id);
            AsyncStorage.setItem('reqIdForStatus', item.reqId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "Mismatch") {
          // this.props.navigation.navigate('Profile')
          this.profileChanger();
        }
        else {
        }
      })
      .catch((error) => {
      });
  }
  profileChanger = async () => {
    let local;
    // debugger;
    let businessProfile;
    var data = { userId: await AsyncStorage.getItem('userId') };
    const url = serviceUrl.been_url1 + '/UserProfile';
    const getType = await AsyncStorage.getItem('profileType');
    const pType = parseInt(getType);
    const localP = await AsyncStorage.getItem('localProfile');
    console.log('the ptype ', pType, ' and its type ', typeof pType);

    if (localP && localP == "Yes") {
      this.props.navigation.navigate('LocalUserProfile')
    } else if (pType === 2) {
      this.props.navigation.navigate('BusinessPlaceProfile')
    } else {
      console.log('the ptype ', pType, ' and its type profile1 ', typeof pType);
      this.props.navigation.navigate('Profile')
    }
  }


  getRenderView(item) {
    return <View style={[Common_Style.StatusView, { width: '100%' }]}>
      <TouchableOpacity onPress={() => this.unMute(item)}>
        <View style={Common_Style.NewFollow}>
          <Text numberOfLines={1} style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Unmute</Text>
        </View>
      </TouchableOpacity>
    </View>
  }

  createFolderIconView = () => <View />

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', marginTop: 0 }}>

        <Toolbar {...this.props} leftTitle="Muted Account" rightImgView={this.createFolderIconView()} />

        {this.state.masterData.length > 0 ?
          <FlatList
            style={{ marginBottom: 60 }}
            data={this.state.masterData}
            extraData={this.state.masterData}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item, index }) => (
              <View key={`id${index}`} style={{ flexDirection: 'row', }}>
                <UserView userName={item.UserName} surName={item.name} onPress={() => this.OtheruserDashboard(item)} isVerifyTick={item.VerificationRequest} profilePic={item.ProfilePic} rightView={this.getRenderView(item)} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          /> :
          <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
            <View style={styles.hasNoMem}>
              <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
              <Text style={Common_Style.noDataText}> You have not Muted anyone</Text>
            </View>
          </View>}
      </View>
    )
  }

}