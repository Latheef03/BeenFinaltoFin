import React, { Component } from 'react';
import {
  SafeAreaView, StyleSheet, ScrollView, FlatList, View, Text, Image,
  KeyboardAvoidingView, TextInput, NativeEventEmitter, AppState, Linking, Clipboard,
  ToastAndroid,StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TouchableOpacity, } from 'react-native-gesture-handler';
import { Spinner, Content, Container } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import QB from 'quickblox-react-native-sdk';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
// import Commmon_Color from '../../Assets/Colors/Common_Color'
import styles from './chatStyle';
import { initiateChat } from './chatHelper';
import Loader from '../../Assets/Script/Loader'
import { toastMsg } from '../../Assets/Script/Helper';
import { deviceHeight as dh, deviceWidth as dw ,timeCalcForChat} from '../_utils/CommonUtils';
import ImageView from 'react-native-image-view';
import RNHeicConverter from 'react-native-heic-converter';

var dialogCred = ''
var receivedObjects = ''

export default class GroupChat extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    const gch = this
    this.state = {
      chatUser: '',
      isChatConnection: false,
      dialogCred: '',
      sentMessages: [],
      typedMessage: '',
      AppChatUserID: '',
      loader: false,
      imageView : false
    }
    const emitter = new NativeEventEmitter(QB.chat)

    const eventHandler = (event) => {
      const { type, payload } = event

      console.log('event emitter type', type, '---payload', payload);
      // type - type of the event (string)
      // payload - new message (object)
    }

    function connectionEventHandler(event) {
      console.log('connection Event Handler', event)
      // handle connection event
    }

    const receivedNewMessage = (event) => {
      const { type, payload } = event;
      // this.props(payload)

      console.log('received message type', type, '--payload', payload);
      // handle new message
      // type - event name (string)
      // payload - message received (object)
      // return payload;
      // return true;
      receivedObjects = payload;
    }

    function newMessageHandler(event) {
      const {
        type, // name of the event (the one we've subscribed on)
        payload // event data (new message in this case)
      } = event;
      receivedObjects = payload;
      gch.addRecentMessages(payload)
      console.log("received new message type", type, "--payload", payload);
    }

    function messageStatusHandler(event) {
      console.log('message Status Handler', event)
      // handle message status change
    }

    function systemMessageHandler(event) {
      console.log('system Message Handler', event)
      // handle system message
    }

    function userTypingHandler(event) {
      console.log('user Typing Handler', event)
      // handle user typing / stopped typing event
    }

    function messageDelivered(event) {
      const {
        type, // name of the event (the one you've subscribed for)
        payload, // event data
      } = event
      const {
        dialogId, // in dialog with id specified
        messageId, // message with id specified
        userId // was delivered to user with id specified
      } = payload
      // handle as necessary
    }

    const QBConnectionEvents = [
      QB.chat.EVENT_TYPE.CONNECTED,
      QB.chat.EVENT_TYPE.CONNECTION_CLOSED,
      QB.chat.EVENT_TYPE.CONNECTION_CLOSED_ON_ERROR,
      QB.chat.EVENT_TYPE.RECONNECTION_FAILED,
      QB.chat.EVENT_TYPE.RECONNECTION_SUCCESSFUL,
    ]

    QBConnectionEvents.forEach(eventName => {
      emitter.addListener(eventName, connectionEventHandler)
    })

    emitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      receivedNewMessage
    )



    emitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      newMessageHandler
    )

    emitter.addListener(
      QB.chat.EVENT_TYPE.MESSAGE_DELIVERED,
      messageStatusHandler
    )

    emitter.addListener(
      QB.chat.EVENT_TYPE.MESSAGE_READ,
      messageStatusHandler
    )

    emitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_SYSTEM_MESSAGE,
      systemMessageHandler
    )

    emitter.addListener(
      QB.chat.EVENT_TYPE.USER_IS_TYPING,
      userTypingHandler
    )

    emitter.addListener(
      QB.chat.EVENT_TYPE.USER_STOPPED_TYPING,
      userTypingHandler
    )

    emitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      eventHandler
    )

    emitter.addListener(
      QB.chat.EVENT_TYPE.MESSAGE_DELIVERED,
      messageDelivered
    );

    this.getDialogChats = this.getDialogChats.bind(this)
    AppState.addEventListener('change', gch.trackAppState)

  }


  componentDidMount = async () => {
    // this.focusSubscription = this.props.navigation.addListener(
    //   "focus",
    //   () => {
    //     // this.getChatUser()

    //   }
    // );
    await AsyncStorage.getItem('chatUserID').then(data => this.setState({ AppChatUserID: data }));
    this.getChatUser()
  };

  componentWillUnmount() {

  }

  revealLink = (link) => {
    Linking.openURL(link);
  }
  getChatUser = () => {
    console.log('this.props', this.props)
    // const { navigation } = this.props;
    // const user = navigation.getParam("chatUser");
    // this.setState({ chatUser: user }) 
    initiateChat();
    this.checkConnectionFromChatServer();
  }


  checkConnectionFromChatServer = () => {
    const { userDetails } = this.props;
    const { groupId } = userDetails;
    QB.chat
      .isConnected()
      .then((connected) => { // boolean
        console.log('is connected', connected);
        this.setState({
          isChatConnection: connected
        })
        if (connected) {
          this.getDialogChats(groupId)
        } else {
          this.createSession()
        }
        // handle as necessary, i.e.
        // if (connected === false) reconnect()
      })
      .catch(function (e) {
        console.log('is connected', e);
        // handle error
      });
  }

  createSession = async () => {
    // debugger;
    let chatUserId = await AsyncStorage.getItem('chatUserID');
    let chatUserPwd = await AsyncStorage.getItem('chatUserPWD');
    let loginCred = await AsyncStorage.getItem('email');
    QB.auth
      .login({
        login: loginCred,
        password: chatUserPwd
      })
      .then((info) => {
        console.log('users info', info);
        this.createConnectionToServer()
        // signed in successfully, handle info as necessary
        // info.user - user information
        // info.session - current session
      })
      .catch((e) => {
        console.log('users info with error', e);
        // handle error
      });
  }

  createConnectionToServer = async () => {
    let chatUserId = await AsyncStorage.getItem('chatUserID');
    let chatUserPwd = await AsyncStorage.getItem('chatUserPWD');
    let loginCred = await AsyncStorage.getItem('email');
    const { userDetails } = this.props;
    const { groupId } = userDetails;
    QB.chat
      .connect({
        userId: chatUserId,
        password: chatUserPwd
      })
      .then(() => {
        this.getDialogChats(groupId)
        console.log('create Connection To Server')
        // connected successfully
      })
      .catch(function (e) {
        console.log('create Connection To Server wrong', e)
        // some error occurred
      });
  }

  async trackAppState(appState) {

    let chatUserId = await AsyncStorage.getItem('chatUserID');
    let chatUserPwd = await AsyncStorage.getItem('chatUserPWD');
    if (appState.match(/inactive|background/)) {
      QB.chat
        .disconnect()
        .then(function () {
          console.log('App in bg disconnect()')
          /* disconnected successfully */
        })
        .catch(function (e) {
          console.log('App in bg with disconnect error', e)
          /* handle error */
        });
    } else {
      QB.chat
        .connect({
          userId: chatUserId,
          password: chatUserPwd
        })
        .then(function () {
          console.log('App in bg connect() succefully')
          /* connected successfully */
        })
        .catch(function (e) {
          console.log('App in bg with connection error', e)
          /* some error occurred */
        });
    }
  }

  // createSession = async() =>{

  // }

  //   createDialogue = async() =>{
  //     const { chatUser } = this.state;
  //     let chatUserId = await AsyncStorage.getItem('chatUserID');
  //     console.log('is connecton true',chatUser)
  //     let id = ''

  //     if(chatUser.occupants_ids.constructor != Array){
  //       id = chatUser.occupants_ids
  //     }else{

  //       if(chatUser.occupants_ids[0] == chatUserId){
  //         id = chatUser.occupants_ids[1]
  //       }else{
  //         id = chatUser.occupants_ids[0]
  //       }
  //     }
  //     //.filter(d=> chatUserId==chatUser.user_id ? d!=chatUserId: d==chatUserId )

  //     // const { id } = chatUser
  //     console.log('is connecton true',id)
  //     QB.chat.createDialog({
  //         type: QB.chat.DIALOG_TYPE.CHAT,
  //         occupantsIds: [id]
  //       }).then((dialog)=> {

  //         this.setState({
  //           dialogCred : dialog
  //         })
  //         dialogCred = dialog
  //         this.getDialogChats(dialog)
  //         console.log('start chart ',dialog)
  //         // handle as neccessary, i.e.
  //         // subscribe to chat events, typing events, etc.
  //       }).catch(function (e) {
  //           console.log('start chart wrong',e)
  //         // handle error
  //       });
  //   }

  addRecentMessages = (newMessages) => {
    const { sentMessages } = this.state;
    console.log('newMessages', newMessages)
    // properties: {updated_at: "2020-04-23T06:38:00Z", read: "0"}
    newMessages.properties = { read: "0" };
    // const newMsg = sentMessages.push(newMessages);
    //attachments
    // console.log('the new msgssf',newMessages.attachments)
    if (newMessages.attachments == undefined) {
      this.setState(prevState => ({
        sentMessages: sentMessages.length > 0 ? [...prevState.sentMessages, newMessages] : [newMessages]
      }))
    }
    // console.log('new msgss',newMsg);
    // this.setState({sentMessages : newMsg })
  }

  getDialogChats = (dialog, type = '') => {

    // const { id,dialogId }  = dialog || dialog.dialogId;
    // let ids = dialogId ? dialogId : dialog

    let ids = '';
    if (type != '') {
      ids = dialog.dialogId
    } else {
      ids = dialog
    }
    // console.log('received message',id,'--payload id',dialogId)
    console.log('received message type', ids)

    this.setState({
      loader: true,
      dialogCred: { id: ids }
    })

    QB.chat
      .getDialogMessages({
        dialogId: ids,
        sort: {
          ascending: true,
          field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT
        },
        markAsRead: false
      })
      .then((result) => {
        // console.log('retrieved messages', result)
        let bulkMessages = result.messages.length > 0 && result.messages.map(m => {
          if (m.attachments != undefined) {
            const [attachment] = m.attachments;
            // let attURL = ''
            QB.content
              .getPrivateURL({ uid: attachment.id })
              .then((url) => {
                // attURL = url; 
                m.attachmentsURL = url
                /* you download file using obtained url */
              })
              .catch(function (e) { console.log('line383', e) /* handle error */ });

          }

          return m;
        });
        console.log('the bulk messages is ', bulkMessages);
        this.setState({
          sentMessages: bulkMessages,
          loader: false
        })
        // result.messages - array of messages found
        // result.skip - number of items skipped
        // result.limit - number of items returned per page
      })
      .catch( (e) =>{
        console.log('get dialog error',e)
        this.setState({
          loader: false
        })
        // handle error
      });
  }

  isLoader = () => {
    const { loader } = this.state;
    if (loader) {
      return (
        <Loader />
      )
    }

  }

  onchangeText(text, digId) {
    // userTypingHandler
    console.log('group chat js txt', text, digId)
    const { dialogCred } = this.state;
    QB.chat
      .sendIsTyping({ dialogId: digId })
      .then(function () {
        console.log('this is user is typing')
        /* sent successfully */
      })
      .catch(function (e) {
        console.log('this is user is typing error')
        /* handle error */
      })
    //   console.log('dialog id ',dialogCred.id)
    this.setState({
      typedMessage: text
    })
  }

  sendMessage = (messages = '', grpId, imagesSelected = {}) => {
    debugger
    const { dialogCred, typedMessage } = this.state
    //if (messages == '' && imagesSelected == undefined) {
    if (messages == '' && imagesSelected.length == 0) {
      return false;
    }

    // const message = {
    //   dialogId: grpId,
    //   body: messages,
    //   saveToHistory: true
    // };
    const msgExist = messages == '' ? null : { body: messages }
    const message = {
      dialogId: grpId,
      ...msgExist,
      saveToHistory: true
    };

    if (Object.keys(imagesSelected).length > 0) {
      console.log('the object matched', imagesSelected);
      this.handlingAttachments(message, imagesSelected, grpId)
    } else {
      QB.chat
        .sendMessage(message)
        .then(() => {
          // this.getDialogChats(grpId)
          console.log('message sent successfully')
        })
        .catch(function (e) {
          console.log('message sent with wrong', e)
        })
    }

  }

  handlingAttachments = async (msg, imgs, grpId) => {
    const chatuserId = await AsyncStorage.getItem('chatUserID');
    const { sentMessages } = this.state;
    console.log('the imgss', imgs);
    const { uri } = imgs
    //imgs.constructor == Array ? [imgs] : imgs;
    let url = uri // path to file in local file system
    //const url = []
    //imgs.map(a=> { url.push(a.uri)});
    //console.log('image url :', typeof imgs );
    console.log('handling attaccc', imgs, '==', msg);
    const newMessages = {};

    newMessages.attachmentsURL = url;
    
    newMessages.body = msg.body ? msg.body : "null";
    newMessages.dateSent = new Date().getTime();
    newMessages.delayed = false;
    newMessages.properties = { read: "0" };
    newMessages.senderId = parseInt(chatuserId);
    console.log('new msgsss', newMessages);

    const img = await RNHeicConverter.convert({ path: url })
    // console.log('the img path',img);
    const { path } = img
    url = 'file://'+path

    this.setState(prevState => ({
      sentMessages: sentMessages.length > 0 ? [...prevState.sentMessages, newMessages] : [newMessages],
      imgLoader : true
      // loader: true
    }));

    QB.content
      .upload({ url, public: false })
      .then((file) => {
        // attach file
        console.log('fille returned', file);
        msg.attachments = [{
          id: file.uid,
          type: file.contentType.includes('image') ? 'image' : 'file'
        }];
        msg.body = 'null'
        // send a message
        QB.chat
          .sendMessage(msg)
          .then(() => {
            // this.setState({ loader: false });
            // this.getDialogChats(grpId)
            console.log('message sent successfully')
          })
          .catch(function (e) {
            this.setState({ loader: false });
            console.log('message sent with wrong', e)
          })
      })
      .catch(function (e) {
        /* handle file upload error */
        this.setState({ loader: false });
        console.log('line566-upload-error', e)
      });
  }

  copyChatText = (text) => {
    Clipboard.setString(text)
    // ToastAndroid.show('Message Copied', ToastAndroid.SHORT);
    toastMsg('success', 'message copied');
  }

  revealLink = (link) => {
    Linking.openURL(link);
  }

  imageFullView = (url) =>{
    this.setState({
      imageView : true,
      imageViewData : [
          {
              source: {
                  uri : url
              },
          }
      ]
  })
  }


  renderChats = (item, index) => {
    //    console.log('indexss',item)
    const { dialogId, senderId, recipientId, body, deliveredIds, readIds, dateSent, id } = item;
    const { AppChatUserID } = this.state
    const time = timeCalcForChat(dateSent)
    //  console.log('messages items',AppChatUserID);

    if (AppChatUserID == senderId) {
      return (
        <View style={{ backgroundColor: '#fff', flexDirection: 'column', marginTop: '1%' }}>
          <View style={{ alignItems: 'flex-end', }}>
            <View style={{ flexDirection: 'row', marginTop: hp('2%'), marginRight: '3%', }}>
              <View style={{ width: wp('60%') }}>

                <View style={{
                  alignItems: 'flex-end', alignSelf: 'flex-end', marginRight: '8%',
                  
                }}>
                {item.attachmentsURL != undefined ?
                <TouchableOpacity style={{}} activeOpacity={0.8} onPress={()=>this.imageFullView(item.attachmentsURL)}>
                  <View style={{
                    width: 200, height: 200, borderRadius: 20, overflow: 'hidden',
                    justifyContent: 'center', alignItems: 'center'
                  }} >
                    
                    <Image source={{ uri: item.attachmentsURL }} style={{ width: '100%', height: '100%' }}
                      resizeMode={'cover'}
                      borderRadius={20}
                    />
                    
                  </View>
                  </TouchableOpacity>
                  : null}
                </View>

                {/* <View style={{
                  alignItems: 'flex-end', alignSelf: 'flex-end', marginRight: '0%',
                  borderRadius: 15,
                }}> */}


                  {body == 'null' ? null
                    :
                    <View style={{
                      alignItems: 'flex-end', alignSelf: 'flex-end', marginRight: '8%',
                      borderRadius: 15, backgroundColor: '#ff1c49',
                    }}>
                      <TouchableOpacity activeOpacity={0.6} onPress={() => this.revealLink(body)} onLongPress={() => this.copyChatText(body)} >
                        <Text style={{
                          marginLeft: wp('2%'), marginRight: wp('3%'), color: '#fff', padding: 10,
                          fontSize: profilename.FontSize, 
                        }}>
                          {body}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                  {/* <View style={{ flexDirection: 'row', marginLeft: 1 }}>
                    <Text style={{ color: '#fff', padding: 10, lineHeight: 2, fontFamily: Timestamp.Font,fontSize:Timestamp.FontSize }}>
                      {time}
                    </Text>

                  </View> */}

                {/* </View> */}
              </View>
              <View style={{ justifyContent: 'center', alignSelf: 'center', marginRight: '4%', width: 40, height: 40, borderRadius: 40 / 2, overflow: 'hidden', }}>
                <Image source={require('../../Assets/Images/profile.png')} resizeMode={'cover'} style={{ width: '100%', height: '100%', }}></Image>
              </View>
            </View>


          </View>

              <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end', marginRight: '21%', marginTop:2 }}>
                <Text style={{ color: '#000',  fontSize: Timestamp.FontSize }}>
                  {time}
                </Text>
              </View>
        </View>
      )
    } else {
      return (

        <View style={{ backgroundColor: '#fff', flexDirection: 'column', }}>
          <View style={{ alignItems: 'flex-start' }}>
            <View style={{ flexDirection: 'row', marginTop: hp('2%'), marginLeft: '3%' }}>

              <View style={{ justifyContent: 'center', alignSelf: 'center', marginLeft: '3%', width: 40, height: 40, borderRadius: 40 / 2, overflow: 'hidden', }}>
                <Image source={require('../../Assets/Images/profile.png')} resizeMode={'cover'} style={{ width: '100%', height: '100%', }}></Image>
              </View>

              <View style={{ width: wp('60%') }}>
                <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginLeft: '8%', }}>


                  {item.attachmentsURL != undefined ?
                  <TouchableOpacity style={{}} activeOpacity={0.8} onPress={()=>this.imageFullView(item.attachmentsURL)}>
                    <View style={{
                      width: 200, height: 200, borderRadius: 20, overflow: 'hidden',
                      justifyContent: 'center', alignItems: 'center'
                    }} >
                      <Image source={{ uri: item.attachmentsURL }} style={{ width: '100%', height: '100%' }}
                        resizeMode={'cover'}
                        borderRadius={20}
                      />
                    </View>
                    </TouchableOpacity>
                    : null}



                  {body == 'null' ? null
                    :
                    <TouchableOpacity onLongPress={() => this.copyChatText(body)}>
                      <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginLeft: '0%', borderRadius: 15, backgroundColor: '#d6d6d6' }}>

                        <Text style={{ marginRight: wp('2%'), marginLeft: wp('3%'), color: '#1d1d1d', padding: 10, fontSize: profilename.FontSize,}}>
                          {body}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  }


                  {/* <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#c15b66', padding: 10, lineHeight: 10, fontFamily: Timestamp.Font, fontSize: Timestamp.FontSize }}>
                      {time}
                    </Text>
                  </View> */}


                </View>
              </View>
            </View>
          </View>
          
          <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginLeft: '21%',marginTop:2 }}>
              <Text style={{ color: 'black', fontSize: Timestamp.FontSize }}>
                 {time}
              </Text>
          </View>
          {/* <View style={{ flexDirection: 'row', marginLeft: '25.5%', }}>
            <Text style={{ color: '#c15b66', fontFamily: Timestamp.Font, fontSize: Timestamp.FontSize, marginTop: '-2%' }}>
              {time}
            </Text>

          </View> */}
        </View>


      );
    }


  }



  render() {
    const { chatUser ,imageView} = this.state;
    return (
      <KeyboardAvoidingView style={{ flex: 1, }}>
        <Container >

        <StatusBar 
          backgroundColor={imageView ? 'rgba(0,0,0,0.8)' : '#FFF'} 
          barStyle={imageView?'light-content' : 'dark-content'} 
        />
          {/* <Content style={{ flex:1,backgroundColor:'#fff'}}> */}

          {/* <View style={{ height:hp('100%'),backgroundColor: '#d6d6d6',marginBottom:20}}> */}
          {/* <View style={{width:dw,height:dh * .650}}> */}
          <View style={{ backgroundColor: '#fff', marginBottom: 30, marginTop: -10 }}>
            <FlatList
              ref={ref => this.flatList = ref}
              style={{ marginBottom: 20, flexDirection: 'column' }}
              data={this.state.sentMessages}
              // initialScrollIndex={this.state.sentMessages.length - 1}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.flatList.scrollToEnd({ animated: true })
              }}
              // inverted
              extraData={this.state}
              // ItemSeparatorComponent={this.separator()}

              renderItem={({ item, index }) => this.renderChats(item, index)}
              keyExtractor={(item, index) => index.toString()}

            // numColumns={1}
            />
            {this.isLoader()}

          </View>
          {/* </Content> */}

          {/* 
</View> */}

        </Container>
        <ImageView
                images={this.state.imageViewData}
                imageIndex={0}
                isVisible={this.state.imageView}
                onClose = {()=>this.setState({imageView:false})}
                renderFooter={(image) => (
                    <View />
                )}
              />
      </KeyboardAvoidingView>
    )
  }

}
