import React, { Component } from 'react';
import {
    View, Text, Image, FlatList, ToastAndroid, TouchableOpacity,
    ScrollView, Animated, TouchableWithoutFeedback, ImageBackground, StatusBar, Platform,KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content, Item, Spinner } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
import LinearGradient from "react-native-linear-gradient";
import { TextInput } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import styles1 from '../../styles/NewfeedImagePost';
import { deviceHeight, deviceWidth } from '../_utils/CommonUtils';
import TaggedPostStyle from './styles/TaggedPostStyle';
import { toastMsg } from '../../Assets/Script/Helper';
import { GroupChat } from '../Chats/';
import Common_Style from '../../Assets/Styles/Common_Style';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors';
import plannerStyles from '../Planner/styles/plannerStyles';
const imagePath = '../../Assets/Images/';
import { Toolbar } from '../commoncomponent';
const imagepath1 = '../../Assets/Images/localProfile/';
import ViewMoreText from 'react-native-view-more-text';
import { Icon } from 'react-native-elements';
import HASView from './HideAndShowView';
import { StatusBarIOS } from 'react-native';

export default class Open extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        gch = new GroupChat()
        this.state = {
            Title: "",
            Location: "",
            TravelDates: "",
            Currency: "",
            Description: "",
            MinPrice: "",
            MaxPrice: "",
            visibleModal: null, result: "", AdminId: "",
            MemberRes: "",
            groupDatas: '',
            typedMessage: '',
            chatGroupId: '',
            Admin: "",
            albumData: null,
            actionList: false,
            avatarSource: '',
            avatarSource1: '',
            imagesSelected: [],
            mediaCount: 0,
            gChatList: [],
            animation: new Animated.Value(0),
            albumData: 1,
            isLoading: false, MultiModal: false, propMulti: false, place_id:"",
            Location:"",
            coords:""
        }
    }
    async UNSAFE_componentWillMount() {
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({AdminId: id1})
        this.details();
    }
    async componentDidMount() {
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({AdminId: id1})
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.details();
                this.imageManipulte1()
                this.imageManipulte()
            }
        );
        this.getChatDetails();
    }

    getChatDetails = () => {
        let datas = this.props.route?.params?.datas;
        this.setState({
            groupDatas: datas,
            chatGroupId: datas?.groupId
        })
    }

    renderViewMore(onPress) {
        return (
            <Text style={[Common_Style.viewMoreText,]} onPress={onPress}>View more</Text>)
    }
    renderViewLess(onPress) {
        return (
            <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }} onPress={onPress} >View Less</Text>)
    }

    toggleOpen = () => {
        const { actionList } = this.state;
        if (this._open) {
            Animated.timing(this.state.animation, { toValue: 0,duration: 300,useNativeDriver: true,}).start();
        } else {
            Animated.timing(this.state.animation, { toValue: 1,duration: 300, useNativeDriver: true,}).start();
        }
        this._open = !this._open;
    };


    takeImage() {
        // debugger;
        this.toggleOpen();
        this.setState({ albumData: 1, });
        const { navigation } = this.props
        navigation.navigate('GalleryPicker', { screen: 'Open', type: 'Photos' });
    }

    imageManipulte1 = () => {
        const prop = this.props.route?.params?.imgProp;
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

    async details() {
         debugger;
        var OtherUserId = await AsyncStorage.getItem('OtherUserIdPlanner');
        var data = {
            groupid: OtherUserId,
            userId: this.state.AdminId
        };
        const url = serviceUrl.been_url1 + "/ParticularPlannerGroup";
        return fetch(url, {
            method: "POST",
            headers:serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('planner details', responseJson);
                // console.log('desc', responseJson.result[0].Description);
                // console.log('desc', typeof responseJson.result[0].Description);
                this.setState({
                    MemberRes: responseJson.MemberRes,
                    result: responseJson.result[0],
                    mediaCount: responseJson.mediaCount,
                    gChatList: responseJson.chatList,
                    Title: responseJson.result[0].Title,
                    Location: responseJson.result[0].Location,
                    TravelDates: responseJson.result[0].TravelDates,
                    Currency: responseJson.result[0].Currency,
                    Description: responseJson.result[0].Description,
                    MinPrice: responseJson.result[0].MinPrice,
                    MaxPrice: responseJson.result[0].MaxPrice,
                    Admin: responseJson.result[0].Admin,
                    place_id:responseJson.result[0].place_id,
                    coords:responseJson.result[0].coords
                })
                AsyncStorage.setItem('OtherUserIdPlanner', responseJson.result[0]._id);
                AsyncStorage.setItem('PlannerUserId', responseJson.result[0].UserId);
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    Invite() {
        this.props.navigation.navigate('SendReqPeople');
    }
    async Invite1() {
        var userId = await AsyncStorage.getItem('userId');
        if (userId === this.state.result.UserId) {
            this.props.navigation.navigate('SendReqPeople');
        }
        else {
            var data = {
                groupid: this.state.result._id,
                ownerId: this.state.result.UserId,
                userId: [userId],
                reqfrom: userId === this.state.result.UserId ? "Owner" : "User"
            };
            console.log("Dat is planner",data);
            const url = serviceUrl.been_url1 + "/SendRequestForPlanner";
            return fetch(url, {
                method: "POST",
                headers:serviceUrl.headers,
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("response of reques", responseJson);
                    toastMsg('success', responseJson.message)
                    // this.props.navigation.navigate('Open');
                })
                .catch((error) => {
                    // console.error(error);
                    //toastMsg('danger', 'Sorry..something network error.Try again please.')
                });

        }

    }
    gotoprofile = async () => {
        debugger;
        var data1 = await AsyncStorage.getItem('PlannerUserId');
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: await AsyncStorage.getItem('PlannerUserId'),
        };
        const url = serviceUrl.been_url2 + "/OtherUserStatus";
        return fetch(url, {
            method: "POST",
            headers:serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.connectionstatus === "True") {
                    AsyncStorage.setItem('OtherUserId', data1);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                    AsyncStorage.setItem('OtherUserId', data1);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                    AsyncStorage.setItem('OtherUserId', data1);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }

                else if (responseJson.connectionstatus === "Mismatch") {
                    // this.props.navigation.navigate('Profile')
                    this.profileChanger();
                }
                else {
                    this.profileChanger();
                }
            })
            .catch((error) => {
            });
    }
    profileChanger = async () => {
        let local;
        // debugger;
        let businessProfile;
        var data = { userId: await AsyncStorage.getItem('userId') };
        const url = serviceUrl.been_url1 + '/UserProfile';
        const getType = await AsyncStorage.getItem('profileType');
        const pType = parseInt(getType);
        const localP = await AsyncStorage.getItem('localProfile');
        console.log('the ptype ', pType, ' and its type ', typeof pType);

        if (localP && localP == "Yes") {
            this.props.navigation.navigate('LocalUserProfile')
        } else if (pType === 2) {
            this.props.navigation.navigate('BusinessPlaceProfile')
        } else {
            console.log('the ptype ', pType, ' and its type profile1 ', typeof pType);
            this.props.navigation.navigate('Profile')
        }

    }
    isImagePicked = () => {
        const { imagesSelected } = this.state;
        console.log('imagese', imagesSelected);
        if (imagesSelected.length > 0) {
            return (
                <View style={{    width: deviceWidth, height: deviceHeight * 0.13, backgroundColor: 'rgba(0,0,0,.5)', bottom: 55, position: 'absolute', flexDirection: 'row',}}>
                    <View style={{ width: deviceWidth, height: deviceHeight * 0.13, flexDirection: 'row', justifyContent: 'center',alignItems: 'center', marginLeft: 5, marginRight: 5,}} >
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 5, paddingEnd: 5 }}>
                            {this.state.imagesSelected.length > 0 ? this.state.imagesSelected.map(i =>
                                <View key={i.uri}>{this.renderImage2(i)}

                                </View>) : null}
                        </ScrollView>
                    </View>

                </View>
            )
        }
    }
    async peopleGoing() {
        var data =
        {
            groupi: this.state.result._id
        }
        this.props.navigation.navigate('PeopleGoing', { data: data });
    }

    groupMedia = () => {
        const { gChatList, mediaCount } = this.state;
        const { navigation } = this.props;
        if (mediaCount == 0) return false;
        const attData = gChatList.length > 0 && gChatList.filter(m => m.attachments.length > 0);
        if (!attData || attData.length == 0) return false;

        navigation.navigate('PlannerMedia', { data: attData })

        // console.log('the g chatlist', attData);

    }

    ReqPeople() {
        var data = {
            group: this.state.result,
            chatGroupId: this.state.chatGroupId
        }
        this.props.navigation.navigate('RequestListAction', { data: data });
    }
    ReqPeople1() {
        var data = { group: this.state.result}
        this.props.navigation.navigate('RequestListAction', { data: data });
    }


    Edit() {
        this.setState({ visibleModal: null })
        var data = {
            result: this.state.result,
            MinPrice: parseInt(this.state.result.MinPrice),
            MaxPrice: parseInt(this.state.result.MaxPrice),
        }
        this.props.navigation.navigate('Edit', { data: data });
    }

    async finalise() {
        this.setState({ visibleModal: null })
        var OtherUserId = await AsyncStorage.getItem('OtherUserIdPlanner');
        var data = {
            groupId: OtherUserId,
            userId: this.state.AdminId
        };
        const url = serviceUrl.been_url1 + "/FinalizeGroup";
        return fetch(url, {
            method: "POST",
            headers:serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                //toastMsg('success', responseJson.message)
                this.details();
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    async leaveGroup() {
        this.setState({ visibleModal: null })
        var OtherUserId = await AsyncStorage.getItem('OtherUserIdPlanner');
        var data = {
            groupId: OtherUserId,
            userId: this.state.AdminId
        };
        const url = serviceUrl.been_url1 + "/LeaveTheGroup";
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
                //toastMsg('success', responseJson.message)
                this.details();
                this.props.navigation.navigate('Planner')
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    async deleteGroupApi() {
        this.setState({ visibleModal: null })
        var OtherUserId = await AsyncStorage.getItem('OtherUserIdPlanner');
        var data = { groupId: OtherUserId, userId: this.state.AdminId };
        const url = serviceUrl.been_url1 + "/DeleteGroup";
        return fetch(url, {
            method: "POST",
            headers:serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
               this.details();
            })
            .catch((error) => {
           });
    }

    onchangeText(text) {
        const { dialogCred } = this.state;
        //const { navigation } = this.props;
        let datas = this.props.route?.params?.datas || {};
        this.setState({ typedMessage: text})
        gch.onchangeText(text, datas.groupId)
    }

    sendMessage = () => {
        var imgStr = [];
        const { typedMessage, imagesSelected } = this.state
        const { navigation } = this.props;
        let datas = this.props.route?.params?.datas || {};

        if (typedMessage == '' && imagesSelected.length == 0) {
            return false;
        }
        const isImages = imagesSelected.length > 0 && imagesSelected.map(m => {
            this.gChat.sendMessage(typedMessage, datas.groupId, m)
        });
        if (!isImages) {
            this.gChat.sendMessage(typedMessage, datas.groupId)
        }
        this.setState({ typedMessage: '', imagesSelected: [], propMulti: false})
    }

    plannerText() {
        return <View style={{ flexDirection: 'column' }}>
            <Text style={{ textAlign: 'center', color: '#010101', fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font,marginTop:0 }}>{this.state.Title}</Text>
        </View>
    }

    toolBarRightIconView() {
        return <View >
            {this.state.MemberRes === "False" ?
                <Image
                    style={{ height: 20, width: 5, }} />
                : null}
            {this.state.AdminId === this.state.result.UserId || this.state.MemberRes === "True" ?
                <TouchableOpacity hitSlop={plannerStyles.touchView} onPress={() => { this.setState({ visibleModal: 1 }) }}>
                    <Image style={{ width: 15, height: 15, marginLeft: 'auto', marginRight: 'auto', }}
                        source={require('../../Assets/Images/3dots.png')}></Image>
                </TouchableOpacity>
                : null}
        </View>
    }

    renderImage(image) {
        // console.log('the picked images',image);
        return (
            <TouchableOpacity onPress={() => { }}>

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
        this.setState({
            photoPath: image.uri.replace("file:///", ''),
            photoPath1: image.uri
        })
    }
    imageUpload = async () => {
        // debugger;
        const { typedMessage, imagesSelected } = this.state
        const { navigation } = this.props;
        // let datas = navigation.getParam('datas');
        var datas = this.state.groupDatas;

        if (typedMessage == '' && imagesSelected.length == 0) {
            return false;
        }
        // if (typedMessage == '' || imagesSelected.length == 0) {
        //     return false;
        // }
        // console.log('asdasdasdas',typedMessage);
        this.gChat.sendMessage(typedMessage, datas.groupId, imagesSelected)
        this.setState({
            typedMessage: '',
            imagesSelected: []
        })
    };

    imageManipulte = () => {
        const prop = this.props.route?.params?.imgProp;
        if (prop == undefined) {
            return false;
        }
        console.log('image manipulate', prop.e[0].node.image.uri)
        if (prop.e && prop.e.length > 0) {
            this.setState({
                isModalVisible: false,
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
    location(){
        var data = {place_id:this.state.place_id, Location:this.state.Location, coords:this.state.coords}
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }

    renderRightImgdone() {
        return <View>
            {/* <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image source={require('../../Assets/Images/3dots.png')} resizeMode={'center'} style={{ width: 16, height: 16, marginTop: 6 }} />
            </TouchableOpacity> */}
            {this.state.MemberRes === "False" && this.state.AdminId != this.state.result.UserId ?
                <Image
                    style={{ height: 20, width: 5, }} />
                : null}
            {this.state.AdminId === this.state.result.UserId || this.state.MemberRes === "True" ?
                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ visibleModal: 1 }) }}>
                    <Image source={require('../../Assets/Images/3dots.png')} 
                       // resizeMode={'center'} 
                    style={{ width: 16, height: 16, }} />
                </TouchableOpacity>
                : null}
        </View>

    }

    msgOnfocus = () => {
        if (this.state.isHidden) {
            this.setState({
                isHidden: false
            })
        }
    }

    render() {
        const { groupDatas, mediaCount } = this.state;
        const keyboardVerticalOffset = Platform.OS === "ios" ? 5 : 0;
        let datas = this.props.route?.params?.datas || {};
        
        return (
            <KeyboardAvoidingView style={{ flex: 1 ,backgroundColor:'#fff'}}
            keyboardVerticalOffset={keyboardVerticalOffset} 
            behavior={Platform.OS === "ios" ? "padding" : null}
        >
            <View style={{ flex: 1, marginTop: 0 }}>
                {/* {this.state.albumData == 2 ?
                        <Toolbar {...this.props} icon={"Down"} centerTitle="Add Sub Albums" /> :
                        <Toolbar {...this.props} icon={"Down"} centerTitle="" rightImgView={this.renderRightImgdone()} />
                 } */}

                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                {/* <Toolbar {...this.props} centerTitleColumn={this.plannerText()} rightView={this.toolBarRightIconView()} /> */}
                <Toolbar {...this.props} centerTitleColumn={this.plannerText()} rightImgView={this.renderRightImgdone()} />


                {/* <ScrollView> */}
                <View style={{  width: '88%', marginLeft: 'auto', marginRight: 'auto', marginBottom: hp(3), backgroundColor: '#fff', borderWidth: .6, borderColor: '#c1c1c1', borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, }}>
                    <View style={{ margin: '5%', }}>
                        <View style={{ flexDirection: 'row', marginTop: '2%', marginLeft: 1, }}>

                            <TouchableOpacity  onPress={() => this.location()}   style={{ flexDirection: 'row', marginTop: '0%', marginLeft: 1, }} >
                                <Image source={require(imagepath1 + 'blackLocation.png')}
                                    style={{ height: 12, width: 12, marginTop: 9 }} />
                                <Text style={plannerStyles.locationText}>
                                    {this.state.Location}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={() => this.setState({ isHidden: !this.state.isHidden })} style={{ right: 0, position: 'absolute', }} >

                                <Image source={require('../../Assets/Images/backArrow.png')}
                                 //  resizeMode={'center'}
                                    style={{ width: 25, height: 25,transform: [{ rotate:   !this.state.isHidden ? '-90deg' : '90deg' }]}}
                                />

                            </TouchableOpacity>

                        </View>
                        <HASView hide={!this.state.isHidden}>
                            <View style={{ flexDirection: 'column', marginTop: '4%' }}>
                                <Text style={plannerStyles.travelHeader}>
                                    Travel Dates
                                 </Text>
                                <Text style={plannerStyles.dateText}>
                                    {this.state.TravelDates}
                                </Text>
                            </View>

                            <View style={{ backgroundColor: '#dcdee0', borderRadius: 10, marginTop: '4%' }}>
                                <View style={{ flexDirection: 'row', marginVertical: '5%', marginLeft: '2%' }}>
                                    <Text style={plannerStyles.budget}>
                                        Budget
                        </Text>
                                    <Text style={[plannerStyles.budgetcolon, { marginTop: -3 }]}>
                                        :
                        </Text>

                                    <Text style={plannerStyles.budgetText}>
                                        {this.state.Currency}.{this.state.MinPrice} - {this.state.MaxPrice}
                                    </Text>
                                </View>
                            </View>



                            <View style={{ width: '100%', marginTop: '5%' }}>
                                <ViewMoreText
                                    numberOfLines={3}
                                    renderViewMore={this.renderViewMore}
                                    renderViewLess={this.renderViewLess}
                                >
                                    <Text style={{ fontSize: Description.FontSize, fontFamily: profilename.Font }} >{this.state.Description}
                                    </Text>
                                </ViewMoreText>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: '5%', marginLeft: '2%' }}>
                                <TouchableOpacity onPress={() => this.gotoprofile()} style={{ flexDirection: 'row' }}>
                                    <Text style={plannerStyles.peopleGoing1}>By</Text>
                                    <Text style={[plannerStyles.peopleGoing2, { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, }]}>{this.state.Admin}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent: 'space-between', alignItems: 'center' }}>

                                {this.state.result.UserId === this.state.AdminId && this.state.result.GroupAs != "Fixed" ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <TouchableOpacity onPress={() => this.Invite()}>
                                                <Text style={{ color: '#3fe635', fontSize: Username.FontSize, fontFamily: Username.Font, marginLeft: 35, marginTop: '10%' }}>Invite</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {/* Rq List */}
                                        <View style={{ marginLeft: '27%' }}>
                                            <TouchableOpacity onPress={() => this.ReqPeople()}>
                                                <View style={{ backgroundColor: '#fb0043', height: 30, width: 140, alignItems: 'center', justifyContent: 'center', borderRadius: 9 }}>
                                                    <Text style={{ color: '#ffffff', fontSize: Username.FontSize, fontFamily: Username.Font, }}>Request</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    :

                                    this.state.MemberRes === "True" && this.state.result.GroupAs != "Fixed" ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                <Text style={{ color: '#3fe635', marginLeft: 35, fontSize: Username.FontSize, fontFamily: Username.Font, marginTop: '12%' }}>Invite</Text>
                                            </View>
                                            {/* Rq List */}
                                            <View style={{ marginLeft: '27%' }}>
                                                <TouchableOpacity onPress={() => this.ReqPeople1()}>
                                                    <View style={{ backgroundColor: '#fb0043', height: 30, width: 140, alignItems: 'center', justifyContent: 'center', borderRadius: 9 }}>
                                                        <Text style={{ color: '#ffffff', fontSize: Username.FontSize, fontFamily: Username.Font, }}>Request</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        :

                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ marginLeft: '27%', }}>
                                                {this.state.result.GroupAs != "Fixed" ?
                                                    <TouchableOpacity onPress={() => this.Invite1()}>
                                                        <View style={{ backgroundColor: '#fb0043', height: 30, width: 130, alignItems: 'center', justifyContent: 'center', borderRadius: 9 }}>
                                                            <Text style={{ color: '#ffffff', fontSize: Username.FontSize, fontFamily: Username.Font }}>Request</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <Text style={{ color: '#aed883', marginLeft: '72%', fontSize: Username.FontSize, fontFamily: Username.Font, }}>Finalised</Text>
                                                }
                                            </View>

                                        </View>
                                }
                            </View>
                        </HASView>
                    </View>


                    <Modal
                        isVisible={this.state.visibleModal === 1}
                        onBackdropPress={() => this.setState({ visibleModal: null })}
                        onBackButtonPress={() => this.setState({ visibleModal: null })}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        animationInTiming={600}
                        animationOutTiming={600}
                        backdropTransitionInTiming={600}
                        backdropTransitionOutTiming={600}
                    >
                        <View style={styles1.modalContent}>
                            <StatusBar backgroundColor="#4c4c4c" />
                            {/* <StatusBar translucent backgroundColor="grey" barStyle='light-content' /> */}
                            {this.state.AdminId === this.state.result.UserId && this.state.result.GroupAs != "Fixed" ?

                                <View style={{ marginTop: 15, }}>
                                    <TouchableOpacity onPress={() => this.Edit()}>
                                        <Text onPress={() => this.Edit()}  style={[styles1.modalText, {}]}>
                                            Edit Planner
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            : null}

                            {this.state.AdminId === this.state.result.UserId && this.state.result.GroupAs != "Fixed" ?
                                <View style={styles1.horizontalSeparator} />
                                : null}

                            {this.state.MemberRes === "True" && this.state.AdminId != this.state.result.UserId ?
                                <View style={{ marginTop: 7, }}>
                                    <TouchableOpacity onPress={() => this.leaveGroup()}>
                                        <Text onPress={() => this.leaveGroup()} style={[styles1.modalText, {}]}>
                                            Leave Group
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                : null}


                            {this.state.AdminId === this.state.result.UserId && this.state.result.GroupAs != "Fixed" ?
                                <View style={{ marginTop: 7, }}>
                                    <TouchableOpacity   onPress={() => this.finalise()} style={{ width: "100%" }} >
                                        <Text onPress={() => this.finalise()} style={[styles1.modalText, { color: '#87c57b', }]}>
                                            Finalise
                                        </Text>
                                    </TouchableOpacity>
                                </View> : null}

                            {this.state.AdminId === this.state.result.UserId && this.state.result.GroupAs != "Fixed" ?
                                <View style={styles1.horizontalSeparator} /> : null}


                            {this.state.AdminId === this.state.result.UserId ?
                                <View style={{ marginTop: 7, marginBottom: 15 }}>
                                    <TouchableOpacity onPress={() => this.deleteGroupApi()}  style={{ width: "100%" }}>
                                        <Text onPress={() => this.deleteGroupApi()} style={[styles1.modalText, { color: '#f5884f', }]}>
                                            Delete Group
                                        </Text>
                                    </TouchableOpacity>
                                </View> : null}



                        </View>
                    </Modal>

                    {/* Add Sub Album View Start */}
                    {this.state.propMulti == true ?
                        <Modal isVisible={this.state.propMulti}
                            onBackButtonPress={() => this.setState({ propMulti: false })}
                            style={{ margin: 0 }}>
                            <View style={{ flex: 1 }}>
                                {this.state.albumData == 1 ?
                                    (
                                        <ImageBackground style={{ width: '100%', height: hp('100%'), flex: 1, flexWrap: 'wrap' }}
                                            source={{ uri: this.state.photoPath1 }}
                                            resizeMode={'cover'}
                                        >

                                            <View style={{ backgroundColor: 'transparent', width: wp('100%'), height: '100%' }}>
                                                <View style={{ width: wp('15%'),marginTop:StatusBar.currentHeight }}>
                                                    <TouchableOpacity onPress={() => this.setState({ propMulti: false, imagesSelected: [] })}>
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
                                                    <View style={{ width: wp('100%'), height: hp('14%'), flexDirection: 'row', backgroundColor: '#00000070' }}>

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
                                        </ImageBackground>)

                                    :
                                    null
                                }
                            </View>
                        </Modal>
                        : null
                    }

                </View>
                {this.state.result.count != 0 ?
                    <View style={{ marginTop: -20 }}>
                        <View style={{ flexDirection: 'row',justifyContent: 'space-between',}}>
                            <TouchableOpacity onPress={() => this.peopleGoing()} style={{ padding: 10 }}>
                                <Text style={plannerStyles.peopleGoingopen}>{this.state.result.count} People going</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.groupMedia()} style={{ padding: 10 }}>
                                <Text onPress={() => this.groupMedia()} style={[plannerStyles.peopleGoingopen, {alignSelf: 'flex-end', marginRight: 35, color: '#0187d5',}]}>Media({mediaCount})</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    :
                    <View>
                        <Text style={{ color: '#39a0eb' }}></Text>
                    </View>
                }

                <GroupChat
                    ref={ref => this.gChat = ref}
                    userDetails={datas}
                />


                {/* view for picked images */}

                {/* {this.isImagePicked()} */}

                {/* End of picked images view */}
                {/* bottom view */}
                {/* <View style={{ flexDirection: 'row', backgroundColor: '#ff1c48', bottom: 0, position: 'absolute', width: wp('100%') }}> */}
                {/* <View style={{ width: wp('100%'), height: deviceHeight * 0.09, backgroundColor: '#00000000',marginBottom:'-5.5%' }}> */}
               
             
                <View style={{borderRadius: 10, marginLeft: 10, marginBottom: 5, flexDirection: 'row', bottom:0, backgroundColor: '#fb0143', position: 'absolute', width: wp('95%'), height: deviceHeight * 0.06,borderWidth: .5, borderColor: '#e1e1e1',}}>
                    <View style={{ marginLeft: '2%', textAlign: 'center', alignItems: 'center', justifyContent: 'center', }}>
                        {/* <TouchableWithoutFeedback onPress={this.toggleOpen}
                                disabled={this.state.imagesSelected.length > 0 ? true : false}> */}
                        <TouchableOpacity onPress={() => this.takeImage()} activeOpacity={0.5}>
                           {Platform.OS === 'ios' ?
                             <Image style={{width:30,height:30}}
                              source={require(imagePath + 'NF_add_post.png')}/>
                           :
                            <Icon
                                name={"plus-circle-outline"}
                                size={42}
                                color="rgb(255, 255, 255)"
                                type="material-community" />}
                            {/* <Image source={require('../../Assets/Images/messageAdd.png')} resizeMode={'stretch'} style={{ width: wp('10%'), height: hp('6%'), }} /> */}
                        </TouchableOpacity>
                    </View>

                
                    <TextInput
                        value={this.state.typedMessage}
                        placeholder={'Type message...'}
                        placeholderTextColor={'#ffffff'}
                        onChangeText={(text) => { this.onchangeText(text) }}
                        multiline={true}
                        autoCorrect={false}
                        onFocus={this.msgOnfocus}
                        
                        // flexWrap: 'wrap'
                        // onChangeText={(text) => { this.onchangeText(text) }}
                        theme={{ colors: { text: 'white', primary: '#fb0143', placeholder: '#ffffff' } }}
                        style={{ marginLeft: "2%", marginTop:'3%', width: '70%', backgroundColor: '#fb0143', color: '#ffffff', fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontLight}}></TextInput>


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
               
            </View>
            </KeyboardAvoidingView>
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
        fontFamily: Common_Color.fontBold
    },
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
    modalContent: { backgroundColor: "#FFF", borderRadius: 25, borderColor: "rgba(0, 0, 0, 0.1)", justifyContent: 'center', alignItems: 'center' },
    okayButtonText: {
        color: "#d12c5e",
        textAlign: "center",
        justifyContent: "center",
        fontSize: 25, fontWeight: 'bold', fontFamily: Common_Color.fontBold
    },
    background: {
        // backgroundColor: 'rgba(0,0,0,.3)',
        backgroundColor: '#00000000',
        position: 'absolute',
        width: 35,
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