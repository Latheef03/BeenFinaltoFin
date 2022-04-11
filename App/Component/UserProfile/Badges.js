import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Common_Color } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import serviceUrl from '../../Assets/Script/Service';
const { BadgesFootprints, BadgesCountryStamps, BadgesMemorieImages, BadgesVlogImages, BadgesstreakImages } = serviceUrl;
const imagePath = '../../Assets/Images/Badges/';

export default class Badges extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(prop) {
        super(prop);
        this.state = {
            footPrints: 0,
            memoriesCount: 0,
            vlogCount: 0,
            streakImages: [],
            FootprintImaged: [],
            MemorieImages: [],
            VlogImages: [],
            CountryImages: [],
            result: []
        }
    }


    componentDidMount() {
       // debugger;
        this.badgesApi();
       
    }

    async badgesApi() {
       // debugger;
        var UId = await AsyncStorage.getItem('userId');
        console.log('test id', UId);
        var data = {
            //   Userid: "5df489bd1bc2097d72dd07c2"
            // UserId: "5e6f2ebde44ab376935b4022"
            UserId: UId
        };
        const url = serviceUrl.been_url1 + '/GetBadgesCount';
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('badges responses', responseJson);
                if (responseJson.status == 'True') {
                    this.setState({
                        result: responseJson,
                        streakImages: responseJson.streakImages,
                        FootprintImaged: responseJson.FootprintImaged,
                        MemorieImages: responseJson.MemorieImages,
                        VlogImages: responseJson.VlogImages,
                        CountryImages: responseJson.CountryImages,
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    renderRightImgdone() {
        return <View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
            </TouchableOpacity>
        </View>
    }

    space() {
        return (<View style={{ height: 50, width: 2, backgroundColor: 'black' }} />)
    }
    renderImageFootPrint(image) {
        return (
            <View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('22%'), }}>
                <View style={{
                    width: wp(23), height: hp(21), borderRadius: 8,
                }}>
                    <View style={styles.imageView}>
                        <Image source={{ uri: serviceUrl.BadgesFootprints + image.img }} resizeMode={'cover'} style={styles.badgesOpened} />
                        <Text style={[styles.text, { paddingLeft: '25%', width: '80%',height:'100%' }]}>{image.name}</Text>
                    </View>
                </View>
            </View>
        )
    }
    renderImageCountry(image) {
        return (
            <View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('22%'), }}>
                <View style={{ width: wp(27), height: hp(21), borderRadius: 8, }}>
                    <View style={styles.imageView}>
                        <Image source={{ uri: serviceUrl.BadgesCountryStamps + image.img }} resizeMode={'cover'} style={styles.badgesOpened} />
                        <Text style={[styles.text, { paddingLeft: '25%', width: '85%' }]}>{image.name}</Text>
                    </View>
                </View>
            </View>
        )
    }
    renderImageStreak(image) {
        return (
            <View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('22%') }}>
                <View style={{
                    width: wp(27), height: hp(21), borderRadius: 8,
                }}>
                    <View style={styles.imageView}>
                        <Image source={{ uri: serviceUrl.BadgesstreakImages + image.img }} resizeMode={'cover'} style={[styles.badgesOpened,{height:hp(15)}]} />
                        <Text style={[styles.text, { paddingLeft: '15%', width: '80%' }]}>{image.name}</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderImageMemory(image) {
        return (
            <View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('23%'), }}>
                <View style={{
                    width: wp(27), height: hp(27), borderRadius: 8,
                }}>
                    <View style={styles.imageView}>
                        <Image source={{ uri: serviceUrl.BadgesMemorieImages + image.img }} resizeMode={'cover'} style={styles.badgesOpened} />
                        <Text style={[styles.text, { paddingLeft: '29%', width: '80%',height:'100%', }]}>{image.name}</Text>
                        {/* <Text style={[styles.text, { paddingLeft: '20%', width: '85%',height:'50%',backgroundColor:'red' }]}>{image.name}</Text> */}
                    </View>
                </View>
            </View>
        )
    }
    renderImageVlog(image) {
        return (
            <View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('23%'), }}>
                <View style={{
                    width: wp(27), height: hp(21), borderRadius: 8,
                }}>
                    <View style={styles.imageView}>
                        <Image source={{ uri: serviceUrl.BadgesVlogImages + image.img }} resizeMode={'cover'} style={styles.badgesOpened} />
                        {/* <View style={{width: '45%',height:'100%',marginLeft:'25%'}}> */}
                        <Text style={[styles.text, { paddingLeft: '28%', width: '80%',height:'100%', }]}>{image.name}</Text>
                    {/* </View> */}
                    </View>
                </View>
            </View>
        )
    }

    render() {

        return (

            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff',marginTop:0 }}>
                <Toolbar {...this.props} centerTitle="Badges" rightImgView={this.renderRightImgdone()} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{marginBottom:'3%'}}>
                        <View >
                            <Text style={styles.headerText}>Footprint({this.state.FootprintImaged.length})</Text>
                            <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 5, paddingEnd: 5 }}>

                                {this.state.FootprintImaged.length > 0 ? this.state.FootprintImaged.map(i =>
                                    <View key={i}>{this.renderImageFootPrint(i)}

                                    </View>) :
                                    (<View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('22%'), }}>
                                        <View style={{ width: wp(25), height: hp(21), borderRadius: 8,}}>
                                            <View style={styles.imageView}>
                                                <Image resizeMode={'cover'} style={styles.badgesOpened} />
                                                <Text style={styles.text}></Text>
                                                <Text style={styles.text}></Text>
                                            </View>
                                        </View>
                                    </View>)}
                            </ScrollView>
                        </View>

                        <View >
                            <Text style={styles.headerText}>Country Stamps({this.state.CountryImages.length})</Text>
                            <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 20, paddingEnd: 20 }}>

                                {this.state.CountryImages.length > 0 ? this.state.CountryImages.map(i =>
                                    <View key={i}>{this.renderImageCountry(i)}

                                    </View>) :
                                    (<View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('22%'), }}>
                                        <View style={{width: wp(25), height: hp(21), borderRadius: 8,}}>
                                            <View style={styles.imageView}>
                                                <Image resizeMode={'cover'} style={styles.badgesOpened} />
                                                <Text style={styles.text}></Text>
                                                <Text style={styles.text}></Text>
                                            </View>
                                        </View>
                                    </View>)}
                            </ScrollView>
                        </View>

                        <View >
                            <Text style={styles.headerText}>Streaks ({this.state.streakImages.length})</Text>
                            <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 20, paddingEnd: 20 }}>

                                {this.state.streakImages.length > 0 ? this.state.streakImages.map(i =>
                                    <View key={i}>{this.renderImageStreak(i)}

                                    </View>) :
                                    (<View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('22%'), }}>
                                        <View style={{
                                            width: wp(25), height: hp(21), borderRadius: 8,
                                        }}>
                                            <View style={styles.imageView}>
                                                <Image resizeMode={'cover'} style={styles.badgesOpened} />
                                                <Text style={styles.text}></Text>
                                                <Text style={styles.text}></Text>
                                            </View>
                                        </View>
                                    </View>)
                                }
                            </ScrollView>
                        </View>

                        <View >
                            <Text style={styles.headerText}>Memories ({this.state.MemorieImages.length})</Text>
                            <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 20, paddingEnd: 20 }}>

                                {this.state.MemorieImages.length > 0 ? this.state.MemorieImages.map(i =>
                                    <View key={i}>{this.renderImageMemory(i)}

                                    </View>) :
                                    (<View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('22%') }}>
                                        <View style={{
                                            width: wp(25), height: hp(21), borderRadius: 8
                                        }}>
                                            <View style={styles.imageView}>
                                                <Image resizeMode={'cover'} style={styles.badgesOpened} />
                                                <Text style={styles.text}></Text>
                                                <Text style={styles.text}></Text>
                                            </View>
                                        </View>
                                    </View>)}
                            </ScrollView>
                        </View>

                        <View >
                            <Text style={styles.headerText}>Vlog ({this.state.VlogImages.length})</Text>
                            <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 20, paddingEnd: 20 }}>

                                {this.state.VlogImages.length > 0 ? this.state.VlogImages.map(i =>
                                    <View key={i}>{this.renderImageVlog(i)}

                                    </View>) :
                                    (<View style={{ marginTop: hp('1%'), marginRight: wp('3%'), height: hp('22%'), }}>
                                        <View style={{
                                            width: wp(25), height: hp(21), borderRadius: 8,
                                        }}>
                                            <View style={styles.imageView}>
                                                <Image resizeMode={'cover'} style={styles.badgesOpened} />
                                                <Text style={styles.text}></Text>
                                                <Text style={styles.text}></Text>
                                            </View>
                                        </View>
                                    </View>)}
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>


        )
    }

}


const styles = StyleSheet.create({
    headerText: { marginTop: hp('2%'), color: '#000', fontSize: 14, marginLeft: 10, fontFamily: Common_Color.fontMedium },
    badgeView: { width: wp('100%'), height: hp('22%'), marginTop: hp('2%'), borderRadius: 20, flexDirection: 'row' },
    imageView: { width: wp('30%'), height: '100%' },
    badgesimage: { width: wp('25%'), height: hp(15), },
    badgesNotOpen: { width: wp('25%'), height: hp(15), opacity: 0.3, marginLeft: '5%' },
    badgesOpened: { width: wp('30%'), height: hp(15), opacity: 1, marginLeft: '5%' },
    text1: { textAlign: "center", color: '#ebebeb' },
    text: { textAlign: "center", color: 'black' }
});