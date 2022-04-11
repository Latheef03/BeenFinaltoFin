import React, { Component } from 'react';
import { ImageBackground,TouchableOpacity } from 'react-native';
import { View, Text, Image } from 'react-native';
import { deviceWidth as dw } from '../../_utils/CommonUtils'
import serviceUrl from '../../../Assets/Script/Service';
import Common_Style from '../../../Assets/Styles/Common_Style'

const imagePath = '../../../Assets/Images/'
const imagePath1 = '../../../Assets/Images/BussinesIcons/'
const UserView = (props) => {

    return (
        <View style={{ width: dw, justifyContent: 'center', alignSelf: 'center', flex: 1, height: 60, flexDirection: 'row', marginTop: 8, marginBottom: 0,}}>
            <TouchableOpacity onPress={()=>props.onPress()}>
             <ImageBackground
                source=
                {props.profilePic === null ? require(imagePath + 'profile.png') :
                    { uri: serviceUrl.profilePic + props.profilePic }}
                borderRadius={50} style={{ width: 55, height: 55, borderRadius: 55 / 2, backgroundColor: 'grey', marginTop: 4, marginLeft: 4 }} >

                {props.isVerifyTick === "Approved" ?
                    <Image style={{ width: 18, height: 18, alignSelf: 'flex-end', position: 'absolute', right:1, borderRadius: 18 / 2, borderColor: '#fff', borderWidth: 1 }}
                        source={require('../../../Assets/Images/BussinesIcons/TickSmall.png')} />
                    : null}
            </ImageBackground>
            </TouchableOpacity>

            <View style={{ width: dw * .54, justifyContent: 'center', marginLeft: 5, }}>
            <TouchableOpacity onPress={()=>props.onPress()}>
                {props.followList !== null ?
                    <View style={{ flexDirection: 'row' }}>
                        <Text numberOfLines={1} style={Common_Style.UserNameCommon}>{props.userName}</Text>
                        <Text numberOfLines={1} style={[Common_Style.SurNameCommon, { color: '#010101',marginLeft:4,marginTop:2 }]}> {props.followList}</Text>
                    </View> :
                    <Text numberOfLines={1} style={Common_Style.UserNameCommon}>{props.userName}</Text>}
                <Text numberOfLines={1} style={[Common_Style.SurNameCommon, { color: '#777' }]}>{props.surName}</Text>
            </TouchableOpacity>
            </View>

            {props.rightView &&
                <View style={{ width: dw * .27, justifyContent: 'center', alignItems: "center", marginLeft: 5, flexDirection: 'row' }}>
                    {props.rightView}
                </View>}
        </View>
    );
}


export default UserView;