import React, { Component } from 'react'
import {
    Text, TouchableOpacity, StyleSheet, View, Image
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from  '../../Assets/Colors'


export default class Privachy extends Component {
    static navigationOptions = {
        header: null,
    };

    privateAcc() {
        this.props.navigation.navigate('PrivateAccount')
    }
    blockedAccount() {
        this.props.navigation.navigate('BlockedAccount')
    }
    postLiked(){
        this.props.navigation.navigate('PostsYouHaveLiked') 
    }
    history(){
        this.props.navigation.navigate('History')
    }
    commnetControl(){
        this.props.navigation.navigate('commentControl')
    }
    createFolderIconView = () => <View />

    render() {
        return (
            <View style={{flex:1,marginTop:0,backgroundColor:'#fff'}}>

                 <Toolbar {...this.props} leftTitle="Privacy & Security" rightImgView={this.createFolderIconView()} />
             <View style={{paddingLeft: 8,paddingTop:8}}>
                <TouchableOpacity onPress={() => this.privateAcc()} style={style.textView} hitSlop={Common_Style.touchView}>
                    <Text style={{fontSize: Username.FontSize,fontFamily: Username.Font}} onPress={() => this.privateAcc()}>Private Account</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.blockedAccount()} style={style.textView} hitSlop={Common_Style.touchView}>
                    <Text style={{fontSize: Username.FontSize,fontFamily: Username.Font}} onPress={() => this.blockedAccount()}>Blocked Accounts</Text>
                </TouchableOpacity>

                 <TouchableOpacity onPress={() => this.postLiked()} style={style.textView} hitSlop={Common_Style.touchView}>
                    <Text style={{fontSize: Username.FontSize,fontFamily: Username.Font}} onPress={() => this.postLiked()}>Posts you have Liked</Text>
                </TouchableOpacity>

               <TouchableOpacity onPress={() => this.postLiked()} style={style.textView} hitSlop={Common_Style.touchView}>
                    <Text style={{fontSize: Username.FontSize,fontFamily: Username.Font}} onPress={() =>this.history()}>Clear Search history</Text>
               </TouchableOpacity>

                 <TouchableOpacity onPress={() => this.commnetControl()} style={style.textView} hitSlop={Common_Style.touchView}>
                    <Text style={{fontSize: Username.FontSize,fontFamily: Username.Font}} onPress={() => this.commnetControl()}>Comment Controls</Text>
               </TouchableOpacity>
               </View>
            </View>
        )
    }
}

const style = {
    textView: { marginTop: hp('2%'), marginLeft: wp('2%') },
}
