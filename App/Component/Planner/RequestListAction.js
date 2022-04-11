import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Text, StatusBar, Image, ImageBackground,FlatList, TextInput } from 'react-native';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import QB from 'quickblox-react-native-sdk';
import Common_Style from '../../Assets/Styles/Common_Style'
import { toastMsg } from '../../Assets/Script/Helper';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import Profile_Style from "../../Assets/Styles/Profile_Style"
import { Toolbar } from '../commoncomponent';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from '../../Assets/Colors'

export default class RequestListAction extends Component {
    static navigationOptions = {
        header: null,

    };

    constructor(props) {
        super(props);
        this.state = {
            requestData: [], group: "", AdminId: "",
            chatGroupId: '',
            groupAdminId: '', search: '',
        }
        this.arrayholder = [];
    }
    async componentWillMount() {
       // debugger;
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({
            AdminId: id1
        })
        const { navigation,route } = this.props;
        const Comments = route?.params?.data;
        this.setState({
            group: Comments.group,
            chatGroupId: Comments.chatGroupId
        });
        this.fetchDetails();
    }
    async componentDidMount() {
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({
            AdminId: id1
        })
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.fetchDetails();
            }
        );
    };

    fetchDetails = async () => {
        //// debugger;
        var id = await AsyncStorage.getItem("userId");
        var data = { groupId: this.state.group._id };
        const url = serviceUrl.been_url1 + "/RequestedUserList";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log("response Json requsr List", responseJson);
                if (responseJson.status == "True") {
                    console.log("response Json requsr List", responseJson);
                    if(responseJson.status === "True"){
                    this.setState({
                        requestData: responseJson.result,
                        // chatGroupId : responseJson.GroupId,
                        groupAdminId: responseJson.AdminId
                    })
                    this.arrayholder = responseJson.result;
                }
                }
                else {
                    this.setState({
                        requestData: "",
                        // "message": "Something wrong"
                    })
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
    }

    joinGroupChat = (data) => {
       // debugger;
        const { chatGroupId } = this.state;
        // console.log('gid',chatGroupId)
        console.log('grp data', data.ChatUserId)
        let occupantId = data.ChatUserId ? parseInt(data.ChatUserId) : null;
        if (occupantId == null) {
            //toastMsg('danger', `${data.UserName} has no chat user id`);
            return false;
        }
        // console.log('occupant id',occupantId)
        // console.log('occupant id type',typeof occupantId)
        const update = {
            dialogId: chatGroupId,
            addUsers: [occupantId],
            // removeUsers: [12345],
            // name: 'Team room'
        };
        console.log('update list', update)

        QB.chat
            .updateDialog(update)
            .then((updatedDialog) => {
                this.acceptReq(data)
                console.log('asdasda', updatedDialog)
                // handle as necessary
            })
            .catch(function (e) {
                console.log('errr', e)
                // handle error
            });
    }

    acceptReq = async (data) => {
       // debugger;

        debugger
        var id = await AsyncStorage.getItem("userId");
        var data = {
            "userId": id,
            "groupid": this.state.group._id,
            "ReqAs": "Accept",
            "ReqUser": data._id
        };
        const url = serviceUrl.been_url1 + "/AcceptOrRejecttheReq";

        console.log('data', data);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('whole resp', responseJson);
                if (responseJson.status == "True") {

                    this.fetchDetails();
                    console.log("response Json requsr List", responseJson);

                }
                else {
                    console.log('response false', responseJson)
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
    }

    deleteReq = async (data) => {
        debugger
        var id = await AsyncStorage.getItem("userId");
        var data = {
            "userId": id,
            "groupid": this.state.group._id,
            "ReqAs": "Reject",
            "ReqUser": data._id

        };
        const url = serviceUrl.been_url1 + "/AcceptOrRejecttheReq";
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

                    this.fetchDetails();
                    console.log("response Json requsr List", responseJson);

                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });

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
            requestData: newData,
            text: text
        });
    }

    render() {
        return (
            <View style={{marginTop:0,flex:1,backgroundColor:'#fff'}}>
                <Toolbar {...this.props} />

                <View style={Common_Style.TextHeader}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../Assets/Images/new/RequestList.png')}
                        resizeMode={'contain'} 
                         style={{ width: '20%', height: hp('11%') }} />
                    </View>
                    <View style={{ marginTop: hp('1%') }}>
                        <Text style={{ textAlign: 'center', fontSize: Username.FontSize, }}>{this.state.requestData.length}  Requests</Text>
                    </View>
                </View>
                <View style={Common_Style.Search}>
                    <TextInput 
                        value={this.state.text} 
                        onChangeText={text => this.SearchFilterFunction(text)} 
                        autoCorrect={false}
                        style={Common_Style.searchTextInput} 
                        placeholder={'Search '} 
                        placeholderTextColor={'#6c6c6c'}></TextInput>
                </View>
                <FlatList
                    style={{ marginBottom: 60 }}
                    data={this.state.requestData}
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
                                                    <Text style={Common_Style.nameText1} >{item.UserName}</Text>
                                                    <Text style={Common_Style.nameText2} >{item.name && item.name === undefined || item.name && item.name === null || item.name && item.name ==="" || item.name && item.name === "null" || item.name && item.name === "undefined" ? "" : item.name}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                                <View style={Common_Style.NotifyParentView}>

                                    <View style={Common_Style.AcceptView}>
                                        <TouchableOpacity onPress={() => this.acceptReq(item)}>
                                            <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }} borderRadius={5}>
                                                <TouchableOpacity style={{ width: '100%', height: '100%', }}>
                                                    <Text style={Common_Style.AcceptText}>Accept</Text>
                                                </TouchableOpacity>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={Common_Style.CancelView}><TouchableOpacity style={{ width: '100%', height: '100%', }}>
                                        <Text onPress={() => this.deleteReq(item)} style={Common_Style.CancelText}>Reject</Text>
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {/* </TouchableOpacity> */}
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
const block = {
    search: { borderWidth: 1.5, width: '90%', borderColor: '#e1e1e1', height: hp('6%'), borderRadius: 30, paddingLeft: '8%', fontFamily: Common_Color.fontBold },
    unBlockImg: { width: '80%', height: '77%', backgroundColor: '#f23f32', marginTop: hp('2%'), borderRadius: 1 },
    userName: { width: '50%', marginLeft: wp('7%'), height: hp('5%'), marginTop: hp('2.1%') },
}