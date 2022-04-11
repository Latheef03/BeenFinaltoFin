import React, { Component } from 'react';
import { View, Text, Image, ToastAndroid, ScrollView, StyleSheet, KeyboardAvoidingView, ImageBackground, TextInput, FlatList, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Title, Content, Header, Footer, FooterTab, Badge, Left, Right, Body } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
let Common_Api = require('../../Assets/Json/Common.json')
import serviceUrl from '../../Assets/Script/Service';
import Profile_Style from "../../Assets/Styles/Profile_Style"
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Modal from "react-native-modal";
import { Toolbar } from '../commoncomponent'
import Common_Style from '../../Assets/Styles/Common_Style'
import common_styles from "../../Assets/Styles/Common_Style"
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import { Common_Color, TitleHeader, Username, profilename, Description, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import UserView from '../commoncomponent/UserView';


export default class Followers extends Component {


    static navigationOptions = {
        header: null,
    };

    constructor(props) {

        super(props);
        this.state = {
            id: '',
            userName: '',
            search: '',
            followersList: '',
            followList: '',
            follow: 0,
            followButton: true,
            userStatus: '',
            followersCount: '',
            followCount: '',
            isModalOpen: false,
            UnfollowModal: false,
            unFollowDatas: {}, other: ''
        }
        this.arrayholder = [];
        this.arrayholder1 = [];
    }

    componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this._getFollow();
            }
        );
    };
    componentWillMount() {
        this._getFollow();
        console.log('This props ',this.props )
       // const Comments = this.props.navigation.getParam('data')
        // const Comments = this.props.navigation.getParam('data')
        // if (Comments != undefined) {
        //     this.setState({
        //         follow: Comments
        //     })
        // }
    }


    seperator() {
        <View style={{ width: "50%", margin: '5%' }}></View>
    }
    //Follower Api Left side Tab
    _getFollow = async () => {
        // debugger;
        var data = { Userid: await AsyncStorage.getItem('userId') };
        const url = serviceUrl.been_url + "/UserFollowersList";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    let userData = responseJson.followings;
                    let userStatus = responseJson.followings;
                    userData && userData.length > 0 && userData.map(moment => {
                        if (moment._id === this.state.id) {
                            moment.userLiked = true;
                        }
                        return moment;
                    });
                    this.setState({

                        followCount: responseJson.count,
                        followList: responseJson.followings,
                    });
                    this.arrayholder = responseJson.followings;

                }
            })
            .catch((error) => {
                console.log(error);
            });
    };


    SearchFilterFunction1(text) {
        const newData = this.arrayholder.filter(function (item) {
            const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            followList: newData,
            text: text
        });
    }

    remove = async (dat) => {
        this.setState({ RequestModal: false, UnfollowModal: false });
        const { followList } = this.state
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            reqId: dat.reqId,
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
                        this._getFollow();
                        //toastMsg("success", "Request has been rejected")
                    }
                }
            })
            .catch((error) => {
                console.log("Catch Error", error);
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

    async unfollowFollower(otherid) {
        // debugger;
        this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false })
        var data = {
            // Userid: "5e1993a35f1480407aa46430"
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: otherid
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
                this._getFollow();
                //toastMsg('success', responseJson.message)
                // this.userProfile();
                // this.updateFollow();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }

    async unfollow(item) {
        console.log('the unfollow')
        const { followList } = this.state;
        this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false })
        var data = {
            // Userid: "5e1993a35f1480407aa46430"
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: item._id
        };
        let Status = item.Status;
        const index = followList.findIndex(m => m._id == item._id);
        followList.splice(index, 1);
        this.setState({ followList });
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
                console.log('the flwlist', responseJson);
                if (responseJson.status !== 'True') {
                    item.Status = Status;
                    followList[index] = item
                    this.setState({ followList });
                }
            })
            .catch((error) => {
                item.Status = Status;
                followList[index] = item
                this.setState({ followList });
                // console.log(error,'\n',error.message);
                toastMsg1('danger', error.message)
            });
    }

    followRequest = async (item) => {
        // console.log('the item ',item);
        const { followList } = this.state;
        var data = {
            Otheruserid: item._id,
            Userid: await AsyncStorage.getItem('userId')
        };
        item.Status = item.PrivateAccount == 'Private' ? 'Pending' : 'following';

        const index = followList.findIndex(m => m._id == item._id);
        followList[index] = item;
        this.setState({ followList })
        // const url = serviceUrl.been_url + "/SendFollowReq"; /old
        const url = serviceUrl.been_url + "/FollowerReq"; 
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status !== 'True') {
                    const index = followList.findIndex(m => m._id == item._id);
                    delete followList[index].Status
                    this.setState({ followList })
                }
            })
            .catch((error) => {
                // console.log(error);
                const index = followList.findIndex(m => m._id == item._id);
                delete followList[index].Status
                this.setState({ followList })
            });
    };

    followOpen() {
        this.setState({
            follow: 1
        })
    }

    openUnFollowModal = (item) => {
        this.setState({
            isModalOpen: true,
            unFollowDatas: item
        })
    }

    unFollowUsers = async (userId) => {
        // debugger;
        this.setState({ isModalOpen: false })
        var data = {
            Otheruserid: userId,
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/Unfollow";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    //toastMsg("success", responseJson.message);
                    this._getFollow();

                }
                else {
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    async OtheruserDashboard(data1) {
        // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: data1._id
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

                if (responseJson.connectionstatus === "True") {
                    AsyncStorage.setItem('OtherUserId', data1._id);
                    var data = { ProfileAs: responseJson.ProfileAs }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                    AsyncStorage.setItem('OtherUserId', data1._id);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                    AsyncStorage.setItem('OtherUserId', data1._id);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1._id);
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

    stateChangeBuuton() {
        this.setState({
            followButton: false
        })
    }

    followerOpen() {
        this.setState({
            follow: 0
        })
    }

    subheadings = () => {
        const { followCount } = this.state;
        if (this.state.followList != null || "" || undefined) {
            return (
                <View >
                    <View style={Common_Style.Search}>
                        <TextInput
                            placeholder='Search'
                            placeholderTextColor={'#6c6c6c'}
                            autoCorrect={false}
                            
                            style={styles.textInput}
                            onChangeText={text => this.SearchFilterFunction1(text)}
                            value={this.state.text}
                            selectionColor='red'
                        />
                    </View>
                </View>
            )
        }

    }

    renderRightImgdone() {
        return <View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
            </TouchableOpacity>
        </View>
    }

    getRenderView(item) {
        // console.log('itemssss',item);
        return <View style={[Common_Style.StatusView, { width: '100%', flexDirection: 'row', marginRight: 65 }]}>
            {item.Status == "Pending" ?
                <View style={{ marginBottom: 5, justifyContent: 'center', paddingRight: 4 }}>
                    <Text onPress={() => this.remove(item)} >Remove</Text>
                </View>
                :
                <View style={{ marginBottom: 5, justifyContent: 'center', paddingRight: 4 }}>
                    <Text onPress={() => this.unfollow(item)} >Remove</Text>
                </View>
            }

            {item.followerfollowings == "Pending" &&
                <View style={Common_Style.PendingStatus}>
                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Requested</Text>
                </View>
            }

            {item.flowing == true ?
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.unfollowAcc(item)}>
                    <View style={Common_Style.FollowingStatus}>
                        <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Following</Text>
                    </View>
                </TouchableOpacity>
                :
                item.Status == "Accept" && item.followerfollowings !== "Pending"?
                    <TouchableOpacity onPress={() => this.followRequest(item)}>
                        <View style={Common_Style.AcceptFollow}>
                            <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    item.Status == "Pending" ?
                        <View style={Common_Style.PendingStatus}>
                            <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Requested</Text>
                        </View>
                        :
                        item.Status == "following" ?
                            <View style={Common_Style.FollowingStatus}>
                                <TouchableOpacity style={{ width: '100%', }} activeOpacity={0.8} onPress={() => this.unfollowAcc(item)} >
                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Following</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            item._id == this.state.id ?
                                <View style={{}}>
                                </View>
                                :
                              item.followerfollowings == "Pending" ?
                              <View style={{}}>
                                </View>
                                :
                                <TouchableOpacity onPress={() => this.followRequest(item)}>
                                    <View style={Common_Style.NewFollow}>
                                        <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow asdasd</Text>
                                    </View>
                                </TouchableOpacity>
            }
        </View>
    }

    render() {
        const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
        const { unFollowDatas, isModalOpen, followList } = this.state;
        const { ProfilePic, _id, UserName, status } = unFollowDatas;
        const { profilePic } = serviceUrl;
        return (

            <View style={{ width: wp('100%'), height: ('100%'), marginTop: 0 }}>

                {this.subheadings()}

                <FlatList
                    data={this.state.followList}
                    extraData={this.state}
                    renderItem={({ item, index }) => (
                        <View key={`id${index}`} style={{ flexDirection: 'row', width: wp('90%'),marginHorizontal:15 }}>
                            {/* {item.Status !== 'Pending' && ( */}
                                <UserView
                                userName={item.UserName}
                                surName={ item.CalculateTime}
                                onPress={() => this.OtheruserDashboard(item)}
                                isVerifyTick={ item.VerificationRequest}
                                profilePic={  item.ProfilePic}
                                rightView={this.getRenderView(item)}
                            />
                            {/* )} */}
                            
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />

                {/* Modal for unfollow */}
                <Modal isVisible={isModalOpen} onBackdropPress={() => this.setState({ isModalOpen: false })}
                    onBackButtonPress={() => this.setState({ isModalOpen: false })} >
                    <View style={styles.modalView1} >
                        {/* <View> */}
                        <View style={{ marginTop: hp('3%'), marginBottom: hp('1.3%') }}>
                            <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                source={{ uri: profilePic + ProfilePic }} />
                        </View>
                        <View>
                            <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 14, marginLeft: 15, marginRight: 15, marginTop: 20, color: '#313131', lineHeight: 20, }}>
                                If you change your mind, you'll have to request to follow
                            <Text style={{ color: '#0c0c0c', fontWeight: 'bold' }}>{` @${UserName}`}</Text> again</Text>
                        </View>

                        <View style={{ marginTop: 30, borderTopWidth: 0.5, borderTopColor: '#969696', }}>
                            <View style={{ flexDirection: 'row', marginTop: 7, marginLeft: 50, marginRight: 50, justifyContent: 'space-between' }}>
                                <Text onPress={() => this.setState({ isModalOpen: false })}
                                    style={{ color: '#0c0c0c', fontWeight: 'bold', padding: 5 }}>Cancel</Text>
                                <View style={{ width: 0.5, padding: 0.5, backgroundColor: '#c5c5c5' }}></View>
                                <Text onPress={() => this.unFollowUsers(_id)} style={{ color: '#0c0c0c', fontWeight: 'bold', padding: 5 }}>Unfollow</Text>

                            </View>
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
                                <TouchableOpacity onPress={() => { this.unfollowFollower(this.state.other) }}>
                                    <Text onPress={() => { this.unfollowFollower(this.state.other) }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Unfollow</Text>
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

const styles = StyleSheet.create({
    textInput: { borderWidth: 1, width: '96%', borderColor: '#e1e1e1', height: hp('6%'), borderRadius: 10, paddingLeft: '8%', fontFamily: Common_Color.fontMedium, backgroundColor: '#ebebeb' },
    searchBar: { alignItems: 'center', marginTop: hp('2.5%'), marginBottom: hp('2%') },
    text: { marginBottom: 'auto', fontSize: 16, color: '#000', },
    modalView1: { width: wp('90%'), height: hp('35%'), backgroundColor: '#fff', borderRadius: 15 },
    hasNoMem: { justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
    openModalView: { width: '100%', backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignContent: 'center' },
})

