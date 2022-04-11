
import React, { Component } from 'react';
import {
    View, Text, Image, KeyboardAvoidingView, ToastAndroid, TouchableOpacity,
    TouchableHighlight, ScrollView, ImageBackground, StatusBar,TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import common_styles from "../../Assets/Styles/Common_Style"
import Common_Style from '../../Assets/Styles/Common_Style';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Container, Content } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { deviceWidth, deviceHeight,isValidMail,invalidText } from '../_utils/CommonUtils';
import Modal from "react-native-modal";
let Common_Api = require('../../Assets/Json/Common.json')
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import { TextInput, HelperText } from 'react-native-paper';
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const imagePath2 = '../../Assets/Images/BussinesIcons/FlagIcons/'
export default class Register extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            hidePassword: true,
            hideRe_Password: true,
            password: '',
            useremail: "",
            username: "",
            userpassword: "",
            userconfrompassword: "",
            isLoader: false,
            validate_email: false,
            validate_username: false,
            validate_pass: false,
            validate_confirm_pass: false,
            is_valid_password: false,
            isFocused: true,  RequestModal: false,
            mm: true, ee: false,
            selection: { start: 0, end: 0 },
            countrycode: "+ 91 IN",pickerModal:false,isValidatePwdInput: true, isValidateEmailInput: true,isValidateUNInput:true,isValidateRPwdInput:true
        }
    }


    componentDidMount = async () => {
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
            }
        );
    }
    pickerModalView(){
        this.setState({ pickerModal: true })
    }
    chng(text) {
       // debugger;
        this.setState({ useremail: text, validate_email: false, })
      if (isNaN(text)) {
            this.setState({ mm: false, ee: true,isValidateEmailInput: true })
        }
        else {
            this.setState({ ee: false, mm: true,isValidateEmailInput: true })
        }

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
            this.setState({ userpassword: text, is_valid_password: false,isValidatePwdInput:true })
        } else {
            this.setState({ userpassword: text, is_valid_password: false,isValidatePwdInput:true })
        }
    }

    register_user = async () => {
       // debugger;
        const { userpassword, username, userconfrompassword, useremail } = this.state;
        //let isAllFieldsEmpty = false;
       
        if (useremail == "" && username == "" && userpassword == "" && userconfrompassword == "") {
            this.setState({isValidateUNInput:false,isValidateEmailInput:false,
                isValidatePwdInput:false,isValidateRPwdInput:false,isLoader: false})
        }
       
        // if (useremail == "" && username == "" && userpassword == "" && userconfrompassword == "") {

        //     this.setState({
        //         validate_email: true,
        //         validate_username: true,
        //         is_valid_password: true,
        //         validate_confirm_pass: true
        //     });
        //     return;
        // }
        // if (useremail == "") {
        //     this.setState({
        //         validate_email: true
        //     });
        //     return;
        // } else if (username == "") {
        //     this.setState({
        //         validate_username: true
        //     });
        //     return;
        // } else if (userpassword == "") {
        //     this.setState({
        //         is_valid_password: true
        //     });
        //     return;
        // } else if (userconfrompassword == "") {
        //     this.setState({
        //         validate_confirm_pass: true
        //     });
        //     return;
        // }
        
        if (this.state.userpassword != this.state.userconfrompassword) {
            toastMsg1('danger', 'Password mismatched!')
        }
        
        // if (useremail != "" && username != "" && userpassword != "" && userconfrompassword != "") {
          
        if (useremail != "" && username != "" && this.state.userpassword == this.state.userconfrompassword) {   
            debugger
            this.setState({ isLoader: true, validate_email: false, validate_username: false, is_valid_password: false, validate_confirm_pass: false });

            const url = serviceUrl.been_urlP01 + "/UserSignup";
            const header = serviceUrl.headers;
            const method = serviceUrl.method;
            Common_Api.Register.name = username
            Common_Api.Register.email = useremail
            Common_Api.Register.password = userconfrompassword
            Common_Api.Register.fcm_device_token = await AsyncStorage.getItem('fcmToken')
           
            return fetch(url, {
                method: 'POST',
                headers: header,
                body: JSON.stringify(Common_Api.Register),
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log('user signup', responseJson)
                    if (responseJson.status == "True") {
                        this.setState({ isLoader: false });
                        AsyncStorage.setItem('userId', responseJson.result[0].userId);
                        //AsyncStorage.setItem('emailId', responseJson.result.Email)
                        console.log('this is Nan check',isNaN(useremail));
                        if (isNaN(useremail)) {
                            var data = {
                                email: useremail,
                            }
                            console.log('this is Nan ',data);
                            var base_url = serviceUrl.been_urlP01 + "/OtpGeneration"
                            fetch(base_url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
                                },
                                body: JSON.stringify(data),
                            }).then((response) => response.json())
                                .then((responseJson) => {
                                    console.log('otp generation if cond', responseJson)
                                    AsyncStorage.setItem('Email', responseJson.result[0].Email);
                                    this.props.navigation.navigate('OTP', { parent: 'signup', email: this.state.useremail });
                                })
                                .catch((error)=> {
                                    console.log(error);
                                    reject(new Error(`Unable to retrieve events.\n${error.message}`));
                                });
                        }
                        else {
                            var data = {
                                email: useremail,
                            }
                            console.log('this is Nan else cond',data);
                            var base_url = serviceUrl.been_url + "/OtpGeneration"
                            fetch(base_url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
                                },
                                body: JSON.stringify(data),
                            }).then((response) => response.json())
                                .then((responseJson) => {
                                    console.log('otp generation else cond', responseJson)
                                    if (responseJson.status === "True") {
                                        AsyncStorage.setItem('Email', responseJson.result[0].Email);
                                        AsyncStorage.setItem('Otp', responseJson.result[0].Otp);
                                        //AsyncStorage.setItem('_id', responseJson.result[0].userId);
                                        this.props.navigation.navigate('OTP', { parent: 'signup', email: this.state.useremail });
                                    }
                                    else {

                                    }
                                })
                                .catch((error)=> {
                                    console.log(error);
                                    console.log(error);
                                    reject(new Error(`Unable to retrieve events.\n${error.message}`));
                                });
                        }
                    } else if (responseJson.status == "False") {
                        this.setState({ isLoader: false });
                        toastMsg1('danger', responseJson.message)
                    }
                    else {
                        this.setState({ isLoader: false });
                       //ToastAndroid.show(responseJson.message, ToastAndroid.LONG);
                       toastMsg('success', responseJson.message)
                    }
                })
                .catch((error)=> {
                    console.log('line 160', error);
                    this.setState({ isLoader: false });
                });

        };
    }

    PasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }
    Re_passwordVisibility = () => {
        this.setState({ hideRe_Password: !this.state.hideRe_Password });
    }

    handleFocus = () => this.setState({ isFocused: true })

    handleBlur = () => this.setState({ isFocused: false })

    onchange(text) {
        this.setState({
            useremail: text,
            username: text,
        })

    }

    render() {
        const keyboardVerticalOffset = Platform.OS === "ios" ? 5 : 0;
        const { is_valid_password, validate_confirm_pass, validate_username, validate_email,mm } = this.state;
        return (
            <KeyboardAvoidingView
                style={{ flex: 1,backgroundColor:'#fff' }}
                keyboardVerticalOffset={keyboardVerticalOffset}
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='false'
                >
                    <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                    <View style={common_styles.common_baground}>

                        {/* <Image style={{ width: wp(16), height: hp(12), alignSelf: 'center', alignItems: 'center',
                          alignContent: 'center',marginTop:0, }}
                            resizeMode={'contain'} source={require('../../Assets/Images/new/signUp.png')} /> */}
                        <View >
                            <Text style={[common_styles.sign_up, { marginLeft: 0 }]}>Sign Up</Text>

                            <View style={{ width: wp(96) }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', }} >

                                            <TextInput
                                            //  style={
                                            //     !this.state.isValidateEmailInput
                                            //       ? common_styles.errorInput1
                                            //       : common_styles.input1
                                            //   }
                                                selectionColor={"#f0275d"}
                                                placeholder="Email or Mobile Number"
                                                placeholderTextColor="#000"
                                                onFocus={this.handleFocus}
                                                onBlur={this.handleBlur}
                                                value={this.state.useremail}
                                                autoCorrect={false}
                                                keyboardType="default"
                                                onChangeText={(text) => this.chng(text)}
                                                error={this.state.is_Valid_mail}
                                                maxLength = {mm ? 10 : null}
                                                style={[Common_Style.textInputSignUp, { width: '100%', borderWidth: 1, paddingLeft: mm ? 65 : 10, borderColor: '#000', backgroundColor: '#ebebeb', backgroundColor: '#fff' }]} />

                                            {mm &&
                                             (<View style={{ justifyContent: 'center', left: 10, bottom: 14, position: 'absolute' }}>
                                                <TouchableOpacity onPress={() =>  this.pickerModalView()}>
                                                    <Text style={[common_styles.hide_eye_Image, { width: 80, color: "blue", fontSize: profilename.FontSize,  }]}> {this.state.countrycode} </Text>
                                                </TouchableOpacity>                          
                                              </View>)
                                            }
                                  
                                        </View>
                                        <View style={{ width: "80%", alignItems: "flex-start" }}>
                                       {!this.state.isValidateEmailInput ? (
                                         <Text style={{ color: "red" }}>*Shouldn't be blank</Text>
                                       ) : null}
                                     </View>
                                     </View>
                                    {/* : null} */}


                                <TextInput
                                //  style={
                                //     !this.state.isValidateUNInput
                                //       ? common_styles.errorInput1
                                //       : common_styles.input1
                                //   }
                                    placeholder="User Name"
                                    placeholderTextColor="#000"
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    onChangeText={(text) => this.setState({ username: text, validate_username: false,isValidateUNInput:true })}
                                    value={this.state.username}
                                    autoCorrect={false}
                                    keyboardType="default"
                                    error={validate_username}
                                    style={[Common_Style.textInputSignUp, { width: '100%', borderWidth: 1, paddingLeft: 14, borderColor: '#000', backgroundColor: '#ebebeb', backgroundColor: '#fff' }]} 
                                    selectionColor={'#f0275d'}
                                    theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />
                                  <View style={{ width: "80%", alignItems: "flex-start" }}>
                                        {!this.state.isValidateUNInput ? (
                                          <Text style={{ color: "red" }}>*Shouldn't be blank</Text>
                                        ) : null}
                                      </View>
                                <View style={{ flexDirection: 'row', overflow: 'hidden' }} >

                                    <TextInput
                                    //   style={
                                    //     !this.state.isValidatePwdInput
                                    //       ? common_styles.errorInput1
                                    //       : common_styles.input1
                                    //   }
                                         placeholder="Password"
                                         placeholderTextColor="#000"
                                        onFocus={this.handleFocus}
                                        autoCorrect={false}
                                        // keyboardType="default"
                                        onBlur={this.handleBlur}
                                        secureTextEntry={this.state.hidePassword}
                                        onChangeText={(text) => this.validatePassword(text)}
                                        value={this.state.userpassword}
                                        error={is_valid_password}
                                        style={[Common_Style.textInputSignUp, { width: '100%', borderWidth: 1, paddingLeft: 14, borderColor: '#000', backgroundColor: '#ebebeb', backgroundColor: '#fff' }]} 
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />


                                    <View style={{ justifyContent: 'center', right: 5, bottom: 8, position: 'absolute', width: '10%', height: '60%', }}>
                                        <TouchableOpacity onPress={this.PasswordVisibility}>
                                            {(this.state.hidePassword) ?
                                                <Image source={require('../../Assets/Images/hidePass.png')}
                                                    style={common_styles.hide_eye_Image} /> :
                                                <Image source={require('../../Assets/Images/ShowPass.png')}
                                                    style={common_styles.show_eye_Image} />}
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                    <View style={{ width: "80%", alignItems: "flex-start" }}>
                                           {!this.state.isValidatePwdInput ? (
                                             <Text style={{ color: "red" }}>*Shouldn't be blank</Text>
                                           ) : null}
                                         </View>
                               
                               
                                        

                                <View style={{ flexDirection: 'row', overflow: 'hidden' }} >

                                    <TextInput
                                    //   style={
                                    //     !this.state.isValidateRPwdInput
                                    //       ? common_styles.errorInput1
                                    //       : common_styles.input1
                                    //   }
                                        placeholder="Re-enter password"
                                        placeholderTextColor="#000"
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        autoCorrect={false}
                                        // keyboardType="default"
                                        secureTextEntry={this.state.hideRe_Password}
                                        onChangeText={(text) => this.setState({ userconfrompassword: text, validate_confirm_pass: false,isValidateRPwdInput:true })}
                                        value={this.state.userconfrompassword}
                                        error={validate_confirm_pass}
                                        style={[Common_Style.textInputSignUp, { width: '100%', borderWidth: 1, paddingLeft: 14, borderColor: '#000', backgroundColor: '#ebebeb', backgroundColor: '#fff' }]} 
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />


                                    <View style={{ justifyContent: 'center', right: 5, bottom: 8, position: 'absolute', width: '10%', height: '60%', }}>
                                        <TouchableOpacity onPress={this.Re_passwordVisibility}>
                                            {(this.state.hideRe_Password) ?
                                                <Image source={require('../../Assets/Images/hidePass.png')}
                                                    style={common_styles.hide_eye_Image} /> :
                                                <Image source={require('../../Assets/Images/ShowPass.png')}
                                                    style={common_styles.show_eye_Image} />}
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                    <View style={{ width: "80%", alignItems: "flex-start" }}>
                                           {!this.state.isValidateRPwdInput ? (
                                             <Text style={{ color: "red" }}>*Shouldn't be blank</Text>
                                           ) : null}
                                        
                                         </View>
                               
                                </View>
                            </View>

                        {this.state.isLoader ? <Loader /> :
                            <View style={common_styles.Common_button}>
                                <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                        onPress={() => this.register_user()}>
                                        <Text style={common_styles.Common_btn_txt}>Next</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>
                        }


                        <View style={{ flexDirection: 'column' }}>
                            <View style={[common_styles.member_login, { justifyContent: 'center', marginTop: 10 }]}>

                                <Text style={common_styles.member_txt}>Already a member?</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                                    <Text style={common_styles.login_txt}>Sign In</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, justifyContent: 'center', }}>
                                <Text style={common_styles.termsText}>By using this service, you agree to the</Text>
                                <Text onPress={() => this.props.navigation.navigate('Terms')} style={[common_styles.termsText1, {}]}> Terms of use </Text>
                                <Text style={common_styles.termsText1}> and </Text>
                                <Text onPress={() => this.props.navigation.navigate('DataPolicy')} style={[common_styles.termsText1, {}]}> Data Policy</Text>
                            </View>

                        </View>

                    </View>

                     {/* picker cancel Modal */}
                     <Modal isVisible={this.state.pickerModal}
                        onBackdropPress={() => this.setState({ pickerModal: false })}
                        onBackButtonPress={() => this.setState({ pickerModal: false })} >
                        <View style={{ backgroundColor: '#fff', borderRadius: 8,height:'70%' }} >
                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle='light-content' />
                           <ScrollView>
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>   
                                <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AF.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 93 AF" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' }}>
                                     + 93 Afghanistan
                                    </Text>
                                    </View>      
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AL.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30 }} />                        
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 355 AL" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' }}>
                                     + 355 Albania
                                    </Text>
                                    </View>  
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'DZ.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 213 DZ" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 213 Algeria
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AS.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 1 AS" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 1 American Samoa
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AD.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 376 AD" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 376 Andorra
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AO.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 244 AO" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 244 Angola
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AG.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 1 AG" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 1 Antigua and Barbuda
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AR.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 54 AR" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 54 Argentina
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AM.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 374 AM" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 374 Armenia
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'ARM.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 297 AW" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 297 Aruba
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AU.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 61 AU" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 61 Australia
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AT.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 43 AT" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 43 Austria
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'AZ.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 994 AZ" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 994 Azerbaijan
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'BS.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 1 BS" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 1 Bahamas
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'BH.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 973 BH" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 973 Bahrain
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'BD.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 880 BD" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 880 Bangladesh
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'BB.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 1 BB" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 1 Barbados
                                    </Text> 
</View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'BY.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 375 BY" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 375 Belarus
                                    </Text>
                                    </View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'BE.jpg')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 32 BE" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 32 Belgium
                                    </Text>
                                    </View> 
                                    <View style={{flexDirection:'row'}}>
                                <Image source={require(imagePath2 + 'India.png')} style={{width: 18, height: 18,marginTop:20,marginLeft:30}} />
                                    <Text onPress={()=>this.setState({ pickerModal: false,countrycode: "+ 91 IN" })} style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%' ,marginLeft:'8%'  }}>
                                     + 91 India
                                    </Text>
                                    </View> 
                                </View> 
                                </ScrollView>

                        </View>
                    </Modal>

 

 

                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}



