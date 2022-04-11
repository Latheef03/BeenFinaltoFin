import React, { Component } from 'react';
import {
    View, Text, Image, TouchableOpacity, ScrollView,
    ImageBackground, StatusBar, Alert, ToastAndroid,
    KeyboardAvoidingView,Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import common_styles from "../../Assets/Styles/Common_Style"
import { Container, Content, } from 'native-base';
import OTPInput from 'react-native-otp';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
let Common_Api = require('../../Assets/Json/Common.json')

export default class OTP extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        
        this.state = {
            otp: '',
            send_otp_loader: false,
            resend_otp_loader: '',
            email: this.props.navigation.state?.params?.email,
            parent_component: this.props.navigation.state?.params?.parent,
            button_name: '',
            resendLoad : false,
        }
    }

    componentDidMount() {
      this.onLoad();
    }

    async onLoad() {
       // debugger;
        const propsEmail = this.props.navigation.state?.params?.email;
        const localStoreEmail = await AsyncStorage.getItem('Email');
        // console.log('actula amail',localStoreEmail ,'and its type ',typeof localStoreEmail);
        const actualMail = (localStoreEmail == null) ? propsEmail : localStoreEmail;
        // console.log('actula amail',actualMail);
        console.log('thisprops',this.props)
        console.log('params',this.props.route?.params?.parent)
        //?.params?.parent
        this.setState({
            email: actualMail,
            parent_component : this.props.route?.params?.parent,
            button_name : this.props.route?.params?.parent == 'signup' ? 'Sign Up' : 'Submit'
        })
    }

    UNSAFE_componentWillMount() {
       // debugger;
        // if (this.state.parent_component == 'signup') {
        //     this.setState({ button_name: 'Sign Up' })
        // } else {
        //     this.setState({ button_name: 'Submit' })
        // }

        
    }

    handleOTPChange = (otp) => {
        this.setState({ otp: otp })
    }


    handle_verifyotp = async() => {
        debugger
        const {parent_component} = this.state;
        console.log('parentcomr',parent_component);
        if(parent_component == 'Login'){
            this.getAuthOTPVerify();
            return;
        }

        if (this.state.otp.length < 4) {
            toastMsg1('danger', 'Please enter 4 digit OTP');
            return;
        } else {
            const url = serviceUrl.been_url + "/OtpValidation";
            const header = serviceUrl.headers;
            Common_Api.Verifyotp.email = this.state.email
            Common_Api.Verifyotp.otp = this.state.otp

            // console.log('the email',this.state.email);
            // console.log('Common_Api',Common_Api.Verifyotp);
            this.setState({send_otp_loader:true})
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
                },
                body: JSON.stringify(Common_Api.Verifyotp),
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log('OtpValidation', responseJson)
                    this.setState({send_otp_loader:false})
                    if (responseJson.status == "True") {
                            const [data] = responseJson.result || [];
                            // console.log('the extracted data', data?.ProfileType, 'and its type', typeof data?.ProfileType);
                            // console.log('the data',data);
                            if(data){
                                AsyncStorage.setItem('userId', data?.userId != null ? data?.userId : "");
                                AsyncStorage.setItem('userIdForSwitch', data.userId != null ? data.userId : "");
                                AsyncStorage.setItem('name', data.Name != null ? data.Name : "");
                                AsyncStorage.setItem('email', data.email != null ? data.email : "");
                                AsyncStorage.setItem('profileType', data.ProfileType != null ? JSON.stringify(data.ProfileType) : "");
                                AsyncStorage.setItem('localProfile', data.LocalStatus != null ? data.LocalStatus : "");
                                AsyncStorage.setItem('chatUserID', data.chatuserId != null ? data.chatuserId : "");
                                AsyncStorage.setItem('chatUserPWD', data.password != null ? data.password : "");
                                AsyncStorage.setItem('ProfilePic', data.ProfilePic != null ? data.ProfilePic : "");
                                AsyncStorage.setItem('nameUser', data.Name != null ? data.Name : "");
                            }
                            //toastMsg('success', responseJson.message)
                            this.state.button_name == 'Sign Up' ?
                                // this.props.navigation.navigate('Login', { email: this.state.email }) :
                                // this.props.navigation.navigate('Reset_Password', { email: this.state.email, otp: this.state.otp })
                             
                                this.props.navigation.navigate('MyPager',{ email: this.state.email }) :
                                this.props.navigation.navigate('Reset_Password', { email: this.state.email, otp: this.state.otp })
                         
                    } else {
                        this.setState({ send_otp_loader: false });
                        toastMsg1('danger', "Incorrect OTP! You have entered a wrong OTP")
                    }
                })
                .catch((error)=> {
                    this.setState({ send_otp_loader: false });
                    console.log('errror otp',error);
                    console.log('errror otp msg',error.message);
                    toastMsg1('danger', error.message)
                });

        }
    }

    getAuthOTPVerify = async() =>{
        console.log('dfd',this.state.email,'--',this.state.otp);
       
        if (this.state.otp.length < 4) {
            toastMsg1('danger', 'Please enter 4 digit OTP');
            return;
        } else {
            const url = serviceUrl.been_url + "/OtpValidationAuthentication";
            const header = serviceUrl.headers;
            Common_Api.Verifyotp.email = this.state.email
            Common_Api.Verifyotp.otp = this.state.otp
            console.log('daa',Common_Api.Verifyotp);
            this.setState({send_otp_loader:true})
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
                },
                body: JSON.stringify(Common_Api.Verifyotp),
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log('OtpValidation', responseJson)
                    this.setState({send_otp_loader:false})
                    if (responseJson.status == "True") {
                            //toastMsg('success', responseJson.message)
                         this.props.navigation.navigate('MyPager',) 
                    } else {
                        this.setState({ send_otp_loader: false });
                        toastMsg1('danger',responseJson.message)
                    }
                })
                .catch((error)=> {
                    console.log(error)
                    this.setState({send_otp_loader:true})
                    toastMsg1('danger',error.message)
                    // this.setState({ isLoader: false });
                });

        }
    }


    handle_resend_otp = () => {
        const url = serviceUrl.been_url + "/OtpGeneration";
        const header = serviceUrl.headers;
        Common_Api.Forgotpassword.email = this.state.email;
        this.setState({resendLoad : true});

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(Common_Api.Forgotpassword),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    //toastMsg('success', "OTP has been successfully resent to" + this.state.email);
                    AsyncStorage.setItem('Email', responseJson.result[0].Email);
                    AsyncStorage.setItem('Otp', responseJson.result[0].Otp);
                    this.onLoad();
                    this.setState({ resendLoad: false });
                    toastMsg('success','OTP sent successfully.please wait until receive OTP to you')
                   // ToastAndroid.show('OTP sent successfully.please wait until receive OTP to you',ToastAndroid.LONG)
                } else {
                    this.setState({ resendLoad: false });
                   // ToastAndroid.show('OTP sent went wrong.please try again',ToastAndroid.LONG)
                    toastMsg1('danger', "OTP sent went wrong.please try again")
                }
            })
            .catch((error)=> {
                toastMsg1('danger', "OTP sent went wrong.please try again")
                //ToastAndroid.show('OTP sent went wrong.please try again',ToastAndroid.LONG)
                this.setState({ resendLoad: false });
            });
    }

    render() {
        const {resendLoad} = this.state;
        const keyboardVerticalOffset = Platform.OS === "ios" ? 5 : 0;
        return (
            <KeyboardAvoidingView style={{flex:1,backgroundColor:'#fff'}} 
                keyboardVerticalOffset={keyboardVerticalOffset} 
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <View style={{height:'100%',flexDirection:'column',
                justifyContent:'center',alignSelf:'center',alignItems:'flex-end'}}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                    showsVerticalScrollIndicator = {false}
                    keyboardShouldPersistTaps='false'
                >

                    <View style={common_styles.common_baground}>
                        {/* <Image style={{ width: wp(20), height: hp(20), alignSelf: 'center', alignItems: 'center', alignContent: 'center' }} 
                            source={require('../../Assets/Images/new/otp.png')} 
                            resizeMode={'contain'}
                            /> */}

                        <View style={{ width: wp('90%'), justifyContent: 'center'}}>
                            <Text style={common_styles.sign_up}>OTP</Text>

                            <Text style={[common_styles.otpDummyText, { marginTop: 10,marginLeft:0,lineHeight:30 }]}>
                              A One Time Passcode has been sent to <Text style={{fontWeight:'bold'}}>{this.state.email}</Text>. Please enter the otp below to verify
                            </Text>
                            {/* <Text style={common_styles.otpDummyText}>Please enter the otp below to verify</Text> */}
                        </View>

                        <View style={{width:'100%',marginTop:0}}>
                            <OTPInput
                                value={this.state.otp}
                                onChange={this.handleOTPChange}
                                // tintColor = "transparent"
                                // offTintColor = 'transparent'
                                otpLength={4} 
                                tintColor="#a93056"
                                offTintColor="#a93056"
                                // containerStyle = {{width:'50%', borderBottomWidth: 1, 
                                //     borderBottomColor:'#a93056',marginHorizontal:100,
                                //  }} 
                                cellStyle={
                                 [common_styles.OTPInput_style,
                                 //{borderBottomWidth: 10, borderBottomColor:'#a93056'}
                                ]

                                 }
                            />
                        </View>

                        <View style={{width:'100%',justifyContent:'center',alignItems:'center',
                        padding:12,marginTop:18,}}>
                            <Text style={{marginRight:8,fontSize:12}}>Not received OTP yet?  
                            
                            <Text onPress={() =>{ !resendLoad? this.handle_resend_otp() : null }} 
                              style={{color:'red',marginLeft:8, 
                              textDecorationLine: !resendLoad ?'underline':'none',
                              }}> 
                               {resendLoad ? '  Sending OTP...' : ' Resend OTP'} 
                            </Text> 
                              
                           
                            </Text>
                            {/* <View style={{height:0.5,width:'24%',alignSelf:'flex-end',marginRight:62,
                            borderBottomWidth:1,borderBottomColor:'red',}} /> */}
                        </View>

                        <View style={{width:'100%',justifyContent:'center',alignContent:'center'}}>
                        {this.state.send_otp_loader ? <Loader /> :
                            <View style={[common_styles.signUp_btn_View,{
                                
                            }]}>
                                <ImageBackground source={require('../../Assets/Images/button.png')} style={[common_styles.Common_button,{
                                    width:380,marginTop:-15,
                                }]}
                                borderRadius = {10}
                                >
                                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', 
                                     alignContent: 'center' }}
                                        onPress={() => this.handle_verifyotp()}
                                    >
                                        <Text style={common_styles.Common_btn_txt}>{this.state.button_name}</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>}
                        </View>      
                        <View style={common_styles.member_login_otp}>
                            <Text style={common_styles.member_txt_otp}>Already a member?</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                                <Text style={common_styles.login_txt_otp}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        {/* {this.state.resend_otp_loader ? <Loader /> :
                            <TouchableOpacity >
                                <View style={common_styles.resend_btn_View}>
                                    <TouchableOpacity onPress={() => this.handle_resend_otp()} style={common_styles.resend_otp_button}>
                                        <Image
                                            source={require('../../Assets/Images/resendOTP.png')}
                                            style={common_styles.resend_Img} />
                                        <Text style={common_styles.resend_otp_btn_txt}> Resend OTP</Text>
                                    </TouchableOpacity>
                                </View></TouchableOpacity>} */}


                        <View style={{ width:'100%', flexDirection: 'row',justifyContent:'center',marginBottom:10,
                        marginTop:30
                    }}>
                            <Text style={common_styles.termsText}>By using this service, you agree to the</Text>
                            <Text onPress={() => this.props.navigation.navigate('Terms')} style={[common_styles.termsText, { color: '#85aae1' }]}> Terms of use </Text>
                            <Text style={common_styles.termsText}> and </Text>
                            <Text onPress={() => this.props.navigation.navigate('DataPolicy')} style={[common_styles.termsText, { color: '#85aae1' }]}> Data Policy</Text>
                        </View>

                    </View>

                </ScrollView>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

