
import React, { Component } from 'react';
import { View, Text, Image, FlatList, Platform, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import common_styles from "../../Assets/Styles/Common_Style"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Menu, Divider } from 'react-native-paper';
import ProfileFullView from './styles/profileFullView'
import ProfileChat from './styles/ProfileChat'
import ProfileCreate from './styles/ProfileCreate'
import searchList from './styles/searchList'
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import serviceUrl from '../../Assets/Script/Service';
import Common_Style from '../../Assets/Styles/Common_Style'
const imagepath = '../../Assets/Images/localProfile/';
const imagePath1 = '../../Assets/Images/';
import { Toolbar } from '../commoncomponent'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import styles1 from '../../styles/NewfeedImagePost';
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'

export default class LocalProfile5 extends Component {

    static navigationOptions = {
        header: null
    };


    constructor(prop) {
        super(prop);
        this.state = {
            modalVisible: false,
            masterData: '',
            OtherId: '',
            PlaceCount: '',
            HangOutCount: "",
            ratings: "",
            isModalVisible1: false,
            permission_Value: '',
            isvisibleModal: false,
            isModalVisible2: false,reqid:'',
            Default_Rating: 0,
            getStarRate: 4,
            overallReview: 0,
            ratingsOverall: 0,
            Max_Rating: 5,
        }
    }

