import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, 
    ImageBackground, StatusBar, BackHandler, Alert,ToastAndroid,TextInput,KeyboardAvoidingView } from 'react-native';
import common_styles from "../../Assets/Styles/Common_Style"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Content } from 'native-base';
// import axios from "axios";
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader';
let Common_Api = require('../../Assets/Json/Common.json')
import Common_Style from '../../Assets/Styles/Common_Style';
import Modal from "react-native-modal";
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import { TextInput, HelperText } from 'react-native-paper';
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const imagePath2 = '../../Assets/Images/BussinesIcons/FlagIcons/'
export default class Forgot_Password extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            useremail: '',
            blank_email: false,
            isLoader: false,RequestModal: false,
            mm: true, ee: false,
            countrycode: "+ 91 IN",pickerModal:false,isValidatePwdInput: true, isValidateEmailInput: true,

        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            Alert.alert("", "Want to go back to Login ?", [{
                text: "Cancel", onPress: () => { }, style: "cancel"
            },
            { text: "Login", onPress: () => this.handleLogout() }], { cancelable: false });
            return true;
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.backHandler.remove();
    }

    handleLogout() {
        return this.props.navigation.navigate("Login");
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
    handle_forgot_pass() {
        if (this.state.useremail == "") {
            this.setState({ blank_email: true,isValidateEmailInput:false })
            return;
        } else {
            debugger
            this.setState({ blank_email: false,isLoader:true})
            const url = serviceUrl.been_url + "/OtpGeneration";
            const header = serviceUrl.headers;
            Common_Api.Forgotpassword.email = this.state.useremail;
            fetch(url, {
                method: 'POST',
                headers: header,
                body: JSON.stringify(Common_Api.Forgotpassword),
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log('resp',responseJson);
                    if (responseJson.status == "True") {
                        //toastMsg('success', "One Time Passcode has been sent to " + this.state.useremail);
                        AsyncStorage.setItem('Email', responseJson.result[0].Email);
                        this.setState({ isLoader: false });
                        this.props.navigation.navigate('OTP', { email: this.state.useremail, parent: "forgotPassword" });
                     } else {
                        this.setState({ isLoader: false });
                      //  ToastAndroid.show('Check email or mobile number',ToastAndroid.SHORT);
                        toastMsg1('danger', 'Check email or mobile number')
                    }
                })
                .catch((error)=> {
                    //ToastAndroid.show('something went wrong.please try again.',ToastAndroid.SHORT);
                    toastMsg1('danger', 'something went wrong.please try again.')
                    this.setState({ isLoader: false });
                });
        }
    }

    render() {
        const keyboardVerticalOffset = Platform.OS === "ios" ? 5 : 0;
        const {mm} = this.state
        return (
            <KeyboardAvoidingView style={{ flex: 1,backgroundColor:'#fff' }}
            keyboardVerticalOffset={keyboardVerticalOffset} 
            behavior={Platform.OS === "ios" ? "padding" : null}
        >
            <View style={{flex:1}}>
                <View style={{width:'96%',height:'100%',flexDirection:'column',justifyContent:'center',
                  alignSelf:'center',alignContent:'center',}}>

                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                  showsVerticalScrollIndicator = {false}
                  keyboardShouldPersistTaps='false'
                >
                    <View style={common_styles.common_baground}>

                        {/* <Image style={{ width: wp(24), height: hp(16), alignSelf: 'center', alignItems: 'center', alignContent: 'center' }} resizeMode={'stretch'}
                            source={require('../../Assets/Images/new/forgotPass.png')} /> */}

                        <View style={{ marginTop: '10%',alignSelf:'flex-start'}}>
                            <Text style={[common_styles.sign_up,]}>Forgot password</Text>
                       
                        <View style={{marginTop:10,width:wp(96)}}>
                                
                              
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
                                                keyboardType='default'
                                                onChangeText={(text) => this.chng(text)}
                                                error={this.state.is_Valid_mail}
                                                maxLength = {mm ? 10 : null}
                                                onChangeText={(text) => this.chng(text)}
                                                style={[Common_Style.textInputSignUp, { width: '100%', borderWidth: 1, paddingLeft: mm ? 65 : 10, borderColor: '#000', backgroundColor: '#ebebeb', backgroundColor: '#fff',
                                                 }]} />

                                              { mm &&
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
                        </View>
                        </View>
                           
                        
                        {this.state.isLoader ? <Loader /> :
                            <TouchableOpacity activeOpacity={1} onPress={() => this.handle_forgot_pass()}>

                                <View style={common_styles.Common_button}>
                                    <ImageBackground source={require('../../Assets/Images/button.png')} 
                                     style={{width:'100%',height:'100%'}}
                                     borderRadius = {10}
                                    >
                                        <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                            onPress={() => this.handle_forgot_pass()}>
                                            <Text style={common_styles.Common_btn_txt}>Submit</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>}



                    <View style={{width:'100%',justifyContent:'center'}}>     
                        <View style={[common_styles.account_signup_View, { marginTop: 15,alignSelf:'center' }]}>
                            <Text style={[common_styles.member_txt, { fontSize: 10, }]}>Already a member?</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                                <Text style={[common_styles.login_txt, { fontSize: Common_Color.smallFontSize,}]}>Sign In</Text>
                            </TouchableOpacity>
                            <Text style={[common_styles.member_txt, { fontSize: 10,}]}>  Do not have a account ?</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                                <Text style={[common_styles.signup_txt, { fontSize: Common_Color.smallFontSize,}]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection: 'row',marginTop:30,marginBottom:10,justifyContent:'center',}}>
                            <Text style={common_styles.termsText}>By using this service, you agree to the</Text>
                            <Text onPress={() => this.props.navigation.navigate('Terms')} style={[common_styles.termsText1, { }]}> Terms of use </Text>
                            <Text style={common_styles.termsText1}> and </Text>
                            <Text onPress={() => this.props.navigation.navigate('DataPolicy')} style={[common_styles.termsText1, {  }]}> Data Policy</Text>
                        </View>
                    </View>
                    
                  </View>  
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
                </View>
            </View>
      
      </KeyboardAvoidingView>
        )
    }
}

