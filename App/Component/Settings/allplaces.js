import React, { Component } from 'react'
import {
  Text, StyleSheet, Image, FitImage, Button, ImageBackground,
  View, ToastAndroid, Animated, TouchableOpacity, ScrollView, FlatList
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Common_Style from '../../Assets/Styles/Common_Style'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
import { Toolbar } from '../commoncomponent'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

export default class allplaces extends Component {
  static navigationOptions = { header: null }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: '',
      convertedImages1: ''
    }
  }
  componentWillMount() {
    this.flat();
  }

  flat = () => {
    const data = this.props.route.params.data
    if (data != undefined) {
      this.setState({
        dataSource: data
      })
    }
    console.log('all places', data);
  }

  seperator() {
    <View style={{ width: "50%", margin: '5%' }}></View>
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
    const { dataSource } = this.state;
    console.log('the get memory', dataSource);

    let memoryData = {}
    memoryData.result = dataSource;
    memoryData.status = "True";

    let selectedData = []
    memoryData.result.map((d, ind) => {
      // console.log('the mmodatas',d)
      d.likecount = d.LikeCount
      d.NewsFeedPost = d.Image
      d.ProfilePic = d.UserProfilePic
      d.Postid = d.PostId
      d.TagsId = d.tagid
      d.userId = d.UserId
      if (d.PostId == item.PostId) {
        memoryData.result.splice(ind, 1)
        memoryData.result.unshift(d)
        // selectedData = [...selectedData,d];
      }
    });

    memoryData.result.map((d, ind) => {
      d.likecount = d.LikeCount
      d.NewsFeedPost = d.Image
      d.ProfilePic = d.UserProfilePic
      d.Postid = d.PostId
      d.TagsId = d.tagid
      d.userId = d.UserId
      return d
    });

    // memoryData.result = [...selectedData,...memoryData.result];
    console.log('complete mem data', memoryData);
    var props = { screenName: 'AllPosts', memoryData: memoryData, }
    this.props.navigation.navigate('GetData', { data: props });
  }

  renderPostItem = (item, index) => {
    console.log("Item is n all places",item);
    const event = item.Events && item.Events[0] || {}
    const scale = event.crops && event.crops.scale ? event.crops.scale : 1.0001;
    const trX = event.crops && event.crops.positionX && scale >= 1.01 ? event.crops.positionX : 0;
    const trY = event.crops && event.crops.positionY && scale >= 1.01 ? event.crops.positionY : 0;
    return (
      <View key={`id${index}`} style={[Common_Style.locationShadowView,]}>
        <View style={Common_Style.ShadowViewImage}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.redirectToCard(item, index)}>
          <SelectedFilters images={event}
              childrenComponent={(
          <AnimatedImage style={{ width: '100%', height: '100%', transform: [{ perspective: 200 }, { scale: scale },{ translateX: trX },{ translateY: trY }] }} resizeMode={'cover'}
            source={{ uri: serviceUrl.newsFeddStoriesUrl + item.PostedImage.split(',')[0] }}>
              <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <LinearGradient
                  style={{ height: 70 }}
                  colors={["#0f0f0f94", "#0f0f0f00"]}
                >
                  <Text style={[Common_Style.locationText, { marginTop: 10 }]} numberOfLines={1}>
                    {item.SavedPlaceName}
                  </Text>
                  <Text style={[Common_Style.locationText, { marginTop: 6 }]} numberOfLines={1}>
                    {item.Country}
                  </Text>
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
      <View style={{ flex: 1, marginTop: 0, marginBottom: '-3%' }}>

        <Toolbar {...this.props} centerTitle='All Places' rightImgView={this.renderRightImgdone()} />

        {/* main container */}

        <FlatList
          data={this.state.dataSource}
          style={{}}
          ListFooterComponent={<View style={{ height: 30 }} />}
          ItemSeparatorComponent={this.seperator()}
          renderItem={({ item, index }) => (
            this.renderPostItem(item, index)
          )}
          keyExtractor={item => item.id}
          horizontal={false}
          numColumns={2}
        />


      </View>
    )
  }
}



const styles = StyleSheet.create(
  {

    image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' }
  }
)


