import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'

export default class History extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            LearnMore: false
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff',marginTop:0 }}>
                <Toolbar {...this.props} leftTitle="History" />

                <View style={{ marginLeft: wp('4%') }}>
                    <Text style={Common_Style.settingsMediumText}>Clear Search History</Text>
                    <Text style={Common_Style.settingsMediumText}>Remove searches that you have performed from device<Text style={[Common_Style.settingsMediumText,{marginLeft:4, color: "#39a0eb",}]} > </Text></Text>
                </View>

            </View>
        )
    }

}