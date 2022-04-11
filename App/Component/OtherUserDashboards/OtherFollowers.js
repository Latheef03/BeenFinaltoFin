import React, { Component } from 'react';
import { View, Text, Image, ToastAndroid, ScrollView, StyleSheet, KeyboardAvoidingView, ImageBackground, TextInput, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Title, Content, Header, Footer, FooterTab, Badge, Left, Right, Body } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
let Common_Api = require('../../Assets/Json/Common.json')
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import Modal from "react-native-modal";
import { Toolbar } from '../commoncomponent'
import Common_Style from '../../Assets/Styles/Common_Style'
import Profile_Style from "../../Assets/Styles/Profile_Style"
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import UserView from '../commoncomponent/UserView'

const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'

export default class OtherFollowers extends Component {

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
            followCount: 0,
            isModalOpen: false,
            unFollowDatas: {},
            otherid: "", idUser: ''
        }
        this.arrayholder = [];
        this.arrayholder1 = [];
    }

    UNSAFE_componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.onLoad();
                this._getFollower();
                this._getFollow();
            }
        );
    };
    UNSAFE_componentWillMount() {
       
        const Comments = this.props.route.params?.data
        this.setState({
            otherid: Comments.otherid,
            userName: Comments.userName
        });
        this.onLoad();
        this._getFollower();
        this._getFollow();
    }

    onLoad = async () => {
        // var userId = await AsyncStorage.getItem('userId');
        var name = await AsyncStorage.getItem('name');
        var email = await AsyncStorage.getItem('email');
        var name1 = await AsyncStorage.getItem('Originalname');
        var profilePic = await AsyncStorage.getItem('ProfilePic');
        var website = await AsyncStorage.getItem('website');
        var bio = await AsyncStorage.getItem('bio');
        var idUser1 = await AsyncStorage.getItem('userId');
        this.setState({
            idUser: idUser1
        })
    }

    seperator() {
        <View style={{ width: "50%", margin: '5%' }}></View>
    }

    // Get Follow Api right Tab
    _getFollower = async () => {
       // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            followedId: this.state.otherid
        };
        const url = serviceUrl.been_url + "/UserFollowingsList";
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

    //Follower Api Left Tab
    _getFollow = async () => {
       // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            followedId: this.state.otherid
        };
        const url = serviceUrl.been_url + "/UserFollowersList";
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
                    let userData = responseJson.followings;
                    let userStatus = responseJson.followings;
                    userData && userData.length > 0 && userData.map(moment => {
                        if (moment._id === this.state.id) {
                            moment.userLiked = true;
                        }
                        return moment;
                    });
                    this.setState({

                        followCount: responseJson.count == undefined ? 0 : responseJson.count,
                        followList: responseJson.followings ? responseJson.followings : '',
                    });
                    this.arrayholder = responseJson.followings;

                }
            })
            .catch((error) => {
                //console.error(error);
            });
    };

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
            followList: newData,
            text: text
        });
    }


    followRequest = async (item) => {
        const { followList } = this.state;
       // debugger;
        var data = {
            Otheruserid: item._id,
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/SendFollowReq";
        item.Status = item.PrivateAccount && item.PrivateAccount == 'Private' ? 'Pending' : item.Status;
        if(!item.PrivateAccount){
          item.flowing = true
        }
        const index = followList.findIndex(m => m._id == item._id);
        followList[index] = item;
        this.setState({ followList })
        console.log('the items foolow req',item);
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('followRequest res', responseJson);
                if (responseJson.status == 'True') {
                    // toastMsg('success', "Request has been sent")
                    //ToastAndroid.show("Request has been sent", ToastAndroid.LONG)
                    // this._getFollow();
                }
            })
            .catch((error) => {
                console.log(error);
                if (!item.PrivateAccount) {
                    item.flowing = false
                }
                const index = followList.findIndex(m => m._id == item._id);
                delete followList[index].Status
                followList[index] = item;
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

    unFollowUsers = (userId) => {
        this.setState({
            isModalOpen: false
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
                //     if (responseJson.connectionstatus === "True") {
                //         AsyncStorage.setItem('OtherUserId', item._id);
                //         var data = {
                //             ProfileAs: responseJson.ProfileAs
                //         }
                //         this.props.navigation.navigate('OtherUserProfile', { data: data })
                //     }
                //     else if (responseJson.connectionstatus === "Pending") {
                //         AsyncStorage.setItem('OtherUserId', item._id);
                //         this.props.navigation.navigate('OtherUserProfile')
                //     }
                //     else if (responseJson.connectionstatus === "Mismatch") {
                //         this.props.navigation.navigate('Profile')
                //     }
                //     else if (responseJson.connectionstatus === "False") {
                //         AsyncStorage.setItem('OtherUserId', item._id);
                //         this.props.navigation.navigate('OtherUserProfile')
                //     }
                //     else {
                //         //toastMsg('success', responseJson.message)
                //     }
                // })
                // .catch((error) => {
                //     // //console.error(error);
                //     //toastMsg('danger', 'Sorry..something network error.Try again please.')
                // });
                if (responseJson.connectionstatus === "True") {
                    AsyncStorage.setItem('OtherUserId', item._id);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('OtherUserId', item._id);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('OtherUserId', item._id);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item._id);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item._id);
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
        const url = serviceUrl.been_url1+'/UserProfile';
        const getType = await AsyncStorage.getItem('profileType');
        const pType = parseInt(getType);
        const localP = await AsyncStorage.getItem('localProfile');
        console.log('the ptype ',pType,' and its type ',typeof pType);
    
        if(localP && localP == "Yes"){
          this.props.navigation.navigate('LocalUserProfile')
        }else if(pType === 2){
          this.props.navigation.navigate('BusinessPlaceProfile')
        }else{
          console.log('the ptype ',pType,' and its type profile1 ',typeof pType);
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


    followDatas = () => {
        if (this.state.followCount === 0) {
            // if(this.state.follow === 0 && this.state.followersList.length === 0){
            return (
                <View style={styles.hasNoMem}>
                    <Image source={require('../../Assets/Images/Screenshot_1575975832.png')}
                        style={{
                            width: 100, height: 100, marginBottom: 20,
                        }}
                    resizeMode={'center'}
                    />
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#000' }}>No Followers to show yet!</Text>

                </View>
            )
        }
    }

    subheadings = () => {
        const { followCount } = this.state;
        if (followCount > 0) {
            return (
                <View>
                    <View style={{ flexDirection: 'row', marginTop: '3%', justifyContent: 'space-between', marginLeft: 10, marginRight: 10 }}>
                        <View style={{ width: wp('3%') }} />
                    </View>

                    {this.state.follow != 1 ?
                   
                        <View style={[Common_Style.TextHeader,{alignItems: 'center',marginTop: hp('0%')}]}>
                            <TextInput
                                placeholder='Search'
                                placeholderTextColor={'#6c6c6c'}
                                autoCorrect={false}
                                //  keyboardType="visible-password"
                                underlineColorAndroid="transparent"
                                onChangeText={text => this.SearchFilterFunction(text)}
                                value={this.state.text}
                                selectionColor='red'
                                style={styles.textInput} />
                        </View>
                   :null }
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
        return <View style={Common_Style.StatusView}>
            {
                item._id == this.state.idUser ?
                    <View style={{}}>
                    </View>
                    :
                    item.flowing == true ?
                        <View style={Common_Style.FollowingStatus}>
                            {/* <TouchableOpacity onPress={() => this.unfollowAcc(item)} style={{ width: '100%', }}> */}
                            <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Following</Text>
                            {/* </TouchableOpacity> */}
                        </View>
                        :


                        item.Status == "Accept" ?
                            <TouchableOpacity onPress={() => this.followRequest(item)}>
                                <View style={Common_Style.AcceptFollow}>
                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow</Text>
                                </View>
                            </TouchableOpacity>
                              :
                            item.Status == "Pending" ?
                                <View style={Common_Style.PendingStatus}>
                                    {/* <TouchableOpacity onPress={() => this.reqAcc(item)} style={{ width: '100%', }}> */}
                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Requested</Text>
                                    {/* </TouchableOpacity> */}
                                </View>
                                :


                                <TouchableOpacity onPress={() => this.followRequest(item)} style={{ width: '100%', height: '100%', }}>
                                    <View style={Common_Style.NewFollow}>

                                        <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Follow</Text>

                                    </View>
                                </TouchableOpacity>
            }

        </View>
        // </View>
    }   

    render() {
        const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
        const { unFollowDatas, isModalOpen } = this.state;
        const { ProfilePic, _id, UserName, status } = unFollowDatas;
        const { profilePic } = serviceUrl;
        return (

            <View style={{ width: wp('100%'), height: ('100%'),marginTop:0 ,backgroundColor:'#fff'}}>
                {/* header of screen */}
                <Toolbar {...this.props} centerTitle={this.state.followCount != 0 ?this.state.followCount + " Followers"  : "Followers"}   rightImgView={this.renderRightImgdone()} />

                {this.followDatas()}

                {this.subheadings()}


                {this.state.follow == 1 ?

                    <Content >


                    </Content>

                    :

                    ///Left tab of Follow Lists                       
                    <Content >

                        <FlatList
                            style={{}}
                            data={this.state.followList}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            renderItem={({ item, index }) => (
                                <View key={`id${index}`} style={{ flexDirection: 'row', }}>

                                    <UserView 
                                        userName={item.UserName} 
                                        surName={item.name} 
                                        onPress={()=>this.OtheruserDashboard(item)} 
                                        isVerifyTick={item.VerificationRequest} 
                                        profilePic={item.ProfilePic} 
                                        rightView={this.getRenderView(item)} 
                                    />
                                        
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    </Content>


                }

                {/* Modal for unfollow */}
                <View style={{ alignItem: 'center', justifyContent: 'center' }}>
                    <Modal isVisible={isModalOpen} onBackdropPress={false}
                        onBackButtonPress={() => this.setState({ isModalOpen: false })} >
                        <View style={styles.modalView1} >
                            <View>
                                <View style={{ marginTop: hp('3%'), marginBottom: hp('1.3%') }}>
                                    <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                        source={{ uri: profilePic + ProfilePic }} />
                                </View>
                                <View>
                                    <Text style={{
                                        alignSelf: 'center', textAlign: 'center', fontSize: 14, marginLeft: 15, marginRight: 15, marginTop: 20, color: '#313131', lineHeight: 20,
                                    }}>
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
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: { borderWidth: 1, width: '96%', borderColor: '#e1e1e1', height: 40, borderRadius: 10, paddingLeft: '8%', fontFamily: Common_Color.fontMedium, backgroundColor: '#ebebeb' },
    searchBar: { alignItems: 'center', marginTop: hp('2.5%'), marginBottom: hp('2%') },
    text: { marginBottom: 'auto', fontSize: 16, color: '#000', },
    modalView1: { width: wp('90%'), height: hp('35%'), backgroundColor: '#fff', borderRadius: 15 },
    hasNoMem: { justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
    rectangle: {
        height:3,
        width:'64%',
        backgroundColor: '#dd374d',        
      },
})



// <FlatList
// style={{ marginBottom: 60 }}
// data={this.state.followersList}
// ItemSeparatorComponent={this.FlatListItemSeparator}
// renderItem={({ item }) => (
//     <View style={{ flex: 1, borderRadius: 10, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
//         {/* <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}> */}
//         <View style={[Profile_Style.likeView,]}>
//             {item.VerificationRequest === "Approved" ? (
//                 <View style={Common_Style.avatarProfile}>
//                     {item.ProfilePic == undefined || null ? (
//                         <View >
//                             <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'} borderRadius={50}
//                                 source={require(imagePath + 'profile.png')}>
//                             </ImageBackground>
//                         </View>)
//                         : (
//                             <View>
//                                 <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}>
//                                     <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'} borderRadius={50}
//                                         source={{ uri: serviceUrl.profilePic + item.ProfilePic }}>
//                                         <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
//                                     </ImageBackground>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                 </View>
//             ) :
//                 (<View style={Common_Style.avatarProfile}>
//                     {item.ProfilePic == undefined || null ?
//                         <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'}
//                             source={require(imagePath + 'profile.png')}></Image>
//                         :
//                         <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}>
//                             <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'}
//                                 source={{ uri: serviceUrl.profilePic + item.ProfilePic }} /></TouchableOpacity>}
//                 </View>)}



//             <View style={[Common_Style.textView]}>
//                 <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}>
//                     <Text style={Common_Style.name1}>{item.UserName}</Text>
//                     <Text style={Common_Style.name2}>{item.name}</Text>
//                 </TouchableOpacity>
//             </View>


//             {item.Status == "Accept" ?

//                 <View style={{ width: wp('27%'), height: hp('5%'), borderRadius: 5, marginRight: wp('2.5%'), }}>
//                     <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%', marginTop: 5 }} borderRadius={5}>
//                         <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#fff' }}>Follow</Text>
//                     </ImageBackground>
//                 </View>

//                 :

//                 item.Status == "Pending" ?
//                     <View style={{ width: wp('27%'), height: hp('5%'), borderRadius: 5, marginRight: wp('2.5%'), }}>
//                         <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%', marginTop: 5 }} borderRadius={5}>
//                             <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#fff' }}>Requested</Text>
//                         </ImageBackground>
//                     </View>

//                     :
//                     item.Status == "following" ?
//                         <View style={{ width: wp('27%'), height: hp('5%'), borderRadius: 5, marginRight: wp('2.5%'), }}>
//                             <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%', marginTop: 5 }} borderRadius={5}>
//                                 <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#fff' }}>Following</Text>
//                             </ImageBackground>
//                         </View>
//                         :

//                         item._id == this.state.id ?
//                             <View style={{}}>
//                             </View>
//                             :

//                             <View style={{ width: wp('27%'), height: hp('5%'), borderRadius: 5, marginRight: wp('2.5%'),backgroundColor:'grey' }}>
//                                 <TouchableOpacity onPress={() => this.followRequest(item)} style={{ width: '100%', height: '100%', }}>
//                                     <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%', }} borderRadius={5}>
//                                         <Text onPress={() => this.followRequest(item)} style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#fff' }}>Follow</Text>
//                                     </ImageBackground>
//                                 </TouchableOpacity>
//                             </View>

//             }

//         </View>
//         {/* </TouchableOpacity>  */}
//     </View>

// )}
// keyExtractor={(item, index) => index.toString()}
// />