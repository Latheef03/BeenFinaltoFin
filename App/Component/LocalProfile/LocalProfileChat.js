import React, { Component } from 'react';
import { TextInput,View, Animated, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, TouchableWithoutFeedback, StatusBar,Keyboard } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { deviceHeight, deviceWidth } from '../_utils/CommonUtils'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileChat from './styles/ProfileChat'
import {  Menu, Divider } from 'react-native-paper';
import { Icon } from 'react-native-elements'
const imagepath = '../Planner/images/';
const imagepath1 = '../../Assets/Images/';
import { LPOneToOneChat } from '../Chats/'
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import QB from 'quickblox-react-native-sdk';
import serviceUrl from '../../Assets/Script/Service';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { Common_Color } from '../../Assets/Colors'
import styles1 from '../../styles/NewfeedImagePost';
import { toastMsg1, toastMsg } from '../../Assets/Script/Helper';

const imagePath1 = '../../Assets/Images/';

export default class LocalProfileChat extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        LPC = new LPOneToOneChat()
        this.state = {
            modalVisible: '',
            userData: '',
            typedMessage: '',
            result: '',
            PlaceCount: '',
            HangOutCount: '',
            ratings: '',

            userid: '',
            isModalVisible1: '', permission_Value: '', isvisibleModal: '', isModalVisible2: '',
            chatUserId: '',
            chatUserName: '',
            Othe: '',
            actionList: false,
            avatarSource: '',
            avatarSource1: '',
            imagesSelected: [],
            animation: new Animated.Value(0), propMulti: false,
            keyboardOffset : 0,
        }
    }

    componentWillMount() {
       // debugger;
        const { navigation,route } = this.props;
        const Comments = route?.params?.data;
        const chatuser = route?.params?.chatUser;
        let result = Comments.result;
        let PlaceCount = Comments.PlaceCount
        let HangOutCount = Comments.HangOutCount
        let ratings = Comments.ratings
        this.setState({
            result: Comments.result,
            Othe: Comments.result[0].Userid,
            PlaceCount: PlaceCount,
            HangOutCount: HangOutCount,
            ratings: ratings,
            chatUserId: chatuser.id,
            chatUserName: chatuser.name,
        })
        console.log('srgd', this.state.Othe)
        this.imageManipulte()
    }

    async componentDidMount() {
       // debugger;
       this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this));
       this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this));
        const { navigatio,route } = this.props;
        const Comments = route?.params?.data;
        const chatuser = route?.params?.chatUser;
        let result = Comments.result;
        let PlaceCount = Comments.PlaceCount
        let HangOutCount = Comments.HangOutCount
        let ratings = Comments.ratings
        let userid = await AsyncStorage.getItem('userId')
        this.setState({
            result: Comments.result,
            Othe: Comments.result[0].Userid,
            PlaceCount: PlaceCount,
            HangOutCount: HangOutCount,
            ratings: ratings,
            userid: userid,
            chatUserId: chatuser.id,
            chatUserName: chatuser.name,
        })
        console.log('srgd', this.state.Othe)
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.imageManipulte()
                this.imageManipulte1()
            })
    }

    keyboardWillShow(event) {
        // console.log('the event show',event);
        this.setState({
          keyboardOffset: event.endCoordinates.height,
        })
      }
    
      keyboardWillHide() {
        this.setState({
          keyboardOffset: 0,
        })
      }

      componentWillUnmount() {
        this.keyboardWillShowSub?.remove();
        this.keyboardWillHideSub?.remove();
      }

    imageManipulte1 = () => {
        const { navigation,route } = this.props;
        const prop = route?.params?.imgProp
        if (prop == undefined) {
            return false;
        }
        console.log('image props from nf upload ', prop.e[0].node.image.uri.replace('file:///', ''));
        console.log('image a ', prop.e[0].node.image.uri);

        if (prop.e && prop.e.length > 0) {
            this.setState({
                avatarSource: prop.e[0].node.image.uri.replace('file:///', ''),
                avatarSource1: prop.e[0].node.image.uri,
                imagesSelected: prop.e.map((i, index) => {
                    return {
                        uri: i.node.image.uri, width: i.node.image.width,
                        height: i.node.image.height, mime: i.node.type, imageIndex: index
                    };
                })
            });
        }
    }
    onchangeText(text) {
        // userTypingHandler
        const { dialogCred } = this.state;
        const { navigation ,route} = this.props;
        let datas = route?.params?.datas;
        this.setState({
            typedMessage: text
        })
        LPC.onchangeText(text)

    }
    toggleOpen = () => {
        const { actionList } = this.state;
        if (this._open) {
            Animated.timing(this.state.animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(this.state.animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
        this._open = !this._open;
        // this.setState({
        //   actionList : !actionList
        // });
    };

    pickGallery = () => {

        this.toggleOpen();
        const { navigation } = this.props;
        let screenProps = 'LocalProfileChat';
        navigation.navigate('GalleryPicker', { screen: screenProps, type: 'Photos', multiPic: true });
    }

   
    imageManipulte = () => {
        console.log('called method')
        const { navigation,route } = this.props;
        const prop = route?.params?.imgProp;
        if (prop == undefined) {
            return false;
        }
        console.log('image manipulate', prop.e[0].node.image.uri)
        if (prop.e && prop.e.length > 0) {
            this.setState({
                // isModalVisible: false,
                albumData: 1, propMulti: true,
                photoPath: prop.e[0].node.image.uri.replace('file:///', ''),
                photoPath1: prop.e[0].node.image.uri,
                images: prop.e.map((i, index) => {
                    return {
                        uri: i.node.image.uri, width: i.node.image.width,
                        height: i.node.image.height, mime: i.node.type, imageIndex: index
                    };
                })
            });
        }
    }
    isImagePicked = () => {
        const { imagesSelected } = this.state;
        console.log('imagese', imagesSelected);
        if (imagesSelected.length > 0) {
            return (
                <View style={{
                    width: deviceWidth, height: deviceHeight * 0.13, backgroundColor: 'rgba(0,0,0,.5)',
                    bottom: 55, position: 'absolute', flexDirection: 'row',
                }}>
                    <View style={{
                        width: deviceWidth, height: deviceHeight * 0.13, flexDirection: 'row', justifyContent: 'center',
                        alignItems: 'center', marginLeft: 5, marginRight: 5,
                    }} >
                        <ScrollView horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 5, paddingEnd: 5 }}>

                            {this.state.imagesSelected.length > 0 ? this.state.imagesSelected.map(i =>
                                <View key={i.uri}>{this.renderImage2(i)}

                                </View>) : null}
                        </ScrollView>
                    </View>

                </View>
            )
        }
    }

    renderImage(image) {
        return (
            <TouchableOpacity onPress={() => alert('sss')}>

                <View style={{
                    backgroundColor: '#c1c1c1', width: 45, height: 70, borderRadius: 5, overflow: 'hidden'
                    , borderWidth: 0.6, borderColor: '#fff', marginRight: 8, flexWrap: 'wrap'
                }} >
                    <Image style={{ width: '100%', height: '100%', }} source={image} />
                </View>


            </TouchableOpacity>
        )
    }
    renderImage2(image) {
        debugger
        return (
            <TouchableOpacity onPress={() => this._setSelectedImage(image)}>

                <View style={{
                    backgroundColor: '#c1c1c1', width: 45, height: 70, borderRadius: 5, overflow: 'hidden'
                    , borderWidth: 0.6, borderColor: '#fff', marginRight: 8, flexWrap: 'wrap'
                }} >
                    <Image style={{ width: '100%', height: '100%', }} source={image} />
                </View>

                {/* <TextInput placeholder='Type here...' placeholderTextColor='#fff'
                    style={styles.textInput} /> */}
            </TouchableOpacity>
        )
    }
    _setSelectedImage(image) {
        debugger
        this.setState({
            photoPath: image.uri.replace("file:///", ''),
            photoPath1: image.uri
        })
    }

    // sendMessage = () => {
    //     const { typedMessage, imagesSelected } = this.state

    //     if (typedMessage == '' && imagesSelected.length == 0) {
    //         return false;
    //     }
    //     this.LPChat.sendMessage(typedMessage, imagesSelected)
    //     this.setState({
    //         typedMessage: '',
    //         imagesSelected: []
    //     })


    // }
    sendMessage = () => {
        debugger;
        var imgStr=[];
        const { typedMessage, imagesSelected,dialogCred } = this.state
        const { navigation } = this.props;
        // let datas = navigation.getParam('datas');
        console.log('bfr split',imagesSelected);
        // if (typedMessage == '' && imagesSelected == undefined) {
        if (typedMessage == '' && imagesSelected.length == 0) {
            return false;
        }
       const isImages =  imagesSelected.length > 0 && imagesSelected.map(m=>{
            console.log('the mm',m);
            this.LPChat.sendMessage(typedMessage,m)
        });

        if(!isImages){
            this.LPChat.sendMessage(typedMessage)
        }
        // console.log('the images exist',isImages);
        
        this.setState({
            typedMessage: '',
            imagesSelected: [],propMulti:false
        })
    }

    stars(count) {
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= count; i++) {
            stars.push((<Image source={require('../../Assets/Images/localProfile/yellowstar.png')}
                style={{ height: hp(3), width: wp(5) }} resizeMode={'stretch'} />));
        }
        return stars;
    }
    async viewProfile() {
        debugger
        var id1 = await AsyncStorage.getItem('OtherUserId');
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid:id1
        };
        const url = serviceUrl.been_url2 + "/OtherUserStatus";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                //AsyncStorage.setItem('reqid', this.state.reqid);
                if (responseJson.connectionstatus === "True") {
                    AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                    //AsyncStorage.setItem('reqid', this.state.reqid);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        this.props.navigation.navigate('LocalOtherProfile', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        this.props.navigation.navigate('LocalOtherProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                    //AsyncStorage.setItem('reqid', this.state.reqid);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        this.props.navigation.navigate('LocalOtherProfile', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        this.props.navigation.navigate('LocalOtherProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                    //AsyncStorage.setItem('reqid', this.state.reqid);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        this.props.navigation.navigate('LocalOtherProfile', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        //AsyncStorage.setItem('reqid', this.state.reqid);
                        this.props.navigation.navigate('LocalOtherProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Mismatch") {
                    // this.props.navigation.navigate('Profile')
                    // this.profileChanger();
                }
                else {
                }
            })
            .catch((error) => {
            });
        // AsyncStorage.setItem('OtherUserId', this.state.OtherId);
        // this.props.navigation.navigate('LocalOtherProfile')
    }
    optionImg() {
        return (
            <View style={{ width: '25%' }}>
                <TouchableOpacity hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }} onPress={() => { this.setState({ modalVisible: true }) }}>
                    {/* <Image source={require(imagepath + 'Option.png')}
                        style={{ height: hp(2.8), width: wp(1.5) }} resizeMode={'stretch'} /> */}
                    <Image source={require('../../Assets/Images/3dots.png')}
                //  resizeMode={'center'} 
                     style={{ width: 16, height: 16, marginTop: 1 }} />
                </TouchableOpacity>
            </View>
        )
    }
    async report(id) {
       // debugger;

        var data = {
            Userid: this.state.userid,
            Otheruserid: this.state.Othe,
            Content: this.state.permission_Value
        };
        const url = serviceUrl.been_url1 + "/ReportLocalProfile";
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // this.setState({ isModalVisible1: false, permission_Value: '' })
                this.setState({ isModalVisible1: false, isModalVisible2: true, permission_Value: '' })
                //toastMsg('success', responseJson.message)

            })
            .catch((error) => {
                //console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });

    };
    _toggleModal12(id) {
       // debugger;
        if (this.state.permission_Value == "" || null || undefined) {
            toastMsg1('danger', "Please give a report")
            //ToastAndroid.show("Please give a report", ToastAndroid.LONG)
        }
        else {
            this.setState({
                isModalVisible: null,
                isvisibleModal: null,
                //  permission_Value: "",
                isModalVisible1: !this.state.isModalVisible1
            });
            let Otheruserid = id;
            this.report(Otheruserid);
        }
    }
    _toggleModal1() {
        this.setState({
            isModalVisible: null,
            isvisibleModal: null,
            permission_Value: "",
            modalVisible: '',
            isModalVisible1: !this.state.isModalVisible1
        });
    }
    render() {
        const { result, PlaceCount, HangOutCount, ratings, } = this.state
        const { navigation,route } = this.props
        const chatuser = route?.params?.chatUser;
        const scaleInterpolate = this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 8],
        });

        const bgStyle = {
            transform: [
                {
                    scale: scaleInterpolate,
                },
            ],
        };

        const cameraInterpolate = this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -70],
        });

        const galleryInterpolate = this.state.animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, -70, -140],
        });

        const reloadStyle = {
            transform: [
                {
                    translateY: cameraInterpolate,
                },
            ],
        };

        const orderStyle = {
            transform: [
                {
                    translateY: galleryInterpolate,
                },
            ],
        };
        const labelPositionInterpolate = this.state.animation.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [20, 40, 60],
        });
        const opacityInterpolate = this.state.animation.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [0, 0, 1],
        });

        const labelStyle = {
            opacity: opacityInterpolate,
            transform: [
                {
                    translateX: labelPositionInterpolate,
                },
            ],
        };
        return (
            <View style={{ flex: 1, backgroundColor:'#fff' }}>

                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle='' rightImgView={this.optionImg()} />

                <ScrollView style={{ height: '100%' }}>
                    <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />

                    {this.state.result.length > 0 && this.state.result.map((item, index) => <View>
                        <TouchableOpacity onPress={() => this.viewProfile()}>
                            <View key={index.toString()} style={{ alignItems: 'center', marginTop: '5%' }}>
                                {item.LocalProfilePic != null || "" ?
                                    <Image source={{ uri: serviceUrl.profilePic + item.LocalProfilePic }}
                                        style={ProfileChat.profilePic} /> :
                                    <Image source={require(imagePath1 + 'profile.png')}
                                        style={ProfileChat.profilePic} />}
                                <Text style={[ProfileChat.userName, { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, }]}>{item.UserName}</Text>
                                <Text style={[ProfileChat.userName, { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, }]}>{item.name && item.name === undefined || item.name && item.name === null || item.name && item.name === "" || item.name && item.name === "null" || item.name && item.name === "undefined" ? "" : item.name}</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={[ProfileChat.icons, { marginTop: 20 }]}>
                            <View style={[ProfileChat.icons]}>
                                <Image source={require('../../Assets/Images/new/Places.png')}
                                    style={{ height: hp(3), width: wp(6) }} resizeMode={'stretch'} />
                                <Text style={{ paddingLeft: '1%', fontSize: 12, marginTop: '5%', fontFamily: Common_Color.fontLight }}>{PlaceCount} Places</Text>
                            </View>
                            <View style={[ProfileChat.icons]}>
                                <Image source={require('../../Assets/Images/new/HangoutSpots.png')}
                                    style={{ height: hp(2.5), width: wp(6) }} resizeMode={'stretch'} />
                                <Text style={{ paddingLeft: '1%', fontSize: 12, marginTop: '5%', fontFamily: Common_Color.fontLight }}>{HangOutCount} Spots</Text>
                            </View>
                            <View style={[ProfileChat.icons]}>
                                <View style={{ flexDirection: 'row' }}>

                                    {this.stars(ratings[0].avgRate)}
                                </View>
                            </View>
                            <View style={[ProfileChat.icons, { flexDirection: 'row' }]}>
                                <Text style={{ fontSize: 12, color: '#000', fontFamily: Common_Color.fontLight }}> </Text>
                                <Text style={{ fontSize: 12, marginTop: '5%', fontFamily: Common_Color.fontLight }}>₹{item.PersonalTour}/hr</Text>
                            </View>
                            <View style={[ProfileChat.icons, { flexDirection: 'row' }]}>
                                <Text style={{ fontSize: 12, color: '#000', fontFamily: Common_Color.fontLight }}> </Text>
                                <Text style={{ fontSize: 12, marginTop: '5%', fontFamily: Common_Color.fontLight }}>₹{item.TourAdvice}/advice</Text>
                            </View>
                        </View>
                        <View style={{ alignSelf: 'center', marginTop: 5 }}>
                            <Text style={{ fontSize: 12, fontFamily: Common_Color.fontLight }}>
                                {/* {ratings[0].Reviews}reviews ({ratings[0].avgRate}) */}
                                {ratings[0].avgRate} ({ratings[0].Reviews} reviews)
                            </Text>
                        </View>
                        <View style={ProfileChat.borderline} />
                        <View style={ProfileChat.media}>
                        </View>

                    </View>)}

                    <Modal isVisible={this.state.propMulti}
                         onBackButtonPress={() => this.setState({ propMulti: false })} 
                         style={{margin:0}}>
                            <View style={{flex:1}}>
                                <StatusBar hidden />
                            
                                    <ImageBackground style={{ width: '100%', height: hp('100%'),   }}
                                        source={{ uri: this.state.photoPath1 }}
                                        resizeMode={'cover'}
                                    >

                                        <View style={{ backgroundColor: 'transparent', width: wp('100%'), height: '100%' }}>
                                            <View style={{ width: wp('15%') }}>
                                                <TouchableOpacity onPress={() =>this.setState({propMulti:false,imagesSelected:[]})}>
                                                    <Image style={{ width: 18, height: 18, margin: 10 }}
                                                        source={require('../../Assets/Images/close_white.png')} />
                                                </TouchableOpacity>
                                            </View>

                                            {/* <View style={{ height: hp('68%'),backgroundColor:'red' }} /> */}
                                            <View style={{
                                                bottom: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center',
                                                alignSelf: 'center', marginRight: 10
                                            }}>

                                                {/* #526c6b */}
                                                <View style={{width: wp('100%'), height: hp('14%'), flexDirection: 'row', backgroundColor: '#00000070' }}>

                                                    <View style={{
                                                        width: wp('75%'), height: hp('14%'), flexDirection: 'row',
                                                        justifyContent: 'center', alignItems: 'center', marginLeft: 5
                                                    }} >
                                                        <ScrollView horizontal={true}
                                                            showsHorizontalScrollIndicator={false}
                                                            contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 5, paddingEnd: 5 }}>
                                                            {this.state.images ? this.state.images.map(i =>
                                                                <View key={i.uri}>{this.renderImage2(i)}

                                                                </View>) : null}
                                                        </ScrollView>
                                                    </View>

                                                    <View style={{
                                                        width: wp('23.6%'), height: hp('14%'), justifyContent: 'center',
                                                    }}>
                                                        {this.state.isLoading ?
                                                            (<Spinner size="large" color="#fb0143" />)
                                                            :

                                                            <TouchableOpacity onPress={() => this.sendMessage()}
                                                            >
                                                            {/* <TouchableOpacity onPress={() => this.imageUpload()}
                                                            > */}
                                                                    <LinearGradient
                                  start={{ x: 0, y: 0.75 }}
                                  end={{ x: 1, y: 0.25 }}
                                  style={report.nextButton}
                                  colors={["#fff", "#ffffff"]} >
                                   <Text style={[report.LoginButtontxt, {
                                       color: '#4f4f4f'
                                     , textAlign: 'center'
                                    }]}>Send</Text>
                                </LinearGradient>
                                                            </TouchableOpacity>
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                    
                            </View>
                        </Modal>




                    <ScrollView style={{}}>
                        <View style={{}}  >
                            <LPOneToOneChat
                                ref={ref => this.LPChat = ref}
                                chatData={chatuser} />
                        </View>
                    </ScrollView>

                </ScrollView>

               


                {/* view for picked images */}

                {/* {this.isImagePicked()} */}

                {/* End of picked images view */}
                {/* bottom view */}
                {/* <View style={{ flexDirection: 'row', backgroundColor: '#ff1c48', bottom: 0, position: 'absolute', width: wp('100%') }}> */}
                {/* <View style={{ width: wp('100%'), height: deviceHeight * 0.09, backgroundColor: '#00000000',marginBottom:'-5.5%' }}> */}
                <View style={{
                    borderRadius: 15, marginLeft: 10, marginBottom: 7, flexDirection: 'row', bottom: this.state.keyboardOffset,
                    backgroundColor: '#fb0143', position: 'absolute',
                    height: 40, width: wp('96%'),
                    // height: deviceHeight * 0.07, width: wp('95%'),
                }}>
                    <View style={{ marginLeft: '2%', textAlign: 'center', alignItems: 'center', justifyContent: 'center', }}>
                        {/* <TouchableWithoutFeedback onPress={this.toggleOpen}
                            disabled={this.state.imagesSelected.length > 0 ? true : false}> */}
                             <TouchableOpacity onPress={()=> this.pickGallery()} activeOpacity={0.5}>    
                            <Icon
                                name={"plus-circle-outline"}
                                size={42}
                                color="rgb(255, 255, 255)"
                                type="material-community" />
                            {/* <Image source={require('../../Assets/Images/messageAdd.png')} resizeMode={'stretch'} style={{ width: wp('10%'), height: hp('6%'), }} /> */}
                        </TouchableOpacity>
                    </View>

                    {/* <TextInput value={this.state.typedMessage} placeholder={'Type message...'} 
placeholderTextColor={'#fff'} onChangeText={(text) => { this.onchangeText(text) }} 
multiline={true} style={{ marginLeft: "2%", 
width: '70%', color: '#fff', fontFamily: Common_Color.fontMedium }}></TextInput> */}


                    <TextInput
                        value={this.state.typedMessage}
                        placeholder={'Type message...'}
                        placeholderTextColor={'#ffffff'}
                        onChangeText={(text) => { this.onchangeText(text) }}
                        multiline={true}
                        autoCorrect={false}
                        onChangeText={(text) => { this.onchangeText(text) }}
                        theme={{ colors: { text: 'white', primary: '#fb0143', placeholder: '#ffffff' } }}
                        style={{
                            marginLeft: "2%", marginTop:'1.5%',
                            width: '70%', backgroundColor: '#fb0143', color: '#ffffff', fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontLight
                        }}></TextInput>

                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => { this.sendMessage() }}>
                            <Text style={{ color: '#fff', fontFamily: Common_Color.fontBold }}>
                                Send
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* </View> */}
                {/* End bottom view */}


                <Modal onBackdropPress={() => this.setState({ modalVisible: false })}
                    onBackButtonPress={() => this.setState({ modalVisible: false })}
                    animationType='fade'
                    transparent={true}
                    isVisible={this.state.modalVisible}
                >
                    <View style={styles1.modalContent}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View style={{ marginTop: 15, }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ modalVisible: false })
                                }}>
                                <Text style={[styles1.modalText, { color: 'red' }]}>
                                    Delete</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles1.horizontalSeparator} />

                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ modalVisible: false, isModalVisible1: true })
                            }}>
                            <View style={{ marginTop: 7, marginBottom: 15 }}>
                                <Text style={[styles1.modalText, { color: 'red' }]}>Report</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Modal>


                {/* Report models */}
                <Modal isVisible={this.state.isModalVisible1}
                    onBackdropPress={() => this.setState({ isModalVisible1: null })}
                    onBackButtonPress={() => this.setState({ isModalVisible1: null })} >
                    <View style={Common_Style.parentViewReport} >
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <Image style={Common_Style.iconReport} source={require('../../Assets/Images/new/Expression.png')}></Image>
                        <Text style={Common_Style.headerReport} >
                            Inappropriate Content!
