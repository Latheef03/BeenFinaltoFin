import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar, TextInput } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Profile_Style from "../../Assets/Styles/Profile_Style"
import { toastMsg } from '../../Assets/Script/Helper';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
import Common_Style from '../../Assets/Styles/Common_Style';
import Modal from "react-native-modal";
import common_styles from "../../Assets/Styles/Common_Style"
import styles1 from '../../styles/NewfeedImagePost';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
var id1 = "";
export default class CommentsLikes extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            data: '',
            postID: '',
            getLikes: '',
            screenName: '',
            search: '', reqId: '', other: ''

        }
        this.arrayholder = [];
    }
    componentWillMount() {
        // debugger;
        this.getLikes();
        this.getBookmarks();
        const {navigation} = this.props
        const Comments = navigation.route?.params?.data || {};
        this.setState({
            postID: Comments.data,
            screenName: Comments.screen,
            likesCount: Comments.likescount
        })
    }
    componentDidMount = async () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getLikes();
                this.getBookmarks();
                const Comments = this.props.route.params.data;
                this.setState({
                    postID: Comments.data,
                    screenName: Comments.screen,
                    likesCount: Comments.likescount
                })
            }
        );
    };

    async reqCancel() {
        // debugger;
        this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            reqId: this.state.reqId,
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
                        this.getLikes();
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
            Otheruserid: this.state.other
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
                this.getLikes();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    unfollowAcc(dat) {
        debugger
        console.log("Unfollw modal data", dat);
        this.setState({
            UnfollowModal: true,
            other: dat._id,
            otherUserPic: dat.ProfilePic,
            otherUsrname: dat.UserName
        })
    }

    reqAcc(dat) {
        this.setState({
            RequestModal: true,
            reqId: dat.reqId
        })
    }
    async OtheruserDashboard(item) {
        // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: item._id
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
                AsyncStorage.setItem('OtherUserId', item._id);
                AsyncStorage.setItem('reqIdForStatus', item.reqId);
                if (responseJson.connectionstatus === "True") {
                    AsyncStorage.setItem('OtherUserId', item._id);
                    AsyncStorage.setItem('reqIdForStatus', item.reqId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('OtherUserId', item._id);
                    AsyncStorage.setItem('reqIdForStatus', item.reqId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('OtherUserId', item._id);
                    AsyncStorage.setItem('reqIdForStatus', item.reqId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        AsyncStorage.setItem('reqIdForStatus', item.reqId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Mismatch") {
                    // this.props.navigation.navigate('Profile')
                    this.profileChanger();
                }
                else {
                }
            })
            .catch((error) => {
            });
    }
    profileChanger = async () => {
        let local;
        // debugger;
        let businessProfile;
        var data = { userId: await AsyncStorage.getItem('userId') };
        const url = serviceUrl.been_url1 + '/UserProfile';
        const getType = await AsyncStorage.getItem('profileType');
        const pType = parseInt(getType);
        const localP = await AsyncStorage.getItem('localProfile');
        console.log('the ptype ', pType, ' and its type ', typeof pType);

        if (localP && localP == "Yes") {
            this.props.navigation.navigate('LocalUserProfile')
        } else if (pType === 2) {
            this.props.navigation.navigate('BusinessPlaceProfile')
        } else {
            console.log('the ptype ', pType, ' and its type profile1 ', typeof pType);
            this.props.navigation.navigate('Profile')
        }

    }

    followRequest = async (item) => {
        //debugger;
        var data = {
            //Userid: "5e1993a35f1480407aa46430",
            Otheruserid: item._id,

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
                    toastMsg('success', "Request has been sent")
                    // ToastAndroid.show("Request has been sent", ToastAndroid.LONG)
                    // this._getFollow();
                    // this._getFollower();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };


    getLikes = async () => {
        // debugger;
        this.setState({ isLoading: true });
        id1 = await AsyncStorage.getItem('userId')
        var data = {
            Userid: id1,
            commentId: this.state.postID
        };
        const url = serviceUrl.been_url1 + "/Commentlikedusers";
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
                if (responseJson.status == 'True') {
                    this.setState({
                        getLikes: responseJson.result
                    });
                    this.arrayholder = responseJson.result;
                }
            })
            .catch((error) => {
                //console.error("Error", error);
            });
    };
    getBookmarks = async () => {
        // debugger;
        this.setState({ isLoading: true });
        var id1 = await AsyncStorage.getItem('userId')
        var data = {
            UserId: id1,
            PostId: this.state.postID
        };
        const url = serviceUrl.been_url1 + "/BookmarkUsersList";
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
                if (responseJson.status == 'True') {
                    this.setState({
                        getLikes: responseJson.result
                    });
                }
            })
            .catch((error) => {
                //console.error("Error", error);
            });
    };


    seperator() {
        <View style={{ width: "100%", margin: '5%' }}></View>
    }
    SearchFilterFunction(text) {
        // debugger;
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            getLikes: newData,
            text: text
        });
    }


    render() {
        const { profilePic } = serviceUrl;
        return (
            <View style={[Common_Style.parentViewList, { marginTop: 0 ,backgroundColor:'#fff'}]}>
                <StatusBar backgroundColor="#0000" barStyle='dark-content' />

                <Toolbar {...this.props} centerTitle='' />

                <View style={Common_Style.TextHeader}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../Assets/Images/new/LIKE-2.png')} resizeMode={'contain'} style={Common_Style.requestImage} />
                    </View>
                    <View style={{ marginTop: hp('1%') }}>
                        <Text style={{ textAlign: 'center', fontSize: Username.FontSize, }}>{this.state.likesCount} Likes</Text>
                        {/* fontFamily: Username.Font,  */}
                    </View>
                </View>
                <View style={Common_Style.Search}>
                    <TextInput onChangeText={text => this.SearchFilterFunction(text)}
                        autoCorrect={false}
                         value={this.state.text} style={Common_Style.searchTextInput} placeholder={'Search '} placeholderTextColor={'#6c6c6c'}></TextInput>
                </View>

                <FlatList
                    style={{ marginBottom: 60 }}
                    data={this.state.getLikes}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', }}>

                            {/* <View style={{...Profile_Style.likeView,height: hp(8),}}> */}
                            <View style={Profile_Style.likeView}>
                                <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}>
                                    <View style={Common_Style.ImgView}>
                                        {item.VerificationRequest === "Approved" ? (
                                            <View style={Common_Style.avatarProfile}>
                                                {item.ProfilePic == undefined || null ? (
                                                    <View >
                                                        <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'} borderRadius={50}
                                                            source={require(imagePath + 'profile.png')}>
                                                            <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                                        </ImageBackground>
                                                    </View>)
                                                    : (
                                                        <View>
                                                            <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'} borderRadius={50}
                                                                source={{ uri: serviceUrl.profilePic + item.ProfilePic }}>
                                                                <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                                                {/* style={businessProfileStyle.verify} /> */}
                                                            </ImageBackground>
                                                        </View>
                                                    )}
                                            </View>
                                        ) :
                                            (<View style={Common_Style.avatarProfile}>
                                                {item.ProfilePic == undefined || null ?
                                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'}
                                                        source={require(imagePath + 'profile.png')}></Image>
                                                    :
                                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'}
                                                        source={{ uri: serviceUrl.profilePic + item.ProfilePic }} />}
                                            </View>)}


                                        <TouchableOpacity style={{ width: wp('55%'), height: 45 }}
                                            onPress={() => this.OtheruserDashboard(item)}>
                                            <View style={Common_Style.nameParentView}>
                                                <View style={Common_Style.nameView}>
                                                    <Text style={Common_Style.nameText1}>{item.UserName}</Text>
                                                    <Text style={Common_Style.nameText2} >{item.name && item.name === undefined || item.name && item.name === null || item.name && item.name === "" || item.name && item.name === "null" || item.name && item.name === "undefined" ? "" : item.name}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                                <View style={Common_Style.StatusView}>
                                    {item.Status == "Accept" ?
                                        <TouchableOpacity onPress={() => this.followRequest(item)}>
                                            <View style={Common_Style.AcceptFollow}>
                                                <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow</Text>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        item.Status == "Pending" ?
                                            <View style={Common_Style.PendingStatus}>
                                                <TouchableOpacity onPress={() => this.reqAcc(item)} style={{ width: '100%', }}>
                                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Requested</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            item.Status == "following" ?
                                                <View style={Common_Style.FollowingStatus}>
                                                    <TouchableOpacity onPress={() => this.unfollowAcc(item)} style={{ width: '100%', }}>
                                                        <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Following</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                item._id == id1 ?
                                                    <View style={{}}>
                                                    </View>
                                                    :
                                                    <TouchableOpacity onPress={() => this.followRequest(item)}>
                                                        <View style={Common_Style.NewFollow}>

                                                            <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow</Text>

                                                        </View>
                                                    </TouchableOpacity>
                                    }

                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />


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
                            {this.state.otherUserPic === null ? <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                source={require('../../Assets/Images/profile.png')} /> :
                                <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                    source={{ uri: profilePic + this.state.otherUserPic }} />}
                        </View>
                        <View >
                            <Text style={{ color: '#fff', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 15, fontFamily: UnameStory.Font }}>
                                Are you sure want to unfollow
                                <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold, color: '#fff', fontSize: 15, }]}>  {this.state.otherUsrname}?</Text>
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



            </View>
        )
    }
}


const block = {
    text: { marginBottom: 'auto', fontSize: 16, color: '#000', },
    avatarProfile: { width: wp(15), height: hp(8.5), borderRadius: 50, margin: 7, justifyContent: 'center', marginTop: 5 },
    unBlockImg: { width: '80%', height: '77%', backgroundColor: '#f23f32', marginTop: hp('2%'), borderRadius: 1 },
    userName: { width: '50%', marginLeft: wp('7%'), height: hp('5%'), marginTop: hp('2.1%') },
}