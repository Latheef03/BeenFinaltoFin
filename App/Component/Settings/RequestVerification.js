import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../../styles/FooterStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import Common_Style from '../../Assets/Styles/Common_Style'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from  '../../Assets/Colors'
import { toastMsg } from '../../Assets/Script/Helper';
import serviceUrl from '../../Assets/Script/Service';
import { Toolbar } from '../commoncomponent'

export default class RequestVerification extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            isModalOpen: false,
            name: '',
            verificationStatus:'hi'

        }
    }



componentWillMount() {
        this.onLoad()
       this.getApi()
    }
componentDidMount(){
    this.getApi()
}
    onLoad = async () => {
        var userName = await AsyncStorage.getItem('UserName');
        console.log("name",userName)
        this.setState({ name: userName, })
    }

    async verfication() {
       // debugger;
         var data = { userId: await AsyncStorage.getItem('userId') };
        //const url = serviceUrl.been_url + "/LikePosts"
        const url = serviceUrl.been_url1 + "/AccountVerificationReq"
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
                    // this.setState({ isModalOpen: 1 })
                    this.getApi();
                }
                   
            })
            .catch((error) => {
                console.log(error);
                //toastMsg('danger','something  is wrong !, please try again!! ')
            });
    };

    async getApi() {
       // debugger;
      var data = { userId: await AsyncStorage.getItem('userId') };
        //  var data = { userId: '5e10236d52e532330bfe0e36' };
        //const url = serviceUrl.been_url + "/LikePosts"
        const url = serviceUrl.been_url + "/UserProfile"
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
                    console.log('hi', responseJson.res)
                    local = responseJson.result[0]
                    local = local.UserDetails[0]
                    local=local.VerificationRequest
                    this.setState({  
                        verificationStatus:local===undefined ? '':local,})
                }
                console.log('hi',this.state.verificationStatus)
            })
            .catch((error) => {
                console.log(error);

            });

            
    };
    
    createFolderIconView = () => <View />

    render() {
        return (
            <View style={{ width: wp('100%'), height: hp('100%'),marginTop:0,backgroundColor:'#fff' }}>
                
                <Toolbar {...this.props} leftTitle="Request Verification" rightImgView={this.createFolderIconView()}/>
               
                <View>
                    
                    {/* first Screen */}
                    {this.state.verificationStatus ==='' ? (<View>
                        <View style={{ margin: '4%' }}>
                        <View style={{ alignItems: 'center',justifyContent:'center' }}>
                            <Image source={require('../../Assets/Images/new/verify.png')}
                                style={{ height:100, width:100, marginTop: '5%',marginTop:'25%' }} 
                                resizeMode={'cover'}
                                />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>
                            <Text style={{ fontSize: 22, fontFamily:profilename.Font,fontSize:profilename.FontSize, color: '#030303' }}>Welcome!</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '6%' }}>
                            <Text style={Common_Style.settingsMediumText}>been allows you to verify profile to indicate the authentic presence of a public figure,celebrity,place,brand or a company</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '5%' }}>
                            <Text style={Common_Style.settingsMediumText}>Requesting for verification does not quarantee verification. Are you sure you want to request for verification?</Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', margin: '10%' }}>
                        <View style={[Common_Style.Common_button, { marginBottom: 15, marginTop: 13 }]}>
                                <ImageBackground source={require('../../Assets/Images/button.png')} borderRadius={10} style={{ width: '100%', height: '100%' }}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                        onPress={() => this.verfication()}>
                                        <Text style={Common_Style.Common_btn_txt}>Request</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>

                        </View>
                    </View>
                    </View>):null}
                       

                       {/* Pending Screen */}

                    {this.state.verificationStatus ==='Pending' ? (<View>
                      
                     <View style={{height:'100%'}} >
                     <View style={{marginTop:'15%'}}>
                          
                     <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../Assets/Images/new/ballon.png')}  style={{ height:100, width:100,marginTop:'25%' }} 
                                resizeMode={'cover'}/>
                    </View>
                    <View style={{justifyContent:'center',alignContent:'center'}}>
                    <Text style={[Common_Style.settingsMediumText,{textAlign:'center', marginTop: hp('1.5%'),}]}> Username {this.state.name},</Text>
                        <Text style={[Common_Style.settingsMediumText,{textAlign:'center', marginTop: hp('1.5%'),}]}> Your verification process is under progress, </Text>
                        <Text style={[Common_Style.settingsMediumText,{textAlign:'center', marginTop: hp('1.5%'),}]}> We will be in touch with you!</Text>

                        </View>

                    </View>
                   </View>
                    </View>):null}


                    {/* verification done */}
                    {this.state.verificationStatus ==='Approved' ? (<View>
                      <View style={{height:'100%'}} >
 
                      <View style={{marginTop:'30%'}}>
                           
                      <View style={{ alignItems: 'center' }}>
                      <Image source={require('../../Assets/Images/BussinesIcons/TickSmall.png')} 
                        resizeMode={'cover'} style={{ width: 100, height: 100,marginTop:'25%' }} />
                     </View>
                     <View>
                         <Text style={[Common_Style.settingsMediumText,{textAlign:'center'}]}> Hurray!</Text>
                         <Text style={[Common_Style.settingsMediumText,{textAlign:'center'}]}>Account Verified Succesfully </Text>
                         </View>
                     </View>
                    </View>
                     </View>):null}
                   
                </View>

                <Modal isVisible={this.state.isModalOpen === 1}
                    onBackdropPress={() => this.setState({ isModalOpen: null })}
                    onBackButtonPress={() => this.setState({ isModalOpen: null })} >
                    <View style={styles.openModalView} >
                        <Image source={require('../../Assets/Images/new/Support.png')}
                            style={{ width: wp(10), height: hp(6), alignSelf: 'center', marginTop: 25,marginVertical:15 }} />

                        <Text style={[Common_Style.settingsMediumText,{textAlign:'center'}]}>{this.state.name} your account has been pushed for verification. We will contact for further progress</Text>
                    </View>
                </Modal>
            </View>
        )
    }
}