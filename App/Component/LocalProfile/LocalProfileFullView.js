import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer, Item } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileFullView from './styles/profileFullView'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileChat from './styles/ProfileChat'
import Modal from "react-native-modal";
import serviceUrl from '../../Assets/Script/Service';
const imagepath = '../../Assets/Images/localProfile/';
const imagePath1 = '../../Assets/Images/';
import { Toolbar } from '../commoncomponent'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style'
import styles1 from '../../styles/NewfeedImagePost';
import { toastMsg1, toastMsg } from '../../Assets/Script/Helper';
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'

var placeCount = '';
var HangoutCount = '';
export default class LocalProfileFullView extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            modalVisible: '', masterData: '', ratings: '', placeCount: '',
            HangoutCount: '',
            Default_Rating: 0,
            getStarRate: 4,
            overallReview: 0,
            ratingsOverall: 0,
            Max_Rating: 5,
        }
    }
    componentWillMount() {
        // debugger;
        this.getApi();
    }
    componentDidMount() {
        // debugger;
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getApi();

            });
    }

    reviewScreen(data) {
        debugger
        var data = {
            reviewData: data,
            screenName: "UserLocalProfile"
        }
        this.props.navigation.navigate('LocalProfReview', { data: data })

    }


    async getApi() {
        // debugger;
        var data = {
            //  Userid: "5e219b53bd333366c1be32ec"
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url1 + '/GetLocalprofile';
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {

                    this.setState({
                        masterData: responseJson.result, ratings: responseJson.Ratings, placeCount: responseJson.places,
                        HangoutCount: responseJson.Hangout
                    })
                    placeCount = responseJson.places
                    HangoutCount = responseJson.Hangout
                    console.log(this.state.masterData)
                }
                else {
                    console.log('contain false')
                }

            })
            .catch((error) => {

                //toastMsg('danger', error + 'please check your internet and try again! ')
            });
    };

    async deleteprofile() {
        // debugger;
        this.setState({ modalVisible: false });

        var data = {
            Userid: await AsyncStorage.getItem('userId')
            //Userid: this.state.masterData[0]._id
        };
        const url = serviceUrl.been_url + '/DeleteProfile'
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    this.setStorage()
                }
                else {
                    console.log('contain false');
                    toastMsg1('danger', 'could not quit profile')
                    //  ToastAndroid.show('could not quit profile',ToastAndroid.SHORT)
                }
            })
            .catch((error) => {
                toastMsg1('danger', 'could not quit profile')
                // ToastAndroid.show('could not quit profile',ToastAndroid.SHORT)
                //toastMsg('danger', error + 'please check your internet and try again! ')
            });
    };

    setStorage = () => {
        AsyncStorage.removeItem('localProfile');
        AsyncStorage.setItem('localProfile', 'No');
        this.props.navigation.navigate('MyPager')
    }


    stars(count) {
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= count; i++) {
            stars.push((
                <Fontisto name="star" size={24} style={{marginLeft:4}} color="#fe9102" />
            ));
        }
        return (stars);
    }

    starsUser(userReview) {
        let starsUserReview = [];
        // Loop 5 times
        for (var i = 1; i <= userReview; i++) {
            starsUserReview.push((
                <Fontisto name="star" size={24} style={{marginLeft:4}} color="#fe9102" />
            ));
        }
        return (starsUserReview);
    }
    edit() {
        debugger
        this.setState({ modalVisible: false, });
        this.props.navigation.navigate('LocalProfileSave');
    }
    optionImg() {
        return (
            <View style={{ width: '25%' }}>
                <TouchableOpacity hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }} onPress={() => { this.setState({ modalVisible: true }) }}>
                    <Image source={require('../../Assets/Images/3dots.png')}
            //  resizeMode={'center'} 
                     style={{ width: 16, height: 16, marginTop: '0.5%' }} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let getRevieStar = [];
        for (var getStarRate = 1; getStarRate <= this.state.Max_Rating; getStarRate++) {
            getRevieStar.push(
                getStarRate <= this.state.Default_Rating ? 
                    //Filled Star icon
                       <Fontisto name="star" size={30} style={{marginLeft:4}} color="#fe9102" />
                         : 
                     <Feather name="star" size={30} style={{marginLeft:4}} color="#fe9102" />
            );
        }
        return (
            <View style={{ flex: 1, marginTop: 0 ,backgroundColor:'#fff'}}>

                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle='' rightImgView={this.optionImg()} />

                <Content>
                    <View>
                        {this.state.masterData.length > 0 && this.state.masterData.map((data, i) => {
                            return (
                                <View key={`id${i}`} style={{ marginTop: '-5%', }}>
                                    <View style={{ alignItems: 'center', marginTop: '5%' }}>
                                        {data.LocalProfilePic != null || "" ?
                                            <Image source={{ uri: serviceUrl.profilePic + data.LocalProfilePic }}
                                                style={ProfileChat.profilePic} resizeMode={'cover'} />
                                            :
                                            <Image source={require(imagePath1 + 'profile.png')}
                                                style={ProfileChat.profilePic} resizeMode={'cover'} />}
                                        <Text style={[ProfileChat.userName, { fontSize: Username.FontSize, fontFamily: Username.Font, marginTop: 5 }]}> {data.UserName && data.UserName === undefined || data.UserName && data.UserName === null || data.UserName && data.UserName === "" || data.UserName && data.UserName === "null" || data.UserName && data.UserName === "undefined" ? "" : data.UserName}</Text>

                                        <Text style={[ProfileChat.userName, { fontSize: Username.FontSize, fontFamily: Username.Font, }]}>{data.name && data.name === undefined || data.name && data.name === null || data.name && data.name === "" || data.name && data.name === "null" || data.name && data.name === "undefined" ? "" : data.name}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', }}>

                                        <Text style={[ProfileChat.userName, { fontSize: Description.FontSize, fontFamily: Description.Font }]}>'{data.tagline}'</Text>
                                        <View style={{ width: '80%', }}>
                                            <Text style={[ProfileChat.userName, { marginTop: '4%', fontSize: Description.FontSize, fontFamily: Description.Font }]}>{data.Description}</Text>
                                        </View>
                                    </View>

                                    {/* Personal tour amount and Advice amount */}
                                    <View style={{ margin: '5%' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={ProfileFullView.View}>
                                                <View>
                                                <Text style={{ fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold,fontWeight:'bold'}}>  {data.currenry} {data.PersonalTour} <Text style={{ fontSize: 6, }}>per hour </Text> </Text>
                                                <Text style={[Common_Style.LpText, { fontSize: Username.FontSize, fontFamily: Username.Font,fontWeight:'500', }]}>Personal Tour</Text>
                                                </View>
                                                <View style={{ marginTop: '5%' }}>
                                                <Text style={{ fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold,fontWeight:'bold'}}>  {data.currenry} {data.TourAdvice} <Text style={{ fontSize: 6, }}>per hour </Text> </Text>
                                                    <Text style={[Common_Style.LpText, { fontSize: Username.FontSize, fontFamily: Username.Font,fontWeight:'500', }]}>Tour Advice</Text>
                                                </View>
                                            </View>

                                            {/* Hangout image with count lists */}
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('SpotAdd') }}>
                                                <View style={[ProfileFullView.View, { marginTop: '-2%' }]}>
                                                    <Image source={require('../../Assets/Images/new/HangoutSpots.png')}
                                                        style={ProfileFullView.icons1} resizeMode={'contain'} />

                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[Common_Style.LpText,{fontSize: Username.FontSize, fontFamily: Username.Font,fontWeight:'500'}]}>{this.state.HangOutCount} Hangout Spots</Text>   
                                                    </View>

                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        {/* Local Profile Places add lists */}
                                        <View style={ProfileFullView.wholeFlagView}>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('PlacesAdd') }}>
                                                <View style={[ProfileFullView.View, { backgroundColor: 'lightgray' }]}>
                                                    <Image source={require('../../Assets/Images/new/Places.png')}
                                                        style={{ height: wp('18%'), width: hp('18%'), }} resizeMode={'contain'} />

                                                    <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[Common_Style.LpText,{fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold,fontWeight:'bold'}]}>{this.state.placeCount} Places</Text>
                                                    </View>

                                                </View>
                                            </TouchableOpacity>


                                            {/* Review overall count,Count,stars,overall reviews */}
                                            <TouchableOpacity onPress={() => this.reviewScreen(data)}>
                                                <View style={[ProfileFullView.View]}>
                                                    {this.state.ratings.length > 0 && this.state.ratings.map((data) => (
                                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}>
                                                             <Text style={[ProfileFullView.reviewCount, { fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold,fontWeight:'bold'  }]}>{ data.avgRate === 0 ? 0 : data.avgRate}</Text>

                                                            {data.avgRate <= 0 ?
                                                                <View style={{  flexDirection: 'row', marginTop:10, marginBottom: '4%', alignSelf: 'center'  }}>
                                                                    {getRevieStar}
                                                                </View> :
                                                            <View style={{ flexDirection: 'row', marginTop:10, marginBottom: '4%', alignSelf: 'center' }}>
                                                                {this.stars(data.avgRate)}
                                                            </View> }

                                                            <View style={{ flexDirection: 'row', marginTop: '4%' }}>
                                                            <Text style={[Common_Style.LpText, { fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold ,fontWeight:'bold'}]}>{data.Reviews === 0 ? 0 : data.Reviews} reviews</Text>
                                                            </View>
                                                        </View>))}

                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}

                    </View>
                </Content>

                <Modal onBackdropPress={() => this.setState({ modalVisible: false })}
                    onBackButtonPress={() => this.setState({ modalVisible: false })}
                    animationType='fade' isVisible={this.state.modalVisible}>
                    <View style={styles1.modalContent}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

                        <View style={{ marginTop: 15, }}>
                            <TouchableOpacity onPress={() => { this.edit() }}>
                                <Text onPress={() => { this.edit() }}
                                    style={styles1.modalText}>
                                    Edit Profile
                   </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles1.horizontalSeparator} />

                        <View style={{ marginTop: 7, }}>
                            <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }}>
                                <Text onPress={() => { this.setState({ modalVisible: false }) }} style={[styles1.modalText, { color: '#00a8cc' }]}>
                                    Go Offline
              </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles1.horizontalSeparator} />

                        <View style={{ marginTop: 7, marginBottom: 15 }}>
                            <TouchableOpacity onPress={() => { this.deleteprofile() }}>
                                <Text onPress={() => { this.deleteprofile() }} style={[styles1.modalText, { color: 'red' }]}>
                                    Quit Profile
                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>



            </View>
        )
    }
}


