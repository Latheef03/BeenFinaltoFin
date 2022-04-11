import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar, TextInput } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import common_styles from "../../Assets/Styles/Common_Style"
import Profile_Style from "../../Assets/Styles/Profile_Style"
import { toastMsg } from '../../Assets/Script/Helper';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
import Common_Style from '../../Assets/Styles/Common_Style';
import styles1 from '../../styles/NewfeedImagePost';
import Modal from "react-native-modal";
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
var id1 = "";
export default class SwitchProfile extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            data: '',
            postID: '',
            getLikes: '',
            // screenName: '',
            search: '',
            UnfollowModal: false,
            RequestModal: false,
            reqId: '', other: '',
            UNew: ''

        }
        this.arrayholder = [];
    }


    componentDidMount = async () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getswitchacc();
                this.onload();
            }
        );
    };


    async onload() {
        var UNew = await AsyncStorage.getItem('userIdForSwitch');
        this.setState({
            UNew: UNew
        })
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
    SearchFilterFunction(text) {
        // debugger;
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.Name ? item.Name.toUpperCase() : "".toUpperCase();
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



    getswitchacc = async () => {
        // debugger;
        this.setState({ isLoading: true });
        id1 = await AsyncStorage.getItem('userIdForSwitch')
        id2 = await AsyncStorage.getItem('ChnguserId')
        var data = {
            OwnerId: id1,
            "switchTo": id1 == id2 || id2 == null ? "Owner" : ""
            // "switchTo": await AsyncStorage.getItem('userId') == await AsyncStorage.getItem('userIdForSwitch') ? "Owner" : ""
        };
        const url = serviceUrl.been_url1 + "/SwitchProfileList";
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

    async RemoveSwitchProfile(dat) {
        // debugger;
        var data = {
            OwnerId: await AsyncStorage.getItem('userId'),
            AddedUser: dat.userId,
        };
        // AsyncStorage.setItem('userId', dat.userId != null ? dat.userId : "");
        const url = serviceUrl.been_url + "/RemoveSwitchAccount";
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
                this.getswitchacc();
                // this.props.navigation.navigate('Map');
                // if (responseJson.status == 'True') {
                //     ToastAndroid.show("Request has been sent", ToastAndroid.LONG)
                //     this.getLikes();
                //     // this._getFollow();
                //     // this._getFollower();
                // }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async switchacc(dat) {
        // debugger;
        var data = {
            OwnerId: await AsyncStorage.getItem('userId'),
            AddedUser: dat.userId,
            fcm_device_token: await AsyncStorage.getItem('fcmToken')
        };
        AsyncStorage.setItem('userId', dat.userId != null ? dat.userId : "");
        AsyncStorage.setItem('ChnguserId', dat.userId != null ? dat.userId : "");
        AsyncStorage.setItem('email', dat.email != null ? dat.email : "");
        AsyncStorage.setItem('chatUserPWD', dat.password != null ? dat.password : "");
        AsyncStorage.setItem('chatUserID', dat.chatuserId != null ? dat.chatuserId : "");
        const url = serviceUrl.been_url + "/ChangeSwitchAccount";
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
                this.props.navigation.navigate('Map');
                // if (responseJson.status == 'True') {
                //     ToastAndroid.show("Request has been sent", ToastAndroid.LONG)
                //     this.getLikes();
                //     // this._getFollow();
                //     // this._getFollower();
                // }
            })
            .catch((error) => {
                console.log(error);
            });

    }
    seperator() {
        <View style={{ width: "100%", margin: '5%' }}></View>
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
    render() {
        const { profilePic } = serviceUrl;
        return (
            <View style={[Common_Style.parentViewList, { marginTop: 0, marginBottom: '-3%',backgroundColor:'#fff' }]}>
                <StatusBar backgroundColor="#FFF" barStyle='dark-content' />

                <Toolbar {...this.props} centerTitle='Switch Profile' rightImgView={this.renderRightImgdone()} />

                {/*     
                <View style={Common_Style.Search}>
                    <TextInput onChangeText={text => this.SearchFilterFunction(text)}
                        value={this.state.text} style={Common_Style.searchTextInput} placeholder={'Search '} placeholderTextColor={'#6c6c6c'}></TextInput>
                </View> */}

                <View style={{ height: '70%' }}>
                    <FlatList
                        style={{}}
                        data={this.state.getLikes}
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderItem={({ item, index }) => (
                            <View key={`id${index}`} style={{ flexDirection: 'row', }}>

                                {/* <View0 style={{...Profile_Style.likeView,height: hp(8),}}> */}
                                <View style={Profile_Style.likeView}>
                                    <TouchableOpacity onPress={() => this.switchacc(item)}>
                                        <View style={Common_Style.ImgView}>
                                            {item.VerificationRequest === "Approved" ? (
                                                <View style={Common_Style.avatarProfile}>
                                                    {item.ProfilePic == undefined || null ? (
                                                        <View >
                                                            <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                                                rezizeMode={'cover'} borderRadius={50}
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
                                                onPress={() => this.switchacc(item)}>
                                                <View style={Common_Style.nameParentView}>
                                                    <View style={Common_Style.nameView}>
                                                        <Text style={Common_Style.nameText1} >{item.Name}</Text>
                                                        <Text style={[Common_Style.nameText2, { color: '#777' }]} >{item.name && item.name === undefined || item.name && item.name === null || item.name && item.name === "" || item.name && item.name === "null" || item.name && item.name === "undefined" ? "" : item.name}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={Common_Style.StatusView}>
                                        {this.state.UNew != item.userId ?
                                            <TouchableOpacity onPress={() => this.RemoveSwitchProfile(item)}>
                                                <View style={Common_Style.PendingStatus}>

                                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Remove</Text>

                                                </View>
                                            </TouchableOpacity> : null}
                                    </View>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
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
                                borderRadius={10}>
                                <TouchableOpacity onPress={() => { this.unfollow() }}>
                                    <Text onPress={() => { this.unfollow() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Unfollow</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>

                        <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
                            <TouchableOpacity style={{ width: wp(88), }} onPress={() => { this.setState({ UnfollowModal: false }) }}>
                                <Text onPress={() => { this.setState({ UnfollowModal: false }) }} style={[Common_Style.Common_btn_txt, { color: Common_Color.common_white, alignItems: 'center', justifyContent: 'center', }]}>Cancel</Text>
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