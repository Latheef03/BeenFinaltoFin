import React, { Component } from 'react';
import {
  View, Text, Image, TouchableOpacity, StatusBar, StyleSheet, ScrollView,
  ImageBackground, Animated, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FlatList } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import { ExploreLoader } from '../commoncomponent/AnimatedLoader';
let Common_Api = require('../../Assets/Json/Common.json')
const { width, height } = Dimensions.get("window");
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import LinearGradient from "react-native-linear-gradient";
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

export default class TaggedPost extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(prop) {
    super(prop);
    this.state = {
      id: '',
      dataSource: '',
      wholeMemoryData: {},
      getMemoryData: '',
      openView: null,
      convertedImages1: '',
      gestureName: 'none',
      selectedTagData: [],
      screenName: '',
      fetchingData: true
    }
  }

  componentWillMount() {
    this.flat(true);
  }

  componentDidMount = async () => {
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        const Comments = this.props.route.params.data
      
        this.setState({
          screenName: Comments.screenName
        })
        this.flat(false);
      }
    );
  };

  seperator() {
    <View style={{ width: "50%", margin: '5%' }}></View>
  }
  cardView(data) {
    var data = { screenName: "TaggedPost" }
    this.props.navigation.navigate('GetTagData', { data: data });
  }

  likesView(data) {
    alert(JSON.stringify(data))
    var data = {
      data: data.PostId === undefined ? data.Postid : data.PostId,
      screen: "Likes"
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }

  comments(data) {
    this.props.navigation.navigate('comments', {
      data: data
    });
  }

  bookmarkView(data) {
    var data = {
      data: data.PostId === undefined ? data.Postid : data.PostId,
      screen: "Bookamarks"
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }

  componentWillUnmount() {
    AsyncStorage.removeItem('OtherUserId')
  }

  flat = async (loader) => {
    // debugger;
    var id1 = await AsyncStorage.getItem("OtherUserId");
    this.setState({ isLoading: true });
    const { headers, been_url } = serviceUrl;
    const url = been_url + "/GetTagPost";
    var id = await AsyncStorage.getItem('userId');
    var data = {
      UserId: id,
    }
    this.setState({ fetchingData: loader })
    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "True") {
          let result = responseJson.result;

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
            wholeMemoryData: responseJson,
            fetchingData: false
          })
        }
        else {
          this.setState({
            fetchingData: false
          });
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  navigation(item, index) {
    // debugger;
    const { getMemoryData, wholeMemoryData } = this.state;
    console.log('the mem items are', index);
    const arrayLen = getMemoryData.length;
    let actualIndex = 0;
    // console.log('the likes',getMemoryData)
    let memoryData = { result: [] };
    memoryData.Likes = wholeMemoryData.Likes;
    memoryData.status = wholeMemoryData.status;
    memoryData.Bookmarks = wholeMemoryData.Bookmarks;

    getMemoryData.length > 0 && getMemoryData.map(m => {
      m.data.map(v => {
        v.Postid = v.Postid
        memoryData.result.push(v);
      })
    });

    memoryData.Likes && memoryData.Likes.length > 0 && memoryData.Likes.map(item => {
      memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
        if (moment.Postid === item.Postid) {
          moment.likes = true;
        }
        return moment;
      });
      return item;
    });

    memoryData.Bookmarks && memoryData.Bookmarks.length > 0 && memoryData.Bookmarks.map(item => {
      memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
        if (moment.Postid === item.Postid) {
          moment.Bookmarks = true;
        }
        return moment;
      });
      return item;
    });


    let selectedData = []
    memoryData.result.map((d, ind) => {
      d.likecount = d.LikeCount
      d.ProfilePic = d.UserProfilePic
      d.NewsFeedPost = d.Image
      if (d.Location == item._id) {
        memoryData.result.splice(ind, 1)
        selectedData = [...selectedData, d];
      }

    });

    memoryData.result.map((d, ind) => {
      d.likecount = d.LikeCount
      d.ProfilePic = d.UserProfilePic
      d.NewsFeedPost = d.Image
      return d;
    })

    memoryData.result = [...selectedData, ...memoryData.result];
    console.log('the actual index are out', memoryData);
    var props = { screenName: 'TagPost', selectedPostId: actualIndex, memoryData: memoryData, }
    this.props.navigation.navigate('GetData', { data: props });
  }

  getLocation(data) {
    AsyncStorage.mergeItem('PlaceName', data.Location);
    AsyncStorage.setItem('PlaceName', data.Location);
    this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  renderRightImgdone() {
    return <View>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
        <Image resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
      </TouchableOpacity>
    </View>
  }


  renderPostItem = (item, index) => {
    const event = item.data[0].Events && item.data[0].Events[0] || {}
    const scale = event.crops && event.crops.scale ? event.crops.scale : 1.0001;
    const trX = event.crops && event.crops.positionX && scale >= 1.01 ? event.crops.positionX : 0;
    const trY = event.crops && event.crops.positionY && scale >= 1.01 ? event.crops.positionY : 0;
    return (
      <View style={Common_Style.locationShadowView}>
        <View style={Common_Style.ShadowViewImage}>
          <SelectedFilters images={event}
            childrenComponent={(
              <AnimatedImage style={{ width: '100%', height: '100%', transform: [{ perspective: 200 }, { scale: scale }, { translateX: trX }, { translateY: trY }] }} resizeMode={'cover'}
                source={{ uri: serviceUrl.newsFeddStoriesUrl + item.data[0].Image.split(',')[0] }}>
                <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => { this.navigation(item, index) }} >
                  <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                    <LinearGradient
                      style={{ height: 70 }}
                      colors={["#0f0f0f94", "#0f0f0f00"]}>
                      <Text style={[Common_Style.locationText, { marginTop: 10 }]}>{item._id == "null" ? null : item._id}</Text>
                      <Text style={Common_Style.locationText}>{item.data[0].Country == "null" ? null : item.data[0].Country}</Text>
                    </LinearGradient>
                  </View>
                  <View style={{
                    width: wp('100%'), backgroundColor: '#00000000', height: '26%',
                    marginBottom: 0, bottom: 0, right: 0, position: 'absolute'
                  }}>
                    <LinearGradient style={{ height: 80, flex: 1 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                      <Image source={require('../../Assets/Images/new/LIKE-2.png')} style={[Common_Style.likeImage, { right: 15, position: 'absolute' }]} resizeMode={'contain'} />
                      <View style={{ flexDirection: 'row', backgroundColor: '#00000000', right: 12, bottom: 15, position: 'absolute' }}>
                        <Text style={[Common_Style.likeCount,]}>
                          {item.data[0].LikeCount == null ? 0 : item.data[0].LikeCount}
                        </Text>
                        <Text style={[Common_Style.likeCount]}> likes</Text>

                      </View>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </AnimatedImage>)} />
        </View>

      </View>
    )
  }

  render() {
    const { profilePic, newsFeddStoriesUrl } = serviceUrl;
    const { fetchingData, getMemoryData } = this.state;
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#fff', marginTop: 0 }}>

        <Toolbar {...this.props} centerTitle="Tagged Posts" rightImgView={this.renderRightImgdone()} />

        {fetchingData ?
          <ExploreLoader />
          : !fetchingData && getMemoryData.length == 0 ?
            <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
              <View style={styles.hasNoMem}>
                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                <Text style={Common_Style.noDataText}> You have not been Tagged yet!</Text>
              </View>
            </View>
            :

            <FlatList
              style={{}}
              data={getMemoryData}
              extraData={this.state.getMemoryData}
              ItemSeparatorComponent={this.seperator()}
              renderItem={({ item, index }) => (
                this.renderPostItem(item, index)
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />
        }

      </View>
    )
  }
}

const styles = StyleSheet.create({
  hasNoMem: { justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
  loginButton: {
    backgroundColor: "#87cefa",
    alignItems: "center",
    height: hp("6%"),
    width: wp("34%"),
    color: "blue",
    borderRadius: 8,
    justifyContent: "center",
    textAlign: "center",
    shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  card: { width: wp('95%'), height: 'auto', borderWidth: 1, borderRadius: 10, borderColor: '#ddd', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 10, shadowRadius: 10, elevation: 4, marginLeft: 'auto', marginRight: 'auto', marginTop: 5, marginBottom: 5, backgroundColor: '#fff', },
  view: { justifyContent: 'flex-end', margin: 10, },
  modalView1: { width: wp('90%'), height: hp('20%'), backgroundColor: '#fff', borderRadius: 8 },
  nextButton: {
    backgroundColor: "#87cefa",
    height: hp("5%"),
    width: wp("20%"),
    marginTop: 25,
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  LoginButtontxt: {
    color: "#909090",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 16,
  },
  hasNoTags: {
    justifyContent: 'center', alignItems: 'center',
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  textInput: { width: wp('90%'), backgroundColor: 'transparent', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 25, padding: 15, borderWidth: 1, borderColor: '#cbcbcb', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
})