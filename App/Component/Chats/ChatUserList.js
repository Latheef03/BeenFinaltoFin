import React, { Component } from 'react';
import {
  SafeAreaView, StyleSheet, ScrollView, View, Text, Image, TextInput, FlatList,TouchableOpacity, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Spinner } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import { postServiceP01 } from 'Been/App/Component/_services';
import toastMsg, { toastMsg1 } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader';
import { Toolbar } from '../commoncomponent'
import {Common_Color} from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style';

const {profilePic} = serviceUrl;
export default class ChatUserList extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      chatUsers: [],
      postImgUrl: '',
      typedFilterText : ''

    }
    this.arrayHolderForChatUSers = [];
  }

  // UNSAFE_componentWillMount =() =>{
  //   this.getSendToData();
  //   const {navigation} = this.props;
  //   const origin = this.props.route.params.origin;
  //   const isNeedActiveLoader = (origin != undefined && origin == 'map') ? true : false 
  //   this.fetchChatUserList({loaderActive:isNeedActiveLoader});
  // }

  componentDidMount = () => {
    // this.fetchChatUserList({loaderActive:false});
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.getSendToData();
        const {navigation} = this.props;
        const origin = this.props.route?.prams?.origin;
        // console.log('the origin ',origin);
        const isNeedActiveLoader = (origin != undefined && origin == 'map') ? true : false 
        this.fetchChatUserList({loaderActive:isNeedActiveLoader});
        // navigation.state.params = {};
      }
    );
    // this.fetchChatUserList({loaderActive:true});
  };

  getSendToData = () => {
    const { navigation ,route} = this.props;
    const post = route.params.post
    // console.log('post is ',post == undefined)
    this.setState({
      postImgUrl: post == undefined ? '' : post.ImgUrl
    })
  }

  fetchChatUserList = async ({loaderActive}) => {
    // debugger;
    var chatUserId = await AsyncStorage.getItem("chatUserID");
    if (chatUserId == null && chatUserId == "null" && chatUserId == undefined) {
      return false;
    }

    let apiname = 'ChatHistory';
    var data = {};
    data.Email = await AsyncStorage.getItem('email'); 
    data.Password = await AsyncStorage.getItem('chatUserPWD');
    data.ChatUserId = chatUserId;
    this.setState({ isLoading: loaderActive });
    let subscribe = true
    return postServiceP01(apiname, data).then(datas => {
      console.log('chat user list', datas)
      if (datas.status == 'True') {
        console.log('datas',datas.result.items)
        let chatUsersList = datas.result.items;
        // if(subscribe)
        this.setState({
          chatUsers: chatUsersList,
          isLoading: false
        })
        this.arrayHolderForChatUSers = chatUsersList;
      } else {
        //toastMsg('danger', datas.message);
        this.setState({
          isLoading: false
        })
      }

    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false
      })
      toastMsg1('danger','something is wrong,try again once')
      //toastMsg('danger', 'something is wrong,try again once');
    });
    
    // return () => (subscribe=false);
    
  }

  gotoOneToOne = (items) => {
    console.log('fullname', items)
    const { postImgUrl } = this.state;
    this.props.navigation.navigate('OneToOneChat', { chatUser: items, sendToImg: postImgUrl })
  }

  separator() {
    return <View style={{ backgroundColor: '#c1c1c1', width: wp('100%'), height: hp('10%') }} />
  }

  isLoader = () => {
    const { isLoading } = this.state;
    console.log('is loader init')
    if (isLoading) {
      return (
        <Loader />
      )
    }

  }

  SearchFilter(text) {
    //// debugger;
    const {chatUsers} = this.state;
    //passing the inserted text in textinput
    const newData = this.arrayHolderForChatUSers.filter(function (item) {
        //applying filter for the inserted text in search bar
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    this.setState({
        chatUsers: newData,
        typedFilterText: text
    });
}

  isValidURL = (str) => {
    // console.log('the str is ',str);
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\@[;&a-z\\d%_.~+=-]*)?' + //ms->include @
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    // console.log('the pattern is',pattern);
    return !!pattern.test(str);

  }

  renderChatUsers = (user, index) => {
    console.log('user-->',user);
    const { name, _id, last_message, last_message_date_sent, 
      unread_messages_count,ProfilePic
     } = user;
    const { isLoading } = this.state;
    //  console.log('asasa',ProfilePic,'===typeof',typeof ProfilePic);
    // console.log(typeof last_message == 'object')
    // let lastMsg = ''
    const msgAsURL = typeof last_message == 'object' ? false : this.isValidURL(last_message);
    // console.log('msgAsURL',msgAsURL);
      var splitMsg = typeof last_message == 'object' ? last_message : last_message.length > 11 ? last_message.substring(0, 12) : last_message;
      var lastMsg = typeof splitMsg == 'object' ? '' : splitMsg.length > 11 ? splitMsg + '.....' : splitMsg;
      // console.log('unread_messages_count',unread_messages_count);
    
    // console.log('the last msg',last_message);
    
    // console.log('the msgasurl',msgAsURL);
    return (
      // <ScrollView>
      <TouchableOpacity onPress={() => this.gotoOneToOne(user)}>
        <View key={`id${index}`} style={{
          width: wp('95%'), height: hp('10%'),
          flexDirection: 'row', marginTop:0,
          // borderBottomWidth:1,borderBottomColor:'#000'
        }}>

          <View style={{
            backgroundColor: '#c1c1c1', width: 50, height: 50, overflow: 'hidden',
            borderRadius: 25, alignSelf: 'center',
          }}>
            {ProfilePic == "null" || ProfilePic == null
             ?
              <Image source={require('../../Assets/Images/profile.png')} resizeMode={'stretch'}
                style={{ width: '100%', height: '100%', }}
              />
              
             :
              <Image source={{uri:profilePic+ProfilePic}} resizeMode={'cover'}
                style={{ width: '100%', height: '100%', }}
              />
            }
          </View>

          <View style={{ alignSelf: 'center', marginLeft: 15 }}>
            <View style={{ width: wp('65%'), height: hp('2.5%') }}>
              <Text style={{ lineHeight: 15, color: '#3e3e3e',fontFamily:Common_Color.fontMedium }}>
                {name}
              </Text>
            </View>
            <View style={{ width: wp('40%'), }}>
              <Text style={{ color: '#7b7b7b',fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontLight }}>
                {msgAsURL ? 'Post Shared' : lastMsg == "null" ? "Photo Shared" : lastMsg} 
                {/* { lastMsg } */}
                <Text >   

                </Text>
              </Text>
            </View>

          </View>

          { unread_messages_count > 0
           ?
           <View style={{backgroundColor: '#ef1b66', 
           borderRadius: 12, paddingTop: 3,
           paddingBottom: 3, paddingLeft: 10, paddingRight: 10, color: '#fff', alignSelf: 'center',
           textAlign: 'center', right: 0, position: 'absolute',}}> 
              <Text style={{fontSize:12,color:'#fff'}}>
                {unread_messages_count}
              </Text>
            </View> 
           :null
          }
          

        </View>
      </TouchableOpacity>
    )
  }

  renderToolbarIconsView = () => {
    return (
      <View style={{marginRight: 35}}>
        {/* <TouchableOpacity >
    <View style={{ marginRight: '5%' }}>
    <Image source={require('../../Assets/Images/letterPad.png')} resizeMode={'stretch'} style={{ width: 20, height:22 }} />
    </View>
    </TouchableOpacity> */}
        {/* <TouchableOpacity >
          <View>
            <Image source={require('../../Assets/Images/setting.png')} resizeMode={'center'} style={{ width: 20, height: 22 }} />
          </View>
        </TouchableOpacity> */}
      </View>

    )
  }


  render() {
    // const {isLoading} = this.state;
    return (

      <View style={[styles.container,{
         marginTop:0,backgroundColor:'#fff'
        //,marginBottom:'-3%'
        }]}>

        {/* <Toolbar {...this.props} centerTitle='Chats' rightTwoImgView={this.renderToolbarIconsView()} /> */}
        <Toolbar {...this.props} centerTitle='Chats' rightImgView={this.renderToolbarIconsView()} />

        <View style={styles.searchBar}>
         
          <TextInput
            style={[Common_Style.searchTextInput,{width:'100%'}]}
            placeholder="Search"
            underlineColorAndroid="transparent"
            value = {this.state.text}
            autoCorrect={false}
            //
            onChangeText = {(e)=>this.SearchFilter(e)}
          />
        </View>

        {/* {this.isLoader()} */}
        {this.isLoader()}
        <FlatList
          style={{ marginTop:8 }}
          data={this.state.chatUsers}
          showsVerticalScrollIndicator = {false}
          // ItemSeparatorComponent={this.separator()}
          renderItem={({ item, index }) => this.renderChatUsers(item, index)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
          extraData = {this.state}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create(
  {
    container1: { flexDirection: 'row', width: '95%', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end' },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    swipeup: {
      width: '98%',
      marginLeft: '2%'

    },
    ImageStyle: {
      padding: 15,
      margin: 5,
      height: 40,
      width: 40,
      alignItems: 'center',
    },
    searchBar: {
      backgroundColor: '#ebebeb', width: wp('95%'), 
      height:40,
      //  hp('6%'), 
       alignSelf: 'center',
      flexDirection: 'row', borderWidth: .5, borderColor: '#e1e1e1', borderRadius: 10,
    },
    unSeenchatCount: {
      // backgroundColor: '#0c86ef', old color (blue)
      backgroundColor: '#ef1b66', 
      borderRadius: 12, paddingTop: 3,
      paddingBottom: 3, paddingLeft: 10, paddingRight: 10, color: '#fff', alignSelf: 'center',
      textAlign: 'center', right: 0, position: 'absolute',fontFamily:Common_Color.fontMedium
    }
  },
)
