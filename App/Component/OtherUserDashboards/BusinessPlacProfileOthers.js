import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, ImageBackground, ToastAndroid, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styles from '../BusinessPlace/styles/placeProfileStyle'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Tabs, Tab } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import GetMemoriesOtherUser from '../BusinessPlace/GetMemoriesOtherUser';
import { TextInput, Menu, Divider } from 'react-native-paper';
import TaggedPostOtherUser from '../BusinessPlace/TaggedPostOtherUser'
import { Toolbar } from '../commoncomponent'
import Modal from "react-native-modal";
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import LinearGradient from "react-native-linear-gradient";
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
import Common_Style from '../../Assets/Styles/Common_Style';
import styles1 from '../../styles/NewfeedImagePost';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { toastMsg1, toastMsg } from '../../Assets/Script/Helper';
export default class BusinessPlacProfileOthers extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            tab: 0,
            originalName: '',
            linkedData: '',
            id: '',
            name: '',
            userName: '',
            website: '',
            bio: '',
            email: '',
            profilePic: '',
            footPrintCount: 0,
            folowersCount: 0,
            visitsCount: 0,
            footPrintsData: [],
            markers: [],
            businessProfile: 0,
            getLocation: '',
            Consolidate_Like: '',
            GoldList: '',
            Visit_Count: '',
            checkFollow: true,
            isvisibleModal: null,
            isModalVisible2: false,
            UnfollowModal: false, isModalVisible: false, ChatUserId: null,
            accBlock: false,
            muteAcc: false
        }
    }

    componentWillMount() {
        this.userProfile();
        this.updateFollow();
    }
    componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                // this.userProfile();
                // this.updateFollow();
            }
        );
    };



    promote() {
        this.props.navigation.navigate("Promote");
    }
    editProfile() {
        this.props.navigation.navigate("Edit_Profile");
    }
    stories() {
        // this.props.navigation.navigate("ExploreStories");
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
        await Clipboard.setString("https://playcode.io/493060");
        toastMsg('success', "Link Copied!")
        // alert('Link Copied!');
    };

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

    async block() {
        // debugger;
        const { accBlock } = this.state
        this.setState({
            isModalVisible: false,
            accBlock: !accBlock
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
                console.log('the block res', responseJson);
                //toastMsg('success', "Account has been blocked")
                // this.getOthersProfile();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    title() {
        return <View style={{ backgroundColor: '#fff', flexDirection: 'column' }}>
            <Image style={{ width: 25, height: 25 }} source={require('../../Assets/Images/BussinesIcons/cameraMemoris.png')} />
            {/* <Text style={{ fontSize: 14 }}> Memories</Text> */}
        </View>
    }

    titleFollwing() {
        return <View style={{ backgroundColor: '#fff', flexDirection: 'column' }}>
            <Image source={require('../../Assets/Images/BussinesIcons/tagpost.png')} style={{ width: 25, height: 23 }} resizeMode={'stretch'} />
            {/* <Text style={{ fontSize: 14 }}> Tags</Text> */}
        </View>
    }



    userProfile = async () => {
        // debugger;
        var data = {
            userId: await AsyncStorage.getItem('userId'),
            otherId: await AsyncStorage.getItem('OtherUserId')
        };

        const url = serviceUrl.been_url + '/OthersDashboard';
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
                if (responseJson.status == "True") {
                    console.log("Response checking", responseJson);
                    let uDetails = responseJson.result[0].UserDetails[0]
                    this.setState({
                        ChatUserId: uDetails.ChatUserId ? uDetails.ChatUserId : null,
                        linkedData: responseJson.LinkedData.length > 0 ? responseJson.LinkedData : 0,
                        folowersCount: responseJson.result[0].FollowersCount,
                        visitsCount: responseJson.result[0].Visit_Count,
                        footPrintCount: responseJson.result[0].FootprintsCount,
                        businessProfile: responseJson.result[0].UserDetails[0].ProfileType,
                        userName: responseJson.result[0].UserDetails[0].UserName,
                        originalName: responseJson.result[0].UserDetails[0].name,
                        profilePic: responseJson.result[0].UserDetails[0].ProfilePic,
                        verifyProfile: responseJson.result[0].UserDetails[0].VerificationRequest,
                        website: responseJson.result[0].UserDetails[0].Website === 'null' ? '' : responseJson.result[0].UserDetails[0].Website,
                        bio: responseJson.result[0].UserDetails[0].Bio === 'null' ? '' : responseJson.result[0].UserDetails[0].Bio,
                        Consolidate_Like: responseJson.Consolidate_Like,
                        GoldList: responseJson.GoldList,
                        Visit_Count: responseJson.Visit_Count,
                        otherId: responseJson.result[0].UserDetails[0]._id
                    })
                }
            })
            .catch((error) => {
                console.log(error);
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
    async updateFollow() {
        debugger
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: await AsyncStorage.getItem('OtherUserId')
            // "Userid": "5e731fb27fe1f51a7dfe5928",
            // "Otheruserid": "5e6f2ebde44ab376935b4022"
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
                this.setState({
                    checkFollow: responseJson.message,
                    // checkFollow: responseJson.connectionstatus == "True"? true 
                    // : responseJson.connectionstatus == "Pending" ? pending 
                    // : false ,
                })
            })
            .catch((error) => {
            });
    }

    followRequest = async () => {
        var data = {
            Otheruserid: await AsyncStorage.getItem('OtherUserId'),

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
                    this.updateFollow();
                }
            })
            .catch((error) => {
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    };
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
                this.userProfile();
                this.updateFollow();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    async mute() {
        debugger;
        const { muteAcc } = this.state
        this.setState({
            isModalVisible: false,
            muteAcc: !muteAcc
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
                //toastMsg('success', "Account has been blocked")
                // this.getOthersProfile();
            })
            .catch((error) => {

                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    gotoChat = () => {
        debugger;
        const { userName, ChatUserId } = this.state;
        console.log(`chat user name ${userName} and chat user id ${ChatUserId}`)
        if (ChatUserId == null || ChatUserId == 'null') {
            //toastMsg('danger', `${userName} has no specific chat id to chat`)
            return false
        }

        let data = {
            name: userName,
            occupants_ids: ChatUserId,
            ProfilePic: this.state.profilePic
        }
        this.props.navigation.navigate('OneToOneChat', { chatUser: data })
    }

    async follwers() {
        var data = {
            otherid: await AsyncStorage.getItem('OtherUserId'),
            userName: this.state.userName
        }
        this.props.navigation.navigate('OtherFollowers', { data: data })
    }
    async visits() {
        var data = {
            otherid: await AsyncStorage.getItem('OtherUserId'),
            userName: this.state.userName
        }
        this.props.navigation.navigate('OtherVisits', { data: data })
    }

    tagOthers() {
        this.setState({ tab: 1 })
    }

    async tagOtherScreen() {
        // debugger;
        var data = { otherid: await AsyncStorage.getItem('OtherUserId'), }
        this.props.navigation.navigate('TaggedPostOtherUser', { data: data });
    }

    renderToolbarIconsView = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginRight: 8 }}>
                <TouchableOpacity onPress={() => { this.setState({ isModalVisible: true }) }} >
                    <Image style={{ height: 18, width: 18 }}
                  // resizeMode={'center'} 
                     source={require('../../Assets/Images/3dots.png')} />
                </TouchableOpacity>
            </View>
        )
    }

    locationFetch() {
        const { linkedData } = this.state
        const coords = linkedData[0]?.coords && JSON.parse(linkedData[0].coords)
        var data = {
            coords: coords
        }
        // console.log('the loc data',data);
        this.props.navigation.navigate('GetLocation', { data: data })
    }

    render() {
        const { profilePic } = serviceUrl;
        const imagePath = '../../Assets/Images/BussinesIcons/';
        return (
            <Container style={{ flex: 1, marginTop: 0 }}>
                <ScrollView>
                    <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                    <Toolbar {...this.props} userNameTitle={this.state.userName} rightImgView={this.renderToolbarIconsView()} />

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        {this.state.folowersCount > 0 ?
                            <TouchableOpacity onPress={() => this.follwers()}>
                                <View style={styles.text2}>
                                    <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }} onPress={() => this.follwers()}>Follower</Text>
                                    <Text style={{ textAlign: 'center', fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font, }} onPress={() => this.follwers()}>{this.state.folowersCount == undefined || "" || null ? 0 : this.state.folowersCount}</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View style={styles.text2}>
                                <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }} >Follower</Text>
                                <Text style={{ textAlign: 'center', fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font, }} >{this.state.folowersCount == undefined || "" || null ? 0 : this.state.folowersCount}</Text>
                            </View>
                        }
                        <View style={styles.imageView}>
                            {this.state.verifyProfile == "Approved" ? (
                                <View>
                                    {this.state.profilePic == null ? (
                                        <View >
                                            <ImageBackground style={[businessProfileStyle.profile, { width: 100, height: 100, }]} rezizeMode={'stretch'} borderRadius={50}
                                                source={require(imagePath + 'profile.png')}>

                                            </ImageBackground>
                                        </View>)
                                        : (
                                            <View>
                                                <ImageBackground style={[businessProfileStyle.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                                                    source={{ uri: serviceUrl.profilePic + this.state.profilePic }}>
                                                    <Image source={require(imagePath1 + 'TickSmall.png')} style={[businessProfileStyle.verify, { marginLeft: wp('18%') }]} />
                                                </ImageBackground>
                                            </View>
                                        )}
                                </View>
                            ) :
                                (<View>
                                    {this.state.profilePic == null ?
                                        <Image style={[businessProfileStyle.profile, { width: 100, height: 100, }]} rezizeMode={'stretch'}
                                            source={require(imagePath + 'profile.png')}></Image>
                                        :
                                        <Image style={[businessProfileStyle.profile, { width: 100, height: 100, }]} rezizeMode={'stretch'}
                                            source={{ uri: serviceUrl.profilePic + this.state.profilePic }} />}
                                </View>)}

                        </View>
                        {/* <TouchableOpacity onPress={() => this.visits()}> */}
                        <View style={styles.text3}>
                            <Text style={{ fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}>visits</Text>
                            <Text style={{ fontSize: Searchresult.FontSize, fontFamily: Searchresult.Font, color: '#010101', }} >{this.state.visitsCount == undefined || "" || null ? 0 : this.state.visitsCount}</Text>
                        </View>
                        {/* </TouchableOpacity> */}
                    </View>
                    <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-around', }}>
                        <View style={{ width: wp('15%') }} />
                        <View style={{ width: wp('11%'), justifyContent: 'center', alignItems: 'center' }}>
                            <Image rezizeMode={'center'} source={require('../../Assets/Images/new/LIKE-2.png')} style={{ width: wp('7%'), height: hp('4%'), marginTop: wp('5%') }}
                            >
                            </Image>
                            <Text style={{ textAlign: 'center', marginTop: hp('1%') }}>{this.state.Consolidate_Like}</Text>
                        </View>
                        <View style={{ width: wp('11%'), justifyContent: 'center' }}>
                            <Image source={require(imagePath + 'goldicon.png')} style={{ width: wp('7%'), height: hp('4%'), marginTop: wp('5%'), marginLeft: wp('2%') }}>
                            </Image>
                            <Text style={{ textAlign: 'center', marginTop: hp('1%') }}>{this.state.GoldList}</Text>
                        </View>
                        <View style={{ width: wp('15%') }} />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', marginBottom: 10, justifyContent: 'flex-start', marginLeft: wp('5%') }}>
                        <Text style={{ fontSize: Username.FontSize, fontFamily: Username.fontMedium }}>{this.state.originalName == undefined || this.state.originalName == null || this.state.originalName === "" ? "" : this.state.originalName}</Text>
                        <Text style={{ fontSize: Description.FontSize, fontFamily: Description.Font, textAlign: 'left', marginTop: 5, marginBottom: 5, }}>{this.state.bio == undefined || this.state.bio == null || this.state.bio == "" ? "" : this.state.bio}</Text>
                        <Text style={{ fontSize: Description.FontSize, fontFamily: Description.Font, textAlign: 'left', marginTop: 5, marginBottom: 5, }}>{this.state.website == undefined || this.state.website == null || this.state.website == "" ? "" : this.state.website}</Text>
                    </View>

                    {this.state.linkedData === 0 ?
                        <View style={styles.mapView}>
                            <Image source={require(imagePath + 'BuPlMap.png')} style={[styles.BuPlMap, { height: '100%' }]} />
                            <View style={{ backgroundColor: '#000', width: wp('90%'), height: hp('12%'), borderRadius: 18, ...StyleSheet.absoluteFillObject, justifyContent: 'center', opacity: 0.4 }}></View>

                        </View> :
                        <View style={styles.mapView}>
                            <TouchableOpacity onPress={() => this.locationFetch()}>
                                <Image source={require(imagePath + 'BuPlMap.png')} style={[styles.BuPlMap, { height: '100%' }]} />
                            </TouchableOpacity>
                        </View>

                    }
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }}>

                        <TouchableOpacity onPress={() => { this.gotoChat() }}>
                            <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: 30, width: wp('20%'), marginTop: wp('4%'), borderColor: '#448AFF', borderWidth: 1, }}>
                                <Text onPress={() => { this.gotoChat() }} style={{ color: '#448AFF', }}>Message</Text>
                            </View>
                        </TouchableOpacity>

                        {this.state.checkFollow === "Your request was not accepted" ?
                            <View style={{
                                borderRadius: 5, alignItems: 'center', justifyContent: 'center', height: 30, width: wp('30%'), marginTop: wp('4%'), backgroundColor: '#FFF',
                                borderColor: '#4f4f4f', borderWidth: 0.5,
                            }}>
                                <TouchableOpacity onPress={() => this.reqAcc()} style={{ width: '100%', }}>
                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f', }} >Requested</Text>
                                </TouchableOpacity>
                            </View>
                            : null}

                        {this.state.checkFollow === "You follow this user" ?
                            <View style={{
                                borderRadius: 5, alignItems: 'center', justifyContent: 'center', height: 30, width: wp('30%'), marginTop: wp('4%'), backgroundColor: '#FFF',
                                borderColor: '#4f4f4f', borderWidth: 0.5,
                            }}>
                                <TouchableOpacity onPress={() => this.unfollowAcc()} style={[businessProfileStyle.createButton, { marginTop: wp('1.8%') }]}>
                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f', }} >Following</Text>
                                </TouchableOpacity>
                            </View>
                            : null}

                        {this.state.checkFollow != "Your request was not accepted" && this.state.checkFollow != "You follow this user" ?
                            <View style={{ borderRadius: 5, alignItems: 'center', justifyContent: 'center', height: 30, width: wp('30%'), marginTop: wp('4%'), backgroundColor: '#fb0042', }}>
                                <TouchableOpacity onPress={() => this.followRequest()} >
                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow</Text>
                                </TouchableOpacity>
                            </View>
                            : null}


                        <TouchableOpacity onPress={() => this.stories()}>
                            <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 5, height: 30, width: wp('20%'), marginTop: wp('4%'), borderColor: '#448AFF', borderWidth: 1 }}>
                                <Text style={{ color: '#448AFF', }}>Stories</Text>
                            </View>
                        </TouchableOpacity>
                    </View>


                    <Tabs tabBarUnderlineStyle={{ backgroundColor: "#dd374d", }}
                        onChangeTab={this.onchangeTabEvents}
                        tabContainerStyle={{ elevation: 0, }}
                    >
                        <Tab
                            heading={this.title()}
                            tabStyle={{ backgroundColor: "#FFF", }}
                            activeTabStyle={{ backgroundColor: "#FFF" }}
                            textStyle={{ color: "#000000", textAlign: "center", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                            inactiveTextStyle={{ color: "#000000", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                            activeTextStyle={{ color: "#dd374d", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                        >
                            <GetMemoriesOtherUser navigation={this.props.navigation} />
                        </Tab>

                        <Tab
                            heading={this.titleFollwing()}
                            tabStyle={{ backgroundColor: "#FFF", }}
                            activeTabStyle={{ backgroundColor: "#FFF" }}
                            textStyle={{ color: "#000000", textAlign: "center", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                            inactiveTextStyle={{ color: "#000000", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                            activeTextStyle={{ color: "#dd374d", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                        >
                            <TaggedPostOtherUser navigation={this.props.navigation} otherId={this.state.otherId} />
                        </Tab>

                    </Tabs>


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
                                <Text onPress={() => this.followRequest()} style={[styles1.modalText, { color: '#8caafa' }]}>
                                    Follow account
                                </Text>}

                            <View style={styles1.horizontalSeparator} />

                            <View style={{ marginTop: 7, }}>
                                <TouchableOpacity onPress={() => this.block()}>
                                    <Text onPress={() => this.block()} style={[styles1.modalText, { color: '#fb7935' }]}>
                                        {!this.state.accBlock ? "Block" : 'Unblock'} account
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles1.horizontalSeparator} />

                            <View style={{ marginTop: 7, marginBottom: 15 }}>
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

                </ScrollView>


            </Container>
        )
    }
}








