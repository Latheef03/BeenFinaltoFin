import React,{Component} from 'react';
import {View,Text,StyleSheet,Image,ScrollView} from 'react-native';
import { Toolbar } from '../commoncomponent'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Common_Style from '../../Assets/Styles/Common_Style'

export default class About extends Component{

    static navigationOptions = {
        header: null,
    };

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:0}}>
                  <Toolbar {...this.props} leftTitle="About" />
                <View style={{marginLeft:wp('4%'),}}>
                    <Text style={[Common_Style.settingBoldText,{marginTop:hp('2%')}]}  onPress={()=>{this.props.navigation.navigate('Terms')}}>Terms &amp; Conditions </Text>
                    <Text style={[Common_Style.settingBoldText,{marginTop:hp('2%')}]}  onPress={()=>{this.props.navigation.navigate('DataPolicy')}}>Data Policy</Text>
                </View>

            </View>
        )
    }
         
}