</Text>
                        <Text style={Common_Style.subHeaderReport} >
                            We are sorry for the inconvenience!
</Text>
                        <View style={Common_Style.contentViewReport}>
                            <Text style={Common_Style.contentReport} >
                                We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
</Text>
                        </View>
                        <TextInput
                            label=" Type Here..."
                            placeholderStyle={Common_Style.PstyleReport}
                            mode="outlined" gnb
                            multiline={true}
                            maxLength={500}
                            autoCorrect={false}
                            
                            // flexWrap: 'wrap'
                            onChangeText={(text) => { this.setState({ permission_Value: text }) }}
                            value={this.state.permission_Value}
                            style={Common_Style.TstyleReport}
                            selectionColor={'#f0275d'} theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }}
                        />



                        <View
                            style={Common_Style.buttonViewReport}
                        >

                            <TouchableOpacity
                                onPress={() => this._toggleModal12()}
                                activeOpacity={1.5}
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 0.75 }}
                                    end={{ x: 1, y: 0.25 }}
                                    style={Common_Style.ButtonReport}
                                    colors={["#fb0043", "#fb0043"]}
                                >

                                    <Text onPress={() => this._toggleModal12()}
                                        style={Common_Style.ButtonTextReport}>
                                        Report
</Text>
                                </LinearGradient>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => this._toggleModal1()}
                                activeOpacity={1.5}
                            >
                                <View style={Common_Style.ButtonCancel}>
                                    <Text onPress={() => this._toggleModal1()} style={Common_Style.CancelButtonTextReport}>
                                        Cancel
