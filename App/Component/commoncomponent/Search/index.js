
import React, { Component } from 'react';
import { Body, Tabs, Tab } from 'native-base';
import {View} from 'react-native'
export default class extends Component {

    static navigationOptions = {
        header: null
    };

    render() {
        return (
          <View style={{flex:1}}>
            <Tab>
                <Search ref='searchHash' {...this.props} />
            </Tab>
            </View>

        )
    }
}