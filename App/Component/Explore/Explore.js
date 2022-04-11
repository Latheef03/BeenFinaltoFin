import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, FlatList, Share,  
   StatusBar,  TouchableOpacity,
  Animated, Keyboard,Platform,NativeModules, StatusBarIOS } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { TextInput } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import styles from '../../styles/FooterStyle'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
import Common_Style from '../../Assets/Styles/Common_Style'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import {Common_Color,TitleHeader,} from '../../Assets/Colors'
import LinearGradient from "react-native-linear-gradient";
import {ExploreLoader} from '../commoncomponent/AnimatedLoader';
import { deviceHeight as dh , deviceWidth as dw } from '../_utils/CommonUtils';
import GetData from '../CustomComponent/GetData'
import { initiateChat } from '../Chats/chatHelper';
import { cool } from 'react-native-color-matrix-image-filters';
const { StatusBarManager } = NativeModules;


const shareOptions = {
  title: "Title",
  message: "http://been.com/5e47d082e301b51201e8adac",
  url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
  subject: "Subject"
};

export default class Explore extends Component {

  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      id: '',
      userName: '',
      getAlbumData: '',
      getMemoryData: [],
      convertedImages1: '',
      userProfileScreen: 0,
      isModalVisible: false,
      isModalVisible1: false,
      isModalVisible2: false,
      followers: 0,
      search: '',
      albumSingleImg: null,
      selectedMemoryData: {},
      userdata: {},
      screenName: '',
      location: '',
      notifications: "",
      postId: '',
      newsfeed: '',
      country: '',
      tags: '',
      description: '',
      wholeMemoryData : {},
      fetchingData : true
    }
    
  }


  _animatedValue = new Animated.Value(0);


  componentDidMount = () => {
    initiateChat()
    this.getMemeories(true);
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        // this.setLikeCounts()
        this.getMemeories(false);
        // const Comments = this.props.route.params.data
        // this.setState({
        //   screenName: Comments ? Comments.screenName : '',
        // })
        
      }
    );
    if (Platform.OS === 'ios') {
			StatusBarManager.getHeight(response =>
				this.setState({iosStatusBarHeight: response.height})
			)
		
			this.listener = StatusBarIOS.addListener('statusBarFrameWillChange',
			  (statusBarData) =>
				this.setState({iosStatusBarHeight: statusBarData.frame.height})
			)
		  }
  };
  componentWillUnmount = () =>{
		if (Platform.OS === 'ios' && this.listener) {
			this.listener.remove()
		  }
	}

 
  readFromClipboard = async () => {
    this.setState({ isModalVisible: false })
    //To get the text from clipboard
    const clipboardContent = await Clipboard.getString();
    this.setState({ clipboardContent });
  };

  writeToClipboard = async () => {
    this.setState({ isModalVisible: false })
    //To copy the text to clipboard
    await Clipboard.setString("http://Been.com/" + this.state.postId);
    //toastMsg("Pending", "Link Copied");
  };
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
  share_option() {
    Share.share(shareOptions)
    this.setState({
      visibleModal: null
    })
  }

 

  editPost() {
    this.setState({ isModalVisible: false })
    var data = {
      postId: this.state.postId,
      newsfeedImage: this.state.newsfeed,
      country: this.state.country,
      location: this.state.location,
      tagsPerson: this.state.tags,
      description: this.state.description
    }
    this.props.navigation.navigate('EditPost', { data: data });
  }

  search() {
    Keyboard.dismiss();
    this.props.navigation.navigate("searchExplore")
  }

  albums() {
    this.props.navigation.navigate('UserProfileAlbums');
  }
  visits() {
    this.props.navigation.navigate('Visits');
  }
  vlogGet() {
    this.props.navigation.navigate('VlogGet');
  }

  getMemeories = async (loader) => {
   // debugger;
    var data = {
      Userid: await AsyncStorage.getItem('userId')
    }
    const url = serviceUrl.been_url + "/GetExplores";
    this.setState({fetchingData:loader})
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "True") {
          let result = responseJson.result;
          // console.log('the result',result);
          result.length > 0 && result.map(m => {
            m.totalLike = 0
            m.data.length > 0 && m.data.map(s => {
              if (m._id == s.Location) {
                m.totalLike += s.likecount ? s.likecount : 0
              }
              return s;
            })
            return m;
          })
          this.setState({
            getMemoryData: result,
            wholeMemoryData : responseJson,
            fetchingData:false
          })
        }
        else {
          this.setState({fetchingData:false})
          //toastMsg('danger', responseJson.message)
        }
      })
      .catch((error) => {
        this.setState({fetchingData:false})
        console.log('Error:', error);
      });
  }


  backArrow() {
    const { userProfileScreen } = this.state;
    if (userProfileScreen === 1) {
      this.setState({ userProfileScreen: 0 })
    } else { this.props.navigation.navigate('Profile'); }
  }

  hasNoMemories = () => {
      return (
        <View style={styles.hasNoMem}>
          <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
          <Text style={{ color: '#4a4a4a', fontSize: 20 }}>No Datas Yet..</Text>
        </View>)
  }

  openModal(d) {
    debugger
    this.setState({
      isModalVisible: true,
      isModalVisible1: false,
      isModalVisible2: false,
      postId: d._id,
      newsfeed: d.NewsFeedPost,
      country: d.Country,
      tags: d.TagsId,
      description: d.Description,
      location: d.Location
    })
  }
  openModalBusiness(d) {
    debugger
    this.setState({
      isModalVisible: false,
      isModalVisible1: true,
      isModalVisible2: false,
      postId: d._id,
      newsfeed: d.NewsFeedPost,
      country: d.Country,
      tags: d.TagsId,
      description: d.Description,
      location: d.Location
    })
  }

  comments(d) {
    this.props.navigation.navigate('comments', { data: d });
  }
  getLocation(data) {
    AsyncStorage.mergeItem('PlaceName', data.Location);
    AsyncStorage.setItem('PlaceName', data.Location);
    this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
}

    navigation(item,index) {

      const {getMemoryData , wholeMemoryData} = this.state;
      let actualIndex = 0;
      // console.log('the likes',getMemoryData)
      let memoryData = { result : [] };
      memoryData.UserLiked = wholeMemoryData.UserLiked;
      memoryData.status = wholeMemoryData.status;
      memoryData.UserBookMark = wholeMemoryData.UserBookMark;

      // console.log('the getmm data',getMemoryData);
      getMemoryData.length > 0 && getMemoryData.map(m=>{
        m.data.map(v=>{
          
            memoryData.result = [...memoryData.result,{...v}]
        })
    });


      memoryData.UserLiked && memoryData.UserLiked.length > 0 && memoryData.UserLiked.map(item => {
          memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
              moment.NewsFeedPost = moment.Image
              if (moment.PostId === item.Postid) {
                  moment.likes = true;
              }
              return moment;
          });
          return item;
      });

      memoryData.UserBookMark && memoryData.UserBookMark.length > 0 && memoryData.UserBookMark.map(item => {
          memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
              if (moment.PostId === item.Postid) {
                  moment.Bookmarks = true;
              }
              return moment;
          });
          return item;
      });

      // console.log('the memory data',memoryData);
      let selectedData = []
      memoryData.result.map((d,ind)=>{
        // console.log('the mmodatas',d)
        d.likecount = d.LikeCount
        d.Postid = d.PostId
        d.ProfilePic = d.UserProfilePic
        d.NewsFeedPost = d.Image
        if(d.Location == item._id){
          d.likecount = d.LikeCount
          d.Postid = d.PostId
          d.ProfilePic = d.UserProfilePic
          d.NewsFeedPost = d.Image
          memoryData.result.splice(ind,1)
          selectedData = [...selectedData,d];
        }
      });

      
      memoryData.result = [...selectedData,...memoryData.result];

      console.log('the pushed data',memoryData);
      
      var props = { screenName: 'Explore',selectedPostId:actualIndex,memoryData:memoryData, }
      this.props.navigation.navigate('GetDataExplore', { data: props });
  }

  renderFooter() {
    return (
      <View style={{
        padding: 10, justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',marginBottom:40
      }}>
        {/* {this.state.dataEnd && (
          <Text style={{ color: '#FFF' }}>Follow more travellers for more content!</Text>
        )} */}
       <Text >  </Text>

      </View>
    );
  }

  renderHeader = () => {
    // console.log('StatusBar.currentHeight',StatusBar.currentHeight);
    return(
      <View style={{width:'100%',height:40,justifyContent:'center'}} >
        <Text style={{textAlign:'center',fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font,}}>Explore</Text>
      </View>
    )
  }

    

  seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }

  render() {
    const { selectedMemoryData,getMemoryData,fetchingData,iosStatusBarHeight } = this.state;
    const  topPosition =  Platform.OS == 'ios' ? iosStatusBarHeight : StatusBar.currentHeight 

    
    // console.log('the memory datas was',getMemoryData);
    const { _id, data, } = selectedMemoryData;
    return (
      <View style={{ flex:1,backgroundColor:'#fff'}}>
        <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle='dark-content' />

        
        {fetchingData && (<View style={{width:'100%',height:40,justifyContent:'center',marginTop:StatusBar.currentHeight
         }} >
          <Text style={{textAlign:'center',fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font,}}>Explore</Text>
        </View>
        )}

        
        {/* <Toolbar {...this.props} showBackIcon={false} centerTitle='Explore' /> */}
         {/* <View style={{ height: hp('100%'),backgroundColor:'plum'}}> */}
         
          <View style={{ width: dw, height: dh,}}>

            {/* Main Container */}
            {/* <Content> */}
             {fetchingData ?
               <ExploreLoader/>
              :!fetchingData && getMemoryData.length == 0 ?
                this.hasNoMemories()
              :
              <View style={{ width: dw, height:Platform.OS == 'ios' ? dh : dh + StatusBar.currentHeight ,}}>
              <FlatList
                style={{marginTop:topPosition }}
                data={this.state.getMemoryData}
                ListHeaderComponent={this.renderHeader}
                ItemSeparatorComponent={this.seperator()}
                renderItem={({ item,index}) => (

                  <View style={Common_Style.locationShadowView}>
                    <View style={Common_Style.ShadowViewImage}>
                      <ImageBackground source={{ uri: newsFeddStoriesUrl + item.data[0].Image.split(',')[0] }}
                        style={{ height: '100%', width: "100%", }}>
                        <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => { this.navigation(item,index) }} >
                          <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                            <LinearGradient
                              style={{ height: 70,}}
                              colors={["#0f0f0f94", "#0f0f0f00"]}
                            >
                              <Text style={[Common_Style.locationText, { marginTop: 10,fontSize:12 }]}>{item._id == "null" ? null : item._id}</Text>
                              <Text style={[Common_Style.locationText,{fontSize:12}]}>{item.data[0].Country == "null" ? null : item.data[0].Country}</Text>
                            </LinearGradient>
                          </View>


                          <View style={{
                            width: wp('100%'), backgroundColor: '#00000000', height: '25%',
                            bottom: 0, right: 0, position: 'absolute',
                           }}>
                            <LinearGradient style={{ height: 70,flex: 1, }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                              <Image source={require('../../Assets/Images/new/LIKE-2.png')} style={[Common_Style.likeImage, { right: 15, position: 'absolute',width: 25, height: 25,bottom: 25,}]} resizeMode={'stretch'} />
                              <View style={{ flexDirection: 'row',  right: "3%", bottom: '10%', position: 'absolute',alignItems:'center' }}>
                                <Text style={[Common_Style.likeCount,{fontSize:14}]}>
                                  {item.data[0].LikeCount == null ? 0 : item.data[0].LikeCount}
                                </Text>
                                <Text style={[Common_Style.likeCount,{fontSize:11}]}> likes</Text>
                              </View>
                            </LinearGradient>
                          </View>
                        </TouchableOpacity>

                      </ImageBackground>
                    </View>

                  </View>
                )}
                ListFooterComponent={this.renderFooter.bind(this)}
                
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
              />
              </View>
              
              }

            {/* </Content> */}

          </View>

        {/* </View> */}

        <View style={{ width: '100%',height:60, position:'absolute',bottom:0,
          backgroundColor:'#00000000',justifyContent:'center'}}>
          {/* <TouchableWithoutFeedback onPress={()=>this.search()} > */}
              <View style={{justifyContent:'center',alignSelf:'center'}}>
                <TextInput value={this.state.text}
                  editable={true}
                  // onKeyPress={Keyboard.dismiss()}
                  //onSubmitEditing = {Keyboard.dismiss}
                  autoCorrect={false}
                  
                  onTouchStart={() => this.search()}
                  style={[Common_Style.searchTextInput, { width: wp(94) }]}
                  placeholder={'Search'}
                  placeholderTextColor={'#6c6c6c'}>
                </TextInput>
              </View>
            {/* </TouchableWithoutFeedback> */}
        </View>
      </View >

    )
  }
}

