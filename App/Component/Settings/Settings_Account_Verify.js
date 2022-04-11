import React, { Component } from 'react';
import { View, Text, Image, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import common_styles from "../../Assets/Styles/Common_Style"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import serviceUrl from '../../Assets/Script/Service';
import styles from '../../styles/FooterStyle';
import { Common_Color } from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style';
import { Toolbar } from '../commoncomponent'

export default class Settings_Account_Verify extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            screenName: '',
            isModalOpen: null,
            userName: '',
            ProfilePic: '',
            localProfile: '',
            _isloading: false,

        }
    }

    UNSAFE_componentWillMount() {
       
        const Comments = this.props.route.params.data
        this.onLoad();
        this.setState({ screenName: Comments.screenName, })
    }

    onLoad = async () => {
        debugger
        var userId = await AsyncStorage.getItem('userId');
        var name = await AsyncStorage.getItem('name');
        var profile = await AsyncStorage.getItem('ProfilePic');
        this.setState({
            id: userId,
            userName: name,
            ProfilePic: profile != "null" ? profile : null,
        })
    }

    switchAccounts = async (pType) => {

        var data = {
            SwitchTo: pType,
            UserId: await AsyncStorage.getItem('userId')
        };
        this.setState({ _isloading: true })
        const url = serviceUrl.been_url1 + '/SwitchAccount';
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
                console.log('switch ac res', responseJson);
                if (responseJson.status == 'True') {
                    this.setState({
                        isModalOpen: false,
                        _isloading: false
                    })

                    this.setStorage(pType);
                } else {
                    this.setState({
                        _isloading: false
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    _isloading: false
                })
                console.log(error);
            });

    }

    setStorage = (pType) => {

        switch (pType) {
            case 'Business Profile':
                AsyncStorage.removeItem('profileType');
                AsyncStorage.setItem('profileType', '1');
                this.profile();
                break;
            case 'Business Place':
                AsyncStorage.removeItem('profileType');
                AsyncStorage.setItem('profileType', '2');
                this.profile();
                break;
            case 'User Account':
                AsyncStorage.removeItem('profileType');
                AsyncStorage.setItem('profileType', '0');
                this.profile();
                break;
        }
    }

    accountScreen() {
        this.props.navigation.navigate('Account')
    }
    profile() {
        this.props.navigation.navigate('MyPager')
    }

    localProfile() {
        this.setState({ isModalOpen: false })
        this.props.navigation.navigate('LocalProfileCreate')
    }

    render() {
        const { ProfilePic, _isloading } = this.state;
        return (
            <View style={{ width: wp('100%'), height: hp('100%'),marginTop:0 ,backgroundColor:'#fff'}}>
                <Toolbar {...this.props} leftTitle=" " />
                {/* <Header style={{ backgroundColor: 'white', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation: 0 }}>
                    <Left>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../../Assets/Images/backArrow.png')}  style={{ width:24, height:28, marginLeft: 5,marginTop:2 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body />
                </Header> */}
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />

                <Content>
                    <View>
                        <View style={{ alignItems: 'center', marginTop: '4%' }}>
                        {this.state.screenName == "business Place" ?
                        <Image  source={require('../../Assets/Images/new/businessPlace.png')}
                        style={{width:78,height:75,resizeMode:'contain',marginTop: '35%'}}/>

                          :  <Image source={
                                
                                this.state.screenName == "business Profile" ?
                                    require('../../Assets/Images/new/businessProfile.png') :
                                    this.state.screenName == "Local Profile" ? require('../../Assets/Images/new/localIcon.png') : null}
                                resizeMode='cover' style={{ height: 75, width:80, borderRadius: 5, marginTop: '35%' }} />}
                        </View>


                        {this.state.screenName == "business Place" || this.state.screenName == "business Profile" ?
                            <View>
                                <View style={{ margin: '4%',marginTop:"6%" }}>
                                    <Text style={[Common_Style.settingsSemiBold, { textAlign: 'center', fontSize: 14, color: '#000', }]}>Welcome to your {this.state.screenName} {this.state.userName} </Text>
                                </View>
                                <View style={{ margin: '4%' }}>
                                    <Text style={{ fontSize: 14, justifyContent: 'center', textAlign: 'center', color: '#010101', fontFamily: Common_Color.fontLight }}>Reach Your Followers</Text>
                                    <Text style={{ justifyContent: 'center', textAlign: 'center', fontSize: 12, color: '#010101', fontFamily: Common_Color.fontLight }}>Create promotions on been to reach more users and build your network</Text>
                                </View>
                                <View style={{ margin: '4%' }}>
                                    <Text style={{ fontSize: 14, justifyContent: 'center', textAlign: 'center', color: '#010101', fontFamily: Common_Color.fontLight }}>Learn About Your Followers</Text>
                                    <Text style={{ justifyContent: 'center', textAlign: 'center', fontSize: 14, color: '#010101', fontFamily: Common_Color.fontLight }}>Get insights about your followers and see how your posts are performing</Text>
                                </View>
                            </View>
                            :

                            this.state.screenName == "Local Profile" ?
                                <View>
                                    <View style={{ margin: '4%', }}>
                                        <Text style={[Common_Style.settingsSemiBold, { textAlign: 'center', fontSize: 14, color: '#000', }]}>Welcome to your {this.state.screenName} {this.state.userName} </Text>
                                    </View>
                                    <View style={{ margin: '4%', height: 100 }}>
                                        <Text style={{ fontSize: 14, justifyContent: 'center', textAlign: 'center', color: '#010101', fontFamily: Common_Color.fontLight }}>Become a local and provide travel services to many travellers around the world</Text>
                                    </View>
                                </View>
                                :
                                <View style={{ margin: '4%' }}>
                                    <Text style={{ fontSize: 14, justifyContent: 'center', textAlign: 'center', color: '#010101', fontFamily: Common_Color.fontLight }}>{this.state.userName}, Are you sure you want to switch back to User Profile</Text>

                                </View>}

                        <View style={{ justifyContent: 'center', alignItems: 'center', margin: '4%' }}>
                            {this.state.screenName == "business Profile" ?
                                <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={common_styles.Common_button}>
                                    <TouchableOpacity onPress={() => this.setState({ isModalOpen: 3 })}
                                        style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                    >
                                        <Text style={common_styles.Common_btn_txt}>Continue</Text>
                                    </TouchableOpacity>
                                </ImageBackground> :
                                this.state.screenName == "business Place" ?
                                    <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={common_styles.Common_button}>
                                        <TouchableOpacity onPress={() => this.setState({ isModalOpen: 2 })}
                                            style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                        >
                                            <Text style={common_styles.Common_btn_txt}>Continue</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                    :
                                    this.state.screenName == "Local Profile" ?

                                        <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={common_styles.Common_button}>
                                            <TouchableOpacity onPress={() => this.setState({ isModalOpen: 1 })}
                                                style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}>
                                                <Text style={common_styles.Common_btn_txt}>Continue</Text>
                                            </TouchableOpacity>
                                        </ImageBackground> :
                                        <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={common_styles.Common_button}>
                                            <TouchableOpacity onPress={() => this.setState({ isModalOpen: 4 })}
                                                style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}>
                                                <Text style={common_styles.Common_btn_txt}>Continue</Text>
                                            </TouchableOpacity>
                                        </ImageBackground>}
                        </View>
                    </View>
                </Content>

                {/* User Account */}
                <Modal isVisible={this.state.isModalOpen === 1}
                    onBackdropPress={() => this.setState({ isModalOpen: null })}
                    onBackButtonPress={() => this.setState({ isModalOpen: null })} >
                    <View style={styles.openModalView} >
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View>
                            <View style={{ marginTop: hp('3%'), marginBottom: hp('1.3%') }}>
                                <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                    source={
                                        ProfilePic != null ?
                                            { uri: serviceUrl.profilePic + ProfilePic }
                                            :
                                            require('../../Assets/Images/profile.png')}
                                />
                            </View>
                            <View >
                                <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold }]}>
                                    Hi {this.state.userName},</Text>
                                <Text style={Common_Style.modalTextSwitchAccount}>Are you sure want to convert your account into {this.state.screenName} ?</Text>

                                <Text style={Common_Style.modalTextSwitchAccount}>If you wish to, you can always convert back to your original user profile through settings by requesting </Text>
                            </View>
                          
                            <View style={[Common_Style.Common_button, { width: wp(86), margin: 6.8, marginBottom: '6%' }]}>

                                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                    borderRadius={10}
                                >
                                    <TouchableOpacity onPress={() => this.localProfile()} style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}>
                                        <Text style={common_styles.Common_btn_txt}>Update</Text>
                                    </TouchableOpacity>
                                </ImageBackground>

                            </View>
                        </View>
                    </View>
                </Modal>


                {/* Business Place */}
                <Modal isVisible={this.state.isModalOpen === 2}
                    onBackdropPress={() => this.setState({ isModalOpen: null })}
                    onBackButtonPress={() => this.setState({ isModalOpen: null })} >
                    <View style={styles.openModalView} >
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View>
                            <View style={{ marginTop: hp('3%'), marginBottom: hp('1.3%') }}>
                                <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                    source={
                                        ProfilePic != null ?
                                            { uri: serviceUrl.profilePic + ProfilePic }
                                            :
                                            require('../../Assets/Images/profile.png')}
                                />
                            </View>
                            <View >
                                <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold }]}>
                                    Hi {this.state.userName},</Text>
                                <Text style={Common_Style.modalTextSwitchAccount}>Are you sure want to convert your account into {this.state.screenName} ?</Text>
                                <Text style={Common_Style.modalTextSwitchAccount}>If you wish to, you can always convert back to your original user profile through settings by requesting </Text>
                            </View>
                         
                            <View style={[Common_Style.Common_button, { width: wp(86), margin: 6.8, marginBottom: '6%' }]}>

                                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                    borderRadius={10}
                                >
                                    <TouchableOpacity onPress={() => { _isloading ? null : this.switchAccounts('Business Place') }}
                                        style={{
                                            width: '100%', height: '100%', justifyContent: 'center',
                                            alignContent: 'center',
                                        }}>
                                        <Text style={common_styles.Common_btn_txt}>{_isloading ? 'Updating...' : 'Update'}</Text>
                                    </TouchableOpacity>
                                </ImageBackground>

                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Business Profile */}
                <Modal isVisible={this.state.isModalOpen === 3}
                    onBackdropPress={() => this.setState({ isModalOpen: null })}
                    onBackButtonPress={() => this.setState({ isModalOpen: null })} >
                    <View style={styles.openModalView} >
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View>
                            <View style={{ marginTop: hp('3%'), marginBottom: hp('1.3%') }}>
                                <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                    source={
                                        ProfilePic != null ?
                                            { uri: serviceUrl.profilePic + ProfilePic }
                                            :
                                            require('../../Assets/Images/profile.png')}
                                />
                            </View>
                            <View >
                                <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold }]}>
                                    Hi {this.state.userName},</Text>
                                <Text style={Common_Style.modalTextSwitchAccount}>Are you sure want to convert your account into {this.state.screenName} ?</Text>
                                <Text style={Common_Style.modalTextSwitchAccount}>If you wish to, you can always convert back to your original user profile through settings by requesting </Text>
                            </View>
                            
                            <View style={[Common_Style.Common_button, { width: wp(86), margin: 6.8, marginBottom: '6%' }]}>

                                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                    borderRadius={10}
                                >
                                    <TouchableOpacity onPress={() => { _isloading ? null : this.switchAccounts('Business Profile') }}
                                        style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}>
                                        <Text style={common_styles.Common_btn_txt}>{_isloading ? 'Updating...' : 'Update'}</Text>
                                    </TouchableOpacity>
                                </ImageBackground>

                            </View>
                        </View>
                    </View>
                </Modal>
                {/* switch to normal profile */}
                <Modal isVisible={this.state.isModalOpen === 4}
                    onBackdropPress={() => this.setState({ isModalOpen: null })}
                    onBackButtonPress={() => this.setState({ isModalOpen: null })} >
                    <View style={styles.openModalView} >
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View>
                            <View style={{ marginTop: hp('3%'), marginBottom: hp('1.3%') }}>
                                <Image style={{ width: 75, height: 75, borderRadius: 50, alignSelf: 'center' }}
                                    source={
                                        ProfilePic != null ?
                                            { uri: serviceUrl.profilePic + ProfilePic }
                                            :
                                            require('../../Assets/Images/profile.png')}
                                />
                            </View>
                            <View >
                                <Text style={[Common_Style.modalTextSwitchAccount, { fontFamily: Common_Color.fontBold }]}>
                                    Hi {this.state.userName},</Text>
                                <Text style={Common_Style.modalTextSwitchAccount}>Are you sure want to convert your account into {this.state.screenName} ?</Text>
                            </View>
                           
                            <View style={[Common_Style.Common_button, { width: wp(86), margin: 6.8, marginBottom: '6%' }]}>

                                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                    borderRadius={10}
                                >
                                    <TouchableOpacity onPress={() => { _isloading ? null : this.switchAccounts('User Account') }}
                                        style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', }}>
                                        <Text style={Common_Style.Common_btn_txt}>{_isloading ? 'Updating...' : 'Update'}</Text>
                                    </TouchableOpacity>
                                </ImageBackground>

                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}
