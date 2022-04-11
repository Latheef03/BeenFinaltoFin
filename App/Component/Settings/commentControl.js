import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import ToggleSwitch from 'toggle-switch-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import styles from './styles/commentControlStyle'
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'


export default class commentControl extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props)
        this.state = { 
         following: false, 
         follower: false, 
         everyOne: false, 
         user : false,
         masterData: '' 
        }
    }

    componentWillMount() {
        this.getApi();
    }
    componentDidMount() {
        //// debugger;
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getApi();

            });

    }

    async  getApi() {
        //   // debugger;
        var data = {
            //   Userid: "5df489bd1bc2097d72dd07c2"
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url1 + '/GetNotificationSettings';
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
                    this.setState({ masterData: responseJson.Result })
                    this.toggleSwitch()
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    toggleSwitch() {

        if (this.state.masterData[0].FollowMe === 'On') { this.setState({ following: true }) }

        else { this.setState({ following: false }) }

        if (this.state.masterData[0].FollowOthers === 'On') { this.setState({ follower: true }) }

        else { this.setState({ follower: false }) }

        if (this.state.masterData[0].EveryOneNotificationSettings === 'On') { this.setState({ everyOne: true }) }

        else { this.setState({ everyOne: false }) }
    }


    async  following() {

        var data = {
            // Userid: "5df489bd1bc2097d72dd07c2"
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url1 + '/FollowMeOnOffNotification';
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
                    //toastMsg('success', responseJson.message)
                    this.getApi();

                }

            })
            .catch((error) => {
                console.log(error);
            });
    };

    async  follower() {

        var data = {
            // Userid: "5df489bd1bc2097d72dd07c2"
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url1 + '/FollowOthersOnOffNotification';
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
                    //toastMsg('success', responseJson.message)
                    this.getApi();

                }

            })
            .catch((error) => {
                console.log(error);
            });
    };


    async  everyOne() {

        var data = {
            // Userid: "5df489bd1bc2097d72dd07c2"
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url1 + '/EveryOneOnOffNotification';
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
                    //toastMsg('success', responseJson.message)
                    this.getApi();

                }

            })
            .catch((error) => {
                console.log(error);
            });
    };

    createFolderIconView = () => <View />

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff',marginTop:0 }}>

                <Toolbar {...this.props} leftTitle="Comment Controls" rightImgView={this.createFolderIconView()} />

                <View style={{ marginLeft: wp('5%') }}>
                    <Text style={styles.comment}>All Comments from</Text>
                    <View style={[styles.onoff, { margintop: hp('2%') }]}>
                        <Text style={styles.text}>People You Follow</Text>
                        <View><ToggleSwitch
                            isOn={this.state.following}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", }}
                            size="small"
                            onToggle={() => { this.following() }}
                        />
                        </View>

                    </View>
                    <View style={styles.onoff}>
                        <Text style={styles.text}>People who follow you</Text>
                        <View><ToggleSwitch
                            isOn={this.state.follower}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={() => { this.follower() }}
                        />
                        </View>


                    </View>

                    <View style={styles.onoff}>
                        <Text style={styles.text}>Everyone</Text>
                        <View>
                            <ToggleSwitch
                            isOn={this.state.everyOne}
                            onColor="#39a0eb"
                            offColor="grey"
                            size="small"
                            onToggle={() => { this.everyOne() }}
                        />
                        </View>


                    </View>

                    <Text style={{ marginTop: hp('2%'),fontSize:Username.FontSize, color: '#010101',fontFamily:Username.Font }}>Block Comments from</Text>
                   
                   
                     <View style={[Common_Style.searchView,{margin:1,width: wp('96%') }]}>
                        <TextInput  
                        // value={this.state.text} 
                        // onChangeText={text => this.SearchFilterFunction(text)}
                        style={[Common_Style.searchTextInput,{width:wp(97)}]} 
                        placeholder={'Search '} 
                        autoCorrect={false}
//  keyboardType="visible-password"
                        placeholderTextColor={'#6c6c6c'}>
                        </TextInput>
                    </View>
                    

                    {/* <View style={{ flexDirection: 'row', marginTop: hp('2%'), height: hp('7%'), }}>
                        <Image source={require('../../Assets/Images/profile.png')} style={styles.profileImage} />
                        <View style={{ width: '70%' }}>
                            <Text style={styles.profileName}>abcd</Text>
                        </View>
                        <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                          <ToggleSwitch
                            isOn={this.state.user}
                            onColor="#dd374f"
                            offColor="grey"
                            size="small"
                            onToggle={() => { this.setState({ user: !this.state.user }) }}
                        />
                        </View>
                    </View> */}

                </View>

            </View>
        )
    }
}

