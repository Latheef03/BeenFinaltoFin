import React, { Component } from 'react';
import { StatusBar, StyleSheet, ScrollView, View, Text, Image, FlatList, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import { NotifyLoader } from '../commoncomponent/AnimatedLoader';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import UserView from '../commoncomponent/UserView';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/';


export default class Notifications extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      notificationList: [],
      notifiName: '',
      notifiCaption: '',
      inviteCount: 0,
      fetchingData: false,
    }
  }

  UNSAFE_componentWillMount() {
    this.fetchDetails();
  }

  fetchDetails = async () => {
    // debugger;
    var id = await AsyncStorage.getItem("userId");
    var data = { Userid: id };
    this.setState({ fetchingData: true });
    const url = serviceUrl.been_url1 + "/GetNotify"
    fetch(url, {
      method: 'POST',
      headers: serviceUrl.headers,
      body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "True") {
          console.log("response Json requsr List", responseJson);
          let resp = responseJson.result;
          responseJson.result.length > 0 && responseJson.result.map(d => {
            let name = d.Notification.split(' ')[0];
            d.notifiName = name;
            d.notifiCaption = d.Notification.split(' ').slice(1).join(' ');
            return d;
          })
          // console.log('the total resp is ',resp);
          this.setState({
            notificationList: resp,
            fetchingData: false,
            inviteCount: responseJson.ReqlistCount
          })
        } else {
          this.setState({ fetchingData: false });
        }
      })
      .catch(function (error) {
        this.setState({ fetchingData: false });
        console.log("Catch Error", error);
      });
  }


  notify() {
    this.props.navigation.navigate('Notifications1')
  }


  navigationToPage(item) {
    {
      item.Type == "Follow" ?
        this.props.navigation.navigate('Notifications1')
        :
        item.Type == "FollowAcc" ?
          this.OtheruserDashboard(item)
          :

          item.Type == "Notification for comment your post" ?
            this.props.navigation.navigate('comments', { data: item })
            :
            this.props.navigation.navigate('GetData', { data:{ feedId : item.PostId,screen:'notification'} })
    }
  }

  async OtheruserDashboard(item) {
    // debugger;
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Otheruserid: item.OtherId
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
          AsyncStorage.setItem('OtherUserId', item.OtherId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "Pending") {
          AsyncStorage.setItem('reqIdForStatus', item._id);
          AsyncStorage.setItem('OtherUserId', item.OtherId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }
        else if (responseJson.connectionstatus === "False") {
          AsyncStorage.setItem('reqIdForStatus', item._id);
          AsyncStorage.setItem('OtherUserId', item.OtherId);
          var data = {
            ProfileAs: responseJson.ProfileAs
          }
          if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            // this.props.navigation.navigate('LocalUserProfile', { data: data })
          }
          else if (responseJson.ProfileAs === 2) {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
          }
          else {
            AsyncStorage.setItem('reqIdForStatus', item._id);
            AsyncStorage.setItem('OtherUserId', item.OtherId);
            this.props.navigation.navigate('OtherUserProfile', { data: data })
          }
        }

        else if (responseJson.connectionstatus === "Mismatch") {
          // this.props.navigation.navigate('Profile')
          this.profileChanger();
        }
        else {
        }
      })
      .catch((error) => {
      });
  }

  renderRightImgdone() {
    return <View>
      <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 35, right: 35 }} onPress={() => this.notify()}>
        <View style={{ flexDirection: 'row', justifyContent: "center",paddingRight:8,paddingLeft: 8 }}>
          <View >
            <Image source={require(imagePath + 'friends.png')} tintColor={'#000'} resizeMode={'stretch'} style={{ width: 20, height: 20, }} />
          </View>
          {this.state.inviteCount != undefined || this.state.inviteCount != null || this.state.inviteCount != "" ?
            <View style={{ width: 12, height: 12, borderWidth: 1, backgroundColor: '#f00', borderRadius: 50, borderColor: '#f00', margin: 2 }}>
              <Text style={{ fontSize: 8, color: '#fff', marginLeft: 3, marginTop: 0 }} >{this.state.inviteCount == undefined ? 0 : this.state.inviteCount}</Text>
            </View>
            :
            null
          }
        </View>
      </TouchableOpacity>
    </View>
  }

  getRenderView(item) {
    // console.log('the datas noti',item);
    return <View style={[Common_Style.StatusView, { width: '100%' }]}>
      <TouchableOpacity onPress={() => { this.navigationToPage(item) }}>
        {item.PostImage == null ?
          (<View>
            <Image style={{ width: 50, height: 45 }} resizeMode={'contain'} />
          </View>)
          : (<View>
            <Image source={{ uri: serviceUrl.newsFeddStoriesUrl + item.PostImage.split(',')[0] }} style={{ width: 50, height: 45 }} resizeMode={'cover'} />
          </View>)}
      </TouchableOpacity>
    </View>
  }


  renderData = (item, index) => {
    return (
      <View key={index.toString()}>
        <UserView 
          userName={item.UserName} 
          followList={item.notifiCaption} 
          surName={item.CalculateTime} 
          onPress={()=>this.OtheruserDashboard(item)} 
          isVerifyTick={item.VerificationRequest} 
          profilePic={item.ProfilePic} 
          rightView={this.getRenderView(item)} 
        />
      </View>)

  }

  render() {
    const { fetchingData, notificationList } = this.state
    return (

      <View style={[styles.container, { marginTop: 0, backgroundColor:'#fff' }]}>
        <StatusBar backgroundColor="#0000" barStyle='dark-content' />
        <Toolbar {...this.props} centerTitle="Notification" rightImgView={this.renderRightImgdone()} />

        {fetchingData ?
          <NotifyLoader />
          : !fetchingData && notificationList.length == 0 ?
            <View style={{ justifyContent: 'center', alignSelf: 'center', height: '100%' }} >
              <Text style={{ textAlign: 'center' }} >No Notifications Yet</Text>
            </View>
            :
            <FlatList
              data={notificationList}
              ListFooterComponent={<View style={{height:35}} />}
              renderItem={({ item, index }) => (
                this.renderData(item, index)
              )}

              keyExtractor={(item, index) => index.toString()}
            />
        }
      </View>
    )
  }

}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1
    },
    swipeup: {
      width: '98%',
      marginLeft: '2%'

    }
  }
)
