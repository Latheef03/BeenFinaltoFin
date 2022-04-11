// import - npm modules
import React, { Component } from "react";
import { View, Image, Text, Platform, Pressable, StatusBar,NativeModules,StatusBarIOS } from "react-native";
//import { Icon } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Entypo'
import styles from "./styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
const defaultProps = {
    showBackIcon: true,
    backIconClick: null,
    showBackIcon1: true,
};
const imagePath = '../../../Assets/Images/'

const { StatusBarManager } = NativeModules;

/**
* Represents Toolbar.
* @class Toolbar
* @extends Component
*/
class Toolbar extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount = () =>{
        if (Platform.OS === 'ios') {
            StatusBarManager.getHeight(response =>{
                // console.log('the tool bar , response',response);
                this.setState({iosStatusBarHeight: response.height})
            })
        
            this.listener = StatusBarIOS.addListener('statusBarFrameWillChange',
              (statusBarData) =>{
                // console.log('the tool bar ,status bar data',response);
                this.setState({iosStatusBarHeight: statusBarData.frame.height})
              })
        }
    }

    componentWillUnmount = () =>{
        if (Platform.OS === 'ios' && this.listener) {
            this.listener.remove()
          }
    }

    onLeftIconClicked = async () => {
        const getType = await AsyncStorage.getItem('othersProfile');
        const otherType = parseInt(getType);
        const getOthers = await AsyncStorage.getItem('profileType');
        const pType = parseInt(getOthers);
        const localP = await AsyncStorage.getItem('localProfile');

        if (this.props.icon == "Down") {
            if (localP && localP == "Yes") {
                this.props.navigation.navigate('LocalUserProfile')
            }
            else if (pType === 1 || pType === 0) {
                this.props.navigation.navigate('Profile')
            }
            else if (pType === 2) {
                this.props.navigation.navigate('BusinessPlaceProfile')
            }
        }
        else if (this.props.icon === "Down1") {
           
                this.props.navigation.navigate('OtherUserProfile')
         
        }
        else {
            this.props.navigation.goBack()
        }
    }
    onPager = () => {
        // debugger;
        this.props.navigation.navigate('MyPager');
    }

    /**
    * @function render
    * React render method for rendering the native elements
    */

    render() {
        const {iosStatusBarHeight} = this.state
        return (
            <View style={[styles.toolbarContainer, { marginTop: Platform.OS == 'ios' ? 20 : StatusBar.currentHeight,}]}>
                <StatusBar backgroundColor='#FFF' barStyle='dark-content' />
                <View style={styles.toolbarIconCont}>
                   {Platform.OS === 'ios' ?
                   <Pressable style={[styles.leftIconContainerImage,]} 
                   onPress={this.props.showBackIcon ? this.props.backIconClick != null ? this.props.backIconClick : this.onLeftIconClicked : null}>
                   <Image  style={{width:22,height:23}}
                    source={this.props.showBackIcon ?
                        this.props.icon == "Down1"  || this.props.icon == "Down"?
                         require( imagePath + 'downarrow.png') :
                         require( imagePath + 'backArrow.png') : null}/>
                   </Pressable>
                    :
                   <Icon
                        name={this.props.showBackIcon ? this.props.icon == "Down1" ? "chevron-down" : this.props.icon == "Down" ? "chevron-down" : "chevron-left" : null}
                        size={Platform.OS === "ios" ? 20 : 26}
                        color="rgb(51, 51, 51)"
                        //type="material-community"
                        onPress={this.props.showBackIcon ? this.props.backIconClick != null ? this.props.backIconClick : this.onLeftIconClicked : null}
                        style={[styles.leftIconContainer,]} />}
                </View>

                {this.props.leftImgView &&
                    <View style={styles.toolbarLeftImageViewStyle}>
                        {this.props.leftImgView}
                    </View>
                }

                {this.props.leftTitle != null &&
                    <View style={styles.toolbarTitleLeft}>
                        <Text style={[styles.appTitleLeft,{paddingTop:this.props.rightImgView && DeviceInfo.hasNotch()? 24 : 22}]}>{this.props.leftTitle}</Text>
                    </View>
                }


                {this.props.centerTitle != null &&
                    <View style={styles.toolbarTitleCenter}>
                        <Text style={styles.appTitleCenter}>{this.props.centerTitle}</Text>
                    </View>
                }

                {this.props.centerTitleColumn != null &&
                    <View style={styles.toolbarTitleCenter1}>
                        {this.props.centerTitleColumn}
                    </View>
                }

                {this.props.centerTitleProfile != null &&
                    <View style={styles.toolbarTitleCenter}>
                        {this.props.centerTitleProfile}
                    </View>
                }

                {this.props.userNameTitle != null &&
                    <View style={styles.toolbarTitleuserName}>
                        <Text style={styles.appTitleUserName}>{this.props.userNameTitle}</Text>
                    </View>
                }

                {this.props.rightMultiImgView &&
                    <View style={styles.toolbarRightMultiImageViewStyle}>
                        {this.props.rightMultiImgView}
                    </View>
                }

                {this.props.rightTwoImgView &&
                    <View style={styles.toolbarRightTwoImageViewStyle}>
                        {this.props.rightTwoImgView}
                    </View>
                }

                {this.props.rightImgView &&
                    <View style={styles.toolbarRightImageViewStyle}>
                        {this.props.rightImgView}
                    </View>
                }


                {this.props.rightView &&
                    <View style={styles.toolbarRightViewStyle}>
                        {this.props.rightView}
                    </View>
                }
            </View >
        );
    }
}

Toolbar.defaultProps = defaultProps;

export default Toolbar;
