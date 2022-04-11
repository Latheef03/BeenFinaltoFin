import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Linking, Image, StatusBar, FlatList } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import plannerStyles from './styles/plannerStyles';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const imagepath = '../../Assets/Images/localProfile/';

export default class Ongoing extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor() {
    super();
    this.state = {
      ongoingList: [], AdminId: "",
      place_id:"",
      Location:"",
      coords:""
    }
  }

  // async UNSAFE_componentWillMount() {
  //   var id1 = await AsyncStorage.getItem("userId");
  //   this.setState({
  //     AdminId: id1
  //   })
  //   this.ongoingList();
  // }

  async componentDidMount() {
    var id1 = await AsyncStorage.getItem("userId");
    this.setState({
      AdminId: id1
    })
    this.ongoingList();
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.ongoingList();
      }
    );
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
      headers:serviceUrl.headers,
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

  OngoingDetails(item) {
    debugger;
    console.log('ongoing list', item)
    if (item.MemberRes === true) {
      AsyncStorage.setItem('OtherUserIdPlanner', item._id);
      this.props.navigation.navigate('Open', { datas: item });
    }
    else {
      AsyncStorage.setItem('OtherUserIdPlanner', item._id);
      this.props.navigation.navigate('NonMemOpen');
    }

  }

  async peopleGoing(item) {
    var data =
    {
      groupi: item._id
    }
    this.props.navigation.navigate('PeopleGoing', { data: data });
  }

  async finalise(item) {
    var data = {
      groupId: item._id,
      userId: await AsyncStorage.getItem('userId'),
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
        this.ongoingList();
      })
      .catch((error) => {
        // console.error(error);
        //toastMsg('danger', 'Sorry..something network error.Try again please.')
      });
  }

  async ongoingList() {
    debugger;
    var data = {
      userId: await AsyncStorage.getItem('userId'),
    };
    const url = serviceUrl.been_urlP01 + "/MyPlannerlist";
    return fetch(url, {
      method: "POST",
      headers:serviceUrl.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('ongoing response ', responseJson);

        if (responseJson.status === "True") {

          this.setState({
            ongoingList: responseJson.result
          })
        }
        // this.getOthersProfile();
      })
      .catch((error) => {
      });
  }
  location(dat) {
    debugger;
    var data = {
      place_id:dat.place_id,
      Location: dat.Location,
      coords: dat.coords
    }
    this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        {/* <ScrollView> */}
        {this.state.ongoingList.length > 0 || null ?
          <FlatList
            style={{}}
            extraData={this.state.ongoingList}
            data={this.state.ongoingList}
            renderItem={({ item }) => (
              <View style={{  width: '88%', marginLeft: 'auto', marginRight: 'auto', marginBottom: hp(3), backgroundColor: '#fff', borderWidth: .6, borderColor: '#c1c1c1', borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6,}}>
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
                        <Image source={require(imagepath + 'blackLocation.png')}
                          style={{ height: 12, width: 12, marginTop: 9 }} />
                        <Text style={plannerStyles.locationText}>
                          {/* <Text style={[plannerStyles.locationText,{fontSize: Common_Color.locationNameFontSize, fontFamily: Username.Font,marginTop:3}]}> */}
                          {item.Location}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: '3%', marginLeft: '2%', }}>
                      <Text style={[plannerStyles.travelHeader, { color: "#000000", fontSize: Username.FontSize, 
                      fontFamily: Username.Font, 
                      }]}>
                        Travel Dates
                     </Text>
                    </View>
                    <View style={{ marginVertical: '2%', marginTop: 1, marginLeft: '2%', }}>
                      <Text style={plannerStyles.dateText}>
                        {item.TravelDates}
                      </Text>
                    </View>
                    <View style={{ backgroundColor: '#dfdfdf', borderRadius: 15, marginTop: '4%', height: 50 }}>
                      <View style={{ flexDirection: 'row', marginVertical: '5%', marginLeft: '7%', }}>
                        <Text style={[plannerStyles.budget, { color: "#000000", fontSize: Username.FontSize, fontFamily: Username.Font, marginTop: 2 }]}>
                          Budget
                        </Text>
                        <Text style={[plannerStyles.budgetcolon, { marginTop: 0 }]}>
                          :
                        </Text>

                        <Text style={[plannerStyles.budgetText, { marginTop: 2 }]}>
                          {item.Currency}.{item.MinPrice} - {item.MaxPrice}
                        </Text>
                      </View>
                    </View>



                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: -25, marginLeft: '2%' }}>
                      <TouchableOpacity onPress={() => this.gotoprofile(item)} style={{ flexDirection: 'row' }}>
                        <Text style={plannerStyles.peopleGoing1}>By</Text>
                        <Text style={[plannerStyles.peopleGoing2, { fontSize: Username.FontSize, fontFamily: Username.Font, }]}>{item.Admin}</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ marginLeft: '2%',marginTop:15,flexDirection: 'row', marginBottom: 5, marginTop: '9%', justifyContent: 'space-between', alignItems: 'center' }}>
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

                        {item.GroupAs === "Fixed" && this.state.AdminId === item.UserId ?
                          // <View style={{ backgroundColor: 'lightgreen', height: 35, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                          <Text style={{ color: '#aed883', marginLeft: '18%', fontSize: Username.FontSize, fontFamily: Username.Font, }}>Finalised</Text>
                          // </View>
                          :
                          <View>
                            <Text style={{ color: 'green' }}></Text>
                          </View>
                        }

                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
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
            {/* <Spinner style={{ marginTop: '60%' }} color="#fb0143" /> */}
            {/* <Text style={{ fontSize: 18, color: '#fb0143', fontFamily: "Open Sans", justifyContent: "center",
                alignItems: "center", }}>No List available</Text> */}
          </View>}
        {/* </ScrollView> */}
      </View>
    )
  }
}