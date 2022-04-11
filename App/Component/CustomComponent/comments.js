import React, { Component } from 'react';
import {
  View, Text, KeyboardAvoidingView, Platform, Keyboard, ToastAndroid,
  TouchableOpacity, Image, StatusBar, FlatList, ImageBackground,
  TextInput as RNTextInput,NativeModules, StatusBarIOS,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import { TextInput,} from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Header, Container, Footer, FooterTab, Content, Button, Spinner, Left } from "native-base";
import { Toolbar, HBTitleBack } from '../commoncomponent'
import Common_Style from '../../Assets/Styles/Common_Style'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const { StatusBarManager } = NativeModules;

import styles from '../../styles/NewfeedImagePost';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { deviceHeight, deviceWidth } from '../_utils/CommonUtils';
import styles1 from '../../styles/NewfeedImagePost';
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';
var PostId;
var replyState = '';
var replyValues = ''
export default class comments extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    commentsMessage: '',
    userId: '',
    UserName: '',
    appUserId: "",
    UserProfilePic: '',
    PostId: '',
    Description: '',
    messageData: '',
    UserIdComment: '',
    commentID: '',
    replyState: false,
    commentReply: '',
    permission_Value: '',
    isModalVisible1: false,
    isModalVisible2: false,
    isModalVisible3: false,
    isOpenBottomModal: false

  }

  async UNSAFE_componentWillMount() {
    this.getCommment();
   // debugger;
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      async () => {
        var userId = await AsyncStorage.getItem('userId');
        console.log('the navigations',this.props);
        const Comments = this.props.route.params.data

        console.log('data cdmount', Comments)
        this.setState({
          PostId: Comments.Postid === undefined ? (Comments.PostId) : (Comments.Postid),
          userId: Comments.UserId != undefined ? Comments.UserId : userId,
          UserName: Comments.UserName != null ? Comments.UserName : name,
          UserProfilePic: Comments.UserProfilePic != null ? Comments.UserProfilePic : Comments.ProfilePic,
          Description: Comments.Description,
        })
        console.log('data', this.state.PostId)
        // this.getCommment();
        console.log('data', this.state.PostId)
        this.getCommment();
      });
  }



  async OtheruserDashboard(item) {
   // debugger;
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Otheruserid: item.UserId
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
          AsyncStorage.setItem('OtherUserId', item.UserId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item.UserId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item.UserId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item.UserId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "Pending") {
          AsyncStorage.setItem('OtherUserId', item.UserId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item.UserId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item.UserId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item.UserId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "False") {
          AsyncStorage.setItem('OtherUserId', item.UserId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('OtherUserId', item.UserId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('OtherUserId', item.UserId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('OtherUserId', item.UserId);
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
  commentpost = text => {
    this.setState({
      commentsMessage: text
    });
  };

  replystate(item) {
    //// debugger;
    replyState = true;
    this.setState({
      replyState: true,
      replyUserName: item.UserName
    }, () => {
      if (this.textInputField) this.textInputField.focus()
    })
    replyValues = item;
    // if(this.state.replyState) this.textInputField.focus();
    console.log('reply values', replyValues)
    // this.getCommment()
  }
  async CommentApi() {
    this.setState({
      loaderForSend : true
    })
    
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Postid: this.state.PostId,
      Comments: this.state.commentsMessage
    };

    console.log('hellow comments', data);
    const url = serviceUrl.been_url1 + "/comments";
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('after get comm response', responseJson);
        if (responseJson.status == "true") {
          this.getCommment()
        }
        else { this.getCommment() }
      })
      .catch((error)=> {
        this.setState({
          loaderForSend : false
        })
        console.log("Catch Error", error);
      });

  }

  getCommment() {
   // debugger;
    var data = { PostId: this.state.PostId };
    const url = serviceUrl.been_url1 + "/GetComment"
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
     }).then((response) => response.json())
      .then((responseJson) => {
        console.log('response commentss', responseJson)
        if (responseJson.status == "True") {
          this._dataMerger(responseJson)
        }
      })
      .catch((error)=> {
        this.setState({
          loaderForSend : false
        })
        console.log("Catch Error", error);
      });
  }

  _dataMerger = (responseJson) => {
    let likeStatus = responseJson;
    let commentsData = responseJson;
    likeStatus.Getcomments && likeStatus.Getcomments.length > 0 && likeStatus.Getcomments.map(item => {
      commentsData.result && commentsData.result.length > 0 && commentsData.result.map(moment => {
        if (moment.CommentId === item.cmid) {
          moment.userLiked = true;
        }
        return moment;
      });
      return item;
    });

    let comments = responseJson.result;
    let commentReplies = responseJson.CommentRep;
    let likedComments = responseJson.Getcomments;
    commentReplies = commentReplies.length > 0 && commentReplies.map(v => {
      v.data.length > 0 && v.data.map(s => {
        s.userLiked = false;
        likedComments.length > 0 && likedComments.map(f => {
          if (s._id == f.cmid) {
            s.userLiked = true;
          }
        })
        return s;
      });
      return v;
    });



    let commentsTotalData = comments.length > 0 && comments.map(m => {
      commentReplies.length > 0 && commentReplies.map(s => {
        if (m.CommentId == s._id) {
          m.commentReplies = s.data
        }

      })
      return m;
    })

    console.log('comments total data', commentsTotalData);

    this.setState({
      messageData: commentsTotalData ? commentsData.result : '',
      commentsMessage: '',
      loaderForSend : false

    })
    // console.log("Messages data"+ this.state.messageData)
    // console.log('comment replies' + this.state.commentReplyData)
  };



  likesView(data) {
   // debugger;
  // console.log(data)
    var data = {
      data: data.PostId === undefined ? data._id : data._id,
      likescount : data.Commentslikes,
      screen: "CommentsLikes"
    }
    this.props.navigation.navigate('CommentsLikes', { data: data });
  }

  likesViewMain(data) {
   // debugger;
   console.log(' the likes ', data);
    var data = {
      data: data.PostId === undefined ? data.CommentId : data.CommentId,
      screen: "CommentsLikes",
      likescount : data.Commentslikes
    }
    this.props.navigation.navigate('CommentsLikes', { data: data });
  }



  async likes(item) {
    debugger
    var id = await AsyncStorage.getItem("userId");
    var data = {
      Userid: id,
      postid: item.Postid,
      cmid: item.CommentId == undefined || null ? item._id : item.CommentId
    };
    const url = serviceUrl.been_url1 + "/commentslike";
    //const url = serviceUrl.been_url + "/commentslike";
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
      },
      body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "True") {
          this.getCommment();
          ////toastMsg('success', responseJson.message)
        }
        else {
          this.setState({ likes: false })
          ////toastMsg('danger', response.message)
        }
      })
      .catch(function (error) {
        console.log("Catch Error", error);
      });
  }


  async CommentReplyApi() {
    this.setState({
      loaderForSend : true
    })

    var id = await AsyncStorage.getItem("userId");
    var data = {
      Userid: id,
      Postid: replyValues.Postid,
      cmid: replyValues.CommentId !== undefined ?
        replyValues.CommentId : replyValues.RCmid,
      CommentRep: this.state.commentReply
    };

    // console.log('the id',replyValues.CommentId,' and its type',typeof replyValues.CommentId)
    // console.log('the data',data);
    const url = serviceUrl.been_url1 + "/Commentreplies";
    //const url = serviceUrl.been_url + "/commentslike";
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
      },
      body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('the reply resp', responseJson);
        if (responseJson.status == "True") {
          replyState = ''
          this.setState({ commentReply: '', replyState: false,loaderForSend:false })
          this.getCommment();
          //toastMsg('success', responseJson.message)
        }
        else {
          this.setState({
            loaderForSend : false
          })
          //toastMsg('danger', response.message)
        }
      })
      .catch((error)=> {
        console.log("Catch Error", error);
        this.setState({
          loaderForSend : false
        })
      });
  }


  _toggleModal12() {
   // debugger;
    if (this.state.permission_Value == "" || null || undefined) {
      toastMsg1('danger', "Please give a report")
     // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
    }
    else {
      this.setState({
        isOpenBottomModal: null,
        isModalVisible1: !this.state.isModalVisible1
      });
      this.report();
    }
  }
  _toggleModal1() {
    this.setState({
      permission_Value: "",
      isModalVisible1: !this.state.isModalVisible1
    });
  }

  openModal(item) {

    this.setState({
      commentID: item.CommentId == undefined ? item._id : item.CommentId,
      UserIdComment: item.UserId,
      isOpenBottomModal: true,

    })
  }

  deletePost() {
    this.setState({
      isModalVisible2: false,
      isOpenBottomModal: false,
    },()=>{
      setTimeout(()=>{
        this.setState({
          isModalVisible3: true,
        })
      },300)
    })
  }

  deleteData = async () => {
    debugger
    this.setState({ isModalVisible3: false, isOpenBottomModal: false });
    var data = {
      commentId: this.state.commentID
    };

    // console.log('the deeee',data);
    const url = serviceUrl.been_url1 + "/DeleteComments";
    return fetch(url, { method: "POST", headers: headers, body: JSON.stringify(data) })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "True") { this.getCommment(); }
        else { }
      })
      .catch(function (error) {
        this.setState({ isLoading: false });
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }


  async report() {

    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Otheruserid: this.state.UserIdComment,
      Content: this.state.permission_Value
    };
    const url = serviceUrl.been_url1 + "/ReportOtheruser";
    // var data = {
    //   Userid: await AsyncStorage.getItem('userId'),
    //   Reportid: this.state.otherUserId,
    //   // Otheruserid: this.state.postId,
    //   Postid: this.state.postId,
    //   Content: this.state.permission_Value
    // };
    // const url = serviceUrl.been_url + "/Reportpost";
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
      })
      .catch((error) => {
        // console.error(error);
      });

  };





  render() {
    const keyboardVerticalOffset = Platform.OS === "ios" ? 5 : 0;
    const  topPosition =  Platform.OS == 'ios' ? 50 : StatusBar.currentHeight 

    return (
      <KeyboardAvoidingView
        style={{ flex: 1,backgroundColor:'#fff' }}
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View style={{ flex: 1, }}>
          {/* <Toolbar {...this.props} /> */}
          <Toolbar {...this.props}  />

          <View>
            <View style={{ alignItems: 'center', }}>
              <Image source={require('../../Assets/Images/new/COMMENT-2.png')} resizeMode={'contain'} style={Common_Style.requestImage} />
            </View>
            <View style={{ marginTop: hp('1%') }}>
              <Text style={{ textAlign: 'center', fontSize: 12,  }}>{this.state.messageData.length}<Text style={{ textAlign: 'center', fontSize: Username.FontSize, fontFamily: Username.Font, }}> Comments</Text></Text>
            </View>
          </View>

          <Content style={{ height: deviceHeight * .75, marginBottom: 7 }} keyboardShouldPersistTaps={'handled'}>
            <FlatList
              style={{ width: '100%', }}
              data={this.state.messageData}
              renderItem={({ item, index }) => (
                <View key={`id${index}`} >
                  {item.comment === undefined ? null : (
                    <View style={{ flex: 1, marginTop: 5, }}>
                      <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ width: wp(12), marginLeft: 4 }}>
                          <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}>
                            {item.VerificationRequest === "Approved" ? (
                              <View style={[Common_Style.avatarProfile,]}>
                                {item.ProfilePic == undefined || null ? (
                                  <View >
                                    <ImageBackground style={{ width: '100%', height: '100%', }} borderRadius={50}
                                      source={require(imagePath + 'profile.png')}>
                                      <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                    </ImageBackground>
                                  </View>)
                                  : (
                                    <View>
                                      <ImageBackground style={{ width: '100%', height: '100%', }} borderRadius={50}
                                        source={{ uri: serviceUrl.profilePic + item.ProfilePic }}>
                                        <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                      </ImageBackground>
                                    </View>
                                  )}
                              </View>
                            ) :
                              (<View style={Common_Style.avatarProfile}>
                                {item.ProfilePic == undefined || null ?
                                  <Image style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                    source={require(imagePath + 'profile.png')}></Image>
                                  :
                                  <Image style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                    source={{ uri: serviceUrl.profilePic + item.ProfilePic }} />}
                              </View>)}

                          </TouchableOpacity>
                        </View>
                        <View style={{ width: wp('89%') }}>
                          <View style={{ flexDirection: 'row', width: wp('89%'), }}>
                            <Text onPress={() => this.OtheruserDashboard(item)} style={[Common_Style.userName,{fontWeight:'bold'}]}>{item.UserName}
                              <Text style={[Common_Style.userName, { fontFamily: 'arial', color: "#000", fontSize: 12 ,fontWeight:'normal'}]}>  {item.comment}</Text>  </Text>
                            <TouchableOpacity onPress={() => { this.likes(item) }}>
                              <Image style={{ width: 24, height: 24, marginTop: 8, }} source={
                                item && item.userLiked && item.userLiked == true ?
                                  require('../../Assets/Images/new/LIKE-2.png') :
                                  require('../../Assets/Images/new/likeBlack.png')}
                                resizeMode={'contain'}
                              ></Image>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.openModal(item)}>
                              <Image style={{ width: 16, height: 16, marginTop: 12, marginLeft: 4 }} source={
                                require('../../Assets/Images/3dots.png')}
                              //  resizeMode={'center'}
                              ></Image>
                            </TouchableOpacity>

                          </View>
                          <View style={{ flexDirection: 'row', width: wp('86%'), }}>
                            <Text style={{ fontSize: 10,  marginLeft: '5%', marginTop: 1 }} >
                              {item.cmtTime}</Text>
                            {item.Commentslikes != 0 ?
                              <TouchableOpacity onPress={() => this.likesViewMain(item)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
                                <Text onPress={() => this.likesViewMain(item)} style={{ fontSize: 10, marginLeft: 10, color: '#ff2603', marginTop: 2 }}>{item.Commentslikes} Likes</Text>
                              </TouchableOpacity>
                              : null}

                            <Text onPress={() => { this.replystate(item) }} style={[Common_Style.userName, { fontSize: 10, fontFamily: Common_Color.fontLight, marginTop: 2 }]} > Reply</Text>
                          </View>
                        </View>
                      </View>
                      {/* reply comment */}
                      <FlatList
                        style={{ width: '100%' }}
                        data={item.commentReplies}
                        renderItem={({ item, index }) => (
                          <View key={`id${index}`}>
                            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 4, marginLeft: wp('15%'), }}>
                              {item.VerificationRequest === "Approved" ? (
                                <View style={[Common_Style.mediumAvatar, { marginTop: 8 }]}>
                                  {item.ProfilePic == undefined || null ? (
                                    <View >
                                      <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'cover'} borderRadius={50}
                                        source={require(imagePath + 'profile.png')}>
                                        <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                      </ImageBackground>
                                    </View>)
                                    : (
                                      <View>
                                        <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'cover'} borderRadius={50}
                                          source={{ uri: serviceUrl.profilePic + item.ProfilePic }}>
                                          <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImagesmall} />
                                        </ImageBackground>
                                      </View>
                                    )}
                                </View>
                              ) :
                                (<View style={Common_Style.mediumAvatar}>
                                  {item.ProfilePic == undefined || null ?
                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                      source={require(imagePath + 'profile.png')}></Image>
                                    :
                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                      source={{ uri: serviceUrl.profilePic + item.ProfilePic }} />}
                                </View>)}

                              <View style={{ marginLeft: wp('1%'), width: wp('43%'), }}>
                                <View style={{ flexDirection: 'row', width: wp('100%'), }}>
                                  <View style={{ width: wp(64), flexDirection: 'row' }}>
                                    <Text onPress={() => this.OtheruserDashboard(item)} style={[Common_Style.userName, { marginLeft: 2, width: wp(50),fontWeight:'bold' }]}>{item.UserName}
                                      <Text style={[Common_Style.userName, { fontFamily: Common_Color.fontLight, color: '#000', fontSize: 12,fontWeight:'normal' }]}>  {item.CommentReplies}</Text></Text>
                                  </View>
                                  <View style={{ flexDirection: 'row', }}>
                                    <TouchableOpacity onPress={() => { this.likes(item) }}>
                                      <Image style={{ width: 24, height: 24, marginTop: 8 }} source={
                                        item && item.userLiked && item.userLiked == true ?
                                          require('../../Assets/Images/new/LIKE-2.png') :
                                          require('../../Assets/Images/new/likeBlack.png')}
                                       resizeMode={'contain'}
                                      ></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.openModal(item)}>
                                      <Image style={{ width: 16, height: 16, marginTop: 12, marginLeft: 4 }} source={
                                        require('../../Assets/Images/3dots.png')}
                                  //      resizeMode={'center'}
                                      ></Image>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={{ flexDirection: 'row', width: wp('86%'), }}>

                                  <Text style={{ fontSize: 10, marginLeft: 2, marginTop: 1, }} >
                                    {/* fontFamily: Timestamp.Font,  */}
                                    {item.cmtTime}
                                  </Text>

                                  {item.Commentslikes != 0 ?
                                    <TouchableOpacity onPress={() => this.likesView(item)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
                                      <Text onPress={() => this.likesView(item)} style={{ fontSize: 10, marginLeft: 10, marginTop: 2, color: '#ff2603' }}>{item.Commentslikes} Likes</Text>
                                    </TouchableOpacity>
                                    : null}
                                  <Text onPress={() => { this.replystate(item) }} style={[Common_Style.userName, { fontSize: 10, fontFamily: Common_Color.fontLight, marginTop: 2, }]} >
                                    Reply</Text>
                                </View>

                              </View>
                            </View>
                          </View>
                        )}
                        keyExtractor={(item, index) => index.toString()} />
                    </View>)}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </Content>


          {/*      reply state       */}
          {this.state.replyState ? (
            <View style={{
              width: wp('100%'), height: hp('12%'),
              backgroundColor: '#FFF', bottom: 0, position: 'absolute', justifyContent: 'center',
              flexDirection: 'column'
            }} >

              <View style={{
                width: wp('100%'), height: hp('3%'), marginLeft: 8, justifyContent: 'space-between',
                flexDirection: 'row',
              }} >
                <Text style={{ fontSize: 12 }}>Replying to {this.state.replyUserName}</Text>
                <TouchableOpacity onPress={() => this.setState({ replyState: false, commentReply: '' })}>
                  <Image source={require('../../Assets/Images/close.png')}
                    style={{ width: 18, height: 18, marginRight: 14, }}
                  resizeMode={'center'}
                  />
                </TouchableOpacity>
              </View>
              <View style={{
                width: wp("100%"), height: hp('7%'), flexDirection: "row",
                alignContent: 'center', alignItems: 'center',
              }}>


                <KeyboardAvoidingView
                  style={{ width: '90%' }}
                  keyboardVerticalOffset={keyboardVerticalOffset}
                  behavior={Platform.OS === "ios" ? "padding" : null}
                >

                  <View style={{ width: wp("90%"), marginLeft: '2%', }}>

                    <RNTextInput
                      autoFocus={!!this.textInputField}
                      ref={(ref) => { this.textInputField = ref }}
                      returnKeyType="send"
                      selectionColor={"grey"}
                      placeholder="Enter your replys"
                      placeholderTextColor="#777"
                      autoCapitalize="none"
                      multiline={true}
                      maxLength={140}
                      value={this.state.commentReply}
                      onChangeText={text => this.setState({ commentReply: text })}
                      onSubmitEditing={Keyboard.dismiss}
                      style={[Common_Style.searchTextInput, { paddingLeft: 12,paddingTop:10 }]}
                    // theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', paddingLeft: 5 } }}
                    />
                  </View>
                </KeyboardAvoidingView>
                {this.state.commentReply && this.state.commentReply != "" ? (
                  <View style={{ marginTop: 5,width: wp("10%"), }}>
                    <TouchableOpacity
                      disabled={this.state.loaderForSend}
                      style={{ width: "100%" }}
                      onPress={() => this.CommentReplyApi()}
                    >
                      {this.state.loaderForSend ? 
                        <View style={{justifyContent:'center'}}><Spinner color="#fb0143" size='small' /></View>
                             :
                       <Text style={{ textAlign: 'center', color: '#fb0143' }}>Send</Text>
                      }
                      
                    </TouchableOpacity>
                    
                  </View>
                ) : null}
              </View>

            </View>
          ) : (
              <Footer style={{ backgroundColor: "#fff",  borderWidth: 0, elevation: 0 }}>
                <FooterTab style={{ backgroundColor: "#fff",  borderWidth: 0, elevation: 0 }}>
                  <View style={{ width: wp("100%"), flexDirection: "row", alignContent: 'center', alignItems: 'center' }}>
                    <KeyboardAvoidingView
                      style={{ width: '90%' }}
                      keyboardVerticalOffset={keyboardVerticalOffset}
                      behavior={Platform.OS === "ios" ? "padding" : null}
                    >
                      <View style={{ width: wp("90%"), marginLeft: '2%' }}>
                      
                        <RNTextInput

                          returnKeyType="send"
                          selectionColor={"grey"}
                          placeholder="Add Comments"
                          placeholderTextColor="#777"
                          autoCapitalize="none"
                          multiline={true}
                          maxLength={140}
                          //  underlineColorAndroid='transparent'
                          //spellCheck={false}
                          // autoCorrect={false}
                          autoCorrect={false}
                          //
                          value={this.state.commentsMessage}
                          onChangeText={text => this.setState({ commentsMessage: text })}
                          //onChangeText={text => this.commentpost(text)}
                          onSubmitEditing={Keyboard.dismiss}
                          style={[Common_Style.searchTextInput, { paddingLeft: 12 ,paddingTop:10}]}
                        // theme={{colors: { primary: 'white'}}}
                        />
                      </View>
                    </KeyboardAvoidingView>
                    {this.state.commentsMessage && this.state.commentsMessage != "" ? (

                      <View style={{ width: wp("10%"), }}>
                        <TouchableOpacity
                          disabled={this.state.loaderForSend}
                          style={{ width: "100%" }}
                          onPress={() => this.CommentApi()}
                        >
                          {this.state.loaderForSend ? 
                            <View style={{justifyContent:'center'}}><Spinner color="#fb0143" size='small' /></View>
                             :
                            <Text style={{ color: '#fb0143', }}>Send</Text> }
                        </TouchableOpacity>
                        
                        
                      </View>
                    ) : null}
                  </View>
                </FooterTab>
              </Footer>
            )}

          {/* */}
          <Modal
            isVisible={this.state.isOpenBottomModal}
            onBackdropPress={() => this.setState({ isOpenBottomModal: false })}
            onBackButtonPress={() => this.setState({ isOpenBottomModal: false })}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
          >
            <View style={styles1.modalContent}>
              <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
              {this.state.UserIdComment === this.state.userId
                ? <View style={{ marginTop: 15, }}>
                  <Text onPress={() => this.deletePost()} style={[styles1.modalText, { color: '#e45d1b' }]}>
                    Delete Comment
                </Text>
                </View> : null}

              {this.state.UserIdComment === this.state.userId && <View style={styles1.horizontalSeparator} /> }

              <TouchableOpacity onPress={() => this.setState({ isOpenBottomModal: false }, () => {
                setTimeout(() => {
                  this.setState({ isModalVisible1: true })
                }, 300)
              })}  >
                <View style={{ marginTop: 7, marginBottom: 15 }}>
                  <Text
                    style={[styles1.modalText, { color: '#e45d1b' }]}>
                    Report 
                </Text>
                </View>
              </TouchableOpacity>

            </View>
          </Modal>


          {/* Delete Modal */}
          <Modal isVisible={this.state.isModalVisible3}
            onBackdropPress={() => this.setState({ isModalVisible3: false })}
            onBackButtonPress={() => this.setState({ isModalVisible3: false })} >
            <View style={styles.deleteModalView} >

              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                <Text style={{ color: '#333', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 18 }}>
                  Are you sure want to delete the post?
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

          {/* Report models */}
          <Modal isVisible={this.state.isModalVisible1}
            onBackdropPress={() => this.setState({ isModalVisible1: null })}
            onBackButtonPress={() => this.setState({ isModalVisible1: null })} >
            <View style={Common_Style.parentViewReport} >
              <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
              <Image style={Common_Style.iconReport} source={require('../../Assets/Images/new/Expression.png')}></Image>
              <Text style={Common_Style.headerReport} >
                Inappropriate Content!
</Text>
              <Text style={Common_Style.subHeaderReport} >
                We are sorry for the inconvenience!
</Text>
              <View style={[Common_Style.contentViewReport,{marginHorizontal:10}]}>
                <Text style={Common_Style.contentReport} >
                  We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
</Text>
              </View>
              <TextInput
                label=" Type Here..."
                placeholderStyle={Common_Style.PstyleReport}
                mode="outlined" gnb
                multiline={true}
                maxLength={500}
                autoCorrect={false}
                //
                // flexWrap: 'wrap'
                onChangeText={(text) => { this.setState({ permission_Value: text }) }}
                value={this.state.permission_Value}
                style={Common_Style.TstyleReport}
                selectionColor={'#f0275d'} theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }}
              />



              <View
                style={Common_Style.buttonViewReport}
              >

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
            <View style={Common_Style.TparentView} >
              <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
              <Text style={Common_Style.TheaderInModalTwo} >
                Thank you for your voice!
</Text>

              <View style={[Common_Style.TcontentViewInModalTwo,{marginHorizontal:10}]}>
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

        </View>
      </KeyboardAvoidingView>
    )
  }

}