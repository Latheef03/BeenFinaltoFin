import React, { Component } from 'react';
import { View, Text, Image, AsyncStorage, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { TextInput } from 'react-native-gesture-handler';


const imagepath='./images/';
export default class sector88 extends Component {

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
            <Container style={{ width: wp('100%'), height: hp('100%'), marginBottom: '5%' }}>
                <Header style={{ backgroundColor: '#ffffff' }}>
                    <Left>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={require(imagepath+'left-arrow.png')}
                                    style={{ height: 20, width: 18 }} resizeMode={'stretch'} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 20 }}>sector 88</Text>
                    </Body>
                </Header>
                <Content>

                    <View >
                        <View style={{ margin: '5%' }}>
                            <Text>
                                Nearby Place
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: '5%' }}>
                                <View style={{ marginRight: '3%' }}>
                                    <ImageBackground source={require(imagepath+'Img2.png')}
                                        style={{ height: 100, width: 100 }}
                                        borderRadius={5} >
                                        <Text style={{ color: '#ffffff', padding: '3%' }}>Goa</Text>
                                    </ImageBackground>
                                </View>
                                <View style={{ marginRight: '3%' }}>
                                    <ImageBackground source={require(imagepath+'Img3.png')}
                                        style={{ height: 100, width: 100 }}
                                        borderRadius={5} >
                                        <Text style={{ color: '#ffffff', padding: '3%' }}>Kodaikanal</Text>
                                    </ImageBackground>
                                </View>
                                <View style={{ marginRight: '3%' }}>
                                    <ImageBackground source={require(imagepath+'Img2.png')}
                                        style={{ height: 100, width: 100 }}
                                        borderRadius={5} >
                                        <Text style={{ color: '#ffffff', padding: '3%' }}>Goa</Text>
                                    </ImageBackground>
                                </View>
                            </View>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray' }} />
                        <View style={{ height: 120, alignItems: 'center', marginTop: '3%' }}>
                            <ImageBackground
                                source={require(imagepath+'Map.png')}
                                style={{ height: 70, width: 320 }}
                                borderRadius={5}>
                                <View style={{ alignItems: 'center', position: 'relative', marginTop: '10%' }}>
                                    <Image source={require(imagepath+'Img4.png')}
                                        style={{ height: 70, width: 70, borderRadius: 20 }} />
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={{ marginHorizontal: '5%' }}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <TouchableOpacity>
                                    <View style={{ flexDirection: 'row', borderColor: 'yellow', borderWidth: 1, borderRadius: 5, height: 30, width: 100, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                        <Text style={{ color: 'yellow' }}>Gold List</Text>
                                        <Image source={require(imagepath+'Group.png')}
                                            style={{ height: 20, width: 20 }} />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width: 100, alignItems: 'center', justifyContent: 'center', marginHorizontal: '2%' }}>
                                    <Text style={{ fontSize: 16, textAlign: 'center' }}>Sector 88</Text>
                                    <Text style={{ fontSize: 14, textAlign: 'center' }}>Bengalor,India</Text>
                                </View>
                                <TouchableOpacity>
                                    <View style={{ flexDirection: 'row', borderColor: 'red', borderWidth: 1, borderRadius: 5, height: 30, width: 100, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                        <Text style={{ color: 'red' }}>Planner</Text>
                                        <Image source={require(imagepath+'Planer.png')}
                                            style={{ height: 20, width: 15 }} 
                                          resizeMode={'center'} 
                                            />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: '5%' }}>
                                <TouchableOpacity>
                                    <View style={{ borderColor: 'blue', borderWidth: 1, borderRadius: 5, height: 30, width: 100, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: 'blue' }}>Save Place</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ marginHorizontal: '2%' }}>
                                    <TouchableOpacity>
                                        <View style={{ borderColor: 'blue', backgroundColor: 'blue', borderWidth: 1, borderRadius: 5, height: 30, width: 100, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: '#ffffff' }}>View Profile</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity>
                                    <View style={{ borderColor: 'blue', borderWidth: 1, borderRadius: 5, height: 30, width: 100, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: 'blue' }}>Stories</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: '3%' }}>
                                <View style={{ marginVertical: '3%' }}>
                                    <Text>Recent</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ marginRight: '3%' }}>
                                        <ImageBackground source={require(imagepath+'Img2.png')}
                                            style={{ height: 100, width: 100, justifyContent: 'flex-end' }} >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={require(imagepath+'Img3.png')}
                                                    style={{ height: 20, width: 20, borderRadius: 20, margin: 5 }} />
                                                <Text style={{ color: '#ffffff' }}>Karthi</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                    <View style={{ marginRight: '3%' }}>
                                        <ImageBackground source={require(imagepath+'Img2.png')}
                                            style={{ height: 100, width: 100, justifyContent: 'flex-end' }} >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={require(imagepath+'Img3.png')}
                                                    style={{ height: 20, width: 20, borderRadius: 20, margin: 5 }} />
                                                <Text style={{ color: '#ffffff' }}>Karthi</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                    <View style={{ marginRight: '3%' }}>
                                        <ImageBackground source={require(imagepath+'Img2.png')}
                                            style={{ height: 100, width: 100, justifyContent: 'flex-end' }} >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={require(imagepath+'Img3.png')}
                                                    style={{ height: 20, width: 20, borderRadius: 20, margin: 5 }} />
                                                <Text style={{ color: '#ffffff' }}>Karthi</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: '3%' }}>
                                <View style={{ marginVertical: '3%' }}>
                                    <Text>Top</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ marginRight: '3%' }}>
                                        <ImageBackground source={require(imagepath+'Img2.png')}
                                            style={{ height: 100, width: 100, justifyContent: 'flex-end' }} >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={require(imagepath+'Img3.png')}
                                                    style={{ height: 20, width: 20, borderRadius: 20, margin: 5 }} />
                                                <Text style={{ color: '#ffffff' }}>Karthi</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                    <View style={{ marginRight: '3%' }}>
                                        <ImageBackground source={require(imagepath+'Img2.png')}
                                            style={{ height: 100, width: 100, justifyContent: 'flex-end' }} >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={require(imagepath+'Img3.png')}
                                                    style={{ height: 20, width: 20, borderRadius: 20, margin: 5 }} />
                                                <Text style={{ color: '#ffffff' }}>Karthi</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                    <View style={{ marginRight: '3%' }}>
                                        <ImageBackground source={require(imagepath+'Img2.png')}
                                            style={{ height: 100, width: 100, justifyContent: 'flex-end' }} >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={require(imagepath+'Img3.png')}
                                                    style={{ height: 20, width: 20, borderRadius: 20, margin: 5 }} />
                                                <Text style={{ color: '#ffffff' }}>Karthi</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                </Content>
            </Container>
        )
    }
}


