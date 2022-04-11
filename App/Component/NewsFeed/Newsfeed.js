import React, { Component } from 'react';

import {
  View, Clipboard, Text, ImageBackground, Image, Share, Dimensions,
  TouchableOpacity, StatusBar,NativeModules, StatusBarIOS, ScrollView, ToastAndroid, Animated, PanResponder, FlatList,
  KeyboardAvoidingView, Platform, Keyboard, TouchableHighlight, ActivityIndicator,
  BackHandler, StyleSheet, TouchableWithoutFeedback, TextInput as RNTextInput,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
let Common_Api = require('../../Assets/Json/Common.json')
import { TextInput, Menu, Divider } from 'react-native-paper';
import { Footer, FooterTab, Button, Spinner, Content, Header, Toast, Badge, Left, Right, Container } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import styles from '../../styles/NewfeedImagePost';
import ViewMoreText from 'react-native-view-more-text';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent';
import { postServiceP01 } from 'Been/App/Component/_services';
import Loader from '../../Assets/Script/Loader';
import { deviceHeight as dh, deviceWidth as dw, getTime } from '../_utils/CommonUtils';
import { OneToOneChat } from '../Chats';
import { hashtagHighlighter } from '../_utils';
import ParsedText from 'react-native-parsed-text';
import { initiateChat } from '../Chats/chatHelper';
import VideoController from '../CustomComponent/VideoController';
import {AdView } from '../Admob/src/AdView'
import {SelectedFilters} from './Filter_Edit_utils'
import DeviceInfo from 'react-native-device-info';

import { TapGestureHandler, State, } from 'react-native-gesture-handler';
import { toastMsg1, toastMsg } from '../../Assets/Script/Helper';
import UserView from '../commoncomponent/UserView';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const { StatusBarManager } = NativeModules;
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);


const shareOptions = {
  title: "Title",
  //message:'Post Shared',
  message:"Post Shared",
  url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
  subject: "Subject"
};


export default class Newsfeed extends Component {

  static navigationOptions = {
    header: null,
  };

  doubleTapRef = React.createRef();

  constructor(props) {
    super(props);
    one2onechat = new OneToOneChat();
    this.state = {
      newsFeedData: [],
      adminData:[],
      nfBackup: [],
      visibleModal: false,
      isSelectSendTo: false,
      isClickAddNF: false,
      likes: '',
      userBookmarkState: false,
      likeStatus: '',
      move: true,
      add_like: true,
      isLoading: false,
      userId: '',
      postId: '',
      notifications: "On",
      postContent: '',
      otherUserId: "",
      grabReachfeedId: [],

      /*For Video*/
      paused: false,
      duration: 0.1,
      currentTime: 0.0,
      volume: 1.0,
      volumeMuted: false,
      showControl: false,
      singleTapPostId: '',
      /*End For Video*/

      isLoading: true,
      userPlay: false,
      playerState: PLAYER_STATES.PLAYING,
      zone: '', viewHeight: false,
      selectedPostImage: '',
      followingsList: [],
      isModalVisible1: false,

      permission_Value: '',
      isvisibleModal: false,
      isModalVisible2: false,
      isModalVisible3: false,

      _isSendToLoader: false,
      _isLoaderRun: false,
      followeeList: [],
      mScrollIndex: -1,
      fetching_from_server: false,
      dataOffset: 0,
      isRefreshing: false,
      dTapLikeEnable: false,
      tappedPostId: '',
      userDataForEdit: {},
      reportEmpty: false

    }
    this.followListForSearch = [];
    this.scrollDirection = true;
    this.player = Array();
    this.scrollY = new Animated.Value(0);
    this.diffClamp = Animated.diffClamp(this.scrollY, 0, 60)
    this.changeControl = this.changeControl.bind(this)
    // this._onDoubleTap = this._onDoubleTap.bind(this)
  }

  modalsTimeout ;
  sendModalTimeout;
  _animatedValue = new Animated.Value(0);
  dTapTimeout
  // componentWillMount() {
  //   this.fetchDetails();
  //this.onLoad();
  // }

