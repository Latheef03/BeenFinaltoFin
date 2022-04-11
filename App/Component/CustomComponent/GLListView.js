import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar, TextInput } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Profile_Style from "../../Assets/Styles/Profile_Style"
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
import Common_Style from '../../Assets/Styles/Common_Style';
import Modal from "react-native-modal";
import { postServiceP01 } from '../_services'
import UserView from '../commoncomponent/UserView';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'

var id1 = "";
export default class GLListView extends Component {

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
            search: '',
            GoldList: [],
            reqId: '', other: '', id1: '',
            noData: false
        }
        this.arrayholder = [];
    }
    UNSAFE_componentWillMount() {
        // debugger;
       
        const Comments =this.props.route.params.data;
        this.setState({
            GoldList: Comments.GoldList,
            GoldListCount: Comments.GoldListCount,
            screenName: Comments.screen
        })
        this.arrayholder = Comments.GoldList;
        this.get();
    }

    componentDidMount = async () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
              
                const Comments = this.props.route.params.data;
                this.setState({
                    GoldList: Comments.GoldList,
                    GoldListCount: Comments.GoldListCount,
                    screenName: Comments.screen
                })
                this.arrayholder = Comments.GoldList;
                this.get();
            }
        );
    };

    async get() {
        this.setState({
            id1: await AsyncStorage.getItem('userId')
        })
    }


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
                        // this.getLikes();
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
                toastMsg('success', responseJson.message)
                // this.getLikes();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }

    unfollowAcc(dat) {
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

    followRequest = async (dat) => {
        // debugger;
        const { GoldList } = this.state;
        const index = GoldList.findIndex(GL => GL._id == dat._id)
        GoldList[index] = { ...GoldList[index], Status: "Pending" }
        this.setState({ GoldList })
        const apiname = 'SendFollowReq'
        var data = {
            //Userid: "5e1993a35f1480407aa46430",
            Otheruserid: dat._id,
            Status: 'Pending',
            Userid: await AsyncStorage.getItem('userId')
        };
        let subscribe = true;
        postServiceP01(apiname, data).then(res => {
            if (responseJson.status == 'True' && subscribe) {
                toastMsg('success', "Request has been sent")
                // ToastAndroid.show("Request has been sent", ToastAndroid.LONG)
            }
            else {
                const index = GoldList.findIndex(GL => GL._id == dat._id)
                delete GoldList[index].Status
                this.setState({ GoldList })
                toastMsg1('danger', "Sorry,Couldn't request...")
                //ToastAndroid.show("Sorry,Couldn't request...", ToastAndroid.LONG)
            }
            return () => (subscribe = false)
        })
            .catch((error) => {
                console.log(error);
                const index = GoldList.findIndex(GL => GL._id == dat._id)
                delete GoldList[index].Status
                this.setState({ GoldList })
                toastMsg1('danger', "Sorry,Couldn't request...")
                //ToastAndroid.show("Sorry,Couldn't request...", ToastAndroid.LONG)
            });

    };

    SearchFilterFunction(text) {
        console.log("Search item is", text)
        // debugger;
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        if (Array.isArray(newData)) {
            this.setState({
                noData: false,
                GoldList: newData,
                text: text
            })

        }
        if (!Array.isArray(newData) && !newData.length) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noData: true
            })
        }

    }


    seperator() {
        <View style={{ width: "100%", margin: '5%' }}></View>
    }

    getRenderView(item) {
        return <View style={[Common_Style.StatusView, { width: '100%' }]}>

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
                        item._id === this.state.id1 ?
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
    }

    render() {
        const { profilePic } = serviceUrl;
        return (
            <View style={[Common_Style.parentViewList, { marginBottom: 0 }]}>
                <StatusBar backgroundColor="#0000" barStyle='dark-content' />

                <Toolbar {...this.props} centerTitle='' />

                <View style={Common_Style.TextHeader}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../Assets/Images/BussinesIcons/gIcon.png')} resizeMode={'contain'} style={Common_Style.requestImage} />
                    </View>
                    <View style={{ marginTop: hp('1%') }}>
                        <Text style={{ textAlign: 'center', fontSize: Username.FontSize, fontFamily: Username.Font, }}>
                            {this.state.GoldListCount} GoldList
                        </Text>
                    </View>
                </View>
                <View style={Common_Style.Search}>
                    {this.state.GoldList.length > 0 ?
                        <TextInput value={this.state.text}
                            onChangeText={text => this.SearchFilterFunction(text)}
                            autoCorrect={false}
                            
                            style={Common_Style.searchTextInput} placeholder={'Search '} placeholderTextColor={'#6c6c6c'} />
                        :
                        <TextInput value={this.state.text}
                            autoCorrect={false}
                            onChangeText={text=>this.setState({ text: text})}
                            
                            style={Common_Style.searchTextInput} placeholder={'Search '} placeholderTextColor={'#6c6c6c'} />}
                </View>

                <FlatList
                    data={this.state.GoldList}
                    ListFooterComponent={<View style={{ height: 10 }} />}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', }}>
                            <UserView userName={item.UserName} surName={item.name} onPress={() => this.OtheruserDashboard(item)} isVerifyTick={item.VerificationRequest} profilePic={item.ProfilePic} rightView={this.getRenderView(item)} />
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