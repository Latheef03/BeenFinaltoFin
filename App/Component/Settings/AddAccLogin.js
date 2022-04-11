import React, { Component } from 'react';
import { View, Text, Image,TextInput,KeyboardAvoidingView, TouchableOpacity, ScrollView, ImageBackground, BackHandler, ToastAndroid } from 'react-native';
import common_styles from "../../Assets/Styles/Common_Style"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Content, Toast } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader';
let Common_Api = require('../../Assets/Json/Common.json')
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import { TextInput, HelperText } from 'react-native-paper';
import QB from 'quickblox-react-native-sdk';
import Common_Style from '../../Assets/Styles/Common_Style';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Modal from "react-native-modal";
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const imagePath2 = '../../Assets/Images/BussinesIcons/FlagIcons/'
export default class AddAccLogin extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            hidePassword: true,
            useremail: '',
            userpassword: '',
            blank_pass: true,
            blank_email: true,
            isLoader: false,
            is_valid_password: false,
            is_Valid_mail: false,
            RequestModal: false,
            LoginVal: '',message:'',RequestModal: false,
            mm: true, ee: false,
            countrycode: "+ 91 IN",pickerModal:false,isValidatePwdInput: true, isValidateEmailInput: true,

        }
    }

    componentWillMount() {
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => { this.setState({ isLoader: false }) })
    }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // }

    // handleBackButton = () => {
    //     BackHandler.exitApp();
    // };
    PasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }
    pickerModalView(){
        this.setState({ pickerModal: true })
    }
    chng(text) {
       // debugger;
        this.setState({ useremail: text, is_Valid_mail: false, })
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

    handle_Login = async () => {
       // debugger;
        const { useremail, userpassword } = this.state;

        if (useremail == '' && userpassword == '') {
            // this.setState({
            //     is_Valid_mail: true,
            //     is_valid_password: true
            // });
            this.setState({isValidateEmailInput: false,isValidateInputs: false,isValidatePwdInput:false })
        }

        // if (useremail == '') {
        //     this.setState({
        //         is_Valid_mail: true,
        //     });
        //     return;
        // } else if (userpassword == '') {
        //     this.setState({
        //         is_valid_password: true,
        //     });
        //     return;
        // }

        if (this.state.useremail != "" && this.state.userpassword != "") {
            this.setState({ blank_email: true, blank_pass: true })
            this.setState({ isLoader: true });

            Common_Api.Login.Email = this.state.useremail
            Common_Api.Login.Password = this.state.userpassword
            Common_Api.Login.Userid = await AsyncStorage.getItem('userId')

            console.log('the user name', this.state.useremail, '-pwd',
                this.state.userpassword);
            const info = await this.qbLogin(this.state.useremail, this.state.userpassword);
            if (info != false && info.constructor == Object) {
                console.log('the login user', info)
                this.beenLogin(Common_Api.Login)
            } else {
                console.log('ther error', info)
                // this.setState({ isLoader: false });
                // ToastAndroid.show('Unauthorized.check username and password',ToastAndroid.LONG);
                this.setState({ RequestModal: true, isLoader: false })
                setTimeout(() => {
                    this.setState({ RequestModal: false, })
                }, 3000)
                return false;
            }

        }
    }


    reqCancel() {
        this.setState({ RequestModal: false, })
    }
    qbLogin = async (loginCred, chatUserPwd) => {
        console.log('the user name qb', loginCred, '-pwd', chatUserPwd);

        try {
            const info = await QB.auth
                .login({
                    login: loginCred,
                    password: chatUserPwd
                });
            return info;
        } catch (error) {
            console.log('users info with error', error);
            return false;
        }
    }

    beenLogin = async (userCreds) => {
       // debugger;
        const { useremail, userpassword } = this.state;

        if (useremail == '' && userpassword == '') {
            // this.setState({
            //     is_Valid_mail: true,
            //     is_valid_password: true
            // });
            this.setState({isValidateEmailInput: false,isValidateInputs: false,isValidatePwdInput:false })
        }
        if (this.state.useremail != "" && this.state.userpassword != "") {
            this.setState({ blank_email: true, blank_pass: true })
            this.setState({ isLoader: true });
        // console.log('the been login creds',userCreds);
        var data={
           Email : this.state.useremail,
           Password : this.state.userpassword,
           Userid : await AsyncStorage.getItem('userIdForSwitch')

        }
        const url = serviceUrl.been_urlP01 + "/Addaccount";
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then(async (responseJson) => {
                console.log('login response', responseJson)
                     this.setState({ RequestModal: true, isLoader: false, LoginVal: responseJson.status, message:responseJson.message })
                     if (responseJson.status == "True") {
                     setTimeout(() => {
                        this.setState({ RequestModal: false, })
                    }, 3000)
                    this.props.navigation.navigate('SettingsScreen');
                     }
                     else
                     {
                        setTimeout(() => {
                            this.setState({ RequestModal: false, })
                        }, 3000)
                        this.props.navigation.navigate('AddAccLogin');
                     }
            }).catch(function (error) {
                if (error.response.status == false) {
                    //toastMsg('danger', error.response.message, '#cb1f4c')
                    this.setState({ isLoader: false });
                }
                this.setState({ isLoader: false });
            });
        }
    }


    render() {
        const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
        const {mm } = this.state;
        return (
            <KeyboardAvoidingView style={{ flex: 1,marginTop:'5%' }}
                keyboardVerticalOffset={keyboardVerticalOffset} behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='false'
                >
                    <View style={common_styles.common_baground}>
                        {/* <Image style={{ width: wp(24), height: hp(16), alignSelf: 'center', alignItems: 'center', alignContent: 'center' }}
                            resizeMode={'contain'} source={require('../../Assets/Images/new/login.png')} /> */}
                        <View style={{ marginTop: 20 }}>
                            <Text style={common_styles.sign_up}>Add Account</Text>

                            <View style={{ width: wp('96%'), }}>
                                {/* <TextInput
                                    label="Email or Mobile Number"
                                    mode="outlined" 
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    value={this.state.useremail}
                                    onChangeText={(text) => this.setState({ useremail: text, is_Valid_mail: false, })}
                                    error={this.state.is_Valid_mail}
                                    style={[common_styles.textInputSignUp, { width: '100%' }]}
                                    selectionColor={'#f0275d'}
                                    theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} /> */}
                            
                                     {/* <TextInput
                                         label="Email or Mobile Number"
                                        mode="outlined"
                                        onFocus={this.handleFocus}
                                         onBlur={this.handleBlur}
                                         value={this.state.useremail}
                                         onChangeText={(text) => this.chng(text)}
                                         // onChangeText={(text) => this.setState({ useremail: text, is_Valid_mail: false, })}
                                         error={this.state.is_Valid_mail}
                                         style={[common_styles.textInputSignUp, { width: '100%', }]}
                                         selectionColor={'#f0275d'}
                                         // selection= {
                                         //     this.state.selection}
                                         theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} /> */}
                                  <View>
                                    {/* <TextInput
                                    style={
                                        !this.state.isValidateEmailInput
                                          ? common_styles.errorInput1
                                          : common_styles.input1
                                      }
                                        selectionColor={"#f0275d"}
                                        placeholder="Email or Mobile Number"
                                        placeholderTextColor="#000"
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        autoCorrect={false}
                                        //  keyboardType="visible-password"
                                        value={this.state.useremail}
                                        onChangeText={(text) => this.chng(text, "emailphone")}
                                        error={this.state.is_Valid_mail}
                                        style={[Common_Style.textInputSignUp, { borderWidth: 1, paddingLeft: 12, borderColor: '#000', backgroundColor: '#ebebeb', backgroundColor: '#fff', width: '100%', }]} />
                                        
                                        <View style={{ width: "80%", alignItems: "flex-start" }}>
                                        {!this.state.isValidateEmailInput ? (
                                          <Text style={{ color: "red" }}>*Shouldn't be blank</Text>
                                        ) : null}
                                      </View> */}
                                      </View>
                                        {/* : */}
                                   
                                    <View>
                                        <View style={{ flexDirection: 'row', }} >
                                            

                                            <TextInput
                                             style={
                                                !this.state.isValidateEmailInput
                                                  ? common_styles.errorInput1
                                                  : common_styles.input1
                                              }
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
                                                onChangeText={(text) => this.chng(text)}
                                                style={[Common_Style.textInputSignUp, { width: '100%', borderWidth: 1, paddingLeft: mm ? 65 : 10, borderColor: '#000', backgroundColor: '#ebebeb', backgroundColor: '#fff' }]} />
                                            {mm &&
                                            (<View style={{ justifyContent: 'center', left: 10, bottom: 14, position: 'absolute' }}>                           
                                                <TouchableOpacity onPress={() =>  this.pickerModalView()}>
                                                    <Text style={[common_styles.hide_eye_Image, { width: 80, color: "blue", fontSize: profilename.FontSize, fontFamily: profilename.Font, }]}> {this.state.countrycode} </Text>
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


                                <View style={{ flexDirection: 'row', }} >

                                    <TextInput
                                     style={
                                        !this.state.isValidatePwdInput
                                          ? common_styles.errorInput1
                                          : common_styles.input1
                                      }
                                        placeholder="Password"
                                        placeholderTextColor="#000"
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        autoCorrect={false}
                                        // //  keyboardType="visible-password"
                                        secureTextEntry={this.state.hidePassword}
                                        onChangeText={(text) => this.setState({ userpassword: text, is_valid_password: false,isValidatePwdInput:true })}
                                        value={this.state.userpassword}
                                        error={this.state.is_valid_password}
                                        style={[Common_Style.textInputSignUp, { paddingLeft: 14, width: '100%', borderWidth: 1, borderColor: '#000', backgroundColor: '#ebebeb', backgroundColor: '#fff' }]} 
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />
                                </View>

                                <View style={{ justifyContent: 'center', right: 10, bottom: 16, position: 'absolute' }}>
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
                        </View>




                        <View style={[common_styles.forgot_view, { marginRight: 15, }]} >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Forgot_Password')}>
                                <Text style={common_styles.forgot_txt}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        {this.state.isLoader ? <Loader /> :
                            <View style={[common_styles.Common_button, { width: wp(96) }]}>
                                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                    borderRadius={10}
                                >

                                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                        // onPress={() => this.handle_Login()}>
                                        onPress={() => this.beenLogin()}>  
                                        <Text style={common_styles.Common_btn_txt}>Sign In</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>
                        }

                        <View style={{ flexDirection: 'column' }}>
                            <View style={[common_styles.member_login, { justifyContent: 'center', marginTop: 10 }]}>

                                <Text style={common_styles.member_txt}>Do you have an account?</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                                    <Text style={common_styles.login_txt}> Sign Up</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10, justifyContent: 'center', }}>
                                <Text style={common_styles.termsText}>By using this service, you agree to the</Text>
                                <Text onPress={() => this.props.navigation.navigate('Terms')} style={[common_styles.termsText1, {}]}> Terms of use </Text>
                                <Text style={common_styles.termsText1}> and </Text>
                                <Text onPress={() => this.props.navigation.navigate('DataPolicy')} style={[common_styles.termsText1, {}]}> Data Policy</Text>
                            </View>

                        </View>


                    </View>
                    {/* Request cancel Modal */}
                    <Modal isVisible={this.state.RequestModal}
                        onBackdropPress={() => this.setState({ RequestModal: false })}
                        onBackButtonPress={() => this.setState({ RequestModal: false })} >
                        <View style={{ backgroundColor: '#fff', borderRadius: 8 }} >
                            {this.state.LoginVal == "" ?
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                                    <Text style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16 }}>
                                        "Unauthorized.check username and password"
                                    </Text>
                                </View> :
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                                    <Text style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16 }}>
                                    {this.state.message}
                                 </Text>
                                </View>}
                            <View style={[Common_Style.Common_button, { width: wp(88), margin: 3, marginBottom: 15 }]}>

                                <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                    borderRadius={10}
                                >
                                    <TouchableOpacity onPress={() => { this.reqCancel() }}>
                                        <Text onPress={() => { this.reqCancel() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Ok</Text>
                                    </TouchableOpacity>
                                </ImageBackground>

                            </View>

                        </View>
                    </Modal>
              {/* picker cancel Modal */}
              <Modal isVisible={this.state.pickerModal}
                        onBackdropPress={() => this.setState({ pickerModal: false })}
                        onBackButtonPress={() => this.setState({ pickerModal: false })} >
                        <View style={{ backgroundColor: '#fff', borderRadius: 8,height:'70%' }} >
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

