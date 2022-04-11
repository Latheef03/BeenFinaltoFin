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
import { Toolbar } from '../commoncomponent';
import Modal from "react-native-modal";
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import Common_Style from '../../Assets/Styles/Common_Style'
import LinearGradient from "react-native-linear-gradient";
import { invalidText } from '../_utils/CommonUtils'
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);
const { been_url, method, headers, been_image_urlExplore } = serviceUrl;
export default class savedpostlist extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      savedPostData: '',
      header: '',
      addImageModal: false,
      userSavedPost: [],
      folderId: null
    }
  }

  componentDidMount() {
    debugger
    const { navigation } = this.props;

    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        const getData = this.props.route.params.data;
        console.log('getData will foucus', getData)
        this.setState({
          savedPostData: getData.FeedId,
          header: getData.SavedName,
          userSavedPost: getData.savedposts,
          folderId: getData._id,
          getData: getData
        });
        this.dataReform(getData.savedposts)
      }
    );

  }

  dataReform = (userSavedPost) => {
    // const {userSavedPost} = this.state;
    let allSaved = userSavedPost.length > 0 && userSavedPost.map(v => {
      v.isSelect = false;
      return v;
    })
    this.setState({
      userSavedPost: !allSaved ? [] : userSavedPost
    })
    console.log('savedd postt', userSavedPost);
  }

  addContent = () => {
    return (
      <TouchableOpacity onPress={() => { this.setState({ addImageModal: true }) }}>
        <View style={[stylesFromToolbar.leftIconContainer]}>
          <Image source={require('../../Assets/Images/3dots.png')}
          //  resizeMode={'center'}
            style={{ width: 16, height: 16 }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  changeScreen = () => {
    debugger
    const { userSavedPost, folderId, getData } = this.state;
    console.log('asd', userSavedPost);
    this.setState({ addImageModal: false });
    let data = { savedPostData: userSavedPost, _id: folderId, getData: getData }
    this.props.navigation.navigate('savedfolder', { data: data })
  }

  delete = async () => {
    debugger
    this.setState({ isModalVisible3: false, isOpenBottomModal: false });
    var data = {
      _id: this.state.folderId
    };

    // console.log('the deeee',data);
    const url = serviceUrl.been_url1 + "/savedpostdelete";
    return fetch(url, { method: "POST", headers: headers, body: JSON.stringify(data) })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "True") {
          this.props.navigation.navigate('savedpost')
        }
        else { }
      })
      .catch(function (error) {
        this.setState({ isLoading: false });
        reject(new Error(`Unable to retrieve events.\n${error.message}`));
      });
  }

  redirectToList = (item, index) => {
    const { savedPostData } = this.state
    console.log('saved post', savedPostData);
    console.log('item', item);
    let memoryData = {}
    memoryData.result = savedPostData;
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
    console.log('the mem data', memoryData);
    const props = { screenName: 'AllPosts', memoryData: memoryData, }
    this.props.navigation.navigate('GetData', { data: props });
  }

  renderPostItem = (item, index) => {
 console.log("saved post list item is ",item);
    const event = item.Events && item.Events[0] || {}
    const scale = event.crops && event.crops.scale ? event.crops.scale : 1.0001;
    const trX = event.crops && event.crops.positionX && scale >= 1.01 ? event.crops.positionX : 0;
    const trY = event.crops && event.crops.positionY && scale >= 1.01 ? event.crops.positionY : 0;
    return (
      <View key={`id${index}`} style={Common_Style.locationShadowView}>
        <View style={Common_Style.ShadowViewImage}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.redirectToList(item, index)} >
            <SelectedFilters images={event}
              childrenComponent={(
                <AnimatedImage style={{ width: '100%', height: '100%', transform: [{ perspective: 200 }, { scale: scale }, { translateX: trX }, { translateY: trY }] }} resizeMode={'cover'}
                  source={{ uri: serviceUrl.newsFeddStoriesUrl + item.Image.split(',')[0] }}>

                  <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                    <LinearGradient  style={{ height: 70 }}  colors={["#0f0f0f94", "#0f0f0f00"]}>
                      <Text style={[Common_Style.locationText, { marginTop: 10, fontSize: 12 }]}>{item.Location}</Text>
                      <Text style={[Common_Style.locationText, { fontSize: 12 }]}>{item.Country}</Text>
                    </LinearGradient>
                  </View>

                  <View style={{ width: wp('100%'), backgroundColor: '#00000000', height: '25%', marginBottom: 0, bottom: 0, right: 0, position: 'absolute' }}>
                    <LinearGradient style={{ height: 80, flex: 1 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                      <View style={{ flexDirection: 'row', backgroundColor: '#00000000', bottom: 15, position: 'absolute', marginLeft: '55%' }}>
                        {item.ProfilePic != null ?
                          <Image source={{ uri: serviceUrl.profilePic + item.ProfilePic }}
                            style={styles.image} /> :
                          <Image source={require("../../Assets/Images/" + 'profile.png')}
                            style={styles.image} />}
                        <Text style={{ color: '#fff', marginTop: hp(1.5), marginLeft: 10 }}>
                          {!invalidText(item.UserName)
                            ? item.UserName.length > 10
                              ? item.UserName.substring(0, 10) + "....."
                              : item.UserName
                            : null
                          }
                        </Text>
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
    const { header, addImageModal} = this.state;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 0 }}>
          {/* header */}
          <Toolbar {...this.props} centerTitle={header} rightImgView={this.addContent()} />

          <FlatList
            data={this.state.savedPostData}
            renderItem={({ item, index }) => (
              this.renderPostItem(item, index)
            )}
            keyExtractor={item => item._id}
            horizontal={false}
            numColumns={2}
          />

          <Modal isVisible={addImageModal}
            onBackdropPress={() => this.setState({ addImageModal: false })}
            onBackButtonPress={() => this.setState({ addImageModal: false })}
          >
            <View style={styles.modalStyle} >
              <TouchableOpacity onPress={() => { this.changeScreen() }}>
                <Text style={{ textAlign: 'center', padding: 10 }}>Add Post</Text>
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
          images: { width: wp('33.3%'), height: hp('20%') },
  image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, margin: '3%' },
  modalStyle: {
          width: wp('95%'),
    height: hp('10%'),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 15
  }
}