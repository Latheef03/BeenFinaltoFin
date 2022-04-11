
import React, { Component } from 'react';
import {
  View, Text, Image, TouchableOpacity, StatusBar, StyleSheet, ScrollView,
  ImageBackground, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import Common_Style from '../../Assets/Styles/Common_Style'
import {Common_Color} from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import Spinner from '../../Assets/Script/Loader';
import LinearGradient from "react-native-linear-gradient";
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'

export default class OtherTagged extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(prop) {
    super(prop);
    this.state = {
      id: '',
      dataSource: '',
      openView: null,
      convertedImages1: '',
      gestureName: 'none',
      selectedTagData: [],
      otherid: "",
      no_record_found: false,
      isLoading: false,
    }
  }

  UNSAFE_componentWillMount() {
   // debugger;
   const Comments = this.props.route.params?.data
    this.setState({
      otherid: Comments.otherid,
    });
    this.flat();
  }

  componentDidMount = () => {
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.flat();
      }
    );
  };

  flat = async () => {
    var id1 = await AsyncStorage.getItem("OtherUserId");
    this.setState({ isLoading: true });
    const { headers, been_url } = serviceUrl;
    const url = been_url + "/GetTagPost";
    var id = await AsyncStorage.getItem('userId');
    var data = {
      UserId: id,
      followedId:this.state.otherid
    }
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
            isLoading: false,
            no_record_found: false
          })
        }
        else {
          this.setState({
            isLoading: false,
            no_record_found: true
          });
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  navigation(item, index) {
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
      memoryData.result.map((d,ind)=>{
        // console.log('the mmodatas',d)
        d.likecount = d.LikeCount
        d.ProfilePic = d.UserProfilePic
        d.NewsFeedPost = d.Image
        d.TagsId = d.tagid
        if(d.Location == item._id){
          memoryData.result.splice(ind,1)
          selectedData = [...selectedData,d];
        }
      });

      memoryData.result.map((d,ind)=>{
        d.likecount = d.LikeCount
        d.ProfilePic = d.UserProfilePic
        d.NewsFeedPost = d.Image
        d.TagsId = d.tagid
       return d
      });

      
      memoryData.result = [...selectedData,...memoryData.result];
    // if (index > 0) {
    //   const currentIndex = index;
    //   let dataLen = 0;
    //   getMemoryData.map((m, i) => {
    //     if (currentIndex > i) {
    //       dataLen += m.data.length
    //       actualIndex = dataLen
    //     }
    //   });
    //   console.log('--datalen', dataLen)
    // }
 
    var props = { screenName: 'TagPost', selectedPostId: actualIndex, memoryData: memoryData, }
    this.props.navigation.navigate('GetData', { data: props });
  }



  seperator() {
    <View style={{ width: "50%", margin: '5%' }}></View>
  }
  cardView(data) {
    var data = { screenName: "TaggedPost", other: this.state.otherid }
    this.props.navigation.navigate('GetTagData', { data: data });
  }
  renderViewMore(onPress) {
    return (
      <Text style={Common_Style.viewMoreText} onPress={onPress}>View more</Text>
    )
  }
  renderViewLess(onPress) {
    return (
      <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }} onPress={onPress} >View Less</Text>)
    //   <Text style={Common_Style.viewMoreText} onPress={onPress} >View Less</Text>
    // )
  }

  goBack = () => {
    const { openView } = this.state;
    if (openView === 1) {
      this.setState({ openView: null })
    }
    else { this.props.navigation.goBack(); }
  }

  likesView(data) {
    var data = {
      data: data.PostId === undefined ? data.Postid : data.PostId,
      screen: "Likes"
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }

  comments(data) {
    this.props.navigation.navigate('comments', { data: data });
  }

  bookmarkView(data) {
    var data = {
      data: data.PostId === undefined ? data.Postid : data.PostId,
      screen: "Bookamarks"
    }
    this.props.navigation.navigate('LikesView', { data: data });
  }



  hasNoData = () => {
    if (this.state.dataSource.length == 0) {
      return <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, }}>
        <Image source={require('../../Assets/Images/3099422-256.png')}
          style={{
            width: 100, height: 100, marginBottom: 20,
          }}
         resizeMode={'center'}
        />
        <Text style={Common_Style.noDataText}> You have not Tagged Posts yet!</Text>

      </View>
    }
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

  renderRightImgdone() {
    return <View>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
        <Image resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
      </TouchableOpacity>
    </View>
  }

  render() {
    const { profilePic, newsFeddStoriesUrl } = serviceUrl;
    const { selectedTagData, } = this.state;
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#fff' ,marginTop:0}}>

        <Toolbar {...this.props} centerTitle="Tagged Posts" rightImgView={this.renderRightImgdone()} />


        {this.state.isLoading != true ?
            <FlatList
            style={{ marginBottom: 2 }}
            data={this.state.getMemoryData}
            extraData={this.state.getMemoryData}
            ItemSeparatorComponent={this.seperator()}
            renderItem={({ item, index }) => (

              <View style={Common_Style.locationShadowView}>
                <View style={Common_Style.ShadowViewImage}>
                  <ImageBackground source={{ uri: newsFeddStoriesUrl + item.data[0].Image.split(',')[0] }}
                    style={{ height: '100%', width: "100%", }}>
                    <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => { this.navigation(item, index) }} >
                      <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                        <LinearGradient
                          style={{ height: 70 }}
                          colors={["#0f0f0f94", "#0f0f0f00"]}
                        >
                          <Text style={[Common_Style.locationText, { marginTop: 10 }]}>{item._id == "null" ? null : item._id}</Text>
                          <Text style={Common_Style.locationText}>{item.data[0].Country == "null" ? null : item.data[0].Country}</Text>
                        </LinearGradient>
                      </View>
                      <View style={{
                        width: wp('100%'), backgroundColor: '#00000000', height: '25%',
                        marginBottom: 0, bottom: 0, right: 0, position: 'absolute'
                      }}>
                        <LinearGradient style={{ height: 80,flex:1 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                          <Image source={require('../../Assets/Images/new/LIKE-2.png')} style={[Common_Style.likeImage, { right: 15, position: 'absolute',width: 25, height: 25,bottom: 30, }]} resizeMode={'contain'} />
                          
                          <View style={{ flexDirection: 'row', backgroundColor: '#00000000', right: 12, bottom: 15, position: 'absolute' }}>
                            <Text style={[Common_Style.likeCount,]}>
                              {item.data[0].LikeCount == null ? 0 : item.data[0].LikeCount}
                            </Text>
                            <Text style={[Common_Style.likeCount]}> likes</Text>

                          </View>
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>

                  </ImageBackground>
                </View>

              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
          :
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: '48%' }}>
            <Spinner color="#64b3f2" />
          </View>}

        <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
          {this.state.no_record_found === true ? (
            <View style={styles.hasNoMem}>
              <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
              <Text style={Common_Style.noDataText}> You have not tagged post yet!</Text>
            </View>
          ) : null}
        </View>

      </View>
    )
  }
}


const styles = StyleSheet.create({
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
  card: { width: wp('95%'), height: hp('75'), borderWidth: 1, borderRadius: 10, borderColor: '#ddd', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 10, shadowRadius: 10, elevation: 4, marginLeft: 'auto', marginRight: 'auto', marginTop: 5, marginBottom: 5, backgroundColor: '#fff', },
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