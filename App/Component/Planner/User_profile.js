import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Common_Style from '../../Assets/Styles/Common_Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import common_styles from "../../Assets/Styles/Common_Style"
import serviceUrl from '../../Assets/Script/Service';
import { postServiceP01 } from 'Been/App/Component/_services';
import Loader from '../../Assets/Script/Loader';
import { Toolbar } from '../commoncomponent'
import styles from '../BusinessProfile/styles/businessProfileStyle'
const imagepath = './images/';
const imagepath1 = '../../Assets/Images/';
const { profilePic } = serviceUrl;
export default class user_profile extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            isLoading: false,
            chatUsers: [],
            postImgUrl: '',
            typedFilterText: ''
        }
    }

    componentDidMount = () => {
        debugger
        // this.fetchChatUserList();
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                // this.fetchChatUserList({ loaderActive: isNeedActiveLoader });
                this.fetchChatUserList();
            }
        );
        // this.fetchChatUserList({loaderActive:true});
    };
    // fetchChatUserList = async ({ loaderActive }) => {
    async fetchChatUserList() {
        // debugger;
        var chatUserId = await AsyncStorage.getItem("chatUserID");
        if (chatUserId == null && chatUserId == "null" && chatUserId == undefined) {
            return false;
        }

        let apiname = 'ChatHistory';
        var data = {};
        data.Email = await AsyncStorage.getItem('email');
        data.Password = await AsyncStorage.getItem('chatUserPWD');
        data.ChatUserId = chatUserId;
        data.type = "LocalChat";
        // this.setState({ isLoading: loaderActive });
        let subscribe = true
        return postServiceP01(apiname, data).then(datas => {
            console.log('chat user list', datas)
            if (datas.status == 'True') {
                // console.log('datas', datas.result)
                // let chatUsersList = datas.result;
                console.log('datas', datas.result)
                let chatUsersList = datas.result;
                // if(subscribe)
                this.setState({
                    chatUsers: chatUsersList,
                    isLoading: false
                })

            } else {
                //toastMsg('danger', datas.message);
                this.setState({
                    isLoading: false
                })
            }

        }).catch((err) => {
            console.log(err);
            this.setState({
                isLoading: false
            })
            //toastMsg('danger', 'something is wrong,try again once');
        });

        // return () => (subscribe=false);

    }

    gotoChat = (dat) => {
        // debugger;
        // const { name, ChatUserId } = this.state;
        console.log(`chat user name ${dat.name} and chat user id ${dat.user_id}`)
        var data = {
            data: dat.Userid
        }
        this.props.navigation.navigate('LocalProfile5', { data: data })
    }
    renderChatUsers = (user, index) => {
        const { name, _id, last_message, last_message_date_sent,
            unread_messages_count, ProfilePic, Place
        } = user;
        const { isLoading } = this.state;

        var splitMsg = typeof last_message == 'object' ? last_message : last_message.length > 11 ? last_message.substring(0, 12) : last_message;
        var lastMsg = typeof splitMsg == 'object' ? '' : splitMsg.length > 11 ? splitMsg + '.....' : splitMsg;

        return (
            <View style={{justifyContent:'center', }}>
                <View style={{ flexDirection: 'row', marginTop: '10%',marginLeft:30,marginRight:30 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {Place != null ?
                            <TouchableOpacity onPress={() => { this.gotoChat(user) }}>
                                {ProfilePic == null ?
                                    <Image source={require(imagepath1 + 'profile.png')}
                                        style={styles.localProfile} />
                                    :
                                    <Image source={{ uri: profilePic + ProfilePic }}
                                        style={styles.localProfile} />}

                                <Text style={[styles.localProfileText, { textAlign: 'center', alignItems: 'center', justifyContent: 'center', fontSize: Username.FontSize, 
                                   // fontFamily: Username.Font, 
                                }]}>
                                    {name}
                                </Text>

                                <View style={{ flexDirection: 'row', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                                    <Image tintColor={'#9f9f9f'} source={require(imagepath1 + 'localProfile/location.png')}
                                        style={[styles.locationIconLocal,{height: 15, width: 15}]} />
                                    <Text style={[styles.localLocationtxt,{fontSize:Username.FontSize}]}>{Place}</Text>
                                </View>
                            </TouchableOpacity>
                            : null}
                    </View>
                </View>
            </View>
        )
    }


    render() {
        return (
            <View style={{ flex: 1,backgroundColor:'#fff'}}>

              
                <Toolbar {...this.props} centerTitle='' />

                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                
                <FlatList
                    style={{ marginBottom: 50 , }}
                    contentContainerStyle={{
                        justifyContent:'center',alignItems:'center',
                        
                    }}
                    data={this.state.chatUsers}
                    ItemSeparatorComponent={this.space}
                    showsVerticalScrollIndicator={false}
                    // horizontal={true}
                    renderItem={({ item, index }) => this.renderChatUsers(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                />

                <View style={[common_styles.Common_button, {
                    width: wp(96), position: 'absolute',
                    bottom: 25
                }]}>
                    <View style={{ borderWidth: 1, borderColor: '#000000', bottom: '0%', width: '80%', margin: 5 }} />
                    <View style={{ alignItems: 'center', justifyContent: 'center', bottom: '10%', position: 'absolute', }}>
                        <TouchableOpacity activeOpacity={1.0} onPress={() => this.props.navigation.navigate('LocalProfileSearchList')}>
                            <View style={{ height: 30, width: 130, backgroundColor: '#f80041', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#ffffff', fontSize: Username.FontSize, fontFamily: Username.Font, }}>
                                    Find a Local
                                    </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }
}


