import React, { Component } from 'react'
import {
    Text, StatusBar, StyleSheet, Image, FitImage, Animated, ImageBackground,
    View, ToastAndroid, TouchableOpacity, ScrollView
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class SettingsScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.scrollY = new Animated.Value(0);
        this.diffClamp = Animated.diffClamp(this.scrollY, 0, 60)
    }

    logout() {
        this.props.navigation.navigate('Logout');
    }
    AddAcc() {
        this.props.navigation.navigate('AddAccLogin')
    }
    SwitchProf() {
       // debugger;
        this.props.navigation.navigate('SwitchProfile')
    }
    account() {
        this.props.navigation.navigate('Account')
    }

    navigateBack = () => {
        this.props.navigation.goBack()
    }

    render() {
        const translateY = this.diffClamp.interpolate({ inputRange: [0, 55], outputRange: [0, 60] });
        return (
            <View style={{ flex: 1,marginTop:0,backgroundColor:'#fff' }}>

                <Toolbar {...this.props} leftTitle="Settings" />                
                <View style={{ marginLeft: '3%' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('SavedPlaces') }}>
                        <Text style={[Common_Style.settingBoldText,{marginTop: hp('1.5%') }]} > Saved places </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('savedpost') }}>
                        <Text style={[Common_Style.settingBoldText,{marginTop: hp('1.5%') }]}> Saved posts </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('NotificationSetting') }}>
                        <Text style={[Common_Style.settingBoldText,{marginTop: hp('1.5%') }]}> Notifications </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.account()}>
                        <Text onPress={() => this.account()} style={[Common_Style.settingBoldText,{marginTop: hp('1.5%') }]}> Account </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Privachy') }}>
                        <Text style={[Common_Style.settingBoldText,{marginTop: hp('1.5%') }]}
                        > Privacy & Security </Text>
                    </TouchableOpacity>
                    <Text style={[Common_Style.settingBoldText,{marginTop: hp('1.5%') }]} onPress={() => this.props.navigation.navigate('About')}> About </Text>
                    <Text style={[Common_Style.settingBoldText,{marginTop: hp('1.5%') }]} onPress={() => { this.props.navigation.navigate('Help') }}> Help </Text>
                </View>





                <Animated.View style={{ width: '100%', height: 100, bottom: 60, position: 'absolute', overflow: 'hidden', zIndex: 100,  justifyContent: 'center', transform: [{ translateY: translateY, }], bordereTopWidth: 1, borderColor: '#000' }}>
                    {/* <View style={{borderWidth:.5,borderColor:'#000',width:'100%',margin:5}}/> */}
                    <TouchableOpacity onPress={() => this.SwitchProf()} ><Text style={[Common_Style.settingBoldText,{marginLeft: '3%',marginTop: hp('1.5%')}]}>Switch Profile  </Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.AddAcc()} ><Text style={[Common_Style.settingBoldText, { color: '#72bcef',marginLeft: '3%',marginTop: hp('1.5%') }]}>Add Account  </Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logout()} ><Text style={[Common_Style.settingBoldText, { color: '#f9466f', marginLeft: '3%',marginTop: hp('1.5%') }]}>Log out </Text></TouchableOpacity>

                </Animated.View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    text: { marginTop: 10, fontFamily: 'ProximaNova-Regular', color: '#949494', fontSize: 16 }
})