  componentDidMount = async () => {
    // StatusBar.setBarStyle("light-content");
    // if (Platform.OS === "android") {
    //   StatusBar.setBackgroundColor("rgba(0,0,0,0)");
    //   StatusBar.setTranslucent(true);
    // }
    this.onLoad();
    this.getAdminFeeds();
    // console.log('faketest', this.props.pos);
    console.log('not focused');
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        console.log('focused');
        this.getAdminFeeds();
      }
    );

   
    // if (Platform.OS === 'ios') {
    //   StatusBarManager.getHeight(response =>
    //       this.setState({iosStatusBarHeight: response.height})
    //   )
  
    //   this.listener = StatusBarIOS.addListener('statusBarFrameWillChange',
    //     (statusBarData) =>
    //       this.setState({iosStatusBarHeight: statusBarData.frame.height})
    //   )
    // }
  };

  // static getDerivedStateFromProps(props, state) {
  //   console.log('the props',props);
  //   console.log('----------------');
  //   console.log('th estate',state);
  //   const prop = props?.route?.params?.data
  //   const screen = state?.isScreen
  //   if(state.newsFeedData !== this.state.newsFeedData){
  //     return {
  //       newsFeedData : state.newsFeedData 
  //     }
  //   }
  //   return null
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.newsFeedData !== this.state.newsFeedData) {
  //     // console.log('pokemons state has changed.')
  //     return{
  //       newsFeedData : this.state.newsFeedData
  //     }
  //   }
  // }

  componentWillUnmount = () => {
    // StatusBar.setTranslucent(false);
    clearTimeout(this.dTapTimeout,this.modalsTimeout,this.reportModalTimeout);
    clearTimeout(this.sendModalTimeout)
    this.setState({
      mScrollIndex: -1 })
    // if (Platform.OS === 'ios' && this.listener) {
    //   this.listener.remove()
    // }
  }

  getAdminFeeds = async() =>{
    var data = {
        UserId: await AsyncStorage.getItem('userId'),
    };
    const url = serviceUrl.been_url1 + "/adminFeeds";
    const header = serviceUrl.headers;
    return fetch(url, { method: "POST", headers: header, body: JSON.stringify(data) })
        .then(response => response.json())
        .then(responseJson => {
            console.log('the resposne from admin feeds',responseJson);
            if (responseJson.status == "True") {
               this.setState({adminData:responseJson.result})
               this.fetchDetails(responseJson.result)
            }
            else {
                this.setState({adminData:[]})
                this.fetchDetails([])
            }
        })
        .catch(function (error) {
          console.log('Error:', error)
        });
}

fetchDetails = async (adminData) => {
  
  var id = await AsyncStorage.getItem("userId");
  console.log('this offsetsss', this.state.dataOffset > 0 ? 0 : this.state.dataOffset);
  var data = {
    UserId: id, offset:
      this.state.dataOffset > 0 ? 0 : this.state.dataOffset
  };
  this.setState({ isLoading: true });
  //const url = serviceUrl.been_url + "/GetNewsFeedList";
  const url = serviceUrl.been_url1 + "/GetNewsFeedList";
  const header = serviceUrl.headers;
  return fetch(url, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(data),
  }).then((response) => response.json())
    .then((responseJson) => {
      // const responseJson = FakeNFData
      
      if (responseJson.status == "True") {
        {
          console.log('NF responses', responseJson)
          // this.setState({ isLoading: false });
          let likeStatus = responseJson;
          let userStatus = responseJson
          likeStatus.UserLiked && likeStatus.UserLiked.length > 0 && likeStatus.UserLiked.map(item => {
            userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
              if (moment.PostId === item.Postid) {
                moment.userLiked = true;
              }
              return moment;
            });
            return item;
          });

          likeStatus.UserBookMark && likeStatus.UserBookMark.length > 0 && likeStatus.UserBookMark.map(item => {
            userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
              if (moment.PostId === item.Postid) {
                moment.userBookmarked = true;
              }
              return moment;
            });
            return item;
          });

       
          // console.log('likeStatus',likeStatus);
          if (userStatus.result != null) {
            userStatus.result.map((i, index) => {
              // return { ...i, mIndex: index, duration: 0.1 };
              i.mIndex = index
              i.duration = 0.5
              i.currentTime= 0.0
              i.paused=true
              return i;
            })
            console.log('the alter list',  userStatus.result);
            console.log("Admin data is ",adminData)

            let solution = [];
            let j = 0;
    for (let i = 0; i < userStatus.result.length; i++) {
      //  Adds in Admin 
      if ((solution.length + 1) % 6 == 0) {
        console.log('adminData[j]',adminData[j]);
        solution.push(adminData[j]);
        solution.push(userStatus.result[i]);
        j++;
      }
      // Ads in Admobs 
      else if((solution.length +1) % 5 == 0){
        console.log('else adminData[j]',adminData[j]);
        solution.push(adminData[undefined]);
        solution.push(userStatus.result[i]);
        j++;
      }
       else {
        solution.push(userStatus.result[i]);
      }
    }
            // this.setState({ isRefreshing: true, isLoading: true })
            // setTimeout(() => {
            //   console.log("after 10 sec Solution data is ", solution)
              //  solution.splice(0,0,{dummy:true})
              this.setState({
                newsFeedData: solution,
                dataOffset: this.state.dataOffset + 1,
                isRefreshing: false,
                isLoading : false
              })
            // }, 1000 * 10)
        
          }
        }
      }
      else if (responseJson.status === 'False') {
        this.setState({
          likeStatus: false,
          isLoading: false, isRefreshing: false
        })
      }

      else {
        this.setState({ isLoading: false, isRefreshing: false });
        //toastMsg('danger', response.data.message)
      }
    })
    .catch(function (error) {
      this.setState({ isLoading: false, isRefreshing: false });
      console.log('Error:', error)
      //toastMsg('danger', 'Sorry..something network error.Please try again.')
    });
}

  viewmore1() {
    this.setState({
      viewHeight: true
    })
  }
  goBack = () => {
    this.props.navigation.goBack();
  }

  async OtheruserDashboard(item) {
    // debugger;
    Keyboard.dismiss()
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Otheruserid: item.userId
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
        //   if (responseJson.connectionstatus === "True") {
        //     AsyncStorage.setItem('OtherUserId', item.userId);
        //     var data = {
        //       ProfileAs: responseJson.ProfileAs
        //     }
        //   }
        //   else if (responseJson.connectionstatus === "Pending") {
        //     AsyncStorage.setItem('OtherUserId', item.userId);
        //     this.props.navigation.navigate('OtherUserProfile')
        //   }
        //   else if (responseJson.connectionstatus === "False") {
        //     AsyncStorage.setItem('OtherUserId', item.userId);
        //     this.props.navigation.navigate('OtherUserProfile')
        //   }
        //   else if (responseJson.connectionstatus === "Mismatch") {
        //     this.props.navigation.navigate('Profile')
        //   }
        //   else {
        //     toastMsg('success', responseJson.message)
        //   }
        // })
        // .catch((error) => {
        //   // //console.error(error);
        //   //toastMsg('danger', 'Sorry..something network error.Try again please.')
        // });
        if (responseJson.connectionstatus === "True") {
          AsyncStorage.setItem('OtherUserId', item.userId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item.userId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item.userId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item.userId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "Pending") {
          AsyncStorage.setItem('OtherUserId', item.userId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item.userId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item.userId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item.userId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "False") {
          AsyncStorage.setItem('OtherUserId', item.userId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item.userId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item.userId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item.userId);
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

  _onDoubleTap = (event, data) => {

    if (event.nativeEvent.state === State.ACTIVE) {
      this.setState({ dTapLikeEnable: true, tappedPostId: data.PostId })
      this.dTapTimeout = setTimeout(() => {
        this.setState({ dTapLikeEnable: false })
      }, 2000)
      this.likes(data, true);
      // alert('Double tap,!');
    }
  };


  changeControl = () => {
    this.setState({
      paused: !this.state.paused
    })
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

  onLoad = async () => {
    debugger
    var userId = await AsyncStorage.getItem('userId');
    //initiateChat();
    this.setState({ userId: userId, })
  }

  postContent = text => {
    this.setState({ postContent: text });
  };

  async share_option() {
    const shared = await Share.share(shareOptions)
    console.log('the shared', shared);

    if (shared.action !== Share.dismissedAction) {
      this.setState({
        visibleModal: false
      })
      this.sharefeed();
    }else{
      this.setState({
        visibleModal: false
      })
    }
   
  
  }

  sharefeed = async () => {
    var data = {
      PostId: this.state.postId,
      Userid: await AsyncStorage.getItem('userId')
    };
    const url = serviceUrl.been_url + "/ShareFeed";
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
        if (responseJson.status == 'True') {
          //toastMsg('success', 'Request has been sent')
          // this.getOthersProfile();
          this.fetchDetails();
        }
      })
      .catch((error) => {
        //toastMsg('danger', 'Sorry..something network error.Try again please.')
      });
  };

  shareOptions = {
    title: "Title",
    message:'Post Shared',
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
  };

  likesView(data) {
    // console.log('the datas are in NF',data);
    var data = {
      data: data.PostId,
      screen: "Likes",
      likesCount: data.LikeCount
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }


  readFromClipboard = async () => {
    this.setState({ visibleModal: false })
    //To get the text from clipboard
    const clipboardContent = await Clipboard.getString();
    this.setState({ clipboardContent });
  };

  writeToClipboard = async () => {
    this.setState({ visibleModal: null })
    //To copy the text to clipboard
    await Clipboard.setString("http://Been.com/" + this.state.postId);
    toastMsg('success', "Link Copied")
    //ToastAndroid.show('Link Copied', ToastAndroid.SHORT);
    //toastMsg("Pending", "Link Copied");
  };


  comments(data) {
    // debugger;
    this.setState({ mScrollIndex: 0 })
    this.props.navigation.navigate('comments', { data: data });
  }
  newsFeedUpload() {
    // this.props.navigisClickAddNFation.navigate('NewsfeedUpload')
    this.setState({
      isClickAddNF: true,
      mScrollIndex: -1
    })
  }

  modalOpen(data) {
    debugger
    this.setState({
      visibleModal: 1,
      postId: data.PostId,
      otherUserId: data.userId,
      userBookmarkState: data.userBookmarked,
      notifications: data.Notificationsetting == "Off" ? "On" : 'Off',
      selectedPostImage: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0],
      feedData: [data]
    })
  }

  modalOpen1(data) {
    debugger
    this.setState({
      visibleModal: 2,
      postId: data.PostId,
      otherUserId: data.userId,
      userBookmarkState: data.userBookmarked,
      notifications: data.Notificationsetting == "Off" ? "On" : 'Off',
      selectedPostImage: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0],
      feedData: [data]
    })
  }


  openUserModal(data) {

   if(data.userId === this.state.userId){
    this.setState({
      visibleModal: 3,
      userBookmarkState: data.userBookmarked,
      selectedPostImage: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0],
      userDataForEdit: data,
      postId: data.PostId,
      feedData: [data]
    })
  }

  else {
    this.setState({
      visibleModal: 1,
      postId: data.PostId,
      otherUserId: data.userId,
      userBookmarkState: data.userBookmarked,
      notifications: data.Notificationsetting == "Off" ? "On" : 'Off',
      selectedPostImage: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0],
      feedData: [data]
    })
  }
}

  imageModal(data) {
    console.log('the data NF', data);
    var data = {
      data: data.Image,
      events:data.Events,
      desc: data.Desc,
      postLocation: data.Location + ', ' + data.Country
    }
    this.props.navigation.navigate("MultiImageView", { data: data })
  }

  getLocation(data) {
    debugger;
    AsyncStorage.mergeItem('PlaceName', data.Location);
    AsyncStorage.setItem('PlaceName', data.Location);
    this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
  }

