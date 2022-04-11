import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity,ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
import TwoFactorStyle from './styles/TwoFactorStyle';
import ToggleSwitch from 'toggle-switch-react-native'
import Common_Style from '../../Assets/Styles/Common_Style'
import serviceUrl from '../../Assets/Script/Service';
import { Toolbar } from '../commoncomponent'
import {postServiceP01} from '../_services';

export default class PrivateAccount extends Component {

    static navigationOptions = {
        header: null,
    };
    constructor(prop) {
        super(prop);
        this.state = { PrivateAccount: false, readMore: '',
        masterData : [] }
    }

    // componentWillMount() {
    //     this.getApi();
    // }

    componentDidMount = async () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getApi();
            }
        );
    };

    async  getApi() {
      // debugger;
        var data = {    Userid: await AsyncStorage.getItem('userId')};
        const url = serviceUrl.been_url1 + '/GetNotificationSettings';
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((responseJson) => {
           console.log('album responses', responseJson);
           if (responseJson.status == 'True') {
            const result = responseJson.Result ? responseJson.Result : []
            this.toggleSwitch(result)
            }
        }).catch((error) => {
           console.log(error);
           toastMsg1('danger', "sorry.something error occured or check network connection,then try again once")
        //    ToastAndroid.show('sorry.something error occured or check network connection,then try again once',
        //    ToastAndroid.LONG)
        });
    };

    toggleSwitch(masterData) {
        if(masterData.length > 0){
          const [md] = masterData
          console.log('the md',md);
          if (md.userProfile == 'Private') {
            this.setState({ PrivateAccount: true })
          }
          
        }
    }


    PrivateAccount = async(type,toggle_state,state_name) => {
        debugger
        this.setState({ [state_name] : toggle_state  });

        const AppUserId = await AsyncStorage.getItem('userId');
        const data = {}; 
        data.Userid = AppUserId ; 
        data.TypeofChange = "Private" ; 
        data.updatedValue = toggle_state ? 'On' : 'Off';
        
        // data.SwitchTo = toggle_state ? 'On' : 'Off';
        const apiname = 'NotificationOnOffSettings';
        let subscribe = true;
        // postServiceP01(apiname,data).then(cb=>{
        //     console.log('after resp in nfcalls',cb)
        //   if(cb.status == 'False' && subscribe){
        //   this.setState({ [state_name] : !toggle_state  });
        //     toastMsg("danger",'sorry.something error occured,try again once')
        //   }
        // }).catch(err=>{
        //    console.log(err);
        //    this.setState({ PrivateAccount : !toggle_state });
        //    toastMsg('danger','sorry.something error occured or check network connection,then try again once')
        // });
  
        // /**
        //  * @Cancel_Subscription
        //  * @To_Stop_memory_leak_for_app
        //  */
        //  return () => (subscribe = false); 

        postServiceP01(apiname,data).then(cb=>{
            console.log('after resp in nfcalls',cb)
          if(cb.status == 'False' && subscribe){
          //   if(subscribe)
            this.setState({ [state_name] : !toggle_state  });
            toastMsg1('danger', "sorry.something error occured,try again once")
            // ToastAndroid.show('sorry.something error occured,try again once',
            // ToastAndroid.SHORT)
          }
        }).catch(err=>{
           console.log(err);
           this.setState({ [state_name] : !toggle_state  });
           toastMsg1('danger', "sorry.something error occured or check network connection,then try again once")
        //    ToastAndroid.show('sorry.something error occured or check network connection,then try again once',
        //    ToastAndroid.LONG)
        });
  
        /**
         * @Cancel_Async_Subscription
         * @To_Stop_memory_leak_for_app
         */
         return () => (subscribe = false); 
      
    };

    createFolderIconView = () => <View />

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff',marginTop:0 }}>

            <Toolbar {...this.props} leftTitle="Private Account" rightImgView={this.createFolderIconView()} />

                <View style={TwoFactorStyle.container}>
                    <Text style={TwoFactorStyle.text}>Private Account</Text>

                    <ToggleSwitch
                        isOn={this.state.PrivateAccount}
                        onColor="#39a0eb"
                        offColor="grey"
                        labelStyle={{ color: "black", fontWeight: "900" }}
                        size="small"
                        onToggle={(state) => { this.PrivateAccount('PrivateAccount',state,'PrivateAccount') }}
                    />
                </View>
                <View >
                    <Text style={Common_Style.settingsMediumText}>When Your acount is private ,Only people you approve can see your photo and videos{this.state.readMore === 1 ? (<Text> Your existing followers won't be affected.<Text   style={[Common_Style.settingsMediumText,{marginLeft:4, color: "#39a0eb",}]} onPress={() => { this.setState({ readMore: '' }) }}>  Learn Less</Text></Text>) :
                        (<Text style={[Common_Style.settingsMediumText,{marginLeft:4, color: "#39a0eb",}]} onPress={() => { this.setState({ readMore: 1 }) }}>  Learn More</Text>)} </Text>
                </View>


            </View>
        )
    }
}