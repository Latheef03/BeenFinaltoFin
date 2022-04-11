import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Text, StatusBar, Image, ImageBackground, TextInput, FlatList, ToastAndroid } from 'react-native';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spinner } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Header, Left } from 'native-base'
import plannerStyles from './styles/plannerStyles';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import Modal from "react-native-modal";
import common_styles from "../../Assets/Styles/Common_Style"
import styles1 from '../../styles/NewfeedImagePost';
import { toastMsg } from '../../Assets/Script/Helper';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import Profile_Style from "../../Assets/Styles/Profile_Style"
import UserView from '../commoncomponent/UserView';

var id1 = "";

export default class PeopleGoing extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            requestData: [],
            group: "",
            AdminId: "",
            search: '',
            reqId: '',
            other: ''
        }
        this.arrayholder = [];
    }
    async UNSAFE_componentWillMount() {
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({ AdminId: id1 })
        const Comments = this.props.route.params.data
        this.setState({ group: Comments.groupi, });
        this.fetchDetails();
    }
    async componentDidMount() {
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({ AdminId: id1 })
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.fetchDetails();
            }
        );
    };

    fetchDetails = async () => {
        // debugger;
        id1 = await AsyncStorage.getItem("userId");
        var data = { groupId: this.state.group, userId: id1 };
        const url = serviceUrl.been_url1 + "/GroupMembersList";
        fetch(url, {
            method: 'POST',
            headers: serviceUrl.headers,
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    console.log("response Json requsr List", responseJson);
                    this.setState({ requestData: responseJson.result })
                    this.arrayholder = responseJson.result;
                }
                else {
                    this.setState({ requestData: "", })
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
    }

    followRequest = async (item) => {
        const { requestData } = this.state
        var data = {
            Otheruserid: item._id,
            Userid: await AsyncStorage.getItem('userId')
        };
        item.Status = item.PrivateAccount == 'Private' ? 'Pending' : 'following';
        const index = requestData.findIndex(m => m._id == item._id);
        requestData[index] = item
        this.setState({ requestData })
        const url = serviceUrl.been_url + "/SendFollowReq";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status !== 'True') {
                    const index = requestData.findIndex(m => m._id == item._id);
                    delete requestData[index].Status
                    this.setState({ requestData })
                }
            })
            .catch((error) => {
                console.log(error);
                const index = requestData.findIndex(m => m._id == item._id);
                delete requestData[index].Status
                this.setState({ requestData })
            });
    };

    async reqCancel() {
        const { requestData, reqId } = this.state;
        this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            reqId: this.state.reqId,
            Status: "Cancel"
        };
        let otherStatus = reqId.Status;
        const index = requestData.findIndex(m => m.reqId == reqId.reqId);
        delete requestData[index].Status
        this.setState({ requestData, RequestModal: false });
        const url = serviceUrl.been_url + "/AcceptOrDelete";
        fetch(url, {
            method: 'POST',
            headers: serviceUrl.headers,
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status !== "True") {
                    reqId.Status = otherStatus
                    requestData[index] = reqId
                    this.setState({ requestData })
                }
            })
            .catch((error) => {
                console.log("Catch Error", error);
                reqId.Status = otherStatus
                requestData[index] = reqId
                this.setState({ requestData })
            });
    }

    async unfollow() {
        const { requestData, other } = this.state;
        this.setState({ isModalVisible: false, isModalVisible1: false, isModalVisible2: false, UnfollowModal: false })
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: other._id
        };
        const url = serviceUrl.been_url + "/Unfollow";
        let Status = other.Status;
        const index = requestData.findIndex(m => m._id == other._id);
        delete requestData[index].Status
        this.setState({ requestData });
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status !== 'True') {
                    other.Status = Status;
                    requestData[index] = other
                    this.setState({ requestData });
                }
            })
            .catch((error) => {
                other.Status = Status;
                requestData[index] = other
                this.setState({ requestData });
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    SearchFilterFunction(text) {
        const newData = this.arrayholder.filter(function (item) {
            const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            requestData: newData,
            text: text
        });
    }

    unfollowAcc(dat) {
        this.setState({ UnfollowModal: true, other: dat, otherUserPic: dat.ProfilePic, otherUsrname: dat.UserName })
    }

    reqAcc(dat) { this.setState({ RequestModal: true, reqId: dat }) }

    async OtheruserDashboard(item) {
        // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: item._id
        };
        const url = serviceUrl.been_url2 + "/OtherUserStatus";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
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
    }

    render() {
        const { profilePic } = serviceUrl;
        return (
            <View style={{ width: wp('100%'), height: hp('100%'), marginTop: 0, marginBottom: 10,backgroundColor:'#fff' }}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} />

                <View style={Common_Style.TextHeader}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../Assets/Images/new/GoingIcon.png')} resizeMode={'stretch'} style={Common_Style.requestImage} />
                    </View>
                    <View style={{ marginTop: hp('1%') }}>
                        <Text style={{ textAlign: 'center', fontSize: Username.FontSize, }}>{this.state.requestData.length} People going </Text>
                    </View>
                </View>
                <View style={Common_Style.Search}>
                    <TextInput value={this.state.text} onChangeText={text => this.SearchFilterFunction(text)} autoCorrect={false}
                         style={Common_Style.searchTextInput} placeholder={'Search '} placeholderTextColor={'#6c6c6c'}></TextInput>
                </View>

                <FlatList
                    style={{ marginBottom: 60 }}
                    data={this.state.requestData}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item, index }) => (
                        <View key={`id${index}`} style={{ flexDirection: 'row', }}>
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
                            <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }} borderRadius={10}>
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
    search: { borderWidth: 1.5, width: '90%', borderColor: '#e1e1e1', height: hp('6%'), borderRadius: 30, paddingLeft: '8%', fontFamily: Common_Color.fontBold },
    unBlockImg: { width: '80%', height: '77%', backgroundColor: '#f23f32', marginTop: hp('2%'), borderRadius: 1 },
    userName: { width: '50%', marginLeft: wp('7%'), height: hp('5%'), marginTop: hp('2.1%') },
}