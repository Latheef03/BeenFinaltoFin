import React, { Component } from 'react'
import {
    Text, StatusBar, StyleSheet, Button, TouchableOpacity, Image,
    View, Alert, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../../styles/FooterStyle';
import Common_Style from '../../Assets/Styles/Common_Style'
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import { Toolbar } from '../commoncomponent'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Modal from "react-native-modal";

export default class Account extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(prop) {
        super(prop);
        this.state = {
            originalName: '',
            id: '',
            profileType: '',
            local: '',
            isModalVisible3: false,
        }
    }

    componentWillMount() {
        this.onLoad()
    }

    componentDidMount() {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.onLoad()
            }
        );
    };

    onLoad = async () => {
        // debugger;
        const lp = await AsyncStorage.getItem('localProfile');
        const getType = await AsyncStorage.getItem('profileType');
        const pType = parseInt(getType);
        console.log('asdas', pType);
        this.setState({
            profileType: pType,
            local: lp
        })

    }

    switchProfile() {
        var data = { screenName: "business Profile" }
        this.props.navigation.navigate('Settings_Account_Verify', { data: data })
    }

    switchPlace() {
        var data = { screenName: "business Place" }
        this.props.navigation.navigate('Settings_Account_Verify', { data: data })
    }

    personalAcc() {
        var data = { screenName: "Personal Account" }
        this.props.navigation.navigate('Settings_Account_Verify', { data: data })
    }

    localProfile() {
        var data = { screenName: "Local Profile" }
        this.props.navigation.navigate('Settings_Account_Verify', { data: data })
    }

    updatePas() { this.props.navigation.navigate('password') }
    loginInfo() { this.props.navigation.navigate('SavedLoginInfo') }
    twoFactor() { this.props.navigation.navigate('TwoFactorAuth') }
    muteAcc() { this.props.navigation.navigate('MutedAccount') }
    deleteAcc() {
        debugger
        this.setState({
            isModalVisible3: true,
        })
    }
    
     deleteData = async () => {
        debugger
        this.setState({ isModalVisible3: false });
        var data = {
            Userid: await AsyncStorage.getItem('userId')
        };

        // console.log('the deeee',data);
        const url = serviceUrl.been_url1 + "/deleteaccount";
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "True") { this.props.navigation.navigate('Login') }
                else { }
            })
            .catch(function (error) {
                reject(new Error(`Unable to retrieve events.\n${error.message}`));
            });
    }
    render() {
        const { local, profileType } = this.state;
        return (
            <View style={{ flex: 1, marginTop: 0 ,backgroundColor:'#fff'}}>

                <Toolbar {...this.props} leftTitle="Account" />

                <TouchableOpacity hitSlop={style.touchView} onPress={() => this.updatePas()} style={style.textView}>
                    <Text style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} onPress={() => this.updatePas()}>Password</Text>
                </TouchableOpacity>

                <TouchableOpacity hitSlop={style.touchView} onPress={() => this.loginInfo()} style={style.textView}>
                    <Text style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} onPress={() => this.loginInfo()}>Saved Login Info</Text>
                </TouchableOpacity>

                <TouchableOpacity hitSlop={style.touchView} onPress={() => this.twoFactor()} style={style.textView}>
                    <Text style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} onPress={() => this.twoFactor()}>Two-factor Authentication</Text>
                </TouchableOpacity>

                <TouchableOpacity hitSlop={style.touchView} onPress={() => this.props.navigation.navigate('RequestVerification')} style={style.textView}>
                    <Text style={{ fontSize: Username.FontSize, fontFamily: Username.Font }}>Request Verification</Text>
                </TouchableOpacity>

                <TouchableOpacity hitSlop={style.touchView} onPress={() => this.muteAcc()} style={style.textView}>
                    <Text style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} onPress={() => this.muteAcc()}>Muted Accounts</Text>
                </TouchableOpacity>

               

                {profileType == 0 ?
                    <View>
                        <TouchableOpacity hitSlop={style.touchView} onPress={() => this.switchProfile()} style={style.textView}>
                            <Text style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} onPress={() => this.switchProfile()}>Switch to Business Profile</Text>
                        </TouchableOpacity>

                        {profileType == 0 && local == "No" ? <TouchableOpacity hitSlop={style.touchView} onPress={() => this.switchPlace()} style={style.textView}>
                            <Text style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} onPress={() => this.switchPlace()}>Switch to Business Place </Text>
                        </TouchableOpacity> : null}

                    </View>
                    :
                    profileType === 1 ?
                        <View>
                            {/* <View style={style.textView}>
                    <Text style={[style.text1,{color:'#46a6ec'}]} onPress={()=>this.switchPlace()}> - Business Place</Text>
                </View> */}
                            <TouchableOpacity hitSlop={style.touchView} onPress={() => this.personalAcc()} style={style.textView}>
                                <Text onPress={() => this.personalAcc()} style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} >Switch to Personal Account</Text>
                            </TouchableOpacity></View>
                        :
                        profileType === 2 ?
                            <View>
                                {/* <View style={style.textView}>
                        <Text style={[style.text1,{color:'#46a6ec'}]} onPress={()=>this.switchProfile()}> - Business Profile</Text>
                            </View> */}
                                <TouchableOpacity hitSlop={style.touchView} onPress={() => this.personalAcc()} style={style.textView}>
                                    <Text onPress={() => this.personalAcc()} style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} >Switch to Personal Account</Text>
                                </TouchableOpacity></View>
                            :
                            <TouchableOpacity hitSlop={style.touchView} onPress={() => this.personalAcc()} style={style.textView}>
                                <Text onPress={() => this.personalAcc()} style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} >Switch to Personal Account</Text>
                            </TouchableOpacity>}
                {this.state.profileType != 2 && local == "No" ? (
                    <TouchableOpacity hitSlop={style.touchView} onPress={() => this.localProfile()} style={style.textView}>
                        <Text onPress={() => this.localProfile()} style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} >Become a  Local Guide</Text>
                    </TouchableOpacity>) : null}
                    <TouchableOpacity hitSlop={style.touchView} onPress={() => this.deleteAcc()} style={style.textView}>
                    <Text style={{ fontSize: Username.FontSize, fontFamily: Username.Font }} onPress={() => this.deleteAcc()}>Delete Account</Text>
                </TouchableOpacity>
                {/* Delete Modal */}
                <Modal isVisible={this.state.isModalVisible3}
                    onBackdropPress={() => this.setState({ isModalVisible3: false })}
                    onBackButtonPress={() => this.setState({ isModalVisible3: false })} >
                    <View style={styles.deleteModalView} >

                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                            <Text style={{ color: '#333', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 18 }}>
                                Are you sure you want to delete your account ?
                                All your data will be lost.
                </Text>
                        </View>

                        <View style={[Common_Style.Common_button, { width: wp(88), margin: 3 }]}>

                            <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                borderRadius={10}
                            >
                                <TouchableOpacity onPress={() => { this.deleteData() }}>
                                    <Text onPress={() => { this.deleteData() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Delete</Text>
                                </TouchableOpacity>
                            </ImageBackground>

                        </View>
                        <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
                            <TouchableOpacity onPress={() => { this.setState({ isModalVisible3: false }) }}>

                                <Text onPress={() => { this.setState({ isModalVisible3: false }) }} style={[Common_Style.Common_btn_txt, { color: Common_Color.common_black, alignItems: 'center', justifyContent: 'center', }]}>Cancel</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </Modal>

            </View>
        )
    }
}

const style = StyleSheet.create({
    textView: { marginTop: hp('2%'), marginLeft: wp('4%') },
    text: { color: '#868686', fontSize: wp(4) },
    touchView: { top: 8, bottom: 8, left: 8, right: 8 },
    text1: { color: '#878787' }
})