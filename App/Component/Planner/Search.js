import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Footer } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Common_Style from '../../Assets/Styles/Common_Style'
import { TextInput } from 'react-native-gesture-handler';
import { Toolbar } from '../commoncomponent'
import {Common_Color} from '../../Assets/Colors'

const imagepath='./images/';
export default class Search extends Component {

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
            <View style={{ width: wp('100%'), height: hp('100%') }}>
             
             <Toolbar {...this.props} centerTitle=" Search"  />
             
                <Content>
                    <View style={{ margin: '5%' }}>
                        <View style={{ marginVertical: '2%' }}>
                            <View style={{ height: 40, borderRadius: 5, borderColor: 'lightgray', borderWidth: 1 }}>
                                <TextInput style={{ marginLeft: '2%' }} autoCorrect={false}

                                    placeholder='Title Name' />
                            </View>
                        </View>
                        <View style={{ marginVertical: '2%' }}>
                            <View style={{ height: 40, borderRadius: 5, borderColor: 'lightgray', borderWidth: 1 }}>
                                <TextInput style={{ marginLeft: '2%' }} autoCorrect={false}

                                    placeholder='Location' />
                            </View>
                        </View>
                        <View style={{ marginVertical: '2%' }}>
                            <View style={{ height: 40, borderRadius: 5, borderColor: 'lightgray', borderWidth: 1 }}>
                                <TextInput style={{ marginLeft: '2%',fontFamily:Common_Color.fontMedium}} autoCorrect={false}

                                    placeholder='Travel Date' />
                            </View>
                        </View>
                        <View style={{ marginVertical: '2%' }}>
                            <View style={{ height: 40, borderRadius: 5, borderColor: 'lightgray', borderWidth: 1, justifyContent: 'center' }}>
                                <Text style={{ marginLeft: '2%',fontFamily:Common_Color.fontMedium}} >Currency </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ borderColor: 'lightgray', borderWidth: 1, height: 40, width: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{fontFamily:Common_Color.fontMedium}}>Min</Text>
                            </View>
                            <View style={{ borderColor: 'lightgray', borderWidth: 1, height: 40, width: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{fontFamily:Common_Color.fontMedium}}>Max</Text>
                            </View>
                        </View>
                    </View>


                </Content>
                <TouchableOpacity>
                    <Footer style={{ backgroundColor: 'lightblue', alignItems: 'center', justifyContent: 'center' }}>
                        <View>
                            <Text style={{ color: '#ffffff', fontSize: 18,fontFamily:Common_Color.fontBold }} >
                                Search
                            </Text>
                        </View>
                    </Footer>
                </TouchableOpacity>
            </View>
        )
    }
}


