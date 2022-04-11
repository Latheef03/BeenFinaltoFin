import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, StatusBar, AsyncStorage,
StatusBarIOS } from 'react-native';
import common_styles from "../../Assets/Styles/Common_Style"
import { Container, Content, Toast, Footer, FooterTab } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import LinearGradient from "react-native-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
let Common_Api = require('../../Assets/Json/Common.json')
import Profile_Style from "../../Assets/Styles/Profile_Style"
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color } from '../../Assets/Colors'
import { deviceWidth as dw, deviceHeight as dh } from '../_utils/CommonUtils';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
var id1 = ''
export default class SendReqPeople extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            partnerData: '', acceptResult: "",
            dataSource: '',
            arrayName: [],
            arrayNameid: [],
            albumId: null,
            UserId: null,
            UserName: null
        };
        this.arrayholder = [];
    }
    componentWillMount() {
        this.getTagPeople();
    }
    componentDidMount() {
        this.getTagPeople();
    }

    seperator() {
        <View style={{ width: "50%", margin: '5%' }}></View>
    }
    _selectedListForDel = (newData) => {
        var UserName = newData.UserName;
        var Userid = newData._id;
        newData.selected = !newData.selected;
        if (newData.selected == true) {
            this.state.arrayName.push(UserName.toString());
            this.state.arrayNameid.push(Userid.toString());
        }
        if (newData.selected == false) {
            let arrName = this.state.arrayName;
            arrName = arrName.filter(e => e !== UserName);
            this.state.arrayName = arrName;
            let arrid = this.state.arrayNameid;
            arrid = arrid.filter(e => e !== Userid);
            this.state.arrayNameid = arrid;
        }
        this.state.acceptResult.map(data => {
            if (this.state.arrayNameid.includes(data._id)) {
                data.selected = true;
            }
            return data
        })

        this.setState({
            UserName: this.state.arrayName,
            UserId: this.state.arrayNameid
        })
    }

    async getTagPeople() {
        // debugger;
        var id1 = await AsyncStorage.getItem('userId')
        var data = {
            userId: await AsyncStorage.getItem('userId'),
            groupId: await AsyncStorage.getItem('OtherUserIdPlanner')
        };
        const url = serviceUrl.been_url1 + "/UserListForReq";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((res) => {
                console.log('reeee', res)
                if (res.status == 'True') {
                    this.setState({
                        acceptResult: res.result
                    });
                    this.arrayholder = res.result;
                } else {
                    this.setState({
                        acceptResult: ""
                    });
                }
            })
            .catch(function (error) {
                console.log("Eroror", error);
                reject(new Error(`Unable to retrieve events.\n${error.message}`));
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
            acceptResult: newData,
            text: text
        });
    }



    cancel() {
        this.props.navigation.goBack()
    }

    async getTags() {
        // debugger;
        var userId = await AsyncStorage.getItem('userId');
        var OtherUserId = await AsyncStorage.getItem('OtherUserIdPlanner');
        var PlannerUserId = await AsyncStorage.getItem('PlannerUserId');
        var tagId = this.state.UserId;
        // {
        //     tagId: this.state.UserId,
        //     image: 1
        // }
        var data = {
            groupid: OtherUserId,
            ownerId: userId,
            userId: userId === PlannerUserId ? tagId : userId,
            reqfrom: userId === PlannerUserId ? "Owner" : "User"
        };
        const url = serviceUrl.been_url1 + "/SendRequestForPlanner";
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
                this.props.navigation.navigate('Open');
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }


    render() {
        return (
            <View style={{ flex: 1, marginTop: StatusBar.currentHeight,backgroundColor:'#fff'}}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
              
                <View style={[Common_Style.searchView, { flexDirection: 'row', margin: 5, }]}>
                    <TextInput
                        style={[Common_Style.searchTextInput, { width: wp(80) }]}
                        placeholder={'Search Account '}
                        autoCorrect={false}
                        onChangeText={text => this.SearchFilterFunction(text)}
                        value={this.state.text}
                        placeholderTextColor={'#6c6c6c'}>
                    </TextInput>
                    <Text onPress={() => this.cancel()} style={{ marginRight: 10, fontFamily: Common_Color.fontBold, marginLeft: 8 }}>Cancel</Text>
                </View>

                <View style={{ width: wp('100%'), height: hp('80%'),marginTop:10,margin:10 }}>
                    <FlatList
                        data={this.state.acceptResult}
                        ItemSeparatorComponent={this.seperator()}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => this._selectedListForDel(item)}>
                            <View key={`id${index}`} style={{ flexDirection: 'row', }}>
                                {/* <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}> */}
                                {/* <View style={{...Profile_Style.likeView,height: hp(8),}}> */}
                                <View style={Profile_Style.likeView}>
                                 
                                        <View style={[Common_Style.ImgView,{width:'70%'}]}>
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


                                          
                                                <View style={Common_Style.nameParentView}>
                                                    <View style={Common_Style.nameView}>
                                                        <Text style={Common_Style.nameText1} >{item.UserName}</Text>
                                                        <Text style={[Common_Style.nameText2,{marginTop:5 }]} >{item.name != "null" && item.name != null &&
                                                            item.name != "undefined" && item.name != undefined ?
                                                            item.name
                                                            :
                                                            null
                                                        }
                                                        </Text>
                                                    </View>
                                                </View>
                                            {item.selected === true ?
                                            <Image style={{ width: 22, height: 22, marginTop: 15, }}
                                                source={require('../../Assets/Images/singletick.png')} />
                                            : null
                                        }
                                        </View>
                                 
                                  
                                </View>
                                {/* </TouchableOpacity> */}
                            </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={(<View style={{ backgroundColor: '#FFF', height: 10 }}></View>)}
                    />
                </View>
                 {/* <Footer>
                    <FooterTab style={{ backgroundColor: '#fff' }}> */}
                        <View style={[common_styles.Common_button, { width: wp('95%'), bottom:5,position:'absolute',height:100,marginHorizontal:10 }]}>
                            <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '70%' }}>
                                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                    onPress={() => this.getTags()}>
                                    <Text style={[common_styles.Common_btn_txt,{textAlign:'center',alignItems:'center',justifyContent:'center',marginBottom:20}]}>Invite</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                    {/* </FooterTab>
                </Footer> */}
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        loginButton: { backgroundColor: "#87cefa", alignItems: "center", height: hp("6%"), width: wp("98%"), color: "blue", borderRadius: 8, justifyContent: "center", textAlign: "center", shadowColor: '#000000', shadowOffset: { width: 3, height: 3 }, shadowRadius: 5, shadowOpacity: 1.0, },
        LoginButtontxt: { color: "#fff", justifyContent: "center", textAlign: "center", fontSize: 16, fontFamily: Common_Color.fontMedium },
    },
)
