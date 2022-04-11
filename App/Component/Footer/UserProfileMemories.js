import React, { Component } from 'react'
import {
    Text, Clipboard, Image, FitImage, ImageBackground, StatusBar,Animated,
    View, ToastAndroid, TextInput, Share, TouchableOpacity, ScrollView, FlatList,
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
import { ExploreLoader } from '../commoncomponent/AnimatedLoader';
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);
const shareOptions = {
    title: "Title",
    message: "http://been.com/5e47d082e301b51201e8adac",
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};

export default class UserProfileMemories extends Component {
    static navigationOptions = { header: null }

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
            fetchingData: true,
        }
    }


    UNSAFE_componentWillMount = () => {
        this.getMemeories(true);
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getMemeories(false);
                const Comments = this.props.route.params.data
                console.log('the comments', Comments);
                const loader = Comments != undefined ? Comments.loader : false;
                this.setState({ screenName: Comments ? Comments.screenName : '', })
            }
        );
    };

    UNSAFE_componentWillUnmount() {
        // this.setState({
        //     firstHit : false
        // })
        // this.props.navigation.removeListener();
    }


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

    getMemeories = async (loader) => {
        console.log('the loader',loader);
        var data = { UserId: await AsyncStorage.getItem('userId') }
        const url = been_url + "/GetMemories";
        this.setState({ fetchingData: loader })
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    let result = responseJson.result;
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
                        no_record_found: false,
                        fetchingData: false,
                    })
                }
                else {
                    this.setState({
                        fetchingData: false,
                        no_record_found: true,
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    fetchingData: false,
                })
                console.log('ErrorUPM:', error);
            });
    }


    backArrow() {
        var userProfile = AsyncStorage.setItem('UserProfileType');
        console.log("user profile type is coming or not", userProfile);

        this.props.navigation.goBack();
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

    navigation(item, index) {
        debugger
        const { getMemoryData, wholeMemoryData } = this.state;
        console.log('the mem items are', index);
        const arrayLen = getMemoryData.length;
        let actualIndex = 0;
        // console.log('the likes',getMemoryData)
        let memoryData = { result: [] };
        memoryData.likes = wholeMemoryData.likes;
        memoryData.status = wholeMemoryData.status;
        memoryData.userData = wholeMemoryData.userData;
        memoryData.Bookmarks = wholeMemoryData.Bookmark;

        getMemoryData.length > 0 && getMemoryData.map(m => {
            m.data.map(v => {
                v.Postid = v._id
                memoryData.result.push(v);
            })
        });

        memoryData.likes && memoryData.likes.length > 0 && memoryData.likes.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                moment.likes = false;
                if (moment.Postid === item.Postid) {
                    moment.likes = true;
                }
                return moment;
            });
            return item;
        });

        memoryData.Bookmarks && memoryData.Bookmarks.length > 0 && memoryData.Bookmarks.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                moment.Bookmarks = false;
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
            // console.log('the mmodatas',d)
            d.userId = d.UserId
            if (d.Location == item._id) {
                memoryData.result.splice(ind, 1)
                selectedData = [...selectedData, d];
            }
        });
        memoryData.result = [...selectedData,...memoryData.result];
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
        var props = { screenName: 'Memories', selectedPostId: actualIndex, memoryData: memoryData, }
        this.props.navigation.navigate('GetData', { data: props });
    }

    seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }

    renderRightImgdone() {
        return <View style={[stylesFromToolbar.leftIconContainer]}>
            <View >
                <Image style={{ width: 20, height: 20 }} />
            </View>
        </View>
    }

    renderPostItem = (item,index) =>{
        const event = item.data[0].Events && item.data[0].Events[0] || {}
        const scale = event.crops && event.crops.scale ? event.crops.scale : 1.0001;
        const trX = event.crops && event.crops.positionX && scale >= 1.01 ? event.crops.positionX : 0;
        const trY = event.crops && event.crops.positionY && scale >= 1.01 ? event.crops.positionY : 0;
        return(
            <View style={Common_Style.locationShadowView}>
            <View style={Common_Style.ShadowViewImage}>
            {/* <SelectedFilters images={event}
            childrenComponent={( */}
              <ImageBackground style={{ width: '100%', height: '100%', }} 
               resizeMode={'cover'}
               source={{ uri: newsFeddStoriesUrl + item.data[0].NewsFeedPost.split(',')[0] }}>
                    <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => { this.navigation(item, index) }} >
                        <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                            <LinearGradient
                                style={{ height: 70 ,}}
                                colors={["#0f0f0f94", "#0f0f0f00"]}
                            >
                                <Text style={[Common_Style.locationText, { marginTop: 10 }]}>{item._id == "null" ? null : item._id}</Text>
                                <Text style={Common_Style.locationText}>{item.data[0].Country == "null" ? null : item.data[0].Country}</Text>
                            </LinearGradient>
                        </View>
                        <View style={{ width: wp('100%'), backgroundColor: '#00000000', height: '25%', marginBottom: 0, bottom: 0, right: 0, position: 'absolute' }}>
                            <LinearGradient style={{ height: 80,flex:1 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                                <Image source={require('../../Assets/Images/new/LIKE-2.png')} 
                                style={[Common_Style.likeImage, { right: 15, position: 'absolute',width: 25, height: 25,bottom: 25, }]} resizeMode={'contain'} />
                                <View style={{ flexDirection: 'row', backgroundColor: '#00000000', right: 12, bottom: 15, position: 'absolute' }}>
                                    <Text style={[Common_Style.likeCount,{fontFamily:'Arial'}]}>
                                        {item.totalLike == undefined ? 0 : item.totalLike}
                                    </Text>
                                    <Text style={[Common_Style.likeCount]}> likes</Text>

                                </View>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>

                </ImageBackground>
                {/* )}/> */}
            </View>
        </View>
        )
    }



    render() {
        const { fetchingData, getMemoryData } = this.state;
        return (
            <View style={{ flex: 1 ,marginTop:0,backgroundColor:'#fff'}}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <Toolbar  {...this.props} icon={"Down"} centerTitle="Memories" rightImgView={this.renderRightImgdone()} />

                {fetchingData ?
                    <ExploreLoader />
                    : !fetchingData && getMemoryData.length == 0 ?
                        <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                            <View style={styles.hasNoMem}>
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                <Text style={Common_Style.noDataText}> You have not created any Memories yet!</Text>
                            </View>
                        </View>
                        :
                        <FlatList
                        style={{ }}
                        ListFooterComponent={<View style={{height:60}} />}
                        data={getMemoryData}
                        ItemSeparatorComponent={this.seperator()}
                        renderItem={({ item, index }) => (
                             this.renderPostItem(item,index)
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                    />

                }

                <FooterTabBar {...this.props} tab={1} />
            </View>

        )
    }
}

