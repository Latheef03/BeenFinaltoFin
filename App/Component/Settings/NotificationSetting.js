import React, { Component } from 'react'
import {
    Text, StatusBar, StyleSheet, Image, FitImage, Button, ImageBackground,
    View, ToastAndroid, ActivityIndicator, TouchableOpacity, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ToggleSwitch from 'toggle-switch-react-native'
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
import Common_Style from '../../Assets/Styles/Common_Style'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from  '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'

import {postServiceP01} from '../_services';

export default class NotificationSetting extends Component {

    static navigationOptions = {
        header: null,
    };
    
    state = {
        masterData: [],
        Likes: true,
        Comments: true,
        commentsLikes: true,
        commentsreplies: true,
        followersRequest: true,
        following: true,
        mention: true,
        messagerequest: true,
        message: true
    }
    
    // componentWillMount() {
    //     this.getApi();
    // }

    componentDidMount() {
        //// debugger;
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => { this.getApi(); })
    }


    async  getApi() {
        //   // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url1 + "/GetNotificationSettings"
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
                    // this.setState({ masterData: responseJson.Result })
                    const result = responseJson.Result ? responseJson.Result : []
                    this.toggleSwitch(result)
                }else{
                    toastMsg("danger",'sorry.something error occured,try again once')
                }
            })
            .catch((error) => {
                console.log(error);
               
            });
    };

    toggleSwitch(masterData) {
        if(masterData.length > 0){
          const [md] = masterData
          console.log('the md',md);
          if (md.LikeNotificationSettings === 'Off') { this.setState({ Likes: false }) }
          if (md.CommentNotificationSettings === 'Off') { this.setState({ Comments: false }) }
          if (md.CommentLikesNotificationSettings === 'Off') { this.setState({ commentsLikes: false }) }
          if (md.CommentrepliesNotificationSettings === 'Off') { this.setState({ commentsreplies: false }) }
          if (md.FollowersNotificationSettings === 'Off') { this.setState({ followersRequest: false }) }
          if (md.FollowingsNotificationSettings === 'Off') { this.setState({ following: false }) }
          if (md.TagNotificationSettings === 'Off') { this.setState({ mention: false }) }
          if (md.MessageReqNotificationSettings === 'Off') { this.setState({ messagerequest: false }) }
          if (md.MessageNotificationSettings === 'Off') { this.setState({ message: false }) }
          
        }
    }

    /**
     * API calls of Notification Settings
     * @param {3} types 
     * @MUFTHI
     */

    NSCalls = async(type,toggle_state,state_name) =>{
      this.setState({ [state_name] : toggle_state  });
      const AppUserId = await AsyncStorage.getItem('userId');
      const data = {}; 
      data.Userid = AppUserId ; 
      data.TypeofChange = type; 
      data.updatedValue = toggle_state ? 'On' : 'Off';
      const apiname = 'NotificationOnOffSettings';
        // console.log('the data',data);
      let subscribe = true;

      postServiceP01(apiname,data).then(cb=>{
          console.log('after resp in nfcalls',cb)
        if(cb.status == 'False' && subscribe){
        //   if(subscribe)
          this.setState({ [state_name] : !toggle_state  });
          toastMsg1('danger','sorry.something error occured,try again once')
        //   ToastAndroid.show('sorry.something error occured,try again once',
        //   ToastAndroid.SHORT)
        }
      }).catch(err=>{
         console.log(err);
         this.setState({ [state_name] : !toggle_state  });
         toastMsg1('danger', 'sorry.something error occured or check network connection,then try again once')
       //  ToastAndroid.show('sorry.something error occured or check network connection,then try again once',
        // ToastAndroid.LONG)
      });

      /**
       * @Cancel_Async_Subscription
       * @To_Stop_memory_leak_for_app
       */
       return () => (subscribe = false); 
    }

    /**
     * @important 
     * @Error_Handling
     * @MUFTHI
     * anyone can use this method and modify as your need. 
     */

    // errorFinder = (t,ts,sn) =>{
    //     console.log('the sn',sn)
    //     let hasError = false;
    //     if(sn == undefined || sn == ''){
    //         console.log('the sn in cond',sn)
    //      hasError = true
    //      throw new Error('You must specify the state name as a third argument parameter '+ 
    //      'that you\'ve specified in this.state = {} when you invoke the NSCalls() method .')
    //     }

    //     return hasError;
    // }

    render() {
        return (
            <View style={{ flex:1,marginTop:0,backgroundColor:'#fff'}}>
                <Toolbar {...this.props} leftTitle="Notifications" />
               
                
             <View style={{paddingLeft: 8,paddingTop:8}}>
                <View style={{ marginBottom: hp('3%'), marginLeft: '2%',}}>
                    <Text style={{fontSize: Username.FontSize,fontFamily: Username.Font}}>Posts  &amp; Captures </Text>
                    <View style={[styles.onoff, { margintop: hp('2%') }]}>
                        <Text style={styles.text}>Likes</Text>
                        <View>
                        <ToggleSwitch
                            isOn={this.state.Likes}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('Like',state,'Likes') }}
                        />
                        </View>
                    </View>

                    <View style={styles.onoff}>
                        <Text style={styles.text}>Comments</Text>
                        <View><ToggleSwitch
                            isOn={this.state.Comments}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('Comment',state,'Comments') }}
                        />
                        </View>
                    </View>

                    <View style={styles.onoff}>
                        <Text style={styles.text}>Comments Likes</Text>
                        <View><ToggleSwitch
                            isOn={this.state.commentsLikes}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('CommentLike',state,'commentsLikes') }}
                        />
                        </View>


                    </View>
                    <View style={styles.onoff}>
                        <Text style={styles.text}>Comments replies</Text>
                        <View><ToggleSwitch
                            isOn={this.state.commentsreplies}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('CommentReplies',state,'commentsreplies') }}
                        />
                        </View>
                    </View>
                </View>
                {/*                      Followers And Following                        */}

                <View style={{ marginBottom: hp('3%'), marginLeft: '2%' }}>
                    <Text style={{fontSize: Username.FontSize,fontFamily: Username.Font}}>Followers  &amp; Following </Text>
                    <View style={[styles.onoff, { margintop: hp('2%') }]}>
                        <Text style={styles.text}>Followers or Following request</Text>
                        <View><ToggleSwitch
                            isOn={this.state.followersRequest}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('Followers',state,'followersRequest') }}
                        />
                        </View>
                    </View>

                    <View style={styles.onoff}>
                        <Text style={styles.text}>Following</Text>
                        <View><ToggleSwitch
                            isOn={this.state.following}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('Followings',state,'following') }}
                        />
                        </View>
                    </View>

                    <View style={styles.onoff}>
                        <Text style={styles.text}>Mention &amp; Tags</Text>
                        <View><ToggleSwitch
                            isOn={this.state.mention}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('Tags',state,'mention') }}
                        />
                        </View>
                    </View>

                </View>
                {/* 
            Messages                     */}

                <View style={{ marginBottom: hp('3%'), marginLeft: '2%' }}>
                    <Text style={{fontSize: Username.FontSize,fontFamily: Username.Font}}>Followers  &amp; Following </Text>
                    <View style={[styles.onoff, { margintop: hp('2%') }]}>
                        <Text style={styles.text}>Message request</Text>
                        <View><ToggleSwitch
                            isOn={this.state.messagerequest}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('MessageReq',state,'messagerequest') }}
                        />
                        </View>
                    </View>

                    <View style={styles.onoff}>
                        <Text style={styles.text}>Message</Text>
                        <View><ToggleSwitch
                            isOn={this.state.message}
                            onColor="#39a0eb"
                            offColor="grey"
                            labelStyle={{ color: "black", fontWeight: "900" }}
                            size="small"
                            onToggle={(state) => { this.NSCalls('Message',state,'message') }}
                        />
                        </View>
                    </View>
                </View>
              </View>
            </View>
        )
    }
}

const styles = {
    text: {   width: wp('80%'),fontFamily:profilename.Font,fontSize:profilename.FontSize  },
    onoff: { width: wp('100%'), flexDirection: 'row', marginTop: hp('1.5%') }
}
