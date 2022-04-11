import React, { Component } from 'react';
import { View, Clipboard, Text, ImageBackground, Image, Share, TextInput, Dimensions, StatusBar, ScrollView, ToastAndroid, Animated, KeyboardAvoidingView, FlatList } from 'react-native';
let Common_Api = require('../../Assets/Json/Common.json')
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Button, Spinner, Content } from 'native-base'
import { TouchableOpacity, DrawerLayoutAndroid } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import common_styles from "../../Assets/Styles/Common_Style"
import Video from "react-native-video";
import styles from '../../styles/NewfeedImagePost';
import ViewMoreText from 'react-native-view-more-text';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const { width, height } = Dimensions.get("window");
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const imagePath = '../../Assets/Images/'
import { Toolbar } from '../commoncomponent'
import ParsedText from 'react-native-parsed-text';

const shareOptions = {
    title: "Title",
    message:'Post Shared',
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};


export default class PromoteMemories extends Component {

    static navigationOptions = {
        header: null,
    };


    constructor(props) {
        super(props);
        this.state = {
            newsFeedData: '',
            userBookmarkState: false,
            isModalVisible: false,
            isModalVisible1: false,
            isModalVisible2: false,
            userProfileType: '',
            postId: '',
            newsfeed: '',
            country: '',
            tags: '',
            description: '',
            screenName: '',
            isSelectSendTo: false,
            _isSendToLoader: false,
            followeeList: [],
            selectedPostId: '',
            volume: 0,
        }
    }



    async UNSAFE_componentWillMount() {
       // debugger;
        var userId = await AsyncStorage.getItem('userId');
        var ProfileType = await AsyncStorage.getItem('profileType');

        const Comments = this.props.route.params.data;
        const mData = Comments.memoryData;
        this.setState({
            // screenName: Comments ? Comments.screenName : '',
            userProfileType: ProfileType, userId: userId,
            selectedPostId: Comments != undefined ? Comments.selectedPostId : ''
        })
        this.fetchDetails(mData);
    }


    fetchDetails = async (responseJson) => {
       // debugger;
        if (responseJson.status == "True") {
            let getData = responseJson.result == undefined ? responseJson.Result : responseJson.result
            this.setState({
                newsFeedData: getData
                    ? getData : [],
                isLoading: false
            })
        }
    }


