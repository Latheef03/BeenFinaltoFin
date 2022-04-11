import React, { Component } from 'react';
import { View, Text, Image, ToastAndroid, FlatList, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { TextInput } from 'react-native-paper';
import styles1 from '../../styles/NewfeedImagePost';
const imagePath = '../../Assets/Images/'
import { Toolbar, FooterTabBarOthers } from '../commoncomponent'
import common_styles from "../../Assets/Styles/Common_Style"
import { postServiceP01 } from '../_services';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'


export default class PlaceReview extends Component {
    static navigationOptions = {
        header: null
    };

    constructor() {
        super();
        this.state = {
            descrition: '',
            placeId:"",
            userReviewALready: false,
            ownUserRating: '',
            ownUserPic: '',
            profilePicUser: '',
            UserIdComment: '',
            Default_Rating: 0,
            getStarRate: 4,
            overallReview: 0,
            ratingsOverall: 0,
            //To set the default Star Selected
            Max_Rating: 5,
            //To set the max number of Stars
            permission_Value: '',
            isModalVisible1: false, isVisible: false,
            isModalVisible2: false,
            isModalVisible3: false,
            isOpenBottomModal: false,
            getReviewList: [],
            getUserList: [],
            getpic: '',
            userReviews: '',
            otherUserId: '',
            screenName: ''

        };
    }

    componentWillMount() {
        const dataFromOtherScreen = this.props.route.params.data;
        console.log("Plac review from place ",dataFromOtherScreen)
        this.setState({
           placeId:dataFromOtherScreen.placeId,
           overallReview:dataFromOtherScreen.overallReview,
           ratingsOverall:dataFromOtherScreen.ratingsOverall,
           ownUserRating: dataFromOtherScreen.ownUserRating,
        })
        this.getReviews();
    }

    componentDidMount = async () => {
       // debugger;
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                //this.getReviews();
            }
        );
    }

    UpdateRating(key) {
        this.setState({ Default_Rating: key });
    }

    stars(count) {
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= count; i++) {
            stars.push(( <Fontisto name="star" size={30} style={{marginLeft:4}} color="#fe9102" />));
        }
        return (stars);
    }

    async getReviews() {
        debugger
        var id = await AsyncStorage.getItem("userId");
        var data = {
            Userid: id,
            Place_id: this.state.placeId
        };
        const url = serviceUrl.been_url1 + "/GetReviewForBPlace";
        fetch(url, {
            method: 'POST',
            headers: serviceUrl.headers,
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    console.log("Dat from post",responseJson)
                    this.setState({
                        userReviewALready: responseJson.Send == "True" ? true : false,
                        getReviewList: responseJson.GetReviews,
                        getpic: responseJson.UserDet[0].ProfilePic,
                        getUserList: responseJson.UserReview.reverse(),
                        ownUserRating: typeof responseJson.UserReview !== undefined && responseJson.UserReview.length > 0 ? responseJson.UserReview[0].Ratings : 0,
                        descrition: typeof responseJson.UserReview !== undefined && responseJson.UserReview.length > 0 ? responseJson.UserReview[0].Reviews : '',
                        //ratingsOverall: typeof responseJson.Avgratings !== undefined && responseJson.Avgratings.length > 0 ? responseJson.Avgratings[0].Reviews : 0
                    })
                }
                else {
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
    }

    async postReview() {
        debugger
        if (this.state.Default_Rating != "" || this.state.descrition != "") {
            var id = await AsyncStorage.getItem("userId");
            const { placeId,descrition,Default_Rating} = this.state;
            let apiname = 'PostReviewsAndRatingsForBusinessplace';
            let data = {
                Userid: id,
                Ratings: Default_Rating,
                Reviews: descrition,
                place_id: placeId,
            }
    
            postServiceP01(apiname, data)
                .then((responseJson) => {
                    console.log("Response for review checking", responseJson);
                    if (responseJson.status == "True") {
                        this.getReviews();
                    } else {
                    }
                }).catch(err => {
                    console.log(err);
                })
        }
        else {
            toastMsg1('danger', "Please give a rate and review")
            //ToastAndroid.show("Please give a rate and review", ToastAndroid.LONG)
        }
    }

    async remove() {
        debugger
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Place_id: this.state.placeId
        };
        const url = serviceUrl.been_url1 + "/DeleteReviewsAndRatingforBusinessplace";
        fetch(url, {
            method: 'POST',
            headers: serviceUrl.headers,
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    this.getReviews();
                }
            })
            .catch(function (error) {
                console.log("Catch Error", error);
            });
    }

    async OtheruserDashboard(item) {
       // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: item.UserId
        };
        const url = serviceUrl.been_url2 + "/OtherUserStatus";
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
                if (responseJson.connectionstatus === "True") {
                    AsyncStorage.setItem('OtherUserId', item.UserId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    this.props.navigation.navigate('OtherUserProfile', { data: data })
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('OtherUserId', item.UserId);
                    this.props.navigation.navigate('OtherUserProfile')
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('OtherUserId', item.UserId);
                    this.props.navigation.navigate('OtherUserProfile')
                }

                else if (responseJson.connectionstatus === "Mismatch") {
                    // this.props.navigation.navigate('Profile')
                    this.profileChanger();
                }
                else {
                    //toastMsg('success', responseJson.message)
                }
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
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

    async report() {
            var data = {
                Userid: await AsyncStorage.getItem('userId'),
                Otheruserid: this.state.otherUserId,
                Content: this.state.permission_Value
            };
            const url = serviceUrl.been_url1 + "/ReportLocalProfile";
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
                    this.setState({ isModalVisible1: false, isOpenBottomModal: false, isModalVisible2: true, permission_Value: '' })
                })
                .catch((error) => {
                    // console.error(error);
                });
    };

    openModal(item) {
        this.setState({
            Otheruserid: item.Userid,
            isOpenBottomModal: true
        })
    }

    _toggleModal12() {
       // debugger;
        if (this.state.permission_Value == "" || null || undefined) {
            toastMsg1('danger',"Please give a report")
           // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
        }
        else{
        this.setState({
            isOpenBottomModal: null,
            isModalVisible1: !this.state.isModalVisible1
        });
        this.report();
    }
    }
    _toggleModal1() {
        this.setState({
            permission_Value: "",
            isModalVisible1: !this.state.isModalVisible1,
            isModalVisible2: false,
            isModalVisible3: false,
            isOpenBottomModal: false,
        });
    }

    stars(count) {
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= count; i++) {
            stars.push((
                <Fontisto name="star" size={30} style={{marginLeft:4}} color="#fe9102" />
            ));}
        return (stars);
    }

    starsUser(userReview) {
        let starsUserReview = [];
        // Loop 5 times
        for (var i = 1; i <= userReview; i++) {
            starsUserReview.push((
                <Fontisto name="star" size={30} style={{marginLeft:4}} color="#fe9102" />
            ));
        }
        return (starsUserReview);
    }
    reportModal() {
        this.setState({ 
            isOpenBottomModal: false,
        },()=>{
            setTimeout(()=>{
                this.setState({
                    isModalVisible1: true 
                })
            },500)
        })
    }

    renderRightImgdone() {
        return <View>
            <View style={[stylesFromToolbar.leftIconContainer, { flexDirection: 'row', }]}>
                <View >
                    <Image style={{ width: 20, height: 20 }} />
                </View>
            </View>
        </View>
    }

    reviewScreen(data) {
        var data = {
            reviewData: data
        }
        this.props.navigation.navigate('LocalProfReview', { data: data })

    }

    render() {
        let reviewStar = [];
        let getRevieStar = [];
        //Array to hold the filled or empty Stars
        for (var i = 1; i <= this.state.Max_Rating; i++) {
            reviewStar.push(
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={i}
                    onPress={this.UpdateRating.bind(this, i)}>
                   {i <= this.state.Default_Rating ? 
                   //Filled Star icon
                      <Fontisto name="star" size={30} style={{marginLeft:4}} color="#fe9102" />
                        : 
                    <Feather name="star" size={30} style={{marginLeft:4}} color="#fe9102" />}
                </TouchableOpacity>
            );
        }

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
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle='Reviews' rightImgView={this.renderRightImgdone()} />
                <ScrollView scrollEnabled={true}>
                                        
                        {/* Second View Star and Rating text */}
                        <View style={{ flexDirection: 'row', justifyContent:'space-around',marginLeft:10, marginBottom: 60 }}>
                           {this.state.overallReview === 0?
                                <View style={{  flexDirection: 'row',marginTop:10, justifyContent: 'center', alignContent: 'center' }}>
                                   {getRevieStar} 
                                 </View> :
                            <View style={{  flexDirection: 'row',marginTop:10, justifyContent: 'center', alignContent: 'center' }}>
                                {this.stars(this.state.overallReview)}
                            </View>}
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignContent:'flex-end', }}>
                                <Text style={[styles.ratingText, { width: 80, height: 38, fontFamily: Searchresult.Font, fontSize: Searchresult.FontSize,textAlign:'center' }]}>  {this.state.overallReview}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.reviewText, { marginTop: -10, fontFamily: Common_Color.fontRegular, fontSize: Searchresult.FontSize, textAlign:'center'}]}>({this.state.ratingsOverall} ratings)</Text>
                                </View>
                            </View>
                        </View>


                        <View styl={styles.middleView}>
                            <Text style={[styles.rateText, { marginTop: '7%', }]}>Rate and review</Text>
                            {this.state.getpic != null || "" ?
                                <ImageBackground borderRadius={50} source={{ uri: serviceUrl.profilePic + this.state.getpic }}
                                    style={[Common_Style.avatarProfile, { alignContent: 'center', alignSelf: 'center' }]} />
                                :
                                <ImageBackground borderRadius={50} source={require(imagePath + 'profile.png')}
                                    style={[Common_Style.avatarProfile, { alignContent: 'center', alignSelf: 'center' }]} />
                            }
                         
                            {this.state.userReviewALready != true?
                                (<View style={{ marginTop: '-3%', }}>
                                    <View style={[styles.childView, { marginTop: '6.5%', }]}>{reviewStar}</View>
                                    <View style={{ marginTop: '3%' }}>

                                        <TextInput
                                            label=" Review"
                                            placeholderStyle={{ fontSize: profilename.FontSize, fontFamily: profilename.Font, color: 'red' }}
                                            mode="outlined" gnb
                                            multiline={true}
                                            maxLength={500}
                                            autoCorrect={false}
                                            
                                            onChangeText={(text) => { this.setState({ descrition: text }) }}
                                            value={this.state.descrition}
                                            style={[common_styles.textInputSignUp, { width: '95%' }]}
                                            selectionColor={'#f0275d'}
                                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5, fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontLight } }} />

                                    </View>
                                    <View style={[common_styles.Common_button, { width: wp(96), margin: 10 }]}>
                                        <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                            borderRadius={10}  >

                                            <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                                onPress={() => this.postReview()}>
                                                <Text style={common_styles.Common_btn_txt}>Submit</Text>
                                            </TouchableOpacity>
                                        </ImageBackground>
                                    </View>
                                </View>) :
                                (<View style={{ marginTop: '3%', marginBottom: 3 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginBottom: '20%', }}>
                                        {this.starsUser(this.state.ownUserRating)}
                                    </View>
                                    <Text style={[styles.rateText, { width: wp(90), alignSelf: 'center', alignItems: 'center', marginTop: '-5%' }]}>{this.state.descrition}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>

                                        <View style={{ borderWidth: 0.5, borderRadius: 5, paddingLeft: 30, paddingRight: 30, paddingTop: 3, paddingBottom: 3, borderColor: '#4f4f4f', }}>
                                            <TouchableOpacity onPress={() => this.setState({ userReviewALready: false })}>
                                                <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#4f4f4f' }} >Edit</Text>
                                            </TouchableOpacity>

                                        </View>
                                       
                                        <View style={{ borderRadius: 5, paddingLeft: 13, paddingRight: 13, paddingTop: 3, paddingBottom: 3, backgroundColor: '#fb0042', }}>
                                            <TouchableOpacity onPress={() => this.remove()}>
                                                <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Remove</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>)}
                            
                       
                        {this.state.getReviewList.length > 0 ?
                            <FlatList
                                style={{ marginBottom: 20 }}
                                data={this.state.getReviewList}
                                ItemSeparatorComponent={this.FlatListItemSeparator}
                                renderItem={({ item }) => (
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', margin: 10 }}>
                                        <View>
                                            <TouchableOpacity onPress={() => this.OtheruserDashboard(item)}>
                                                {item.VerificationRequest === "Approved" ? (
                                                    <View style={[Common_Style.mediumAvatar, { marginTop: 8 }]}>
                                                        {item.ProfilePic == undefined || null ? (
                                                            <View >
                                                                <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'} borderRadius={50}
                                                                    source={require(imagePath + 'profile.png')}>
                                                                    <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                                                </ImageBackground>
                                                            </View>)
                                                            : (
                                                                <View>
                                                                    <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'} borderRadius={50}
                                                                        source={{ uri: serviceUrl.profilePic + item.ProfilePic }}>
                                                                        <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImagesmall} />
                                                                    </ImageBackground>
                                                                </View>
                                                            )}
                                                    </View>
                                                ) :
                                                    (<View style={Common_Style.mediumAvatar}>
                                                        {item.ProfilePic == undefined || null ?
                                                            <Image style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                                                source={require(imagePath + 'profile.png')}></Image>
                                                            :
                                                            <Image style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                                                source={{ uri: serviceUrl.profilePic + item.ProfilePic }} />}
                                                    </View>)}
                                            </TouchableOpacity>
                                        </View>


                                        <View style={{ width: wp(80), }}>
                                            <Text style={[Common_Style.userName, { marginLeft: 10, marginTop: 10 }]}>{item.UserName}
                                                <Text style={[Common_Style.userName, { fontFamily: Common_Color.fontMedium, color: '#858585' }]}>  {item.Reviews}</Text></Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.openModal(item)}>
                                            <Image style={{ width: 20, height: 22, marginTop: 12, marginLeft: 4 }} source={
                                                require('../../Assets/Images/Ellipse.png')}></Image>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />

                            :
                            <View
                                style={{
                                    flex: 1, flexDirection: "column", justifyContent: "center",
                                    alignItems: "center", marginTop: '20%'
                                }} >
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: 50, width: 50, }} />
                                <Text style={{ fontSize: 12,  color: '#000', fontFamily: Common_Color.fontLight }}>No Reviews yet!</Text>
                            </View>
                           
                        }

                        <Modal
                            isVisible={this.state.isOpenBottomModal}
                            onBackdropPress={() => this.setState({ isOpenBottomModal: null })}
                            onBackButtonPress={() => this.setState({ isOpenBottomModal: null })}
                            animationIn="zoomInDown"
                            animationOut="zoomOutUp"
                        >
                            <View style={styles1.modalContent}>
                                <StatusBar backgroundColor="#4b4b4b" barStyle="light-content" />
                                <TouchableOpacity onPress={() => this.setState({ isOpenBottomModal: null, isModalVisible1: true })} style={{ width: '100%' }}>
                                    <View style={{ marginTop: 7, marginBottom: 15 }}>
                                        <Text onPress={() => this.reportModal()} style={[styles1.modalText, { color: '#e45d1b' }]}>
                                            Report
                </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </Modal>

                        {/* Report models */}
                        <Modal isVisible={this.state.isModalVisible1}
                            onBackdropPress={() => this.setState({ isModalVisible1: null })}
                            onBackButtonPress={() => this.setState({ isModalVisible1: null })} >
                            <View style={Common_Style.parentViewReport} >
                                <StatusBar backgroundColor="#4b4b4b" barStyle="light-content" />
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
                                    label=" Type here"
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
                                <StatusBar backgroundColor="#4b4b4b" barStyle="light-content" />
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

                              
                                <View style={Common_Style.TokayButton}>
                                    <TouchableOpacity onPress={() => this.setState({ isModalVisible2: false })} activeOpacity={1.5} >
                                        <Text onPress={() => this.setState({ isModalVisible2: false })} style={Common_Style.TokayButtonText}>
                                            Okay
                </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>


                    </View>
                </ScrollView>
            </View>

        )
    }

}

const styles = {
    View: { borderColor: 'lightgray', borderWidth: 0, borderRadius: 20, alignItems: 'center', justifyContent: 'center', height: 120, width: 150 },
    buttonText: { textAlign: 'center', marginBottom: 'auto', color: '#4A4A4A', fontSize: 14, fontFamily: Common_Color.fontMedium },
    StarImage: { width: 35, height: 35, borderWidth: .6, resizeMode: 'cover', },
    childView: { justifyContent: 'center', flexDirection: 'row', marginTop: 30, },
    reviewText: { fontSize: 18, color: '#010101', margin: 5, fontFamily: Common_Color.fontRegular, },
    rateText: { fontSize: 16, textAlign: 'center', color: '#010101', marginTop: 8, marginBottom: 8, fontFamily: Common_Color.fontLight, },
    middleView: { alignItems: 'center', alignContent: 'center', alignSelf: 'center' },
    star: { height: hp(3), width: wp(5), fontFamily: Common_Color.fontMedium },
    hasNoMem: { justifyContent: 'center', alignItems: 'center', },
    ratingText: { fontSize: 36, color: '#000', fontFamily: Common_Color.fontBold, textAlign: 'center' }
}