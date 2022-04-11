import React, { Component } from 'react'
import { View, Text, ImageBackground, Image, Dimensions, TouchableOpacity, ToastAndroid, Animated } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaggedPostStyle from './styles/TaggedPostStyle';
import { TextInput } from 'react-native-gesture-handler';
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
import { DatePickerDialog } from "react-native-datepicker-dialog";
import moment from "moment";
import toastMsg, { toastMsg1 } from "../../Assets/Script/Helper"
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import ViewMoreText from 'react-native-view-more-text';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import ParsedText from 'react-native-parsed-text';
const { width, height } = Dimensions.get("window");
import { deviceHeight, deviceWidth } from '../../Component/_utils/CommonUtils'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const imagePath = '../../Assets/Images/'
export default class PromoteParticular extends Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            newsFeedData: '',
            visibleModal: null,
            profilePic: '',
            verification_Request: "",
            id: '',
            userName: '',
            location: '',
            userImage: '',
            move: true,
            country: '',
            dobFmt: "",
            dobDate: null,
            PostImage: '',
            description: '',
            likeCount: '',
            bookmarkCount: '',
            commentCount: '',
            PostId: '',
            //Video
            volume: 0,
        }
        this.scrollY = new Animated.Value(0);
        this.diffClamp = Animated.diffClamp(this.scrollY, 0, 60)
    }

    state = {
        text: "DOB"
    };

    UNSAFE_componentWillMount() {
        debugger
        const Comments = this.props.route.params.data
        this.setState({
            profilePic: Comments.ProfilePic,
            verification_Request: Comments.VerificationRequest,
            userName: Comments.UserName,
            PostId: Comments._id,
            location: Comments.Location,
            country: Comments.Country,
            PostImage: Comments.NewsFeedPost,
            description: typeof Comments.Desc && Comments.Desc.length > 0 ? Comments.Desc[0].desc == undefined ? "" : Comments.Desc[0].desc : null,
            likeCount: Comments.likecount,
            bookmarkCount: Comments.Bookmarkcount,
            commentCount: Comments.Commentcount,
        })

    }


    dobFmt = text => {
        this.setState({ dobFmt: text });
    };


    onDOBPress = (optionNo) => {

        //To open the dialog
        if (optionNo == 1) {
            this.refs.dobDialog.open({
                date: new Date(),
                minDate: new Date(),
                maxDate: new Date("2120") //To restirct future date
            });
        }
        else {
            this.refs.dobDialog1.open({
                date: new Date(),
                minDate: new Date(),
                maxDate: new Date("2120") //To restirct future date
            });
        }

        this.setState({
            dateOption: optionNo
        })
    };


    onDOBDatePicked = (date, fromDate) => {
        if (date == 'from') {
            this.setState({
                newFromDate: fromDate,
                FromDate: moment(fromDate).format("DD-MM-YYYY")
            });
        }
    };


    renderViewMore(onPress) {
        return (
            <Text onPress={onPress} style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }}>View more</Text>)

    }
    renderViewLess(onPress) {
        return (
            <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }} onPress={onPress} >View Less</Text>)
            // <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}></Text>)
    }


    promotePost = async () => {
        debugger
        console.log("Date from", this.state.FromDate)

        if (this.state.FromDate == undefined) {
            toastMsg1('danger', "Please Select timeline")
            //ToastAndroid.show("Please Select timeline", ToastAndroid.LONG);
        }
        else
            var data = {
                userId: await AsyncStorage.getItem('userId'),
                feedId: this.state.PostId,
                timeline: this.state.FromDate == "undefined" || null ? "" : this.state.FromDate
            }
        const url = serviceUrl.been_url1 + "/PromoteInBusinessProfile"
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    this.props.navigation.navigate('MyPager');
                }
                else {
                    toastMsg1('danger', responseJson.message)
                    //ToastAndroid.show(responseJson.message, ToastAndroid.LONG);
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    renderRightImgdone() {
        return <View style={[stylesFromToolbar.leftIconContainer]}>
            <View >
                <Image style={{ width: 20, height: 20 }} />
            </View>
        </View>
    }

    render() {
        const translateY = this.diffClamp.interpolate({
            inputRange: [0, 55],
            outputRange: [0, 60]
        });
        return (
            <View style={{ marginTop:0,flex: 1, flexDirection: 'column', backgroundColor: '#fff', }}>
              <Toolbar {...this.props} centerTitle="Promote" rightImgView={this.renderRightImgdone()} />
                 <TouchableOpacity onPress={this.onDOBPress.bind(this, 1)}>
                   <View style={{ width: wp('94%'), height: hp('7%'), flexDirection: 'row', borderWidth: 0.5, borderRadius: 10, marginLeft: wp('3%'), marginTop: hp('2%') }}>
                        {/* <Text style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', width: wp('85%'), color: '#868686' }}>Select Timeline</Text> */}
                        <TextInput
                            style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', width: wp('85%'), color: '#868686', fontFamily: Common_Color.fontMedium }}
                            placeholder="       Select Timeline"
                            placeholderTextColor="#868686"
                            editable={false}
                            autoCorrect={false}
                          //  //  keyboardType="visible-password"
                            value={this.state.FromDate}
                            // value={this.state.dobFmt}
                            onChangeText={this.onDOBDatePicked} />

                        <Image source={require('../../Assets/Images/BussinesIcons/calendar.png')} style={{ width: wp('6%'), height: hp('4%'), marginTop: 'auto', marginBottom: 'auto' }} 
                        resizeMode={'stretch'} 
                        />
                        <DatePickerDialog
                            ref="dobDialog"
                            onDatePicked={this.onDOBDatePicked.bind(this, 'from')}
                        />
                    </View>
                </TouchableOpacity>


                <View style={[styles.card, { marginTop: 10,}]}>
                    <View style={[styles.cardView,]}>

                        <View style={{ flexDirection: 'row', width: '100%', }} >
                            <View style={{ width: '10%' }} />
                            <View style={{ marginTop: '2%', width: '80%' }}>
                                <Text style={[Common_Style.cardViewLocationText]}>{this.state.location}</Text>
                                <Text style={[Common_Style.cardViewLocationText, { marginBottom: 8 }]}>{this.state.location}</Text>
                            </View>

                            <View style={{ marginTop: '4%', width: '10%' }}>
                                <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }}>
                                    <Image style={styles.threeDotsImage}
                                //    resizeMode={'center'} 
                                     source={require('../../Assets/Images/3dots.png')}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ height: hp('52%'), width: '95%', backgroundColor: 'grey',marginLeft:10,
                           overflow: 'hidden', borderRadius: 15, backgroundColor: '#fff', shadowColor: "#000", 
                           shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, }} >
                            {this.state.PostImage.indexOf(".mp4") != -1 ?
                                <View style={{ width: "100%", flex: 1 }}>
                                    <Video
                                        resizeMode="cover"
                                        source={{ uri: serviceUrl.newsFeddStoriesUrl + this.state.PostImage }}
                                        paused={this.state.paused ? true : false}
                                        repeat={true}
                                        controls={false}
                                        resizeMode='cover'
                                        style={{ width: wp('90%'), height: '100%', marginTop: 4, overflow: 'hidden', borderRadius: 15, backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, }}
                                        volume={this.state.volume}>
                                    </Video>
                                </View>
                                :
                                this.state.PostImage == null ?
                                  <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../../Assets/Images/story2.jpg')}>
                                        <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%', }}>
                                            <View style={{ width: '87%', }}></View><View style={{ width: '12%', height: 28, backgroundColor: '#0a3174', borderRadius: 20 }}>
                                                <Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} source={require('../../Assets/Images/camera1.png')} ></Image>
                                            </View>
                                        </View>
                                    </ImageBackground> :
                                    this.state.PostImage.split(',').length > 1 ?
                                        // <TouchableOpacity activeOpacity={1} onPress={() => this.imageModal(d)} >
                                        <ImageBackground style={{ width: '100%', height: '100%',backgroundColor: 'plum', }}
                                            source={{ uri: serviceUrl.newsFeddStoriesUrl + this.state.PostImage.split(',')[0] }}
                                            >
                                            <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
                                                <View style={{ width: '88%', }}></View><View>
                                                    <Image style={{ width: wp(10), height: hp(4), marginTop: '3%' }}
                                                        source={require('../../Assets/Images/MULTIPIC.png')}>
                                                    </Image></View>
                                            </View>
                                        </ImageBackground>
                                        // </TouchableOpacity>
                                        :
                                        <ImageBackground style={{ width: '100%', height: '100%',alignSelf: 'center', }}
                                            source={{ uri: serviceUrl.newsFeddStoriesUrl + this.state.PostImage.split(',')[0] }}
                                            >
                                            <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
                                                <View style={{ width: '87%', }}></View><View>
                                                    <Image style={{ width: wp(5), height: hp(2.5), marginTop: '7%' }} ></Image></View>
                                            </View>
                                        </ImageBackground>
                            }
                        </View>


                        <View style={{ flexDirection: 'row', marginTop: '5%', marginLeft: '2%' }}>
                            <View style={{ width: '85%' }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={styles.profileImage}>

                                        {this.state.verification_Request === "Approved" ? (
                                            <ImageBackground style={[Common_Style.mediumAvatar, { marginTop: 2 }]} borderRadius={50}
                                                source={{ uri: serviceUrl.profilePic + data.ProfilePic }}>
                                                <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImagesmall} />
                                            </ImageBackground>) :
                                            
                                        this.state.profilePic != null || undefined ?
                                            <Image style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                            source={{ uri: profilePic + this.state.profilePic }}>
                                        </Image> :
                                            <Image style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                            source={require('../../Assets/Images/profile.png')}>
                                        </Image>
                                      }
                                    </View>

                                    <View style={{ width: '80%', }}>
                                        <Text style={styles.userName}>{this.state.userName}</Text></View>
                                </View>
                                <View style={{ width: '75%', height: 'auto', marginTop: -2, marginBottom: 0, marginLeft: '12%', }}>
                                    <ViewMoreText
                                        numberOfLines={2}
                                        renderViewMore={this.renderViewMore}
                                        renderViewLess={this.renderViewLess}
                                        style={{ textAlign: 'center', marginBottom: '1.5%' }}
                                    >
                                        <ParsedText style={Common_Style.descriptionText}
                                            parse={[{ pattern: /#(\w+)/, style: Common_Style.hashtagColor },]}>
                                            {this.state.description === "null" ? null : this.state.description}
                                        </ParsedText>
                                    </ViewMoreText>
                                    {/* <Text style={{ color: '#67b6ee', textAlign: 'left' }}> {data.Description === "null" ? null : data.Description}</Text> */}
                                </View>

                            </View>

                            <View style={{ width: '100%', height: 80, justifyContent: 'space-evenly', marginRight: '100%' }}>
                                {/* Like  */}
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ width: 25, height: 25 }}>
                                        <TouchableOpacity>
                                            <Image style={{ width: '100%', height: '100%', }} resizeMode={'stretch'} source={
                                                require('../../Assets/Images/new/likeBlack.png')}></Image>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[Common_Style.countFont, { marginLeft: 8, marginTop: 7 }]} >
                                        {this.state.likecount != null ? this.state.likeCount : 0}
                                    </Text>
                                </View>

                                {/* Comment  */}
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ width: 25, height: 25 }}>
                                        <TouchableOpacity >
                                            <Image style={{ width: '100%', height: '100%', }} resizeMode={'stretch'}
                                                source={require('../../Assets/Images/new/commentBlack.png')} resizeMode={'stretch'}></Image>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[Common_Style.countFont, { marginLeft: 8, marginTop: 7 }]} >
                                        {this.state.commentCount != null ? this.state.commentCount : 0}
                                    </Text>
                                </View>
                            </View>
                        </View  >

                    </View>
                </View>

                <Animated.View style={{
                    width: '100%', height: 45, bottom: 0, position: 'absolute',
                    overflow: 'hidden', zIndex: 100, justifyContent: 'center', alignSelf: 'center',
                   transform: [{ translateY: translateY, }]
                }}>
                    <Text onPress={() => this.promotePost()} style={styles.flyit}>Promote</Text>
                </Animated.View>
            </View>
        )
    }

}

