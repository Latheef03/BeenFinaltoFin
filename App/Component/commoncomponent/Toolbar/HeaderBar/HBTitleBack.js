import React, { Component } from "react";
import { View, Text, Platform, Pressable,Image,StatusBar,StatusBarIOS} from "react-native";
import { Icon } from 'react-native-elements'
import { deviceHeight as dh, deviceWidth as dw } from '../../../_utils/CommonUtils';
import { TitleHeader } from '../../../../Assets/Colors';
const imagePath = '../../../../Assets/Images/'


class HBTitleBack extends Component {

  constructor(props) {
     super(props);
   }

  render(){
   return(
    <View style={styles.mainContainer}>
        <View style={styles.backIcon} >
        {Platform.OS === 'ios' ?
                   <Pressable style={{justifyContent:'flex-start'}} onPress={()=>this.props.navigation.goBack()}>
                   <Image  style={{width:20,height:20}}
                    source={ require( imagePath + 'backArrow.png') }/>
                   </Pressable>
                    :
            <Icon
                name={"chevron-left"}
                size={26}
                color="rgb(51, 51, 51)"
                type="entypo"
                onPress={() => this.props.navigation.goBack()}
                iconStyle={{ justifyContent: 'flex-start', }} /> 
            }
        </View>
        {this.props.title && (
            <View style={styles.centerTitleView} >
                <Text style={styles.centerTitle}>{this.props.TitleName}</Text>
            </View>
        )}
        
    </View>
    
  )}
}

export default HBTitleBack

const styles={
    mainContainer :{
        width: dw, height: dh * 0.06,flexDirection: "row",
        alignItems: "center",
        marginTop: StatusBar.currentHeight,
        //backgroundColor: '#FFF'
    },
    backIcon:{
        width: dw * 0.1, alignSelf: 'center'
    },
    centerTitleView :{
        width: dw * 0.8, justifyContent: 'center'
    },
    centerTitle :{ 
        textAlign: 'center', fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, 
    }
}