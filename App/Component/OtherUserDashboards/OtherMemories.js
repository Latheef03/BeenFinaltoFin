import React, { Component } from 'react'
import {
    Text, Clipboard, Image, FitImage, ImageBackground, StatusBar,
    View, ToastAndroid, TextInput, Share, TouchableOpacity, ScrollView, FlatList,StyleSheet
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Spinner from '../../Assets/Script/Loader';
import styles from '../../styles/FooterStyle'
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar, FooterTabBar1 } from '../commoncomponent';
import LinearGradient from "react-native-linear-gradient";
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { ExploreLoader } from '../commoncomponent/AnimatedLoader';
const shareOptions = {
    title: "Title",
    message: "http://been.com/5e47d082e301b51201e8adac",
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};

export default class OtherMemories extends Component {
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

            wholeMemoryData: {},
            fetchingData: false

        }
    }
    async UNSAFE_componentWillMount() {
        const Comments = this.props.route.params?.data
        if (Comments != undefined || null) {
            this.setState({ screenName: Comments ? Comments.screenName : '', otherid: Comments.otherid, })
        }
        this.getMemeories();
    }
    async componentDidMount() {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                const Comments = this.props.route.params?.data
                if (Comments != undefined || null) {
                    this.setState({ screenName: Comments ? Comments.screenName : '', otherid: Comments.otherid, })
                }
                this.getMemeories();
                this.setState({ screenName: Comments ? Comments.screenName : '', })
                // navigation.state.params = {loader:false};

                console.log('the comments', Comments);
            }
        );
    };
    getMemeories = async () => {
       // debugger;
        var GetOtherId = await AsyncStorage.getItem('OtherUserId');
        var id1 = this.state.otherid
        var data = {
            UserId: await AsyncStorage.getItem('userId'),
            followedId: GetOtherId
        }
        this.setState({ fetchingData: true })
        const url = been_url + "/GetMemories";
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
                this.setState({
                    fetchingData: false
                })
                console.log('ErrorUPM:', error);
            });
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

    comments(data) {
       // debugger;
        this.props.navigation.navigate('comments', { data: data });
    }
    getLocation(data) {
        AsyncStorage.mergeItem('PlaceName', data.Location);
        AsyncStorage.setItem('PlaceName', data.Location);
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }
    navigation(item, index) {
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

        console.log('the memory data', memoryData);
        let selectedData = []
        memoryData.result.map((d, ind) => {
            // console.log('the mmodatas',d)
            d.Image =  d.NewsFeedPost
            d.userId = d.UserId
            if (d.Location == item._id) {
                memoryData.result.splice(ind, 1)
                selectedData = [...selectedData, d];
            }
        });

        memoryData.result.map((d, ind) => {
            d.Image =  d.NewsFeedPost
            d.userId = d.UserId
           return d
        });

      
      memoryData.result = [...selectedData,...memoryData.result];

        var props = { screenName: 'Memories', selectedPostId: actualIndex, memoryData: memoryData, }
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

    render() {
        const { fetchingData, getMemoryData } = this.state;
        return (
            <View style={{ flex: 1, marginTop: 0,backgroundColor:'#fff' }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <Toolbar  {...this.props} icon={"Down1"} centerTitle="Memories" rightImgView={this.renderRightImgdone()} />

                {fetchingData ?
                    <ExploreLoader />
                    : !fetchingData && getMemoryData.length == 0 ?
                        <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                            <View style={styles.hasNoMem}>
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                <Text style={Common_Style.noDataText}> Nothing created yet!</Text>
                            </View>
                        </View>
                        :
                        <FlatList
                            style={{}}
                            data={getMemoryData}
                            ListFooterComponent={<View style={{height:60}} />}
                            ItemSeparatorComponent={this.seperator()}
                            renderItem={({ item, index }) => (
                                <View style={Common_Style.locationShadowView}>
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
                                                    <LinearGradient style={{ height: 70,flex:1 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                                                    <Image source={require('../../Assets/Images/new/LIKE-2.png')} 
                                                    style={[Common_Style.likeImage, { right: 15, position: 'absolute',width: 25, height: 25,bottom: 30, }]} resizeMode={'contain'} />
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
                                    </View>

                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                        />

                }
                  <FooterTabBar1 {...this.props} tab={1} />
              
            </View>

        )
    }
    
}
const styles1 = StyleSheet.create({

    map: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff"
    },
    footer: {
        position: 'absolute',
        flex: 0.1,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 60,
        width: '100%',
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalText: { color: '#010101', marginTop: hp('2%'), textAlign: 'center', marginLeft: wp('6%'), marginBottom: hp('1.3%'), fontFamily: Common_Color.fontMedium },
    topicons: { width: 28, height: 30, marginRight: 5 },
    container: { flex: 1, },
    createButton: { alignItems: 'center', justifyContent: 'center', height: 30, width: 130, },
    createButtonPrivate: { alignItems: 'center', alignSelf: 'center', height: 34, width: 300, marginTop: '10%' },
    iconView: { width: '12%', height: '140%' },
    container2: { flexDirection: 'row', marginTop: '3%', width: '95%', marginLeft: 'auto', marginRight: 'auto' },
    container1: { flexDirection: 'row', marginTop: '3%', width: '95%', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end' },
    icon: { width: 15, height: 20 },
    icon1: { width: 20, height: 23, marginTop: 6, marginRight: '5%' },
    footericon: { width: '23%', marginLeft: '5%', },
    fontColor: { color: '#b4b4b4' },
    fontsize: { fontSize: 12, color: '#010101', fontWeight: 'normal', textAlign: 'center', fontFamily: Common_Color.fontMedium, },
    fontsize1: { fontSize: 16, color: '#010101', fontFamily: Common_Color.fontBold },
    newText: { color: '#010101', fontSize: 14, fontFamily: Common_Color.fontMedium, textAlign: 'center' },
    newText1: { fontSize: Username.FontSize, fontFamily: Username.Font, textAlign: 'left', marginBottom: 5, marginTop: 5, marginLeft: '3%' },
    newText12: { fontSize: Description.FontSize, fontFamily: Description.Font, textAlign: 'left', marginBottom: 5, marginTop: 5, marginLeft: '3%' },
    footerIconImage: { width: wp(8), height: hp(4.5),marginLeft: 30 },
    modalView2: { backgroundColor: "#FFF", borderRadius: 25, borderColor: "rgba(0, 0, 0, 0.1)", justifyContent: 'center', alignItems: 'center' },
    mesageButton: { alignItems: 'center', justifyContent: 'center', borderWidth: .5, borderColor: 'grey', height: 34, width: 130, borderRadius: 10 },
    editProfile: { width: '94%', height: 34, marginLeft: 'auto', marginRight: 'auto', marginBottom: 10, justifyContent: 'space-around', flexDirection: 'row', }
})

