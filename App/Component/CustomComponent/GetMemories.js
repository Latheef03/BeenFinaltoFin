import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, Share, FlatList, Dimensions, StatusBar, ScrollView, ToastAndroid, Animated, PanResponder } from 'react-native';
let Common_Api = require('../../Assets/Json/Common.json')
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Button, Spinner, Content } from 'native-base'
import { TouchableOpacity, DrawerLayoutAndroid } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import LikesView from '../CustomComponent/LikesView';
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import styles from '../../styles/NewfeedImagePost';
import ViewMoreText from 'react-native-view-more-text';
const { width, height } = Dimensions.get("window");
import Common_Style from '../../Assets/Styles/Common_Style'

const shareOptions = {
  title: "Title",
  message:'Post Shared',
  url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
  subject: "Subject"
};


export default class GetMemories extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      newsFeedData: '',
      visibleModal: null,
      likes: '',
      likeStatus: '',
      move: true,
      add_like: true,
      isLoading: false,
      userId: '',
      postId: '',
      notifications: "",
      //Video
      currentTime: 0,
      duration: 0,
      isLoading: true,
      userPlay: false,
      paused: false,
      volume: 0,
      playerState: PLAYER_STATES.PLAYING,
      zone: ''
    }
  }

  onSeek = seek => {
    //Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };

  onPaused = playerState => {
    //Handler for Video Pause
    if (this.state.userPlay == true) {
      this.setState({
        paused: !this.state.paused,
        userPlay: false,
        playerState,
      });
    } else {
      this.setState({
        paused: !this.state.paused,
        userPlay: true,
        playerState,
      });
    }
  };


  muteVolume = playerState => {
    //Handler for Video Pause
    if (this.state.volume == 10) {
      this.setState({
        volume: 0,
        playerState,
      });
    } else {
      this.setState({
        volume: 10,
        playerState,
      });
    }
  };

  onReplay = () => {
    //Handler for Replay
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer.seek(0);
  };

  onProgress = data => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };
  onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });
  onError = () => alert('Oh! ', error);
  exitFullScreen = () => { alert('Exit full screen'); };
  enterFullScreen = () => { };
  onSeeking = currentTime => this.setState({ currentTime });

  _animatedValue = new Animated.Value(0);

  componentWillMount() {
    this.fetchDetails();
    this.onLoad();

  }

  componentDidMount = async () => {
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.fetchDetails();
      }
    );
  };

  onLoad = async () => {
    // debugger
    var userId = await AsyncStorage.getItem('userId');
    this.setState({ userId: userId, })
  }


  share_option() {
    Share.share(shareOptions)
    this.setState({
      visibleModal: null
    })
  }

  likesView(data) {
    var data = {
      data: data.PostId === undefined ?data.Postid :data.PostId,
      screen: "Likes"
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }

  bookmarkView(data) {
    var data = {
      data: data.PostId === undefined ?data.Postid :data.PostId,
      screen: "Bookamarks"
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }

  fetchDetails = async () => {
    //debugger;
    // this.setState({ isLoading: true });
    var id = await AsyncStorage.getItem("userId");
    var data = { UserId: id };
    //const url = serviceUrl.been_url + "/GetNewsFeedList";
    const url = serviceUrl.been_url1 + '/GetNewsFeedList';
    const header = serviceUrl.headers;
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
          {
            this.setState({ isLoading: false });
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

            this.setState({
              newsFeedData: userStatus.result ? userStatus.result : '',
            })
          }
        }
        else if (responseJson.status === 'False') {
          this.setState({ likeStatus: false, isLoading: false })
        }

        else {
          this.setState({ isLoading: false });
          //toastMsg('danger', response.data.message)
        }
      })
      .catch(function (error) {
        console.log('Error:', error)
        //toastMsg('danger', 'Sorry..something network error.Please try again.')
      });
  }

  async likes(data) {
    var id = await AsyncStorage.getItem("userId");
    var data = {
      Userid: id,
      Postid: data.PostId
    };
    const url = serviceUrl.been_url + "/LikeFeedPost";
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
          //toastMsg('success', responseJson.message)
          this.fetchDetails();

        }
        else {
          this.setState({ likes: false })
          //toastMsg('danger', responseJson.message)
        }
      })
      .catch(function (error) {
        console.log("Catch Error", error);
      });
  }

  async bookmarkLikes(data) {
    // debugger
    var id = await AsyncStorage.getItem("userId");
    var data = { Userid: id, Postid: data.PostId };
    const url = serviceUrl.been_url + "/Bookmark";
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
          this.fetchDetails();
          toastMsg('success', responseJson.message)
          //ToastAndroid.show(responseJson.message, ToastAndroid.LONG);
        }
        else {
          this.setState({ likes: false })
          //toastMsg('danger', responseJson.message)
        }
      })
      .catch(function (error) {
        console.log("Catch Error", error);
      });
  }

  comments(data) {
    this.props.navigation.navigate('comments', { data: data });
  }
  newsFeedUpload() {
    this.props.navigation.navigate('NewsfeedUpload')
  }
  modalOpen(data) {
    //debugger
    this.setState({
      visibleModal: 1,
      postId: data.userId
    })
  }


  imageModal(data) {
    console.log('the data NF', data);
    var data = {
      data: data.Image,
      desc: data.Desc,
      postLocation: data.Location + ', ' + data.Country
    }
    this.props.navigation.navigate("MultiImageView", { data: data })
  }

  getLocation(data) {
    AsyncStorage.mergeItem('PlaceName', data.Location);
    AsyncStorage.setItem('PlaceName', data.Location);
    this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
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
   // debugger;
    this.setState({ visibleModal: null });
    //debugger
    var data = {
      Otheruserid: this.state.postId,
      Userid: await AsyncStorage.getItem('userId')
    };
    const url = serviceUrl.been_url + "/Unfollow";
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

  mute = async (data) => {
    this.setState({ visibleModal: null });
    //debugger
    var data = {
      Otheruserid: this.state.postId,
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

  renderViewMore(onPress) {
    return (
        <Text style={Common_Style.viewMoreText} onPress={onPress}>View more</Text>
    )
}
renderViewLess(onPress) {
    return (
      <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize,fontFamily:Viewmore.Font, }}></Text>)
    //     <Text onPress={onPress} style={Common_Style.viewMoreText} >View less</Text>
    // )
}


  renderPostItem = (data, index) => {
    return (
      <View style={styles.card}>
        <View style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', }}>
          <View style={{ flexDirection: 'row' }} >
            <View style={{ marginTop: '2%', width: '90%', }}>
              {data.Location === "null" ? null : (<Text style={Common_Style.cardViewLocationText}>{data.Location}</Text>)}
              {data.Country === "null" ? null : (<Text style={Common_Style.cardViewLocationText}>{data.Country}</Text>)}
            </View>
            <View style={{ marginTop: '4%', width: '10%' }}>
              {data.userId == this.state.userId ? null :
                data.PrmoteData == "Yes" ?
                  <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} >
                    <Image style={{ width: wp(6), height: 15, marginLeft: 'auto', marginRight: 'auto', marginTop: '10%' }}
                      source={require('../../Assets/Images/3dots.png')}></Image>
                  </TouchableOpacity> :
                  <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} >
                    <Image style={{ width: wp(6), height: 15, marginLeft: 'auto', marginRight: 'auto', marginTop: '10%' }}
                      source={require('../../Assets/Images/3dots.png')}></Image>
                  </TouchableOpacity>}
            </View>
          </View>

          <View>
            {data.Image.indexOf(".mp4") != -1 ?
              <View style={{ width: "90%", flex: 1, }}>
                <Video
                  resizeMode="cover"
                  source={{ uri: serviceUrl.newsFeddStoriesUrl + data.Image }}
                  paused={this.state.paused ? true : false}
                  repeat={true}
                  controls={false}
                  resizeMode='cover'
                  style={{ width: wp('90%'), height: 280, }}
                  volume={this.state.volume}>
                </Video>
              </View>
              :

              <ImageBackground style={{ width: '100%', height: 230, marginTop: '2%' }}
                source={data.Image == null ? require('../../Assets/Images/story2.jpg') : { uri: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0] }}>
                <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
                  <View style={{ width: '88%', }}></View><View>
                    <Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} source={data.Image.split(',').length > 1 ? require('../../Assets/Images/camera1.png') : require('../../Assets/Images/camera.png')} ></Image></View>
                </View>
              </ImageBackground>

            }
          </View>
          <View style={{ flexDirection: 'row', marginTop: '5%' }}>
            <View>
              <View style={{ flexDirection: 'row', }}>
                {data.UserProfilePic == null ?
                  <Image style={{ width: 25, height: 25, }} borderRadius={50} source={require('../../Assets/Images/assam.jpg')}></Image> :
                  <Image style={{ width: 25, height: 25, }} borderRadius={50}
                    source={{
                      uri: serviceUrl.profilePic + data.UserProfilePic
                    }}></Image>}
                <View style={{ width: '80%', }}>
                  <Text style={{ width: '80%', marginLeft: '5%', marginTop: 5, color: '#000' }}>{data.UserName}</Text></View>
              </View>
              <View style={{ width: '88%', height: 'auto', marginTop: '5%', }}>
                <ViewMoreText
                numberOfLines={2}
                  renderViewMore={this.renderViewMore}
                  renderViewLess={this.renderViewLess}
                  style={{ textAlign: 'center', marginBottom: '1.5%' }}
                >
                  <Text style={Common_Style.descriptionText}>
                    {data.Description === "null" ? null : data.Description}
                  </Text>
                </ViewMoreText>
              </View>
            </View>
            <View style={{ width: 40, justifyContent: 'space-around', alignItems: 'center'
,height: 100, }}>
              {/* Like  */}

              <Image style={{ width: 20, height: 20, }} source={
                data && data.userLiked && data.userLiked == true ?
                  require('../../Assets/Images/redheart.png') :
                  require('../../Assets/Images/heart.png')}></Image>

              <Text style={{ fontSize: 10, textAlign: 'center', }} >
                {data.LikeCount}</Text>

              {/* Comment  */}
              <TouchableOpacity >
                <Image style={{ width: 20, height: 20, marginTop: '20%', }} source={require('../../Assets/Images/comment.png')} resizeMode={'stretch'}></Image>
              </TouchableOpacity>
              <Text style={{ fontSize: 10, textAlign: 'center' }}>{data.Commentcount}</Text>
              {/* Bookmark */}

              <Image style={{ width: 18, height: 18, marginTop: '20%', marginLeft: 2 }}
                source={data && data.userBookmarked && data.userBookmarked == true ?
                  require('../../Assets/Images/clrBookmark.png') :
                  require('../../Assets/Images/bookmark.png')}></Image>

              <Text style={{ fontSize: 10, marginLeft: 3, textAlign: 'center' }}>{data.Bookmarkcount}</Text>
            </View>
          </View  >
          {/* <View  >
            <Text style={{ textAlign: 'center', marginBottom: '3%' }} > View More</Text>
          </View> */}
        </View>
      </View>
    )
  }
  render() {
    return (
      <Content>
        <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
        <ScrollView style={{ width: '100%', }}>

          <View>
            <View>
              {this.state.isLoading != true && this.state.newsFeedData != null ?
                <View >
                  <FlatList
                    data={this.state.newsFeedData}
                    renderItem={({ item, index }) => (
                      this.renderPostItem(item, index)
                    )}
                    keyExtractor={index => index.toString()}
                  />
                </View>
                :
                <View style={{ flex: 1, flexDirection: "column", marginTop: '55%' }} >
                  <Spinner color="#fb0143" />
                </View>
              }

            </View>

          </View>
          {/* <View style={[styles.mapDrawerOverlayRight,]} {...this._panResponder.panHandlers} /> */}
        </ScrollView>

        <Modal
          isVisible={this.state.visibleModal === 1}
          onBackdropPress={() => this.setState({ visibleModal: null })}
          onBackButtonPress={() => this.setState({ visibleModal: null })}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => this.setState({ visibleModal: null })}>
              <View style={{ flexDirection: 'row', width: '100%', marginTop: 8, marginBottom: 5 }}>
                <Text style={[styles.modalText, { width: '85%' }]}>
                  Send To
                  </Text>
                <Image source={require('../../Assets/Images/send.png')}
                  style={{ width: 18, height: 18, marginTop: 4 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.horizontalSeparator} />

            <View>
              <Text onPress={() => this.notifyData()} style={styles.modalText}>
                Turn {this.state.notifications} Notifications
                  </Text></View>

            <View style={styles.horizontalSeparator} />


            <View onPress={() => this.share_option()} >
              <Text onPress={() => this.share_option()}
                style={styles.modalText} >
                Share To
                  </Text>
            </View>

            <View style={styles.horizontalSeparator} />

            <View style={{ width: '100%', height: '13%' }}><Text onPress={() => this.setState({ visibleModal: null })} style={styles.modalText}>
              Copy link
                  </Text></View>

            <View style={styles.horizontalSeparator} />

            <View >
              <TouchableOpacity onPress={() => this.unfollow()} style={{ width: '100%', }}>
                <Text onPress={() => this.unfollow()} style={[styles.modalText, { color: '#708fd5' }]}>
                  Unfollow account
                  </Text></TouchableOpacity>
            </View>

            <View style={styles.horizontalSeparator} />

            <View ><Text onPress={() => this.setState({ visibleModal: null })} style={[styles.modalText, { color: '#e45d1b' }]}>
              Report post
                  </Text></View>

            <View style={styles.horizontalSeparator} />

            <View >
              <TouchableOpacity onPress={() => { this.mute() }} >
                <Text onPress={() => { this.mute() }} style={[styles.modalText, { color: '#708fd5' }]}>
                  Mute
                  </Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>

      </Content>
    )
  }
}



