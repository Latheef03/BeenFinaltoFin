import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { TextInput } from 'react-native-gesture-handler';

const imagepath1 = 'Been/App/Assets/Images/';

export default class ViewedBy extends Component {

    static navigationOptions = {
        header: null
    };
    constructor(prop) {
        super(prop);
        this.state = {
        }
    }

    render() {
        return (
            <Container style={{ width: wp('100%'), height: hp('100%') }}>
                <Content>
                    <View style={{ margin: '2%' }}>
                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'light-gray', justifyContent: 'space-evenly' }}>
                            <View style={{ marginTop: wp('4%') }}>
                                <TouchableOpacity>
                                    <Image source={require(imagepath1 + 'CancelView.png')}
                                        style={{ height: hp('4%'), width: wp('5%') }} resizeMode={'stretch'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: wp('4%'), marginLeft: wp('20%') }}>
                                <Image source={require(imagepath1 + '272796.jpg')}
                                    style={{ height: hp('20%'), width: wp('25%') }} resizeMode={'stretch'} />
                            </View>
                            <View style={{ marginLeft: wp('20%'), marginTop: wp('4%') }}>
                                <TouchableOpacity>
                                    <Image source={require(imagepath1 + 'downloadView.png')}
                                        style={{ height: hp('4%'), width: wp('5%') }} resizeMode={'stretch'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: wp('4%') }}>
                                <TouchableOpacity>
                                    <Image source={require(imagepath1 + 'deleteView.png')}
                                        style={{ height: hp('3%'), width: wp('4%') }} resizeMode={'stretch'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <ScrollView style={{ height: '100%' }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: wp('3%') }}>
                                    <Text style={{ fontSize: 20 }}>Viewed by 98</Text>
                                    <TouchableOpacity>
                                        <Image source={require(imagepath1 + 'DownArrowView.png')}
                                            style={{ height: hp('4%'), width: wp('5%') }} resizeMode={'stretch'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: wp('2%') }}>
                                    <View style={{ marginLeft: wp('2%') }}>
                                        <Image source={require(imagepath1 + 'profile.jpeg')}
                                            style={{ height: hp('10%'), width: wp('15%'), borderRadius: 50 }} resizeMode={'stretch'} />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', marginLeft: wp('5%'), justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18 }}>umang_jain</Text>
                                        <Text style={{ fontSize: 16, color: 'gray' }}>Umang jain</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Content>
            </Container >
        )
    }
}
