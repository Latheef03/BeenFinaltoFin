import React, { Component } from 'react';
import {
  SafeAreaView, StyleSheet, ScrollView, FlatList, View, Text, Image,
  KeyboardAvoidingView, TextInput, NativeEventEmitter, AppState, Clipboard, Linking
} from 'react-native';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TouchableOpacity, } from 'react-native-gesture-handler';
import { Spinner, Content, Container } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import QB from 'quickblox-react-native-sdk';
import { initiateChat, } from './chatHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Assets/Script/Loader';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'
import { deviceHeight, deviceWidth ,timeCalcForChat} from '../_utils/CommonUtils'
import RNHeicConverter from 'react-native-heic-converter';
// import Common_Color from '../../Assets/Colors/Common_Color'


var dialogCred = ''
var receivedObjects = ''

export default class LPOneToOneChat extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    const och = this
    this.state = {
      chatUser: '',
      isChatConnection: false,
      dialogCred: '',
      sentMessages: [],
      typedMessage: '',
      AppChatUserID: '',
      loader: false
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
      och.addRecentMessages(payload, type)
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
    AppState.addEventListener('change', och.trackAppState)

  }


  componentDidMount = async () => {
    // this.focusSubscription = this.props.navigation.addListener(
    //   "focus",
    //   () => {
    //     this.getChatUser()
    //     // console.log('received messages',receivedNewMessage);
    //     // emitter
    //     // eventHandler
    //   }

    // );
    await AsyncStorage.getItem('chatUserID').then(data => this.setState({ AppChatUserID: data }));
    //  console.log('chatss msg',receivedNewMessage)
    this.getChatUser()
    // this.startChart();
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.trackAppState)
  }

  getChatUser = () => {
    const { chatData } = this.props;
    // const user = navigation.getParam("chatUser");
    //occupants_ids
    console.log('userddd lpchat', chatData)
    this.setState({ chatUser: chatData })
    initiateChat();
    this.checkConnectionFromChatServer();
  }


  checkConnectionFromChatServer = () => {
    QB.chat
      .isConnected()
      .then((connected) => { // boolean
        console.log('is connected', connected);
        this.setState({
          isChatConnection: connected
        })
        if (connected) {
          this.createDialogue()
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

    QB.chat
      .connect({
        userId: chatUserId,
        password: chatUserPwd
      })
      .then(() => {
        this.createDialogue()
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

  createDialogue = async () => {
    const { chatUser } = this.state;
    let chatUserId = await AsyncStorage.getItem('chatUserID');
    console.log('is connecton true', chatUser)
    let id = ''

    if (chatUser.occupants_ids.constructor != Array) {
      id = chatUser.occupants_ids
    } else {

      if (chatUser.occupants_ids[0] == chatUserId) {
        id = chatUser.occupants_ids[1]
      } else {
        id = chatUser.occupants_ids[0]
      }
    }

    // const { id } = chatUser
    console.log('is connecton true', id,'type', typeof parseInt(id))
    QB.chat.createDialog({
      // type: QB.chat.DIALOG_TYPE.CHAT,
      occupantsIds: [parseInt(id)]
    }).then((dialog) => {
      this.setState({
        dialogCred: dialog
      })
      dialogCred = dialog
      this.getDialogChats(dialog)
      console.log('start chart ', dialog)
      // handle as neccessary, i.e.
      // subscribe to chat events, typing events, etc.
    }).catch((e)=> {
      console.log('start chart wrong', e)
      // handle error
    });
  }

  addRecentMessages = (newMessages) => {
    const { sentMessages } = this.state;
    console.log('newMessages from LPC', newMessages)
    // properties: {updated_at: "2020-04-23T06:38:00Z", read: "0"}
    newMessages.properties = { read: "0" };
    // const newMsg = sentMessages.push(newMessages);
    //attachments
    // console.log('the new msgssf',newMessages.attachments)
    if(newMessages.attachments == undefined){
     this.setState(prevState => ({
       sentMessages: sentMessages.length > 0 ? [...prevState.sentMessages, newMessages] : [newMessages]
     }))
    }
    // console.log('new msgss',newMsg);
    // this.setState({sentMessages : newMsg })
  }

  getDialogChats = (dialog, type = '') => {
    const { id, dialogId } = dialog || dialog.dialogId;
    let ids = dialogId ? dialogId : id
    // console.log('received message', id, '--payload id', dialogId)
    // console.log('received message type', ids)
    this.setState({
      loader: true
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
              .catch(function (e) { console.log('line502', e) /* handle error */ });

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
      .catch(function (e) {
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

  onchangeText(text) {
    // userTypingHandler
    // const { dialogCred } = this.state;
    QB.chat
      .sendIsTyping({ dialogId: dialogCred.id })
      .then(function () {
        console.log('this is user is typing')
        /* sent successfully */
      })
      .catch(function (e) {
        console.log('this is user is typing error')
        /* handle error */
      })
    console.log('dialog id ', dialogCred.id)
    this.setState({
      typedMessage: text
    })
  }

  // sendMessage = (typedMessage,imagesSelected=[]) => {

  //   // const { dialogCred, } = this.state
  //   console.log('typed message', typedMessage);
  //   console.log('dilg cred', dialogCred.id);
  //   if (typedMessage == '' && imagesSelected.length == 0) {
  //     return false;
  //   }

  //   this.setState({
  //     typedMessage: ''
  //   });
  //   msgExist = typedMessage == '' ? null : { body: typedMessage }
  //   const message = {
  //     dialogId: dialogCred.id,
  //     ...msgExist,
  //     saveToHistory: true
  //   };

  //   console.log('oimagee bf cond ',imagesSelected);
  //   if (imagesSelected.length > 0) {
  //     console.log('oimagee ',imagesSelected);
  //     this.handlingAttachments(message,imagesSelected)
  //   }else{
  //     QB.chat
  //     .sendMessage(message)
  //     .then(() => {
  //       this.getDialogChats(dialogCred)
  //       console.log('message sent successfully')
  //     })
  //     .catch(function (e) {
  //       console.log('message sent with wrong', e)
  //     })
  //   }

  //   // console.log('ddd',message);
   
  // }
  sendMessage = (messages = '', imagesSelected = {} ) => {
    // debugger
    const { dialogCred, typedMessage } = this.state;
    console.log('dilg cred', dialogCred.id);
    if (messages == '' && imagesSelected.length == 0) {
      return false;
    }

    const message = {
      dialogId:  dialogCred.id,
      body: messages,
      saveToHistory: true
    };

    if (Object.keys(imagesSelected).length > 0) {
      console.log('the object matched',imagesSelected);
      this.handlingAttachments(message, imagesSelected)
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

  // handlingAttachments = (msg,[imgs]) => {
  //   const { uri } = imgs;
  //   const url = uri // path to file in local file system
  //   console.log('handling atta', imgs, '==', msg);
  //   newMessages = {};
  //   newMessages.attachmentsURL = url;
  //   newMessages.body = msg.body ? msg.body : "null";
  //   newMessages.dateSent = new Date().getTime();
  //   newMessages.delayed = false;
  //   newMessages.properties = { read: "0" };
  //   newMessages.senderId = parseInt(this.state.AppChatUserID);

  //   this.setState(prevState => ({
  //     sentMessages: [...prevState.sentMessages, newMessages],
  //     // loader: true
  //   }));

  //   QB.content
  //     .upload({ url, public: false })
  //     .then((file) => {
  //       // attach file
  //       console.log('fille returned', file);
  //       msg.attachments = [{
  //         id: file.uid,
  //         type: file.contentType.includes('image') ? 'image' : 'file'
  //       }];
  //       // send a message
  //       QB.chat
  //         .sendMessage(msg)
  //         .then(() => {
  //           // this.getDialogChats(this.state.dialogCred)
  //           console.log('message sent successfully')
  //         })
  //         .catch(function (e) {
  //           console.log('message sent with wrong',e)
  //         })
  //     })
  //     .catch(function (e) {
  //       /* handle file upload error */
  //       console.log('line566-upload-error', e)
  //     });
  // }
  async handlingAttachments (msg, imgs, grpId) {
    const chatuserId = await AsyncStorage.getItem('chatUserID');
    const {sentMessages} = this.state;
    console.log('the imgss',imgs);
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
    const { path } = img
    url = 'file://'+path
    this.setState({
      sentMessages: sentMessages.length > 0 ? [...this.state.sentMessages, newMessages] : [newMessages],
      // loader: true
    });

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
          .catch((e)=> {
            this.setState({ loader: false });
            console.log('message sent with wrong', e)
          })
      })
      .catch((e)=> {
        /* handle file upload error */
        this.setState({ loader: false });
        console.log('line566-upload-error', e)
      });
  }

  copyChatText = (text) => {
    Clipboard.setString(text)
    //toastMsg('success','message copied');
  }

  revealLink = (link) => {
    Linking.openURL(link);
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

  renderChats = (item, index) => {
    // console.log('indexss',item.body)
    const { dialogId, senderId, recipientId, body, deliveredIds, readIds, dateSent, id } = item;
    const { AppChatUserID } = this.state
    const time = timeCalcForChat(dateSent)
    const msgAsURL = (body == undefined || body == "null") ? false : this.isValidURL(body);
    // console.log('messages items',AppChatUserID);
    if (AppChatUserID == senderId) {
      return (
          <View key={`id${index}`} style={{ alignItems: 'flex-end', }}>
            <View style={{ flexDirection: 'row', marginTop: hp('2%'), marginRight: '3%', }}>
              <View style={{ width: wp('60%') }}>

              <View style={{
                alignItems: 'flex-end', alignSelf: 'flex-end',marginRight:'8%'
               }}>
                 {item.attachmentsURL != undefined ?
                    <View style={{
                      width: 200, height: 200, borderRadius: 20, overflow: 'hidden',
                      justifyContent: 'center', alignItems: 'center'
                    }} >
                      <Image source={{ uri: item.attachmentsURL }} style={{ width: '95%', height: '95%' }}
                        resizeMode={'cover'}
                        borderRadius={20}
                      />
                    </View>
                    : null}
              </View>

              <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end',marginRight:'8%'}}>
              {msgAsURL ?
                <TouchableOpacity onPress={() => this.gotoNF(item)} >
                  <View style={{width: 200, height: 300, overflow: 'hidden', justifyContent: 'center', alignItems: 'center',}} > 
                    <Image source={{ uri: body }} style={{ width: '100%', height: '100%',backgroundColor:'#c1c1c1' }} resizeMode={'cover'} borderRadius={20}/>
                  </View>
                </TouchableOpacity>
                : null}

              </View>

                <View style={{
                  alignItems: 'flex-end', alignSelf: 'flex-end', marginRight: '10%',
                  borderRadius: 15, 
                }}>
                  

                  {body == 'null' || msgAsURL ? null
                    :
                    <View style={{
                      alignItems: 'flex-end', alignSelf: 'flex-end', marginRight: '0%',
                      borderRadius: 15, backgroundColor: '#ff1c49',
                    }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => this.revealLink(body)} onLongPress={() => this.copyChatText(body)} >
                      <Text style={{
                        marginLeft: wp('2%'), marginRight: wp('3%'), color: '#fff', padding: 10,
                        fontSize: profilename.FontSize, fontFamily: profilename.Font
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

                </View>
              </View>
              <View style={{ justifyContent: 'center', alignSelf: 'center', marginRight: '4%', width: 40, height: 40, borderRadius: 40 / 2, overflow: 'hidden', }}>
                <Image source={require('../../Assets/Images/profile.png')} resizeMode={'cover'} style={{ width: '100%', height: '100%', }}></Image>
              </View>
            </View>


         

             <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end', marginRight: '22%', marginTop:2 }}>
                <Text style={{ color: '#000', fontSize: Timestamp.FontSize }}>
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
                <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginLeft: '10%', borderRadius: 15,  }}>


                  {item.attachmentsURL != undefined ?
                    <View style={{
                      width: 200, height: 200, borderRadius: 20, overflow: 'hidden',
                      justifyContent: 'center', alignItems: 'center'
                    }} >
                      <Image source={{ uri: item.attachmentsURL }} style={{ width: '95%', height: '95%' }}
                        resizeMode={'cover'}
                        borderRadius={20}
                      />
                    </View>
                    : null}

            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', }}>
                {msgAsURL ?
                <TouchableOpacity onPress={() => this.gotoNF(item)}  >
                  <View style={{ width: 200, height: 300, borderRadius: 35, overflow: 'hidden',justifyContent: 'center', alignItems: 'center'}} >
                    
                    <Image source={{ uri: body }} style={{ width: '100%', height: '100%' }} resizeMode={'cover'} borderRadius={20}/>
                    
                  </View>
                  
                  </TouchableOpacity>
                  : null}
                  </View>

                  {body == 'null' || msgAsURL ? null
                    :
                    <View style={{  borderRadius: 15, backgroundColor: '#d6d6d6' }}>

                    <TouchableOpacity onLongPress={() => this.copyChatText(body)}>
                      <Text style={{ marginRight: wp('2%'), marginLeft: wp('3%'), color: '#1d1d1d', padding: 10, fontSize: profilename.FontSize, fontFamily: profilename.Font }}>
                        {body}
                      </Text>
                    </TouchableOpacity>
                    </View>
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
          <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginLeft: '22%',marginTop:2 }}>
                    <Text style={{ color: 'black',  fontSize: Timestamp.FontSize }}>
                      {time}
                    </Text>

                  </View>
        </View>


      );
    }



  }



  render() {
    const { chatUser } = this.state;
    return (
      <KeyboardAvoidingView style={{ flex: 1, }}>
        {/* <Container > */}



          {/* <Content style={{ flex:1,backgroundColor:'#fff'}}> */}
          {/* <ScrollView style={{ height: hp('100%') }}> */}
            <View style={{  backgroundColor: '#fff', marginBottom: 20 }}>

              <FlatList
                ref={ref => this.flatList = ref}
                style={{ marginBottom: 60, flexDirection: 'column' }}
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
          {/* </ScrollView> */}
          {/* </Content> */}

        {/* </Container> */}
      </KeyboardAvoidingView>
    )
  }

}
