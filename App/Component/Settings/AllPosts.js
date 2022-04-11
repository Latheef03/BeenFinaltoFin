import React, { Component } from 'react'
import {
  View, Text, ImageBackground, Image, StyleSheet,
  FlatList, TouchableOpacity, Animated
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
import { Toolbar } from '../commoncomponent'
import LinearGradient from "react-native-linear-gradient";
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import Common_Style from '../../Assets/Styles/Common_Style'
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

export default class Allposts extends Component {
  static navigationOptions = { header: null }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      convertedImages1: '',
      wholeMemoryData: {},
      getMemoryData: '',
      fetchingData: false,
    }
  }

  componentDidMount() {
    this.allPost();
  }

  allPost = () => {
   
    const data = this.props.route.params.data
    if (data != undefined) {
      this.setState({
        getMemoryData: data
      })
    }
    console.log('all posts', data);
  };

  getLocation(data) {
    AsyncStorage.mergeItem('PlaceName', data.Location);
    AsyncStorage.setItem('PlaceName', data.Location);
    console.log('getdata', data)
    this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
  }

  seperator() {
    // <View style={{width:"50%" ,}}></View>
  }

  renderRightImgdone() {
    return <View style={[stylesFromToolbar.leftIconContainer]}>
      <View >
        <Image style={{ width: 20, height: 20 }} />
      </View>
    </View>
  }

  redirectToCard = (item, index) => {
    // console.log('the items ',item,'and the index ',index )
    const { getMemoryData } = this.state;
    console.log('the get memory', getMemoryData);
    // item.UserProfilePic = item.ProfilePic;
    // item.UserName = item.Name
    // item.LikeCount  = item.likecount;
    let memoryData = {}
    memoryData.result = getMemoryData;
    memoryData.status = "True";

    let selectedData = []
    memoryData.result.map((d, ind) => {
      // console.log('the mmodatas',d)
      d.Postid = d.PostId
      d.NewsFeedPost = d.Image
      d.ProfilePic = d.UserProfilePic
      if (d.PostId == item.PostId) {
        memoryData.result.splice(ind, 1)
        memoryData.result.unshift(d)
        // selectedData = [...selectedData,d];
      }
    });

    memoryData.result.map((d, ind) => {
      d.Postid = d.PostId
      d.NewsFeedPost = d.Image
      d.ProfilePic = d.UserProfilePic
      return d
    });

    // memoryData.result = [...selectedData,...memoryData.result];
    var props = { screenName: 'AllPosts', memoryData: memoryData, }
    this.props.navigation.navigate('GetData', { data: props });
  }


  renderPostItem = (item, index) => {

    const event = item.Events && item.Events[0] || {}
    const scale = event.crops && event.crops.scale ? event.crops.scale : 1.0001;
    const trX = event.crops && event.crops.positionX && scale >= 1.01 ? event.crops.positionX : 0;
    const trY = event.crops && event.crops.positionY && scale >= 1.01 ? event.crops.positionY : 0;

    return (
      <View key={`id${index}`} style={Common_Style.locationShadowView}>
       
        <View style={Common_Style.ShadowViewImage}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.redirectToCard(item, index)} >
          <SelectedFilters images={event}
              childrenComponent={(
          <AnimatedImage style={{ width: '100%', height: '100%', transform: [{ perspective: 200 }, { scale: scale },{ translateX: trX },{ translateY: trY }] }} resizeMode={'cover'}
           source={{ uri: serviceUrl.newsFeddStoriesUrl + item.Image.split(',')[0] }}
            >

              <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <LinearGradient style={{ height: 70 }} colors={["#0f0f0f94", "#0f0f0f00"]}  >
                  {item.Location === "null" ? null : <Text onPress={() => this.getLocation(item)} style={[Common_Style.locationText, { marginTop: 10, fontSize: 12 }]}>{item.Location}</Text>}
                  {item.Country === "null" ? null : <Text onPress={() => this.getLocation(item)} style={[Common_Style.locationText, { fontSize: 12 }]}>{item.Country}</Text>}
                </LinearGradient>
              </View>

              <View style={{ width: wp('100%'), backgroundColor: '#00000000', height: '25%', marginBottom: 0, bottom: 0, right: 0, position: 'absolute' }}>
                <LinearGradient style={{ height: 80 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                  <View style={{ flexDirection: 'row', backgroundColor: '#00000000', bottom: 15, position: 'absolute', marginLeft: '55%' }}>
                    {item.ProfilePic != null ?
                      <Image source={{ uri: serviceUrl.profilePic + item.ProfilePic }}
                        style={styles.image} /> :
                      <Image source={require("../../Assets/Images/" + 'profile.png')}
                        style={styles.image} />}
                    <Text style={{ color: '#fff', marginTop: hp(1.5), marginLeft: 10 }}>
                      {item.UserName && item.UserName.length > 10 ? item.UserName.substring(0, 10) + "....." : item.UserName}</Text>
                  </View>
                </LinearGradient>
              </View>

            </AnimatedImage>)}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }



  render() {
    return (
      <View style={{ flex: 1, marginTop: 0, marginBottom: 0 }}>
        <Toolbar {...this.props} centerTitle='All Posts' rightImgView={this.renderRightImgdone()} />

        <FlatList
          data={this.state.getMemoryData}
          ItemSeparatorComponent={this.seperator()}
          renderItem={({ item, index }) => (
            this.renderPostItem(item, index))}
          keyExtractor={item => item._id}
          horizontal={false}
          numColumns={2}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create(
  {

    image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, margin: '3%' },
    locationView: { width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, overflow: 'hidden', },
    container: { flex: 1, width: wp('42.5%'), height: hp('33%'), marginBottom: hp('3%'), borderRadius: 10, marginLeft: wp('5%') }
  }
)



