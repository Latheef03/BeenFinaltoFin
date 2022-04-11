
import React, { Component } from 'react'
import {
    Text, Clipboard, Image, FitImage, ImageBackground, StatusBar,
    View, ToastAndroid, TextInput, Share, TouchableOpacity, ScrollView, FlatList
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from "react-native-video";
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Spinner from '../../Assets/Script/Loader';
import styles from '../../styles/FooterStyle'
import Common_Style from '../../Assets/Styles/Common_Style'
import LinearGradient from "react-native-linear-gradient";
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from '../../Assets/Colors'
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const imagePath1 = '../../Assets/Images/BussinesIcons/';

const shareOptions = {
    title: "Title",
    message:'Post Shared',
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};


export default class BusinessPlaceMemories extends Component {

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
            isModalVisible: false,
            isModalVisible1: false,
            isModalVisible2: false,
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
            wholeMemoryData : {},
            fetchingData: false
        }
    }

    componentDidMount = () => {
        this.getMemeories();
    };

    memActive = () => {
        console.log('mem active success');
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

    albums() {
        this.props.navigation.navigate('UserProfileAlbums');
    }
    visits() {
        this.props.navigation.navigate('Visits');
    }
    vlogGet() {
        this.props.navigation.navigate('VlogGet');
    }

    getMemeories = async () => {
       debugger
        var data = { UserId: await AsyncStorage.getItem('userId'),DataAS:"BusinessPlace" }
        const url = been_url + "/GetMemories";
        this.setState({ fetchingData: true })
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    let result = responseJson.result;
                    console.log('the get memories',responseJson)
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
                        fetchingData: false
                    })
                }
                else {
                    this.setState({   fetchingData: false  });
                }
            })
            .catch((error) => {
                this.setState({   fetchingData: false  })
                console.log('ErrorUPM:', error);
            });
    }


    backArrow() {
        var userProfile = AsyncStorage.setItem('UserProfileType');
        console.log("user profile type is coming or not", userProfile);

    follow = async (data) => {
        this.setState({ visibleModal: null });
        var data = {
            Otheruserid: this.state.postId,
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/SendFollowReq";
        return fetch(url, {
            method: "POST",
            headers:serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    //toastMsg("success", responseJson.message);
                    this.fetchDetails();
                }
                else {
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
}

    share_option() {
        Share.share(shareOptions)
        this.setState({
            isModalVisible: false
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
        debugger
        const {getMemoryData , wholeMemoryData} = this.state;
        console.log('the mem items are',item);
        const arrayLen = getMemoryData.length;
        let actualIndex = 0;
        // console.log('the likes',getMemoryData)
        let memoryData = { result : [] };
        memoryData.likes = wholeMemoryData.likes;
        memoryData.userData = wholeMemoryData.userData;
        memoryData.Bookmarks = wholeMemoryData.Bookmark;

        getMemoryData.length > 0 && getMemoryData.map(m=>{

            m.data.map(v=>{
               
                memoryData.result = [...memoryData.result,{...v}]
              
            })
        });
        memoryData.likes && memoryData.likes.length > 0 && memoryData.likes.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                moment.likes = false
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
            // console.log('the mmodatas',d)
            // d.likecount = d.LikeCount
            d.Postid = d._id
            d.Image = d.NewsFeedPost
            d.userId = d.UserId
            if (d.Location == item._id) {
                memoryData.result.splice(ind, 1)
                selectedData = [...selectedData, d];
            }
        });

        // memoryData.result.map((d, ind) => {
        //     d.Image = d.NewsFeedPost
        //     d.userId = d.UserId
        //     return d
        // });
        // if(index > 0){
        //     const currentIndex = index;
        //     let dataLen = 0;
        //     getMemoryData.map((m,i)=>{
        //         if(currentIndex > i){
        //             dataLen += m.data.length
        //             actualIndex = dataLen
        //         }
        //     });
        // }

        console.log('the memoriess',memoryData);
        memoryData.result = [...selectedData,...memoryData.result];
        var props = { screenName: 'Memories',selectedPostId:actualIndex,memoryData:memoryData, }
        this.props.navigation.navigate('GetData', { data: props });
    }
    seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }

    renderRightImgdone() {
        return <View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
            </TouchableOpacity>
        </View>
    }

    onProgressVideo = (e,data,index) =>{
        const {getMemoryData} = this.state;
        data.pause = e.currentTime > 0 ? true : false ;
        getMemoryData[index] = data;
        this.setState({
          getMemoryData
        })  
      }

    render() {
        const { fetchingData, getMemoryData } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <Content contentContainerStyle={{marginTop:10}}>
            {getMemoryData.length == 0 ?
                        <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                            <View style={styles.hasNoMem}>
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                <Text style={Common_Style.noDataText}> You have not created any Memories yet!</Text>
                            </View>
                        </View>
                        :
                        <FlatList
                            style={{  }}
                            ListFooterComponent={<View style={{height:50}} />}
                            data={getMemoryData}
                            ItemSeparatorComponent={this.seperator()}
                            renderItem={({ item, index }) => (
                                <View style={Common_Style.locationShadowView}>
                                    { item.data[0].NewsFeedPost.indexOf(".mp4") != -1 ?
                                    <View style={[Common_Style.ShadowViewImage,{flex:1}]}>
                                    <Video
                                        resizeMode='stretch'
                                        source={{ uri:newsFeddStoriesUrl + item.data[0].NewsFeedPost }}
                                        paused={false}
                                        repeat={false}
                                        controls={false}
                                        volume={0}
                                        style={{  position: 'absolute',top: 0,left: 0,bottom: 0, right: 0, }}
                                        >
                                    </Video>
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
                                                    width: wp('100%'), backgroundColor: '#00000000', height: '26%',
                                                    marginBottom: 0, bottom: 0, right: 0, position: 'absolute'
                                                }}>
                                                    <LinearGradient style={{ height:80 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                                                        <Image source={require('../../Assets/Images/new/LIKE-2.png')} 
                                                          style={[Common_Style.likeImage, { right: 15, position: 'absolute' }]} 
                                                         resizeMode={'center'} 
                                                          />
                                                        <View style={{ flexDirection: 'row', backgroundColor: '#00000000', right: 12, bottom: 15, position: 'absolute' }}>
                                                            <Text style={[Common_Style.likeCount,]}>
                                                                {item.totalLike == undefined ? 0 : item.totalLike}
                                                            </Text>
                                                            <Text style={[Common_Style.likeCount]}> likes</Text>

                                                        </View>
                                                    </LinearGradient>
                                                </View>
                                            </TouchableOpacity>

                                    </View> :
                                    
                                    
                                    <View style={Common_Style.ShadowViewImage}>
                                        <ImageBackground source={{ uri: newsFeddStoriesUrl + item.data[0].NewsFeedPost.split(',')[0] }}
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
                                                    <LinearGradient style={{ height:80 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                                                        <Image source={require('../../Assets/Images/new/LIKE-2.png')} style={[Common_Style.likeImage, { right: 15, position: 'absolute' }]} 
                                                        resizeMode={'center'} 
                                                        />
                                                        <View style={{ flexDirection: 'row', backgroundColor: '#00000000', right: 12, bottom: 15, position: 'absolute' }}>
                                                            <Text style={[Common_Style.likeCount,]}>
                                                                {item.totalLike == undefined ? 0 : item.totalLike}
                                                            </Text>
                                                            <Text style={[Common_Style.likeCount]}> likes</Text>

                                                        </View>
                                                    </LinearGradient>
                                                </View>
                                            </TouchableOpacity>

                                        </ImageBackground>
                                    </View>}

                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                        />

                }
                                
                                
                                
                                
                

                </Content>
            </View>

        )
    }
}


