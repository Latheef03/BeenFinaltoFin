import { NetInfo,Platform,StatusBar,StatusBarIOS } from "react-native"
import { Toast } from 'native-base';
import QB from 'quickblox-react-native-sdk';
import {invalidText} from '../../Component/_utils/CommonUtils'
import AsyncStorage from '@react-native-async-storage/async-storage';
export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
       
        // Error saving data
    }
}

export const retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return await value;
    } catch (error) {
      
        // Error retrieving data
    }
}

export const clearData = async () => {
    try {

        const loginInfo = await AsyncStorage.getItem('savedLogin');
        if(!invalidText(loginInfo)){
            const savedlogInfo = JSON.parse(loginInfo);
            if(savedlogInfo){
                console.log('the saved log info called');
                AsyncStorage.setItem('appLogout','true');
                return false;
            }
            // okLetsClearIt()
            // return true;
        }

        // console.log('the saved log info is false')
        // this.props.navigation.navigate('Login');
        AsyncStorage.setItem('appLogout','null');
        const value = await AsyncStorage.clear();
        QB.auth
            .logout()
            .then(()=> {
                // signed out successfully
                console.log('signed out from QB')
            })
            .catch((e)=> {
                // handle error
                console.log('signed out error');
                console.log('-------------------');
                console.log(e);
            });
        return value;
    } catch (error) {
       console.log('the logged out eror',error);
        // Error retrieving data
    }
}

// okLetsClearIt = () => {
//     console.log('the okLetsClearIt method called ');
// }


export const toastMsg = async (type, msg) => {
    Toast.show({
        position: 'center',
        text: msg,
        type: "success",
        textStyle: { color: "#fff", fontSize: 14,textAlign:'center',justifyContent:'center',alignItems:'center',},
        duration:2000,
       style:{marginTop:Platform.OS === 'ios'?StatusBar.currentHeight : StatusBar.currentHeight, borderRadius:0,justifyContent:'center',alignItems:'center',marginLeft:0,marginRight:0}
       // style:{marginTop:"85%", borderRadius:25,justifyContent:'center',alignItems:'center',marginLeft:15,marginRight:15}
    });
}

export const toastMsg1 = async (type, msg,duration=2000) => {
    Toast.show({
        position: 'center',
        text: msg,
        type: "danger",
        textStyle: { color: "#fff", fontSize: 14,textAlign:'center',justifyContent:'center',alignItems:'center',},
        duration:duration,
       style:{backgroundColor:'red',marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : StatusBar.currentHeight, borderRadius:0,justifyContent:'center',alignItems:'center',marginLeft:0,marginRight:0}
       // style:{marginTop:"85%", borderRadius:25,justifyContent:'center',alignItems:'center',marginLeft:15,marginRight:15}
    });
}

export const internetconnection = async () => {

    NetInfo.isConnected.fetch().then((isConnected) => {
    
        if (isConnected == true) {
            // //toastMsg("success", "online");
        } else {
            //toastMsg("danger", "Check Your Internet Connection");
        }
    });
}

    