loadMoreData = async (adminData=[]) => {
  const { newsFeedData } = this.state
  var id = await AsyncStorage.getItem("userId");
  console.log('this offset load more', this.state.dataOffset);
  this.reachFeed(newsFeedData);
  var data = { UserId: id, offset: this.state.dataOffset };
  //const url = serviceUrl.been_url + "/GetNewsFeedList";
  const apiname = "GetNewsFeedList";
  const header = serviceUrl.headers;
  this.setState({ fetching_from_server: true, dataEnd: false })
  let subscribe = true;
  postServiceP01(apiname, data).then(cb => {
  if (cb.status == "True") {
  console.log('loadmore responses', cb);
  if (cb.result.length == 0) {
  this.setState({ fetching_from_server: false, dataEnd: true });
  return false;
  }
  let likeStatus = cb;
  let userStatus = cb;
  likeStatus.UserLiked && likeStatus.UserLiked.length > 0 && likeStatus.UserLiked.map(item => {
  userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
  if (moment.PostId === item.Postid) {
  moment.userLiked = true;
  }
  return moment;
  });
  return item;
  });
  
  likeStatus.UserBookMark && likeStatus.UserBookMark.length > 0 && likeStatus.UserBookMark.map(item => {
  userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
  if (moment.PostId === item.Postid) {
  moment.userBookmarked = true;
  }
  return moment;
  });
  return item;
  });
  
  if (userStatus.result != null) {
  // var alterList =
    userStatus.result.map((i, index) => {
      // return {
      //   ...i, mIndex: index, duration: 0.5,
      //   currentTime: 0.0,
      //   paused: true
      // };
      i.mIndex = index
      i.duration = 0.5
      i.currentTime = 0.0
      i.paused = true
      return i;
    })
  
  let solution = [];
  let j = 0;
  for (let i = 0; i < userStatus.result.length; i++) {
  // Adds in Admin
  if ((solution.length + 1) % 50 == 0) {
  console.log('adminData[j]',adminData[j]);
  solution.push(adminData[j]);
  solution.push(userStatus.result[i]);
  j++;
  }
  // Ads in Admobs
  else if((solution.length +1) % 5 == 0){
  console.log('else adminData[j]',adminData[j]);
  solution.push(adminData[undefined]);
  solution.push(userStatus.result[i]);
  j++;
  }
  else {
  solution.push(userStatus.result[i]);
  }
  }
  console.log("Solution data is loadmore ",solution)
  
  this.setState({
  dataOffset: this.state.dataOffset + 1,
  newsFeedData: [...this.state.newsFeedData, ...solution],
  fetching_from_server: false
  })
  }
  
  } else if (responseJson.status === 'False') {
  this.setState({ likeStatus: false, fetching_from_server: false, dataEnd: false })
  } else {
  this.setState({ fetching_from_server: false, dataEnd: false });
  //toastMsg('danger', response.data.message)
  }
  }).catch(err => {
  console.log('loadmore on error', err)
  this.setState({ fetching_from_server: false, dataEnd: false });
  })
  return () => (subscribe = false)
  
  }

  reachFeed = async (nfData) => {
    const { grabReachfeedId } = this.state;
    const getIds = nfData.filter((o) => grabReachfeedId.indexOf(o.PostId) == -1).map(({ PostId }) => PostId);
    this.setState({
      grabReachfeedId: [...grabReachfeedId, ...getIds]
    })
    const userid = await AsyncStorage.getItem("userId");
    const datas = { Userid: userid, Postid: getIds }
    const apiname = 'ReachFeed';
    if (getIds.length > 0) {
      postServiceP01(apiname, datas).then(cb => {
        console.log('the callback of reach ids', cb);
      }).catch(err => {
        console.log('the reach feed error', err)
      })
    }
  }

  onScrollEndHandler = () => {
    console.log('the scroll end detected', this.state.fetching_from_server)
    if (this.state.fetching_from_server) {
      return false;
    }

    console.log('the scroll end detected', this.state.dataEnd)
    if (this.state.dataEnd) {
      console.log('the true detect');
      return false;
    }

    this.loadMoreData();
  }

  onscrollEvents = (e) => {

    this.scrollY.setValue(e.nativeEvent.contentOffset.y)

    /**
     * @scroll_up_and_down
     */
    /*var currentOffset = e.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.layoutContentOffset || 0);
    if (dif < 0) {
      this.scrollDirection = true
    } else {
      this.scrollDirection = false
    }
    this.layoutContentOffset = currentOffset;
    */
  }


  async likes(data, doubleTap = false) {
    const { newsFeedData } = this.state;
    console.log('comes from double tap', data, '--doubletap', doubleTap);
    if (doubleTap && data.userLiked) {
      return false;
    }

    var id = await AsyncStorage.getItem("userId");
    console.log('the data', data);
    data.userLiked = !data.userLiked;
    const index = newsFeedData.findIndex(item => item.PostId == data.PostId);
    data.LikeCount = data.userLiked ? newsFeedData[index].LikeCount + 1 :
      newsFeedData[index].LikeCount - 1;
    newsFeedData[index] = data;

    this.setState({
      newsFeedData
    });

    var datas = {
      Userid: id,
      Postid: data.PostId
    };
    const url = serviceUrl.been_url + "/LikeFeedPost";
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
      },
      body: JSON.stringify(datas),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('te lkes', responseJson);
        if (responseJson.status == "True") {
          // this.fetchDetails();
        }
        else {
          data.userLiked = false;
          const index = newsFeedData.findIndex(item => item.PostId == data.PostId);
          data.LikeCount = newsFeedData[index].LikeCount - 1;
          newsFeedData[index] = data;
          this.setState({ newsFeedData });
          this.setState({ likes: false })
          toastMsg1('danger', 'Couldn\'t like.try again')
          //  ToastAndroid.show('Couldn\'t like.try again',ToastAndroid.SHORT)
          //toastMsg('danger', responseJson.message)
        }
      })
      .catch((error) => {
        data.userLiked = false;
        const index = newsFeedData.findIndex(item => item.PostId == data.PostId);
        data.LikeCount = newsFeedData[index].LikeCount - 1;
        newsFeedData[index] = data;
        this.setState({ newsFeedData });
        toastMsg1('danger', 'Couldn\'t like.try again')
        //  ToastAndroid.show('Couldn\'t like.try again',ToastAndroid.LONG)
        console.log("Catch Error", error);
      });
  }



  async bookmarkLikes() {
    var id = await AsyncStorage.getItem("userId");
    var data = { Userid: id, Postid: this.state.postId };
    const url = serviceUrl.been_url + "/Bookmark";
    this.setState({ visibleModal: false })
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
      },
      body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('asd', responseJson);
        if (responseJson.status == "True") {
          this.getAdminFeeds();
          const saveState = responseJson.bookmark ? 'Post Saved.'
            : 'post Unsaved.'
          //  toastMsg('success',saveState)
          // ToastAndroid.show(saveState,ToastAndroid.SHORT);
        }
        else {
          this.setState({ likes: false })
          toastMsg1('danger', 'Post Couldn\'t save')
          //ToastAndroid.show('Post Couldn\'t save',ToastAndroid.SHORT);
          //toastMsg('danger', responseJson.message)
        }
      })
      .catch((error) => {
        toastMsg1('danger', 'Post Couldn\'t save')
        // ToastAndroid.show('Post Couldn\'t save',ToastAndroid.SHORT);
        console.log("Catch Error", error);
      });

  }

  async notifyData() {
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Postid: this.state.postId,
      Otheruserid: this.state.otherUserId,
    };
    var base_url = serviceUrl.been_url1 + "/TurnOnOffNotitfication";
    //var base_url = serviceUrl.end_user + "/NotificationSettings";
    fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "True") {
          this.setState({ visibleModal: false });
          this.getAdminFeeds();
          //toastMsg("success", responseJson.message);
        }
      })
      .catch((error)=> {
        console.log("Error in newsfeed ",error)
      });
  }

  SearchFilterFunction1(text) {
    //passing the inserted text in textinput
    const newData = this.followListForSearch.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      followeeList: newData,
      text: text
    });
  }


  reportModal() {
    this.setState({
      visibleModal: null,
      visibleModal: 3
    });
  }

  sendReportModal() {
    if (this.state.permission_Value == "" || null || undefined) {
      toastMsg1('danger', "Please give a report")
      // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
    }
    else {
      this.setState({
        visibleModal: null,
      });
      this.reportApi();
    }
  }

  sendTo = () => {
    this.setState({
      visibleModal: null,
    },()=>{
      this.sendModalTimeout = setTimeout(()=>{
        console.log("is called")
        this.setState({
          isSelectSendTo: true
        })
      },600)
    })
    this.getFolloweesList();
  }

  reportTo = () => {
    this.setState({
      visibleModal: null,
    },()=>{
      this.reportModalTimeout = setTimeout(()=>{
        this.setState({
          isModalVisible1: true
        })
      },600)
    })
  }


  

  getFolloweesList = async () => {
    const { _isSendToLoader, followeeList } = this.state
    const data = {
      UserId: await AsyncStorage.getItem('userId'),
    }
    const apiname = 'FollowerFollowingsList';
    console.log('followeeList', followeeList)
    if (followeeList.length === 0) {
      this.setState({ _isSendToLoader: true })
    }
    postServiceP01(apiname, data).then(cb => {
      console.log('datas are send to', cb);
      if (cb.status == 'True') {
        // console.log('sd', cb)
        cb.result.length > 0 && cb.result.map(s => {
          s.buttonFlag = 'send'
          return s;
        });

        this.setState({
          followeeList: cb.result,
          _isSendToLoader: false,
        });
        this.followListForSearch = cb.result;
      } else {
        this.setState({
          _isSendToLoader: false
        });
        //toastMsg('danger', cb.message);
      }
    }).catch(err => {
      console.log(err);
      this.setState({
        _isSendToLoader: false
      })
      //toastMsg('danger', 'something wrong in network,please try after some time.')
    })
  }


  sendToLoader = () => {
    const { _isSendToLoader } = this.state
    //console.log('send to loader called', _isSendToLoader);
    if (_isSendToLoader) {
      return (
        // <View style={{ marginTop: dh * 0.3 }}>
        <Loader />

      )
    }

  }


  sendToUser = async (data) => {
    Keyboard.dismiss()
    console.log('data', data)
    const { selectedPostImage, followeeList } = this.state;
    const { navigation } = this.props;

    if (data.ChatUserId == undefined || data.ChatUserId == null || data.ChatUserId == "null") {
      // toastMsg('danger', `${data.UserName} has no chat user ID`)
      if(Platform.OS == 'ios'){
        alert(`You cannot send this post to ${data.UserName} without chat user unique ID`)
      }else{
        ToastAndroid.showWithGravityAndOffset(
          `You cannot send this post to ${data.UserName} without chat user unique ID`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
      
      return false;
    }

    data.buttonFlag = 'waiting';
    // data.sendingFlag = true;
    const index = followeeList.findIndex(d => d.ChatUserId == data.ChatUserId);
    followeeList[index] = data;

    this.setState({
      followeeList: followeeList
    });

    const datas = {
      occupants_ids: data.ChatUserId,
      name: data.UserName
    };

    console.log('the datas', datas);
    console.log('the followee list', followeeList)
    // const postImgUrl = selectedPostImage;

    await one2onechat.initChatForNF();
    const checkConn = await one2onechat.checkConnectionFromChatServerForNF();
    console.log('the conn', checkConn);
    if (checkConn) {
      this.createDialog(datas)
    } else {
      this.createSessionsNF(datas);
    }
  }

  createDialog = async (datas) => {
    console.log('the datasfrom', datas);

    const dialogs = await one2onechat.createDialogueForNF(datas);
    console.log('the dilgss', dialogs);
    if (dialogs === false) {
      // this.createDialog(datas);
      this.sendMessageToUser(dialogs);
      return false
    }
    this.sendMessageToUser(dialogs);
    // console.log('dilIDddsss NF', dialogs);
  }

  createSessionsNF = async (datas) => {
    const info = await one2onechat.createSessionForNF();
    console.log('object check', info)
    if (info.constructor == Object) {
      this.createConnectionToChatServer(datas);
    }

    // this.sendMessageToUser(false);
    //  else {
    //   this.createSessionsNF(datas);
    // }
  }

  createConnectionToChatServer = async (datas) => {
    const checkConSer = await one2onechat.createConnectionToServerForNF();
    // if(checkConSer){
    this.createDialog(datas)
    // }else{
    //   this.createConnectionToChatServer(datas);
    // }
  }

  sendMessageToUser = async (dialogs) => {
    const { selectedPostImage, followeeList, postId, feedData } = this.state;
    console.log('llll', dialogs);
    if(!dialogs){
      followeeList.map(d => d.buttonFlag = 'send');
      // followeeList[index] = { ...followeeList[index], buttonFlag: 'send' };
      this.setState({
        followeeList: followeeList
      })
      return false
    }
    const appUserId = await AsyncStorage.getItem('chatUserID');
    const sentId = dialogs.occupantsIds[0] === parseInt(appUserId)
      ? dialogs.occupantsIds[1]
      : dialogs.occupantsIds[0];
    console.log('the feed ids ', feedData);

    const msg = await one2onechat.sendMessageForNF(dialogs, selectedPostImage, feedData);
    // console.log('this is the msg', msg);
    if (msg) {
      const index = followeeList.findIndex(d => d.ChatUserId == sentId);
      followeeList[index] = { ...followeeList[index], buttonFlag: 'sent' };
      this.setState({
        followeeList: followeeList
      })
    } else {
      const index = followeeList.findIndex(d => d.ChatUserId == sentId);
      followeeList[index] = { ...followeeList[index], buttonFlag: 'send' };
      this.setState({
        followeeList: followeeList
      })
    }
  }

  hasNoData = () => {
    const { followeeList, _isSendToLoader } = this.state;
    if (followeeList.length === 0) {
      // console.log('if followee called', followeeList.length)
      return (
        <View style={stylesL.hasNoMem}>
          <Text style={{ color: '#4a4a4a', fontSize: 20 }}>No Users Yet..</Text>
        </View>)
    }
  }

  getRenderView(item) {
    return <View style={[Common_Style.StatusView, { width: '100%' }]}>
      {item.buttonFlag == 'waiting' && (
        <Text style={{ color: '#444', textAlign: 'center', 
        // fontSize: 14, fontFamily: Username.Font, 
        }}>
          Sending...
        </Text>
      )}

      {item.buttonFlag == 'sent' && (
        <Image source={require('../../Assets/Images/check.png')}
          resizeMode={'contain'}
          style={{ width: 20, height: 20, alignSelf: 'center' }}
        />
      )}

      <TouchableOpacity disabled={item.buttonFlag == 'sent' || item.buttonFlag == 'waiting'} onPress={() => this.sendToUser(item)}>

        {item.buttonFlag == 'send' && (
          <View style={{ backgroundColor: '#fb0042', borderRadius: 5, paddingLeft: 23.5, paddingRight: 23.5, paddingTop: 5, paddingBottom: 5, }}>
            <Text style={{ color: Common_Color.common_white, textAlign: 'center', 
            // fontSize: 14, fontFamily: Username.Font 
            }}>
              Send
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  }

  renderFooter() {
    return (
      <View style={{
        padding: 10, justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15
      }}>
        {this.state.dataEnd && (
          <Text style={{ color: '#FFF' }}>Follow more travellers for more content!</Text>
        )}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.state.fetching_from_server ? null : this.reloadMoreOn()}

          //On Click of button calling loadMoreData function to load more data
          style={{
            padding: 10,
            backgroundColor: '#00000000',
            borderRadius: 4,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>

          {this.state.fetching_from_server &&
            !this.state.dataEnd ? (
              <ActivityIndicator color="white" style={{ width: 30, height: 30 }} />
            ) :
            !this.state.dataEnd ?
              (<Image source={require('../../Assets/Images/reload-white.png')}
                style={{ width: 25, height: 25 }}
                 resizeMode={'center'}
                  />)
              : null
          }
        </TouchableOpacity>
      </View>
    );
  }

  reloadMoreOn = () => {
    //On click of Load More button We will call the web API again

    console.log('the load more data called')
    this.setState({ fetching_from_server: true })
    this.loadMoreData()
    // };

    // this.layoutContentOffset = currentOffset;
  }

  async reportApi() {
    // debugger;

    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Reportid: this.state.otherUserId,
      // Otheruserid: this.state.postId,
      Postid: this.state.postId,
      Content: this.state.permission_Value,
      TypeAs: "Newsfeed"
    };
    const url = serviceUrl.been_url + "/Reportpost";
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
        this.setState({ isModalVisible1: false, isModalVisible2: true, permission_Value: '' })
        //toastMsg('success', "Thank you for reporting");
      })
      .catch((error) => {
        //toastMsg('danger', 'Sorry..something network error.Try again please.')
      });
  }


  multiImage = ({ item }) => {
    var Image = data.Image.split(',')
    return (
      <ImageBackground style={{ width: '100%', height: 230, marginTop: '2%' }} source={{
        uri: serviceUrl.newsFeddStoriesUrl + item.Image
      }}>
        <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
          <View style={{ width: '87%', }}></View><View >
            <Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} source={require('../../Assets/Images/camera1.png')} ></Image></View>
        </View>
      </ImageBackground>
    )
  }
  

  unfollow = async (data) => {
    const { newsFeedData, otherUserId, } = this.state;
    var data = {
      Otheruserid: otherUserId,
      Userid: await AsyncStorage.getItem('userId')
    };
    const url = serviceUrl.been_url1 + "/Unfollow";
    let nfBackup = newsFeedData;
    const filteredData = newsFeedData.filter(d => d.userId !== otherUserId);
    this.setState({
      newsFeedData: filteredData,
      visibleModal: false
    });

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
        console.log('unfollow responses', responseJson);
        if (responseJson.status !== 'True') {
          this.setState({
            newsFeedData: nfBackup,
          })
        }
      })
      .catch((error) => {
        this.setState({
          newsFeedData: nfBackup,
        })
        console.log(error);
      });
  };

  mute = async (data) => {
    this.setState({ visibleModal: null });
    var data = {
      Otheruserid: this.state.otherUserId,
      Userid: await AsyncStorage.getItem('userId')
      // Userid:"5e1d7e4ff08ddb166184af2c"
    };
    const url = serviceUrl.been_url1 + '/MuteAccount'
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
        if (responseJson.status == 'True') {
          //toastMsg('success', responseJson.message)
          this.fetchDetails();

        }
      })
      .catch((error) => {
        console.log(error);
        //toastMsg('danger', 'Sorry..Something network error.please try again once.')
      });
  };

  follow = async (data) => {
    this.setState({ visibleModal: null });
    var data = {
      Otheruserid: this.state.postId,
      Userid: await AsyncStorage.getItem('userId')
    };
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
        if (responseJson.status == 'True') {
          //toastMsg("success", responseJson.message);
          this.fetchDetails();
        }
        else {
          //toastMsg('danger', responseJson.message)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    console.log("Visible items are", viewableItems + " " + changed);
  }
  _toggleModal12() {
    if (this.state.permission_Value == "" || null || undefined) {
      // toastMsg1('danger', "Please give a report")
      this.setState({
        reportEmpty: true
      })
      // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
    }
    else {
      this.setState({
        isModalVisible: null,
        isvisibleModal: null,
        //  permission_Value: "",
        isModalVisible1: !this.state.isModalVisible1
      });
      // this.report();
      this.reportApi();
    }
  }
  _toggleModal1() {
    this.setState({
      isModalVisible: null,
      isvisibleModal: null,
      permission_Value: "",
      modalVisible: '',
      isModalVisible1: !this.state.isModalVisible1
    });
  }

  editPost() {
    const { userDataForEdit } = this.state;
    console.log('the user data', userDataForEdit)
    this.setState({ visibleModal: false })
    if (Object.keys(userDataForEdit).length > 0) {
      this.props.navigation.navigate('EditPost', { data: userDataForEdit });
    }

  }

  deletePost() {
    if(this.state.visibleModal === 3 ){
    this.setState({
      //isModalVisible3: true,
      visibleModal: false,
       //isModalVisible3 : true
    })
    this.modalsTimeout = setTimeout(()=>{
      this.setState({
        isModalVisible3: true,
      })
    },500)
   }
  }

  onRefresh = (e) => {
    this.setState({
      isRefreshing: true
    })
    this.fetchDetails()

  }


  deleteData = async () => {
    debugger
    this.setState({ isModalVisible3: false, isModalVisible: false });
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      postid: this.state.postId
    };
    const url = serviceUrl.been_url1 + "/MemoriesDelete";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "True") {
          this.getAdminFeeds();
          //toastMsg('success', "Post is Deleted");

        }
        else {
          toastMsg1('danger',responseJson.message || 'something went wrong .')
          //toastMsg('danger', responseJson.message)
        }
      })
      .catch((error)=> {
        console.log('the delete err',error);
        toastMsg1('danger',error.message || 'something went wrong .')
        // reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  // async report() {
  //   var data = {
  //     Userid: await AsyncStorage.getItem('userId'),
  //     Otheruserid: this.state.postId,
  //     Content: this.state.permission_Value
  //   };
  //   const url = serviceUrl.been_url1 + "/ReportLocalProfile";
  //   return fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
  //     },
  //     body: JSON.stringify(data)
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       this.setState({ isModalVisible1: false, isModalVisible2: true, permission_Value: '' })
  //     })
  //     .catch((error) => {
  //       // //console.error(error);
  //     });
  // };

  renderViewMore(onPress) {
    return (
      <Text onPress={onPress} style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }}>View more</Text>)
    // <Text style={[Common_Style.viewMoreText,{marginTop: -12,marginLeft: '64%', }]} onPress={onPress}>View more</Text>)
  }
  renderViewLess(onPress) {
    return (
      // <Text onPress={onPress}
      // style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }}></Text>)
      <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }} onPress={onPress} >View Less</Text>)
  }

  addChoosedNF = (blobType) => {
    const { navigation } = this.props
    this.setState({
      isClickAddNF: false
    });
    let screenProps = blobType == 'Photos' ? 'NewsfeedUpload' : 'Vlog';
    // console.log('screen props',screenProps);
    //  navigation.navigate('Vlog');
    navigation.navigate('NFPicker', { screen: screenProps, type: blobType });
  }

  extractDesctiption = (data) => {

    if (data == undefined || data.length == 0) {
      return null;
    }
    return data[0].desc != undefined ? data[0].desc : null;
  }

  /*Video Controllers events */
  _singleTap = (data, index) => {
    this.setState({
      showControl: true,
      singleTapPostId: data.PostId,
    });

    clearTimeout(this.tapTimer);
    this.tapTimer = setTimeout(() => {
      this.setState({
        showControl: false,
        singleTapPostId: '',
      });
    }, 5 * 1000)
  }

  onloadVideo = ( meta, index, data) => {
    // if(index == 0){
      console.log('onload video index',index );
      console.log('meta',meta);
      console.log('-----------');
      console.log('onload data',data);
    // }

    const { newsFeedData } = this.state
    meta.duration = data.duration
    newsFeedData[index] = meta;
    this.setState({ newsFeedData })
  }

  onprogressVideo = (e,index,data) => {
    // console.log('the opv',e);
    const { newsFeedData } = this.state
    e.currentTime = data.currentTime
    newsFeedData[index] = e;
    this.setState({ newsFeedData })
    // this.setState({ currentTime })
  }

  loadStart = e => {
    // console.log('the load start', e)
  }
  loadEnd = (e,data,index) =>{
    console.log('the load end', e)
    const { newsFeedData } = this.state
    data.currentTime = 0.1,
    data.paused = !data.paused
    newsFeedData[index] = data;
    this.setState({ newsFeedData })
  }

  getSliderValue = (e, data, index) => {
    console.log('the duration', e * data.duration);
    this.player[index].seek(e * data.duration);
  }

  controlChanges = (e, index) => {
    //  console.log('the pause index',index);
    const { newsFeedData, mScrollIndex } = this.state;
    // const { newsFeedData } = this.state
    e.paused = !e.paused
    newsFeedData[index] = e;
    // this.setState({ newsFeedData })
    this.setState({
      paused: !this.state.paused,
      newsFeedData
    },()=>{
      setTimeout(()=>{
        this.setState({
          mScrollIndex: !this.state.paused ? -1 : index
        })
      },100)
    })
  }

  onBufferVideo = (e) => {
    // console.log('the buffr video', e);
  }

  VolumeControl = muted => {
    this.setState({
      volume: muted ? 0.0 : 1.0,
      volumeMuted: muted
    })
  }
  onVideoEnd = (data, index) => {
    this.player[index].seek(0);
    this.setState({
      mScrollIndex: -1
  })
    // this.setState({paused:true,currentTime:0})
  }

  videoError = (data,index,e) => {
    console.log('thee video error', e)
    console.log('--------------------');
    console.log('data',data);
    console.log('--------------------');
    console.log('index',index);
    const {newsFeedData} = this.state
    data = data
    data.duration = 0.8
    newsFeedData[index] = data
    setTimeout(()=>{
      console.log('the newsFeedData video err',newsFeedData[index]);
      this.setState({newsFeedData})
    },1 * 1000)
    
    // this.getAdminFeeds()
  }

  // onseek = (e) =>{
  //   this.setState({currentTime : e.currentTime})
  //   console.log('onseek',e)
  // }

  onseek = (e,data,index) => {
    const { newsFeedData } = this.state
    data.currentTime = e.currentTime
    newsFeedData[index] = data;
    console.log('onseek',e,index);
    this.setState({
      newsFeedData
    })
  }
  /* End Video Control Events */

 
  renderPostItem = (data, index) => {
    // console.log(' DeviceInfo',data?.duration);
    // if(data?.dummy){
    //   return false
    // }
    const videURL = data?.Image ? serviceUrl.newsFeddStoriesUrl + data.Image : null

    const {
      showControl,
      paused,
      volumeMuted,
      duration,
      volume,
      singleTapPostId,
    } = this.state;
    const currentTime  = data && data.currentTime || 0.0 ;
    const event = data?.Events && data?.Events[0] || {}
    const scale = event?.crops && event?.crops?.scale ? event?.crops?.scale : 1.0001;
    const trX =  event?.crops && event?.crops?.positionX && scale >= 1.01 ? event?.crops?.positionX : 0;
    const trY = event?.crops && event?.crops?.positionY && scale >= 1.01 ? event?.crops?.positionY : 0;
    return (
      data === undefined ?
      <View style={{ height:500,width:'100%',marginLeft: 'auto',marginRight: 'auto', marginBottom:1, backgroundColor: '#fff', borderWidth:.6, borderColor:'#c1c1c1', borderRadius:25, shadowColor: "#000",shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27,  shadowRadius: 4.65,elevation: 6,}}>
      <AdView  type="image" media={true} />
      </View>
      :
      data.Adname === undefined ? 
      <View key={index.toString()} style={[styles.card, { height: 'auto' }]}>
        <View style={styles.cardImage}>
          <View style={{ flexDirection: 'row', width: '100%', marginTop: index === 0 ? StatusBar.currentHeight: 0 }} >
            <View style={{ width: '10%' }} />
            <View style={{ marginTop: '2%', width: '80%', }}>
              {data.Location === "null" ? null : (<Text onPress={() => this.getLocation(data)}
                style={[Common_Style.cardViewLocationText, {}]}>
                {data.Location}
              </Text>)}
              {data.Country === "null" ? null : (<Text onPress={() => this.getLocation(data)}
                style={[Common_Style.cardViewLocationText, { marginBottom: 8 }]}>
                {data.Country}
              </Text>)}
            </View>

            <View style={{
              justifyContent: 'center', alignContent: 'center',
              width: '10%',
            }}>
              {data.userId == this.state.userId ?
                <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.openUserModal(data)}>
                  <View style={{ width: '10%', alignSelf: "center", marginRight: 5 }}>
                    <Image style={{ width: 16, height: 16, }}
                      source={require('../../Assets/Images/3dots.png')}
                   //   resizeMode={'center'}
                    ></Image>
                  </View>
                </TouchableOpacity>
                :
                data.PrmoteData == "Yes" ?
                  <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.modalOpen1(data)}>
                    <View style={{ width: '10%', alignSelf: "center", marginRight: 5 }}>
                      <Image style={{ width: 16, height: 16, alignSelf: "center" }}
                        source={require('../../Assets/Images/3dots.png')}
                    //    resizeMode={'center'}
                      ></Image>
                    </View>
                  </TouchableOpacity> :
                  <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.modalOpen(data)}>
                    <View style={{ width: '10%', alignSelf: "center", marginRight: 5 }}>
                      <Image style={{ width: 16, height: 16, alignSelf: "center" }}
                        source={require('../../Assets/Images/3dots.png')}
                      //  resizeMode={'center'}
                      ></Image>
                    </View>
                  </TouchableOpacity>}
            </View>
          </View>

          <TapGestureHandler ref={this.doubleTapRef}
            onHandlerStateChange={(event) => this._onDoubleTap(event, data)}
            numberOfTaps={2}
          >
            <View style={[styles.imageBackGroundView, { borderRadius: 15, height: hp('62%'), }]}>
              {data.Image != undefined && data.Image.indexOf(".mp4") != -1 ?
                <View style={{
                  width: "100%", height: "100%", overflow: 'hidden',
                  flexDirection: 'column',
                }}>

                  <TouchableWithoutFeedback onPress={() => this._singleTap(data, index)}>
                    {/* {data.mIndex == this.state.mScrollIndex && ( */}
                    <Video
                      ref={ref => { this.player[index] = ref }}
                      resizeMode="cover"
                      // source = {{uri:data.Image}}
                      source={{ uri: videURL}}
                      // paused={data.mIndex != this.state.mScrollIndex}
                      paused={data.paused}
                      repeat={true}
                      volume={volume}
                      controls={true}
                      onBuffer={this.onBufferVideo}
                      bufferConfig={{
                        minBufferMs: 15000,
                        maxBufferMs: 50000,
                        bufferForPlaybackMs: 2500,
                        bufferForPlaybackAfterRebufferMs: 5000
                      }}
                      onLoadStart={this.loadStart}
                      onEnd={e=>this.loadEnd(e,data,index)}
                      // onEnd={() => data.mIndex == this.state.mScrollIndex ? this.onVideoEnd(data, index) : null}
                      onError={this.videoError.bind(this,data,index)}
                      onSeek={e=>this.onseek(e,data,index)}
                      onLoad={this.onloadVideo.bind(this, data,index)}
                      minLoadRetryCount={2}
                      //onProgress={data.mIndex == this.state.mScrollIndex ? this.onprogressVideo : null}
                      // onProgress={e=>data.mIndex == this.state.mScrollIndex ? this.onprogressVideo(e,data,index) : null}
                      // resizeMode='cover'
                      onProgress={this.onprogressVideo.bind(this,data,index) }

                      style={{ width: wp('96%'), height: '100%' }}
                    />
                    {/* )} */}

                  </TouchableWithoutFeedback>
                  {this.state.dTapLikeEnable && data.PostId == this.state.tappedPostId && (
                    <View style={{
                      width: '100%', height: '100%', justifyContent: 'center',
                      ...StyleSheet.absoluteFillObject
                    }}>
                      <Image source={require('../../Assets/Images/new/LIKE-2.png')}
                        resizeMode={'contain'}
                        style={{ width: 50, height: 80, alignSelf: 'center', }}
                      />
                    </View>
                  )}
                  {/* {singleTapPostId == data.PostId && */}
                    {/* // data.mIndex == this.state.mScrollIndex &&  */}
                    {/* ( */}
                      <VideoController
                        showControl={false}
                        //showControl
                        // pause={data.mIndex != this.state.mScrollIndex}
                        pause={data.paused}

                        changeControl={() => this.controlChanges(data, index)}
                        totalDuration={getTime(data.duration)}
                        currentVidTime={getTime(currentTime)}
                        sliderValue={currentTime / data.duration}
                        sliderMovingValue={e => this.getSliderValue(e, data, index)}
                        volumeControl={this.VolumeControl}
                        volume={volumeMuted}
                      />
                    {/* )} */}


                </View>

                :

                <View style={{ height: '100%', }}>
                  <SelectedFilters images = {event}
                   childrenComponent = {(
                     <AnimatedImage style={{
                       width: '100%', height: '100%', transform: [
                        //  {  },
                         { scale: scale },
                         { translateX: trX },
                         { translateY: trY }
                       ]
                     }} resizeMode={'cover'}
                       source={data.Image == null ? require('../../Assets/Images/story2.jpg') :
                         {
                           // uri:data.Image
                           uri: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0]
                         }}

                     >
                        <View style={{
                          flexDirection: 'row', marginTop: '3%', marginRight: 5,
                          justifyContent: 'flex-end'
                        }}>
                          <View style={{ width: '88%', }}></View>
                          <View style={{ width: wp(10), height: hp(6), justifyContent: 'center' }}>
                            {data.Image.split(',').length > 1 ?
                              <TouchableOpacity activeOpacity={1} onPress={() => data.Image.split(',').length > 1 ? this.imageModal(data) : null} >
                                <Image style={{ width: wp(6), height: hp(4), marginTop: '5%', alignSelf: 'center' }}
                                  source={require('../../Assets/Images/MULTIPIC.png')}>
                                </Image>
                                {/* <Text style={{color:'green',padding:10,backgroundColor:'yellow'}}>asdsa</Text> */}
                              </TouchableOpacity>
                              :
                              <>
                              <Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} />
                                {/* <Text style={{color:'yellow',padding:10,backgroundColor:'green'}}>asdsa</Text> */}
                              </>
                            }
                          </View>
                        </View>
                        {this.state.dTapLikeEnable && data.PostId == this.state.tappedPostId && (
                          <View style={{
                            width: '100%', height: '75%', justifyContent: 'center',

                          }}>
                            <Image source={require('../../Assets/Images/new/LIKE-2.png')}
                              resizeMode={'contain'}
                              style={{ width: 50, height: 80, alignSelf: 'center', }}
                            />
                          </View>
                        )}

                      </AnimatedImage>
                     )}
                  />

                </View>


              }

            </View>
          </TapGestureHandler>

          <View style={{ flexDirection: 'row', marginTop: '2%', marginBottom: 10 }}>
            <View style={{ width: '85%' }}>
              <View style={{ flexDirection: 'row', }}>

                {data.VerificationRequest === "Approved" ? (
                  <View >
                    {data.UserProfilePic === undefined || data.UserProfilePic === null ? (
                      <View >
                        <Image style={[Common_Style.mediumAvatar, { marginTop: 8 }]}
                          source={{
                            uri: serviceUrl.profilePic + data.UserProfilePic
                          }}></Image>
                      </View>)
                      : (
                        <ImageBackground style={[Common_Style.mediumAvatar,]} borderRadius={50}
                          source={{ uri: serviceUrl.profilePic + data.UserProfilePic }}>
                          <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImagesmall} />
                        </ImageBackground>
                      )}
                  </View>
                ) :
                  (<View>
                    {data.UserProfilePic === undefined || data.UserProfilePic === null ?
                      <Image style={[Common_Style.mediumAvatar, { marginTop: 5 }]}
                        source={require(imagePath + 'profile.png')}></Image>
                      :
                      <Image style={[Common_Style.mediumAvatar, { marginTop: 5 }]}
                        source={{ uri: serviceUrl.profilePic + data.UserProfilePic }}></Image>}
                  </View>)}


                <View style={{ width: '80%', justifyContent: 'center', padding: 2 }}>
                  <Text onPress={() => this.OtheruserDashboard(data)} style={[Common_Style.userName,
                  { marginTop: 0, marginLeft: '2%', marginBottom: 0, }]}>
                    {data.UserName}
                  </Text>
                </View>
              </View>

              <View style={{
                width: '85%', height: 'auto', marginTop: -10, marginBottom: 0, marginLeft: 4,
                flexDirection: 'row', padding: 4,
              }}>
                <View style={{ width: 30, height: 30, marginLeft: 4, }} />
                <ViewMoreText
                  numberOfLines={2}
                  renderViewMore={this.renderViewMore}
                  renderViewLess={this.renderViewLess}
                >

                  <ParsedText style={[Common_Style.descriptionText, { fontSize: Description.FontSize, fontFamily: Description.Font }]}
                    parse={[{ pattern: /#(\w+)/, style: Common_Style.hashtagColor },]}  >

                    {this.extractDesctiption(data.Desc)}

                  </ParsedText>

                </ViewMoreText>
              </View>
            </View>

            <View style={{ width: '100%', height: 80, justifyContent: 'space-evenly', marginRight: '100%' }}>
              {/* Like  */}
              <View style={{ flexDirection: 'row', marginRight: '100%', width: '100%', }}>
                <View style={{ width: 25, height: 25 }}>
                  <TouchableOpacity onPress={() => { this.likes(data) }}>
                    <Image style={{ width: '130%', height: '110%', }} resizeMode={'contain'} source={
                      data && data.userLiked && data.userLiked == true ?
                        require('../../Assets/Images/new/LIKE-2.png') :
                        require('../../Assets/Images/new/likeBlack.png')}></Image>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.likesView(data)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
                  <Text onPress={() => this.likesView(data)} style={[Common_Style.countFont, { marginLeft: 12, marginTop: 7,fontFamily:'Arial' }]} >
                    {data.LikeCount != 0 || null || undefined ? data.LikeCount : 0}
                  </Text></TouchableOpacity>
              </View>

              {/* Comment  */}
              <View style={{ flexDirection: 'row', marginTop: 8, }}>
                <View style={{ width: 25, height: 25 }}>
                  <TouchableOpacity onPress={() => { this.comments(data) }}>
                    <Image style={{ width: '130%', height: '110%', }} resizeMode={'contain'}
                      source={require('../../Assets/Images/new/commentBlack.png')} ></Image>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.comments(data)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
                  <Text onPress={() => this.comments(data)} style={[Common_Style.countFont, { marginLeft: 12, marginTop: 8 ,fontFamily:'Arial'}]} >
                    {data.Commentcount != 0 || null || undefined ? data.Commentcount : 0}
                  </Text></TouchableOpacity>
              </View>

            </View>
          </View  >

          {data.SponsoredBy != null && data.SponsoredBy != 'null' ?
            <Text style={{ textAlign: 'center', color: '#ff5555', fontFamily: Viewmore.Font, fontSize: Viewmore.FontSize, marginVertical: 5, marginTop: -20, marginBottom: 10 }}>Sponsored by {data.SponsoredBy}</Text>
            : null}
        </View>
      </View> 
      :
      <View style={{...styles.card,height:420,}}>
      <View style={styles.cardImage}>
         
      <ImageBackground borderRadius={8} style={{ width: '100%', height:360,marginTop:10}} resizeMode={'cover'}
                 source={data.NewsFeedPost == null ? require('../../Assets/Images/story2.jpg') : 
                  {  uri: serviceUrl.newsFeddStoriesUrl + data.NewsFeedPost.split(',')[0] 
                  }}>
                       <TouchableOpacity style={{width:'100%',height:'100%'}} 
                       onPress={()=>this.openAdminURl(data)}></TouchableOpacity>
               </ImageBackground>
               </View>
      </View>
      
          )
        }
      
        openAdminURl(data){
          console.log('the openURL',data)
          data.link && Linking.openURL(data.link)
        }

    

  render() {
    const { profilePic, } = serviceUrl
    const translateY = this.diffClamp.interpolate({
      inputRange: [0, 40],
      outputRange: [0, 55]
    });

    return (
      <View style={{ flex: 1,}}>

        {/* <StatusBar translucent backgroundColor="transparent" /> */}

        <StatusBar  translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle='dark-content' />
        
        {/* <Toolbar {...this.props} showBackIcon={false} centerTitle='Newsfeed' /> */}
        {/* <View> */}

        {!this.state.isLoading && this.state.newsFeedData.length > 0 ?
          <View style={{ height: Platform.OS == 'ios' ?  dh : dh + StatusBar.currentHeight, backgroundColor: 'black', }} >

            <FlatList 
              style={{}}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.y / event.nativeEvent.layoutMeasurement.height)
                this.setState({ mScrollIndex: index })
              }}
              data={this.state.newsFeedData}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              renderItem={({ item, index }) => (
                this.renderPostItem(item, index)
              )}
              scrollEventThrottle={16}
              onScroll={this.onscrollEvents}
              onEndReached={this.onScrollEndHandler}
              onEndThreshold={100}
              ListFooterComponent={this.renderFooter.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
            //  pagingEnabled
            />

          </View>
          :
          !this.state.isLoading && this.state.newsFeedData.length == 0 ?
            <View style={{
              height: '100%', justifyContent: 'center',
              alignSelf: 'center',
            }} >
              <Image source={require('../../Assets/Images/3099422-512.png')}
                //resizeMode={'center'} 
                style={{ width: 100, height: 100 }} />
              <Text style={{ textAlign: 'center' }}>No Feeds Yet</Text>
            </View>
            :
            <View style={{ flex: 1, flexDirection: "column", marginTop: '45%' }} >
              <Spinner color="#fb0143" />
            </View>
        }

        {/* User Modal */}

        <Modal isVisible={this.state.visibleModal === 3}
          onBackdropPress={() => this.setState({ visibleModal: false })}
          onBackButtonPress={() => this.setState({ visibleModal: false })} 
        >
          <View style={styles.modalContent} >
            {/* <StatusBar backgroundColor="rgba(0,0,0,0.3)" barStyle="light-content" /> */}
            {/* <StatusBar hidden /> */}
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

            <View style={{ width: '100%' }}>
              <TouchableOpacity onPress={() => this.editPost()}>
                <Text style={styles.modalText}>
                  Edit
              </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalSeparator} />

            <View style={{ width: '100%' }}>
              <Text onPress={() => this.sendTo()} style={styles.modalText}>
                Send
                </Text></View>
            <View style={styles.horizontalSeparator} />

            <View style={{ width: '100%' }} >
              <TouchableOpacity onPress={() => this.share_option()}>
                <Text style={styles.modalText}>
                  Share
               </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.horizontalSeparator} />

            <View style={{ width: '100%' }}>
              <TouchableOpacity onPress={() => this.writeToClipboard()}>
                <Text style={styles.modalText}>
                  Copy Link
                                           </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalSeparator} />


            <View style={{ width: '100%' }}>
              <TouchableOpacity onPress={() => this.deletePost()}>
                <Text style={[styles.modalText, { color: '#fb874c' }]}>
                  Delete Post
               </Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>


        <Modal
          isVisible={this.state.visibleModal}
          onBackdropPress={() => this.setState({ visibleModal: false })}
          onBackButtonPress={() => this.setState({ visibleModal: false })}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
          <View style={styles.modalContent}>
            {/* <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" /> */}
            {/* <StatusBar hidden /> */}
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.bookmarkLikes() }}>

              <View style={{ width: '100%' }}>
                {this.state.userBookmarkState == true ?
                  <Text onPress={() => { this.bookmarkLikes() }}
                    style={styles.modalText}>
                    Saved
                   </Text> :
                  <Text onPress={() => { this.bookmarkLikes() }}
                    style={styles.modalText}>
                    Save Post
                </Text>}
              </View>

            </TouchableOpacity>

            <View style={styles.horizontalSeparator} />

            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.sendTo() }>
              <View style={{ width: '100%' }} >
                <Text  style={styles.modalText}>
                  Send
              </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.horizontalSeparator} />

            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.notifyData()}>
              <View style={{ width: '100%' }}>
                <Text onPress={() => this.notifyData()} style={styles.modalText}>
                  Turn {this.state.notifications} Notifications
                </Text></View>
            </TouchableOpacity>
            <View style={styles.horizontalSeparator} />

            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.share_option()}>
              <View style={{ width: '100%' }} >
                <Text onPress={() => this.share_option()}
                  style={styles.modalText} >
                  Share
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.horizontalSeparator} />

            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.writeToClipboard()}>
              <View style={{ width: '100%' }} >
                <Text onPress={() => this.writeToClipboard()} style={styles.modalText}>
                  Copy link
                </Text></View>
            </TouchableOpacity>
            <View style={styles.horizontalSeparator} />

            <TouchableOpacity onPress={() => this.unfollow()} style={{ width: '100%', }}>
              <View style={{ width: '100%' }}>
                <Text onPress={() => this.unfollow()} style={[styles.modalText, { color: '#708fd5' }]}>
                  Unfollow account
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.horizontalSeparator} />

            <TouchableOpacity onPress={() => this.reportTo()} style={{ width: '100%', }}>
              <View style={{ width: '100%' }}>
                <Text onPress={() => this.reportTo()} style={[styles.modalText, { color: '#e45d1b' }]}>
                  Report post
                </Text></View>
            </TouchableOpacity>

            {/* <View style={styles.horizontalSeparator} /> */}

            {/* <TouchableOpacity onPress={() => { this.mute() }} style={{ width: '100%', }}>
              <View style={{ width:'100%' }}>
                <Text onPress={() => { this.mute() }} style={[styles.modalText, { color: '#708fd5' }]}>
                  Mute
                </Text>
              </View>
            </TouchableOpacity> */}

          </View>
        </Modal>


        <Modal
          isVisible={this.state.isSelectSendTo}
          useNativeDriver={true}
          // onSwipeComplete={this.close}
          onBackdropPress={() => this.setState({ isSelectSendTo: false })}
          onBackButtonPress={() => this.setState({ isSelectSendTo: false })}
          // swipeDirection={['down']}
          avoidKeyboard={true}
          style={{
            margin: 0, padding: 0
          }}
          ref={"modal"}
        >
          <KeyboardAvoidingView style={[stylesL.keyAvoidView]}
          //stylesL.keyAvoidView
            behavior={'height'} 
            // keyboardVerticalOffset={10}
            // enabled
          >
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
            <View style={{ backgroundColor: '#fff', height: hp('70%'), width: '100%', justifyContent: 'center', alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.1)', borderTopRightRadius: 15, borderTopLeftRadius: 15 }}>
              <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

              <View style={{
                flexDirection: 'row', width: wp('100%'), justifyContent: 'space-between', height: 12, marginTop: 10,
                //  borderBottomColor: '#a7a7a7', borderBottomWidth: 0.5 

              }}>
                <View>
                  <Text style={{ fontSize: 14, fontFamily: Username.Font, color: '#222', marginLeft: 20 }}>
                    {/* Send To */}
                  </Text>
                </View>


                <TouchableOpacity onPress={() => this.setState({ isSelectSendTo: false })}>
                  <View style={{ width: '100%', marginBottom: 10, justifyContent: 'center' }}>
                    {/* <Icon
                        name={"chevron-down" }
                        size={Platform.OS === "ios" ? 30 : 26}
                        color="#000"
                        type="material-community"
                        // onPress={}
                        iconStyle={{marginRight: 26,}} 
                        /> */}
                    <Image style={{ width: 24, height: 24, marginRight: 20, marginTop: 5 }}
                      source={require('../../Assets/Images/close_black.png')}
                      resizeMode={'contain'} 
                      />
                    {/* <Image style={{ width: 22, height: 22, marginRight: 30, }}
                      source={require('../../Assets/Images/downarrow.png')} /> */}
                  </View>
                </TouchableOpacity>

              </View>



              <View style={[Common_Style.searchView, { width: wp('97%'), margin: 5 }]}>
                <RNTextInput value={this.state.text}
                  onChangeText={text => this.SearchFilterFunction1(text)}
                  style={[Common_Style.searchTextInput, { width: wp(96), height: 40, paddingLeft: '5%', }]}
                  placeholder={'Search'}
                  // value={this.state.text}
                  autoCorrect={false}
                  
                  theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#00000000', underlineColor: '#00000000', fontSize: 16, paddingLeft: 5 } }}
                  placeholderTextColor={'#6c6c6c'} />
              </View>


              <View style={{ flex: 1 }}>
                {this.sendToLoader()}
                <FlatList
                  data={this.state.followeeList}
                  // ItemSeparatorComponent={seperator()}
                  extraData={this.state}
                  keyboardShouldPersistTaps="always"
                  onScroll={() => Keyboard.dismiss()}
                  renderItem={({ item, index }) => (

                    <View key={`id${index}`} style={{ flexDirection: 'row', height: 70, width: wp('100%'), justifyContent: 'flex-start' }}>
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
                  horizontal={false}
                />
                {/* </KeyboardAvoidingView> */}
              </View>
              {/* </ScrollView> */}
              {/* {this.hasNoData()} */}
            </View>
            </TouchableWithoutFeedback>

          </KeyboardAvoidingView>
        </Modal>


        {/* choose add news feed */}
        <Modal
          isVisible={this.state.isClickAddNF}
          useNativeDriver={true}
          // onSwipeComplete={this.close}
          swipeDirection='down'
          swipeThreshold={90}
          onBackdropPress={() => this.setState({ isClickAddNF: false })}
          onBackButtonPress={() => this.setState({ isClickAddNF: false })}
          animationIn='slideInUp'
          animationInTiming={300}
          animationOut='slideOutDown'
          animationOutTiming={300}
          onSwipeComplete={() => this.setState({ isClickAddNF: false })}
          avoidKeyboard={true}
          style={{         margin: 0, padding: 0  }}
          ref={"modal"}
        >
          <View style={{ flex: 1, }}>
            <StatusBar backgroundColor='rgba(0,0,0,0.7)' barStyle='light-content' />
            <View style={{ backgroundColor: '#fff', height: hp('60%'), width: '100%', borderColor: 'rgba(0, 0, 0, 0.1)', borderTopRightRadius: 15, borderTopLeftRadius: 15, bottom: 0, position: 'absolute' }}>
              <View style={{ height: hp('5%'), width: wp('100%'), justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ width: 30, height: 5, borderRadius: 20, backgroundColor: '#1c1c1c', }} />
              </View>
              {/* Main View */}
              <View style={{ height: hp('55%'), width: wp('100%'), flexDirection: 'column', }}>
                {/* left portion MPost */}
                <TouchableHighlight activeOpacity={1} underlayColor={'#b8b8b81c'} style={{ height: '50%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => this.addChoosedNF('Photos')} >
                  <View style={{ width: wp('100%'), flexDirection: 'column', alignItems: 'center' }}>
                    <Image source={require('../../Assets/Images/Mpost-Selected.png')}
                      style={{ width: 40, height: 40, marginBottom: 5 }} />
                    <Text style={{ fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, textAlign: 'center' }}>
                      Memory Post</Text>
                    <Text style={{ color: '#313131', fontSize: 10, fontFamily: Common_Color.fontLight, textAlign: 'center' }}>
                      Click to select pictures for Memory
                     </Text>
                  </View>
                </TouchableHighlight >

                {/* Right portion Vlog post */}
                <TouchableHighlight activeOpacity={1} underlayColor={'#b8b8b81c'} style={{ height: '50%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => this.addChoosedNF('Videos')} >

                  <View style={{ width: wp('100%'), flexDirection: 'column', alignItems: 'center' }}>
                    <Image source={require('../../Assets/Images/Vlog-Selected.png')}
                      style={{ width: 40, height: 40, marginBottom: 5 }} />
                    <Text style={{ fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, textAlign: 'center' }}>
                      Vlog</Text>
                    <Text style={{ color: '#313131', fontSize: 10, fontFamily: Common_Color.fontLight, textAlign: 'center' }}>
                      Click to select videos for Video Logs
                     </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>

        {/* Report models */}
        <Modal isVisible={this.state.isModalVisible1}
          onBackdropPress={() => this.setState({ isModalVisible1: null })}
          onBackButtonPress={() => this.setState({ isModalVisible1: null })} >
          <View style={[Common_Style.parentViewReport, { borderRadius: 25, justifyContent: 'center', }]} >
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <Image style={[{ marginTop: 10, alignSelf: 'center', width: 42, height: 42 }]} source={require('../../Assets/Images/new/Expression.png')} resizeMode={'contain'} />
            <Text style={Common_Style.headerReport} >
              Inappropriate Content!
                  </Text>
            <Text style={Common_Style.subHeaderReport} >
              We are sorry for the inconvenience!
                  </Text>
            <View style={[Common_Style.contentViewReport, { alignSelf: 'center', }]}>
              <Text style={Common_Style.contentReport} >
                We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
                   </Text>
            </View>
            <TextInput
              label=" Type Here..."
              placeholderStyle={Common_Style.PstyleReport}
              mode="outlined"
              multiline={true}
              maxLength={500}
              autoCorrect={false}
              
              // flexWrap: 'wrap'
              error={this.state.reportEmpty}
              onChangeText={(text) => { this.setState({ permission_Value: text, reportEmpty: false }) }}
              value={this.state.permission_Value}
              style={[Common_Style.TstyleReport, { marginLeft: 0, alignSelf: 'center' }]}
              selectionColor={'#f0275d'}
              theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />



            <View style={[Common_Style.buttonViewReport]} >

              <TouchableOpacity
                onPress={() => this._toggleModal12()}
                activeOpacity={1.5}
              >
                <LinearGradient
                  start={{ x: 0, y: 0.75 }}
                  end={{ x: 1, y: 0.25 }}
                  style={Common_Style.ButtonReport}
                  colors={["#fb0043", "#fb0043"]}
                >

                  <Text onPress={() => this._toggleModal12()}
                    style={Common_Style.ButtonTextReport}>
                    Report
                                                        </Text>
                </LinearGradient>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => this._toggleModal1()}
                activeOpacity={1.5}
              >
                <View style={Common_Style.ButtonCancel}>
                  <Text onPress={() => this._toggleModal1()} style={Common_Style.CancelButtonTextReport}>
                    Cancel
</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>



        {/* Thanks Modal */}
        <Modal isVisible={this.state.isModalVisible2}
          onBackdropPress={() => this.setState({ isModalVisible2: false })}
          onBackButtonPress={() => this.setState({ isModalVisible2: false })} >
          <View style={[Common_Style.TparentView, { borderRadius: 25, justifyContent: 'center' }]} >
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <Text style={Common_Style.TheaderInModalTwo} >
              Thank you for your voice!
            </Text>

            <View style={[Common_Style.TcontentViewInModalTwo, { alignSelf: 'center' }]}>
              <Text style={Common_Style.TcontentTextInModalTwo} >
                We would like to show you our utmost gratitude for raising your voice against inappropriate behaviour and thus helping in making this a safe and happy place for people around you!
              </Text>
              <Text style={[Common_Style.TcontentTextInModalTwo, { marginTop: 10 }]} >
                Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
              </Text>
            </View>

            {/* <View style={Common_Style.TcontentViewInModalTwo}>
              <Text style={[Common_Style.TcontentTextInModalTwo, { marginTop: 40 }]} >
                Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
</Text>
            </View> */}
            <View style={Common_Style.TokayButton}>
              <TouchableOpacity onPress={() => this.setState({ isModalVisible2: false })} activeOpacity={1.5} >
                <Text onPress={() => this.setState({ isModalVisible2: false })} style={Common_Style.TokayButtonText}>
                  Okay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>



        {/* Delete Modal */}
        <Modal isVisible={this.state.isModalVisible3}
          onBackdropPress={() => this.setState({ isModalVisible3: false })}
          onBackButtonPress={() => this.setState({ isModalVisible3: false })} >
          <View style={styles.deleteModalView} >

            <View style={{  }}>
              <Text style={{ color: '#555', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 12 }}>
                Are you sure you want to delete this post?
                </Text>
            </View>

            <View style={[Common_Style.Common_button, { width: wp(88), margin: 3 }]}>

              <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                borderRadius={10}
              >
                <TouchableOpacity onPress={() => { this.deleteData() }}>
                  <Text onPress={() => { this.deleteData() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Delete</Text>
                </TouchableOpacity>
              </ImageBackground>

            </View>
            <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
              <TouchableOpacity onPress={() => { this.setState({ isModalVisible3: false }) }}>

                <Text onPress={() => { this.setState({ isModalVisible3: false }) }} style={[Common_Style.Common_btn_txt, { color: Common_Color.common_black, alignItems: 'center', justifyContent: 'center', }]}>Cancel</Text>
              </TouchableOpacity>

            </View>

          </View>
        </Modal>


        {/* <View style={{ backgroundColor: 'red', width: wp('100%'),justifyContent:'flex-end', height: dh * .08 }}> */}
        {/* {this.scrollDirection && 
       (  */}
        <Animated.View style={{
          width: 55, height: 55, bottom: 20, position: 'absolute',
          overflow: 'hidden', zIndex: 100, justifyContent: 'center', alignSelf: 'center',
          elevation: 4,
          transform: [{
            translateY: translateY,
          }]
        }}>
          <TouchableOpacity onPress={() => this.newsFeedUpload()} >
            <Image style={{ width: 55, height: 55, }}
              source={require('../../Assets/Images/NF_add_post.png')}
             // resizeMode={'center'}
            />
          </TouchableOpacity>
        </Animated.View>
        {/* )
      } */}

        {/* </View> */}
      </View>
    )
  }
}

const stylesL = {
  modalText: { color: '#acacac', textAlign: 'center', marginTop: hp('2%'), marginBottom: hp('1.3%') },
  view: {
    justifyContent: 'flex-end', width: wp('100%'), margin: 0,
    backgroundColor: '#00000000'
  },
  textInput: {
    width: wp('90%'), height: 45, marginBottom: 10, color: '#000',
    marginTop: 12, padding: 15, justifyContent: 'center', alignContent: 'center',
    alignSelf: 'center'
  },
  hideButton: {
    // backgroundColor: "#87cefa",
    alignItems: "center",
    justifyContent: "center",
    // borderBottomRightRadius:10,
    // borderBottomLeftRadius:10,
    height: hp("6%"),
    width: wp("100%"),

  },
  LoginButtontxt: {
    color: "#fff",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 16,
  },
  searchBar: {
    flexDirection: 'row', width: wp('90%'), backgroundColor: '#ffffff',
    height: 45, marginBottom: 0, borderRadius: 20, marginTop: 0, paddingLeft: 20,
    borderWidth: 1.2, borderColor: '#ededef', borderBottomWidth: 1,
    borderBottomColor: '#d7d7d7', marginLeft: 12, marginRight: 12
  },
  keyAvoidView: {
    position: 'absolute',
    height: hp('70%'), width: wp('100%'), bottom: 0, left: 0, right: 0,
    backgroundColor: 'transparent',
  },
  hasNoMem: {
    justifyContent: 'center', alignItems: 'center',
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  }
}