</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>



                {/* Thanks Modal */}
                <Modal isVisible={this.state.isModalVisible2}
                    onBackdropPress={() => this.setState({ isModalVisible2: false })}
                    onBackButtonPress={() => this.setState({ isModalVisible2: false })} >
                    <View style={Common_Style.TparentView} >
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <Text style={Common_Style.TheaderInModalTwo} >
                            Thank you for your voice!
</Text>

                        <View style={Common_Style.TcontentViewInModalTwo}>
                            <Text style={Common_Style.TcontentTextInModalTwo} >
                                We would like to show you our utmost gratitude for raising your voice against inappropriate behaviour and thus helping in making this a safe and happy place for people around you!
</Text>
                            <Text style={[Common_Style.TcontentTextInModalTwo, { marginTop: 10 }]} >
                                Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
</Text>
                        </View>

                        {/* <View style={Common_Style.TcontentViewInModalTwo}>
              <Text style={[Common_Style.TcontentTextInModalTwo, { marginTop: 40 }]} >
                Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
</Text>
            </View> */}
                        <View style={Common_Style.TokayButton}>
                            <TouchableOpacity onPress={() => this.setState({ isModalVisible2: false })} activeOpacity={1.5} >
                                <Text onPress={() => this.setState({ isModalVisible2: false })} style={Common_Style.TokayButtonText}>
                                    Okay
                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View >
        )
    }
}

