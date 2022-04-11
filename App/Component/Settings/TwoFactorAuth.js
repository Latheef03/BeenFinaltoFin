import React, { Component } from 'react';
import { View, Text, ToastAndroid,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toolbar } from '../commoncomponent'
import TwoFactorStyle from './styles/TwoFactorStyle';
import ToggleSwitch from 'toggle-switch-react-native'
import Common_Style from '../../Assets/Styles/Common_Style';
import {postServiceP01} from '../_services';
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';

export default class TwoFactorAuth extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(prop) {
        super(prop);
        this.state = { TextMessage: false, email: false }
    }

  
    componentDidMount() {
        
      this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => { this.getTwofactorList(); })
    }

    getTwofactorList = async() =>{
        const apiname = 'GetNotificationSettings';
        const data = { Userid: await AsyncStorage.getItem('userId') }
        let subscribe = true;
        postServiceP01(apiname,data).then(cb=>{
            if(cb.status == 'True'){
                const result = cb.Result ? cb.Result : []
                const [TF] = result;
                if(TF.EmailNotificationSettings == 'On' )
                 this.setState({ TextMessage: true, email : true }) ;  
            }

        }).catch(err=>{
            console.log(err)
            toastMsg1('danger', "sorry.something error occured or check network connection,then try again once")
            // ToastAndroid.show('sorry.something error occured or check network connection,then try again once',
            // ToastAndroid.LONG)
        });

      /**
       * @Cancel_Async_Subscription
       * @To_Stop_memory_leak_for_app
       */
       return () => (subscribe = false); 
    }

    authenticateTwoFactor = async(toggle_state) => {

        this.setState({
            TextMessage: toggle_state,
            email : toggle_state
        }) ;
        const apiname = 'EmailOnOffNotitfication'
        const data = {Userid : await AsyncStorage.getItem('userId')  } 
        let subscribe = true;
        postServiceP01(apiname,data).then(ms=>{
            if(ms.status == 'False'){
                this.setState({
                    TextMessage: !toggle_state,
                    email : !toggle_state
                }) ;
                toastMsg1('danger', "sorry.something error occured,try again once")
                // ToastAndroid.show('sorry.something error occured,try again once',
                // ToastAndroid.SHORT)
            }
        }).catch(err=>{
            console.log(err);
            toastMsg1('danger', "sorry.something error occured or check network connection,then try again once")
            // ToastAndroid.show('sorry.something error occured or check network connection,then try again once',
            // ToastAndroid.LONG)
            this.setState({
                TextMessage: !toggle_state,
                email : !toggle_state
            }) ;
        })

      /**
       * @Cancel_Async_Subscription
       * @To_Stop_memory_leak_for_app
       */
       return () => (subscribe = false); 

    }

    // toggleSwitch1() {

    //     if (!this.state.email) { this.setState({ email: true }) }

    //     else {
    //         this.setState({ email: false })

    //     }
    // }
    createFolderIconView = () => <View />

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff',marginTop:0 }}>

                <Toolbar {...this.props} leftTitle="Two-factor Authentication" rightImgView={this.createFolderIconView()} />

            <View style={{marginLeft:4}}>
                <View style={TwoFactorStyle.container}>
                    <Text style={TwoFactorStyle.text}>Text Message</Text>
                    <ToggleSwitch
                        isOn={this.state.TextMessage}
                        onColor="#39a0eb"
                        offColor="grey"
                        labelStyle={{ color: "#010101", fontWeight: "900" }}
                        size="small"
                        onToggle={(state) => { this.authenticateTwoFactor(state) }}
                    />
                </View>
                <View style={TwoFactorStyle.container}>
                    <Text style={TwoFactorStyle.text}>Email</Text>
                    <ToggleSwitch
                        isOn={this.state.email}
                        onColor="#39a0eb"
                        offColor="grey"

                        labelStyle={{ color: "#010101", fontWeight: "900" }}
                        size="small"
                        onToggle={(state) => { this.authenticateTwoFactor(state) }}
                    />
                </View>
            </View>


            </View>
        )
    }
}