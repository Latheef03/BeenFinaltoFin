import React, { Component } from 'react'
import {
  Text, StatusBar, StyleSheet, Image, FlatList,
  View, TouchableOpacity, ImageBackground, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ToggleSwitch from 'toggle-switch-react-native'
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import { Toolbar } from '../commoncomponent'
import Modal from "react-native-modal";
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import Common_Style from '../../Assets/Styles/Common_Style'
import LinearGradient from "react-native-linear-gradient";
import { invalidText } from '../_utils/CommonUtils'
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

const { been_url, method, headers, been_image_urlExplore } = serviceUrl;
export default class savedPlaceList extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      savedPostData: [],
      header: '',
      addImageModal: false,
      userSavedPlace: [],
      folderId: null
    }
  }

  componentDidMount() {

    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        const getData = this.props.route.params.data
        console.log('the get data in saved place list ', getData)
        this.setState({
          savedPostData: getData.SavedAllPlaces,
          header: getData.SavedName,
          userSavedPlace: getData.saveplaces,
          folderId: getData._id,
          getData: getData
        })
        this.dataReform(getData.SavedAllPlaces)
      }
    );
  }

  dataReform = (userSavedPost) => {
    // const {userSavedPost} = this.state;
    console.log('the userSavedPost', userSavedPost)
    let allSaved = userSavedPost.length > 0 && userSavedPost.map(v => {
      v.isSelect = false;
      return v;
    })
    this.setState({
      savedPostData: !allSaved ? [] : userSavedPost
    })
    console.log('savedd postt', userSavedPost);
  }

  addContent = () => {
    return (
      <TouchableOpacity onPress={() => { this.setState({ addImageModal: true }) }}>
        <View style={[stylesFromToolbar.leftIconContainer]}>
          <Image source={require('../../Assets/Images/3dots.png')}
     //   resizeMode={'center'}
            style={{ width: 16, height: 16 }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  changeScreen = () => {
    const { savedPostData, folderId, getData } = this.state;
    // console.log('asd',userSavedPost);
    this.setState({ addImageModal: false });
    let data = { savedPostData: savedPostData, _id: folderId, getData: getData }
    console.log('asd', data);
    this.props.navigation.navigate('SavedFolderPlace', { data: data })
  }

  delete = async () => {
    debugger
    this.setState({ isModalVisible3: false, isOpenBottomModal: false });
    var data = {
      _id: this.state.folderId
    };

    // console.log('the deeee',data);
    const url = serviceUrl.been_url1 + "/savedplacesdelete";
    return fetch(url, { method: "POST", headers: headers, body: JSON.stringify(data) })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "True") {
          this.props.navigation.navigate('SavedPlaces')
        }
        else { }
      })
      .catch(function (error) {
        this.setState({ isLoading: false });
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  redirectToList = (item, index) => {
    const { savedPostData, userSavedPlace } = this.state

    let USPData = []
    savedPostData.map(sp => {
      userSavedPlace && userSavedPlace.length > 0 &&
        userSavedPlace.map(usp => {
          if (sp.PostId == usp.PostId) {
            USPData.push(sp)
          }
        })
    })

    let memoryData = {}
    memoryData.result = USPData;
    memoryData.status = "True";

    let selectedData = []
    memoryData.result.map((d, ind) => {
      // console.log('the mmodatas',d)
      d.Postid = d.PostId
      d.NewsFeedPost = d.Image
      d.ProfilePic = d.UserProfilePic
      d.likecount = d.LikeCount
      d.userId = d.UserId
      d.TagsId = d.tagid
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
      d.likecount = d.LikeCount
      d.userId = d.UserId
      d.TagsId = d.tagid
      return d
    });

    // memoryData.result = [...selectedData,...memoryData.result];
    const props = { screenName: 'SavedplacesList', memoryData: memoryData, }
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
          <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => {
            this.redirectToList(item, index) }} >
            <SelectedFilters images={event}
              childrenComponent={(
                <AnimatedImage style={{ width: '100%', height: '100%', transform: [{ perspective: 200 }, { scale: scale }, { translateX: trX }, { translateY: trY }] }} resizeMode={'cover'}
                  source={{ uri: serviceUrl.newsFeddStoriesUrl + item.PostedImage.split(',')[0] }}>
                  <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                    <LinearGradient style={{ height: 70 }} colors={["#0f0f0f94", "#0f0f0f00"]}>
                      <Text style={[Common_Style.locationText, { marginTop: 10, }]} numberOfLines={1} >{item.SavedPlaceName}</Text>
                      <Text style={[Common_Style.locationText, { marginTop: 6 }]} numberOfLines={1} >{item.Country}</Text>
                    </LinearGradient>
                  </View>
                </AnimatedImage>)} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  render() {
    const { header, addImageModal } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 0 }}>
        {/* header */}
        <Toolbar {...this.props} centerTitle={header} rightImgView={this.addContent()} />


        <FlatList
          data={this.state.userSavedPlace}
          renderItem={({ item, index }) => (
            this.renderPostItem(item, index))}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={2}
        />

        <Modal isVisible={addImageModal}
          onBackdropPress={() => this.setState({ addImageModal: false })}
          onBackButtonPress={() => this.setState({ addImageModal: false })}
        >
          <View style={styles.modalStyle} >
            <TouchableOpacity onPress={() => { this.changeScreen() }}>
              <Text style={{ textAlign: 'center', padding: 10 }}>Add Place</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.delete() }}>
              <Text style={{ textAlign: 'center', padding: 10 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Modal>


      </View>
    )
  }
}

const styles = {
  image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, margin: '3%' },
  images: { width: '100%', height: '100%' },
  modalStyle: {
    width: wp('95%'),
    height: hp('10%'),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 15
  }
}