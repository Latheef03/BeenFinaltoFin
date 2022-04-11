import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ToastAndroid, ScrollView, Linking, Image, StatusBar, FlatList } from 'react-native';
import { Content, Card, CardItem, Body } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import { Container, Title, Button, Header, Toast, Badge, Left, Right, Tabs, Tab } from 'native-base';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import plannerStyles from '../Planner/styles/plannerStyles'
import Common_Style from '../../Assets/Styles/Common_Style'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const imagepath1 = '../../Assets/Images/localProfile/';
const imagepath = './images/';

var return1;
export default class GetSeachPlanner extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor() {
        super();
        this.state = {
            ongoingList: "",
            res: [], Title: "", Location: "", AdminId: "", ArrDAta: '',
            place_id: "",
            Location: "",
            coords: ""
        }
    }
    async UNSAFE_componentWillMount() {
        debugger;
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({
            AdminId: id1
        })
        const { navigation,route } = this.props;
        const Comments = route.params.data;
        this.setState({
            res: Comments.res,
        });

    }
    async componentDidMount() {
        var id1 = await AsyncStorage.getItem("userId");
        this.setState({ AdminId: id1 })
    }
    OngoingDetails(item) {
        console.log('item search',item)
        debugger;
        if (item.MemberRes === true) {
            AsyncStorage.setItem('OtherUserIdPlanner', item._id);
            this.props.navigation.navigate('Open');

        }
        else {
            AsyncStorage.setItem('OtherUserIdPlanner', item._id);
            this.props.navigation.navigate('NonMemOpen');
        }

    }
    location(dat) {
        debugger;
        var data = {
            place_id: dat.place_id,
            Location: dat.Location,
            coords: dat.coords
        }
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }

    search() {
        this.props.navigation.navigate('Search1');
    }
    create() {
        this.props.navigation.navigate('Create_group');
    }
    async peopleGoing(item) {
        var data =
        {
            groupi: item._id
        }
        this.props.navigation.navigate('PeopleGoing', { data: data });
    }

    reqCheck(item) {
        const { AdminId } = this.state;
        let items = item;
        const reqList = items.filter(m => m.RequestedUserId).map(({ RequestedUserId }) => ({ RequestedUserId }));
        var returns = '';
        reqList.length > 0 && reqList.map((d, i) => {
            return d.RequestedUserId == AdminId ?

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: '5%' }}>
                        <TouchableOpacity onPress={() => this.Request(item)}>
                            <View style={{ backgroundColor: '#4aaff0', height: 30, width: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{ color: '#ffffff' }}>Request Lists1</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View>
                        <TouchableOpacity>
                            <View style={{ backgroundColor: 'grey', height: 30, width: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{ color: '#ffffff' }}>Invite1</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: '5%' }}>
                        <TouchableOpacity onPress={() => this.Request(item)}>
                            <View style={{ backgroundColor: 'red', height: 30, width: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{ color: '#ffffff' }}>Request Lists2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <View style={{ backgroundColor: 'red', height: 30, width: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{ color: '#ffffff' }}>Invite2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
        })

    }
    async Request(dat) {
        var data = { group: dat }
        this.props.navigation.navigate('RequestListAction', { data: data });
    }
    async Invite(dat) {
        debugger;
        const { res } = this.state;
        var userId = await AsyncStorage.getItem('userId');
        if (userId === dat.UserId) {
            this.props.navigation.navigate('SendReqPeople');
        }
        else {
            var data = {
                groupid: dat._id,
                ownerId: dat.UserId,
                userId: [userId],
                reqfrom: userId === dat.UserId ? "Owner" : "User"
            };
            const url = serviceUrl.been_url1 + "/SendRequestForPlanner";
            console.log('thee', dat);
            dat.MemberRes = "member"
            const ind = res.findIndex(item => item.UserId == dat.UserId);
            res[ind] = dat
            this.setState({ res: res });
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
                    toastMsg('success', "Request has been sent")
                    if (responseJson.status == "True") {
                    } else {
                        dat.MemberRes = "notmember"
                        const ind = res.findIndex(item => item.UserId == dat.UserId);
                        res[ind] = dat
                        this.setState({ res: res });
                        toastMsg1('danger', "Request has not been sent")
                    }
                })
                .catch((error) => {
                    dat.MemberRes = "notmember"
                    const ind = res.findIndex(item => item.UserId == dat.UserId);
                    res[ind] = dat
                    this.setState({ res: res });
                    toastMsg1('danger', "Request has not been sent")
                });

        }
    }
    gotoprofile = async (data1) => {
        debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: data1.UserId
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
                    AsyncStorage.setItem('OtherUserId', data1.UserId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                    AsyncStorage.setItem('OtherUserId', data1.UserId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                    AsyncStorage.setItem('OtherUserId', data1.UserId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('reqIdForStatus', data1.reqId);
                        AsyncStorage.setItem('OtherUserId', data1.UserId);
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
    renderRightImgdone = () => {
        return (
            <View style={[stylesFromToolbar.leftIconContainer, { flexDirection: 'row', }]}>
                <View >
                    <Image resizeMode={'stretch'} style={{ width: 20, height: 20 }} />
                </View>
            </View>

        )
    }

    render() {
        return (
            <View style={[plannerStyles.parentView, { marginTop: 0 }]}>

                <Toolbar {...this.props} centerTitle="Search" rightImgView={this.renderRightImgdone()} />


                <StatusBar backgroundColor="#ffff" barStyle='dark-content' />
                <ScrollView>
                    <View style={{ margin: '5%', }}>
                        <FlatList
                            data={this.state.res}
                            extraData={this.state}
                            style={{ marginBottom: 15 }}
                            // ItemSeparatorComponent={this.seperator()}
                            renderItem={({ item }) => (
                                <View style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: hp(3), backgroundColor: '#fff', borderWidth: .6, borderColor: '#c1c1c1', borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, }}>
                                    <TouchableOpacity onPress={() => this.OngoingDetails(item)}>
                                        <View style={{ margin: '5%', }}>
                                            <View style={{ flexDirection: 'row', marginVertical: '2%', marginLeft: '2%', }}>
                                                <Text style={plannerStyles.placeText}>
                                                    {item.Title}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: -8, marginLeft: '2%', }}>
                                                <TouchableOpacity
                                                    onPress={() => this.location(item)}
                                                    style={{ flexDirection: 'row', marginTop: '0%', marginLeft: 1, }} >
                                                    <Image source={require(imagepath1 + 'blackLocation.png')}
                                                        style={{ height: 12, width: 12, marginTop: 9 }} />
                                                    <Text style={plannerStyles.locationText}>
                                                        {item.Location}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginTop: '3%', marginLeft: '2%', }}>
                                                <Text style={plannerStyles.travelHeader}>
                                                    Travel Dates
                                                </Text>
                                            </View>
                                            <View style={{ marginVertical: '2%', marginTop: 1, marginLeft: '2%', }}>
                                                <Text style={plannerStyles.dateText}>
                                                    {item.TravelDates}
                                                </Text>
                                            </View>
                                            <View style={{ backgroundColor: '#dfdfdf', borderRadius: 15, marginTop: '4%', height: 50 }}>
                                                <View style={{ flexDirection: 'row', marginVertical: '5%', marginLeft: '7%' }}>
                                                    <Text style={plannerStyles.budget}>
                                                        Budget
                                                    </Text>
                                                    <Text style={[plannerStyles.budgetcolon, { marginTop: -3 }]}>
                                                        :
                                                    </Text>

                                                    <Text style={plannerStyles.budgetText}>
                                                        {item.Currency}.{item.MinPrice} - {item.MaxPrice}
                                                    </Text>
                                                </View>
                                            </View>


                                            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: -30, marginLeft: '2%' }}>
                                                <TouchableOpacity onPress={() => this.gotoprofile(item)} style={{ flexDirection: 'row' }}>
                                                    <Text style={plannerStyles.peopleGoing1}>By</Text>
                                                    <Text style={plannerStyles.peopleGoing2}>{item.Admin}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginLeft: '2%', flexDirection: 'row', marginBottom: 5, marginTop: '7.5%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {item.count != 0 ?
                                                    <TouchableOpacity onPress={() => this.peopleGoing(item)}>
                                                        <View>
                                                            <Text style={plannerStyles.peopleGoing}>{item.count} People going</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <View>
                                                        <Text style={{ color: '#39a0eb' }}></Text>
                                                    </View>
                                                }
                                                <View>


                                                    <View style={{ marginLeft: '30%', marginTop: '1%'}}>
                                                        {item.UserId == this.state.AdminId || item.MemberRes == true ?
                                                            <View>
                                                                <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} ></Text>
                                                            </View>

                                                            :
                                                            item.MemberRes == "member" ?
                                                                <View style={[Common_Style.AcceptFollow, { paddingLeft: 3, paddingRight: 3, paddingTop: 3, paddingBottom: 3 }]}>
                                                                    <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Requested</Text>
                                                                </View>
                                                                :
                                                                <TouchableOpacity onPress={() => this.Invite(item)}>
                                                                 
                                                                    <View style={[Common_Style.AcceptFollow, { paddingLeft: 3, paddingRight: 3, paddingTop: 3, paddingBottom: 3 }]}>
                                                                        <Text style={{ textAlign: 'center', marginBottom: 'auto', color: '#fff' }} >Request</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                        }

                                                    </View>

                                                </View>
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={item => item.id}
                            horizontal={false}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}