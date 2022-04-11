import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar, TextInput } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Profile_Style from "../../Assets/Styles/Profile_Style"
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import Common_Style from '../../Assets/Styles/Common_Style';
import UserView from '../commoncomponent/UserView'
import Modal from "react-native-modal";
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
var id1 = "";
export default class LikesView extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(prop) {
    super(prop);
    this.state = {
      data: '',
      postID: '',
      getLikes: '',
      screenName: '',
      search: '',
      UnfollowModal: false,
      RequestModal: false,
      reqId: '', other: '',
      likesCount: 0
    }
    this.arrayholder = [];
  }

  componentDidMount = async () => {
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.getLikes();
        // this.getBookmarks();
       // const { navigation } = this.props;
        const Comments = this.props.route.params.data;
        console.log('the datas are', Comments);
        this.setState({
          postID: Comments.data,
          screenName: Comments.screen,
          likesCount: Comments.likesCount
        })
      }
    );
  };


  async reqCancel() {
    const { getLikes, reqId } = this.state;
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      reqId: reqId.reqId,
      Status: "Cancel"
    };
    let otherStatus = reqId.Status;
    const index = getLikes.findIndex(m => m.reqId == reqId.reqId);
    delete getLikes[index].Status
    this.setState({
      getLikes,
      RequestModal: false
    });
    const url = serviceUrl.been_url + "/AcceptOrDelete";
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
      },
      body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('thee req', responseJson);
        if (responseJson.status !== "True") {
          reqId.Status = otherStatus
          getLikes[index] = reqId
          this.setState({ getLikes })
        }
      })
      .catch((error) => {
        reqId.Status = otherStatus
        getLikes[index] = reqId
        this.setState({ getLikes })
        console.log("Catch Error", error);
      });
  }

  async unfollow() {
    const { getLikes, other } = this.state;
    this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false })
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Otheruserid: other._id
    };
    const url = serviceUrl.been_url + "/Unfollow";
    let Status = other.Status;
    const index = getLikes.findIndex(m => m._id == other._id);
    delete getLikes[index].Status
    this.setState({ getLikes });

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
        console.log('the unfolw res', responseJson);
        if (responseJson.status !== 'True') {
          other.Status = Status;
          getLikes[index] = other
          this.setState({ getLikes });
        }
      })
      .catch((error) => {
        other.Status = Status;
        getLikes[index] = other
        this.setState({ getLikes });
        console.log(error);
        //toastMsg('danger', 'Sorry..something network error.Try again please.')
      });
  }

  unfollowAcc(dat) {
    this.setState({
      UnfollowModal: true,
      other: dat,
      otherUserPic: dat.ProfilePic,
      otherUsrname: dat.UserName

    })
  }

  reqAcc(dat) {
    this.setState({
      RequestModal: true,
      reqId: dat
    })
  }

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
  SearchFilterFunction(text) {
    // debugger;
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      getLikes: newData,
      text: text
    });
  }

  followRequest = async (item) => {
    const { getLikes } = this.state;
    console.log('the follwww', item);
    var data = {
      Otheruserid: item._id,
      Userid: await AsyncStorage.getItem('userId')
    };
    console.log('the total likes', getLikes);
    item.Status = item.PrivateAccount == 'Private' ? 'Pending' : 'following';
    const index = getLikes.findIndex(m => m._id == item._id);
    getLikes[index] = item
    this.setState({ getLikes })
    const url = serviceUrl.been_url + "/SendFollowReq";
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
        console.log('album responses', responseJson);
        if (responseJson.status !== 'True') {
          const index = getLikes.findIndex(m => m._id == item._id);
          delete getLikes[index].Status
          this.setState({ getLikes })
        }
      })
      .catch((error) => {
        const index = getLikes.findIndex(m => m._id == item._id);
        delete getLikes[index].Status
        this.setState({ getLikes })
        console.log('the err324', error);
      });
  };


  getLikes = async () => {
    // debugger;
    this.setState({ isLoading: true });
    id1 = await AsyncStorage.getItem('userId')
    var data = {
      UserId: id1,
      PostId: this.state.postID
    };
    const url = serviceUrl.been_url1 + "/LikedUsersList";
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('the total likes res', responseJson);
        if (responseJson.status == 'True') {
          this.setState({
            getLikes: responseJson.result
          });
          this.arrayholder = responseJson.result;
        }
      })
      .catch((error) => {
        //console.error("Error", error);
      });
  };

  seperator() {
    <View style={{ width: "100%", margin: '5%' }}></View>
  }

  getRenderView = (item) => {
    return <View style={[Common_Style.StatusView, { width: '100%' }]}>
      {item.Status == "Accept" ?
        <TouchableOpacity onPress={() => this.followRequest(item)}>
          <View style={Common_Style.AcceptFollow}>
            <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow</Text>
          </View>
        </TouchableOpacity>
        :
        item.Status == "Pending" ?
          <View style={Common_Style.PendingStatus}>
            <TouchableOpacity onPress={() => this.reqAcc(item)} style={{ width: '100%', }}>
              <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Requested</Text>
            </TouchableOpacity>
          </View>
          :
          item.Status == "following" ?
            <View style={Common_Style.FollowingStatus}>
              <TouchableOpacity onPress={() => this.unfollowAcc(item)} style={{ width: '100%', }}>
                <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Following</Text>
              </TouchableOpacity>
            </View>
            :
            item._id == id1 ?
              <View style={{}}>
              </View>
              :
              <TouchableOpacity onPress={() => this.followRequest(item)}>
                <View style={Common_Style.NewFollow}>

                  <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow</Text>

                </View>
              </TouchableOpacity>
      }

    </View>
  }


  render() {
    const { profilePic } = serviceUrl;
    return (
      <View style={[Common_Style.parentViewList, { marginTop: 0 ,backgroundColor:'#fff'}]}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

        <Toolbar {...this.props} centerTitle="" />

        <View style={Common_Style.TextHeader}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../Assets/Images/new/LIKE-2.png")}
              resizeMode={"contain"}
              style={Common_Style.requestImage}
            />
          </View>
          <View style={{ marginTop: hp("1%") }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: Username.FontSize,
                // fontFamily: Username.Font,
              }}
            >
              {this.state.likesCount} Likes
                </Text>
          </View>
        </View>

        <View style={Common_Style.Search}>
          <TextInput
            onChangeText={(text) => this.SearchFilterFunction(text)}
            autoCorrect={false}
            
            value={this.state.text}
            style={Common_Style.searchTextInput}
            placeholder={"Search "}
            placeholderTextColor={"#6c6c6c"}
          />
        </View>

        <View style={{ height: "70%" }}>
          <FlatList
            data={this.state.getLikes}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item, index }) => (
              <View
                key={`id${index}`}
                style={{ flexDirection: "row" }}
              >
                <UserView
                  userName={item.UserName}
                  surName={item.name}
                  onPress={() => this.OtheruserDashboard(item)}
                  isVerifyTick={item.VerificationRequest}
                  profilePic={item.ProfilePic}
                  rightView={this.getRenderView(item)}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {/* Request cancel Modal */}
        <Modal
          isVisible={this.state.RequestModal}
          onBackdropPress={() =>
            this.setState({ RequestModal: false })
          }
          onBackButtonPress={() =>
            this.setState({ RequestModal: false })
          }
        >
          <View
            style={{ backgroundColor: "#fff", borderRadius: 8 }}
          >
            <StatusBar
              backgroundColor="rgba(0,0,0,0.7)"
              barStyle="light-content"
            />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: "#f5f5f5",
              }}
            >
              <Text
                style={{
                  color: "#acacac",
                  marginTop: hp("2%"),
                  textAlign: "center",
                  marginBottom: hp("1.3%"),
                  fontSize: 12,
                  fontFamily: profilename.Font,
                }}
              >
                Are you sure want to Cancel this request?
                  </Text>
            </View>

            <View
              style={[
                Common_Style.Common_button,
                { width: wp(88), margin: 3 },
              ]}
            >
              <ImageBackground
                source={require("../../Assets/Images/button.png")}
                style={{ width: "100%", height: "100%" }}
                borderRadius={10}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.reqCancel();
                  }}
                >
                  <Text
                    onPress={() => {
                      this.reqCancel();
                    }}
                    style={[
                      Common_Style.Common_btn_txt,
                      { marginTop: 12 },
                    ]}
                  >
                    Yes
                      </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View
              style={[
                Common_Style.Common_button,
                { width: wp(88), marginTop: 4.8, margin: 3 },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ RequestModal: false });
                }}
              >
                <Text
                  onPress={() => {
                    this.setState({ RequestModal: false });
                  }}
                  style={[
                    Common_Style.Common_btn_txt,
                    {
                      color: Common_Color.common_black,
                      alignItems: "center",
                      justifyContent: "center",
                      width: wp(88),
                      padding: 8,
                    },
                  ]}
                >
                  No
                    </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Unfollow Modal */}

        <Modal isVisible={this.state.UnfollowModal}
          onBackdropPress={() => this.setState({ UnfollowModal: false })}
          onBackButtonPress={() => this.setState({ UnfollowModal: false })} >
          <View style={{ backgroundColor: 'transparent', borderRadius: 8 }} >
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <View style={{ justifyContent: 'center', alignContent: 'center', }}>
              {this.state.otherUserPic === null ? <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                source={require('../../Assets/Images/profile.png')} /> :
                <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                  source={{ uri: profilePic + this.state.otherUserPic }} />}
            </View>
            <View >
              <Text style={{ color: '#fff', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 15, fontFamily: UnameStory.Font }}>
                Are you sure want to unfollow
                                <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold, color: '#fff', fontSize: 15, }]}>  {this.state.otherUsrname}?</Text>
              </Text>
            </View>

            <View style={[Common_Style.Common_button, { width: wp(88), margin: 3 }]}>
              <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                borderRadius={10} >
                <TouchableOpacity onPress={() => { this.unfollow() }}>
                  <Text onPress={() => { this.unfollow() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Unfollow</Text>
                </TouchableOpacity>
              </ImageBackground>

            </View>
            <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
              <TouchableOpacity style={{ width: wp(88), }} onPress={() => { this.setState({ UnfollowModal: false }) }}>
                <Text onPress={() => { this.setState({ UnfollowModal: false }) }} style={[Common_Style.Common_btn_txt, { color: Common_Color.common_white, alignItems: 'center', justifyContent: 'center', color: '#fff' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}


const block = {
  text: { marginBottom: 'auto', fontSize: 16, color: '#000', },
  avatarProfile: { width: wp(15), height: hp(8.5), borderRadius: 50, margin: 7, justifyContent: 'center', marginTop: 5 },
  unBlockImg: { width: '80%', height: '77%', backgroundColor: '#f23f32', marginTop: hp('2%'), borderRadius: 1 },
  userName: { width: '50%', marginLeft: wp('7%'), height: hp('5%'), marginTop: hp('2.1%') },
}