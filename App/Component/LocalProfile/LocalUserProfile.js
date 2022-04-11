
import React, { Component } from 'react';
import { View, Text, Image, StatusBar, ScrollView, StyleSheet, KeyboardAvoidingView, ImageBackground, TextInput, Picker } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Title, Content, Button, Header, Footer, FooterTab, Badge, Left, Right, Body } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import serviceUrl from '../../Assets/Script/Service';
let Common_Api = require('../../Assets/Json/Common.json')
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../BusinessProfile/styles/businessProfileStyle'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
var rating;
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar, FooterTabBar } from '../commoncomponent'

import common_styles from "../../Assets/Styles/Common_Style"
import Fontisto from 'react-native-vector-icons/Fontisto'

export default class LocalUserProfile extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(prop) {
        super(prop);
        this.state = {
            originalName: '',
            id: '',
            name: '',
            userName: '',
            website: '',
            bio: '',
            email: '',
            profilePic: '',
            verifyProfile: '',
            footPrintCount: 0,
            folowersCount: 0,
            followingCount: 0,
            visitsCount: 0,
            footPrintsData: [],
            markers: [],
            businessProfile: 0,
            getLocation: '',
            memoriesCount: 0,
            vlogCount: 0,
            streakImages: [],
            FootprintImaged: [],
            MemorieImages: [],
            VlogImages: [],
            CountryImages: [],
            result: [],regDuplicateCountry:[],regFilterDuplicateCountryCount:[]

        }
    }

    componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.userProfile();
                this.badgesApi();
            }
        );
    };

    componentWillMount() {
        this.userProfile();
        this.getMapdata();
        this.footPrints();
        this.badgesApi();
    }
    async badgesApi() {
       // debugger;
        var UId = await AsyncStorage.getItem('userId');
        console.log('test id', UId);
        var data = {
            //   Userid: "5df489bd1bc2097d72dd07c2"
            // UserId: "5e6f2ebde44ab376935b4022"
            UserId: UId
        };
        const url = serviceUrl.been_url1 + '/GetBadgesCount';
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('badges responses', responseJson);
                if (responseJson.status == 'True') {
                    this.setState({
                        result: responseJson,
                        streakImages: responseJson.streakImages,
                        FootprintImaged: responseJson.FootprintImaged,
                        MemorieImages: responseJson.MemorieImages,
                        VlogImages: responseJson.VlogImages,
                        CountryImages: responseJson.CountryImages,
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
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

    userProfile = async () => {
       // debugger;
        var data = {
            userId: await AsyncStorage.getItem('userId')
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
                let userData = responseJson.result[0].UserDetails[0]
                if (responseJson.status == "True") {

                    if (responseJson.result[0].UserDetails[0].ProfileType === 1) {
                        // let uTr = responseJson.UserTraffic;
                        // let uEng = responseJson.UserEngagement
                        // let UserTraffic = responseJson.UserTraffic.length > 0 && [uTr[0].Followers, uTr[0].UnFollowers, uTr[0].visitors]
                        // let UserEngagement = responseJson.UserEngagement.length > 0 && [uEng[0].LikeCount,
                        // uEng[0].CommentCount, uEng[0].SavedCount, uEng[0].ShareCount]
                        this.setState({
                            folowersCount: responseJson.result[0].FollowersCount,
                            followingCount: responseJson.result[0].FollowingsCount,
                            footPrintCount: responseJson.result[0].FootprintsCount,
                            businessProfile: userData.ProfileType,
                            id: userData._id,
                            userName: userData.UserName,
                            originalName: userData.name == "null" ? "" : userData.name,
                            profilePic: userData.ProfilePic,
                            website: userData.Website == "null" ? "" : userData.Website,
                            bio: userData.Bio == "null" ? "" : userData.Bio,
                            homeLocation: userData.HomeLocation,
                            verifyProfile: userData.VerificationRequest,
                            memoriesCount: responseJson.result[0].NewsFeedDet.filter(v =>
                                v.Image.includes('.jpg') || v.Image.includes('.jpeg') || v.Image.includes('.png')).length,
                            vlogCount: responseJson.result[0].NewsFeedDet.filter(v => v.Image.includes('.mp4')).length,
                            // UserTrafficData: UserTraffic,
                            // UserEngagementData: UserEngagement,
                        })
                    }
                    else {

                        // AsyncStorage.setItem('profileType', responseJson.result[0].UserDetails[0].ProfileType);
                        this.setState({
                            folowersCount: responseJson.result[0].FollowersCount,
                            followingCount: responseJson.result[0].FollowingsCount,
                            footPrintCount: responseJson.result[0].FootprintsCount,
                            businessProfile: responseJson.result[0].UserDetails[0].ProfileType,
                            id: responseJson.result[0].UserDetails[0]._id,
                            userName: responseJson.result[0].UserDetails[0].UserName,
                            originalName: responseJson.result[0].UserDetails[0].name == "null" ? "" : responseJson.result[0].UserDetails[0].name,
                            profilePic: responseJson.result[0].UserDetails[0].ProfilePic,
                            website: responseJson.result[0].UserDetails[0].Website == "null" ? "" : responseJson.result[0].UserDetails[0].Website,
                            bio: responseJson.result[0].UserDetails[0].Bio == "null" ? "" : responseJson.result[0].UserDetails[0].Bio,
                            verifyProfile: responseJson.result[0].UserDetails[0].VerificationRequest,
                            memoriesCount: responseJson.result[0].NewsFeedDet.filter(v =>
                                v.Image.includes('.jpg') || v.Image.includes('.jpeg') || v.Image.includes('.png')).length,
                            vlogCount: responseJson.result[0].NewsFeedDet.filter(v => v.Image.includes('.mp4')).length,
                        })
                        rating = responseJson.result[0]
                        rating = rating.ReviewData
                        console.log('rating' + rating)

                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    memories() {
        var data = {
            screenName: "BusinessProfile"
        }
        this.props.navigation.navigate('UserProfileMemories', { data: data });
    }
    visits() {
        this.props.navigation.navigate('Visits');
    }
    albums() {
        this.props.navigation.navigate('UserProfileAlbums');
    }
    vlogGet() {
        this.props.navigation.navigate('VlogGet');
    }
    follwers() {
        var data = { userProfileScreen: 4 };
        this.props.navigation.navigate('UserProfileMemories', { data: data });
    }
    footPrint() {
        var dataForFootPrints = this.state.footPrintsData;
        this.props.navigation.navigate('FootPrints', { data: dataForFootPrints });
    }
    editProfile() {
        this.props.navigation.navigate('Edit_Profile')
    }
    newsfeed() {
        this.props.navigation.navigate('Newsfeed')
    }
    settings() {
        this.props.navigation.navigate('SettingsScreen')
    }
    tagPost(data) {
        var data = { screenName: "Profile" }
        this.props.navigation.navigate('TaggedPost', { data: data })
    }
    follwers() {
        var data = {
            followerCount: this.state.folowersCount,
            followingCount: this.state.followingCount
        }
        this.props.navigation.navigate('FollowTab', { data: data });
    }

    // profileAnalytics() {
    //     const { UserTrafficData, UserEngagementData } = this.state;
    //     const data = {
    //         uTd: UserTrafficData,
    //         uEngmt: UserEngagementData
    //     }
    //     this.props.navigation.navigate('ProfileAnalytics', { analytics: data })
    // }

    async profileAnalytics() {
        debugger
        var data = {
            userId: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url1 + '/ChartData';
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    console.log('utr', responseJson.UserTraffic[0].Followers.toString())
                    let uTr = responseJson.UserTraffic;
                    //UserTraffic
                    AsyncStorage.setItem('Followers', responseJson.UserTraffic[0].Followers.length > 0 ? responseJson.UserTraffic[0].Followers.toString() : null);
                    AsyncStorage.setItem('UnFollowers', responseJson.UserTraffic[0].UnFollowers.length > 0 ? responseJson.UserTraffic[0].UnFollowers.toString() : null);
                    AsyncStorage.setItem('visitors', responseJson.UserTraffic[0].visitors > 0 ? responseJson.UserTraffic[0].visitors.toString() : 0);
                    //UserEngagement
                    AsyncStorage.setItem('LikeCount', responseJson.UserEngagement[0].LikeCount.length > 0 ? responseJson.UserEngagement[0].LikeCount.toString() : null);
                    AsyncStorage.setItem('CommentCount', responseJson.UserEngagement[0].CommentCount.length > 0 ? responseJson.UserEngagement[0].CommentCount.toString() : null);
                    AsyncStorage.setItem('SavedCount', responseJson.UserEngagement[0].SavedCount.length > 0 ? responseJson.UserEngagement[0].SavedCount.toString() : 0);
                    AsyncStorage.setItem('ShareCount', responseJson.UserEngagement[0].ShareCount.length > 0 ? responseJson.UserEngagement[0].ShareCount.toString() : 0);

                    let uEng = responseJson.UserEngagement
                    //  let UserTraffic = responseJson.UserTraffic.length > 0 && [uTr[0].Followers, uTr[0].UnFollowers, uTr[0].visitors]
                    let UserTraffic = responseJson.UserTraffic.length > 0 && [uTr[0].Followers.length, uTr[0].UnFollowers.length, uTr[0].visitors]
                    let UserEngagement = responseJson.UserEngagement.length > 0 && [uEng[0].LikeCount.length,
                    uEng[0].CommentCount.length, uEng[0].SavedCount.length, uEng[0].ShareCount.length]
                    let age = responseJson.Age;
                    var AgeArr = age.filter(a => a.Age);
                    console.log("21132", AgeArr)
                    AsyncStorage.setItem('ageRatio', AgeArr.toString())

                    var ageArray = age.map(({ Gender }) => ({ Sex: Gender }))
                    let ages = ageArray.map(r1 => r1.Sex)
                        , agesstr = ages.map(a1 => a1)
                    let ageFilter = agesstr.filter(e2 => e2 != null);
                    AsyncStorage.setItem('age', ageFilter.toString());
                    AsyncStorage.setItem('ageTotal', AgeArr.toString());

                    // console.log('agebjf',age.length> 0 ? age.filter(a => a.Age ) .toString() : 0)


                    let ageRange1 = responseJson.Age.length > 0 && age.filter(a => a.Age > 18 && a.Age < 27).length
                    let ageRange2 = responseJson.Age.length > 0 && age.filter(a => a.Age > 28 && a.Age < 37).length
                    let ageRange3 = responseJson.Age.length > 0 && age.filter(a => a.Age > 38 && a.Age < 47).length
                    let ageRange4 = responseJson.Age.length > 0 && age.filter(a => a.Age > 48 && a.Age < 57).length
                    let ageRange5 = responseJson.Age.length > 0 && age.filter(a => a.Age > 58 && a.Age < 67).length
                    let ageRange6 = responseJson.Age.length > 0 && age.filter(a => a.Age > 68 && a.Age < 77).length
                    let ageRange7 = responseJson.Age.length > 0 && age.filter(a => a.Age > 78 && a.Age < 87).length
                    let ageRange8 = responseJson.Age.length > 0 && age.filter(a => a.Age > 88 && a.Age < 97).length

                    let trafficAge = responseJson.UserEngagement.length > 0 && [ageRange1, ageRange2, ageRange3, ageRange4, ageRange5, ageRange6, ageRange7, ageRange8]
                    console.log("Age range", trafficAge);
                    let Region = responseJson.Region[0]
                    let Region1 = responseJson.Region[0].code
                    let Region2 = responseJson.Region[0].Country
                    console.log('Region1', Region2)


                    const resultx = [...Region2.reduce((mp, o) => {
                        if (!mp.has(o.Country)) mp.set(o.Country, { ...o, count: 0 });
                        mp.get(o.Country).count++;
                        return mp;
                    }, new Map).values()];

                    //Country duplicate splitted
                    var countryAerr = resultx.map(({ Country }) => ({ Regi1: Country }))
                    let regCountrydup = countryAerr.map(rCounrty => rCounrty.Regi1)
                        , RegionstrCountrydup = regCountrydup.map(a => a)
                    let regDuplicateCountry = RegionstrCountrydup.filter(e2Cou => e2Cou != null);
                    console.log(regDuplicateCountry)

                    //Country count duplicate splitted

                    var countryCount = resultx.map(({ count }) => ({ Regi: count }))
                    let regCountry1 = countryCount.map(r => r.Regi)
                        , RegionstrCountry1 = regCountry1.map(a1 => a1)
                    let regFilterDuplicateCountryCount = RegionstrCountry1.filter(e2Cou => e2Cou != null);
                    console.log(regFilterDuplicateCountryCount)


                    var countryAerr = Region2.map(({ Country }) => ({ Regi1: Country }))
                    let regCountry = countryAerr.map(rCounrty => rCounrty.Regi1)
                        , RegionstrCountry = regCountry.map(a => a)
                    let regFilterCountry = RegionstrCountry.filter(e2Cou => e2Cou != null);
                    console.log('regFilterCountry', regFilterCountry)
                    AsyncStorage.setItem('RegionCountry', regFilterCountry.toString());
                    var RegionArr = Region1.map(({ code }) => ({ Regi: code }))
                    let reg = RegionArr.map(r => r.Regi)
                        , Regionstr = reg.map(a => a)
                    let regFilter = Regionstr.filter(e2 => e2 != null);
                    AsyncStorage.setItem('RegionCode', regFilter.toString());
                   
                    this.setState({
                        UserTrafficData: UserTraffic,
                        UserEngagementData: UserEngagement,
                        ageData: trafficAge, regFilt: regFilter,
                        regDuplicateCountry:regDuplicateCountry,
                        regFilterDuplicateCountryCount:regFilterDuplicateCountryCount

                    })

                    const data = {
                        uTd: this.state.UserTrafficData,
                        uEngmt: this.state.UserEngagementData,
                        uAge: this.state.ageData,
                        age: age,
                        uReg: Region,regDuplicateCountry:regDuplicateCountry,
                        regFilterDuplicateCountryCount:regFilterDuplicateCountryCount

                    };
                    console.log('the pa', data);
                    this.props.navigation.navigate('ProfileAnalytics', { analytics: data })
                }
            })
            .catch((error) => {
            });
    };

    stars(count) {
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= count; i++) {
            stars.push((
                <Fontisto name="star" size={10}  color="#fe9102" />));
        }

        return (stars);
    }


    footPrints = async () => {
        const { headers } = serviceUrl;
        var userId = await AsyncStorage.getItem('userId');
        const url = serviceUrl.been_url + "/GetFootPrints";
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
                //console.log('called api resp',responseJson)
                if (responseJson.status == "True") {
                    this.setState({
                        footPrintCount: responseJson.FootprintCount,
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

    renderToolbarIconsView = () => {
        return (
            <View style={{ flexDirection: 'row',justifyContent:'center',alignSelf:'center',marginRight:20}}>

                <TouchableOpacity onPress={() => this.tagPost()}>
                    <Image style={{ width: 26, height: 26, marginRight: 17 }}
                        source={require('../../Assets/Images/notes.png')} />
                </TouchableOpacity>

                {this.state.businessProfile === 1 ?
                    <View style={[styles.topicons, { height: 21, width: 24,marginRight:17}]} >
                        <TouchableOpacity onPress={() => this.profileAnalytics()}>
                            <Image source={require(imagePath1 + 'bar-chart.png')} 
                           // resizeMode={'center'}
                                style={{ width: '100%', height: '100%' }} />
                        </TouchableOpacity></View> : null}

                <TouchableOpacity onPress={() => this.settings()}>
                    <Image style={{ width: 22, height: 26, marginRight: 15 }}
                        source={require('../../Assets/Images/setting.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.editProfile()}>
                    <Image source={require('../../Assets/Images/localProfile/user.png')} resizeMode={'stretch'}
                        style={{ width: 24, height: 22, marginRight: 5 }} />
                </TouchableOpacity>

            </View>
        )
    }

    badgesScreen() {
        debugger
        var data = {
            footprints: this.state.footPrintsCount,
            memoriesCount: this.state.memoriesCount,
            vlogCount: this.state.vlogCount
        }
        this.props.navigation.navigate('Badges', { data: data })
    }



    render() {
        const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
        var mapStyle = [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2fd2e1"
                    }
                ]
            },
            {
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2fd2e1"
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
                        "color": "#2fd2e1"
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
                        "color": "#2fd2e1"
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

        const config = { velocityThreshold: 0.3, directionalOffsetThreshold: 80 };
        const { newsFeddStoriesUrl } = serviceUrl;
        const { footPrintsCount, memoriesCount, vlogCount } = this.state;
        const badges = this.state.FootprintImaged.length + this.state.CountryImages.length + this.state.streakImages.length + this.state.MemorieImages.length + this.state.VlogImages.length;
        const badgeCount = isNaN(badges) ? 0 : badges;

        return (
            <View style={{ flex: 1, flexDirection: 'column',marginTop:0 ,backgroundColor:'#fff'}}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} userNameTitle={this.state.userName} rightMultiImgView={this.renderToolbarIconsView()} />
                <View style={{ height: hp(90), }}>

                    <View style={{ height: '45%' }}>
                        <View style={{ width: '100%', height: hp(45), marginBottom: 10 }} >
                            <View style={styles.container2}>
                                <View style={{ width: '75%', marginTop: '3%' }}>

                                    <View>
                                        {this.state.verifyProfile == "Approved" ? (
                                            <View>
                                                {this.state.profilePic == null ? (
                                                    <View style={{ width: '100%', height: '150%', marginLeft: 1, }}>
                                                        <ImageBackground style={[styles.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                            source={require(imagePath + 'profile.png')}>
                                                            {/* <Image source={require(imagePath1 + 'verify.png')} style={businessProfileStyle.verify} /> */}
                                                        </ImageBackground>
                                                        <Text style={[styles.newText12, { marginTop: 10, alignSelf: 'center', }]}>{this.state.originalName == "undefined" ? "" : this.state.originalName}</Text>
                                                        {/* <Text style={[styles.newText1, { fontFamily: Common_Color.fontMedium, alignSelf: 'center', marginTop: '7%' }]}>{this.state.originalName}</Text> */}
                                                        <View style={{ height: 520, marginTop: '5%', marginLeft: 10 }}>
                                                            <View style={{ height: 85, marginTop: 1, width: "95%" }}>
                                                                <Text style={[styles.newText1, {}]}>{this.state.bio == "undefined" ? "" : this.state.bio}</Text>
                                                            </View>
                                                            <View style={{ marginTop: 3, height: 50, marginRight: 200 }}>
                                                                {this.state.businessProfile === 1 ?

                                                                    <View style={[styles.editProfile, { height: hp(6), marginLeft: '1%', width: wp('70%'), borderColor: 'transparent', marginTop: 1, justifyContent: 'center', alignItems: 'center' }]}>
                                                                        <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                                                            <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 210, height: '95%', justifyContent: 'center', alignItems: 'center' }} borderRadius={10}>
                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', }]} >Promote</Text>
                                                                            </ImageBackground>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    : null}
                                                            </View>
                                                        </View>
                                                    </View>)
                                                    : (
                                                        <View style={{ width: '100%', height: '150%', }}>
                                                            <ImageBackground style={[styles.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                                source={{ uri: serviceUrl.profilePic + this.state.profilePic }}>
                                                                <Image source={require(imagePath1 + 'TickSmall.png')} style={[styles.verify, { marginLeft: wp('18%') }]} />
                                                            </ImageBackground>
                                                            <Text style={[styles.newText12, { marginTop: 10, alignSelf: 'center' }]}>{this.state.originalName == "undefined" ? "" : this.state.originalName}</Text>
                                                            {/* <Text style={[styles.newText1, { fontFamily: Common_Color.fontMedium, alignSelf: 'center', marginTop: '7%' }]}>{this.state.originalName}</Text> */}
                                                            <View style={{ height: 520, marginTop: '5%', marginLeft: '2%', }}>
                                                                <View style={{ height: 85, marginTop: 1, width: "100%" }}>
                                                                    <Text style={[styles.newText1, {}]}>{this.state.bio == "undefined" ? "" : this.state.bio}</Text>
                                                                </View>
                                                                <View style={{ marginTop: 1, height: 50, marginRight: 0, marginLeft: -0 }}>
                                                                    {this.state.businessProfile === 1 ?

                                                                        <View style={[styles.editProfile, { marginLeft: '1%', width: wp('60%'), borderColor: 'transparent', marginTop: '1%', }]}>
                                                                            <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                                                                <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 200, height: '100%', justifyContent: 'center' }} borderRadius={10}>
                                                                                    <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', }]} >Promote</Text>
                                                                                </ImageBackground>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                        : null}
                                                                </View>

                                                            </View>
                                                        </View>
                                                    )}
                                            </View>
                                        ) :
                                            (<View>
                                                {this.state.profilePic == null ?
                                                    <View style={{ width: '100%', height: '150%', }}>
                                                        <Image style={[styles.profile, { width: 100, height: 100,alignSelf:'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                            source={require(imagePath + 'profile.png')}></Image>
                                                        <Text style={[styles.newText12, { marginTop: 10, alignSelf: 'center', }]}>{this.state.originalName == "undefined" ? "" : this.state.originalName}</Text>
                                                        {/* <Text style={[styles.newText1, { fontFamily: Common_Color.fontMedium, alignSelf: 'center', marginTop: '7%' }]}>{this.state.originalName}</Text> */}
                                                        <View style={{ height: 520, marginTop: '5%', marginLeft: 10 }}>
                                                            <View style={{ height: 85, marginTop: 1, width: "95%" }}>
                                                                <Text style={[styles.newText1, {}]}>{this.state.bio == "undefined" ? "" : this.state.bio}</Text>
                                                            </View>
                                                            <View style={{ marginTop: 1, height: 50, marginRight: 0, marginLeft: -0 }}>
                                                                {this.state.businessProfile === 1 ?

                                                                    <View style={[styles.editProfile, { marginLeft: '1%', width: wp('60%'), borderColor: 'transparent', marginTop: '1%', }]}>
                                                                        <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                                                            <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 200, height: '100%', justifyContent: 'center' }} borderRadius={10}>
                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', }]} >Promote</Text>
                                                                            </ImageBackground>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    : null}
                                                            </View>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={{ width: '100%', height: '150%', }}>
                                                        <Image style={[styles.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                            source={{ uri: serviceUrl.profilePic + this.state.profilePic }} />
                                                        <Text style={[styles.newText12, { marginTop: 10, alignSelf: 'center', }]}>{this.state.originalName == "undefined" ? "" : this.state.originalName}</Text>
                                                        {/* <Text style={[styles.newText1, { fontFamily: Common_Color.fontMedium, alignSelf: 'center', marginTop: '7%' }]}>{this.state.originalName}</Text> */}
                                                        <View style={{ height: 520, marginTop: '5%', marginLeft: 10 }}>
                                                            <View style={{ height: 85, marginTop: 1, width: "95%" }}>
                                                                <Text style={[styles.newText1, {}]}>{this.state.bio == "undefined" ? "" : this.state.bio}</Text>
                                                            </View>
                                                            <View style={{ marginTop: 1, height: 50, marginRight: 0, marginLeft: -0 }}>
                                                                {this.state.businessProfile === 1 ?

                                                                    <View style={[styles.editProfile, { marginLeft: '1%', width: wp('60%'), borderColor: 'transparent', marginTop: '1%', }]}>
                                                                        <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                                                            <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 200, height: '100%', justifyContent: 'center' }} borderRadius={10}>
                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', }]} >Promote</Text>
                                                                            </ImageBackground>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    : null}
                                                            </View>
                                                        </View>
                                                    </View>
                                                }
                                            </View>
                                            )}

                                    </View>



                                </View>


                                {/* Followers */}

                                <View style={{ marginLeft: '2%', height: '100%', marginTop: -10 }}>
                                    {this.state.folowersCount > 0 ?
                                        <TouchableOpacity onPress={() => this.follwers()}>
                                            <View>
                                                <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', }}>
                                                    <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                        resizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                    </Image>
                                                    <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#010101', marginTop: 10, fontSize: Searchresult.FontSize,  }}> {this.state.folowersCount}  </Text>
                                                        <Text style={{ color: '#010101', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Follower </Text>
                                                    </View>
                                                </View>
                                            </View></TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => this.follwers()}>
                                            <View>
                                                <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', }}>
                                                    <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                        resizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                    </Image>
                                                    <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#010101', marginTop: 10, fontSize: Searchresult.FontSize, }}> 0  </Text>
                                                        <Text style={{ color: '#010101', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Follower </Text>
                                                    </View>
                                                </View>
                                            </View></TouchableOpacity>
                                    }

                                    {/* Footprints */}

                                    <View>
                                        {this.state.footPrintCount > 0 ?
                                            <TouchableOpacity onPress={() => this.footPrint()}>
                                                <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '2%', }}>
                                                    <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                        resizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                    </Image>
                                                    <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#010101', marginTop: 10, fontSize: Searchresult.FontSize,  }}> {this.state.footPrintCount}  </Text>
                                                        <Text style={{ color: '#010101', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Footprints </Text>
                                                    </View>
                                                </View></TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => this.footPrint()}>
                                                <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '2%', }}>
                                                    <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                        resizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                    </Image>
                                                    <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#010101', marginTop: 10, fontSize: Searchresult.FontSize,  }}> 0  </Text>
                                                        <Text style={{ color: '#010101', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Footprints </Text>
                                                    </View>
                                                </View></TouchableOpacity>
                                        }
                                    </View>



                                    {/* Badges */}

                                    <View>
                                        {badgeCount > 0 ?
                                            <TouchableOpacity onPress={() => this.badgesScreen()}>
                                                <View style={{ width: 75, height: 80, overflow: 'hidden', marginRight: '10%', marginTop: '2%', }}>
                                                    <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                                        source={require('../../Assets/Images/BussinesIcons/Floral-grey.png')}>
                                                    </Image>
                                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: Searchresult.FontSize, color: '#010101', marginTop: 10, }}> {badgeCount}  </Text>
                                                        <Text style={{ color: '#010101', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, color: '#010101', }}> Badges </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => this.badgesScreen()}>
                                                <View style={{ width: 75, height: 80, overflow: 'hidden', marginRight: '10%', marginTop: '2%', }}>
                                                    <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                                        source={require('../../Assets/Images/BussinesIcons/Floral-grey.png')}>
                                                    </Image>
                                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#010101', marginTop: 10, fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font }}> 0  </Text>
                                                        <Text style={{ color: '#010101', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, color: '#010101', }}>  Badges </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        }

                                    </View>


                                    <View style={{ alignContent: 'center' }}>
                                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('LocalProfileFullView') }}>
                                            <Image style={{ width: 54, height: 54, marginTop: '5%', marginLeft: '9%' }} source={require(imagePath + 'local_profile.png')}></Image>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: "15%" }}>
                                        {this.stars(rating)}
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>




                    <View style={{ height: hp(5) }} />

                    <View style={{ width: '100%', height: hp(36), marginTop: '3%' }}>
                        <MapView
                            ref={(ref) => { this.mapRef = ref }}
                            style={styles.map}
                            followUserLocation={true}
                            zoomEnabled={true}
                            showsUserLocation={true}
                            showsCompass={true}
                            customMapStyle={mapStyle}
                            moveOnMarkerPress={true}    >
                            {this.state.markers.map((marker, index) => (
                                marker.coordinates.latitude != 0 ?
                                    <MapView.Marker key={index} coordinate={marker.coordinates}>

                                        <View style={{
                                            width: 100, height: 100, justifyContent: 'center', alignItems: 'center',
                                        }}>

                                            <ImageBackground source={require('../../Assets/Images/loc_marker_unseen.png')} style={{ width: 41, height: 45, justifyContent: 'center' }} resizeMode={'stretch'}
                                            >
                                                <Image source={{ uri: newsFeddStoriesUrl + marker.postImg.split(',')[0] }} style={{
                                                    height: 35, width: 35, borderRadius: 35, marginLeft: '7%', marginBottom: '12%'
                                                }} />
                                            </ImageBackground >


                                            {/* require('../../Assets/Images/assam.jpg') */}
                                        </View>
                                    </MapView.Marker>
                                    :
                                    null
                            ))}
                        </MapView>
                    </View>
                    {/* </View> */}




                </View>

                <FooterTabBar {...this.props} tab={0} />
            </View >
        )
    }

}

