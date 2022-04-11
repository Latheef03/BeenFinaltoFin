import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, FlatList, Text, StatusBar, Image, ImageBackground, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import Spinner from '../../Assets/Script/Loader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar,HBTitleBack } from '../commoncomponent'
import Profile_Style from "../../Assets/Styles/Profile_Style"
import Common_Style from '../../Assets/Styles/Common_Style';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const newPath = '../../Assets/Images/new/'

export default class Notifications1 extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            requestData: [], search: '',
            no_record_found: false,
            isLoading: false,
        }
        this.arrayholder = [];
    }

    UNSAFE_componentWillMount() {
       // debugger;
        this.fetchDetails();
    }
    componentDidMount = () => {
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
        var data = {
            userID: id
        };
        this.setState({ isLoading: true });
        const url = serviceUrl.been_url + "/GetReqList";
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
                    console.log("response Json requsr List", responseJson);
                    this.setState({
                        requestData: responseJson.result,
                        isLoading: false,
                        no_record_found: false
                    })
                    this.arrayholder = responseJson.result;
                }
                else {
                    this.setState({
                        isLoading: false,
                        no_record_found: true
                    });
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
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
    acceptReq = async (data) => {
        debugger
        console.log("data for accept ",data)
        var id = await AsyncStorage.getItem("userId");
        var data = {
            Userid: data.ReqUserId,
            reqId: data._id,
            Status: "Accept"
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
                        this.fetchDetails();
                        //toastMsg("success", "Request has been accepted")
                        console.log("response Json requsr List", responseJson);
                    }
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
            Userid: data.ReqUserId,
            reqId: data._id,
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
                        this.fetchDetails();
                        //toastMsg("success", "Request has been rejected")
                    }
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });

    }
    render() {
        return (
            <View style={{marginTop:StatusBar.currentHeight,flex:1,backgroundColor:'#fff'}}>
                <StatusBar backgroundColor="#0000" barStyle='dark-content' />
                <Toolbar {...this.props} />
                {/* <HBTitleBack {...this.props} title={false} /> */}

                <View style={Common_Style.TextHeader}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require(newPath+'FriendRequests.png')} resizeMode={'contain'} style={Common_Style.requestImage} />
                    </View>
                    <View style={{ marginTop: hp('1%') }}>
                        <Text style={{ textAlign: 'center', fontSize: Username.FontSize,}}>{this.state.requestData.length} Follow Requests</Text>
                    </View>
                </View>
                <View style={Common_Style.Search}>
                    <TextInput value={this.state.text} onChangeText={text => this.SearchFilterFunction(text)} style={[Common_Style.searchTextInput,{}]} placeholder={'Search '}  autoCorrect={false}
                           placeholderTextColor={'#6c6c6c'}></TextInput>
                </View>

                <FlatList
                    style={{ marginBottom: 60 }}
                    data={this.state.requestData}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item, index }) => (
                        <View key={`id${index}`} style={{ flexDirection: 'row',paddingLeft: '3%' }}>
                            {/* <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}> */}
                            {/* <View style={{...Profile_Style.likeView,height: hp(8),}}> */}
                            <View style={Profile_Style.likeView}>
                                <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}>
                                    <View style={Common_Style.ImgView}>
                                        {item.VerificationRequest === "Approved" ? (
                                            <View style={Common_Style.avatarProfile}>
                                                {item.UserProfilePic == undefined || null ? (
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
                                                                source={{ uri: serviceUrl.profilePic + item.UserProfilePic }}>
                                                                <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                                                {/* style={businessProfileStyle.verify} /> */}
                                                            </ImageBackground>
                                                        </View>
                                                    )}
                                            </View>
                                        ) :
                                            (<View style={Common_Style.avatarProfile}>
                                                {item.UserProfilePic == undefined || null ?
                                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'}
                                                        source={require(imagePath + 'profile.png')}></Image>
                                                    :
                                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'}
                                                        source={{ uri: serviceUrl.profilePic + item.UserProfilePic }} />}
                                            </View>)}


                                        <TouchableOpacity style={{ width: wp('55%'), height: 45 }}
                                            onPress={() => this.OtheruserDashboard(item)}>
                                            <View style={Common_Style.nameParentView}>
                                                <View style={Common_Style.nameView}>
                                                    <Text style={Common_Style.nameText1} >{item.UserName}</Text>
                                                    <Text style={Common_Style.nameText2} >{item.name != "null" || null ? item.name : null}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                                <View style={[Common_Style.NotifyParentView,{}]}>

                                    <View style={[Common_Style.AcceptView,{ marginLeft: wp('-5%')}]}>
                                        <TouchableOpacity onPress={() => this.acceptReq(item)}>
                                            <ImageBackground source={require(imagePath + 'button.png')} style={{ width: '100%', height: '100%' }} borderRadius={5}>
                                                <TouchableOpacity style={{ width: '100%', height: '100%', }}>
                                                    <Text style={Common_Style.AcceptText}>Accept</Text>
                                                </TouchableOpacity>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[Common_Style.CancelView,{ marginLeft: wp('12%')}]}><TouchableOpacity style={{ width: '100%', height: '100%', }}>
                                        <Text onPress={() => this.deleteReq(item)} style={Common_Style.CancelText}>Cancel</Text>
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
    search: { borderWidth: 1.5, width: '90%', borderColor: '#e1e1e1', height: hp('6%'), borderRadius: 30, paddingLeft: '8%', fontFamily: Common_Color.fontMedium },
    unBlockImg: { width: '80%', height: '77%', backgroundColor: '#f23f32', marginTop: hp('2%'), borderRadius: 1 },
    userName: { width: '50%', marginLeft: wp('7%'), height: hp('5%'), marginTop: hp('2.1%') },
}