    renderViewMore(onPress) {
        return (
            <Text style={Common_Style.viewMoreText} onPress={onPress}>View more</Text>
        )
    }
    renderViewLess(onPress) {
        return (
            <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}></Text>)
        //     <Text onPress={onPress} style={Common_Style.viewMoreText} >View less</Text>
        // )
    }

    promote(d) {
        debugger
        this.props.navigation.navigate('PromoteParticular', { data: d });
    }

    itemLayout = (data, index) => (
        { length: 400, offset: 570 * index, index }
    )

    extractDesctiption = (data) => {
        if (data == undefined || data.length == 0) {
            return null;
        }
        return data[0].desc != undefined ? data[0].desc : null;
    }


    renderPostItem = (data, index) => {
        return (
            <View key={index.toString()} style={styles.card}>
                <View style={styles.cardImage}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.promote(data)}>
                        <View style={{ flexDirection: 'row', width: '100%' }} >
                            <View style={{ width: '13%' }} />
                            <View style={{ marginTop: '2%', width: '77%', }}>
                                {data.Location === "null" ? null : (<Text style={[Common_Style.cardViewLocationText,]}>{data.Location}</Text>)}
                                {data.Country === "null" ? null : (<Text style={[Common_Style.cardViewLocationText,]}>{data.Country}</Text>)}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 5, }}>
                                {this.state.userProfileType == "1" ?

                                    <TouchableOpacity hitSlop={{ top: 10, left: 8, bottom: 10, right: 0, }} onPress={() => { this.setState({ visibleModal: 2 }) }}>
                                        <Image source={require(imagePath1 + 'bar-chart.png')}
                                            style={{ width: 18, height: 18, marginBottom: 5, marginRight: 5 }} />
                                    </TouchableOpacity>
                                    :
                                    this.state.userProfileType == "0" ?
                                        <Image
                                            style={{ width: 18, height: 24, }} /> : null}

                                {this.state.userProfileType == "1" ?

                                        <Image style={{ width: 16, height: 16, marginLeft: 'auto', marginRight: 'auto', }} 
                                        // resizeMode={'stretch'}
                                            source={require('../../Assets/Images/3dots.png')}></Image>
                                    :
                                    this.state.userProfileType == "0" ?

                                        <Image style={{ width: 20, height: 20, marginLeft: 'auto', marginRight: 'auto', }}
                                            source={require('../../Assets/Images/3dots.png')}></Image>

                                        : null}
                            </View>

                        </View>

                        <View>
                            {data.NewsFeedPost.indexOf(".mp4") != -1 ?
                                <View style={{ width: "90%", flex: 1, }}>
                                    <Video
                                        resizeMode="cover"
                                        source={{ uri: serviceUrl.newsFeddStoriesUrl + data.NewsFeedPost }}
                                        paused={this.state.paused ? true : false}
                                        repeat={true}
                                        controls={false}
                                        resizeMode='cover'
                                        style={{ width: wp('90%'), height: 400,marginTop:5 }}
                                        volume={this.state.volume}>
                                    </Video>
                                </View>
                                :


                                <View style={[styles.imageBackGroundView, { height: 400 }]}>
                                    <ImageBackground style={{ width: '100%', height: '100%', }} resizeMode={'cover'}
                                        source={data.NewsFeedPost == null ? require('../../Assets/Images/story2.jpg') : { uri: serviceUrl.newsFeddStoriesUrl + data.NewsFeedPost.split(',')[0] }}>
                                        <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
                                            <View style={{ width: '88%', }}></View>
                                            <View>
                                                {data.NewsFeedPost.split(',').length > 1 ?
                                                    <Image style={{ width: wp(10), height: hp(4), marginTop: '3%' }}
                                                        source={require('../../Assets/Images/MULTIPIC.png')}>
                                                    </Image> :
                                                    <Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} ></Image>}
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>

                            }
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: '5%' }}>
                            <View>
                                <View style={{ flexDirection: 'row', }}>

                                    {data.VerificationRequest === "Approved" ? (
                                        <View >
                                            {data.ProfilePic === undefined || null ? (
                                                <View >
                                                    <Image style={[Common_Style.mediumAvatar, { marginTop: 2 }]}
                                                        source={{
                                                            uri: serviceUrl.profilePic + data.ProfilePic
                                                        }}></Image>
                                                </View>)
                                                : (
                                                    <ImageBackground style={[Common_Style.mediumAvatar, { marginTop: 2 }]} borderRadius={50}
                                                        source={{ uri: serviceUrl.profilePic + data.ProfilePic }}>
                                                        <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImagesmall} />
                                                    </ImageBackground>
                                                )}
                                        </View>
                                    ) :
                                        (<View>
                                            {data.ProfilePic === undefined || null ?
                                                <Image style={[Common_Style.mediumAvatar, { marginTop: 2 }]}
                                                    source={require(imagePath + 'profile.png')}></Image>
                                                :
                                                <Image style={[Common_Style.mediumAvatar, { marginTop: 2 }]}
                                                    source={{ uri: serviceUrl.profilePic + data.ProfilePic }}></Image>}
                                        </View>)}


                                    <View style={{ width: '78%', justifyContent: 'center' }}>
                                        <Text style={[Common_Style.userName, { marginTop: 3 }]}>{data.UserName}</Text></View>
                                </View>


                                <View style={{ width: '84%', height: 'auto', marginTop: -2, marginBottom: 0, marginLeft: '14%', }}>
                                    <ViewMoreText
                                        numberOfLines={2}
                                        renderViewMore={this.renderViewMore}
                                        renderViewLess={this.renderViewLess}
                                    >
                                        <ParsedText style={[Common_Style.descriptionText, { fontSize: Description.FontSize, fontFamily: Description.Font }]}
                                            parse={[{ pattern: /#(\w+)/, style: Common_Style.hashtagColor },]}  >
                                            {this.extractDesctiption(data.Desc)}

                                        </ParsedText>

                                    </ViewMoreText>
                                </View>
                            </View>


                            <View style={{ width: 60, height: 80, justifyContent: 'space-evenly', marginLeft: '1%' }}>
                                {/* Like  */}
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ width: 25, height: 25 }}>

                                        <Image style={{ width: '100%', height: '100%', }} resizeMode={'stretch'} source={
                                            data && data.likes && data.likes == true ?
                                                require('../../Assets/Images/new/LIKE-2.png') :
                                                require('../../Assets/Images/new/likeBlack.png')}></Image>

                                    </View>
                                    <Text style={Common_Style.countFont} >
                                        {data.likecount == undefined || null ? 0 : data.likecount}
                                    </Text>
                                </View>

                                {/* Comment  */}
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ width: 25, height: 25 }}>

                                        <Image style={{ width: '100%', height: '100%', }} resizeMode={'stretch'}
                                            source={require('../../Assets/Images/new/commentBlack.png')} resizeMode={'stretch'}></Image>

                                    </View>
                                    <Text style={Common_Style.countFont} >
                                        {data.Commentcount == undefined || null ? 0 : data.Commentcount}
                                    </Text>
                                </View>

                            </View>
                        </View  >

                        {data.SponsoredBy != null && data.SponsoredBy != 'null' ?
                            <Text style={{ textAlign: 'center', marginVertical: 5, fontFamily: Viewmore.Font, fontSize: Viewmore.FontSize, color: '#ff5555', }}>Sponsored By {data.SponsoredBy}</Text>
                            : null}
                    </TouchableOpacity>
                </View>
            </View >

        )
    }



    render() {
        const { selectedPostId } = this.state;
        const { navigation } = this.props;
        const data = this.props.route.params.data;
        const screen = data != undefined && data.screenName != undefined ? data.screenName : null;
        const title = screen == undefined ? null : screen
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Toolbar {...this.props} centerTitle={this.state.screenName == "Memories" ? "   Memories" : this.state.screenName == "   Vlog" ? "Vlog" : null} />

                    {this.state.isLoading != true && this.state.newsFeedData != null ?
                        <View style={{ height: height * .98, backgroundColor: '#FFF' }}>

                            <FlatList
                                style={{ width: '100%', marginBottom: 70 }}
                                ref={ref => this.flatList = ref}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                onViewableItemsChanged={this.onViewableItemsChanged}
                                viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
                                initialScrollIndex={0}
                                getItemLayout={this.itemLayout}
                                data={this.state.newsFeedData}
                                renderItem={({ item, index }) => (this.renderPostItem(item, index))}
                                onContentSizeChange={(contentWidth, contentHeight) => { this.flatList.scrollToIndex({ animated: false, viewPosition: 0.5, index: selectedPostId }) }}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <View style={{ flex: 1, flexDirection: "column", marginTop: '45%' }} >
                            <Spinner color="#fb0143" />
                        </View>
                    }

                </View>


            </View>
        )
    }
}


