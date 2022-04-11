import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ImageBackground, Linking, Image, TextInput, FlatList } from 'react-native';
import { Content, Card, CardItem, Body } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import plannerStyles from './styles/plannerStyles';
import common_styles from "../../Assets/Styles/Common_Style"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'

const imagepath = '../../Assets/Images/localProfile/';

export default class Requests_List extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor() {
    super();
    this.state = {
      reqList: [], AdminId: "",
      place_id:"",
      Location:"",
      coords:""
    }
  }
  async componentWillMount() {
    // debugger;
    var id1 = await AsyncStorage.getItem("userId");
    this.setState({
      AdminId: id1
    })
    this.ReqList();
  }
  async componentDidMount() {
    var id1 = await AsyncStorage.getItem("userId");
    this.setState({
      AdminId: id1
    })
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.ReqList();
      }
    );
  }
  location(dat){
    debugger;
    var data = {
        place_id:dat.place_id,
        Location:dat.Location,
        coords:dat.coords,
    }
    this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
}

  async peopleGoing(item) {
    var data =
    {
      groupi: item._id
    }
    this.props.navigation.navigate('PeopleGoing', { data: data });
  }
  async ReqList() {
    // debugger;
    // var id1 = await AsyncStorage.getItem("_id");

    var data = {
      userId: this.state.AdminId,
    };
    const url = serviceUrl.been_url1 + "/ReqList";
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('response for req list', responseJson)
        if (responseJson.status === "True") {
          this.setState({
            reqList: responseJson.result
          })
        }
        // this.getOthersProfile();
      })
      .catch((error) => {
        // console.error(error);
        //toastMsg('danger', 'Sorry..something network error.Try again please.')
      });
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
      headers: serviceUrl.headers,
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
  Accept(item) {
    var data = {  group: item }
    this.props.navigation.navigate('RequestListAction', { data: data });
  }

  async join(item) {
    // debugger;
    const { groupId } = item;
    var data = {
      userId: await AsyncStorage.getItem('userId'),
      ChatUserId: await AsyncStorage.getItem('chatUserID'),
      QBGroupId: groupId,
      groupid: item._id,
      ReqAs: "Accept"

    };
    const url = serviceUrl.been_url1 + "/JoinOrRemovetheReq";
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //toastMsg('success', responseJson.message);
        this.ReqList();
      })
      .catch((error) => {
        // console.error(error);
        //toastMsg('danger', 'Sorry..something network error.Try again please.')
      });
  }

  async reject(item) {
    // debugger;
    const { groupId } = item;
    var data = {
      userId: await AsyncStorage.getItem('userId'),
      groupid: item._id,
      ReqAs: "Cancel",
      ChatUserId: await AsyncStorage.getItem('chatUserID'),
      QBGroupId: groupId,
    };
    const url = serviceUrl.been_url1 + "/JoinOrRemovetheReq";
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //toastMsg('success', responseJson.message);
        this.ReqList();
      })
      .catch((error) => {
        // console.error(error);
        //toastMsg('danger', 'Sorry..something network error.Try again please.')
      });
  }

  async Cancel(item) {
    const { groupId } = item;
    var data = {
      userId: await AsyncStorage.getItem('userId'),
      groupid: item._id,
      ReqAs: "Cancel",
      ChatUserId: await AsyncStorage.getItem('chatUserID'),
      QBGroupId: groupId,
    };
    const url = serviceUrl.been_url1 + "/JoinOrRemovetheReq";
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //toastMsg('success', responseJson.message);
        this.ReqList();
      })
      .catch((error) => {
        // console.error(error);
        //toastMsg('danger', 'Sorry..something network error.Try again please.')
      });
  }

  render() {
    return (

      <View style={{ flex: 1, marginTop: 20, }}>
       
        <Content>
          {this.state.reqList.length > 0 || null ?
            <FlatList
              data={this.state.reqList}
              extraData={this.state.reqList}
              style={{}}
              renderItem={({ item }) => (
                <View style={{ width: '88%', marginLeft: 'auto', marginRight: 'auto', marginBottom: hp(3), backgroundColor: '#fff', borderWidth: .6, borderColor: '#c1c1c1', borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, }}>
                  <View style={{ margin: '5%', }}>
                    <View style={{ flexDirection: 'row', marginVertical: '2%', marginLeft: '2%', }}>
                      <Text style={plannerStyles.placeText}>
                        {item.Title}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: -5, marginLeft: '2%', }}>
                    <TouchableOpacity
                                onPress={() => this.location(item)}
                                style={{ flexDirection: 'row', marginTop: '0%', marginLeft: 1, }} >
                      <Image source={require(imagepath + 'blackLocation.png')}
                        style={{
                          height: 12, width: 12, marginTop: 6
                        }} />
                      <Text style={[plannerStyles.locationText, { marginTop: '1.5%' }]}>
                        {/* <Text style={[plannerStyles.locationText,{fontSize: Common_Color.locationNameFontSize, fontFamily: Common_Color.fontMedium,marginTop:3}]}> */}
                        {item.Location}
                      </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: '3%', marginLeft: '2%', }}>
                      <Text style={[plannerStyles.travelHeader, {}]}>
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
                        <Text style={[plannerStyles.budget, { marginTop: 2 }]}>
                          Budget
                        </Text>
                        <Text style={[plannerStyles.budgetcolon, { marginTop: 0 }]}>
                          :
                        </Text>

                        <Text style={[plannerStyles.budgetText, { marginTop: '1%' }]}>
                          {item.Currency}.{item.MinPrice} - {item.MaxPrice}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'row',marginTop:20,marginBottom: -30,marginLeft:'2%'}}> 
                    <TouchableOpacity onPress={() => this.gotoprofile(item)} style={{flexDirection:'row'}}>
                        <Text style={plannerStyles.peopleGoing1}>By</Text>
                        <Text style={[plannerStyles.peopleGoing2,{fontSize: Username.FontSize, fontFamily: Username.Font,marginTop:1}]}>{item.Admin}</Text>
                        </TouchableOpacity>
                      </View>
                    <View style={{ marginLeft: '2%', flexDirection: 'row', marginBottom: 5, marginTop: '9%', justifyContent: 'space-between', alignItems: 'center' }}>
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


                      {item.ReqFrom === "User" ?
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ marginRight: '5%' }}>
                            <View style={{ backgroundColor: '#39a0eb', height: 35, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                              <Text style={{ fontSize: 13, color: '#ffffff', fontFamily: Common_Color.fontBold }}>Requested</Text>
                            </View>
                          </View>
                          <View>
                            <TouchableOpacity onPress={() => this.Cancel(item)}>
                              <View style={{ backgroundColor: '#f44236', height: 35, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{ color: '#ffffff', fontFamily: Common_Color.fontBold }}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        :
                        <View style={{ flexDirection: 'row' }}>
                          <View style={[common_styles.Common_button, { width: wp(25), marginTop: '-3%' }]}>
                            <View style={{ backgroundColor: '#39a0eb', height: 35, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                              <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                onPress={() => this.join(item)}>
                                <Text style={common_styles.Common_btn_txt}>Join</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={[common_styles.Common_button, { width: wp(25), marginTop: '-3%' }]}>
                            {/* <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                                    borderRadius={10}
                                > */}
                            <View style={{ backgroundColor: '#f44236', height: 35, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                              <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                onPress={() => this.reject(item)}>
                                <Text style={common_styles.Common_btn_txt}>Reject</Text>
                              </TouchableOpacity>
                            </View>
                            {/* </ImageBackground> */}
                          </View>
                        
                        </View>
                      }
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
              horizontal={false}
            />
            :
            <View
              style={{
                flex: 1, flexDirection: "column", justifyContent: "center",
                alignItems: "center"
              }} >
            
            </View>}

        </Content>
      </View>

    )
  }
}