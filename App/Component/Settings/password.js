import React, { Component } from 'react';
import { View, Text, ImageBackground, ScrollView, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import passwordStyle from './styles/passwordStyle';
import serviceUrl from '../../Assets/Script/Service';
import Common_Style from '../../Assets/Styles/Common_Style'
import { TextInput, HelperText } from 'react-native-paper';
import common_styles from "../../Assets/Styles/Common_Style"
import { Toolbar } from '../commoncomponent'


export default class password extends Component {

    static navigationOptions = {
        header: null,
    };

    state = {
        currentPassword: '',
        newPassword: '',
        RePassword: '',
        is_valid_password: false,
        visiblePassword: true,
        visiblePassword1: true,
        visiblePassword2: true,
        passwordIcon: false,
        passwordIcon1: false,
        passwordIcon2: false,

    }


    async changePassword() {
         debugger;
        const email = await AsyncStorage.getItem('email')
        const chatUserPWD = await AsyncStorage.getItem('chatUserPWD')
        if (this.state.newPassword != this.state.RePassword) {
            toastMsg1('danger', 'Your Password is mismatched')
        }
        else if(chatUserPWD != this.state.currentPassword){
            toastMsg1('danger', "Your current password is wrong")
        }
        else if(chatUserPWD == this.state.newPassword){
            toastMsg1('danger', 'Please change your new password')
        }
        else {
            // debugger;
            var data = {
                email: email,
                Password: this.state.currentPassword, Newpassword: this.state.newPassword
            };
            const url = serviceUrl.been_url1 + "/Setchangepassword"
                ;
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
                    console.log('album responses', responseJson);
                    if (responseJson.status == 'True') {
                        toastMsg('success', responseJson.message)
                        this.props.navigation.goBack();
                    }
                    else {
                        toastMsg1('danger', "Your current password is wrong")
                    }

                })
                .catch((error) => {
                    console.log(error);
                });

        }

    };

    visible() {

        this.setState({
            passwordIcon: !this.state.passwordIcon,
            visiblePassword: !this.state.visiblePassword,
        })
    }

    visible1() {
        this.setState({
            passwordIcon1: !this.state.passwordIcon1,
            visiblePassword1: !this.state.visiblePassword1,
        })
    }

    visible2() {

        this.setState({
            passwordIcon2: !this.state.passwordIcon2,
            visiblePassword2: !this.state.visiblePassword2,
        })

    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff',marginTop: 0}}>

                <Toolbar {...this.props} leftTitle="Password" />
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>

                    <View style={{ alignItems: 'center', flex: 1, }}>
                        <View style={{ marginTop: 20, marginBottom: 20 }}>

                            <View style={{ width: wp(96) }}>
                                <View style={{ flexDirection: 'row', }} >

                                    <TextInput
                                        label="Current Password"
                                        mode="outlined"
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={this.state.visiblePassword}
                                        onChangeText={(text) => { this.setState({ currentPassword: text }) }}
                                        value={this.state.currentPassword}
                                        error={this.state.is_valid_password}
                                        style={[common_styles.textInputSignUp, { width: '100%' }]}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />


                                    <View style={{ justifyContent: 'center', right: 18, bottom: 17, position: 'absolute' }}>
                                        <TouchableOpacity onPress={() => this.visible()}>
                                            <Image source={this.state.passwordIcon == true ? (require('../../Assets/Images/ShowPass.png')) : (require('../../Assets/Images/hidePass.png'))} style={passwordStyle.image} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', overflow: 'hidden' }} >

                                    <View style={{ flexDirection: 'row' }} >

                                        <TextInput
                                            label="New Password"
                                            mode="outlined"
                                            secureTextEntry={this.state.visiblePassword1}
                                            onChangeText={(text) => this.setState({ newPassword: text })}
                                            value={this.state.newPassword}
                                            underlineColorAndroid="transparent"
                                            error={this.state.blank_confirm_pass}
                                            style={[common_styles.textInputSignUp, { width: '100%' }]}
                                            selectionColor={'#f0275d'}
                                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />


                                        <View style={{ justifyContent: 'center', right: 18, bottom: 17, position: 'absolute' }}>
                                            <TouchableOpacity onPress={() => this.visible1()}>
                                                <Image source={this.state.passwordIcon1 ?
                                                    (require('../../Assets/Images/ShowPass.png')) :
                                                    (require('../../Assets/Images/hidePass.png'))}
                                                    style={passwordStyle.image}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </View>

                                <View style={{ flexDirection: 'row', overflow: 'hidden' }} >

                                    <View style={{ flexDirection: 'row' }} >

                                        <TextInput
                                            label="Re-Enter Password"
                                            mode="outlined"
                                            secureTextEntry={this.state.visiblePassword2}
                                            onChangeText={(text) => this.setState({ RePassword: text })}
                                            value={this.state.RePassword}
                                            underlineColorAndroid="transparent"
                                            error={this.state.blank_confirm_pass}
                                            style={[common_styles.textInputSignUp, { width: '100%' }]}
                                            selectionColor={'#f0275d'}
                                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />


                                        <View style={{ justifyContent: 'center', right: 18, bottom: 17, position: 'absolute' }}>
                                            <TouchableOpacity onPress={() => this.visible2()}>
                                                <Image source={this.state.passwordIcon2 == true ? (require('../../Assets/Images/ShowPass.png')) : (require('../../Assets/Images/hidePass.png'))} style={passwordStyle.image} /></TouchableOpacity>

                                        </View>
                                    </View>

                                </View>

                            </View>



                            <View style={[common_styles.Common_button, { marginBottom: 15, marginTop: 13 }]}>
                                <ImageBackground source={require('../../Assets/Images/button.png')} borderRadius={10} style={{ width: '100%', height: '100%' }}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                        onPress={() => this.changePassword()}>
                                        <Text style={common_styles.Common_btn_txt}>Update</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>

                        
                                {/* <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Account') }}>
                                    <Text style={passwordStyle.buttonText}>
                                        Cancel
                        </Text>
                                </TouchableOpacity> */}
                            <View style={[Common_Style.Common_button, { width: wp(95),marginTop: 8.5, marginBottom: -10 }]}>
            <TouchableOpacity style={{ height: hp('5.7%') }}  onPress={() => { this.props.navigation.navigate('Account') }} >

                <Text onPress={() => { this.props.navigation.navigate('Account') }}  style={[Common_Style.Common_btn_txt, { color: 'black', marginLeft: 5 }]}>Cancel</Text>
              </TouchableOpacity>

            </View>

                        </View>
                    </View>
                </ScrollView>
                {/* <View style={passwordStyle.container}>
                    <View style={{ flexDirection: 'row', width: wp('100%') }} >
                        <View style={{ width: wp('4%') }} />
                        <TextInput
                            label="Current Password"
                            mode="outlined"
                            secureTextEntry={this.state.visiblePassword}
                            onChangeText={(text) => { this.setState({ currentPassword: text }) }}
                            value={this.state.currentPassword}
                            style={passwordStyle.textInput}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />


                        <View style={{ alignContent: 'center', alignSelf: 'center', marginLeft: '2%' }}>
                            <TouchableOpacity onPress={() => this.visible()}>
                                <Image source={this.state.passwordIcon == true ? (require('../../Assets/Images/ShowPass.png')) : (require('../../Assets/Images/hidePass.png'))} style={passwordStyle.image} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={passwordStyle.container}>
                    <View style={{ flexDirection: 'row', width: wp('100%') }} >
                        <View style={{ width: wp('4%') }} />
                        <TextInput
                            label="New Password"
                            mode="outlined"
                            secureTextEntry={this.state.visiblePassword1}
                            onChangeText={(text) => this.setState({ newPassword: text })}
                            value={this.state.newPassword}
                            style={passwordStyle.textInput}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />

                        <View style={{ alignContent: 'center', alignSelf: 'center', marginLeft: '2%' }}>
                            <TouchableOpacity onPress={() => this.visible1()}>
                                <Image source={this.state.passwordIcon1? 
                                    (require('../../Assets/Images/ShowPass.png')) : 
                                    (require('../../Assets/Images/hidePass.png'))} 
                                 style={passwordStyle.image} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                <View style={passwordStyle.container}>

                    <View style={{ flexDirection: 'row', width: wp('100%') }} >
                        <View style={{ width: wp('4%') }} />
                        <TextInput
                            label="Re-Enter Password"
                            mode="outlined"
                            secureTextEntry={this.state.visiblePassword2}
                            onChangeText={(text) => this.setState({ RePassword: text })}
                            value={this.state.RePassword}
                            style={passwordStyle.textInput}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 16, paddingLeft: 5 } }} />

                        <View style={{ alignContent: 'center', alignSelf: 'center', marginLeft: '2%' }}>
                            <TouchableOpacity onPress={() => this.visible2()}>
                                <Image source={this.state.passwordIcon2 == true ? (require('../../Assets/Images/ShowPass.png')) : (require('../../Assets/Images/hidePass.png'))} style={passwordStyle.image} /></TouchableOpacity>
                        </View>

                    </View>
                </View>


                <View style={{ flexDirection: 'row', marginTop: hp('5%'), }}>

                    <View style={passwordStyle.button}>
                        <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Account') }}>
                            <Text style={passwordStyle.buttonText}>
                                Cancel
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[passwordStyle.button, { backgroundColor: '#fff' }]}>
                        <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }} borderRadius={4}>
                            <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.changePassword() }}><Text style={[passwordStyle.buttonText, { color: '#fff' }]}>
                                Update
                        </Text>
                            </TouchableOpacity>

                        </ImageBackground>


                    </View>
                </View> */}

            </View>
        )
    }
}