const stylesL = {
    view: {
        justifyContent: 'flex-end', width: wp('100%'), margin: 0,
        backgroundColor: '#00000000'
    },
    textInput: {
        width: wp('90%'), height: 45, marginBottom: 10, color: '#000',
        marginTop: 12, padding: 15, justifyContent: 'center', alignContent: 'center',
        alignSelf: 'center'
    },
    hideButton: {
        // backgroundColor: "#87cefa",
        alignItems: "center",
        justifyContent: "center",
        // borderBottomRightRadius:10,
        // borderBottomLeftRadius:10,
        height: hp("6%"),
        width: wp("100%"),

    },
    LoginButtontxt: {
        color: "#fff",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 16,
    },
    searchBar: {
        flexDirection: 'row', width: wp('90%'), backgroundColor: '#ffffff',
        height: 45, marginBottom: 0, borderRadius: 20, marginTop: 0, paddingLeft: 20,
        borderWidth: 1.2, borderColor: '#ededef', borderBottomWidth: 1,
        borderBottomColor: '#d7d7d7', marginLeft: 12, marginRight: 12
    },
    keyAvoidView: {
        position: 'absolute',
        height: hp('70%'), width: wp('100%'), bottom: 0, left: 0, right: 0,
        backgroundColor: 'transparent',
    },
    hasNoMem: {
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    }
}





