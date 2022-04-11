import React, { Component } from 'react'
import {
    View, StyleSheet, Image, ImageBackground, Text,
    StatusBar, FlatList, TouchableOpacity, ToastAndroid
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../../Assets/Script/Service';
const imagePath = '../../../Assets/Images/'
const imagePath1 = '../../../Assets/Images/BussinesIcons/'
import Profile_Style from "../../../Assets/Styles/Profile_Style"
import Common_Style from '../../../Assets/Styles/Common_Style'
import Modal from "react-native-modal";

import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../../Assets/Colors'
var id1 = ''
export default class SearchAccounts extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            id: '',

            getAccount: [], reqId: '', other: ''

        }
        this.arrayholder1 = [];
    }


    componentDidMount() {
        this.getPlace();
    }

    async reqCancel() {
        const { getAccount, reqId } = this.state;
        this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false, RequestModal: false })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            reqId: reqId.reqId,
            Status: "Cancel"
        };
        console.log('the other ids', reqId.Status);
        let otherStatus = reqId.Status;
        const index = getAccount.findIndex(m => m.reqId == reqId.reqId);
        delete getAccount[index].Status
        this.setState({ getAccount });

        const url = serviceUrl.been_url + "/AcceptOrDelete";

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('the rqcan', responseJson);
                if (responseJson.status !== "True") {
                    reqId.Status = otherStatus
                    getAccount[index] = reqId
                    this.setState({ getAccount })
                    //toastMsg("success", "Request has been rejected")
                }
            }).catch((error) => {
                reqId.Status = otherStatus
                getAccount[index] = reqId
                this.setState({ getAccount })
                console.log("Catch Error", error);
            });
    }

    async unfollow() {
        const { other, getAccount } = this.state;
        this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false })
        let data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: other._id
        };

        console.log('the data', data);

        let Status = other.Status

        const index = getAccount.findIndex(m => m._id == other._id);
        delete getAccount[index].Status
        this.setState({ getAccount });

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
                console.log('the unfollow res', responseJson);
                if (responseJson.status !== "True") {
                    other.Status = Status;
                    getAccount[index] = other
                    this.setState({ getAccount });
                }
                //toastMsg('success', responseJson.message)
                //this.getPlace();
            })
            .catch((error) => {
                other.Status = Status;
                getAccount[index] = other
                this.setState({ getAccount });
                console.log(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }

    unfollowAcc(dat) {
        // console.log('the old modal',dat);
        this.setState({
            UnfollowModal: true,
            other: dat
        })
    }

    reqAcc(dat) {
        console.log('the old modal', dat);
        this.setState({
            RequestModal: true,
            reqId: dat
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
        const { getAccount } = this.state;
        console.log('the follwww', item);

        var data = {
            Otheruserid: item._id,
            // Status: 'Pending',
            Userid: await AsyncStorage.getItem('userId')
        };
        item.Status = item.PrivateAccount == 'Private' ? 'Pending' : 'following';
        const index = getAccount.findIndex(m => m._id == item._id);
        getAccount[index] = item
        this.setState({ getAccount })

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
                if (responseJson.status !== 'True') {
                    const index = getAccount.findIndex(m => m._id == item._id);
                    delete getAccount[index].Status
                    this.setState({ getAccount })
                }
            })
            .catch((error) => {
                console.log(error);
                const index = getAccount.findIndex(m => m._id == item._id);
                delete getAccount[index].Status
                this.setState({ getAccount })
            });
    };

    getPlace = async () => {
        // debugger;
        this.setState({
            isLoading: true
        });
        var id1 = await AsyncStorage.getItem('userId')
        var data = {
            userId: id1,
            tab: 'searchAcc'
        };

        const url = serviceUrl.been_url1 + "/SearchList";
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
                console.log('the search ac datas', responseJson);
                if (responseJson.status == 'True') {
                    this.setState({
                        getAccount: responseJson.Account
                    });

                    this.arrayholder1 = responseJson.Account;
                }
            })
            .catch((error) => {
                //console.error("Error", error);
            });
    };

    SearchFilterFunction(text) {
        // debugger;
        //passing the inserted text in textinput
        const newData = this.arrayholder1.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            getAccount: newData,
            text: text
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                {/* <View style={{ width: wp('100%'), height: hp('80%') }}> */}
                <FlatList
                    style={{ marginBottom: 15 }}
                    data={this.state.getAccount}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item, index }) => (
                        <View key={`id${index}`} style={{ flexDirection: 'row', }}>
                            {/* <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}> */}
                            {/* <View style={{...Profile_Style.likeView,height: hp(8),}}> */}
                            <View style={Profile_Style.likeView}>
                                <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}>
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
                                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'cover'}
                                                        source={require(imagePath + 'profile.png')}></Image>
                                                    :
                                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'cover'}
                                                        source={{ uri: serviceUrl.profilePic + item.ProfilePic }} />}
                                            </View>)}


                                        <TouchableOpacity style={{ width: wp('55%'), height: 45 }}
                                            onPress={() => this.OtheruserDashboard(item)}>
                                            <View style={Common_Style.nameParentView}>
                                                <View style={Common_Style.nameView}>
                                                    <Text style={Common_Style.nameText1} >{item.UserName}</Text>
                                                    <Text style={Common_Style.nameText2} >{item.name != "null" && item.name != null &&
                                                        item.name != "undefined" && item.name != undefined ?
                                                        item.name
                                                        :
                                                        null
                                                    }
                                                    </Text>
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
                            {/* </TouchableOpacity> */}
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={(<View style={{ backgroundColor: '#FFF', height: 10 }}></View>)}
                />

                {/* </View> */}


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

                            <ImageBackground source={require('../../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                borderRadius={10}
                            >
                                <TouchableOpacity onPress={() => { this.reqCancel() }}>
                                    <Text onPress={() => { this.reqCancel() }} style={[Common_Style.Common_btn_txt, { marginTop: 12, }]}>Yes</Text>
                                </TouchableOpacity>
                            </ImageBackground>

                        </View>
                        <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
                            <TouchableOpacity style={{ width: wp(88) }} onPress={() => { this.setState({ RequestModal: false }) }}>

                                <Text onPress={() => { this.setState({ RequestModal: false }) }} style={[Common_Style.Common_btn_txt,
                                { color: Common_Color.common_black, width: wp(88), padding: 8, alignItems: 'center', justifyContent: 'center', }]}>
                                    No
                                </Text>
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


                        <View style={{ justifyContent: 'center', alignContent: 'center', marginTop: 10 }}>
                            {this.state.other.ProfilePic === null ? <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                source={require('../../../Assets/Images/profile.png')} /> :
                                <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                    source={{ uri: serviceUrl.profilePic + this.state.other.ProfilePic }} />}

                            {/* <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold }]}></Text> */}
                            <View >
                                <Text style={{ color: '#fff', marginTop: 25, textAlign: 'center', marginBottom: 15, fontSize: 15, fontFamily: UnameStory.Font }}>
                                    Are you sure want to unfollow
                                <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold, color: '#fff', fontSize: 15, }]}> {this.state.other.UserName}</Text> ?
                                    </Text>
                            </View>
                        </View>


                        <View style={[Common_Style.Common_button, { width: wp(88), margin: 3 }]}>

                            <ImageBackground source={require('../../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
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
        );
    }
}

const styles = StyleSheet.create({
    openModalView: { width: '100%', backgroundColor: '#fff', borderRadius: 15, margin: 5, justifyContent: 'center', alignContent: 'center' },
})












