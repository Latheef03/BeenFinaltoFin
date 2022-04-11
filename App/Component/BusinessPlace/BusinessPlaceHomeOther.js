import React, { Component } from 'react';
import { View, Text, StatusBar, TextInput, ToastAndroid, Image, ScrollView, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import ProfileFullView from '../LocalProfile/styles/profileFullView'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styles from './styles/placeHome'
import { postServiceP01 } from '../_services';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import { Common_Color, Searchresult, Username, profilename } from '../../Assets/Colors'
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const API_KEY = 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20';
const { profilePic, newsFeddStoriesUrl } = serviceUrl;
import Modal from "react-native-modal";
import Common_Style from '../../Assets/Styles/Common_Style'
import LinearGradient from "react-native-linear-gradient";
import { Toolbar } from '../commoncomponent'
var placeidNull = false, noNearBy = false;
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import Video from "react-native-video";
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { invalidText } from '../_utils/CommonUtils';

export default class BusinessPlaceHomeOther extends Component {

    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            placeName: '',
            userId: '',
            Country: '',
            isModalOpen: null,
            PostImage: '',
            goldListName: '',
            goldListImg: '',
            goldListDesc: '',
            placeidNull: false,
            noNearBy: false,
            coords: {},
            userProPic: '',
            google_places_data: [],
            G_Ptoken: '',
            place_id: '',
            topUsersData: [],
            recentUSersData: [],
            nearbyUserData: [],
            //Below recent
            Default_Rating: 0,
            userReviewALready: false,
            getStarRate: 4,
            overallReview: 0,
            ratingsOverall: 0,
            isSaved: 0,
            //To set the default Star Selected
            Max_Rating: 5,
            getReviewList: [],
            ownUserRating: [],
            getPlannerData: '',
            permission_Value: '',
            userReviews: '',
            isModalVisible1: '',
            isModalVisible2: '',
            isModalVisible3: '',
            isOpenBottomModal: false,
            GoldList: "",
            getMemberResponse: '', GlMem: false,
            save: ''
        }
    }

    UNSAFE_componentWillMount() {

        const Comments = this.props.route.params.data
        let getcoords = typeof Comments.coords != 'undefined' && Comments.coords != null
            && Comments.coords != '' ? JSON.parse(Comments.coords) : { "latitude": 0, "longitude": 0 };

        this.setState({
            placeName: Comments.Location != null || undefined ? Comments.Location : Comments.Place_Name,
            userId: Comments.userId != undefined ? Comments.userId : "",
            Country: Comments.Country,
            PostImage: Comments.Image != undefined ? Comments.Image.split(',') : "",
            coords: getcoords,
            place_id: Comments.place_id != null || undefined ? Comments.place_id : Comments.Place_id,
            userProPic: Comments.UserProfilePic != null || undefined ? Comments.UserProfilePic : "",
            Postid: Comments.PostId || Comments.Postid
        })

        if (getcoords.latitude != 0 && getcoords.latitude != null) {
            this.getNearByLocation(getcoords);
            this.setState({ noNearBy: false, placeidNull: false })
        } else {
            this.setState({ noNearBy: true, placeidNull: true })
        }
    }



    getNearByLocation = (getcoords) => {
        const { placeName } = this.state;
        if (getcoords == null || getcoords.latitude == null) {
            return;
        }
        let lat = getcoords.latitude;
        let lng = getcoords.longitude;
        const url = `${GOOGLE_PLACES_URL}?location=${lat},${lng}&radius=50000&key=${API_KEY}`;
        console.log('full url', url);
        return fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "OK") {
                    this.setState({
                        google_places_data: responseJson.results,
                        G_Ptoken: responseJson.next_page_token
                    })
                    this.topRecentData(responseJson.results)
                }
                console.log('google api responses', responseJson);
            })
            .catch(function (error) {
                console.log("Error from place", error)
                //toastMsg('danger', 'Sorry..Something network error.please try again once.')
            });
    }


    async topRecentData(places) {
        // debugger;
        const { place_id, placeName } = this.state;
        let nearby = places.map(s => s.place_id);
        this.setState({ noNearBy: false, placeidNull: false, })
        let apiname = 'RecentAndTopBusinessPlace';
        let data = { Location: placeName, place_id: place_id, PlaceIdNearBy: nearby, Userid: await AsyncStorage.getItem('userId'), }
        console.log('google places data for check', data)
        postServiceP01(apiname, data)
            .then((responseJson) => {
                this.setState({ GlMem: false })
                console.log("Response for review checking", responseJson);
                // AsyncStorage.setItem("'OtherUserIdPlanner",responseJson.PlannerData[0]._id);
                if (responseJson.status == "True") {
                    this.setState({
                        topUsersData: responseJson.Recent,
                        recentUSersData: responseJson.Top,
                        nearbyUserData: responseJson.NearBy,
                        GoldList: responseJson.GoldList,
                        goldListName: responseJson.GoldList[0].UserName,
                        goldListImg: responseJson.GoldList[0].ProfilePic,
                        goldListDesc: responseJson?.BPDescription[0]?.Description,
                        userReviewALready: responseJson.Send == "True" ? true : false,
                        getReviewList: responseJson.Reviews,
                        isSaved: responseJson.savedplace,
                        getPlannerData: typeof responseJson.PlannerData !== undefined && responseJson.PlannerData.length > 0 ? responseJson.PlannerData[0]._id : 0,
                        getMemberResponse: typeof responseJson.PlannerData !== undefined && responseJson.PlannerData.length > 0 ? responseJson.PlannerData[0].MemberRes : this.state.GlMem,
                        // getMemberResponse: typeof responseJson.PlannerData !== undefined && responseJson.PlannerData.length >0 ? responseJson.PlannerData[0].MemberRes : 0,
                        ownUserRating: typeof responseJson.UserReviews !== undefined && responseJson.UserReviews.length > 0 ? responseJson.UserReviews[0].Ratings : 0,
                        overallReview: typeof responseJson.Avgratings !== undefined && responseJson.Avgratings.length > 0 ? Math.floor(responseJson.Avgratings[0].avgRate) : 0,
                        ratingsOverall: typeof responseJson.Avgratings !== undefined && responseJson.Avgratings.length > 0 ? responseJson.Avgratings[0].Reviews : 0
                    })

                    if (responseJson.Recent.length == 0) { this.setState({ placeidNull: true }) }
                    if (responseJson.Top.length == 0) { this.setState({ placeidNull: true }) }
                    if (responseJson.NearBy.length == 0) { this.setState({ noNearBy: true }) }
                    //211

                } else {
                }
            }).catch(err => {
                console.log('video not defined', err);
            })
    }

    GLList() {
        // debugger;
        var data = {
            GoldList: this.state.GoldList,
            GoldListCount: this.state.GoldList.length,
            screen: "GLListView"
        }
        console.log("Gold List data", data);
        this.props.navigation.navigate('GLListView', { data: data })
    }


    planner() {
        debugger
        if (this.state.getPlannerData != 0) {

            AsyncStorage.setItem('OtherUserIdPlanner', this.state.getPlannerData);
            console.log("planner of group id for business place", this.state.getMemberResponse)

            if (this.state.getMemberResponse === true) {
                this.props.navigation.navigate('Open')
            }
            else if (this.state.getMemberResponse === undefined) {
                this.props.navigation.navigate('NonMemOpen')
            }

        }
        else {
            toastMsg1('danger', "No Planner available in this location")
        }
    }

    isTopNoData = () => {
        const { placeidNull } = this.state;
        if (placeidNull) {
            return (
                <View style={{
                    top: 0, bottom: 0, left: 0, right: 0, position: 'absolute',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={{ color: '#4c4c4c', fontSize: 18 }}>No top users yet.</Text>
                </View>
            )
        }
    }

    isRecentNoData = () => {
        const { placeidNull } = this.state;
        if (placeidNull) {
            return (
                <View style={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.headerText}>No recent users yet.</Text>
                </View>
            )
        }
    }

    isNearByData = () => {
        const { noNearBy } = this.state;
        if (noNearBy) {
            return (
                <View style={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...styles.text, color: '#000', fontFamily: Common_Color.fontLight }}>No near by places yet.</Text>
                </View>
            )
        }
    }

    openModal(item) {
        this.setState({
            Otheruserid: item.Userid,
            isOpenBottomModal: true
        })
    }

    _toggleModal12() {
        // debugger;
        if (this.state.permission_Value == "" || null || undefined) {
            // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
            toastMsg1('danger', "Please give a report")
        }
        else {
            this.setState({
                isOpenBottomModal: null,
                isModalVisible1: !this.state.isModalVisible1
            });
            this.report();
        }
    }
    _toggleModal1() {
        this.setState({
            permission_Value: "",
            isModalVisible1: !this.state.isModalVisible1
        });
    }

    async report() {
        const { place_id } = this.state;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            place_id: place_id,
            Content: this.state.permission_Value,
        };
        const url = serviceUrl.been_url1 + "/Reportforbusinessplace";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ isModalVisible1: false, isOpenBottomModal: false, isModalVisible2: true, permission_Value: '' })
            })
            .catch((error) => {
            });

    };

    async remove() {
        debugger
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Place_id: this.state.place_id
        };
        const url = serviceUrl.been_url1 + "/DeleteReviewsAndRatingforBusinessplace";
        fetch(url, {
            method: 'POST',
            headers: serviceUrl.headers,
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    // this.componentWillMount();
                    //this.props.navigation.goBack();
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
    }


    UpdateRating(key) {
        this.setState({ Default_Rating: key });
    }


    stars(count) {
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= count; i++) {
            stars.push((
                <Fontisto name="star" size={20} style={{ marginLeft: 4 }} color="#fe9102" />));
        }
        return (stars);
    }

    placeStory() {
        const { place_id, placeName } = this.state;
        // console.log('place id',place_id);
        this.props.navigation.navigate('ExploreStories', { placeId: place_id })
    }

    async savePlace() {
        debugger
        var data = {
            PostedImage: this.state.PostImage.toString(),
            PlaceName: this.state.placeName,
            Userid: await AsyncStorage.getItem('userId'),
            Country: this.state.Country,
            PostId: this.state.Postid
        };
        
        const url = serviceUrl.been_url1 + "/Savedplaces";

        this.setState({saveLoader:true})
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({saveLoader:false})
                if (responseJson.status == 'True') {
                    this.setState({isSaved:1})
                    // toastMsg("success", "Place Saved Successfully");
                    // componentWillMount();
                }
                else {
                    this.setState({isSaved:0})
                    toastMsg1('danger', responseJson.Message)
                }
            })
            .catch((error) => {
                toastMsg1('danger', error.Message || 'something wrong')
                this.setState({isSaved:0})
                this.setState({saveLoader:false})
                console.log(error);
            });
    }

    reviewScreen() {
        var data = {
            placeId: this.state.place_id,
            overallReview: this.state.overallReview,
            ratingsOverall: this.state.ratingsOverall,
            ownUserRating: this.state.ownUserRating
        }
        console.log("review data another screen", data)
        this.props.navigation.navigate('PlaceReview', { data: data })
    }


    locationFetch() {
        var data = {
            coords: this.state.coords
        }
        this.props.navigation.navigate('GetLocation', { data: data })

    }

    renderRightImgdone() {
        return <View>
            <View style={[stylesFromToolbar.leftIconContainer, { flexDirection: 'row', }]}>
                <View >
                    <Image style={{ width: 20, height: 20 }} />
                </View>
            </View>
        </View>
    }

    onProgressVideo = (e, data, index) => {
        const { nearbyUserData } = this.state;
        data.pause = e.currentTime > 0 ? true : false;
        nearbyUserData[index] = data;
        //   console.log('the near by user',nearbyUserData[index])
        this.setState({
            nearbyUserData
        })
    }

    onProgressVideoRecent = (e, data, index) => {
        const { recentUSersData } = this.state;
        data.pause = e.currentTime > 0 ? true : false;
        recentUSersData[index] = data;
        // console.log('the near by user',recentUSersData[index])
        this.setState({
            recentUSersData
        })
    }

    onProgressVideoTop = (e, data, index) => {
        const { topUsersData } = this.state;
        data.pause = e.currentTime > 0 ? true : false;
        topUsersData[index] = data;
        console.log('the near by user', topUsersData[index])
        this.setState({
            topUsersData
        })
    }

    navigation(item, index) {
        // console.log("Item comes from bsuinessPlaceHome", item + "is index of ", index);
        const { recentUSersData } = this.state;
        let memoryData = {}
        memoryData.result = recentUSersData;
        memoryData.status = "True";

        let selectedData = []
        memoryData.result.map((d, ind) => {
            console.log('the mmodatas', d)
            d.Postid = d.PostId
            d.NewsFeedPost = d.Image
            d.ProfilePic = d.UserProfilePic
            d.likecount =d.LikeCount
            if (d.PostId == item.PostId) {
                memoryData.result.splice(ind, 1)
                memoryData.result.unshift(d)
            }
        });

        memoryData.result.map((d, ind) => {
            d.Postid = d.PostId
            d.NewsFeedPost = d.Image
            d.ProfilePic = d.UserProfilePic
            return d
        });
        var props = { screenName: 'BusinessPlaceHomeOther', memoryData: memoryData, }
        this.props.navigation.navigate('GetData', { data: props });
    }


    render() {
        let reviewStar = [];
        let getRevieStar = [];
        //Array to hold the filled or empty Stars
        for (var i = 1; i <= this.state.Max_Rating; i++) {
            reviewStar.push(
                <TouchableOpacity activeOpacity={0.7} key={i} onPress={this.UpdateRating.bind(this, i)}>
                    {i <= this.state.Default_Rating ?
                        //Filled Star icon
                        <Fontisto name="star" size={30} style={{ marginLeft: 4 }} color="#fe9102" />
                        :
                        <Feather name="star" size={30} style={{ marginLeft: 4 }} color="#fe9102" />}
                </TouchableOpacity>
            );
        }

        for (var getStarRate = 1; getStarRate <= this.state.Max_Rating; getStarRate++) {
            getRevieStar.push(
                getStarRate <= this.state.Default_Rating ?
                    //Filled Star icon
                    <Fontisto name="star" size={30} style={{ marginLeft: 4 }} color="#fe9102" />
                    :
                    <Feather name="star" size={30} style={{ marginLeft: 4 }} color="#fe9102" />
            );
        }
        const imagePath = '../../Assets/Images/'
        const imagePath1 = '../../Assets/Images/BussinesIcons/';
        const { userProPic } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle={this.state.placeName} rightImgView={this.renderRightImgdone()} />

                <ScrollView >
                    <View >
                        <Text style={styles.headerText}>Nearby places</Text>
                        <View style={[styles.badgeView, { height: hp('22%') }]}>
                            {this.isNearByData()}
                            {/* google_places_data */}
                            <FlatList
                                data={this.state.nearbyUserData}
                                style={{ marginBottom: 10 }}
                                //ItemSeparatorComponent={this.seperator()}
                                extraData={this.state}
                                renderItem={({ item, index }) => (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View key={`id${index}`} style={styles.imageLayout}>
                                            {item.Image != undefined && item.Image.indexOf(".mp4") != -1 ?
                                                <View style={{ width: "100%", flex: 1, }}>
                                                    <Video
                                                        resizeMode="cover"
                                                        source={{ uri: serviceUrl.newsFeddStoriesUrl + item.Image }}
                                                        repeat={false}
                                                        paused={item.pause}
                                                        volume={this.state.volume}
                                                        controls={false}
                                                        style={{ width: wp('40%'), height: '98%', marginLeft: wp('2%'), borderRadius: 15, overflow: 'hidden', }}
                                                        onProgress={e => this.onProgressVideo(e, item, index)}
                                                    />
                                                    <View style={{ backgroundColor: '#0000', padding: 5 }}>
                                                        <Text style={styles.text}>{item.Location}</Text>
                                                    </View>
                                                </View>

                                                :
                                                <ImageBackground source={{ uri: newsFeddStoriesUrl + item.Image }} style={{ width: '100%', height: '100%' }} resizeMode={'cover'} >
                                                    {/* <View style={{backgroundColor:'#000',padding:5}}> */}
                                                    <View style={{ backgroundColor: '#0000', padding: 5 }}>
                                                        <Text style={styles.text}>{item.Location}</Text>
                                                    </View>
                                                </ImageBackground>
                                            }
                                        </View>
                                    </ScrollView>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal={true}
                            />
                        </View>
                    </View>

                    <View >
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.locationFetch()}>
                            <View style={{ width: wp('100%'), height: hp('23.5%'), }} >
                                <Image source={require(imagePath1 + 'BuPlMap.png')} style={[styles.BuPlMap,]} resizeMode={'cover'}
                                    borderRadius={20} />
                                <View style={styles.profileView}>
                                    <Image source={{ uri: newsFeddStoriesUrl + this.state.PostImage }} style={{ width: '100%', height: '100%' }}
                                        resizeMode={'cover'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttons}>

                        {/* Gold List image */}
                        {/* <TouchableOpacity onPress={() => this.setState({ isModalOpen: 1 })}> */}
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.GLList()}>
                            <View style={[styles.buttonImage, { marginLeft: wp('3%') }]}>
                                <ImageBackground source={require(imagePath1 + 'bordergold.png')} style={styles.buttonImage}
                               resizeMode={'contain'}
                                >
                                    <View style={styles.buttonImage1}>
                                        <Image source={require(imagePath1 + 'GoldList.png')} style={styles.buttonName} 
                                    resizeMode={'contain'} 
                                        />
                                        <Image source={require(imagePath1 + 'goldicon.png')} style={{ ...styles.buttonIcons, height: 14, width: 14, alignSelf: 'center' }} 
                                       resizeMode={'contain'} 
                                        />
                                    </View>
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.sector}>
                            <Text style={{ color: '#010101', textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>{this.state.placeName}</Text>
                            <Text style={{ color: '#010101', fontSize: 13, textAlign: 'center', fontWeight: 'normal' }}>{this.state.Country}</Text>
                        </View>

                        <View style={[styles.buttonImage,]}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.planner()}>
                                <ImageBackground source={require(imagePath1 + 'borderred.png')} style={styles.buttonImage} 
                                resizeMode={'contain'}
                                >
                                    <View style={styles.buttonImage1}>
                                        <Image source={require(imagePath1 + 'Planner.png')} style={styles.buttonName} 
                                     resizeMode={'contain'} 
                                        />
                                        <Image source={require(imagePath1 + 'Planner-1.png')} style={{ ...styles.buttonIcons, height: 14, width: 14, alignSelf: 'center' }} 
                                   resizeMode={'contain'} 
                                        />
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity >
                        </View>
                    </View>

                    <View style={[styles.buttons, { marginTop: hp('2.5%'), }]}>

                        {this.state.isSaved === 0 ?
                            <View style={[styles.buttonImage, { marginLeft: '3%' }]}>
                                <TouchableOpacity activeOpacity={0.8} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.savePlace()} >
                                    <ImageBackground source={require(imagePath1 + 'borderBlue.png')} style={styles.buttonImage} 
                                resizeMode={'contain'}
                                    >
                                        <View style={styles.buttonImage1}>
                                            <Text style={{ fontSize: 10, color: '#78bcef', fontWeight: 'bold' }}>
                                                {this.state.saveLoader ? 'Saving...' : 'Save Place'}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity >
                            </View> :
                            <View style={[styles.buttonImage, { marginLeft: '3%' }]}>
                                <ImageBackground tintColor={'#78bcef'} source={require(imagePath1 + 'borderBlue.png')} style={styles.buttonImage} 
                    resizeMode={'contain'}
                                >
                                    <View style={styles.buttonImage1}>
                                        <Text style={{ fontSize: 10, color: '#78bcef', fontWeight: 'bold' }}>Saved</Text>
                                    </View>
                                </ImageBackground>

                            </View>
                        }

                        <View style={styles.sector}>
                        </View>

                        <View style={[styles.buttonImage]}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.placeStory()}>
                                <ImageBackground source={require(imagePath1 + 'borderBlue.png')} style={styles.buttonImage} 
                              resizeMode={'contain'}
                                >
                                    <View style={styles.buttonImage1}>
                                        <Text style={{ fontSize: 10, color: '#78bcef', fontWeight: 'bold' }}>Stories</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity >
                        </View>
                    </View>


                    <Text style={{ color: '#010101', fontSize: 13, textAlign: 'center', fontWeight: 'normal', marginTop: 5, marginBottom: 5, width: '90%', marginHorizontal: 20 }}>
                        {invalidText(this.state.goldListDesc) ? null : this.state.goldListDesc}</Text>

                    <View >
                        <Text style={styles.headerText}>Recent</Text>
                        <View style={styles.badgeView}>
                            {this.isRecentNoData()}
                            <FlatList
                                data={this.state.recentUSersData}
                                extraData={this.state}
                                renderItem={({ item, index }) => (
                                    <ScrollView horizontal>
                                        <TouchableOpacity onPress={() => { this.navigation(item, index) }}>
                                            <View key={`id${index}`} style={styles.imageLayout}>
                                                {item.Image != undefined && item.Image.indexOf(".mp4") != -1 ?
                                                    <View style={{ width: "100%", flex: 1, }}>
                                                        <Video
                                                            resizeMode="cover"
                                                            source={{ uri: serviceUrl.newsFeddStoriesUrl + item.Image }}
                                                            repeat={false}
                                                            paused={item.pause}
                                                            volume={this.state.volume}
                                                            controls={false}
                                                            style={{ width: wp('40%'), height: '98%', marginLeft: wp('2%'), borderRadius: 15, overflow: 'hidden', }}
                                                            onProgress={e => this.onProgressVideoRecent(e, item, index)}
                                                        />
                                                        <Image style={styles.userPic}
                                                            source={{ uri: profilePic + item.UserProfilePic }} />
                                                        <Text style={styles.userText}> {item.UserName} </Text>
                                                    </View>

                                                    :
                                                    <ImageBackground source={{ uri: newsFeddStoriesUrl + item.Image }} style={{ width: '100%', height: '100%' }} borderRadius={15} resizeMode={'cover'} >
                                                        <Image style={styles.userPic}
                                                            source={{ uri: profilePic + item.UserProfilePic }} />
                                                        <Text style={styles.userText}> {item.UserName} </Text>
                                                    </ImageBackground>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </ScrollView>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal={true}
                            />
                        </View>
                    </View>


                    <TouchableOpacity onPress={() => this.reviewScreen()} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginLeft: 10, marginTop: '2%', marginVertical: 25, backgroundColor: '#f2f2f2', height: 100, width: wp(94), borderRadius: 10 }}>
                            {this.state.overallReview === 0 ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                                    {getRevieStar}
                                </View> :
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                                    {this.stars(this.state.overallReview)}
                                </View>}
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center', }}>
                                <Text style={[styles.ratingText, { width: 80, height: 38, fontFamily: Searchresult.Font, fontSize: Searchresult.FontSize, textAlign: 'center' }]}>  {this.state.overallReview}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.reviewText, { marginTop: -10, fontFamily: Common_Color.fontRegular, fontSize: Searchresult.FontSize, textAlign: 'center' }]}>({this.state.ratingsOverall} ratings)</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                </ScrollView>


                <Modal isVisible={this.state.isModalOpen === 1}
                    onBackdropPress={() => this.setState({ isModalOpen: null })}
                    onBackButtonPress={() => this.setState({ isModalOpen: null })} >
                    <View style={{ width: wp('90%'), backgroundColor: '#fff', borderRadius: 15 }} >
                        <View>
                            <Text style={styles.modalMainText}>Gold List of {this.state.placeName}</Text>
                            <View style={{ marginTop: hp('3%'), marginBottom: hp('1.3%') }}>
                                <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                    source={{ uri: serviceUrl.profilePic + this.state.goldListImg }} />
                            </View>
                            <View >
                                <Text style={styles.modalText}>
                                    {this.state.goldListName}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    isVisible={this.state.isOpenBottomModal}
                    onBackdropPress={() => this.setState({ isOpenBottomModal: null })}
                    onBackButtonPress={() => this.setState({ isOpenBottomModal: null })}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                >
                    <View style={Common_Style.modalContent}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

                        <View>
                            <Text onPress={() => this.setState({ visibleModal: null, isModalVisible1: true })} style={[styles.modalText, { color: '#e45d1b', fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium }]}>
                                Report post
                </Text>
                        </View>

                    </View>
                </Modal>

                {/* new models */}
                <Modal isVisible={this.state.isModalVisible1}
                    onBackdropPress={() => this.setState({ isModalVisible1: null })}
                    onBackButtonPress={() => this.setState({ isModalVisible1: null })} >
                    <View style={Common_Style.parentView} >
                        <Image style={Common_Style.icon} source={require('../../Assets/Images/new/Expression.png')}></Image>
                        <Text style={Common_Style.header} >
                            Inappropriate Content!
               </Text>
                        <Text style={Common_Style.subHeader} >
                            We are sorry for the inconvenience!
              </Text>
                        <View style={Common_Style.contentView}>
                            <Text style={Common_Style.content} >
                                We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
                 </Text>
                        </View>

                        <View style={Common_Style.inputView}>
                            <TextInput
                                style={{ padding: 5 }}
                                placeholder="Type Here..."
                                editable={true}
                                multiline={true}
                                autoFocus={true}
                                autoCorrect={false}
                                //  keyboardType="visible-password"
                                onChangeText={(text) => { this.setState({ permission_Value: text }) }}
                                value={this.state.permission_Value}
                            />
                        </View>

                        <View style={Common_Style.buttonView} >
                            <TouchableOpacity onPress={() => this._toggleModal12()} activeOpacity={1.5} >
                                <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }}
                                    style={{ marginVertical: 20, marginRight: "5%", height: hp("5%"), width: wp("55%"), borderRadius: 10, marginBottom: 15, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.5)" }} colors={["#fb0043", "#fb0043"]} >
                                    <Text onPress={() => this._toggleModal12()} style={{ color: "white", textAlign: "center", justifyContent: "center", fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium }}>
                                        Report
                     </Text>
                                </LinearGradient>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => this._toggleModal1()} activeOpacity={1.5}>
                                <Text onPress={() => this._toggleModal1()} style={{ textAlign: "center", justifyContent: "center", fontSize: 16 }}>
                                    Cancel
                 </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                <Modal isVisible={this.state.isModalVisible2}
                    onBackdropPress={() => this.setState({ isModalVisible2: false })}
                    onBackButtonPress={() => this.setState({ isModalVisible2: false })} >
                    <View style={Common_Style.parentView} >

                        <Text style={Common_Style.headerInModalTwo} >
                            Thank you for your voice!
               </Text>

                        <View style={Common_Style.contentViewInModalTwo}>
                            <Text style={Common_Style.contentTextInModalTwo} >
                                We would like to show you our utmost gratitude for raising your voice against inappropriate behaviour and thus helping in making this a safe and happy place for people around you!
                </Text>
                        </View>

                        <View style={Common_Style.contentViewInModalTwo}>
                            <Text style={[Common_Style.contentTextInModalTwo, { marginTop: 40 }]} >
                                Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
                </Text>
                        </View>
                        <View style={Common_Style.okayButton} >

                            <TouchableOpacity onPress={() => this.setState({ isModalVisible2: false })} activeOpacity={1.5} >
                                <Text onPress={() => this.setState({ isModalVisible2: false })} style={Common_Style.okayButtonText}>
                                    Okay
                  </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>



            </View>
        )
    }

}
