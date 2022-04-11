import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, Tab } from 'native-base';
import Ongoing from './Ongoing';
import Requests_List from './Requests_List';
import plannerStyles from '../Planner/styles/plannerStyles'
const imagepath = './images/';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'

export default class extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
        }
    }
    search() {
        this.props.navigation.navigate('Search1');
    }
    create() {
        this.props.navigation.navigate('Create_group');
    }

    renderToolbarIconsView = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'center', marginRight: 8, }}>
                <TouchableOpacity onPress={() => this.search()}>
                    <Image source={require(imagepath + 'SearchIcon.png')} tintColor={'#000'}
                        style={{ tintColor: '#000000', height: 19, width: 19, marginRight: 15, }} />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => this.create()}>
                    <Image source={require(imagepath + 'AddIcon.png')}
                        style={{ height: 20, width: 20, }} />
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, marginTop: 0, marginBottom: 0,backgroundColor:'#FFF' }}>
                <StatusBar backgroundColor="#FFF" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle="Planner" rightTwoImgView={this.renderToolbarIconsView()} />

                {/* <Content style={{}}>  */}
                <Tabs tabBarUnderlineStyle={{ backgroundColor: "#dd374d", }}
                    tabContainerStyle={{ elevation: 0, }}

                >
                    <Tab
                        heading="Ongoing"
                        tabStyle={{ backgroundColor: "#FFF", }}
                        textStyle={{ color: "#000000", textAlign: "center", fontSize: Username.FontSize, fontFamily: Username.Font, }}
                        activeTabStyle={{ backgroundColor: "#FFF" }}
                        inactiveTextStyle={{ color: "#000000", fontSize: Username.FontSize, fontFamily: Username.Font, }}
                        activeTextStyle={{ color: "#000000", textAlign: "center", fontSize: Username.FontSize, fontFamily: Username.Font, }}>
                        <Ongoing navigation={this.props.navigation} />
                    </Tab>
                    <Tab
                        heading="Requests List"
                        tabStyle={{ backgroundColor: "#ffffff", }}
                        textStyle={{ color: "#000000", textAlign: "center", fontSize: Username.FontSize, fontFamily: Username.Font, }}
                        activeTabStyle={{ backgroundColor: "#ffffff" }}
                        inactiveTextStyle={{ color: "#000000", fontSize: Username.FontSize, fontFamily: Username.Font, }}
                        activeTextStyle={{ color: "#000000", textAlign: "center", fontSize: Username.FontSize, fontFamily: Username.Font, }}>
                        <Requests_List navigation={this.props.navigation} />
                    </Tab>
                </Tabs>
                {/* </Content> */}
            </View>
        )
    }
}


