import React, { Component } from 'react'
import { View, Text, ImageBackground, Image, Animated, FlatList, TouchableOpacity, } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Footer, FooterTab, Content } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import styles from './styles/PostLikedStyle'
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import LinearGradient from "react-native-linear-gradient";
import { ExploreLoader } from '../commoncomponent/AnimatedLoader';
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

export default class PostsYouHaveLiked extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(prop) {
    super(prop);
    this.state = {
      wholeMemoryData: {},
      getMemoryData: '',
      fetchingData: false,
    }
  }


  componentWillMount() {
    this.allPost();
  }

  async allPost() {
    // debugger;
    var data = {
      // Userid: "5e6f2ebde44ab376935b4022"
      Userid: await AsyncStorage.getItem('userId')
    };
    const url = serviceUrl.been_url1 + "/LikePosts";
    this.setState({ fetchingData: true })
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "True") {
          console.log('want to see data', responseJson.result);
          this.setState({
            getMemoryData: responseJson.result,
            wholeMemoryData: responseJson,
            fetchingData: false,
          })
          let likeStatus = responseJson;
          let userStatus = responseJson
          likeStatus.likes && likeStatus.likes.length > 0 && likeStatus.likes.map(item => {
            userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
              if (moment.PostId === item.Postid) {
                moment.likes = true;
              }
              return moment;
            });
            return item;
          });
        }
        else {
          this.setState({
            fetchingData: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          fetchingData: false,
        })
        console.log('ErrorUPM:', error);
      });
  }


  navigation(item, index) {
    debugger
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
        //console.log('the v is ',v)
        v.Postid = v.PostId
        memoryData.result.push(v);
      })
    });

    memoryData.Likes && memoryData.Likes.length > 0 && memoryData.Likes.map(item => {
      memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
        //console.log('the moment ',moment)  
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
      d.userId = d.UserId
      d.NewsFeedPost = d.Image
      d.UserName = d.Name
      if (d.Location == item._id) {
        memoryData.result.splice(ind, 1)
        selectedData = [...selectedData, d];
      }
    });

    memoryData.result.map((d, ind) => {
      d.userId = d.UserId
      d.NewsFeedPost = d.Image
      d.UserName = d.Name
      return d
    });
    memoryData.result = [...selectedData, ...memoryData.result];
    // if (index > 0) {
    //     const currentIndex = index;
    //     let dataLen = 0;
    //     getMemoryData.map((m, i) => {
    //         if (currentIndex > i) {
    //             dataLen += m.data.length
    //             actualIndex = dataLen
    //         }
    //     });
    //     console.log('--datalen', dataLen)
    // }
    // console.log('the actual index are out', actualIndex);
    console.log('the memory data', memoryData);
    var props = { screenName: 'Memories', selectedPostId: actualIndex, memoryData: memoryData, }
    this.props.navigation.navigate('GetData', { data: props });
  }


  renderPostItem = (item, index) => {
    const event = item.data[0].Events && item.data[0].Events[0] || {}
    const scale = event.crops && event.crops.scale ? event.crops.scale : 1.0001;
    const trX = event.crops && event.crops.positionX && scale >= 1.01 ? event.crops.positionX : 0;
    const trY = event.crops && event.crops.positionY && scale >= 1.01 ? event.crops.positionY : 0;
    return (
      <View style={Common_Style.locationShadowView}>
        <View style={Common_Style.ShadowViewImage}>
        <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => { this.navigation(item, index) }} >
          <SelectedFilters images={event}
            childrenComponent={(
              <AnimatedImage style={{ width: '100%', height: '100%', transform: [{ perspective: 200 }, { scale: scale }, { translateX: trX }, { translateY: trY }] }} resizeMode={'cover'}
                source={{ uri: serviceUrl.newsFeddStoriesUrl + item.data[0].Image.split(',')[0] }}>
                
                  <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                    <LinearGradient
                      style={{ height: 70 }}
                      colors={["#0f0f0f94", "#0f0f0f00"]}
                    >
                      <Text style={[Common_Style.locationText, { marginTop: 10, }]}
                        numberOfLines={1}>{item.data[0].Location}</Text>
                      <Text style={[Common_Style.locationText, { marginTop: 3 }]}
                        numberOfLines={1}>{item.data[0].Country}</Text>
                    </LinearGradient>
                  </View>

                  <View style={{
                    width: wp('100%'), backgroundColor: '#00000000', height: '25%',
                    marginBottom: 0, bottom: 0, right: 0, position: 'absolute'
                  }}>
                    <LinearGradient style={{ height: 80 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                      <View style={{ flexDirection: 'row', backgroundColor: '#00000000', bottom: 15, position: 'absolute', marginLeft: '55%' }}>
                        {item.data[0].ProfilePic != null ?
                          <Image source={{ uri: serviceUrl.profilePic + item.data[0].ProfilePic }}
                            style={styles.image} /> :
                          <Image source={require("../../Assets/Images/" + 'profile.png')}
                            style={styles.image} />}
                        <Text style={{ color: '#fff', marginTop: hp(1.5), marginLeft: 10 }}>{item.data[0].Name.length > 10 ? item.data[0].Name.substring(0, 10) + "....." : item.data[0].Name}</Text>
                      </View>
                    </LinearGradient>
                  </View>
              </AnimatedImage>)} />
              </TouchableOpacity>
        </View>
      </View>)

  }



  seperator() {

  }

  createFolderIconView = () => <View />

  render() {
    const { fetchingData, getMemoryData } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', marginTop: 0, }}>

        <Toolbar {...this.props} leftTitle="Posts You Have Liked" rightImgView={this.createFolderIconView()} />

        {fetchingData ?
          <ExploreLoader />
          : !fetchingData && getMemoryData.length == 0 ?
            <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
              <View style={styles.hasNoMem}>
                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                <Text style={Common_Style.noDataText}> You have not Liked anyone posts</Text>
              </View>
            </View>
            :
            <FlatList
              style={{}}
              data={getMemoryData}
              ItemSeparatorComponent={this.seperator()}
              renderItem={({ item, index }) => (
                this.renderPostItem(item, index)
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />}
      </View>

    )
  }
}




