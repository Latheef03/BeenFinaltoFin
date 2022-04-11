import React, { Component } from 'react';
import { View, Text, Image, StatusBar, ToastAndroid, ScrollView, Platform, StyleSheet, KeyboardAvoidingView, ImageBackground, Picker } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { TextInput, Menu, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
let Common_Api = require('../../Assets/Json/Common.json')
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
const imagePath = '../../Assets/Images/'
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import styles1 from '../../styles/NewfeedImagePost';
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import { Toolbar, FooterTabBar } from '../commoncomponent'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Icon } from 'react-native-elements'
import DeviceInfo from 'react-native-device-info';
import common_styles from "../../Assets/Styles/Common_Style"
import Common_Style from '../../Assets/Styles/Common_Style'
import Spinner from '../../Assets/Script/Loader';
import { Dstyles } from '../Home/Styles'
import { toastMsg1, toastMsg } from '../../Assets/Script/Helper';
// import { Dstyles } from './Styles';
var rating;
export default class LocalOtherProfile extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(prop) {
        super(prop);
        this.state = {
            originalName: '',
            id: '',
            name: '', ChatUserId: null,
            userName: '',
            website: '',
            bio: '',
            email: '', checkFollow: true,
            profilePic: '',
            verifyProfile: '',
            footPrintsCount: 0,
            footPrintCount: 0,
            folowersCount: 0,
            visitsCount: 0,
            footPrintsData: [],
            markers: [],
            businessProfile: 0,
            getLocation: '',
            memoriesCount: 0,
            vlogCount: 0,
            otherid: '', isvisibleModal: null,
            isModalVisible2: false,
            UnfollowModal: false,
            RequestModal: false, reqId: '', accountValidation: ''

        }
    }

    async componentDidMount() {
        var id1 = await AsyncStorage.getItem('OtherUserId');
        this.setState({
            otherid: id1
        })
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.userProfile(); this.updateFollow();
            }
        );
    };

    async componentWillMount() {
        var id1 = await AsyncStorage.getItem('OtherUserId');
        this.setState({
            otherid: id1
        })
        this.userProfile();
        this.getMapdata();
        this.footPrints(); this.updateFollow();
    }


    userProfile = async () => {
        // debugger;
        this.setState({ isLoading: true });
        var data = {
            userId: this.state.otherid
            // userId : await AsyncStorage.getItem('userId')
            // userId: '5df8869221d1ea48ea2379c3'
        };
        const url = serviceUrl.been_url1 + '/UserProfile';
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    // this.datamanipulating(responseJson.result[0].NewsFeedDet);
                    AsyncStorage.setItem('profileType', responseJson.result[0].UserDetails[0].ProfileType);
                    this.setState({
                        isLoading: false,
                        no_record_found: false,
                        folowersCount: responseJson.result[0].FollowersCount,
                        footPrintCount: responseJson.result[0].FootprintsCount,
                        businessProfile: responseJson.result[0].UserDetails[0].ProfileType,
                        id: responseJson.result[0].UserDetails[0]._id,
                        //    ChatUserId: uDetails.ChatUserId ? uDetails.ChatUserId : null,
                        accountValidation: responseJson.result[0].UserDetails[0].PrivateAccount,
                        userName: responseJson.result[0].UserDetails[0].UserName,
                        name: responseJson.result[0].UserDetails[0].name,
                        profilePic: responseJson.result[0].UserDetails[0].ProfilePic,
                        website: responseJson.result[0].UserDetails[0].Website,
                        bio: responseJson.result[0].UserDetails[0].Bio,
                        verifyProfile: responseJson.result[0].UserDetails[0].VerificationRequest,
                        memoriesCount: responseJson.result[0].NewsFeedDet.filter(v =>
                            v.Image.includes('.jpg') || v.Image.includes('.jpeg') || v.Image.includes('.png')).length,
                        vlogCount: responseJson.result[0].NewsFeedDet.filter(v => v.Image.includes('.mp4')).length,
                    })
                    rating = responseJson.result[0].ReviewData
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    followRequest = async () => {
        var data = {
            Otheruserid: this.state.otherid,
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/SendFollowReq";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    //toastMsg('success', 'Request has been sent')
                    // this.getOthersProfile();
                    this.updateFollow();
                }
            })
            .catch((error) => {
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    };
    unfollowAcc() {
        this.setState({
            isModalVisible: false,
            isModalVisible1: false,
            isModalVisible2: false,
            UnfollowModal: true
        })
    }

    reqAcc() {
        this.setState({
            isModalVisible: false,
            isModalVisible1: false,
            isModalVisible2: false,
            RequestModal: true
        })
    }
    _toggleModal1() {
        this.setState({
            isModalVisible: null,
            isvisibleModal: null,
            permission_Value: "",
            isModalVisible1: !this.state.isModalVisible1
        });
    }

    _toggleModal12() {
        // debugger;
        if (this.state.permission_Value == "" || null || undefined) {
            toastMsg1('danger', "Please give a report")
            // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
        }
        else {
            this.setState({
                isModalVisible: null,
                isvisibleModal: null,
                //  permission_Value: "",
                isModalVisible1: !this.state.isModalVisible1
            });
            this.report();
        }
    }
    async report() {
        var id1 = await AsyncStorage.getItem("OtherUserId");

        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: id1,
            Content: this.state.permission_Value
        };
        const url = serviceUrl.been_url1 + "/ReportOtheruser";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ isModalVisible1: false, isModalVisible2: true, permission_Value: '' })
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });

    };
    async reqCancel() {
        // debugger;
        this.setState({ RequestModal: false, UnfollowModal: false })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            reqId: this.state.reqId,
            Status: "Cancel"
        };
        const url = serviceUrl.been_url + "/AcceptOrDelete";
        fetch(url, {
            method: 'POST',
            headers: serviceUrl.headers,
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    {
                        this.userProfile();
                        this.updateFollow();
                        //toastMsg("success", "Request has been rejected")
                    }
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
    }

    async unfollow() {
        // debugger;
        this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false })
        var data = {
            // Userid: "5e1993a35f1480407aa46430"
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: this.state.otherid
        };
        const url = serviceUrl.been_url + "/Unfollow";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                //toastMsg('success', responseJson.message)
                this.userProfile();
                this.updateFollow();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }

    gotoChat = () => {
        // debugger;
        const { userName, ChatUserId } = this.state;
        console.log(`chat user name ${userName} and chat user id ${ChatUserId}`)
        if (ChatUserId == null || ChatUserId == 'null') {
            //toastMsg('danger', `${userName} has no specific chat id to chat`)
            return false
        }

        let data = {
            name: userName,
            occupants_ids: ChatUserId
        }
        this.props.navigation.navigate('OneToOneChat', { chatUser: data })
    }

    renderToolbarIconsView = () => {
        return (

            <View style={{ flexDirection: 'row', }}>

                <View style={[styles.topicons, { marginLeft: '-30%', }]} >
                    <TouchableOpacity onPress={() => this.tagPost()}>
                        <Image style={{ width: '100%', height: '100%' }}
                            source={require('../../Assets/Images/notes.png')} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.topicons, { height: 23, width: 24, marginLeft: '30%', justifyContent: 'flex-end' }]} >
                    <TouchableOpacity onPress={() => { this.setState({ isModalVisible: true }) }} >
                        <Image source={require('../../Assets/Images/3dots.png')}
                     // resizeMode={'center'} 
                         style={{ width: 16, height: 16, marginTop: 6 }} />
                        {/* <Image style={{ width: '100%', height: '100%' }} source={require('../../Assets/Images/3dots.png')} /> */}
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
    async memories1() {
        debugger;
        var id1 = await AsyncStorage.getItem('OtherUserId');
        var data = {
            otherid: id1
        }
        this.props.navigation.navigate('OtherMemories', { data: data })
    }
    async visits1() {
        var id1 = await AsyncStorage.getItem('OtherUserId');
        var data = {
            otherid: id1
        }
        this.props.navigation.navigate('OtherVisits', { data: data })
    }
    async albums() {
        var id1 = await AsyncStorage.getItem('OtherUserId');
        var data = {
            otherid: id1
        }
        this.props.navigation.navigate('OtherAlbums', { data: data })
    }
    async vlog() {
        var id1 = await AsyncStorage.getItem('OtherUserId');
        var data = {
            otherid: id1
        }
        this.props.navigation.navigate('OtherVlog', { data: data })
    }
    follwers() {
        var data = { userProfileScreen: 4 };
        this.props.navigation.navigate('UserProfileMemories', { data: data });
    }
    footPrint() {
        var dataForFootPrints = this.state.footPrintsData;
        this.props.navigation.navigate('FootPrints', { data: dataForFootPrints });
    }

    settings() {
        this.props.navigation.navigate('SettingsScreen')
    }
    tagPost(data) {
        var data = { screenName: "Profile" }
        this.props.navigation.navigate('TaggedPost', { data: data })
    }
    follwers1() {
        // debugger;
        var data = {
            otherid: this.state.otherid,
            userName: this.state.userName
        }
        this.props.navigation.navigate('OtherFollowers', { data: data })
    }

    stars(count) {
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= count; i++) {
            stars.push((<Image source={require('../../Assets/Images/localProfile/yellowstar.png')}
                style={{ height: hp(1), width: wp(2) }} resizeMode={'stretch'} />));
        }
        return (stars);
    }


    badgesScreen() {

        var data = {
            footprints: this.state.footPrintCount,
            memoriesCount: this.state.memoriesCount,
            vlogCount: this.state.vlogCount
        }
        this.props.navigation.navigate('OtherBadges', { data: data })
    }
    getMapdata = async () => {
        const { headers } = serviceUrl;
        var userId = await AsyncStorage.getItem('userId');
        const url = serviceUrl.been_url + "/GetNewsFeedList";
        var data = {
            UserId: userId
        };
        this.setState({ isLoader: true });
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(async response => response.json())
            .then(responseJson => {
                let newsfeeds = responseJson.result
                if (responseJson.status == "True") {
                    let myFeedData = [];
                    newsfeeds.length > 0 && newsfeeds.map((m, u) => {
                        if (m.userId == userId) {
                            let geometry = m.coords && m.coords != null ? JSON.parse(m.coords) : { latitude: 0, longitude: 0 };
                            console.log('geom', geometry);
                            myFeedData.push({
                                userId: m.userId,
                                UserProfilePic: m.UserProfilePic,
                                PostId: m.PostId,
                                postImg: m.Image,
                                title: m.Location,
                                coordinates: {
                                    latitude: geometry.latitude,
                                    longitude: geometry.longitude
                                }
                            })
                            console.log('get map data', m)
                        }
                    })
                    console.log('my feed data', myFeedData);
                    this.setState({
                        isLoader: false,
                        markers: myFeedData
                    });
                } else {
                    this.setState({ isLoader: false });
                    //toastMsg('danger', response.data.message)
                }
            })
            .catch(function (error) {
                this.setState({ isLoader: false });
                // console.log('Error:', error);
                //toastMsg('danger', error)
            });
    }

    datamanipulating = (nfdata) => {
        if (nfdata && nfdata.length > 0) {
            console.log('the nf data', nfdata);
            let markersWithCords = [];
            let markers = nfdata.map((m, i) => {
                const c = JSON.parse(m.coords);
                // console.log('the parsed data',c);
                m.coordinates = {}
                if (c.latitude != undefined) {
                    m.coordinates = c

                }
                m.coordinates = { latitude: c.lat, longitude: c.lng }

                m.userId = m.userId
                m.UserProfilePic = m.UserProfilePic
                m.postImg = m.Image
                m.path = m.story ? serviceUrl.been_image_urlExplore :
                    serviceUrl.newsFeddStoriesUrl
                m.Location = m.title
                return m;
            });
            console.log('the markers', markers);
            console.log('the markers with cords only', markersWithCords);
            this.setState({ markers, });
        }
    }
    async block() {
        // debugger;
        this.setState({ isModalVisible: false })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: this.state.otherid

        };
        const url = serviceUrl.been_url1 + "/BlockAccount";
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
                //toastMsg('success', "Account has been blocked")
                this.getOthersProfile();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }

    footPrints = async () => {
        debugger
        const { headers } = serviceUrl;
        var userId = await AsyncStorage.getItem('userId');
        const url = serviceUrl.been_url + "/GetFootPrints";
        var data = {
            UserId: this.state.otherid
        };
        this.setState({ isLoader: true });
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(async response => response.json())
            .then(responseJson => {
                //console.log('called api resp',responseJson)
                if (responseJson.status == "True") {
                    this.setState({
                        isLoader: false,
                        footPrintsCount: responseJson.Footprints,
                        visitsCount: responseJson.Visitscount,
                        footPrintsData: responseJson
                    });
                } else {
                    this.setState({ isLoader: false });
                    //toastMsg('danger', response.data.message)
                }
            })
            .catch(function (error) {
                this.setState({ isLoader: false });
                // console.log('Error:', error);
                //toastMsg('danger', 'Sorry..something network error.Please try again.')
            });
    }

    async updateFollow() {
        // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: this.state.otherid
        };
        const url = serviceUrl.been_url2 + "/OtherUserStatus";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    // checkFollow: responseJson.connectionstatus,
                    checkFollow: responseJson.message,

                })
                if (responseJson.connectionstatus == "Pending") {
                    this.setState({ reqId: responseJson.followid })
                }
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }


    render() {
        const { footPrintCount, memoriesCount, vlogCount } = this.state;
        const badges = footPrintCount + memoriesCount + vlogCount;
        const badgeCount = isNaN(badges) ? 0 : badges;
        const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
        const { profilePic } = serviceUrl;
        var mapStyle = [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#bddfff"
                    }
                ]
            },
            {
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#bddfff"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "saturation": -15
                    },
                    {
                        "lightness": -5
                    },
                    {
                        "weight": 0.5
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#fdd9fb"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#bddfff"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#bddfff"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#c9c9c9"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]

        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        const { newsFeddStoriesUrl } = serviceUrl;
        return (
            <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1, marginTop: 0 }}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />

                {
                    //Business Profile
                    this.state.ProfileAs === 2 ?
                        <BusinessPlacProfileOthers navigation={this.props.navigation} />
                        :
                        //End Business Profile 
                        (
                            this.state.isLoading != true ?
                                <View>
                                    <View style={{ height: hp('100%') }}>
                                        <Toolbar {...this.props} userNameTitle={this.state.userName} rightTwoImgView={this.renderToolbarIconsView()} />




                                        <View style={{ height: '45%' }}>
                                            <View style={{ width: '100%', height: hp(45), marginBottom: 10, }} >
                                                <View style={styles.container2}>
                                                    <View style={{ width: '75%', marginTop: '3%' }}>
                                                        <View>
                                                            {this.state.verifyProfile == "Approved" ? (
                                                                <View>
                                                                    {this.state.profilePic == null ? (

                                                                        <View style={{ width: '100%', height: '150%' }}>
                                                                            <ImageBackground style={[businessProfileStyle.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                                                source={require(imagePath + 'profile.png')}>
                                                                                {/* <Image source={require(imagePath1 + 'verify.png')} style={businessProfileStyle.verify} /> */}
                                                                            </ImageBackground>
                                                                            <Text style={[styles.newText1, { alignSelf: 'center', }]}>
                                                                                {this.state.name && this.state.name === undefined || this.state.name && this.state.name === null || this.state.name && this.state.name === "" || this.state.name && this.state.name === "null" || this.state.name && this.state.name === "undefined" ? "" : this.state.name}</Text>
                                                                            <View style={{ height: 85, }}>
                                                                                <View style={{ height: 85, marginTop: 1, }}>
                                                                                    <Text style={[styles.newText12, {}]}>{this.state.bio && this.state.bio === undefined || this.state.bio && this.state.bio === null || this.state.bio && this.state.bio === "" || this.state.bio && this.state.bio === "null" || this.state.bio && this.state.bio === "undefined" ? "" : this.state.bio}</Text>
                                                                                </View>
                                                                                <View style={{ height: '100%', width: '100%', }}>
                                                                                    {/* {this.state.businessProfile === 1 ? */}
                                                                                    <View style={styles.editProfile}>

                                                                                        {this.state.checkFollow === "You follow this user" ?
                                                                                            // <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                            <View style={{ height: 50 }}>
                                                                                                <TouchableOpacity onPress={() => this.unfollowAcc()} style={{ width: '100%', }}>
                                                                                                    <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                        borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                        <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Following</Text>
                                                                                                    </ImageBackground>
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                            // </TouchableOpacity>
                                                                                            :

                                                                                            this.state.checkFollow === "Your request was not accepted" ?
                                                                                                <View style={{ height: 50 }}>
                                                                                                    <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>
                                                                                                        <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                            borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Requested</Text>
                                                                                                        </ImageBackground></TouchableOpacity>
                                                                                                </View>
                                                                                                :
                                                                                                // this.state.checkFollow === "Your request was not accepted" ?
                                                                                                this.state.checkFollow === "You don't follow this user" ?
                                                                                                    <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                                        <View style={{ height: 50 }}>
                                                                                                            <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                                borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Follow</Text>
                                                                                                            </ImageBackground>
                                                                                                        </View>
                                                                                                    </TouchableOpacity>
                                                                                                    : null
                                                                                        }
                                                                                        <View style={{ flexDirection: 'column', height: 85, marginLeft: 15, marginTop: 1 }}>
                                                                                            <TouchableOpacity onPress={() => { this.gotoChat() }}>
                                                                                                <ImageBackground source={require('../../Assets/Images/Message.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                                                                                <Text style={[common_styles.Comm0on_btn_txt, { marginBottom: 5, fontSize: 8, fontFamily: Common_Color.fontLight, color: '#000000', }]}>Message</Text>
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </View>)
                                                                        : (
                                                                            <View style={{ width: '100%', height: '150%' }}>
                                                                                <ImageBackground style={[businessProfileStyle.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                                                    source={{ uri: serviceUrl.profilePic + this.state.profilePic }}>
                                                                                    <Image source={require(imagePath1 + 'TickSmall.png')} style={[businessProfileStyle.verify, { marginLeft: wp('18%') }]} />
                                                                                </ImageBackground>
                                                                                <Text style={[styles.newText1, { alignSelf: 'center', }]}>
                                                                                    {this.state.name && this.state.name === undefined || this.state.name && this.state.name === null || this.state.name && this.state.name === "" || this.state.name && this.state.name === "null" || this.state.name && this.state.name === "undefined" ? "" : this.state.name}</Text>
                                                                                <View style={{ height: 85, }}>
                                                                                    <View style={{ height: 85, marginTop: 1, width: "100%" }}>
                                                                                        <Text style={[styles.newText12, {}]}>{this.state.bio && this.state.bio === undefined || this.state.bio && this.state.bio === null || this.state.bio && this.state.bio === "" || this.state.bio && this.state.bio === "null" || this.state.bio && this.state.bio === "undefined" ? "" : this.state.bio}</Text>
                                                                                    </View>
                                                                                    <View style={{ marginTop: 1, height: 50, marginRight: 0, marginLeft: -0 }}>
                                                                                        {this.state.businessProfile === 1 ?

                                                                                            <View style={[styles.editProfile, { marginLeft: '1%', width: wp('60%'), borderColor: 'transparent', marginTop: '1%', }]}>
                                                                                                {/* <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                                                            <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 200, height: '100%', justifyContent: 'center' }} borderRadius={10}>
                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', }]} >Promote</Text>
                                                                            </ImageBackground>
                                                                        </TouchableOpacity> */}
                                                                                            </View>
                                                                                            : null}
                                                                                    </View>
                                                                                    <View style={{ height: '100%', width: '100%', }}>
                                                                                        {/* {this.state.businessProfile === 1 ? */}
                                                                                        <View style={styles.editProfile}>

                                                                                            {this.state.checkFollow === "You follow this user" ?
                                                                                                // <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                                <View style={{ height: 50 }}>
                                                                                                    <TouchableOpacity onPress={() => this.unfollowAcc()} style={{ width: '100%', }}>
                                                                                                        <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                            borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Following</Text>
                                                                                                        </ImageBackground>
                                                                                                    </TouchableOpacity>
                                                                                                </View>
                                                                                                // </TouchableOpacity>
                                                                                                :

                                                                                                this.state.checkFollow === "Your request was not accepted" ?
                                                                                                    <View style={{ height: 50 }}>
                                                                                                        <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>
                                                                                                            <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                                borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Requested</Text>
                                                                                                            </ImageBackground>
                                                                                                        </TouchableOpacity>
                                                                                                    </View>
                                                                                                    :
                                                                                                    this.state.checkFollow === "You don't follow this user" ?
                                                                                                        <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                                            <View style={{ height: 50 }}>
                                                                                                                <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                                    borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                                    <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Follow</Text>
                                                                                                                </ImageBackground>
                                                                                                            </View>
                                                                                                        </TouchableOpacity>
                                                                                                        : null
                                                                                            }
                                                                                            <View style={{ flexDirection: 'column', height: 85, marginLeft: 15, marginTop: 1 }}>
                                                                                                <TouchableOpacity onPress={() => { this.gotoChat() }}>
                                                                                                    <ImageBackground source={require('../../Assets/Images/Message.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                                                                                    <Text style={[common_styles.Comm0on_btn_txt, { marginBottom: 5, fontSize: 8, fontFamily: Common_Color.fontLight, color: '#000000', }]}>Message</Text>
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        )}
                                                                </View>
                                                            ) :
                                                                (<View>
                                                                    {this.state.profilePic == null ? (
                                                                        <View style={{ width: '100%', height: '150%' }}>
                                                                            <ImageBackground style={[businessProfileStyle.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                                                source={require(imagePath + 'profile.png')}>
                                                                                {/* <Image source={require(imagePath1 + 'verify.png')} style={businessProfileStyle.verify} /> */}
                                                                            </ImageBackground>
                                                                            <Text style={[styles.newText1, { alignSelf: 'center' }]}>
                                                                                {this.state.name && this.state.name === undefined || this.state.name && this.state.name === null || this.state.name && this.state.name === "" || this.state.name && this.state.name === "null" || this.state.name && this.state.name === "undefined" ? "" : this.state.name}</Text>
                                                                            <View style={{ height: 85, marginTop: 1, }}>
                                                                                <Text style={[styles.newText12, {}]}>{this.state.bio && this.state.bio === undefined || this.state.bio && this.state.bio === null || this.state.bio && this.state.bio === "" || this.state.bio && this.state.bio === "null" || this.state.bio && this.state.bio === "undefined" ? "" : this.state.bio}</Text>
                                                                            </View>
                                                                            <View style={{ height: '100%', width: '100%' }}>
                                                                                {/* {this.state.businessProfile === 1 ? */}
                                                                                <View style={styles.editProfile}>

                                                                                    {this.state.checkFollow === "You follow this user" ?
                                                                                        // <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                        <View style={{ height: 50 }}>
                                                                                            <TouchableOpacity onPress={() => this.unfollowAcc()} style={{ width: '100%', }}>
                                                                                                <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                    borderRadius={10} style={[styles.createButton, { width: 220, alignSelf: 'flex-start' }]}>
                                                                                                    <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Following</Text>
                                                                                                </ImageBackground>
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                        // </TouchableOpacity>
                                                                                        :

                                                                                        this.state.checkFollow === "Your request was not accepted" ?
                                                                                            <View style={{ height: 50 }}>
                                                                                                <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>
                                                                                                    <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                        borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                        <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Requested</Text>
                                                                                                    </ImageBackground>
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                            :
                                                                                            this.state.checkFollow === "You don't follow this user" ?
                                                                                                <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                                    <View style={{ height: 50 }}>
                                                                                                        <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                            borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Follow</Text>
                                                                                                        </ImageBackground>
                                                                                                    </View>
                                                                                                </TouchableOpacity>
                                                                                                : null
                                                                                    }
                                                                                    <View style={{ flexDirection: 'column', height: 85, marginLeft: 15, marginTop: 1 }}>
                                                                                        <TouchableOpacity onPress={() => { this.gotoChat() }}>
                                                                                            <ImageBackground source={require('../../Assets/Images/Message.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                                                                            <Text style={[common_styles.Comm0on_btn_txt, { marginBottom: 5, fontSize: 8, fontFamily: Common_Color.fontLight, color: '#000000', }]}>Message</Text>
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                </View>
                                                                                {/* <View style={[styles.editProfile, { borderColor: 'transparent', marginTop: 5 }]}>
                                                                                                <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                                                                                    <ImageBackground source={require(imagePath + 'storyButton.png')} style={{ width: '100%', height: '100%' }} borderRadius={10}>
                                                                                                        <Text style={[styles.textCenter, { color: '#fff' }]} >Promote</Text>
                                                                                                    </ImageBackground>
                                                                                                </TouchableOpacity>
                                                                                            </View>  */}
                                                                                {/* // : null} */}
                                                                            </View>
                                                                        </View>)
                                                                        : (
                                                                            <View style={{ width: '100%', height: '150%' }}>
                                                                                <ImageBackground style={[businessProfileStyle.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                                                    source={{ uri: serviceUrl.profilePic + this.state.profilePic }}>
                                                                                    {/* <Image source={require(imagePath1 + 'TickSmall.png')} style={[businessProfileStyle.verify, { marginLeft: wp('18%') }]} /> */}
                                                                                </ImageBackground>

                                                                                <Text style={[styles.newText1, { alignSelf: 'center', }]}>
                                                                                    {this.state.name && this.state.name === undefined || this.state.name && this.state.name === null || this.state.name && this.state.name === "" || this.state.name && this.state.name === "null" || this.state.name && this.state.name === "undefined" ? "" : this.state.name}</Text>
                                                                                <View style={{ height: 85, }}>
                                                                                    <View style={{ height: 85, marginTop: 1, }}>
                                                                                        <Text style={[styles.newText12, {}]}>{this.state.bio && this.state.bio === undefined || this.state.bio && this.state.bio === null || this.state.bio && this.state.bio === "" || this.state.bio && this.state.bio === "null" || this.state.bio && this.state.bio === "undefined" ? "" : this.state.bio}</Text>
                                                                                    </View>
                                                                                    <View style={{ height: '100%', width: '100%' }}>
                                                                                        {/* {this.state.businessProfile === 1 ? */}
                                                                                        <View style={styles.editProfile}>

                                                                                            {this.state.checkFollow === "You follow this user" ?
                                                                                                // <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                                <View style={{ height: 50 }}>
                                                                                                    <TouchableOpacity onPress={() => this.unfollowAcc()} style={{ width: '100%', }}>
                                                                                                        <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                            borderRadius={10} style={[styles.createButton, { width: 220, alignSelf: 'flex-start' }]}>
                                                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Following</Text>
                                                                                                        </ImageBackground>
                                                                                                    </TouchableOpacity>
                                                                                                </View>
                                                                                                // </TouchableOpacity>
                                                                                                :

                                                                                                this.state.checkFollow === "Your request was not accepted" ?
                                                                                                    <View style={{ height: 50 }}>
                                                                                                        <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>
                                                                                                            <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                                borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Requested</Text>
                                                                                                            </ImageBackground>
                                                                                                        </TouchableOpacity>
                                                                                                    </View>
                                                                                                    :
                                                                                                    this.state.checkFollow === "You don't follow this user" ?
                                                                                                        <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                                            <View style={{ height: 50 }}>
                                                                                                                <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                                                    borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                                                    <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Follow</Text>
                                                                                                                </ImageBackground>
                                                                                                            </View>
                                                                                                        </TouchableOpacity>
                                                                                                        : null
                                                                                            }
                                                                                            <View style={{ flexDirection: 'column', height: 85, marginLeft: 15, marginTop: 1 }}>
                                                                                                <TouchableOpacity onPress={() => { this.gotoChat() }}>
                                                                                                    <ImageBackground source={require('../../Assets/Images/Message.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                                                                                    <Text style={[common_styles.Comm0on_btn_txt, { marginBottom: 5, fontSize: 8, fontFamily: Common_Color.fontLight, color: '#000000', }]}>Message</Text>
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                        </View>
                                                                                        {/* <View style={[styles.editProfile, { borderColor: 'transparent', marginTop: 5 }]}>
                                                                                                <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                                                                                    <ImageBackground source={require(imagePath + 'storyButton.png')} style={{ width: '100%', height: '100%' }} borderRadius={10}>
                                                                                                        <Text style={[styles.textCenter, { color: '#fff' }]} >Promote</Text>
                                                                                                    </ImageBackground>
                                                                                                </TouchableOpacity>
                                                                                            </View>  */}
                                                                                        {/* // : null} */}
                                                                                    </View>
                                                                                </View>

                                                                            </View>
                                                                        )}
                                                                </View>
                                                                )}

                                                        </View>


                                                        <View style={{ height: 520, marginTop: '22%', }}>
                                                            {/* <View style={{ height: 85, marginTop: 1 }}>
                                                                <Text style={styles.newText1}>{this.state.bio}</Text>
                                                            </View> */}




                                                            {/* {this.state.accountValidation == "Public" &&  this.state.ProfileAs === 0 ? */}
                                                            <View style={styles.editProfile}>

                                                                {this.state.checkFollow === "True" ?
                                                                    // <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                    <TouchableOpacity onPress={() => this.unfollowAcc()} style={{ width: '100%', }}>
                                                                        <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                            borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Following</Text>
                                                                        </ImageBackground>
                                                                    </TouchableOpacity>
                                                                    // </TouchableOpacity>
                                                                    :

                                                                    this.state.checkFollow === "Pending" ?
                                                                        <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>
                                                                            <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Requested</Text>
                                                                            </ImageBackground>
                                                                        </TouchableOpacity>
                                                                        :
                                                                        this.state.checkFollow === "False" ?
                                                                            <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                                <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                                    borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                                    <Text style={[common_styles.Common_btn_txt, { fontSize: 15 }]}>Follow</Text>
                                                                                </ImageBackground>
                                                                            </TouchableOpacity> : null
                                                                }
                                                                <View style={{ flexDirection: 'column', height: 90, marginLeft: 15, marginTop: 2 }}>
                                                                    <TouchableOpacity onPress={() => { this.gotoChat() }}>
                                                                        <ImageBackground source={require('../../Assets/Images/Message.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                                                        <Text style={[common_styles.Comm0on_btn_txt, { marginBottom: 5, fontSize: 9, fontFamily: Common_Color.fontLight, color: '#000000', }]}>Message</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                            {/* :
                                                                    // <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                    //     <ImageBackground source={require('../../Assets/Images/button.png')}
                                                                    //         borderRadius={10} style={[styles.createButton, { width: 200, alignSelf: 'flex-start' }]}>
                                                                    //         <Text style={[common_styles.Common_btn_txt, { marginTop: 5 }]}>Follow</Text>
                                                                    //     </ImageBackground>
                                                                    // </TouchableOpacity>
                                                                null} */}







                                                        </View>

                                                    </View>


                                                    {/* /* Followers */}

                                                    <View style={{ marginLeft: '2%', marginTop: -30, height: '100%' }}>
                                                        {this.state.folowersCount > 0 ?
                                                            <View>
                                                                {this.state.accountValidation == "Public" ?
                                                                    <TouchableOpacity onPress={() => this.follwers1()}>
                                                                        <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '8%', }}>
                                                                            <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                                rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                            </Image>
                                                                            <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> {this.state.folowersCount}  </Text>
                                                                                <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Followers </Text>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '8%', }}>
                                                                        <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                            rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                        </Image>
                                                                        <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font, marginTop: 10, }}> {this.state.folowersCount}  </Text>
                                                                            <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Followers </Text>
                                                                        </View>
                                                                    </View>}
                                                            </View>

                                                            :
                                                            <TouchableOpacity>
                                                                <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '8%', }}>
                                                                    <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                        rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                    </Image>
                                                                    <View style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> 0  </Text>
                                                                        <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Followers </Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        }





                                                        {/* Footprints */}

                                                        <View>
                                                            {this.state.footPrintCount > 0 ?
                                                                <View>
                                                                    {this.state.accountValidation == "Public" ?
                                                                        <TouchableOpacity onPress={() => this.footPrint()}>
                                                                            <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                                <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                                    rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                                </Image>
                                                                                <View style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                    <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> {this.state.footPrintCount}  </Text>
                                                                                    <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Footprints </Text>
                                                                                </View>
                                                                            </View></TouchableOpacity>
                                                                        : <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                            <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                                rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                            </Image>
                                                                            <View style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> {this.state.footPrintCount}  </Text>
                                                                                <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Footprints </Text>
                                                                            </View>
                                                                        </View>}
                                                                </View>


                                                                :
                                                                <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                    <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                        rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                    </Image>
                                                                    <View style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> 0  </Text>
                                                                        <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Footprints </Text>
                                                                    </View>
                                                                </View>
                                                            }
                                                        </View>


                                                        {/* Badges */}

                                                        <View>
                                                            {badgeCount > 0 ?
                                                                <View>
                                                                    {this.state.accountValidation == "Public" ?
                                                                        <TouchableOpacity onPress={() => this.badgesScreen()}>
                                                                            <View style={{ width: 80, height: 80, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                                <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                                                                    rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Floral-grey.png')}>
                                                                                </Image>
                                                                                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                                                    <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> {badgeCount}  </Text>
                                                                                    <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Badges </Text>
                                                                                </View>
                                                                            </View>
                                                                        </TouchableOpacity> :
                                                                        <View style={{ width: 80, height: 80, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                            <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                                                                rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Floral-grey.png')}>
                                                                            </Image>
                                                                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> {badgeCount}  </Text>
                                                                                <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Badges </Text>
                                                                            </View>
                                                                        </View>}
                                                                </View>
                                                                :
                                                                <View style={{ width: 75, height: 80, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                    <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                                                        rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Floral-grey.png')}>
                                                                    </Image>
                                                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> 0  </Text>
                                                                        <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Badges </Text>
                                                                    </View>
                                                                </View>
                                                            }

                                                        </View>

                                                        {/* <View style={{ alignContent: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('LocalProfileFullView') }}>
                      <Image style={{ width: 54, height: 54, marginTop: '5%', marginLeft: '9%' }} source={require(imagePath + 'local_profile.png')}></Image>
                    </TouchableOpacity>
                  </View> */}
                                                        <View style={{ alignContent: 'center' }}>
                                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('LocalProfile5') }}>
                                                                <Image style={{ width: 54, height: 54, marginTop: '5%', marginLeft: '9%' }} source={require(imagePath + 'local_profile.png')}></Image>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginLeft: 24 }}>
                                                            {this.stars(rating)}
                                                        </View>
                                                    </View>


                                                </View>
                                            </View>
                                        </View>






                                        <View style={{ flex: 1, marginTop: 5, }}>
                                            {this.state.accountValidation == "Public" ?
                                                // <MapView
                                                //     ref={(ref) => { this.mapRef = ref }}
                                                //     style={styles.map}
                                                //     followUserLocation={true}
                                                //     zoomEnabled={true}
                                                //     showsUserLocation={true}
                                                //     showsCompass={true}
                                                //     customMapStyle={mapStyle}
                                                //     moveOnMarkerPress={true}    >
                                                //     {this.state.markers.map((marker, index) => (
                                                //         marker.coordinates.latitude != 0 ?
                                                //             <MapView.Marker key={index} coordinate={marker.coordinates}>

                                                //                 <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', }}>
                                                //                     <ImageBackground source={require('../../Assets/Images/loc_marker_unseen.png')} style={{ width: 41, height: 45, justifyContent: 'center' }} rezizeMode={'stretch'} >
                                                //                         <Image source={{ uri: newsFeddStoriesUrl + marker.postImg.split(',')[0] }} style={{
                                                //                             height: 35, width: 35, borderRadius: 35, marginLeft: '7%', marginBottom: '12%'
                                                //                         }} />
                                                //                     </ImageBackground >
                                                //                 </View>
                                                //             </MapView.Marker>
                                                //             :
                                                //             null
                                                //     ))}
                                                // </MapView> 


                                                <View style={{ width: '100%', height: hp(100), }}>
                                                    <MapView
                                                        ref={el => (this.map = el)}
                                                        style={styles.map}
                                                        followUserLocation={true}
                                                        zoomEnabled={true}
                                                        showsUserLocation={true}
                                                        showsCompass={true}
                                                        customMapStyle={Dstyles.mapStyle}
                                                        onLayout={this.onLayout}
                                                        moveOnMarkerPress={true}    >
                                                        {this.state.markers.length > 0 && this.state.markers.map((marker, index) => (

                                                            marker.coordinates.latitude != undefined ?
                                                                <MapView.Marker key={index} coordinate={marker.coordinates}>

                                                                    <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', }}>
                                                                        <ImageBackground source={require('../../Assets/Images/loc_marker_unseen.png')} style={{ width: 41, height: 45, justifyContent: 'center' }} resizeMode={'stretch'} >
                                                                            <Image source={{ uri: marker.path + marker.postImg.split(',')[0] }} style={{
                                                                                height: 35, width: 35, borderRadius: 35, marginLeft: '7%', marginBottom: '12%'
                                                                            }} />
                                                                        </ImageBackground >
                                                                    </View>

                                                                </MapView.Marker>
                                                                :
                                                                null
                                                        ))}
                                                    </MapView>
                                                </View>

                                                :
                                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ width: wp(10), height: hp(6), justifyContent: 'center' }}>
                                                        <Image style={{ width: '100%', height: '100%' }} resizeMethod={'auto'}
                                                            source={require('../../Assets/Images/new/private.png')} />
                                                    </View>
                                                    <View style={{ flexDirection: 'column', paddingLeft: 5, width: wp('80%'), justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#010101', textAlign: 'left' }}>This Account is Private</Text>
                                                        <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#010101' }}>Follow this account to see their memories and visits</Text>
                                                    </View>
                                                </View>

                                            }
                                        </View>
                                    </View>

                                    <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                                        {this.state.no_record_found === true ? (
                                            <View style={styles.hasNoMem}>
                                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                                <Text style={Common_Style.noDataText}> You have not created any Memories yet!</Text>
                                            </View>
                                        ) : null}
                                    </View>


                                    {/* Request cancel Modal */}
                                    <Modal isVisible={this.state.RequestModal}
                                        onBackdropPress={() => this.setState({ RequestModal: false })}
                                        onBackButtonPress={() => this.setState({ RequestModal: false })} >
                                        <View style={{ backgroundColor: '#fff', borderRadius: 8 }} >
                                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                                            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                                                <Text style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 12, fontFamily: profilename.Font }}>
                                                    Are you sure want to Cancel this request?
                                    </Text>
                                            </View>

                                            <View style={[Common_Style.Common_button, { width: wp(88), margin: 3 }]}>

                                                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                                    borderRadius={10}
                                                >
                                                    <TouchableOpacity onPress={() => { this.reqCancel() }}>
                                                        <Text onPress={() => { this.reqCancel() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Yes</Text>
                                                    </TouchableOpacity>
                                                </ImageBackground>

                                            </View>
                                            <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
                                                <TouchableOpacity onPress={() => { this.setState({ RequestModal: false }) }}>

                                                    <Text onPress={() => { this.setState({ RequestModal: false }) }} style={[Common_Style.Common_btn_txt, { color: Common_Color.common_black, alignItems: 'center', justifyContent: 'center', }]}>No</Text>
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    </Modal>


                                    {/* Unfollow Modal */}


                                    <Modal isVisible={this.state.UnfollowModal}
                                        onBackdropPress={() => this.setState({ UnfollowModal: false })}
                                        onBackButtonPress={() => this.setState({ UnfollowModal: false })} >
                                        <View style={{ backgroundColor: 'transparent', borderRadius: 8 }} >
                                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                                            <View style={{ justifyContent: 'center', alignContent: 'center', }}>
                                                {this.state.profilePic === null ? <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                                    source={require('../../Assets/Images/profile.png')} /> :
                                                    <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                                        source={{ uri: profilePic + this.state.profilePic }} />}
                                            </View>
                                            <View >
                                                <Text style={{ color: '#fff', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 15, fontFamily: UnameStory.Font }}>
                                                    Are you sure want to unfollow
                                                <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold, color: '#fff', fontSize: 15, }]}>  {this.state.userName} ?</Text>
                                                </Text>
                                            </View>
                                            <View style={[Common_Style.Common_button, { width: wp(88), margin: 3 }]}>
                                                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                                    borderRadius={10} >
                                                    <TouchableOpacity onPress={() => { this.unfollow() }}>
                                                        <Text onPress={() => { this.unfollow() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Unfollow</Text>
                                                    </TouchableOpacity>
                                                </ImageBackground>

                                            </View>
                                            <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
                                                <TouchableOpacity style={{ width: wp(88), }} onPress={() => { this.setState({ UnfollowModal: false }) }}>
                                                    <Text onPress={() => { this.setState({ UnfollowModal: false }) }} style={[Common_Style.Common_btn_txt, { color: Common_Color.common_white, alignItems: 'center', justifyContent: 'center', color: '#fff' }]}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>


                                    <Modal isVisible={this.state.isModalVisible} onBackdropPress={() =>
                                        this.setState({ isModalVisible: false })}
                                        onBackButtonPress={() => this.setState({ isModalVisible: false })} >
                                        <View style={styles1.modalContent} >
                                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

                                            <View style={{ marginTop: 15, }}>
                                                <TouchableOpacity onPress={this.writeToClipboard}>
                                                    <Text onPress={this.writeToClipboard}
                                                        style={styles1.modalText}>
                                                        Copy profile URL
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>




                                            <View style={styles1.horizontalSeparator} />

                                            <View style={{ marginTop: 7, }}>
                                                <TouchableOpacity onPress={() => { this.setState({ isModalVisible: false }) }}>
                                                    <Text onPress={() => { this.setState({ isModalVisible: false }) }} style={styles1.modalText}>
                                                        Share Profile
             </Text>
                                                </TouchableOpacity>
                                            </View>


                                            <View style={styles1.horizontalSeparator} />
                                            <View style={{ marginTop: 7, }}>
                                                <TouchableOpacity
                                                    onPress={() => this._toggleModal1()}
                                                    style={{ width: "100%" }}
                                                >
                                                    <Text onPress={() => this._toggleModal1()} style={styles1.modalText}>
                                                        Report account
             </Text>
                                                </TouchableOpacity>
                                            </View>


                                            <View style={styles1.horizontalSeparator} />



                                            {/* {this.state.checkFollow === "True" ? */}
                                            {this.state.checkFollow === "You follow this user" ?
                                                <View style={{ marginTop: 7 }} >
                                                    <TouchableOpacity style={{ width: "100%" }} onPress={() => this.unfollow()}>
                                                        <Text onPress={() => this.unfollow()}
                                                            style={[styles1.modalText, { color: '#8caafa' }]}>
                                                            Unfollow account
               </Text>
                                                    </TouchableOpacity>
                                                </View> :
                                                <Text onPress={() => this.setState({ isModalVisible: false })} style={[styles1.modalText, { color: '#8caafa' }]}>
                                                    Unfollow account
                                              </Text>}


                                            <View style={styles1.horizontalSeparator} />


                                            <View style={{ marginTop: 7, marginBottom: 15 }}>
                                                <TouchableOpacity onPress={() => this.block()}>
                                                    <Text onPress={() => this.block()} style={[styles1.modalText, { color: '#fb7935' }]}>
                                                        Block account
               </Text>
                                                </TouchableOpacity>
                                            </View>



                                        </View>
                                    </Modal>

                                    {/* Report models */}
                                    <Modal isVisible={this.state.isModalVisible1}
                                        onBackdropPress={() => this.setState({ isModalVisible1: null })}
                                        onBackButtonPress={() => this.setState({ isModalVisible1: null })} >
                                        <View style={Common_Style.parentViewReport} >
                                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                                            <Image style={Common_Style.iconReport} source={require('../../Assets/Images/new/Expression.png')}></Image>
                                            <Text style={Common_Style.headerReport} >
                                                Inappropriate Content!
</Text>
                                            <Text style={Common_Style.subHeaderReport} >
                                                We are sorry for the inconvenience!
</Text>
                                            <View style={[Common_Style.contentViewReport, { marginHorizontal: 10 }]}>
                                                <Text style={Common_Style.contentReport} >
                                                    We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
</Text>
                                            </View>
                                            <TextInput
                                                label=" Type Here..."
                                                placeholderStyle={Common_Style.PstyleReport}
                                                mode="outlined" gnb
                                                multiline={true}
                                                maxLength={500}
                                                // flexWrap: 'wrap'
                                                onChangeText={(text) => { this.setState({ permission_Value: text }) }}
                                                value={this.state.permission_Value}
                                                autoCorrect={false}
                                                
                                                style={Common_Style.TstyleReport}
                                                selectionColor={'#f0275d'}
                                                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />



                                            <View
                                                style={Common_Style.buttonViewReport}
                                            >

                                                <TouchableOpacity
                                                    onPress={() => this._toggleModal12()}
                                                    activeOpacity={1.5}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.75 }}
                                                        end={{ x: 1, y: 0.25 }}
                                                        style={Common_Style.ButtonReport}
                                                        colors={["#fb0043", "#fb0043"]}
                                                    >

                                                        <Text onPress={() => this._toggleModal12()}
                                                            style={Common_Style.ButtonTextReport}>
                                                            Report
</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>


                                                <TouchableOpacity
                                                    onPress={() => this._toggleModal1()}
                                                    activeOpacity={1.5}
                                                >
                                                    <View style={Common_Style.ButtonCancel}>
                                                        <Text onPress={() => this._toggleModal1()} style={Common_Style.CancelButtonTextReport}>
                                                            Cancel
</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>



                                    {/* Thanks Modal */}
                                    <Modal isVisible={this.state.isModalVisible2}
                                        onBackdropPress={() => this.setState({ isModalVisible2: false })}
                                        onBackButtonPress={() => this.setState({ isModalVisible2: false })} >
                                        <View style={Common_Style.TparentView} >
                                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                                            <Text style={Common_Style.TheaderInModalTwo} >
                                                Thank you for your voice!
</Text>

                                            <View style={[Common_Style.TcontentViewInModalTwo, { marginHorizontal: 10 }]}>
                                                <Text style={Common_Style.TcontentTextInModalTwo} >
                                                    We would like to show you our utmost gratitude for raising your voice against inappropriate behaviour and thus helping in making this a safe and happy place for people around you!
</Text>
                                                <Text style={[Common_Style.TcontentTextInModalTwo, { marginTop: 10 }]} >
                                                    Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
</Text>
                                            </View>

                                            {/* <View style={Common_Style.TcontentViewInModalTwo}>
              <Text style={[Common_Style.TcontentTextInModalTwo, { marginTop: 40 }]} >
                Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
</Text>
            </View> */}
                                            <View style={Common_Style.TokayButton}>
                                                <TouchableOpacity onPress={() => this.setState({ isModalVisible2: false })} activeOpacity={1.5} >
                                                    <Text onPress={() => this.setState({ isModalVisible2: false })} style={Common_Style.TokayButtonText}>
                                                        Okay
                </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>

                                </View>
                                :
                                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Spinner color="#64b3f2" />
                                </View>)}


                {this.state.accountValidation == "Public" ?
                    <View style={{ ...styles.footer, }}>

                        <View style={{ ...styles.footericon, marginBottom: 8 }}>
                            <TouchableOpacity onPress={() => this.memories1()}>
                                <Image style={{ marginLeft: 7, width: 37, height: 37 }} source={require('../../Assets/Images/camera.png')}></Image>
                            </TouchableOpacity>
                            <Text onPress={() => this.memories1()} style={styles.fontsize}>Memories</Text>
                        </View>

                        <View style={{ ...styles.footericon, marginBottom: 8, }}>
                            <TouchableOpacity onPress={() => this.visits1()}>
                                <Image style={{ width: 36, height: 36, marginTop: 7, marginLeft: -8 }} source={require('../../Assets/Images/visits.png')}
                                    resizeMode='center'
                                ></Image>
                            </TouchableOpacity>
                            <Text onPress={() => this.visits1()} style={{ ...styles.fontsize, marginTop: -5 }}>Visits</Text>
                        </View>

                        <View style={{ ...styles.footericon, marginBottom: 8 }}>
                            <TouchableOpacity onPress={() => this.albums()}>
                                <Image style={{ marginLeft: 7, width: 36, height: 36, marginLeft: -1 }} source={require('../../Assets/Images/image.png')}></Image>
                            </TouchableOpacity>
                            <Text onPress={() => this.albums()} style={styles.fontsize}>Albums</Text>
                        </View>

                        <View style={[styles.footericon, { width: '10%', marginRight: '0%', marginBottom: 8 }]}>
                            <TouchableOpacity onPress={() => this.vlog()}>
                                <Image style={{ width: 38, height: 38, marginLeft: -5 }} source={require('../../Assets/Images/video.png')}
                                 resizeMode={'center'}
                                ></Image>
                                <Text onPress={() => this.vlog()} style={styles.fontsize}>VLog</Text>
                            </TouchableOpacity>
                        </View>

                    </View> : null}

            </View>
        )
    }
}
const styles = StyleSheet.create({

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
        height: 70,
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
    fontsize: { fontSize: 12, color: '#010101', fontWeight: 'normal', textAlign: 'auto', fontFamily: Common_Color.fontMedium, },
    fontsize1: { fontSize: 16, color: '#010101', fontFamily: Common_Color.fontBold },
    newText: { color: '#010101', fontSize: 14, fontFamily: Common_Color.fontMedium, textAlign: 'center' },
    newText1: { fontSize: Username.FontSize, fontFamily: Username.Font, textAlign: 'left', marginBottom: 5, marginTop: 5, marginLeft: '3%' },
    newText12: { fontSize: Description.FontSize, fontFamily: Description.Font, textAlign: 'left', marginBottom: 5, marginTop: 5, marginLeft: '3%' },
    footerIconImage: { width: wp(8), height: hp(4.5), },
    modalView2: { backgroundColor: "#FFF", borderRadius: 25, borderColor: "rgba(0, 0, 0, 0.1)", justifyContent: 'center', alignItems: 'center' },
    mesageButton: { alignItems: 'center', justifyContent: 'center', borderWidth: .5, borderColor: 'grey', height: 34, width: 130, borderRadius: 10 },
    editProfile: { width: '94%', height: 34, marginLeft: 'auto', marginRight: 'auto', marginBottom: 10, justifyContent: 'space-around', flexDirection: 'row', }
})


// const styles = StyleSheet.create({
//     map: {
//         ...StyleSheet.absoluteFillObject,
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "#fff"
//     },
//     footer: {
//         position: 'absolute',
//         flex: 0.1,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: '#fff',
//         flexDirection: 'row',
//         height: 60,
//         width: '95%',
//         marginTop: 0,
//         alignItems: 'center',
//         justifyContent: 'center'
//     }, t1: { color: '#010101', fontSize: 14, fontFamily: Common_Color.fontMedium, textAlign: 'left', marginTop: 5, marginBottom: 5, marginLeft: '3%' },
//     container: {
//         flex: 1,
//     },
//     iconView: {
//         width: '12%',
//         height: '140%'
//     },
//     container2: { flexDirection: 'row', marginTop: '3%', width: '95%', marginLeft: 'auto', marginRight: 'auto' },

//     container: {
//         flex: 1,
//     },
//     iconView: {
//         width: '12%',
//         height: '140%'
//     },
//     icon: {
//         width: 15, height: 20
//     },
//     icon1: {
//         width: 18, height: 18, borderRadius: 5
//     },
//     footericon: { width: '23%', marginLeft: '5%', },

//     fontColor: {
//         color: '#b4b4b4'
//     },
//     fontsize: { fontSize: 12, color: '#010101', fontWeight: 'normal', textAlign: 'auto', fontFamily: Common_Color.fontMedium, },
//     footerIconImage: { width: wp(8), height: hp(4.5), },
//     editProfile: {
//         width: '94%', borderWidth: .5, borderColor: 'grey', height: 30, marginLeft: 'auto', marginRight: 'auto', marginBottom: 10,
//     }
// })