const styles = {
    imageBackGroundView: {
        width: '100%', height: deviceHeight * .54, backgroundColor: 'grey', overflow: 'hidden', borderRadius: 15, backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6,
    },
    back_icon: { width: wp('6%'), height: hp('4%') },
    Body: { textAlign: 'center', color: '#000', fontWeight: 'bold', marginLeft: wp('20%') },
    flyit: { color: '#3b9fe8', fontFamily: Common_Color.fontBold, fontSize: 20, textAlign: 'center' },


    card: { width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: 1, backgroundColor: '#fff', borderWidth: .6, borderColor: '#c1c1c1', borderRadius: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, },
    cardImage: { width: width * .84, marginLeft: 'auto', marginRight: 'auto', height: 'auto', },

    cardImage: { width: width * .96, marginLeft: 'auto', marginRight: 'auto', height: 'auto', },
    locationView: { marginTop: '2%', width: wp('88%'), },
    locationViewText: { fontSize: TitleHeader.FontSize, textAlign: 'center', fontFamily: TitleHeader.Font },
    threeDotsImage: { width: 16, height: 16, marginLeft: 'auto', marginRight: 'auto', },
    postImage: {
        width: '100%',
        height: deviceHeight * .54, backgroundColor: 'grey',
        overflow: 'hidden', borderRadius: 15,
        backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6,
    },
    cameraImage: { width: wp(10), height: hp(4), marginTop: '7%' },
    profileImage: { width: 25, height: 25, borderRadius: 25 / 2, backgroundColor: 'grey' },
    userName: { width: '80%', marginLeft: '5%', marginTop: 5, fontFamily: Username.Font, fontSize: Username.FontSize },
    description: { width: '80%', height: 70, marginTop: '10%', },
    likeicon: { width: wp(5), height: hp(3), },
    commentIcon: { width: wp(5), height: hp(3), marginTop: '20%' },
    bookmarkIcon: { width: wp(4.5), height: hp(3), marginTop: '20%', },
    // countText:{ fontSize: 10, textAlign: 'center' },
    textCount: { fontSize: 10, textAlign: 'center' }

}