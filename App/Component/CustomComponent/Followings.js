import React, { Component } from 'react';
import { View, Text, Image, ToastAndroid, ScrollView, StyleSheet, KeyboardAvoidingView, ImageBackground, TextInput, FlatList, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
let Common_Api = require('../../Assets/Json/Common.json')
import serviceUrl from '../../Assets/Script/Service';
import Profile_Style from "../../Assets/Styles/Profile_Style"
import Modal from "react-native-modal";
import Common_Style from '../../Assets/Styles/Common_Style'

const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import { Common_Color, TitleHeader, Username, profilename, Description, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import UserView from '../commoncomponent/UserView';


export default class Followings extends Component {


    static navigationOptions = {
        header: null,
    };

    constructor(props) {

        super(props);
        this.state = {
            id: '',
            userName: '',
            followersList: [],
            followList: [],
            follow: 0,
            followButton: true,
            userStatus: '',
            followersCount: '',
            followCount: '',
            UnfollowModal: false,
            otherId: '',
            otherUserPic: null,
            otherUsrname: ''
        }
        this.arrayholder1 = [];
    }

    componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this._getFollower();
            }
        );
    };

    componentWillMount() {
        this._getFollower();
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
    _getFollower = async () => {
        var data = {
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/UserFollowingsList";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    this.setState({
                        followersList: responseJson.followers,
                        followersCount: responseJson.count
                    });
                    this.arrayholder1 = responseJson.followers;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    SearchFilterFunction1(text) {
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
            followersList: newData,
            text: text
        });
    }

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


    subheadings = () => {
        const { followCount } = this.state;
        // if (followCount > 0) {
        if (this.state.followList != null || "" || undefined) {
            return (
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10, }}>

                    </View>
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

    unfollowAcc(data) {
        debugger
        console.log("Unfollw modal data", data);
        this.setState({
            UnfollowModal: true,
            otherId: data._id,
            otherUserPic: data.ProfilePic,
            otherUsrname: data.UserName
        })
    }
    async unfollow() {
        // debugger;
        this.setState({ UnfollowModal: false })
        var data = {
            // Userid: "5e1993a35f1480407aa46430"
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: this.state.otherId
        };
        const url = serviceUrl.been_url + "/Unfollow";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this._getFollower();
            })
            .catch((error) => { });
    }

    renderRightImgdone() {
        return <View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
            </TouchableOpacity>
        </View>
    }

    getRenderView(item) {
        return <View style={[Common_Style.StatusView, { width: '100%' }]}>
            <TouchableOpacity onPress={() => this.unfollowAcc(item)} style={{ width: '100%', }}>
                <View style={Common_Style.FollowingStatus}>
                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Following</Text>
                </View>
            </TouchableOpacity>
        </View>
    }

    render() {
        const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
        const { profilePic } = serviceUrl;
        const { followersList } = this.state
        return (

            <View style={{ flex: 1, }}>

                {this.subheadings()}

                {typeof followersList !== undefined && followersList.length > 0 ?
                    <FlatList
                        data={followersList}
                        renderItem={({ item, index }) => (
                            <View key={`id${index}`} style={{ flexDirection: 'row', }}>
                                <UserView userName={item.UserName} surName={item.name} onPress={() => this.OtheruserDashboard(item)} isVerifyTick={item.VerificationRequest} profilePic={item.ProfilePic} rightView={this.getRenderView(item)} />
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    /> :
                    <View style={styles.hasNoMem}>
                        <Image source={require('../../Assets/Images/Screenshot_1575975832.png')}
                            style={{ width: 100, height: 100, marginBottom: 20, }} 
                   resizeMode={'center'} 
                            />
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#000' }}>No Followers to show yet!</Text>
                    </View>}

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

const styles = StyleSheet.create({
    textInput: { borderWidth: 1, width: '96%', borderColor: '#e1e1e1', height: hp('6%'), borderRadius: 10, paddingLeft: '8%', fontFamily: Common_Color.fontMedium, backgroundColor: '#ebebeb' },
    searchBar: { alignItems: 'center', marginTop: hp('2.5%'), marginBottom: hp('2%') },
    text: { marginBottom: 'auto', fontSize: 16, color: '#000', },
    modalView1: { width: wp('90%'), height: hp('35%'), backgroundColor: '#fff', borderRadius: 15 },
    hasNoMem: { justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
    openModalView: { width: '100%', backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignContent: 'center' },
})

