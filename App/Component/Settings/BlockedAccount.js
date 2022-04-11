import React, { Component } from 'react';
import { View, Text, TextInput, ImageBackground, Image, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
import MutedAccountStyle from './styles/MutedAccountStyle';
import Common_Style from '../../Assets/Styles/Common_Style'
import Profile_Style from "../../Assets/Styles/Profile_Style"
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
var id1 = ''
import styles from '../../styles/FooterStyle'
import { Toolbar } from '../commoncomponent'
import UserView from '../commoncomponent/UserView';
export default class BlockedAccount extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(prop) {
    super(prop);
    this.state = { masterData: '' }
  }


  componentWillMount() {
    this.getApi();
  }
  componentDidMount = async () => {
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.getApi();
      }
    );
  };

  getApi = async () => {

    var data = {
      Userid: await AsyncStorage.getItem('userId')
      //   Userid:"5e3d0c51a2801a5a562b3f0c"
    };

    const url = serviceUrl.been_url2 + '/GetBlockedusers'
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
        if (responseJson.status == 'True') {
          this.setState({ masterData: responseJson.result })
        }
      })
      .catch((error) => {
        console.log(error);
        //toastMsg('danger', 'Sorry..Something network error.please try again once.')
      });
  };


  unBlock = async (item) => {
    var id = item._id
    debugger
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      //   Userid:"5e3d0c51a2801a5a562b3f0c",
      Otheruserid: id
    };

    const url = serviceUrl.been_url1 + '/BlockAccount'
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
        this.getApi();
      })
      .catch((error) => {
        console.log(error);
        //toastMsg('danger', 'Sorry..Something network error.please try again .')
      });
  };

  

  getRenderView(item) {
    return <View style={[Common_Style.StatusView, { width: '100%' }]}>
      <TouchableOpacity onPress={() => this.unBlock(item)}>
        <View style={Common_Style.NewFollow}>
          <Text style={{ textAlign: 'center', color: '#fff' }} >Unblock</Text>
        </View>
      </TouchableOpacity>
    </View>
  }

  createFolderIconView = () => <View />


  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', marginTop: 0 }}>

        <Toolbar {...this.props} leftTitle="Blocked Account" rightImgView={this.createFolderIconView()} />

        {this.state.masterData.length > 0 ?
          <FlatList
            style={{ marginBottom: 60 }}
            data={this.state.masterData}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item, index }) => (
              <View key={`id${index}`} style={{ flexDirection: 'row', }}>
                <UserView userName={item.UserName} surName={item.name}  isVerifyTick={item.VerificationRequest} profilePic={item.ProfilePic} rightView={this.getRenderView(item)} />

              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          /> :
          <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
            <View style={styles.hasNoMem}>
              <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
              <Text style={Common_Style.noDataText}> You have not Blocked anyone</Text>
            </View>
          </View>}





      </View>

    )
  }

}