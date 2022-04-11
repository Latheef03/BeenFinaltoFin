import React, { Component } from 'react';
import { View, Text, Image, ToastAndroid, StatusBar, ScrollView, StyleSheet, KeyboardAvoidingView, ImageBackground, Picker } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Menu, Divider } from 'react-native-paper';
import { Container, Title, Content, Button, Header, Footer, FooterTab, Badge, Left, Right, Body } from 'native-base';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-picker';
import MapView, { PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import serviceUrl from '../../Assets/Script/Service';
let Common_Api = require('../../Assets/Json/Common.json')
import common_styles from "../../Assets/Styles/Common_Style"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
import BusinessPlacProfileOthers from './BusinessPlacProfileOthers';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import LinearGradient from "react-native-linear-gradient";
import Common_Style from '../../Assets/Styles/Common_Style'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import { Toolbar, FooterTabBarOthers } from '../commoncomponent'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Spinner from '../../Assets/Script/Loader';
import styles1 from '../../styles/NewfeedImagePost';
export default class OtherUserProfile extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(prop) {
        super(prop);
        this.state = {
            originalName: '',
            isModalVisible: false,
            id: '',
            name: '',
            userName: '',
            website: '',
            bio: '',
            email: '',
            profilePic: '',
            footPrintsCount: 0,
            visitsCount: 0,
            footPrintsData: [],
            bio: "",
            website: "",
            ChatUserId: null,
            isvisibleModal: null,
            isModalVisible2: false,
            UnfollowModal: false,
            RequestModal: false,
            otherid: "",
            Follow: "True",
            localProf:'',
            checkFollow: true,
            accountValidation: '',
            markers: [],
            businessProfile: 0,
            memoriesCount: 0,
            vlogCount: 0,
            getLocation: '', ProfileAs: "", permission_Value: "",
            no_record_found: false,
            isLoading: false,
            dynamicData:[],
            streakImages: [],
            FootprintImaged: [],
            MemorieImages: [],
            VlogImages: [],
            CountryImages: [],
            result: [],
            accBlock : false,
            muteAcc : false

        }
    }

    async UNSAFE_componentDidMount() {
       
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getOthersProfile();
                this.updateFollow();
            }
        );
    };

    async UNSAFE_componentWillMount() {
        this.getOthersProfile();
        this.updateFollow();
        this.badgesApi();
        this.visitProfile();
        this.footPrints();
        this.getMapdata();
        var id1 = await AsyncStorage.getItem("OtherUserId");
        this.setState({ otherid: id1})
        const Comments = this.props.route.params?.data
        console.log("Data from other wiiMoint local",Comments);
        if (Comments != undefined) {
            this.setState({ 
                ProfileAs: Comments.ProfileAs, 
                localProf: Comments.LocalProf 
            })
        }
        
    }
    visitProfile = async () => {
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otherid: await AsyncStorage.getItem('OtherUserId')
        };
        const url = serviceUrl.been_url + "/VisitProfile";
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
                    //toastMsg('success', 'Request has been sent')
                    // this.getOthersProfile();
                    this.getOthersProfile();
                }
            })
            .catch((error) => {
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    };
    permission_Value = text => {
        this.setState({ permission_Value: text });
    };
    async badgesApi() {
        // debugger;
        var UId = await AsyncStorage.getItem('OtherUserId');
        console.log('test id', UId);
        var data = {
            //   Userid: "5df489bd1bc2097d72dd07c2"
            // UserId: "5e6f2ebde44ab376935b4022"
            UserId: UId
        };
        const url = serviceUrl.been_url1 + '/GetBadgesCount';
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
    memories() {
        var data = {
            otherid: this.state.otherid,
            screenName: "BusinessProfile",
        }
        this.props.navigation.navigate('OtherMemories', { data: data })
    }
    visits() {
        var data = {
            otherid: this.state.otherid
        }
        this.props.navigation.navigate('OtherVisits', { data: data })
    }
    albums() {
        var data = {
            otherid: this.state.otherid
        }
        this.props.navigation.navigate('OtherAlbums', { data: data })
    }
    vlog() {
        this.props.navigation.navigate('OtherVlog');
    }


    footPrint() {
        var dataForFootPrints = this.state.footPrintsData;
        this.props.navigation.navigate('OtherFootPrints', { data: dataForFootPrints });
    }
    readFromClipboard = async () => {
        this.setState({ isModalVisible: false })
        //To get the text from clipboard
        const clipboardContent = await Clipboard.getString();
        this.setState({ clipboardContent });
    };

    writeToClipboard = async () => {
        //alert('Link Copied!')
        this.setState({ isModalVisible: false })
        //To copy the text to clipboard
        await Clipboard.setString("https://playcode.io/493060");
        toastMsg('success', 'Link Copied!')
        // alert('Link Copied!');
    };

    getOthersProfile = async () => {
        // debugger;
        const { headers } = serviceUrl;
        const Comments = this.props.route.params?.data
        this.setState({ isLoading: true });
        if (Comments != undefined) {
            this.setState({ProfileAs: Comments.ProfileAs,})
        }
        const url = serviceUrl.been_url1 + "/OthersDashboard";
        var data = {
            userId: await AsyncStorage.getItem('userId'),
            otherId: await AsyncStorage.getItem('OtherUserId')
        };
        this.setState({ isLoader: true });
        let subscribed = true
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(async response => response.json())
            .then(responseJson => {
                console.log('get other profile data', responseJson);
                if (responseJson.status == "True") {
                    // AsyncStorage.mergeItem('otherProfile', responseJson.result[0].UserDetails[0].ProfileType);
                    // AsyncStorage.setItem('otherProfile', responseJson.result[0].UserDetails[0].ProfileType);
                    let uDetails = responseJson.result[0].UserDetails[0]
                    if (subscribed)
                        this.setState({
                            dynamicData:uDetails,
                            isLoading: false,
                            no_record_found: false,
                            visitsCount: responseJson.result[0].FollowersCount,
                            userName: uDetails.UserName,
                            verifyProfile: uDetails.VerificationRequest,
                            name: uDetails.name,
                            bio: uDetails.Bio != "null" || null || undefined ? uDetails.Bio : '',
                            website: uDetails.Website != "null" || null || undefined ? uDetails.Website : '',
                            accountValidation: uDetails.PrivateAccount,
                            profilePic: uDetails.ProfilePic,
                            ChatUserId: uDetails.ChatUserId ? uDetails.ChatUserId : null,
                            memoriesCount: responseJson.result[0].NewsFeedDet.filter(v =>
                                v.Image.includes('.jpg') || v.Image.includes('.jpeg') || v.Image.includes('.png')).length,
                            vlogCount: responseJson.result[0].NewsFeedDet.filter(v => v.Image.includes('.mp4')).length
                        });
                    console.log("Account validation", this.state.accountValidation);

                } else {
                    this.setState({
                        isLoading: false,
                        no_record_found: true,
                    });
                }
            })
            .catch(function (error) {
                //toastMsg('danger', 'Sorry..something network error.Please try again.')
            });

        return () => (subscribed = false)

    }
    editProfile() {
        this.props.navigation.navigate('Edit_Profile')
    }
    followRequest = async () => {
        var data = {
            Otheruserid: await AsyncStorage.getItem('OtherUserId'),
            //this.state.otherid,

            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/SendFollowReq";
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
                    //toastMsg('success', 'Request has been sent')
                    // this.getOthersProfile();
                    this.updateFollow();
                }
            })
            .catch((error) => {
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    };

    newsfeed() {
        this.props.navigation.navigate('Newsfeed')
    }
    settings() {
        this.props.navigation.navigate('SettingsScreen')
    }
    async tagPost() {
        var data = {
            otherid: await AsyncStorage.getItem('OtherUserId')
        }
        this.props.navigation.navigate('OtherTagged', { data: data })
    }

    async follwers() {
        var data = {
            otherid: await AsyncStorage.getItem('OtherUserId'),
            userName: this.state.userName
        }
        this.props.navigation.navigate('OtherFollowers', { data: data })
    }

    badgesScreen() {

        var data = {
            footprints: this.state.footPrintsCount,
            memoriesCount: this.state.memoriesCount,
            vlogCount: this.state.vlogCount
        }
        this.props.navigation.navigate('OtherBadges', { data: data })
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


    async reqCancel() {
        // debugger;
        this.setState({ RequestModal: false, UnfollowModal: false })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            reqId: await AsyncStorage.getItem('reqIdForStatus'),
            Status: "Cancel"
        };
        const url = serviceUrl.been_url + "/AcceptOrDelete";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    {
                        this.getOthersProfile();
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
            Otheruserid: await AsyncStorage.getItem('OtherUserId')
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
                //toastMsg('success', responseJson.message)
                this.getOthersProfile();
                this.updateFollow();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    _toggleModal1() {
        // this.setState({
        //     isModalVisible: null,
        //     isvisibleModal: null,
        //     permission_Value: "",
        //     isModalVisible1: !this.state.isModalVisible1
        // });

        this.setState({
            isModalVisible: null,
            isvisibleModal: null,
          },()=>{
             setTimeout(()=>{
              this.setState({
                isModalVisible1: true
              })
            },600)
          })
    }


    _toggleModal12() {
        // debugger;
        if (this.state.permission_Value == "" || null || undefined) {
            toastMsg1('danger', "Please give a report")
            //ToastAndroid.show("Please give a report", ToastAndroid.LONG)
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
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
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
    async updateFollow() {
        // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: await AsyncStorage.getItem('OtherUserId')
        };
        const url = serviceUrl.been_url2 + "/OtherUserStatus";
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
                console.log('te checkFollow res',responseJson);
                this.setState({
                    // checkFollow: responseJson.connectionstatus,
                    checkFollow: responseJson.message,
                })
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }


    footPrints = async () => {
        const { headers } = serviceUrl;
        var userId = await AsyncStorage.getItem('userId');
        const url = serviceUrl.been_url + "/GetFootPrints";
        var data = {
            UserId: userId,
            followedId: await AsyncStorage.getItem('OtherUserId')
        };
        this.setState({ isLoader: true });
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(async response => response.json())
            .then(responseJson => {
                if (responseJson.status == "True") {
                    this.setState({
                        isLoader: false,
                        footPrintsCount: responseJson.FootprintCount,
                        footPrintsData: responseJson
                    });
                } else {
                    this.setState({ isLoader: false });
                    //toastMsg('danger', response.data.message)
                }
            })
            .catch(function (error) {
                this.setState({ isLoader: false });
                //toastMsg('danger', 'Sorry..something network error.Please try again.')
            });
    }
    unfollowAcc(data) {
        console.log("Other dashboard data",data)
        this.setState({
            profilePic:data.ProfilePic,
            name:data.UserName,
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
    async block() {
        // debugger;
        const {accBlock} = this.state
        this.setState({ 
            isModalVisible: false,
            accBlock : !accBlock 
         })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: await AsyncStorage.getItem('OtherUserId')

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
                // console.log('the block response,',responseJson);
                //toastMsg('success', "Account has been blocked")

                // this.getOthersProfile();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }

    async mute() {
        const {muteAcc} = this.state
        this.setState({ 
            isModalVisible: false,
            muteAcc:!muteAcc 
        })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: await AsyncStorage.getItem('OtherUserId')

        };
        const url = serviceUrl.been_url1 + "/MuteAccount";
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
                console.log('the mute response,',responseJson)
                //toastMsg('success', "Account has been blocked")
                // this.getOthersProfile();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    getMapdata = async () => {
        const { headers } = serviceUrl;
        const url = serviceUrl.been_url + "/GetNewsFeedList";
        var data = {
            UserId: this.state.OtherId,
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


    gotoChat = async() => {
        debugger;
        const { userName, ChatUserId } = this.state;
        console.log(`chat user name ${userName} and chat user id ${ChatUserId}`)
        if (ChatUserId == null || ChatUserId == 'null') {
            //toastMsg('danger', `${userName} has no specific chat id to chat`)
            return false
        }
        const appChatId = await AsyncStorage.getItem('chatUserID')
        let data = {
            name: userName,
            occupants_ids: [parseInt(ChatUserId),parseInt(appChatId)],
            ProfilePic: this.state.profilePic
        }
        
        // console.log('the datas of other user',data)
        this.props.navigation.navigate('OneToOneChat', { chatUser: data })
    }

    renderToolbarIconsView = () => {
        return (

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginRight: 8 }}>

                <TouchableOpacity onPress={() => this.tagPost()}>
                    <Image style={{ width: 26, height: 26, marginRight: 5 }}
                        source={require('../../Assets/Images/notes.png')} />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => { this.setState({ isModalVisible: true }) }}>
                    <Image style={{ width: 17, height: 18, marginTop: 4 }}
                 //  resizeMode={'stretch'} 
                     source={require('../../Assets/Images/3dots.png')} />
                </TouchableOpacity>

            </View>
        )
    }


    render() {
        const { footPrintsCount, memoriesCount, vlogCount } = this.state;
        const badges = this.state.FootprintImaged.length + this.state.CountryImages.length + this.state.streakImages.length + this.state.MemorieImages.length + this.state.VlogImages.length;
        const badgeCount = isNaN(badges) ? 0 : badges;
        const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
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

        const { newsFeddStoriesUrl,profilePic } = serviceUrl;
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

                                                                            </ImageBackground>
                                                                            <Text style={[styles.newText1, { alignSelf: 'center', }]}>
                                                                                {this.state.name && this.state.name === undefined || this.state.name && this.state.name === null || this.state.name && this.state.name === "" || this.state.name && this.state.name === "null" || this.state.name && this.state.name === "undefined" ? "" : this.state.name}</Text>
                                                                            <View style={{ height: 85, }}>
                                                                                <View style={{ height: 85, marginTop: 1, }}>
                                                                                    <Text style={[styles.newText12, {}]}>{this.state.bio && this.state.bio === undefined || this.state.bio && this.state.bio === null || this.state.bio && this.state.bio === "" || this.state.bio && this.state.bio === "null" || this.state.bio && this.state.bio === "undefined" ? "" : this.state.bio}</Text>
                                                                                </View>
                                                                                <View style={{ height: '100%', width: '100%', }}>
                                                                                    <View style={styles.editProfile}>

                                                                                        {this.state.checkFollow === "You follow this user" ?
                                                                                            <View style={{ height: 50 }}>
                                                                                                <TouchableOpacity onPress={() => this.unfollowAcc(this.state.dynamicData)} style={{ width: '100%', }}>

                                                                                                    <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                                        <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Following</Text>
                                                                                                    </View>
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                            :

                                                                                            this.state.checkFollow === "Your request was not accepted" ?
                                                                                                <View style={{ height: 50 }}>
                                                                                                    <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>

                                                                                                        <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Requested</Text>
                                                                                                        </View>
                                                                                                    </TouchableOpacity>

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
                                                                                                <Text style={[common_styles.Common_btn_txt, { marginBottom: 5, fontSize: 8, fontFamily: Common_Color.fontLight, color: '#000000', }]}>Message</Text>
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
                                                                                    <View style={{ height: '100%', width: '100%', }}>
                                                                                        {/* {this.state.businessProfile === 1 ? */}
                                                                                        <View style={styles.editProfile}>

                                                                                            {this.state.checkFollow === "You follow this user" ?
                                                                                                <View style={{ height: 50 }}>
                                                                                                    <TouchableOpacity onPress={() => this.unfollowAcc(this.state.dynamicData)} style={{ width: '100%', }}>

                                                                                                        <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Following</Text>
                                                                                                        </View>
                                                                                                    </TouchableOpacity>
                                                                                                </View>
                                                                                                :

                                                                                                this.state.checkFollow === "Your request was not accepted" ?
                                                                                                    <View style={{ height: 50 }}>
                                                                                                        <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>
                                                                                                            <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Requested</Text>
                                                                                                            </View>
                                                                                                        </TouchableOpacity>
                                                                                                    </View>
                                                                                                    :
                                                                                                    this.state.checkFollow === "You don't follow this user" ?
                                                                                                        <TouchableOpacity onPress={() => this.followRequest(this.state.dynamicData)} style={{ width: '100%', height: '100%', }}>
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
                                                                                            <TouchableOpacity onPress={() => this.unfollowAcc(this.state.dynamicData)} style={{ width: '100%', }}>
                                                                                                <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                                    <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Following </Text>
                                                                                                </View>
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                        // </TouchableOpacity>
                                                                                        :

                                                                                        this.state.checkFollow === "Your request was not accepted" ?
                                                                                            <View style={{ height: 50 }}>
                                                                                                <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>

                                                                                                    <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                                        <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Requested</Text>
                                                                                                    </View>
                                                                                                </TouchableOpacity>
                                                                                            </View>
                                                                                            :
                                                                                            this.state.checkFollow === "You don't follow this user" ?
                                                                                                <TouchableOpacity onPress={() => this.followRequest(this.state.dynamicData)} style={{ width: '100%', height: '100%', }}>
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
                                                                        </View>)
                                                                        : (
                                                                            <View style={{ width: '100%', height: '150%' }}>
                                                                                <ImageBackground style={[businessProfileStyle.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                                                    source={{ uri: serviceUrl.profilePic + this.state.profilePic }}>
                                                                                </ImageBackground>

                                                                                <Text style={[styles.newText1, { alignSelf: 'center', }]}>
                                                                                    {this.state.name && this.state.name === undefined || this.state.name && this.state.name === null || this.state.name && this.state.name === "" || this.state.name && this.state.name === "null" || this.state.name && this.state.name === "undefined" ? "" : this.state.name}</Text>
                                                                                <View style={{ height: 85, }}>
                                                                                    <View style={{ height: 85, marginTop: 1, }}>
                                                                                        <Text style={[styles.newText12, {}]}>{this.state.bio && this.state.bio === undefined || this.state.bio && this.state.bio === null || this.state.bio && this.state.bio === "" || this.state.bio && this.state.bio === "null" || this.state.bio && this.state.bio === "undefined" ? "" : this.state.bio}</Text>
                                                                                    </View>
                                                                                    <View style={{ height: '100%', width: '100%' }}>
                                                                                        <View style={styles.editProfile}>

                                                                                            {this.state.checkFollow === "You follow this user" ?
                                                                                                <View style={{ height: 50 }}>
                                                                                                    <TouchableOpacity onPress={() => this.unfollowAcc(this.state.dynamicData)} style={{ width: '100%', }}>
                                                                                                        <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Following</Text>
                                                                                                        </View>

                                                                                                    </TouchableOpacity>
                                                                                                </View>
                                                                                                :

                                                                                                this.state.checkFollow === "Your request was not accepted" ?
                                                                                                    <View style={{ height: 50 }}>
                                                                                                        <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>

                                                                                                            <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Requested</Text>
                                                                                                            </View>
                                                                                                        </TouchableOpacity>
                                                                                                    </View>
                                                                                                    :
                                                                                                    this.state.checkFollow === "You don't follow this user" ?
                                                                                                        <TouchableOpacity onPress={() => this.followRequest(this.state.dynamicData)} style={{ width: '100%', height: '100%', }}>
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
                                                                )}

                                                        </View>


                                                        <View style={{ height: 520, marginTop: '22%', }}>
                                                            <View style={styles.editProfile}>
                                                                {this.state.checkFollow === "True" ?
                                                                    // <TouchableOpacity onPress={() => this.followRequest()} style={{ width: '100%', height: '100%', }}>
                                                                    <TouchableOpacity onPress={() => this.unfollowAcc(this.state.dynamicData)} style={{ width: '100%', }}>
                                                                        <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                            <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Following</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    :

                                                                    this.state.checkFollow === "Pending" ?
                                                                        <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>

                                                                            <View style={[Common_Style.FollowingStatus, { width: 200, alignSelf: 'flex-start', height: 30, alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>
                                                                                <Text style={[common_styles.Common_btn_txt, { fontSize: 13, color: '#4f4f4f', alignSelf: 'center', textAlign: 'center', justifyContent: 'center' }]}>Requested</Text>
                                                                            </View>
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
                                                        </View>

                                                    </View>


                                                    {/* /* Followers */}

                                                    <View style={{ marginLeft: '2%', marginTop: -30, height: '100%' }}>
                                                        {this.state.visitsCount > 0 ?
                                                            <View>
                                                                {this.state.accountValidation == "Public" ?
                                                                    <TouchableOpacity onPress={() => this.follwers()}>
                                                                        <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '8%', }}>
                                                                            <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                                rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                            </Image>
                                                                            <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, 
                                                                                    //fontFamily: Searchresult.Font 
                                                                                    }}> {this.state.visitsCount}  </Text>
                                                                                <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Follower </Text>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '8%', }}>
                                                                        <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                            rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                        </Image>
                                                                        <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ fontSize: Searchresult.FontSize, 
                                                                                //fontFamily: Searchresult.Font, 
                                                                                marginTop: 10, }}> {this.state.visitsCount}  </Text>
                                                                            <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Follower </Text>
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
                                                                        <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, }}> 0  </Text>
                                                                        <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Followers </Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        }





                                                        {/* Footprints */}

                                                        <View>
                                                            {this.state.footPrintsCount > 0 ?
                                                                <View>
                                                                    {this.state.accountValidation == "Public" ?
                                                                        <TouchableOpacity onPress={() => this.footPrint()}>
                                                                            <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                                <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                                    rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                                </Image>
                                                                                <View style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                    <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize,  }}> {this.state.footPrintsCount}  </Text>
                                                                                    <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Footprints </Text>
                                                                                </View>
                                                                            </View></TouchableOpacity>
                                                                        : <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                            <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                                                                                rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                                                                            </Image>
                                                                            <View style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize,  }}> {this.state.footPrintsCount}  </Text>
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
                                                                        <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize,  }}> 0  </Text>
                                                                        <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Footprints </Text>
                                                                    </View>
                                                                </View>
                                                            }
                                                        </View>


                                                        {/* Badges */}

                                                        <View>
                                                            <View>
                                                                {this.state.accountValidation == "Public" ?
                                                                    <TouchableOpacity onPress={() => this.badgesScreen()}>
                                                                        <View style={{ width: 80, height: 80, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                            <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                                                                source={require('../../Assets/Images/BussinesIcons/Floral-grey.png')}>
                                                                            </Image>
                                                                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, }}> {badgeCount > 0 ? badgeCount : 0}  </Text>
                                                                                <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Badges </Text>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity> :
                                                                    <View style={{ width: 80, height: 80, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                                                                        <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                                                            rezizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Floral-grey.png')}>
                                                                        </Image>
                                                                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ marginTop: 10, fontSize: Searchresult.FontSize, }}> {badgeCount > 0 ? badgeCount : 0}  </Text>
                                                                            <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}> Badges </Text>
                                                                        </View>
                                                                    </View>}
                                                            </View>


                                                        </View>

                                                        {this.state.localProf === 'yes'?
                                                        <View style={{ alignContent: 'center' }}>
                                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('LocalProfile5') }}>
                                                                <Image style={{ width: 54, height: 54, marginTop: '5%', marginLeft: '9%' }} source={require(imagePath + 'local_profile.png')}></Image>
                                                            </TouchableOpacity>
                                                        </View> : null}
                                                        {/* <View style={{ flexDirection: 'row', marginLeft: 24 }}>
                                                            {this.stars(rating)}
                                                        </View> */}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>


                                        <View style={{ flex: 1, marginTop: 5, }}>
                                            {this.state.accountValidation == "Public" ?
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

                                                                <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', }}>
                                                                    <ImageBackground source={require('../../Assets/Images/loc_marker_unseen.png')} style={{ width: 41, height: 45, justifyContent: 'center' }} rezizeMode={'stretch'} >
                                                                        <Image source={{ uri: newsFeddStoriesUrl + marker.postImg.split(',')[0] }} style={{
                                                                            height: 35, width: 35, borderRadius: 35, marginLeft: '7%', marginBottom: '12%'
                                                                        }} />
                                                                    </ImageBackground >
                                                                </View>
                                                            </MapView.Marker>
                                                            :
                                                            null
                                                    ))}
                                                </MapView> :
                                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                    <View style={{ width: wp(10), height: hp(6), justifyContent: 'center' }}>
                                                        <Image style={{ width: '100%', height: '100%' }} resizeMethod={'auto'}
                                                            source={require('../../Assets/Images/new/private.png')} />
                                                    </View>
                                                    <View style={{ flexDirection: 'column', paddingLeft: 5, width: wp('80%'), justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#010101', textAlign: 'left' }}>This Account is Private</Text>
                                                        <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#010101' }}>Follow this account to see their content</Text>
                                                    </View>
                                                </View>}
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
                                              <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold, color: '#fff', fontSize: 15, }]}>  {this.state.name}?</Text>
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

                                            <View style={[styles1.horizontalSeparator,]} />

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
                                                <Text onPress={() => this.followRequest()} style={[styles1.modalText, { color: '#8caafa' }]}>
                                                    Follow account
                                              </Text>}

                                            <View style={styles1.horizontalSeparator} />

                                            <View style={{ marginTop: 7, }}>
                                                <TouchableOpacity onPress={() => this.block()}>
                                                    <Text onPress={() => this.block()} style={[styles1.modalText, { color: '#fb7935' }]}>
                                                        {!this.state.accBlock ? "Block":'Unblock'} account
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles1.horizontalSeparator} />

                                            <View style={{ marginTop: 7, marginBottom: 7 }}>
                                                <TouchableOpacity onPress={() => this.mute()}>
                                                    <Text onPress={() => this.mute()} style={[styles1.modalText, {}]}>
                                                    {!this.state.muteAcc ? 'Mute' : 'Unmute'} account
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
                                            <View style={[Common_Style.contentViewReport,{marginHorizontal:10}]}>
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
                                                autoCorrect={false}
                                                //  keyboardType="visible-password"
                                                // flexWrap: 'wrap'
                                                onChangeText={(text) => { this.setState({ permission_Value: text }) }}
                                                value={this.state.permission_Value}
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
                                                    onPress={() => this.setState({isModalVisible1: false})}
                                                    activeOpacity={1.5}
                                                >
                                                    <View style={Common_Style.ButtonCancel}>
                                                        <Text onPress={() => this.setState({isModalVisible1: false})} style={Common_Style.CancelButtonTextReport}>
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

                                            <View style={[Common_Style.TcontentViewInModalTwo,{marginHorizontal:10}]}>
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
                    <View style={styles.footer}>

                        <View style={styles.footericon}>
                            <TouchableOpacity onPress={() => this.memories()}>
                                <Image style={[styles.footerIconImage,]} source={require('../../Assets/Images/camera.png')}></Image>
                            </TouchableOpacity>
                            <Text onPress={() => this.memories()} style={styles.fontsize}>Memories</Text>
                        </View>
                        <View style={styles.footericon}>
                            <TouchableOpacity onPress={() => this.visits()}>
                              <Image style={{ width: 25, height: 25, }} 
                                resizeMode={'contain'} 
                                source={require('../../Assets/Images/visits.png')}></Image>
                            </TouchableOpacity>
                            <Text onPress={() => this.visits()} style={styles.fontsize}>Visits</Text>
                        </View>
                        <View style={styles.footericon}>
                            <TouchableOpacity onPress={() => this.albums()}>
                                <Image style={[styles.footerIconImage, { marginLeft: 4, width: 30, height: 30, }]} source={require('../../Assets/Images/image.png')}></Image>
                            </TouchableOpacity>
                            <Text onPress={() => this.albums()} style={styles.fontsize}>Albums</Text>
                        </View>
                        <View style={[styles.footericon, {}]}>
                            <TouchableOpacity onPress={() => this.vlog()}>
                                <Image style={{ width: 25, height: 25, }}  source={require('../../Assets/Images/video.png')}></Image>
                                <Text onPress={() => this.vlog()} style={[styles.fontsize, { marginBottom: 3 }]}>VLog</Text>
                            </TouchableOpacity>
                        </View>
                    </View> : null
                }

            </View>
        )
    }
}