const report = {
    nextButton: {
        // backgroundColor: "#87cefa",
        justifyContent: 'center',
        alignSelf: 'center',
        height: hp("5%"),
        width: wp("20%"),
        //    marginTop: 25,
        // marginRight:15,
        borderRadius: 25,
        shadowColor: '#000000',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    LoginButtontxt: {
        color: "#fff",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 16,
        fontFamily: Common_Color.fontBold,
    },
    parentView: { width: "100%", borderRadius: 15, backgroundColor: "white" },
    icon: { width: wp(8), height: hp(4.5), marginLeft: '45%', marginBottom: '5%', marginTop: '5%' },
    header: { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, marginTop: 10, textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#000', },
    subHeader: { marginTop: 15, fontSize: 12, textAlign: "center", alignSelf: "center", fontWeight: 'normal', color: '#959595', fontFamily: Common_Color.fontMedium },
    contentView: { width: '95%', textAlign: "center", },
    content: { marginTop: 10, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#9e9e9e', fontFamily: Common_Color.fontMedium },

    inputView: {
        borderColor: '#a5a5a5',
        borderWidth: 1,
        width: "85%",
        padding: 5,
        height: '35%',
        marginLeft: 25,
        color: "grey",
        marginTop: 25,
        marginBottom: 15,
        borderRadius: 5
    },

    buttonView: {

        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        marginVertical: 10,
        marginTop: 10,
        justifyContent: "space-evenly",
        margin: 10,
        marginLeft: 20
    },


    // success msg  View

    headerInModalTwo: { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, marginTop: 25, textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#000', },

    contentViewInModalTwo: { width: '95%', textAlign: "center", },

    contentTextInModalTwo: { marginTop: 20, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#9e9e9e', fontFamily: Common_Color.fontMedium },

    okayButton: {

        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        marginVertical: 10,
        marginTop: 40,
        justifyContent: "space-evenly",
        margin: 10,
        marginLeft: 20, fontWeight: 'bold'
    },
    okayButtonText: {
        color: "#d12c5e",
        textAlign: "center",
        justifyContent: "center",
        fontSize: 25, fontWeight: 'bold', fontFamily: Common_Color.fontBold
    },
    background: {
        // backgroundColor: 'rgba(0,0,0,.3)',
        position: 'absolute',
        width: 30,
        height: 35,
        bottom: 0,
        left: 0,
        borderRadius: 25,
    },
    button: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#333',
        shadowOpacity: 0.1,
        shadowOffset: { x: 2, y: 0 },
        shadowRadius: 2,
        borderRadius: 25,
        position: 'absolute',
        backgroundColor: 'yellow',
        bottom: 0,
        left: 20,
    },
    other: {
        backgroundColor: '#FFF',
    },
    payText: {
        color: '#FFF',
    },
    pay: {
        backgroundColor: '#00B15E',
    },
    label: {
        color: '#000',
        position: 'absolute',
        fontSize: 16,
        backgroundColor: '#FFF',
        width: 75,
        textAlign: 'center',

    },
}