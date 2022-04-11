import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ImageBackground, StatusBar,KeyboardAvoidingView,Platform } from 'react-native';
import common_styles from "../../Assets/Styles/Common_Style"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Content } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader';
let Common_Api = require('../../Assets/Json/Common.json')
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { TextInput, HelperText } from 'react-native-paper';

export default class Reset_Password extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            email: "",
            hidePassword: true,
            hideRe_Password: true,
            password: '',
            confirm_password: '',
            blank_password: false,
            blank_confirm_pass: false,
            isLoader: false,
            is_valid_password: false,
        }
    }

    componentDidMount() {
        this.onLoad();
    }
    async onLoad() {
        var Email = await AsyncStorage.getItem('Email');
        this.setState({
            email: Email
        })
    }
    validateInputFields(fields, value) {
        if (fields == "") {
            this.setState({ [value]: false })
        } else {
            this.setState({ [value]: true })
        }
    }


    validatePassword = (text) => {
        const reg = new RegExp("(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$");
        const isOk = reg.test(text);
        if (isOk) {
            this.setState({ password: text, is_valid_password: false,blank_password:false })
        } else {
            this.setState({ password: text, is_valid_password: false,blank_password:false })
        }
    }


    NewPassword_Visibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }

    Confirm_Pwd_Visibility = () => {
        this.setState({ hideRe_Password: !this.state.hideRe_Password });
    }


    handle_reset_pass = () => {
       // debugger;
        if (this.state.password == "" && this.state.confirm_password == "") {
            this.setState({ is_valid_password: true, blank_confirm_pass: true })
            return;
        }
        if (this.state.password == "") {
            this.setState({
                is_valid_password: true
            });
            return;
        }else if (this.state.confirm_password == "") {
            this.setState({ blank_confirm_pass: true   });
            return;
        }
        if (this.state.password != this.state.confirm_password) {
            toastMsg1('danger', 'Password mismatched!')
        }else if(this.state.confirm_password.length < 8 ) {
            toastMsg1('danger', 'Minimum character 8');
            return ;
        }
        else {
            this.setState({ isLoader: true });
            const url = serviceUrl.been_url1 + "/Changepassword";
            const {email,password} = this.state
            const header = serviceUrl.headers;
            let data ={
                email : email,
                Password : password
            }
            console.log('confimr',data);
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
                },
                body: JSON.stringify(data),
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log('resp',responseJson);
                    if (responseJson.status == "True") {
                        //toastMsg('success', response.message)
                        this.props.navigation.navigate('Login');
                        this.setState({ isLoader: false });
                    } else {
                        this.setState({ isLoader: false });
                        //toastMsg('danger', response.message)
                    }
                })
                .catch((error)=> {
                    console.log('err',error);
                    this.setState({ isLoader: false });
                });
        }


    }


    render() {
        const keyboardVerticalOffset = Platform.OS === "ios" ? 5 : 0;
        return (
            <KeyboardAvoidingView style={{ flex: 1,backgroundColor:'#fff' }}
                keyboardVerticalOffset={keyboardVerticalOffset} 
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>

                    <View style={common_styles.common_baground}>

                        {/* <Image style={{ width: wp(26), height: hp(20), alignSelf: 'center', alignItems: 'center', alignContent: 'center' }} resizeMode={'contain'}
                            source={require('../../Assets/Images/new/resetPass.png')} /> */}

                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <Text style={[common_styles.sign_up,]}>Reset Password</Text>

                            <View style={{ width: wp(96) }}>
                                <View style={{ flexDirection: 'row', }} >

                                    <TextInput
                                        label="Password"
                                        mode="outlined"
                                        autoCorrect={false}
                                       
                                        secureTextEntry={this.state.hidePassword}
                                        value={this.state.password}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(text) => this.validatePassword(text)}
                                        error={this.state.is_valid_password}
                                        style={[common_styles.textInputSignUp, { width: '100%' }]}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />


                                    <View style={{ justifyContent: 'center', right: 18, bottom: 17, position: 'absolute' }}>
                                        <TouchableOpacity onPress={this.NewPassword_Visibility}>
                                            {(this.state.hidePassword) ?
                                                <Image source={require('../../Assets/Images/hidePass.png')}
                                                    style={common_styles.hide_eye_Image} /> :
                                                <Image source={require('../../Assets/Images/ShowPass.png')}
                                                    style={common_styles.show_eye_Image} />}
                                        </TouchableOpacity>
                                    </View>
                                </View>


                            <View style={{ flexDirection: 'row', overflow: 'hidden' }} >

                                <View style={{ flexDirection: 'row' }} >

                                    <TextInput
                                        label="Re-enter Password"
                                        mode="outlined"
                                        autoCorrect={false}
                                       
                                        secureTextEntry={this.state.hideRe_Password}
                                        value={this.state.confirm_password}
                                        onChangeText={(text) => this.setState({ confirm_password: text, blank_confirm_pass: false })}
                                        underlineColorAndroid="transparent"
                                        error={this.state.blank_confirm_pass}
                                        style={[common_styles.textInputSignUp, { width: '100%' }]}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />


                                    <View style={{ justifyContent: 'center', right: 18, bottom: 17, position: 'absolute' }}>
                                        <TouchableOpacity onPress={this.Confirm_Pwd_Visibility}>
                                            <Image
                                                source={(this.state.hideRe_Password) ?
                                                    require('../../Assets/Images/hidePass.png') :
                                                    require('../../Assets/Images/ShowPass.png')}
                                                style={common_styles.show_eye_Image}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                           
                        </View>


                        {this.state.isLoader ? <Loader /> :
                            <View style={[common_styles.Common_button, { marginBottom: 15, marginTop: 15 }]}>
                                <ImageBackground source={require('../../Assets/Images/button.png')} borderRadius={10} style={{ width: '100%', height: '100%' }}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                        onPress={() => this.handle_reset_pass()}>
                                        <Text style={common_styles.Common_btn_txt}>Submit</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>}

                        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, justifyContent: 'center', }}>

                            <Text style={common_styles.termsText}>By using this service, you agree to the</Text>
                            <Text onPress={() => this.props.navigation.navigate('Terms')} style={[common_styles.termsText, { color: '#85aae1' }]}> Terms of use </Text>
                            <Text style={common_styles.termsText}> and </Text>
                            <Text onPress={() => this.props.navigation.navigate('DataPolicy')} style={[common_styles.termsText, { color: '#85aae1' }]}> Data Policy</Text>
                        </View>
                    </View>
                    </View>
                </ScrollView>

            </KeyboardAvoidingView>
        )
    }
}