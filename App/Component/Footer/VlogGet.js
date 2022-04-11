import React, { Component } from 'react'
import {
    Text, Clipboard, Image, FitImage, ImageBackground, StatusBar,
    View, ToastAndroid, TextInput, Share, TouchableOpacity, ScrollView, FlatList,
    StyleSheet
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Spinner from '../../Assets/Script/Loader';
import styles from '../../styles/FooterStyle'
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar, FooterTabBar } from '../commoncomponent';
import LinearGradient from "react-native-linear-gradient";
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import Video from "react-native-video";
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import {ExploreLoader} from '../commoncomponent/AnimatedLoader';
const shareOptions = {
    title: "Title",
    message: "http://been.com/5e47d082e301b51201e8adac",
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};

export default class VlogGet extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            userName: '',
            getAlbumData: '',
            getMemoryData: '',
            convertedImages1: '',
            userProfileScreen: 0,
            no_record_found: false,
            isLoading: false,
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
            wholeMemoryData: {},
            fetchingData: true
        }
    }

    componentDidMount = () => {
        this.getMemeories(true);
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                // this.getMemeories(false);  
                // const Comments = this.props.route.params.data          
                
                // this.setState({ screenName: Comments ? Comments.screenName : '', })
            }

        );
    };

    onProgressVideo = (e,data,index) =>{
        // console.log('the e',e,'--data',data,'--index',index)
      const {getMemoryData} = this.state;
      data.pause = e.currentTime > 0 ? true : false ;
      getMemoryData[index] = data;
    //   console.log('the data',getMemoryData);
      this.setState({
        getMemoryData
      })  
    }

    memActive = () => {
        console.log('mem active success');
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

        var data = { Userid: await AsyncStorage.getItem('userId') }
        const url = been_url + "/GetVlog";
        this.setState({ fetchingData: loader })
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    let result = responseJson.Result;
                    console.log('the get memories', responseJson)
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
                        no_record_found: false,
                        fetchingData: false
                    })
                }
                else {
                    this.setState({
                        isLoading: false,
                        no_record_found: true,
                        fetchingData: false
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    fetchingData: false
                })
                console.log('ErrorUPM:', error);
            });
    }

    navigation(item, index) {
        const { getMemoryData, wholeMemoryData } = this.state;
        console.log('the mem items are', index);
        const arrayLen = getMemoryData.length;
        let actualIndex = 0;
        // console.log('the likes',getMemoryData)
        let memoryData = { result: [] };
        memoryData.UserLiked = wholeMemoryData.UserLiked;
        memoryData.status = wholeMemoryData.status;
        memoryData.userData = wholeMemoryData.userData;
        memoryData.Bookmarked = wholeMemoryData.Bookmarked;


        getMemoryData.length > 0 && getMemoryData.map(m => {
            m.data.map(v => {
                v.Postid = v._id
                memoryData.result.push(v);
            })
        });

        memoryData.UserLiked && memoryData.UserLiked.length > 0 && memoryData.UserLiked.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                if (moment.Postid === item.Postid) {
                    moment.likes = true;
                }
                return moment;
            });
            return item;
        });

        memoryData.Bookmarked && memoryData.Bookmarked.length > 0 && memoryData.Bookmarked.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                if (moment.Postid === item.Postid) {
                    moment.Bookmarks = true;
                }
                return moment;
            });
            return item;
        });

        console.log('the memory data', memoryData);

        let selectedData = []
        memoryData.result.map((d, ind) => {
            console.log('the mmodatas',d)
            d.userId = d.UserId
            d.Image = d.NewsFeedPost
            if (d.Location == item._id) {
                memoryData.result.splice(ind, 1)
                selectedData = [...selectedData, d];
            }
        });
        memoryData.result = [...selectedData,...memoryData.result];
        var props = { screenName: 'Vlog', selectedPostId: actualIndex, memoryData: memoryData, }
        this.props.navigation.navigate('GetData', { data: props });
    }

    getLocation(data) {
        AsyncStorage.mergeItem('PlaceName', data.Location);
        AsyncStorage.setItem('PlaceName', data.Location);
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }

    seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }


    renderRightImgdone() {
        return <View>
            <View style={[stylesFromToolbar.leftIconContainer, { flexDirection: 'row', }]}>
                <View >
                    <Image style={{ width: 20, height: 20 }} />
                </View>
            </View>
        </View>
    }

      renderVlogItems = (item,index)=>{
          console.log('the items',item)
          const vidName = item.data[0].NewsFeedPost;
          item.pause == undefined ? false : item.pause 
          return (
              <View style={{ flex: 1, maxWidth: "46%", marginLeft: '2.8%', marginBottom: '2.5%', borderRadius: 18, }}>
                  <View style={[Common_Style.ShadowViewImage]}>
                      
                          <Video
                           source ={{uri:serviceUrl.newsFeddStoriesUrl + vidName}}
                           resizeMode={'cover'}
                           style={{ height: '100%', width: "100%",...StyleSheet.absoluteFillObject }}
                           paused = {item.pause}
                           volume = {0.0}
                           onProgress = {e=>this.onProgressVideo(e,item,index)}
                          />
                       
                        <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => { this.navigation(item, index) }} >
                              <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8,}}>
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
                                      <Image source={require('../../Assets/Images/redheart.png')} style={[Common_Style.likeImage, { right: 15, position: 'absolute' }]} resizeMode={'contain'} />
                                      <View style={{ flexDirection: 'row', backgroundColor: '#00000000', right: 12, bottom: 15, position: 'absolute' }}>
                                          <Text style={[Common_Style.likeCount,]}>
                                              {item.totalLike == null ? 0 : item.totalLike}
                                          </Text>
                                          <Text style={[Common_Style.likeCount]}> likes</Text>

                                      </View>
                                  </LinearGradient>
                              </View>
                          </TouchableOpacity>
                  </View>

              </View>
          )
      }


    render() {
        const { fetchingData, getMemoryData } = this.state;
        return (
            <View style={{ flex: 1,marginTop:0 ,backgroundColor:'#fff'}}>
                <StatusBar backgroundColor="#0000" barStyle='dark-content' />
                <Toolbar  {...this.props} icon={"Down"} centerTitle="Vlog" rightImgView={this.renderRightImgdone()} />
                {fetchingData ?
                    <ExploreLoader />
                    : !fetchingData && getMemoryData.length == 0 ?
                    <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                      <View style={styles.hasNoMem}>
                         <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                         <Text style={Common_Style.noDataText}> You have not created any Videos yet!</Text>
                      </View>
                    </View>
                    :
                       <FlatList
                        style={{  marginBottom: 60, }}
                        data={getMemoryData}
                        ItemSeparatorComponent={this.seperator()}
                        renderItem={({ item, index }) => (
                            this.renderVlogItems(item,index)
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                    /> 
                   }


                <FooterTabBar {...this.props} tab={4} />
            </View>

        )
    }
}