const report = {

    parentView: { width: "100%", borderRadius: 15, backgroundColor: "white" },
    icon: { width: wp(8), height: hp(4.5), marginLeft: '45%', marginBottom: '5%', marginTop: '5%' },
    header: { fontSize: Username.FontSize, fontFamily: Username.Font, marginTop: 10, textAlign: "center", alignSelf: "center", textAlign: 'center', },
    subHeader: { marginTop: 15, textAlign: "center", alignSelf: "center", fontSize: Username.FontSize, fontFamily: Username.Font, },
    contentView: { width: '95%', textAlign: "center", fontFamily: Common_Color.fontMedium, color: '#010101' },
    content: { marginTop: 10, fontSize: Timestamp.FontSize, fontFamily: Timestamp.Font, textAlign: "center", alignSelf: "center", color: '#9e9e9e' },

    inputView: {
        borderColor: '#a5a5a5',
        borderWidth: 1,
        width: "85%",
        padding: 5,
        height: '35%',
        marginLeft: 25,
        color: "grey",
        marginTop: 25,
        marginBottom: 15,
        borderRadius: 5
    },

    buttonView: {
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        marginVertical: 10,
        marginTop: 10,
        justifyContent: "space-evenly",
        margin: 10,
        marginLeft: 20
    },

    headerInModalTwo: { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, marginTop: 25, textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#010101', },

    contentViewInModalTwo: { width: '95%', textAlign: "center", },

    contentTextInModalTwo: { marginTop: 20, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#010101', fontFamily: Common_Color.fontMedium },

    okayButton: {
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        marginVertical: 10,
        marginTop: 40,
        justifyContent: "space-evenly",
        margin: 10,
        marginLeft: 20, fontWeight: 'bold'
    },
    okayButtonText: {
        color: "#d12c5e",
        textAlign: "center",
        justifyContent: "center",
        fontSize: 25, fontWeight: 'bold',
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
        height: 60,
        width: '100%',
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalText: { color: '#010101', marginTop: hp('2%'), textAlign: 'center', marginLeft: wp('6%'), marginBottom: hp('1.3%'), fontFamily: Common_Color.fontMedium },
    topicons: { width: 26, height: 26, marginRight: 3, marginTop: '0%' },
    container: { flex: 1, },
    createButton: { alignItems: 'center', justifyContent: 'center', height: 30, width: 130, },
    createButtonPrivate: { alignItems: 'center', alignSelf: 'center', height: 34, width: 300, marginTop: '10%' },
    iconView: { width: '12%', height: '140%' },
    container2: { flexDirection: 'row', marginTop: '3%', width: '95%', marginLeft: 'auto', marginRight: 'auto' },
    container1: { flexDirection: 'row', marginTop: '3%', width: '95%', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end' },
    icon: { width: 15, height: 20 },
    icon1: { width: 20, height: 23, marginTop: 6, marginRight: '5%' },
    footericon: {
        width: '23%', marginLeft: '5%', marginBottom: '2%', alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        flex: 1,
    },
    fontColor: { color: '#b4b4b4' },
    fontsize: { fontSize: 9, color: '#010101', fontWeight: 'normal', textAlign: 'center', fontFamily: Common_Color.fontLight, },
    fontsize1: { fontSize: 16, color: '#010101', fontFamily: Common_Color.fontBold },
    newText: { color: '#010101', fontSize: 14, fontFamily: Common_Color.fontMedium, textAlign: 'center' },
    newText1: { fontSize: Username.FontSize, fontFamily: Username.Font, textAlign: 'left', marginBottom: 5, marginTop: 5, marginLeft: '3%' },
    newText12: { fontSize: Description.FontSize, fontFamily: Description.Font, textAlign: 'left', marginBottom: 5, marginTop: 5, marginLeft: '3%' },
    footerIconImage: { width: 30, height: 30 },
    modalView2: { backgroundColor: "#FFF", borderRadius: 25, borderColor: "rgba(0, 0, 0, 0.1)", justifyContent: 'center', alignItems: 'center' },
    mesageButton: { alignItems: 'center', justifyContent: 'center', borderWidth: .5, borderColor: 'grey', height: 34, width: 130, borderRadius: 10 },
    editProfile: { width: '94%', height: 34, marginLeft: 'auto', marginRight: 'auto', marginBottom: 10, justifyContent: 'space-around', flexDirection: 'row', }
})








