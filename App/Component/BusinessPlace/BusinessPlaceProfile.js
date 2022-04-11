import React, { Component } from 'react';
import {
    View, Text, StatusBar, Image, ScrollView, ImageBackground, TouchableOpacity,
    StyleSheet, Dimensions, ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styles from './styles/placeProfileStyle'
import { Tabs, Tab, TabHeading } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import { deviceHeight, deviceWidth, getTime } from '../_utils/CommonUtils';
import GetData from '../BusinessPlace/BusinessPlaceMemories';
import TaggedPostOtherUser from '../BusinessPlace/TaggedPostOtherUser'
import MapView, { PROVIDER_GOOGLE, ProviderPropType } from 'react-native-maps';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Gplaces from '../CustomComponent/googlePlaces'
import { Toolbar } from '../commoncomponent'
import { postServiceP01 } from '../_services';
import { getPixels } from '../_utils/CommonUtils';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { toastMsg1, toastMsg } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader'

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 12.9716;
const LONGITUDE = 77.5946;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

export default class BusinessPlaceProfile extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            originalName: '',
            id: '',
            name: '',
            userName: '',
            website: '',
            bio: '',
            email: '',
            profilePic: '',
            footPrintCount: 0,
            folowersCount: 0,
            followingCount: 0,
            visitsCount: 0,
            dataRequest:'',
            linkPlaceName:'',
            footPrintsData: [],
            markers: [],
            businessProfile: 0,
            getLocation: '',
            Consolidate_Like: 0,
            GoldList: 0,
            Visit_Count: 0,
            UserTrafficData: [],
            result: [],
            regDuplicateCountry: [],
            regFilterDuplicateCountryCount: [],
            UserEngagementData: [],
            linkedData : [],
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            poi: null,
            a: {
                latitude: 0,
                longitude: 0,
            },
            b: {
                latitude: LATITUDE - SPACE,
                longitude: LONGITUDE - SPACE,
            },
            MARKERS: [
                {
                    latitude: 0,
                    longitude: 0

                },


            ],
            placesDetails: {},
            loader : false

        }
    }

    UNSAFE_componentWillMount() {
        this.userProfile();
    }

    componentDidMount = () => {

        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.userProfile();
                let places = this.props.route.params?.datas

                console.log('places get from gplacess', places);
                if (places != undefined) {
                    // this.fitAllMarkers()
                    this.reqToAdmin(places)
                    let coords = places.coords;
                    console.log('the cords', coords);
                    this.setState({
                        placesDetails: places, a: places.coords,
                        MARKERS: [{
                            latitude: places.coords.latitude,
                            longitude: places.coords.longitude
                        }]
                    }, () => { this.onLayout() })
                }

            }
        );

    };

    onLayout = () => {

        if (this.state.MARKERS[0].latitude != 0)
            //  setTimeout( () => { 
            this.map.fitToCoordinates(
                this.state.MARKERS,
                {
                    edgePadding:
                    {
                        right: getPixels(50),
                        left: getPixels(50),
                        top: getPixels(50),
                        bottom: getPixels(50),
                    },
                    animated: true,
                });
        //  }, 500 ); }
    }

    reqToAdmin = async ({ place_id, locName }) => {

        const apiname = 'PlaceReqToAdmin';
        const data = {
            userId: await AsyncStorage.getItem('userId'),
            place_id: place_id,
            PlaceName: locName
        }
        console.log('data', data);
        let subscribe = true;
        postServiceP01(apiname, data).then(cb => {
            console.log('the resp', cb);
            if (subscribe)
                if (cb.status == 'True') {
                    toastMsg('success', "Request has been sent to Admin.we\'ll let you know after admin verified")
                    //ToastAndroid.show('Request has been sent to Admin.we\'ll let you know after admin verified', ToastAndroid.LONG);
                }
                else {
                    toastMsg1('danger', "something went wrong.Request not sent")
                    //ToastAndroid.show('something went wrong.Request not sent', ToastAndroid.LONG)
                }
        }).catch(err => {
            console.log(err);
            toastMsg1('danger', "something went wrong.Request not sent")
            //ToastAndroid.show('something went wrong.Request not sent', ToastAndroid.LONG)
        });

        /**
         * @Cancel_Async_Subscription
         * @To_Stop_memory_leak_for_app
         */
        return () => (subscribe = false);
    }


    createMarker = (modifier, state) => {
        console.log('modifier', state)
        const { a } = state;
        // if(a.latitude != 0)
        return {
            latitude: a.latitude - SPACE * modifier,
            longitude: a.longitude - SPACE * modifier,
        };
    }


    navigateToplace = (e) => {
        this.props.navigation.navigate("GplacesBPlaceProfile");
    }

    promote() {
        this.props.navigation.navigate("Promote");
    }
    editProfile() {
        this.props.navigation.navigate("Edit_Profile");
    }
    stories() {
        const {linkedData} = this.state;
        // console.log('the linked data',linkedData);
        const placeId = linkedData.length ? linkedData[0].Place_id : null;
        this.props.navigation.navigate("ExploreStories",{placeId : placeId});
    }
    followers() {
        var data = {
            followerCount: this.state.folowersCount,
            followingCount: this.state.followingCount
        }
        this.props.navigation.navigate('FollowTab', { data: data });
    }

    likesView() {
        // console.log('the datas are in NF',data);
        // var data = {
        //   data: data.PostId,
        //   screen: "Likes",
        //   likesCount: data.LikeCount
        // }
        // this.props.navigation.navigate('LikesView', { data: data });
      }

    userProfile = async () => {
        var data = {
            userId: await AsyncStorage.getItem('userId'),
            place_id: await AsyncStorage.getItem('placeID')
        };

        console.log('the place datas',data);
        this.setState({
            userName: await AsyncStorage.getItem('name'),
            loader : true
        })
        const url = serviceUrl.been_url1 + '/UserProfile';
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('business place resp', responseJson)
                this.setState({loader:false})
                if (responseJson.status == "True") {
                    let data = responseJson.result[0].UserDetails[0];
                    console.log('the sub name',data.name);
                    this.setState({
                        dataRequest: typeof responseJson.LinkedData !== undefined && responseJson.LinkedData.length > 0 ? responseJson.LinkedData[0].ReqStatus : 0,
                        linkedData : typeof responseJson.LinkedData !== undefined && responseJson.LinkedData.length > 0 ? responseJson.LinkedData : [],
                        folowersCount: responseJson.result[0].FollowersCount,
                        followingCount: responseJson.result[0].FollowingsCount,
                        footPrintCount: responseJson.result[0].FootprintsCount,
                        businessProfile: responseJson.result[0].UserDetails[0].ProfileType,
                        userName: data.UserName,
                        originalName: data.name ? data.name : '',
                        profilePic: data.ProfilePic,
                        website: data.Website === 'null' || undefined ? '' : data.Website,
                        bio: data.Bio === 'null' || undefined ? '' : data.Bio,
                        Consolidate_Like: responseJson.Consolidate_Like != undefined ? responseJson.Consolidate_Like : 0,
                        GoldList: responseJson.GoldList != undefined ? responseJson.GoldList : [],
                        goldListName: responseJson.GoldList != undefined && responseJson.GoldList.length > 0 ? responseJson.GoldList[0].UserName : null,
                        goldListImg: responseJson.GoldList != undefined && responseJson.GoldList.length > 0 ? responseJson.GoldList[0].ProfilePic : null,
                        Visit_Count: responseJson.Visit_Count != undefined ? responseJson.Visit_Count : 0,
                        
                    })
                }
            })
            .catch((error) => {
                this.setState({loader:false})
                console.log(error);
            });
    };

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
                    AsyncStorage.setItem('visitors', responseJson.UserTraffic[0].visitors > 0 ? responseJson.UserTraffic[0].visitors.toString(): 0);
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
                    //  var Region2Arr = Region2.map(({ Country }) => ({ Country : Country }))
                    //  let reg2 = Region2Arr.map(r => r.Country)
                    //      , Regionstr2 = reg2.map(a2 => a2)
                    //  let regFilter2 = Regionstr2.filter(e > e != null);
                    // //  AsyncStorage.setItem('RegionCountry',regFilter2.toString());
                    //   console.log('regFilter2',Region2Arr)
                    this.setState({

                        UserTrafficData: UserTraffic,
                        UserEngagementData: UserEngagement,
                        ageData: trafficAge, regFilt: regFilter,
                        regDuplicateCountry: regDuplicateCountry,
                        regFilterDuplicateCountryCount: regFilterDuplicateCountryCount

                    })



                    // const { UserTrafficData, UserEngagementData, ageData } = this.state;
                    const data = {
                        uTd: this.state.UserTrafficData,
                        uEngmt: this.state.UserEngagementData,
                        uAge: this.state.ageData,
                        age: age,
                        uReg: Region, regDuplicateCountry: regDuplicateCountry,
                        regFilterDuplicateCountryCount: regFilterDuplicateCountryCount

                    };
                    console.log('the pa', data);
                    this.props.navigation.navigate('ProfileAnalytics', { analytics: data })
                }
            })
            .catch((error) => {
            });
    };

    renderToolbarIconsView = () => {
        return (
            <View style={{ flexDirection: 'row',justifyContent:'center',alignSelf:'center',marginRight:8,marginTop:5}}>
                <View style={{ height: 20, width: 19, marginRight: 17 }} >
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, right: 5, left: 5 }} onPress={() => this.profileAnalytics()}>
                        <Image source={require('../../Assets/Images/BussinesIcons/bar-chart.png')} 
                        //resizeMode={'center'}
                            style={{ width: '100%', height: '100%' }} />
                    </TouchableOpacity>
                </View>

                <View style={{ width: 22, height: 25, marginRight: 15 }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('SettingsScreen') }}>
                        <Image style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} source={require('../../Assets/Images/setting.png')}></Image></TouchableOpacity>
                </View>

                <View style={{ width: 22, height: 22, marginRight: 5, marginTop: '0%' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Edit_Profile') }} >
                        <Image source={require('../../Assets/Images/localProfile/user.png')} style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} /></TouchableOpacity>
                </View>
            </View>
        )
    }

    GLList() {
        // debugger;
        var data = {
            GoldList: this.state.GoldList,
            GoldListCount :this.state.GoldList.length ? this.state.GoldList.length : 0,
            screen: "GLListView"
        }
        // alert(JSON.stringify(data))
        // console.log('the gl list',data);
        this.props.navigation.navigate('GLListView', { data: data })
    }

    title() {
        return <View style={{ backgroundColor: '#fff', flexDirection: 'column' }}>
            <Image style={{ width: 28, height: 28 }} source={require('../../Assets/Images/BussinesIcons/cameraMemoris.png')} />
        </View>
    }

    titleFollwing() {
        return <View style={{ backgroundColor: '#fff', flexDirection: 'column' }}>
            <Image source={require('../../Assets/Images/BussinesIcons/tagpost.png')} style={{ width: 28, height: 25 }} resizeMode={'stretch'} />
        </View>
    }

    render() {
        // console.log('the u name render',this.state.userName);
        console.log('the og name',this.state.originalName);
        const imagePath = '../../Assets/Images/BussinesIcons/';
        return (
            <View style={{ flex: 1, marginTop: 0 }}>
           
                <Toolbar {...this.props} userNameTitle={this.state.userName} rightMultiImgView={this.renderToolbarIconsView()} />
                <View style={{ height: deviceHeight , }}>
                    <ScrollView>


                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={styles.text2}>
                                <TouchableOpacity onPress={() => this.followers()}>
                                    <Text onPress={() => this.followers()} style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}>Follower</Text>
                                    <Text onPress={() => this.followers()} style={{ textAlign: 'center', fontSize: Searchresult.FontSize,  }}>{this.state.folowersCount}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: 100, height: 100, justifyContent: 'space-between', marginTop: wp('5%'), borderRadius: 50, overflow: 'hidden' }}>
                                {this.state.profilePic != null || this.state.profilePic != undefined || this.state.profilePic != "null" ?
                                    // <Image style={[businessProfileStyle.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                    // source={{ uri: serviceUrl.profilePic + this.state.profilePic }} />
                                    <ImageBackground source={{ uri: serviceUrl.profilePic + this.state.profilePic }} resizeMode={'stretch'} style={{ height: '100%', width: '100%', }}>
                                    </ImageBackground>
                                    :
                                    <ImageBackground source={require('../../Assets/Images/profile.png')} resizeMode={'stretch'} style={{ height: '100%', width: '100%', backgroundColor: 'grey' }}>
                                    </ImageBackground>}
                            </View>
                            <View style={styles.text3}>
                                <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, color: '#010101', }}>Visits</Text>
                                <Text style={{ fontSize: Searchresult.FontSize,  color: '#010101', }}>{this.state.Visit_Count}</Text>
                            </View>
                        </View>
                        <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-around', }}>
                            <View style={{ width: wp('15%') }} />
                            <View style={{ width: '1%', justifyContent: 'center', }}>
                                <TouchableOpacity onPress={() => this.likesView()}>
                                    <Image source={require('../../Assets/Images/new/LIKE-2.png')} style={{ width: wp('10%'), height: hp('4%'), marginTop: wp('5%'), }}>
                                    </Image>
                                    <Text style={{ textAlign: 'center', width: wp('10%'), height: hp('5%'), marginTop: 1, marginLeft:0,  }}>{this.state.Consolidate_Like}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '6%', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.GLList()}>
                                    <Image source={require(imagePath + 'goldicon.png')} style={{ width: wp('7%'), height: hp('4%'), marginTop: wp('5%'), marginLeft: wp('2%') }}>
                                    </Image>
                                    <Text style={{ textAlign: 'center', width: wp('10%'), height: hp('5%'), marginTop: 8,  }}>
                                        {this.state.GoldList.length ? this.state.GoldList.length : 0}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: wp('15%') }} />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', marginLeft: wp('5%') }}>
                            <Text style={{ fontSize: Username.FontSize, fontFamily: Username.fontMedium, }}>{this.state.originalName}</Text>
                            <Text style={{ fontSize: Description.FontSize, fontFamily: Description.Font, textAlign: 'left', marginTop: 5, marginBottom: 5, }}>
                                {this.state.bio}
                            </Text>
                            {/* <Text style={{ color: '#010101', fontSize: 14, fontFamily: Common_Color.fontMedium, textAlign: 'left', marginTop: 5, marginBottom: 5, }}>{this.state.website}</Text> */}
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', }}>

                            <TouchableOpacity onPress={() => this.promote()}>
                                <ImageBackground style={{ alignItems: 'center', justifyContent: 'center', width: wp('25%'), marginTop: wp('4%'), height: 30 }} source={require('../../Assets/Images/button.png')} borderRadius={10}>
                                    <Text onPress={() => this.promote()} style={{ color: '#fff', fontFamily: Common_Color.fontBold }}>Promote</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.stories()}>
                                <View style={{
                                    backgroundColor: 'white', alignItems: 'center',
                                    justifyContent: 'center', borderRadius: 10, width: wp('25%'), height: 30,
                                    marginTop: wp('4%'), borderColor: '#448AFF', borderWidth: 1
                                }}>
                                    <Text style={{ color: '#448AFF', fontFamily: Common_Color.fontBold }}>Stories</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* map view */}

                        <View style={styles.mapView}>
                       
                            <MapView
                                ref={el => (this.map = el)}
                                style={stylesMap.map}
                                followUserLocation={true}
                                zoomEnabled={true}
                                showsUserLocation={true}
                                showsCompass={false}
                                moveOnMarkerPress={true}
                                onLayout={this.onLayout}
                                // onLayout  = {() => this.mapView.fitToCoordinates(this.state.MARKERS, {
                                //     edgePadding: DEFAULT_PADDING,
                                //     animated: true,
                                // }) }
                                pitchEnabled={true} rotateEnabled={false} scrollEnabled={true}
                            >
                                {/* {this.state.a.latitude != 0 ? */}
                                {/* <Marker /> */}
                                {this.state.a.latitude != 0 ?

                                    <MapView.Marker coordinate={this.state.a}

                                    >

                                        <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', }}>
                                            <ImageBackground source={require('../../Assets/Images/loc_marker_unseen.png')} style={{ width: 40, height: 40, justifyContent: 'center' }} 
                                           resizeMode={'center'}
                                             >
                                            </ImageBackground >
                                        </View>
                                    </MapView.Marker>
                                    : null}

                            </MapView>

                            <View style={{top: 0, bottom: 0, left: 0, right: 0, position: 'absolute', justifyContent: 'center',alignItems: 'center',
                                backgroundColor:'#00000080' }}>
                                {this.state.dataRequest == "Approved" ?
                                    <Text style={{width:'100%',textAlign:'center',padding:10,color:'#fff'}}  onPress={e => { this.navigateToplace(e) }} >Linked </Text> :
                                    this.state.dataRequest == "Send" ?
                                        <Text style={{width:'100%',textAlign:'center',padding:10,color:'#fff'}}  onPress={e => { this.navigateToplace(e) }}  > Requested</Text> :
                                        this.state.dataRequest == "0" ?
                                            <Text style={{width:'100%',textAlign:'center',padding:10,color:'#fff'}} 
                                                onPress={e => { this.navigateToplace(e) }}>Request to Link</Text> :
                                            null
                                }
                            </View>
                        </View>

                        <Tabs tabBarUnderlineStyle={{ backgroundColor: "#dd374d", }}
                        tabContainerStyle={{elevation: 0,}}
                            onChangeTab={this.onchangeTabEvents}  >
                            <Tab heading={this.title()}
                                tabStyle={{ backgroundColor: "#FFF", }}
                                activeTabStyle={{ backgroundColor: "#FFF" }}
                                textStyle={{ color: "#000000", textAlign: "center", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                                inactiveTextStyle={{ color: "#000000", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                                activeTextStyle={{ color: "#dd374d", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                            >
                                <GetData navigation={this.props.navigation} />
                            </Tab>

                            <Tab heading={this.titleFollwing()}
                                tabStyle={{ backgroundColor: "#FFF", }}
                                activeTabStyle={{ backgroundColor: "#FFF" }}
                                textStyle={{ color: "#000000", textAlign: "center", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                                inactiveTextStyle={{ color: "#000000", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                                activeTextStyle={{ color: "#dd374d", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                            >
                                <TaggedPostOtherUser navigation={this.props.navigation} />
                            </Tab>

                        </Tabs>


                    </ScrollView>
                </View>

                {this.state.loader && (
                    <View style={{
                        height,
                        position: 'absolute',
                        backgroundColor: 'rgba(255,255,255,.3)',
                        width,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Loader />
                    </View>
                )}
                
                
            </View>
        )

    }
}

BusinessPlaceProfile.propTypes = {
    provider: ProviderPropType,
};



const stylesMap = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff"
    },
    icon1: {
        width: 18, height: 18, borderRadius: 5
    },
    flyit: { color: '#3b9fe8', fontFamily: Common_Color.fontBold, fontSize: 20, textAlign: 'center' },


})