    UNSAFE_componentWillMount() {
       console.log("Data is ",this.props)
       // debugger;
        const otherProfile = this.props.route.params.data.data;
        this.setState({ OtherId: otherProfile })
        console.log(this.state.OtherId)
        this.getApi();
    }
    componentDidMount = async () => {
       // debugger;
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                const otherProfile = this.props.route.params.data.data
                this.setState({ OtherId: otherProfile.data })
                console.log(this.state.OtherId)
                this.getApi();

            }
        );
    }

    async getApi() {
       // debugger;
        var data = {
            //  Userid: "5e219b53bd333366c1be32ec"
            Userid: await AsyncStorage.getItem('userId'),
            followedId: this.state.OtherId
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
                        masterData: responseJson.result,
                        reqid: responseJson.FollowReq.length === 0 ? '': responseJson.FollowReq[0]._id ,
                        PlaceCount: responseJson.places,
                        HangOutCount: responseJson.Hangout,
                        ratings: responseJson.Ratings
                    })
                    AsyncStorage.setItem('reqid', this.state.reqid);
                    console.log('response' + this.state.reqid)
                }
                else {


                    console.log('contain false')
                }

            })
            .catch((error) => {

                //toastMsg('danger', error + 'please check your internet and try again! ')
            });
    };

    async report() {
       
            var data = {
                Userid: await AsyncStorage.getItem('userId'),
                Otheruserid: this.state.OtherId,
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
                    this.setState({ isModalVisible1: false, isModalVisible2: true, permission_Value: '' })
                    //toastMsg('success', responseJson.message)

                })
                .catch((error) => {
                    // console.error(error);
                    //toastMsg('danger', 'Sorry..something network error.Try again please.')
                });
        
    };
    stars(val) {

        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= val; i++) {
            stars.push(( <Fontisto name="star" size={20} style={{marginLeft:4}} color="#fe9102" />));
        }
        return (stars)
    }

    messageScreen(data) {
        console.log('the chat user data is', data)
        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
        let chatUserId = data.ChatUserId;
        let userName = data.UserName;
        var data = { result: this.state.masterData, PlaceCount: this.state.PlaceCount, HangOutCount: this.state.HangOutCount, ratings: this.state.ratings }
        const chatUserData = { occupants_ids: chatUserId, name: userName }
        if (chatUserId == null && chatUserId == 'null' && chatUserId == undefined) {
            //toastMsg("danger","can't chat without the chat user id");
            return false;
        }

        this.props.navigation.navigate('LocalProfileChat', { data: data, chatUser: chatUserData })
    }
    async gotoprofile() {
       // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: this.state.OtherId
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
                if (responseJson.connectionstatus === "True") {
                    AsyncStorage.setItem('OtherUserId', this.state.OtherId);

                    var data = {        ProfileAs: responseJson.ProfileAs,
                                        LocalProf:'yes'}
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                    var data = {  ProfileAs: responseJson.ProfileAs,LocalProf:'yes' }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                    var data = {  ProfileAs: responseJson.ProfileAs,LocalProf:'yes' }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', this.state.OtherId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Mismatch") {
                  
                  }
                else {
                }
            })
            .catch((error) => {
            });
    }
    
  
    optionImg() {
        return (
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10, }} onPress={() => { this.setState({ modalVisible: true }) }}>
                <View style={{ width: '25%',  }}>
                          <Image source={require('../../Assets/Images/3dots.png')} 
                    //  resizeMode={'center'} 
                          style={{ width: 16, height: 16,}} />
                </View>
            </TouchableOpacity>
        )
    }
    _toggleModal12() {
       // debugger;
        if (this.state.permission_Value == "" || null || undefined) {
            toastMsg1('danger',"Please give a report")
           // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
        }
        else {
        this.setState({
            isModalVisible: null,
            isvisibleModal: null,
            //  permission_Value: "",
            isModalVisible1: !this.state.isModalVisible1
        });
        this.report();}
    }
    reportmodel = () =>{
            this.setState({
                modalVisible: false, 
              },()=>{
             setTimeout(()=>{
                  console.log("is called")
                  this.setState({
                    isModalVisible1: true
                  })
                },600)
              })
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
    back() {
        this.props.navigation.navigate('LocalProfileSearchList')
    }

    reviewScreen(data) {
        var data = {
            reviewData: data
        }
        this.props.navigation.navigate('LocalProfReview', { data: data })

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
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <ScrollView>

                <Toolbar {...this.props} centerTitle='' rightImgView={this.optionImg()} />
                    <View>
                        {this.state.masterData.length > 0 && this.state.masterData.map((data, index) => {
                            return (

                                <View key={index.toString()} >

                                    <View>
                                    <TouchableOpacity onPress={() =>this.gotoprofile()}>
                                        <View style={{ alignItems: 'center', marginTop: '1%', }}>
                                            {data.LocalProfilePic != null || "" ?
                                                <Image source={{ uri: serviceUrl.profilePic + data.LocalProfilePic }}
                                                    style={ProfileChat.profilePic} resizeMode={'cover'} />
                                                :
                                                <Image source={require(imagePath1 + 'profile.png')}
                                                    style={ProfileChat.profilePic} resizeMode={'cover'} />}
                                            <Text style={[ProfileChat.userName, { fontSize: Username.FontSize, fontFamily: Username.Font, }]}>
                                                {data.UserName && data.UserName === undefined || data.UserName && data.UserName === null || data.UserName && data.UserName === "" || data.UserName && data.UserName === "null" || data.UserName && data.UserName === "undefined" ? "" : data.UserName}</Text>

                                            <Text style={[ProfileChat.userName, { fontSize: Username.FontSize, fontFamily: Username.Font, }]}>
                                                {data.name && data.name === undefined || data.name && data.name === null || data.name && data.name === "" || data.name && data.name === "null" || data.name && data.name === "undefined" ? "" : data.name}</Text>

                                        </View>
                                        </TouchableOpacity>
                                        <View style={{ alignItems: 'center', }}>
                                            <Text style={[ProfileChat.userName, { fontSize: Description.FontSize, fontFamily: Description.Font }]}>'{data.tagline}'</Text>
                                            <View style={{ height: hp('10%') }}>
                                                <Text style={[ProfileChat.userName, { marginTop: '4%', fontSize: Description.FontSize, fontFamily: Description.Font }]}>{data.Description}</Text>
                                            </View>

                                        </View>
                                        <View style={{ margin: '5%' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                                <View style={ProfileFullView.View}>
                                                    <View>
                                                    <Text style={{ fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold}}>  {data.currenry} {data.PersonalTour} <Text style={{ fontSize: 4, }}>per hour </Text> </Text>
                                                    <Text style={[Common_Style.LpText, { fontSize: Username.FontSize, fontFamily: Username.Font, }]}>Personal Tour</Text>
                                                       
                                                    </View>
                                                    <View style={{ marginTop: '10%' }}>
                                                    <Text style={{ fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold }}>{data.currenry} {data.TourAdvice} </Text>
                                                    <Text style={[Common_Style.LpText, { fontSize: Username.FontSize, fontFamily: Username.Font, }]}>Tour Advice</Text>
                                                    </View>
                                                </View>
                                               
                                                <View style={[ProfileFullView.View, { marginTop: '-2%' }]}>
                                                    <Image source={require('../../Assets/Images/new/HangoutSpots.png')}
                                                        style={ProfileFullView.icons1} resizeMode={'contain'} />
                                                    <Text style={[Common_Style.LpText,{fontSize: Username.FontSize, }]}>{this.state.HangOutCount} Hangout Spots</Text>   
                                                </View>
                                            </View>

                                            <View style={ProfileFullView.wholeFlagView}>
                                                <View style={[ProfileFullView.View, { backgroundColor: '#f2f2f2' }]}>
                                                    <Image source={require('../../Assets/Images/new/Places.png')}
                                                        style={{ height: wp('18%'), width: hp('18%'), }} resizeMode={'contain'} />
                                                   <Text style={[Common_Style.LpText,{fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold}]}>{this.state.PlaceCount} Places</Text>
                                                </View>
                                                
                                                {/* Review for  others*/}
                                                <TouchableOpacity onPress={() => this.reviewScreen(data)}>
                                                <View style={[ProfileFullView.View]}>
                                                    {this.state.ratings.length > 0 && this.state.ratings.map((data) => (
                                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}>
                                                            
                                                            <Text style={[ProfileFullView.reviewCount, { fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold, }]}>
                                                                {data.avgRate === 0 ? 0 : Math.floor(data.avgRate)}
                                                            </Text>
                                                            
                                                            {data.avgRate <= 0 ?
                                                                <View style={{  flexDirection: 'row', marginTop:10, marginBottom: '4%', alignSelf: 'center'  }}>
                                                                    {getRevieStar}
                                                                </View> :
                                                            <View style={{ flexDirection: 'row', marginTop: '3%', marginBottom: '4%', alignSelf: 'center' }}>
                                                                {this.stars(data.avgRate)}
                                                            </View> }

                                                            <View style={{ flexDirection: 'row', marginTop: '4%' }}>
                                                                <Text style={[Common_Style.LpText, { fontSize: TitleHeader.FontSize, fontFamily:Common_Color.fontBold }]}>{data.Reviews === 0 ? 0 : data.Reviews} reviews</Text>
                                                            </View>
                                                        </View>))}
                                                </View>
                                            </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                   
                                      <View style={[common_styles.Common_button, { width: wp(96) ,margin:9}]}>
                                        <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                            borderRadius={10}
                                        >

                                            <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                                onPress={() => this.messageScreen(data)}>
                                                <Text style={common_styles.Common_btn_txt}>Message</Text>
                                            </TouchableOpacity>
                                        </ImageBackground>
                                    </View>
                                    <View style={[common_styles.Common_button, { width: wp(96) ,margin:15,height:36.5}]}>
                                            <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                                onPress={() =>this.gotoprofile()}>
                                                <Text style={[common_styles.Common_btn_txt,{color:'black'}]}>View Profile</Text>
                                            </TouchableOpacity>
                                       
                                    </View>
                                </View>
                            )
                        })}
                    </View>

                </ScrollView>
                <Modal onBackdropPress={() => this.setState({ modalVisible: false })}
                    onBackButtonPress={() => this.setState({ modalVisible: false })}
                    animationType='fade'
                    isVisible={this.state.modalVisible}
                >
                    <View style={styles1.modalContent}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View style={{ marginTop: 7, marginBottom: 15 }}>
                            <TouchableOpacity onPress={() => { this.reportmodel() }}>
                                <Text style={[styles1.modalText, { color: 'red' }]}>
                                    Report</Text>
                            </TouchableOpacity>
                        </View>
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

    parentView: { width: "100%", borderRadius: 15, backgroundColor: "white" },
    icon: { width: wp(8), height: hp(4.5), marginLeft: '45%', marginBottom: '5%', marginTop: '5%' },

    header: { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, marginTop: 10, textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#000', },
    // header: { marginTop: 10, fontSize: 24, textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#000', fontFamily: Common_Color.fontBold },
    subHeader: { marginTop: 15, fontSize: 12, textAlign: "center", alignSelf: "center", fontFamily: Common_Color.fontBold, color: '#959595' },
    contentView: { width: '95%', textAlign: "center", fontFamily: Common_Color.fontMedium },
    content: { marginTop: 10, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#9e9e9e' },

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

    contentTextInModalTwo: { marginTop: 20, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#010101', fontFamily: Common_Color.fontMedium },

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
    }





}