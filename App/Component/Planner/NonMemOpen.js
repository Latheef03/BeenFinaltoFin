import React, { Component } from 'react';
import {
    View, Text, Image, FlatList, ToastAndroid, TouchableOpacity,
    ScrollView, Animated, TouchableWithoutFeedback, ImageBackground, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
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
export default class NonMemOpen extends Component {

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

            actionList: false,
            avatarSource: '',
            avatarSource1: '',
            imagesSelected: [],
            mediaCount: 0,
            gChatList: [],
            animation: new Animated.Value(0),
        }
    }
    async componentWillMount() {
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({
            AdminId: id1
        })

        this.details();
    }
    async componentDidMount() {
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({
            AdminId: id1
        })
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.details();
            }
        );
      
    }
    

    async details() {
       // debugger;
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
                    Admin: responseJson.result[0].Admin
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
            var data = {
                groupid: this.state.result._id,
                ownerId: this.state.result.UserId,
                userId: [userId],
                reqfrom: userId === this.state.result.UserId ? "Owner" : "User"
            };
            const url = serviceUrl.been_url1 + "/SendRequestForPlanner";
            return fetch(url, {
                method: "POST",
                headers:serviceUrl.headers,
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    toastMsg('success', responseJson.message)
                    this.details();
                    // this.props.navigation.navigate('Open');
                })
                .catch((error) => {
                    // console.error(error);
                    //toastMsg('danger', 'Sorry..something network error.Try again please.')
                });
    }
    async peopleGoing() {
        var OtherUserId = await AsyncStorage.getItem('OtherUserIdPlanner');
        var data ={ groupi: OtherUserId}
        this.props.navigation.navigate('PeopleGoing', { data: data });
    }
    ReqPeople() {
        var data = { group: this.state.result,chatGroupId: this.state.chatGroupId }
        this.props.navigation.navigate('RequestListAction', { data: data });
    }
    ReqPeople1() {
        var data = { group: this.state.result}
        this.props.navigation.navigate('RequestListAction', { data: data });
        // this.props.navigation.navigate('SendReqPeople');
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

    Edit() {
       // debugger;
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
        var data = { groupId: OtherUserId, userId: this.state.AdminId};
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
    toolBarRightIconView() {
        return <View >
            {this.state.MemberRes === "False" ?
                <Image
                    style={{ height: 20, width: 5, }} />
                : null}
        </View>
    }
    async  leaveGroup() {
        this.setState({ visibleModal: null })
        var OtherUserId = await AsyncStorage.getItem('OtherUserIdPlanner');
        var data = {
            groupId: OtherUserId,
            userId: this.state.AdminId
        };
        const url = serviceUrl.been_url1 + "/LeaveTheGroup";
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
    async  deleteGroup() {
        this.setState({ visibleModal: null })
        var OtherUserId = await AsyncStorage.getItem('OtherUserIdPlanner');
        var data = {
            groupId: OtherUserId,
            userId: this.state.AdminId
        };
        const url = serviceUrl.been_url1 + "/DeleteGroup";
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

    plannerText() {
        return <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: '#010101',fontFamily:Common_Color.fontBold }}>{this.state.Title}</Text>
            <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: 'normal', color: '#010101',fontFamily:Common_Color.fontBold }}>{this.state.Location}</Text>
        </View>
    }


    render() {
       
        return (
            <View style={{ flex: 1, }}>
                <StatusBar  backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitleColumn={this.plannerText()} rightView={this.toolBarRightIconView()} />


                {/* <ScrollView> */}
                <View style={{   width: '88%', marginLeft: 'auto', marginRight: 'auto', marginBottom: hp(3), backgroundColor: '#fff', borderWidth: .6, borderColor: '#c1c1c1', borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6,
                }}>
                    <View style={{ margin: '5%', }}>
                        <View style={{ flexDirection: 'row', marginTop: '2%', marginLeft: 1, }}>


                            <Image source={require(imagepath1 + 'blackLocation.png')}
                                style={{ height: 12, width: 12,marginTop:9  }} />
                            <Text style={plannerStyles.locationText}>
                                {/* <Text style={[plannerStyles.locationText,{fontSize: Common_Color.locationNameFontSize, fontFamily: Common_Color.fontMedium,marginTop:3}]}> */}
                                {this.state.Location}
                            </Text>

                            <TouchableOpacity
                                onPress={() => this.setState({ isHidden: !this.state.isHidden })}
                                style={{ right: 0, position: 'absolute', }} >

                                <Image source={require('../../Assets/Images/backArrow.png')}
                              //  resizeMode={'center'}
                                    style={{
                                        width: 25, height: 25,
                                        transform: [{
                                            rotate:
                                                !this.state.isHidden ? '-90deg' : '90deg'
                                        }]
                                    }}
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
                                    <Text style={[plannerStyles.budgetcolon, { marginTop: 0 }]}>
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

                            {/* <View style={{ marginVertical: '5%' }}>
                            <View style={{ width: '30%' }}>
                                <Text style={{maxLength:500}}>{this.state.Description}</Text>
                            </View>
                        </View> */}

                            <View style={{ flexDirection: 'row', marginTop: '5%', marginLeft: '2%' }}>
                            <TouchableOpacity onPress={() => this.gotoprofile()} style={{flexDirection:'row'}}>

                                <Text style={plannerStyles.peopleGoing1}>By</Text>
                                <Text style={[plannerStyles.peopleGoing2, { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, marginTop: 0.5 }]}>{this.state.Admin}</Text>
                           </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent: 'space-between', alignItems: 'center' }}>

                               

                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                {/* <View style={{ backgroundColor: 'green', height: 35, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}> */}
                                                <Text style={{ color: '#3fe635',  marginLeft: 35, fontSize: Username.FontSize, fontFamily: Username.Font }}></Text>
                                                {/* </View> */}
                                            </View>
                                            <View style={{ marginLeft: '48%', }}>
                                               
                                                    <TouchableOpacity onPress={() => this.Invite1()}>
                                                        <View style={{ backgroundColor: '#fb0043', height: 30, width: 130, alignItems: 'center', justifyContent: 'center', borderRadius: 9 }}>
                                                            <Text style={{ color: '#ffffff', fontSize: Username.FontSize, fontFamily: Username.Font }}>Request</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                
                                            </View>

                                        </View>
                                
                            </View>
                        </HASView>
                    </View>



                </View>
                {this.state.result.count != 0 ?
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', marginTop:'-3%'
                        }}>
                            <TouchableOpacity onPress={() => this.peopleGoing()}>
                                <Text style={plannerStyles.peopleGoingopen}>{this.state.result.count} People going</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => this.groupMedia()}>
                                <Text style={[plannerStyles.peopleGoingopen,{ alignSelf: 'flex-end', marginRight: 35, color: '#0187d5' }]}>Media({mediaCount})</Text>
                            </TouchableOpacity> */}

                        </View>
                        <View style={{
                            width: '70%', height: 0.8, backgroundColor: '#000',
                            alignSelf: 'center', marginTop: 8
                        }} />
                    </View>


                    :
                    <View>
                        <Text style={{ color: '#39a0eb' }}></Text>
                    </View>
                }
            </View>
        )
    }
}


const report = {

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
        backgroundColor: 'rgba(0,0,0,.3)',
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