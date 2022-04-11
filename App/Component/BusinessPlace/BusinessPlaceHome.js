import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground,TouchableOpacity } from 'react-native';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import styles from './styles/placeHome'


export default class BusinessPlaceHome extends Component {

    static navigationOptions = {
        title: "Sector 88",
        headerStyle: {
            backgroundColor: "#fff",
            height: 60
        },
        headerTintColor: "#e3e3e5",
        headerTitleStyle: {
            fontWeight: "bold",
            marginRight: "20%",
            fontFamily: "sans",
            color: "#959595",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            flex: 1
        }
    };

  
    render() {
        const imagePath = '../../Assets/Images/'
        const imagePath1 = '../../Assets/Images/BussinesIcons/'
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
                <ScrollView style={{ height: '100%' }}>
                    <View>

                        <View >
                            <Text style={styles.headerText}>Near by Places</Text>
                            <View style={styles.badgeView}>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                        <Text style={styles.text}>Fiveeeee</Text>
                                    </ImageBackground>

                                </View>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                        <Text style={styles.text}>Fiveeeee</Text>
                                    </ImageBackground>

                                </View>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                        <Text style={styles.text}>Fiveeeee</Text>
                                    </ImageBackground>

                                </View>


                            </View>

                        </View>

                        <View >
                            <View style={{ width: wp('100%'), height: hp('23.5%'), }} >
                                <Image source={require(imagePath1 + 'BuPlMap.png')} style={styles.BuPlMap} resizeMode={'stretch'} /><View style={styles.profileView}>
                                    <Image source={require(imagePath1 + 'BuPl12.png')} style={styles.profileImage} 
                                resizeMode={'stretch'} 
                                    />
                                </View>
                            </View>
                        </View>


                        <View style={styles.buttons}>
                        <TouchableOpacity >
                            <View style={[styles.buttonImage, { marginLeft: wp('3%') }]}>
                                <ImageBackground source={require(imagePath1 + 'bordergold.png')} style={styles.buttonImage} 
                              resizeMode={'contain'}
                                >
                                    
                                    <View style={styles.buttonImage1}>
                                        <Image source={require(imagePath1 + 'GoldList.png')} style={styles.buttonName} 
                                       resizeMode={'contain'}
                                         />
                                        <Image source={require(imagePath1 + 'goldicon.png')} style={styles.buttonIcons} 
                                     resizeMode={'contain'}
                                         />
                                    </View>
                                   
                                </ImageBackground>
                            </View>
                            </TouchableOpacity>

                            <View style={styles.sector}>
                                <Text style={{ color: '#6e6e6e', textAlign: 'center', fontSize: 15 }}>sector 88</Text>
                                <Text style={{ color: '#757575', fontSize: 10, textAlign: 'center' }}>Bangalore</Text>

                            </View>

                            <View style={[styles.buttonImage,]}>
                            <TouchableOpacity >
                                <ImageBackground source={require(imagePath1 + 'borderred.png')} style={styles.buttonImage} 
                                resizeMode={'contain'}
                                >
                                    <View style={styles.buttonImage1}>
                                        <Image source={require(imagePath1 + 'Planner.png')} style={styles.buttonName} 
                                        resizeMode={'contain'} 
                                        />
                                        <Image source={require(imagePath1 + 'Planner-1.png')} style={styles.buttonIcons} 
                                      resizeMode={'contain'} 
                                        />
                                    </View>
                                </ImageBackground>
                                </TouchableOpacity >
                            </View>


                        </View>


                        <View style={[styles.buttons, { marginTop: hp('2.5%') }]}>
                        <TouchableOpacity >
                            <View style={[styles.buttonImage, { marginLeft: wp('3%') }]}>
                                <ImageBackground source={require(imagePath1 + 'borderBlue.png')} style={styles.buttonImage} resizeMode={'contain'}>
                                    <View style={styles.buttonImage1}>
                                        <Image source={require(imagePath1 + 'savePlace.png')} style={styles.buttonName} resizeMode={'contain'} />

                                    </View>
                                </ImageBackground>

                            </View>
                            </TouchableOpacity >

                            <View style={styles.sector}>
                            <TouchableOpacity >
                                <View style={styles.viewProfile} >
                                    <Text style={[styles.buttonImage1, { color: '#fff' }]}>View Profile</Text>
                                </View>
                                </TouchableOpacity >
                            </View>

                            <View style={[styles.buttonImage,]}>
                            <TouchableOpacity >
                                <ImageBackground source={require(imagePath1 + 'borderBlue.png')} style={styles.buttonImage} resizeMode={'stretch'}>
                                    <View style={styles.buttonImage1}>
                                        <Image source={require(imagePath1 + 'Stories.png')} style={styles.buttonName} resizeMode={'stretch'} />

                                    </View>
                                </ImageBackground>
                                </TouchableOpacity >
                            </View>


                        </View>


                        <View >


                            <Text style={styles.headerText}>Recent</Text>
                            <View style={styles.badgeView}>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                    <View style={{ width: wp('40%'), flexDirection: 'row', marginTop: hp('11%'), marginLeft: wp('3%'), }}>
                                                <Image style={{ width:wp(5), height: hp(3),borderRadius:50 }}
                                                    source={require('../../Assets/Images/story3.png')} />
                                                <Text style={{ color: '#fff', marginLeft: 10 }}>riyas</Text>
                                            </View>

                                    </ImageBackground>

                                </View>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                    <View style={{ width: wp('40%'), flexDirection: 'row', marginTop: hp('11%'), marginLeft: wp('3%'), }}>
                                                <Image style={{ width:wp(5), height: hp(3),borderRadius:50 }}
                                                    source={require('../../Assets/Images/story3.png')} />
                                                <Text style={{ color: '#fff', marginLeft: 10 }}>riyas</Text>
                                            </View>
                                    </ImageBackground>

                                </View>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                    <View style={{ width: wp('40%'), flexDirection: 'row', marginTop: hp('11%'), marginLeft: wp('3%'), }}>
                                                <Image style={{ width:wp(5), height: hp(3),borderRadius:50 }}
                                                    source={require('../../Assets/Images/story3.png')} />
                                                <Text style={{ color: '#fff', marginLeft: 10 }}>riyas</Text>
                                            </View>
                                    </ImageBackground>

                                </View>


                            </View>

                        </View>

                        <View >
                            <Text style={styles.headerText}>Top</Text>
                            <View style={styles.badgeView}>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                    <View style={{ width: wp('40%'), flexDirection: 'row', marginTop: hp('11%'), marginLeft: wp('3%'), }}>
                                                <Image style={{ width:wp(5), height: hp(3),borderRadius:50 }}
                                                    source={require('../../Assets/Images/story3.png')} />
                                                <Text style={{ color: '#fff', marginLeft: 10 }}>riyas</Text>
                                            </View>
                                    </ImageBackground>

                                </View>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                    <View style={{ width: wp('40%'), flexDirection: 'row', marginTop: hp('11%'), marginLeft: wp('3%'), }}>
                                                <Image style={{ width:wp(5), height: hp(3),borderRadius:50 }}
                                                    source={require('../../Assets/Images/story3.png')} />
                                                <Text style={{ color: '#fff', marginLeft: 10 }}>riyas</Text>
                                            </View>
                                    </ImageBackground>

                                </View>
                                <View style={styles.imageView}>
                                    <ImageBackground source={require(imagePath + '272793.jpg')} style={styles.badgesimage} borderRadius={50} resizeMode={'stretch'} >
                                    <View style={{ width: wp('40%'), flexDirection: 'row', marginTop: hp('11%'), marginLeft: wp('3%'), }}>
                                                <Image style={{ width:wp(5), height: hp(3),borderRadius:50 }}
                                                    source={require('../../Assets/Images/story3.png')} />
                                                <Text style={{ color: '#fff', marginLeft: 10 }}>riyas</Text>
                                            </View>
                                    </ImageBackground>

                                </View>


                            </View>

                        </View>


                    </View>

                </ScrollView>
            </View>
        )
    }

}


// const styles=StyleSheet.create({
//     headerText:{marginTop:hp('2%'),color:'#cacaca',fontSize:14,marginLeft:wp('2%')},
//     badgeView:{width:wp('100%'),height:hp('22%'),marginTop:hp('2%'),borderRadius:20,flexDirection:'row'},
//     imageView:{width:wp('30%'),height:'100%',marginLeft:wp('2%')},
//     badgesimage:{width:wp('30%'),height:hp(15),marginLeft:wp('2%')},
//     text:{textAlign:"center",color:'#FFF'},
//     text1:{textAlign:"center",color:'#ebebeb'},
//     BuPlMap:{textAlign:"center",color:'#ebebeb',width:wp('95%'),height:hp('15%'),marginLeft:wp('2.5%')},
//     BuPlMap1:{textAlign:"center",color:'#ebebeb'},
//     profileImage:{width:wp('10%'),height:'10%'}

// });

