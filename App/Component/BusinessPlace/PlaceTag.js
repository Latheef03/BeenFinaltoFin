import React, { Component } from 'react';
import { View, Clipboard, Text, ImageBackground, Image, Share, TextInput, Dimensions, StatusBar, ScrollView, ToastAndroid, Animated, PanResponder, FlatList } from 'react-native';
let Common_Api = require('../../Assets/Json/Common.json')
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Button, Spinner, Content } from 'native-base'
import { TouchableOpacity, DrawerLayoutAndroid } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import common_styles from "../../Assets/Styles/Common_Style"
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import styles from '../../styles/NewfeedImagePost';
import ViewMoreText from 'react-native-view-more-text';
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const { width, height } = Dimensions.get("window");
import Common_Style from '../../Assets/Styles/Common_Style'

const shareOptions = {
    title: "Title",
    message:'Post Shared',
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};


export default class PlaceTag extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            getTagdata: '',
            isModalVisible: false,
            isModalVisible1: false,
            isModalVisible2: false,
            visibleModal: null,
            notifications: "",
            postId: '',
            newsfeed: '',
            country: '',
            tags: '',
            description: '',
            screenName: '',
            otherUserId: '',
            //Video
            currentTime: 0,
            duration: 0,
            isLoading: false,
            userPlay: false,
            paused: false,
            volume: 0,
            playerState: PLAYER_STATES.PLAYING,
            zone: ''
        }
    }

    onSeek = seek => {
        //Handler for change in seekbar
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        //Handler for Video Pause
        if (this.state.userPlay == true) {
            this.setState({
                paused: !this.state.paused,
                userPlay: false,
                playerState,
            });
        } else {
            this.setState({
                paused: !this.state.paused,
                userPlay: true,
                playerState,
            });
        }
    };

   
    muteVolume = playerState => {
        //Handler for Video Pause
        if (this.state.volume == 10) {
            this.setState({
                volume: 0,
                playerState,
            });
        } else {
            this.setState({
                volume: 10,
                playerState,
            });
        }
    };

    onReplay = () => {
        //Handler for Replay
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };

    onProgress = data => {
        const { isLoading, playerState } = this.state;
        // Video Player will continue progress even if the video already ended
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({ currentTime: data.currentTime });
        }
    };
    onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });
    onError = () => alert('Oh! ', error);
    exitFullScreen = () => { alert('Exit full screen'); };
    enterFullScreen = () => { };
    onSeeking = currentTime => this.setState({ currentTime });


    componentDidMount = async () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getTags();
            }
        );
    };

    componentWillMount() {
        debugger    
        this.getTags();
    }


    getTags = async () => {
        debugger
        const { headers, been_url } = serviceUrl;
        const url = been_url + "/GetTagPost";
        var userId = await AsyncStorage.getItem('userId');
        var data = { UserId: userId }
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    let likeStatus = responseJson;
                    let userStatus = responseJson;

                    likeStatus.Likes && likeStatus.Likes.length > 0 && likeStatus.Likes.map(item => {
                        userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
                            if (moment.Postid === item.Postid) {
                                moment.userLiked = true;
                            }
                            return moment;
                        });
                        return item;
                    });

                    likeStatus.Bookmarks && likeStatus.Bookmarks.length > 0 && likeStatus.Bookmarks.map(item => {
                        userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
                            if (moment.Postid === item.Postid) {
                                moment.userBookmarked = true;
                            }
                            return moment;
                        });
                        return item;
                    });
                    this.setState({ getTagdata: userStatus.result })
                } else {
                    this.setState({ isLoader: false });
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch(function (error) {
                //toastMsg('danger', 'Sorry..something network error.Please try again.')
            });
    }

    async likes(data) {
        debugger
        var id = await AsyncStorage.getItem('userId');
        var data = {
            Userid: id,
            Postid: data.Postid
        };
        const url = serviceUrl.been_url + "/LikeFeedPost";
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    //toastMsg('success', responseJson.message)
                    this.getTags();
                }
                else {
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
    }

    async bookmarkLikes(data) {
        var id = await AsyncStorage.getItem('userId');
        var data = { Userid: id, Postid: data.Postid };
        const url = serviceUrl.been_url + "/Bookmark";
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    //toastMsg('success', responseJson.message);
                    this.getTags();
                }
                else {
                    this.setState({ likes: false })
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });

    }

    async notifyData() {
        debugger
        this.setState({ visibleModal: null });
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Postid: this.state.postId,
            Otheruserid: this.state.otherUserId,
        };
        var base_url =  serviceUrl.been_url1 + "/TurnOnOffNotitfication";
        //var base_url = serviceUrl.end_user + "/NotificationSettings";
        return fetch(base_url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "True") {
                    //toastMsg("success", responseJson.message);
                    this.getTags();
                }
            })
            .catch(function (error) {
                console.log("Error in newsfeed ")
            });
    }


    reportModal() {
        this.setState({
            visibleModal: null,
            visibleModal: 3
        });
    }

    sendReportModal() {
        if (this.state.postContent == "" || null || undefined) {
            toastMsg1('danger', "Please give a report")
            //ToastAndroid.show("Please give a report", ToastAndroid.LONG)
        }
        else {
        this.setState({
            visibleModal: null,
        });
        this.reportApi();
    }
    }

    async reportApi() {
      
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: this.state.postId,
            Content: this.state.postContent
        };
        const url = serviceUrl.been_url + "/ReportOtheruser";
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                //toastMsg('success', "Thank you for reporting");
            })
            .catch((error) => {
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
        
    }


    unfollow = async (data) => {
       // debugger;
        this.setState({ visibleModal: null });
        //debugger
        var data = {
            Otheruserid: this.state.otherUserId,
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/Unfollow";
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
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

    modalOpen(data) {
        debugger
        this.setState({
            visibleModal: 1,
            postId: data.Postid,
            otherUserId: data.userId,
            notifications: data.Notificationsetting
        })
    }

    share_option() {
        Share.share(shareOptions)
        this.setState({
            visibleModal: null
        })
    }

    likesView(data) {
        var data = {
            data: data.PostId === undefined ?data.Postid :data.PostId,
            screen: "Likes"
        }
        this.props.navigation.navigate('LikesView', { data: data });
    }

    bookmarkView(data) {
        var data = {
            data: data.PostId === undefined ?data.Postid :data.PostId,
            screen: "Bookamarks"
        }
        this.props.navigation.navigate('LikesView', { data: data });
    }

    readFromClipboard = async () => {
        this.setState({ visibleModal: null })
        //To get the text from clipboard
        const clipboardContent = await Clipboard.getString();
        this.setState({ clipboardContent });
    };

    writeToClipboard = async () => {
        this.setState({ visibleModal: null })
        //To copy the text to clipboard
        await Clipboard.setString("http://Been.com/" + this.state.postId);
        //toastMsg("Pending", "Link Copied");
    };


    comments(data) {
        this.props.navigation.navigate('comments', { data: data });
    }

    // imageModal(data) {
    //     var data = {
    //         data: data.Image
    //     }
    //     this.props.navigation.navigate("ScrollImage", { data: data })
    // }

    imageModal(data) {
        console.log('the data NF', data);
        var data = {
          data: data.Image,
          desc: data.Desc,
          postLocation: data.Location + ', ' + data.Country
        }
        this.props.navigation.navigate("MultiImageView", { data: data })
      }

    getLocation(data) {
        AsyncStorage.mergeItem('PlaceName', data.Location);
        AsyncStorage.setItem('PlaceName', data.Location);
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }


    onViewableItemsChanged = ({ viewableItems, changed }) => {
        console.log("Visible items are", viewableItems);
        console.log("Changed in this iteration", changed);
    }

    seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }

    renderViewMore(onPress) {
        return (
            <Text style={Common_Style.viewMoreText} onPress={onPress}>View more</Text>
        )
    }
    renderViewLess() {
        return (
            <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize,fontFamily:Viewmore.Font, }}></Text>)
        //     <Text onPress={onPress} style={Common_Style.viewMoreText} >View less</Text>
        // )
    }

    renderPostItem = (data, index) => {
        return (
            <View key={index.toString()} style={[styles.card,{marginTop:5}]}>
               <View style={styles.cardImage}>
                    <View style={{ flexDirection: 'row' }} >
                    <View style={{ marginTop: '2%', width: '90%', }}>
                            {data.Location === "null" ? null : (<Text onPress={() => this.getLocation(data)} style={Common_Style.cardViewLocationText}>{data.Location}</Text>)}
                            {data.Country === "null" ? null : (<Text onPress={() => this.getLocation(data)} style={Common_Style.cardViewLocationText}>{data.Country}</Text>)}
                        </View>
                        <View style={{ marginTop: '2%', width: '10%' }}>
                            <TouchableOpacity hitSlop={styles.touchSlop} onPress={() => this.modalOpen(data)}>
                                <Image style={styles.menuDot}
                                    source={require('../../Assets/Images/Ellipse.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        {data.Image.indexOf(".mp4") != -1 ?
                            <View style={{ width: "90%", flex: 1, }}>
                                <Video
                                    resizeMode="cover"
                                    source={{ uri: serviceUrl.newsFeddStoriesUrl + data.Image }}
                                    paused={this.state.paused ? true : false}
                                    repeat={true}
                                    controls={false}
                                    resizeMode='cover'
                                    style={{ width: wp('90%'), height: 280, }}
                                    volume={this.state.volume}>
                                </Video>
                            </View>
                            :
                            <TouchableOpacity activeOpacity={1} onPress={() => data.Image.split(',').length > 1 ? this.imageModal(data) : null} >
                                <ImageBackground style={{ width: '100%', height: 230, marginTop: '2%' }}
                                    source={data.Image == null ? require('../../Assets/Images/story2.jpg') : { uri: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0] }}>
                                    <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
                                        <View style={{ width: '88%', }}></View><View>
                                            <Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} source={data.Image.split(',').length > 1 ? require('../../Assets/Images/camera1.png') : require('../../Assets/Images//BussinesIcons/cameraMemoris.png')} ></Image></View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: '5%' }}>
                        <View>
                            <View style={{ flexDirection: 'row', }}>
                                {data.UserProfilePic == null ?
                                    <Image style={{ width: 25, height: 25, }} borderRadius={50} source={require('../../Assets/Images/assam.jpg')}></Image> :
                                    <Image style={{ width: 25, height: 25, }} borderRadius={50}
                                        source={{
                                            uri: serviceUrl.profilePic + data.UserProfilePic
                                        }}></Image>}
                                <View style={{ width: '80%', }}>
                                    <Text style={{ width: '80%', marginLeft: '5%', marginTop: 5, color: '#000' }}>{data.UserName}</Text></View>
                            </View>
                            <View style={{ width: '85%', height: 'auto', marginTop: '5%', }}>
                <ViewMoreText
                 numberOfLines={2}
                  renderViewMore={this.renderViewMore}
                  renderViewLess={this.renderViewLess}
                  style={{ textAlign: 'center', marginBottom: '1.5%' }}
                >
                  <Text style={Common_Style.descriptionText}>
                    {data.Description === "null" ? null : data.Description}
                  </Text>
                </ViewMoreText>
                {/* <Text style={{ color: '#67b6ee', textAlign: 'left' }}> {data.Description === "null" ? null : data.Description}</Text> */}
              </View>
                        </View>
                        <View style={{ width: 40, justifyContent: 'space-around', alignItems: 'center',height: 100, }}>
                            {/* Like  */}
                            <TouchableOpacity onPress={() => this.likes(data)}>
                                <Image style={{ width: 20, height: 20, }} source={
                                    data && data.userLiked && data.userLiked == true ?
                                        require('../../Assets/Images/redheart.png') :
                                        require('../../Assets/Images/heart.png')}></Image>
                            </TouchableOpacity>
                            <Text onPress={() => this.likesView(data)} style={{ fontSize: 10, textAlign: 'center', }} >
                                {data.LikeCount == null || undefined ? 0 : data.LikeCount}</Text>

                            {/* Comment  */}
                            <TouchableOpacity onPress={() => { this.comments(data) }}>
                                <Image style={{ width: 20, height: 20, marginTop: '20%', }} source={require('../../Assets/Images/comment.png')} resizeMode={'stretch'}></Image>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 10, textAlign: 'center' }}>{data.Commentcount == undefined || null ? 0 : data.Commentcount}</Text>
                            {/* Bookmark */}
                            <TouchableOpacity onPress={() => { this.bookmarkLikes(data) }}>
                                <Image style={{ width: 18, height: 18, marginTop: '20%', marginLeft: 2 }}
                                    source={data && data.userBookmarked && data.userBookmarked == true ?
                                        require('../../Assets/Images/clrBookmark.png') :
                                        require('../../Assets/Images/bookmark.png')}></Image>
                            </TouchableOpacity>
                            <Text onPress={() => this.bookmarkView(data)} style={{ fontSize: 10, marginLeft: 3, textAlign: 'center' }}>{data.Bookmarkcount == undefined || null ? 0 : data.Bookmarkcount}</Text>
                        </View>
                    </View  >
                    {/* <View  >
                        <Text style={{ textAlign: 'center', marginBottom: '1.5%' }} > View More</Text>
                    </View> */}
                </View>
            </View>

        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <View>
                   
                    {this.state.isLoading != true && this.state.getTagdata != null ?
                        
                            <FlatList
                                style={{ width: '100%', }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                onViewableItemsChanged={this.onViewableItemsChanged}
                                viewabilityConfig={{
                                    itemVisiblePercentThreshold: 60
                                }}
                                data={this.state.getTagdata}
                                renderItem={({ item, index }) => (this.renderPostItem(item, index)
                                )}
                                keyExtractor={index => index.toString()}
                            />
                     
                        :
                        <View style={{ flex: 1, flexDirection: "column", marginTop: '45%' }} >
                            <Spinner color="#fb0143" />
                        </View>
                    }

                </View>

                <Modal
                    isVisible={this.state.visibleModal === 1}
                    onBackdropPress={() => this.setState({ visibleModal: null })}
                    onBackButtonPress={() => this.setState({ visibleModal: null })}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => this.setState({ visibleModal: null })}>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 5, marginBottom: 5 }}>
                                <Text style={[styles.modalText, { width: '85%' }]}>
                                    Send To
                  </Text>
                                <Image source={require('../../Assets/Images/send.png')}
                                    style={{ width: 18, height: 18, marginTop: 4 }} />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.horizontalSeparator} />
                        <TouchableOpacity onPress={() => this.notifyData()} style={{ width: '100%', }}>
                            <Text onPress={() => this.notifyData()} style={styles.modalText}>
                                Turn {this.state.notifications} Notifications
                  </Text>
                        </TouchableOpacity>
                        <View style={styles.horizontalSeparator} />


                        <View onPress={() => this.share_option()} >
                            <Text onPress={() => this.share_option()}
                                style={styles.modalText} >
                                Share To
                  </Text>
                        </View>

                        <View style={styles.horizontalSeparator} />

                        <TouchableOpacity onPress={() => this.writeToClipboard()} style={{ width: '100%', }}>
                            <Text onPress={() => this.writeToClipboard()} style={[styles.modalText,]}>
                                Copy Link
                  </Text></TouchableOpacity>
                        <View style={styles.horizontalSeparator} />

                        <View >
                            <TouchableOpacity onPress={() => this.unfollow()} style={{ width: '100%', }}>
                                <Text onPress={() => this.unfollow()} style={[styles.modalText, { color: '#708fd5' }]}>
                                    Unfollow account
                  </Text></TouchableOpacity>
                        </View>


                        <View style={styles.horizontalSeparator} />
                        <TouchableOpacity onPress={() => this.reportModal()} style={{ width: '100%', }}>
                            <Text onPress={() => this.reportModal()} style={[styles.modalText, { color: '#e45d1b' }]}>
                                Report post
                  </Text>
                        </TouchableOpacity>

                        <View style={styles.horizontalSeparator} />
                        {/* <View >
              <TouchableOpacity onPress={() => { this.mute() }} style={{ width: '100%', }}>
                <Text onPress={() => { this.mute() }} style={[styles.modalText, { color: '#708fd5' }]}>
                  Mute
                  </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalSeparator} /> */}
                    </View>
                </Modal>

                {/* Report Modal */}
                <Modal isVisible={this.state.visibleModal === 3}
                    onBackdropPress={() => this.setState({ visibleModal: null })}
                    onBackButtonPress={() => this.setState({ visibleModal: null })}
                >
                    <View style={styles.modalContent}>
                        <Text style={{ marginTop: 10, 
                            //fontFamily: "ProximaNovaAltBold", 
                            fontSize: 18, textAlign: "center", alignSelf: "center" }}>
                            Add Report
              </Text>

                        <TextInput
                            style={{ borderBottomWidth: 1, borderColor: "#ccc", width: "75%", padding: 5, height: 50, marginLeft: 50, color: "grey", marginTop: 25, marginBottom: 15, }}
                            placeholder="Type a report here..."
                            editable={true}
                            multiline={true}
                            maxLength={55}
                            autoFocus={true}
                            autoCorrect={false}
                            //  keyboardType="visible-password"
                            onChangeText={this.postContent}
                            value={this.state.postContent}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "center", textAlign: "center", alignItems: "center", marginVertical: 10, marginTop: 10, justifyContent: "space-evenly", margin: 10, marginLeft: 20 }}>
                            <TouchableOpacity onPress={() => this.sendReportModal()}
                                activeOpacity={1.5}        >
                                <LinearGradient
                                    start={{ x: 0, y: 0.75 }}
                                    end={{ x: 1, y: 0.25 }}
                                    style={styles.linearGradientButton}
                                    colors={["#69b3f6", "#25d0de"]}
                                >
                                    <TouchableOpacity onPress={() => this.sendReportModal()}
                                        activeOpacity={1.5}      >
                                        <Text onPress={() => this.sendReportModal()}
                                            style={styles.linearGradientText}>
                                            Save
                    </Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ visibleModal: null, })} activeOpacity={1.5}>
                                <LinearGradient
                                    start={{ x: 0, y: 0.75 }}
                                    end={{ x: 1, y: 0.25 }}
                                    style={styles.linearGradientButton}
                                    colors={["#D7816A", "#BD4F6C"]}

                                >
                                    <TouchableOpacity onPress={() => this.setState({ visibleModal: null, })} activeOpacity={1.5}>
                                        <Text onPress={() => this.setState({ visibleModal: null, })}
                                            style={styles.linearGradientText}>
                                            Cancel
                    </Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


            </View>
        )
    }
}



