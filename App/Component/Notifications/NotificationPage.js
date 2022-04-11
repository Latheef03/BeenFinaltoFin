import React, { Component } from 'react';
import { View, Clipboard, Text, ImageBackground, Image,TouchableOpacity, Share, TextInput, Dimensions, StatusBar, ScrollView, ToastAndroid, Animated, PanResponder, FlatList,
  TouchableWithoutFeedback,Platform } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
let Common_Api = require('../../Assets/Json/Common.json')
import { Footer, FooterTab, Button, Spinner, Content } from 'native-base'
import TransBack from '../CustomComponent/TransBack'
import serviceUrl from '../../Assets/Script/Service';
import { heightPercentageToDP as dh, widthPercentageToDP as dw } from 'react-native-responsive-screen';
// import { deviceHeight as dh, deviceWidth as dw} from '../_utils/CommonUtils';
import ViewMoreText from 'react-native-view-more-text';
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import styles from '../../styles/NewfeedImagePost';
import Common_Style from '../../Assets/Styles/Common_Style'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import ParsedText from 'react-native-parsed-text';

const shareOptions = {
  title: "Title",
  message:'Post Shared',
  url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
  subject: "Subject"
};


export default class NotificationPage extends Component {

  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      newsFeedData: null,
      visibleModal: null,
      likes: '',
      likeStatus: '',
      move: true,
      add_like: true,
      isLoading: false,
      userId: '',
      postId: '',
      notifications: "",
      postContent: '',
      otherUserId: "",
      //Video
      currentTime: 0,
      duration: 0,
      isLoading: true,
      userPlay: false,
      paused: false,
      volume: 0,
      playerState: PLAYER_STATES.PLAYING,
      zone: '',
      search: '',
      feedId: ''

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
    debugger
    const { navigation } = this.props;
    const postId = navigation.getParam("data");
    this.setState({ feedId: postId })
    this.fetchDetails();
    this.onLoad();
  }

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if (this.state.move) {
        return true;
      }
      return false;
    },
    onPanResponderMove: (evt, gestureState) => {
      console.log('onPanResponderMove met')
      this._animatedValue.setValue(gestureState.moveX);
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (Math.floor(gestureState.moveX) >= 10 / 2) {
        this.props.navigation.goBack();
      } else {
        Animated.timing(this._animatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
    onPanResponderTerminate: (evt, gestureState) => {
      Animated.timing(this._animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
  });

  componentDidMount = async () => {
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.fetchDetails();
      }
    );

  };

  async OtheruserDashboard(item) {
   // debugger;
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
  profileChanger = async () => {
    let local;
   // debugger;
    let businessProfile;
    var data = { userId: await AsyncStorage.getItem('userId') };
    const url = serviceUrl.been_url1+'/UserProfile';
    const getType = await AsyncStorage.getItem('profileType');
    const pType = parseInt(getType);
    const localP = await AsyncStorage.getItem('localProfile');
    console.log('the ptype ',pType,' and its type ',typeof pType);

    if(localP && localP == "Yes"){
      this.props.navigation.navigate('LocalUserProfile')
    }else if(pType === 2){
      this.props.navigation.navigate('BusinessPlaceProfile')
    }else{
      console.log('the ptype ',pType,' and its type profile1 ',typeof pType);
      this.props.navigation.navigate('Profile')
    }

  }
  onLoad = async () => {
    var userId = await AsyncStorage.getItem('userId');
    this.setState({ userId: userId, })
  }

  likesView(data) {

    var data = {
      data: data.PostId === undefined ? data.Postid : data.PostId,
      screen: "Likes",
      likesCount: data.LikeCount
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }

  bookmarkView(data) {
    var data = {
      data: data.PostId === undefined ? data.Postid : data.PostId,
      screen: "Bookamarks"
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }


  comments(data) {
    this.props.navigation.navigate('comments', { data: data });
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


  fetchDetails = async () => {
    //debugger;
    var id = await AsyncStorage.getItem("userId");
    var data = { UserId: id, FeedId: this.state.feedId };
    //const url = serviceUrl.been_url + "/GetNewsFeedList";
    const url = serviceUrl.been_url1 + "/SpecificFeedDetails";
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
              newsFeedData: userStatus.result ? userStatus.result : null,
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


  renderViewMore(onPress) {
    return (
      <Text style={{ textAlign: 'center', marginTop: '2%', marginBottom: '2%', marginLeft: '74%', }} onPress={onPress}>View more</Text>
    )
  }
  renderViewLess(onPress) {
    return (
      <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }} onPress={onPress} >View Less</Text>)
    //   <Text style={{ textAlign: 'center', marginTop: '2%', marginBottom: '2%', marginLeft: 25, }} onPress={onPress} >View Less</Text>
    // )
  }
  reportModal() {
    this.setState({
      visibleModal: null,
      visibleModal: 3
    });
  }

  sendReportModal() {
    this.setState({
      visibleModal: null,
    });
    this.reportApi();
  }


  multiImage = ({ item }) => {
    var Image = data.Image.split(',')
    return (
      <ImageBackground style={{ width: '100%', height: 230, marginTop: '2%' }} source={{
        uri: serviceUrl.newsFeddStoriesUrl + item.Image
      }}>
        <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
          <View style={{ width: '87%', }}></View><View >
            <Image style={{ width: dw(10), height: dh(4), marginTop: '7%' }} source={require('../../Assets/Images/camera1.png')} ></Image></View>
        </View>
      </ImageBackground>
    )
  }


  onViewableItemsChanged = ({ viewableItems, changed }) => {
    console.log("Visible items are", viewableItems);
    console.log("Changed in this iteration", changed);
  }

  renderViewMore(onPress) {
    return (
      <Text style={Common_Style.viewMoreText} onPress={onPress}>View more</Text>
    )
  }
  renderViewLess() {
    return (
      <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize,fontFamily:Viewmore.Font, }}></Text>)
    //   <Text onPress={onPress} style={Common_Style.viewMoreText} >View less</Text>
    // )
  }

  extractDesctiption = (data) => {
    if (data == undefined || data.length == 0) {
        return null;
    }
    return data[0].desc != undefined ? data[0].desc : null;
}

renderPostItem = (data, index) => {
  // console.log('the render data',index == 0 ? data.Commentcount : null)
  const {showControl,paused,volumeMuted,duration,currentTime,volume,
    singleTapPostId} = this.state;
  // console.log('the paused indx data indx',data.mIndex ,'scrolled index', this.state.mScrollIndex)
  // console.log('cond for indxx',data.mIndex != this.state.mScrollIndex) 
  // const imageurl = '../../Assets/sampleVideos/'+data.Image;
  
  // this.setState({paused : data.mIndex != this.state.mScrollIndex})
  return (
    <View key={index.toString()} style={[styles.card, { height: 'auto' }]}>
    {/* <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle='light-content' /> */}
    <View style={styles.cardImage}>
      <View style={{ flexDirection: 'row', width: '100%',marginTop:index === 0 ? StatusBar.currentHeight : 0}} >
      <View style={{ width: '10%' }} />
      <View style={{ marginTop: '2%', width: '80%', }}>
        {data.Location === "null" ? null : (<Text onPress={() => this.getLocation(data)} 
        style={[Common_Style.cardViewLocationText,{ }]}>
        {data.Location}
         </Text>)}
        {data.Country === "null" ? null : (<Text onPress={() => this.getLocation(data)} 
        style={[Common_Style.cardViewLocationText, { marginBottom: 8 }]}>
        {data.Country}
        </Text>)}
      </View>

   
      </View>
      
    
      <View style={[styles.imageBackGroundView, { borderRadius: 15, height: dh('62%'), }]}>
      {data.Image != undefined && data.Image.indexOf(".mp4") != -1 ?
        <View style={{ width: "100%",height: "100%", overflow:'hidden',
        flexDirection:'column',
         }}>
          
        <TouchableWithoutFeedback onPress={()=>this._singleTap(data,index)}>
          {/* {data.mIndex == this.state.mScrollIndex && ( */}
                       <Video
                resizeMode="cover"
                source={{ uri: serviceUrl.newsFeddStoriesUrl + data.Image }}
                paused={data.mIndex != this.state.mScrollIndex}
                repeat={true}
                controls={false}
                // resizeMode='cover'
                style={{ width: dw('90%'), height: 400, }}
                volume={this.state.volume}>
              </Video>
          {/* )} */}

        </TouchableWithoutFeedback>
      
        
         </View>
        
        :
         
        <View style={{ height: '100%', }}>
          <ImageBackground style={{ width: '100%', height: '100%', }} resizeMode={'cover'}
          source={data.Image == null ? require('../../Assets/Images/story2.jpg') : 
           { 
            // uri:data.Image
             uri: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0] 
           }}>
          <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: 5,
            justifyContent:'flex-end' }}>
            <View style={{ width: '88%', }}></View>
            <View style={{width:dw(10),height:dh(6),justifyContent:'center'}}>
            {data.Image.split(',').length > 1 ?
              <TouchableOpacity activeOpacity={1} onPress={() => data.Image.split(',').length > 1 ? this.imageModal(data) : null} >
              <Image style={{ width: dw(6), height: dh(4), marginTop: '5%',alignSelf:'center' }}
                source={require('../../Assets/Images/MULTIPIC.png')}>
              </Image>
               </TouchableOpacity>
              :
              <Image style={{ width: dw(10), height: dh(4), marginTop: '7%' }} ></Image>
             }
            </View>
          </View>
          {this.state.dTapLikeEnable && data.PostId == this.state.tappedPostId && (
            <View style={{width:'100%',height:'75%',justifyContent:'center',
            
            }}>
            <Image source={require('../../Assets/Images/new/LIKE-2.png')} 
         resizeMode={'center'}
             style={{width:50,height:80,alignSelf:'center',}}
            />
            </View>
          )}
          
          </ImageBackground>
         
        </View>
         
        
      }
       
      </View>
     
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


        <View style={{ width: '80%', justifyContent: 'center',padding:2 }}>
          <Text onPress={() => this.OtheruserDashboard(data)} style={[Common_Style.userName, 
           { marginTop: 0, marginLeft: '2%',marginBottom:0 ,}]}>
          {data.UserName}
          </Text>
        </View>
        </View>

        <View style={{ width: '85%', height: 'auto', marginTop: -10, marginBottom:0, marginLeft: 4,
        flexDirection:'row',padding:4, }}>
          <View style={{width:30,height:30,marginLeft:4,}}/>
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
        <View style={{ flexDirection: 'row', marginRight: '100%', width: '100%',}}>
        <View style={{ width: 32, height: 30}}>
          <TouchableOpacity onPress={() => { this.likes(data) }}>
          <Image style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} source={
            data && data.userLiked && data.userLiked == true ?
            require('../../Assets/Images/new/LIKE-2.png') :
            require('../../Assets/Images/new/likeBlack.png')}></Image>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.likesView(data)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
          <Text onPress={() => this.likesView(data)} style={[Common_Style.countFont, { marginLeft: 5, marginTop: 7 }]} >
          {data.LikeCount}
          </Text></TouchableOpacity>
        </View>

        {/* Comment  */}
        <View style={{ flexDirection: 'row', marginTop: 8, }}>
        <View style={{ width: 32, height: 30 }}>
          <TouchableOpacity onPress={() => { this.comments(data) }}>
          <Image style={{ width: '100%', height: '100%', }} resizeMode={'stretch'}
            source={require('../../Assets/Images/new/commentBlack.png')} ></Image>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.comments(data)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
          <Text onPress={() => this.comments(data)} style={[Common_Style.countFont, { marginLeft: 5, marginTop: 7 }]} >
          {data.Commentcount}
          </Text></TouchableOpacity>
        </View>

      </View>
      </View  >

      {data.SponsoredBy != null && data.SponsoredBy != 'null' ?
      <Text style={{ textAlign: 'center', color: '#ff5555', fontFamily: Viewmore.Font, fontSize: Viewmore.FontSize, marginVertical: 5, marginTop: -20, marginBottom: 10 }}>Sponsored by {data.SponsoredBy}</Text>
      : null}
    </View>
    </View>

  )
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
      	<StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle='dark-content' />
        <View>

          {/* <Toolbar {...this.props} /> */}
          {this.state.isLoading != true && this.state.newsFeedData != null ?
         	<View style={{ height:  Platform.OS == 'ios' ? dh('100%') : dh('100%') + StatusBar.currentHeight,backgroundColor:'black',}}>
						
              <FlatList
                style={{ width: '100%', }}
                // initialScrollIndex={50}
                // initialNumToRender={2}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={this.onViewableItemsChanged}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 60
                }}
                data={this.state.newsFeedData}
                // getItemLayout={(data, index) => { return {length: 33, index, offset: 33 * index} }}
                // ref={(ref) => { this.flatListRef = ref; }}
                renderItem={({ item, index }) => (
                  this.renderPostItem(item, index)
                )}
                keyExtractor={index => index.toString()}
              //getItemLayout={this.getItemLayout}
              />
            </View>
            :
            <View style={{ flex: 1, flexDirection: "column", marginTop: '55%' }} >
              <Spinner color="#fb0143" />
            </View>
          }


        </View>
        <View style={[styles.mapDrawerOverlayRight,]} {...this._panResponder.panHandlers} />
        <TransBack props={this.props.navigation} />
			</View>
    )
  }
}



