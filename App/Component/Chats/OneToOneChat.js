import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  FlatList,
  View,
  Text,
  Image,
  Clipboard,
  Linking,
  Animated,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  NativeEventEmitter,
  AppState,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { RawButton, RectButton } from "react-native-gesture-handler";
import { Spinner, Content, Container, Left, Thumbnail } from "native-base";
import serviceUrl from "../../Assets/Script/Service";
import QB from "quickblox-react-native-sdk";
import { Icon } from "react-native-elements";
import styles from "./chatStyle";
const imagePath = "../../Assets/Images/";
import { initiateChat } from "./chatHelper";
import Loader from "../../Assets/Script/Loader";
import { toastMsg } from "../../Assets/Script/Helper";
import LinearGradient from "react-native-linear-gradient";
import { Toolbar } from "../commoncomponent";
import {
  deviceHeight,
  deviceWidth,
  timeCalcForChat,
} from "../_utils/CommonUtils";
import Modal from "react-native-modal";
import {
  Common_Color,
  TitleHeader,
  Username,
  profilename,
  Description,
  Viewmore,
  UnameStory,
  Timestamp,
  Searchresult,
} from "../../Assets/Colors";
import stylesFromToolbar from "../commoncomponent/Toolbar/styles";
import ImageView from "react-native-image-view";
import RNHeicConverter from "react-native-heic-converter";

// import fakeMessages from './fakemessages.json'

var dialogCred = "";
var receivedObjects = "";

const { profilePic } = serviceUrl;
var hrs,
  sec,
  min = "";
export default class OneToOneChat extends Component {
  // static navigationOptions = {
  //   header: null,
  // };

  constructor(props) {
    super(props);
    const och = this;
    this.state = {
      chatUser: "",
      isChatConnection: false,
      dialogCred: "",
      sentMessages: [],
      typedMessage: "",
      AppChatUserID: "",
      loader: false,
      actionList: false,
      avatarSource: "",
      avatarSource1: "",
      imagesSelected: [],
      ownerPic: "",
      userTypingActivate: false,
      typingUserID: null,
      animation: new Animated.Value(0),
      propMulti: false,
      imageView: false,
      keyboardOffset: 0,
    };

    this.emitter = new NativeEventEmitter(QB.chat);

    const eventHandler = (event) => {
      const { type, payload } = event;

      console.log("event emitter type", type, "---payload", payload);
      // type - type of the event (string)
      // payload - new message (object)
    };

    function connectionEventHandler(event) {
      // console.log('connection Event Handler', event)
      // handle connection event
    }

    const receivedNewMessage = (event) => {
      const { type, payload } = event;
      // this.props(payload)

      // console.log('received message type', type, '--payload', payload);

      // handle new message
      // type - event name (string)
      // payload - message received (object)
      // return payload;
      // return true;
      receivedObjects = payload;
    };

    function newMessageHandler(event) {
      const {
        type, // name of the event (the one we've subscribed on)
        payload, // event data (new message in this case)
      } = event;
      receivedObjects = payload;
      och.addRecentMessages(payload);
      // och.getDialogChats(payload, type,loader=false)
      // console.log(
      //   "received new message type-newMessageHandler",
      //   type,
      //   "--payload",
      //   payload
      // );
    }

    function messageStatusHandler(event) {
      console.log("message Status Handler", event);
      // handle message status change
    }

    function systemMessageHandler(event) {
      console.log("system Message Handler", event);
      // handle system message
    }

    function userTypingHandler(event) {
      console.log("user Typing Handler", event);
      // this.setState({
      console.log("this.state");
      // if(event && event !=undefined){
      //   const type = event.type
      //   if(type == "@QB/USER_IS_TYPING"){
      //     och.startTyping(event.payload)
      //   }else if(type == "@QB/USER_STOPPED_TYPING"){
      //     och.stopTyping(event.payload)
      //   }
      // }
      // this.state.userTypingActivate = !this.state.userTypingActivate
      // })
      // handle user typing / stopped typing event
    }

    function messageDelivered(event) {
      const {
        type, // name of the event (the one you've subscribed for)
        payload, // event data
      } = event;
      const {
        dialogId, // in dialog with id specified
        messageId, // message with id specified
        userId, // was delivered to user with id specified
      } = payload;
      // handle as necessary
    }

    const QBConnectionEvents = [
      QB.chat.EVENT_TYPE.CONNECTED,
      QB.chat.EVENT_TYPE.CONNECTION_CLOSED,
      QB.chat.EVENT_TYPE.CONNECTION_CLOSED_ON_ERROR,
      QB.chat.EVENT_TYPE.RECONNECTION_FAILED,
      QB.chat.EVENT_TYPE.RECONNECTION_SUCCESSFUL,
    ];

    QBConnectionEvents.forEach((eventName) => {
      this.emitter.addListener(eventName, connectionEventHandler);
    });

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      receivedNewMessage
    );

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      newMessageHandler
    );

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.MESSAGE_DELIVERED,
      messageStatusHandler
    );

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.MESSAGE_READ,
      messageStatusHandler
    );

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_SYSTEM_MESSAGE,
      systemMessageHandler
    );

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.USER_IS_TYPING,
      userTypingHandler
    );

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.USER_STOPPED_TYPING,
      userTypingHandler
    );

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      eventHandler
    );

    this.emitter.addListener(
      QB.chat.EVENT_TYPE.MESSAGE_DELIVERED,
      messageDelivered
    );

    this.getDialogChats = this.getDialogChats.bind(this);
    AppState.addEventListener("change", och.trackAppState);
  }

  componentDidMount = async () => {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardWillShow.bind(this)
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardWillHide.bind(this)
    );
    const prop = this.props.route.params.imgProp;
    this.focusSubscription = this.props.navigation.addListener("focus", () => {
      this.imageManipulte();
      if (prop == undefined) {
        this.getChatUser();
      }

      // this.imageManipulte1()
    });
    await AsyncStorage.getItem("chatUserID").then((data) =>
      this.setState({ AppChatUserID: data })
    );
  };

  componentWillUnmount() {
    // Dimensions.removeEventListener('change', this.onChangeDimension);
    AppState.removeEventListener("change", this.trackAppState);
    this.emitter.removeListener();
    this.keyboardWillShowSub?.remove();
    this.keyboardWillHideSub?.remove();
  }

  keyboardWillShow(event) {
    // console.log('the event show',event);
    this.setState({
      keyboardOffset: event.endCoordinates.height,
    });
  }

  keyboardWillHide() {
    this.setState({
      keyboardOffset: 0,
    });
  }

  toggleOpen = () => {
    const { actionList } = this.state;
    if (this._open) {
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    this._open = !this._open;
    // this.setState({
    //   actionList : !actionList
    // });
  };

  pickGallery = () => {
    this.toggleOpen();
    const { navigation } = this.props;
    let screenProps = "OneToOneChat";
    navigation.navigate("GalleryPicker", {
      screen: screenProps,
      type: "Photos",
      multiPic: true,
    });
  };

  imageManipulte = () => {
    console.log("called method");
    const { navigation } = this.props;
    const prop = this.props.route.params.imgProp;
    if (prop == undefined) {
      return false;
    }
    console.log("image manipulate", prop.MultiModal);
    if (prop.e && prop.e.length > 0) {
      this.setState({
        propMulti: true,
        photoPath: prop.e[0].node.image.uri.replace("file:///", ""),
        photoPath1: prop.e[0].node.image.uri,
        imagesSelected: prop.e.map((i, index) => {
          return {
            uri: i.node.image.uri,
            width: i.node.image.width,
            height: i.node.image.height,
            mime: i.node.type,
            imageIndex: index,
          };
        }),
      });
    }
  };

  renderImage2(image) {
    debugger;
    return (
      <TouchableOpacity onPress={() => this._setSelectedImage(image)}>
        <View
          style={{
            backgroundColor: "#c1c1c1",
            width: 45,
            height: 70,
            borderRadius: 5,
            overflow: "hidden",
            borderWidth: 0.6,
            borderColor: "#fff",
            marginRight: 8,
            flexWrap: "wrap",
          }}
        >
          <Image
            onPress={() => this._setSelectedImage(image)}
            style={{ width: "100%", height: "100%" }}
            source={image}
          />
        </View>

        {/* <TextInput placeholder='Type here...' placeholderTextColor='#fff'
              style={styles.textInput} /> */}
      </TouchableOpacity>
    );
  }
  _setSelectedImage(image) {
    debugger;
    this.setState({
      photoPath: image.uri.replace("file:///", ""),
      photoPath1: image.uri,
    });
  }

  imageFullView = (url) => {
    this.setState({
      imageView: true,
      imageViewData: [
        {
          source: {
            uri: url,
          },
        },
      ],
    });
  };

  isImagePicked = () => {
    const { imagesSelected } = this.state;
    if (imagesSelected.length > 0) {
      return (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight * 0.13,
            backgroundColor: "rgba(0,0,0,.5)",
            bottom: 55,
            position: "absolute",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: deviceWidth,
              height: deviceHeight * 0.13,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                flexDirection: "row",
                alignItems: "flex-start",
                paddingStart: 5,
                paddingEnd: 5,
              }}
            >
              {this.state.imagesSelected.length > 0
                ? this.state.imagesSelected.map((i) => (
                    <View key={i.uri}>{this.renderImage(i)}</View>
                  ))
                : null}
            </ScrollView>
          </View>
        </View>
      );
    }
  };

  renderImage(image) {
    return (
      <TouchableOpacity onPress={() => alert("sss")}>
        <View
          style={{
            backgroundColor: "#c1c1c1",
            width: 45,
            height: 70,
            borderRadius: 5,
            overflow: "hidden",
            borderWidth: 0.6,
            borderColor: "#fff",
            marginRight: 8,
            flexWrap: "wrap",
          }}
        >
          <Image style={{ width: "100%", height: "100%" }} source={image} />
        </View>

        {/* <TextInput placeholder='Type here...' placeholderTextColor='#fff'
                style={styles.textInput} /> */}
      </TouchableOpacity>
    );
  }

  getChatUser = async () => {
    // debugger;
    const { navigation } = this.props;
    const user = this.props.route.params.chatUser;
    // const sendToPost = navigation.getParam('sendToImg');
    const prop = this.props.route.params.imgProp;
    console.log("the propis ", prop);
    console.log("user", "---", user);

    // console.log('send to pose ', sendToPost)
    const ownerPic = await AsyncStorage.getItem("ProfilePic");
    this.setState({
      chatUser: user,
      ownerPic: ownerPic,
      loader: prop != undefined ? false : true,
    });
    initiateChat();
    this.getSessions();
  };

  /**
   * @For Newsfeed sendto
   */
  initChatForNF = async () => {
    initiateChat();
    // return true;
    //  this.checkConnectionFromChatServerForNF();
  };

  checkConnectionFromChatServerForNF = async () => {
    try {
      const connected = await QB.chat.isConnected();
      // console.log('the connected',connected);
      return connected;
    } catch (e) {
      console.log("is connected", e);
      return false;
    }
  };

  getSessionForNF = async () => {
    try {
      const session = QB.auth.getSession();
      return session;
    } catch (err) {
      console.log("the current session error", err);
      return false;
    }
  };

  createDialogueForNF = async (user) => {
    const occu_id = parseInt(user.occupants_ids);

    const params = {
      // type: QB.chat.DIALOG_TYPE.CHAT,
      occupantsIds: [occu_id],
    };
    console.log("the occu id params", params);
    try {
      const dialog = await QB.chat.createDialog(params);
      console.log("after create dilg", dialog);
      return dialog;
    } catch (error) {
      console.log("start createDialog wrong", error);
      return false;
    }
  };

  createSessionForNF = async () => {
    let chatUserId = await AsyncStorage.getItem("chatUserID");
    let chatUserPwd = await AsyncStorage.getItem("chatUserPWD");
    let loginCred = await AsyncStorage.getItem("email");
    // console.log('the loginCred ',typeof loginCred);
    // console.log('the chatUserPwd ',chatUserPwd);
    try {
      const info = await QB.auth.login({
        login: loginCred,
        password: chatUserPwd,
      });
      return info;
    } catch (error) {
      console.log("users info with error", error);
      return false;
    }
  };

  createConnectionToServerForNF = async () => {
    let chatUserId = await AsyncStorage.getItem("chatUserID");
    let chatUserPwd = await AsyncStorage.getItem("chatUserPWD");
    console.log("the user pwd ", chatUserPwd);
    let loginCred = await AsyncStorage.getItem("email");
    try {
      const server = await QB.chat.connect({
        userId: chatUserId,
        password: chatUserPwd,
      });
      console.log("create Connection To Server");
      return true;
    } catch (error) {
      console.log("create Connection To Server wrong", error);
      return false;
    }
  };

  sendMessageForNF = async ({ id }, typedMsg, feedData) => {
    console.log("the id", id, "--", typedMsg);
    if (typedMsg == "") {
      return false;
    }
    const message = {
      dialogId: id,
      body: typedMsg.trim(),
      properties: {
        feedData: JSON.stringify(feedData),
      },
      saveToHistory: true,
    };
    // console.log('the message ',message);
    try {
      const sent = await QB.chat.sendMessage(message);
      console.log("message sent successfully");
      return true;
    } catch (error) {
      console.log("message sent with wrong", error);
      return false;
    }
  };

  /**
   * @For Current chat
   */
  checkConnectionFromChatServer = () => {
    QB.chat
      .isConnected()
      .then((connected) => {
        // boolean
        console.log("is connected", connected);
        this.setState({
          isChatConnection: connected,
        });
        if (connected) {
          this.createDialogue();
        } else {
          this.createConnectionToServer();
        }
        // handle as necessary, i.e.
        // if (connected === false) reconnect()
      })
      .catch(function (e) {
        console.log("is connected", e);
        // reconnect()
        // handle error
      });
  };

  getSessions = async () => {
    // debugger;
    QB.auth
      .getSession()
      .then((session) => {
        console.log("the session", session);
        if (session && session.token) {
          this.checkConnectionFromChatServer();
        } else {
          this.createSession();
        }
      })
      .catch((err) => {
        console.log("the current session error", err);
      });
  };

  createSession = async () => {
    // debugger;
    let chatUserId = await AsyncStorage.getItem("chatUserID");
    let chatUserPwd = await AsyncStorage.getItem("chatUserPWD");
    let loginCred = await AsyncStorage.getItem("email");
    console.log("the pwd", chatUserPwd);
    console.log("the cred", loginCred);
    QB.auth
      .login({
        login: loginCred,
        password: chatUserPwd,
      })
      .then((info) => {
        console.log("users info", info);
        this.createConnectionToServer();
        // signed in successfully, handle info as necessary
        // info.user - user information
        // info.session - current session
      })
      .catch((e) => {
        console.log("users info with error", e);
        this.setState({
          loader: false,
        });
        // handle error
      });
  };

  createConnectionToServer = async () => {
    let chatUserId = await AsyncStorage.getItem("chatUserID");
    let chatUserPwd = await AsyncStorage.getItem("chatUserPWD");
    let loginCred = await AsyncStorage.getItem("email");
    console.log("the conn to server", chatUserId, chatUserPwd);
    QB.chat
      .connect({
        userId: chatUserId,
        password: chatUserPwd,
      })
      .then(() => {
        this.createDialogue();
        console.log("create Connection To Server");
        // connected successfully
      })
      .catch((e) => {
        console.log("create Connection To Server wrong", e);
        // some error occurred
      });
  };

  async trackAppState(appState) {
    let chatUserId = await AsyncStorage.getItem("chatUserID");
    let chatUserPwd = await AsyncStorage.getItem("chatUserPWD");
    // console.log('user id',chatUserId,'-',chatUserPwd,'and its type',typeof chatUserId,'-',typeof chatUserId )
    if (chatUserId !== null && chatUserPwd !== null)
      if (appState.match(/inactive|background/)) {
        QB.chat
          .disconnect()
          .then(function () {
            console.log("App in bg disconnect()");
            /* disconnected successfully */
          })
          .catch(function (e) {
            console.log("App in bg with disconnect error", e);
            /* handle error */
          });
      } else {
        const connected = await QB.chat.isConnected();
        console.log("the track app isQBConnected", connected);
        if (!connected)
          QB.chat
            .connect({
              userId: chatUserId,
              password: chatUserPwd,
            })
            .then(function () {
              console.log("App in bg connect() succefully");
              /* connected successfully */
            })
            .catch(function (e) {
              console.log("App in bg with connection error", e);
              /* some error occurred */
            });
      }
  }
  // createSession = async() =>{

  // }

  createDialogue = async () => {
    debugger;
    const { chatUser, loader } = this.state;
    let chatUserId = await AsyncStorage.getItem("chatUserID");
    console.log("is connecton true", chatUser);
    let id = "";

    if (chatUser.occupants_ids.constructor != Array) {
      id = chatUser.occupants_ids;
    } else {
      if (chatUser.occupants_ids[0] == chatUserId) {
        id = chatUser.occupants_ids[1];
      } else {
        id = chatUser.occupants_ids[0];
      }
    }
    //.filter(d=> chatUserId==chatUser.user_id ? d!=chatUserId: d==chatUserId )

    // const { id } = chatUser
    console.log("is connecton true", id, "type", typeof id);

    //QB.chat.dialog.create(params, function(error, dialog) {});

    // this.getDialogChats({id:chatUser._id}, '', loader ? true : false)
    QB.chat
      .createDialog({
        //hide by mufthi
        // type: QB.chat.DIALOG_TYPE.CHAT,
        occupantsIds: [parseInt(id)],
      })
      .then((dialog) => {
        this.setState({
          dialogCred: dialog,
        });
        dialogCred = dialog;
        this.getDialogChats(dialog, "", loader ? true : false);
      })
      .catch((e) => {
        console.log("start chart wrong", e);
        this.setState({
          loader: false,
        });
        // handle error
      });
  };

  getDialogChats = (dialog, type = "", isLoaderActive = true) => {
    console.log("is loader dialog", dialog);
    const { id, dialogId } = dialog || dialog.dialogId;
    let ids = dialogId ? dialogId : id;
    console.log("received message", id, "--payload id", dialogId);
    console.log("received message type", ids);

    this.setState({
      loader: isLoaderActive,
    });

    QB.chat
      .getDialogMessages({
        dialogId: ids,
        sort: {
          ascending: true,
          field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT,
        },
        markAsRead: false,
      })
      .then((result) => {
        console.log("retrieved messages", result);
        // let result = fakeMessage.result;
        // console.log('the result ',result)
        let bulkMessages =
          result.messages.length > 0 &&
          result.messages.map((m) => {
            const param = {
              message: {
                id: m.id,
                dialogId: m.dialogId,
                senderId: m.senderId,
              },
            };
            QB.chat
              .markMessageRead(param)
              .then(() => {
                /*console.log('marked successfully');*/
              })
              .catch((e) => {
                console.log("marked error", e);
              });

            if (m.attachments != undefined) {
              const [attachment] = m.attachments;
              // let attURL = ''
              QB.content
                .getPrivateURL({ uid: attachment.id })
                .then((url) => {
                  // attURL = url;
                  // console.log('the attachment url',url);
                  m.attachmentsURL = url;
                  /* you download file using obtained url */
                })
                .catch(function (e) {
                  console.log("line502", e); /* handle error */
                });
              // this.readMsg()
            }

            return m;
          });
        console.log("the bulk messages is ", bulkMessages);
        this.setState({
          sentMessages: !bulkMessages ? [] : bulkMessages,
          loader: false,
        });

        // result.messages - array of messages found
        // result.skip - number of items skipped
        // result.limit - number of items returned per page
      })
      .catch((e) => {
        this.setState({
          loader: false,
        });
        console.log("the gete dilg", e);
        // handle error
      });
  };

  // readMsg = () => {
  //   const messageId = '5f64ae115d0496d5362cf6c8';
  //   const dialogId = '5f58a981a28f9a6c6f2944d1';
  //   QB.chat
  //   .markMessageRead({ messageId, dialogId })
  //   .then(() =>{ console.log('the msg read success') })
  //   .catch((e) => { console.log('the msg read success error',e,'\n',e.message) })
  // }

  isLoader = () => {
    const { loader } = this.state;
    if (loader) {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Loader />
        </View>
      );
    }
  };

  startTyping = ({ dialogId = "", userId = "" }) => {
    // userTypingHandler
    // const { dialogCred } = this.state;
    if (dialogId == "") {
      return false;
    }
    QB.chat
      .sendIsTyping({ dialogId: dialogId })
      .then(() => {
        console.log("this is user is typing");
        this.setState({ userTypingActivate: !this.state.userTypingActivate });
        /* sent successfully */
      })
      .catch(function (e) {
        console.log("this is user is typing error");
        this.setState({ userTypingActivate: false });
        /* handle error */
      });
    console.log("that userid is", userId);
    //this.setState({typingUserID:userId})

    // console.log('dialog id ', dialogCred.id)
  };

  stopTyping = ({ dialogId = "" }) => {
    if (dialogId == "") {
      return false;
    }

    QB.chat
      .sendStoppedTyping({ dialogId: dialogId })
      .then(() => {
        this.setState({ userTypingActivate: false });
      })
      .catch((e) => {
        /* handle error */
        console.log("method-stopTyping", e);
        this.setState({ userTypingActivate: false });
      });
  };

  userTypingBind = () => {
    const { userTypingActivate, AppChatUserID, typingUserID } = this.state;
    if (userTypingActivate) {
      // if(typingUserID != null && AppChatUserID != typingUserID){
      return <Text style={{ textAlign: "center" }}>typing...</Text>;
      // }
    }
  };

  addRecentMessages = (newMessages) => {
    const { sentMessages, AppChatUserID, chatUser } = this.state;
    console.log("newMessages", newMessages);
    // properties: {updated_at: "2020-04-23T06:38:00Z", read: "0"}
    newMessages.properties = { read: "0" };
    const occupants_ids = chatUser && chatUser.occupants_ids;
    const recipientId = newMessages.recipientId;
    const senderId = newMessages.senderId;
    // console.log('the occu idss',occupants_ids);
    // console.log('the app user id ',AppChatUserID,'and sendr || rec id ',newMessages,'|| chatUser',chatUser)
    if (
      occupants_ids &&
      occupants_ids.includes(recipientId) &&
      occupants_ids.includes(senderId)
    ) {
      if (newMessages.attachments == undefined) {
        this.setState((prevState) => ({
          sentMessages:
            sentMessages.length > 0
              ? [...prevState.sentMessages, newMessages]
              : [newMessages],
        }));
      }
    }
    // this.setState(prevState => ({
    //   sentMessages: [...prevState.sentMessages, newMessages]
    // })) //old one 110920
    // console.log('new msgss',newMsg);
    // this.setState({sentMessages : newMsg })
  };

  onchangeText(text) {
    const { dialogCred } = this.state;
    // this.startTyping({dialogId:dialogCred.id});
    // this.stopTyping({dialogId:dialogCred.id});
    this.setState({
      typedMessage: text,
    });
  }

  // sendMessage = () => {

  //   const { dialogCred, typedMessage, imagesSelected } = this.state

  //   if (typedMessage == '' && imagesSelected.length == 0) {
  //     return false;
  //   }

  //   this.setState({
  //     typedMessage: '',
  //     imagesSelected: [],propMulti:false
  //   });
  //   msgExist = typedMessage == '' ? null : { body: typedMessage }
  //   const message = {
  //     dialogId: dialogCred.id,
  //     ...msgExist,
  //     saveToHistory: true
  //   };

  //   if (imagesSelected.length > 0) {
  //     this.handlingAttachments(message)
  //   } else {
  //     QB.chat
  //       .sendMessage(message)
  //       .then(() => {
  //         // this.getDialogChats(this.state.dialogCred,'',)
  //         console.log('message sent successfully')
  //       })
  //       .catch(function (e) {
  //         console.log('message sent with wrong')
  //       })
  //   }

  //   // console.log('ddd',message);

  // }

  sendMessage = () => {
    debugger;
    var imgStr = [];
    const { typedMessage, imagesSelected, dialogCred } = this.state;
    const { navigation } = this.props;
    // let datas = navigation.getParam('datas');
    console.log("bfr split", imagesSelected);

    if (typedMessage == "" && imagesSelected.length == 0) {
      return false;
    }
    const isImages =
      imagesSelected.length > 0 &&
      imagesSelected.map((m) => {
        console.log("the mm", m);
        this.sendMessage1(typedMessage, m);
      });

    if (!isImages) {
      this.sendMessage1(typedMessage);
    }
    // console.log('the images exist',isImages);

    this.setState({
      typedMessage: "",
      imagesSelected: [],
      propMulti: false,
    });
  };

  sendMessage1 = async (messages = "", imagesSelected = {}) => {
    debugger;
    const { dialogCred, typedMessage, chatUser } = this.state;
    console.log("dilg cred", dialogCred.id);
    // console.log('chatUser', chatUser);
    // console.log('chatUser id',chatUser._id);
    if (messages == "" && imagesSelected == undefined) {
      return false;
    }

    const msgExist = typedMessage == "" ? null : { body: typedMessage };
    const message = {
      dialogId: chatUser._id || dialogCred.id,
      ...msgExist,
      saveToHistory: true,
    };

    console.log("obj message", message);

    if (Object.keys(imagesSelected).length > 0) {
      console.log("the object matched", imagesSelected);
      this.handlingAttachments(message, imagesSelected);
    } else {
      QB.chat
        .sendMessage(message)
        .then(() => {
          // this.getDialogChats(grpId)
          console.log("message sent successfully");
        })
        .catch((e) => {
          console.log("message sent with wrong", e);
        });
    }
  };

  // handlingAttachments = (msg) => {
  //   const { avatarSource1 } = this.state;
  //   const url = avatarSource1 // path to file in local file system
  //   console.log('handling atta', url, '==', msg);
  //   newMessages = {};
  //   newMessages.attachmentsURL = url;
  //   newMessages.body = msg.body ? msg.body : "null";
  //   newMessages.dateSent = new Date().getTime();
  //   newMessages.delayed = false;
  //   newMessages.properties = { read: "0" };
  //   newMessages.senderId = this.state.AppChatUserID;
  //   console.log('new msgsss', newMessages);

  //   this.setState(prevState => ({
  //     sentMessages: [...prevState.sentMessages, newMessages],
  //     loader: true
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
  //           this.setState({
  //             loader: false
  //           });
  //           this.getDialogChats(this.state.dialogCred)
  //           console.log('message sent successfully')
  //         })
  //         .catch(function (e) {
  //           this.setState({
  //             loader: false
  //           });
  //           console.log('message sent with wrong', e)
  //         })
  //     })
  //     .catch(function (e) {
  //       /* handle file upload error */
  //       this.setState({
  //         loader: false
  //       });
  //       console.log('line566-upload-error', e)
  //     });
  // }

  convertLocalIdentifierToAssetLibrary = (localIdentifier, ext) => {
    const hash = localIdentifier.split("/")[0];
    return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
  };

  async handlingAttachments(msg, imgs, grpId) {
    const chatuserId = await AsyncStorage.getItem("chatUserID");
    const { sentMessages } = this.state;
    console.log("the imgss", imgs);
    const { uri } = imgs;
    //imgs.constructor == Array ? [imgs] : imgs;
    let url = uri; // path to file in local file system
    //const url = []
    //imgs.map(a=> { url.push(a.uri)});
    //console.log('image url :', typeof imgs );
    console.log("handling attaccc", imgs, "==", msg);
    const newMessages = {};

    newMessages.attachmentsURL = url;

    newMessages.body = msg.body ? msg.body : "null";
    newMessages.dateSent = new Date().getTime();
    newMessages.delayed = false;
    newMessages.properties = { read: "0" };
    newMessages.senderId = parseInt(chatuserId);
    console.log("new msgsss", newMessages);
    // url = this.convertLocalIdentifierToAssetLibrary(url.replace('ph://', ''),'JPG')
    let img = {}
    if(Platform.OS == 'ios'){
      img = await RNHeicConverter.convert({ path: url })
    }
    
    // console.log("the img path", img);
    const { path } = img;
    url = Platform.OS == 'ios' ? "file://" + path : uri;
    // url = path
    this.setState({
      sentMessages:
        sentMessages.length > 0
          ? [...this.state.sentMessages, newMessages]
          : [newMessages],
      // loader: true
    });
    // url = `${url}`
    console.log("fille conURL", url, typeof url);
    QB.content
      .upload({ url, public: false })
      .then((file) => {
        // attach file
        console.log("fille returned", file);
        msg.attachments = [
          {
            id: file.uid,
            type: file.contentType.includes("image") ? "image" : "file",
          },
        ];
        msg.body = "null";
        // send a message
        QB.chat
          .sendMessage(msg)
          .then(() => {
            // this.setState({ loader: false });
            // this.getDialogChats(grpId)
            console.log("message sent successfully");
          })
          .catch((e) => {
            this.setState({ loader: false });
            console.log("message sent with wrong", e);
          });
      })
      .catch((e) => {
        /* handle file upload error */
        this.setState({ loader: false });
        console.log("line566-upload-errorrrrrrr", e);
      });
  }

  copyChatText = (text) => {
    Clipboard.setString(text);
    //toastMsg('success', 'message copied');
  };

  revealLink = (link) => {
    Linking.openURL(link);
  };

  // timeCalc(time) {
  //   switch (typeof time) {
  //     case 'number':
  //       time = +new Date(time);
  //       break;
  //     case 'string':
  //       time = +new Date(time);
  //       break;
  //     case 'object':
  //       if (time.constructor === Date) time = time.getTime();
  //       break;
  //     default:
  //       time = +new Date();
  //   }
  //   var time_formats = [
  //     [60, ' sec', 1], // 60
  //     [120, '1 minute ago', '1 minute from now'], // 60*2
  //     [3600, ' minutes', 60], // 60*60, 60
  //     [7200, '1 hour ago', '1 hour from now'], // 60*60*2
  //     [86400, ' hours', 3600], // 60*60*24, 60*60
  //     [172800, '1 day ago', 'Tomorrow'], // 60*60*24*2
  //     [604800, ' days', 86400], // 60*60*24*7, 60*60*24
  //     [1209600, 'l week ago', 'Next week'], // 60*60*24*7*4*2
  //     [2419200, ' weeks', 604800], // 60*60*24*7*4, 60*60*24*7
  //     [4838400, 'l month ago', 'Next month'], // 60*60*24*7*4*2
  //     [29030400, ' months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
  //     [58060800, 'l year ago', 'Next year'], // 60*60*24*7*4*12*2
  //     [2903040000, ' years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
  //     [5806080000, 'l cen ago', 'Next century'], // 60*60*24*7*4*12*100*2
  //     [58060800000, 'lcen', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  //   ];

  //   var seconds = (+new Date() - time) / 1000,
  //     token = 'ago',
  //     list_choice = 1;

  //   if (seconds == 0) {
  //     return 'Just now'
  //   }
  //   if (seconds < 0) {
  //     seconds = Math.abs(seconds);
  //     token = 'from now';
  //     list_choice = 2;
  //   }
  //   var i = 0,
  //     format;
  //   while (format = time_formats[i++])
  //     if (seconds < format[0]) {
  //       if (typeof format[2] == 'string')
  //         return format[list_choice];
  //       else
  //         return Math.floor(seconds / format[2]) + format[1] + ' ' + token;
  //       //return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
  //     }
  //   return time;
  // }

  isValidURL = (str) => {
    // console.log('the str is ',str);
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\@[;&a-z\\d%_.~+=-]*)?" + //ms->include @
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    // console.log('the pattern is',pattern);
    return !!pattern.test(str);
  };

  gotoNF = (data) => {
    const feedDataStr = data.properties.feedData;
    const feedData = feedDataStr ? JSON.parse(feedDataStr) : [];
    // console.log('the data',feedData);
    const FD =
      feedData.length > 0 &&
      feedData.map((d) => {
        d.likes = d.userLiked;
        d.Bookmarks = d.userBookmarked;
        d.NewsFeedPost = d.Image;
        d.likecount = d.LikeCount;
        return d;
      });
    const memoryData = { status: "True", result: FD };
    console.log("the sd oside cond", memoryData);
    if (FD) {
      console.log("the sd iside cond", memoryData);
      var props = {
        screenName: "Chat",
        selectedPostId: 0,
        memoryData: memoryData,
      };
      this.props.navigation.navigate("GetData", { data: props });
    }
  };

  renderChats = (item, index) => {
    // console.log('indexss',item.body)
    const {
      AppChatUserID,
      ownerPic,
      chatUser,
      typingUserID,
      sentMessages,
    } = this.state;
    const {
      dialogId,
      senderId,
      recipientId,
      body,
      attachments,
      deliveredIds,
      readIds,
      dateSent,
      id,
      properties,
    } = item;
    // console.log('the propss',properties);
    const time = timeCalcForChat(dateSent);
    // console.log('the body type',body , 'and the type ', typeof body);
    const msgAsURL =
      body == undefined || body == "null" ? false : this.isValidURL(body);
    // console.log('is valid url ',msgAsURL);
    if (AppChatUserID == senderId) {
      return (
        <View key={`id${index}`} style={{ alignItems: "flex-end" }}>
          <View
            style={{
              flexDirection: "row",
              marginTop: hp("2%"),
              marginRight: "3%",
            }}
          >
            <View style={{ width: wp("60%") }}>
              <View
                style={{
                  alignItems: "flex-end",
                  alignSelf: "flex-end",
                  marginRight: "8%",
                }}
              >
                {item.attachmentsURL != undefined ? (
                  <View
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 20,
                      overflow: "hidden",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{ width: "100%", height: "100%" }}
                      activeOpacity={0.8}
                      onPress={() => this.imageFullView(item.attachmentsURL)}
                    >
                      <Image
                        source={{ uri: item.attachmentsURL }}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#c1c1c1",
                        }}
                        resizeMode={"cover"}
                        borderRadius={20}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                  alignSelf: "flex-end",
                  marginRight: "8%",
                }}
              >
                {msgAsURL ? (
                  <TouchableOpacity onPress={() => this.gotoNF(item)}>
                    <View
                      style={{
                        width: 200,
                        height: 300,
                        overflow: "hidden",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={{ uri: body }}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#c1c1c1",
                        }}
                        resizeMode={"cover"}
                        borderRadius={20}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* <View style={{
                alignItems: 'flex-end', alignSelf: 'flex-end', borderRadius: 15,
                marginTop:12,
               }}> */}
              {body == "null" || msgAsURL ? null : (
                <View
                  style={{
                    alignItems: "flex-end",
                    alignSelf: "flex-end",
                    marginRight: "8%",
                    borderRadius: 15,
                    backgroundColor: "#ff1c49",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.revealLink(body)}
                    onLongPress={() => this.copyChatText(body)}
                  >
                    <Text
                      style={{
                        marginLeft: wp("2%"),
                        marginRight: wp("3%"),
                        color: "#fff",
                        padding: 10,
                        lineHeight: 20,
                        fontSize: profilename.FontSize,
                        fontFamily: profilename.Font,
                      }}
                    >
                      {body}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* </View> */}
              {/* <View style={{ flexDirection: 'row' ,marginLeft:1}}>
                    <Text style={{ color: '#fff', padding: 10, lineHeight: 2, fontFamily: Timestamp.Font,fontSize:Timestamp.FontSize }}>
                      {time}
                    </Text>
                    {properties.read == "0" ?
                      <Image source={require('../../Assets/Images/singletickWhite.png')} style={{ marginTop: 3, width: '7%', height: '40%',marginRight:20 }}></Image>
                      :
                      <Image source={require('../../Assets/Images/whitetick.png')} style={{ marginTop: 3, width: '7%', height: '40%',marginRight:20 }}></Image>
                    }

                  </View> */}

              <View
                style={{
                  alignItems: "flex-end",
                  alignSelf: "flex-end",
                  marginRight: "8%",
                  marginTop: 2,
                }}
              >
                <Text style={{ color: "#000", fontSize: Timestamp.FontSize }}>
                  {time}
                </Text>
              </View>
              {/* </View> */}

              {/* { typingUserID == null && sentMessages[sentMessages.length -1] == index
               ?<Text style={{ marginLeft: wp('2%'), marginRight: wp('3%'), color: '#fff', padding: 10,
                 lineHeight: 20, fontFamily: Commmon_Color.fontMedium }}> 
                  .....
                </Text>
               :null */}
            </View>

            <View
              style={{
                justifyContent: "center",
                alignSelf: "center",
                marginRight: "3%",
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                overflow: "hidden",
              }}
            >
              {ownerPic == "" ? (
                <Image
                  source={require("../../Assets/Images/profile.png")}
                  style={{
                    resizeMode: "cover",
                    width: 40,
                    height: 40,
                    backgroundColor: "#c1c1c1",
                  }}
                ></Image>
              ) : (
                <Image
                  source={{ uri: profilePic + ownerPic }}
                  resizeMode={"cover"}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#c1c1c1",
                  }}
                ></Image>
              )}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          key={`id${index}`}
          style={{ backgroundColor: "#fff", flexDirection: "column" }}
        >
          <View style={{ alignItems: "flex-start" }}>
            <View
              style={{
                flexDirection: "row",
                marginTop: hp("2%"),
                marginLeft: "3%",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignSelf: "center",
                  marginLeft: "3%",
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  overflow: "hidden",
                }}
              >
                {chatUser.ProfilePic == "null" ||
                chatUser.ProfilePic == null ? (
                  <Image
                    source={require("../../Assets/Images/profile.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#c1c1c1",
                    }}
                  ></Image>
                ) : (
                  <Image
                    source={{ uri: profilePic + chatUser.ProfilePic }}
                    resizeMode={"cover"}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#c1c1c1",
                    }}
                  ></Image>
                )}
              </View>

              <View style={{ width: wp("60%") }}>
                {/* <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginLeft: '8%', borderRadius: 15, backgroundColor: '#d6d6d6' }}> */}

                <View
                  style={{
                    alignItems: "flex-start",
                    alignSelf: "flex-start",
                    marginLeft: "8%",
                  }}
                >
                  {item.attachmentsURL != undefined ? (
                    <View
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 20,
                        overflow: "hidden",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{ width: "100%", height: "100%" }}
                        activeOpacity={0.8}
                        onPress={() => this.imageFullView(item.attachmentsURL)}
                      >
                        <Image
                          source={{ uri: item.attachmentsURL }}
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#c1c1c1",
                          }}
                          resizeMode={"cover"}
                          borderRadius={20}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>

                <View
                  style={{
                    alignItems: "flex-start",
                    alignSelf: "flex-start",
                    marginLeft: "8%",
                  }}
                >
                  {msgAsURL ? (
                    <TouchableOpacity onPress={() => this.gotoNF(item)}>
                      <View
                        style={{
                          width: 200,
                          height: 300,
                          borderRadius: 35,
                          overflow: "hidden",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* <LinearGradient
                              style={{ height: 70,borderRadius: 35, }}
                              colors={["#0f0f0f94", "#0f0f0f00"]}
                            > */}
                        <Image
                          source={{ uri: body }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode={"cover"}
                          borderRadius={20}
                        />
                        {/* <Text>Mufthi</Text> */}
                        {/* <LinearGradient
                       style={{ height: 70, }}
                       colors={["#0f0f0f94", "#0f0f0f00"]}
                      />  */}
                        {/* </LinearGradient> */}
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {body == "null" || msgAsURL ? null : (
                  <View
                    style={{
                      alignItems: "flex-start",
                      alignSelf: "flex-start",
                      marginLeft: "8%",
                      borderRadius: 15,
                      backgroundColor: "#d6d6d6",
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onLongPress={() => this.copyChatText(body)}
                    >
                      <Text
                        style={{
                          marginRight: wp("2%"),
                          marginLeft: wp("3%"),
                          color: "#1d1d1d",
                          padding: 10,
                          fontSize: profilename.FontSize,
                          fontFamily: profilename.Font,
                        }}
                      >
                        {body}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#c15b66', padding: 10, lineHeight: 10, fontFamily: Timestamp.Font,fontSize:Timestamp.FontSize }}>
                    {time}
                      </Text>
                    {properties.read == "0" ?
                    
                      <Image source={require('../../Assets/Images/singletick.png')} style={{ marginTop: 7, width: '7%', height: '60%',marginLeft:1}}></Image>
                      :
                      <Image source={require('../../Assets/Images/Doubletick.png')} style={{marginTop: 7, width: '7%', height: '60%',marginLeft:1 }}></Image>
                      
                    }
                  </View> */}

                <View
                  style={{
                    alignItems: "flex-start",
                    alignSelf: "flex-start",
                    marginLeft: "10%",
                    marginTop: 2,
                  }}
                >
                  <Text
                    style={{ color: "black", fontSize: Timestamp.FontSize }}
                  >
                    {time}
                  </Text>
                </View>

                {/* </View> */}
              </View>
            </View>
          </View>
        </View>
      );
    }
  };

  renderToolbarIconsView = () => {
    return (
      <View style={[stylesFromToolbar.leftIconContainer]}>
        <View>
          <Image style={{ width: 20, height: 20 }} />
        </View>
      </View>
    );
  };

  render() {
    const {
      chatUser,
      userTypingActivate,
      AppChatUserID,
      typingUserID,
      imageView,
    } = this.state;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: 0, backgroundColor: "#fff" }}
      >
        <Container>
          <Toolbar
            {...this.props}
            centerTitle={chatUser == "" ? "user" : chatUser.name}
            rightImgView={this.renderToolbarIconsView()}
          />

          <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <StatusBar
              backgroundColor={imageView ? "rgba(0,0,0,0.8)" : "#FFF"}
              barStyle={imageView ? "light-content" : "dark-content"}
            />
            {this.isLoader()}

            <FlatList
              ref={(ref) => (this.flatList = ref)}
              style={{
                flexDirection: "column",
                backgroundColor: "#FFF",
                marginBottom: 70,
              }}
              data={this.state.sentMessages}
              showsVerticalScrollIndicator={false}
              // initialScrollIndex={this.state.sentMessages.length - 1}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.flatList.scrollToEnd({ animated: false });
              }}
              onLayout={() => {
                this.flatList.scrollToEnd({ animated: false });
              }}
              // inverted
              extraData={this.state}
              // ItemSeparatorComponent={this.separator()}
              renderItem={({ item, index }) => this.renderChats(item, index)}
              keyExtractor={(item, index) => index.toString()}
              // numColumns={1}
            />

            <Modal
              isVisible={this.state.propMulti}
              onBackButtonPress={() =>
                this.setState({ propMulti: false, imagesSelected: [] })
              }
              style={{
                margin: 0,
                flex: 1,
              }}
              deviceHeight={deviceHeight}
              deviceWidth={deviceWidth}
              transparent={false}
              coverScreen={true}
            >
              <View style={{ flex: 1 }}>
                <StatusBar
                  translucent
                  hidden
                  backgroundColor={"rgba(0,0,0,0.5)"}
                  barStyle="light-content"
                />

                <ImageBackground
                  style={{ width: "100%", height: hp("100%") }}
                  source={{ uri: this.state.photoPath1 }}
                  resizeMode={"cover"}
                >
                  <View
                    style={{
                      backgroundColor: "transparent",
                      width: wp("100%"),
                      height: "100%",
                    }}
                  >
                    <View
                      style={{
                        width: wp("15%"),
                        marginTop: StatusBar.currentHeight,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            propMulti: false,
                            imagesSelected: [],
                          })
                        }
                      >
                        <Image
                          style={{ width: 18, height: 18, margin: 10 }}
                          source={require("../../Assets/Images/close_white.png")}
                        />
                      </TouchableOpacity>
                    </View>
                    {/* <View style={{ height: hp('68%'),backgroundColor:'red' }} /> */}
                    <View
                      style={{
                        bottom: 0,
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        marginRight: 10,
                      }}
                    >
                      {/* #526c6b */}
                      <View
                        style={{
                          width: wp("100%"),
                          height: hp("14%"),
                          flexDirection: "row",
                          backgroundColor: "#00000070",
                        }}
                      >
                        <View
                          style={{
                            width: wp("75%"),
                            height: hp("14%"),
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: 5,
                          }}
                        >
                          <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                              flexGrow: 1,
                              flexDirection: "row",
                              alignItems: "flex-start",
                              paddingStart: 5,
                              paddingEnd: 5,
                            }}
                          >
                            {this.state.imagesSelected
                              ? this.state.imagesSelected.map((i) => (
                                  <View key={i.uri}>
                                    {this.renderImage2(i)}
                                  </View>
                                ))
                              : null}
                          </ScrollView>
                        </View>

                        <View
                          style={{
                            width: wp("23.6%"),
                            height: hp("14%"),
                            justifyContent: "center",
                          }}
                        >
                          {this.state.isLoading ? (
                            <Spinner size="large" color="#fb0143" />
                          ) : (
                            <TouchableOpacity
                              onPress={() => this.sendMessage()}
                            >
                              {/* <TouchableOpacity onPress={() => this.imageUpload()}
                                    > */}
                              <LinearGradient
                                start={{ x: 0, y: 0.75 }}
                                end={{ x: 1, y: 0.25 }}
                                style={FABStyle.nextButton}
                                colors={["#fff", "#ffffff"]}
                              >
                                <Text
                                  style={[
                                    FABStyle.LoginButtontxt,
                                    {
                                      color: "#4f4f4f",
                                      textAlign: "center",
                                    },
                                  ]}
                                >
                                  Send
                                </Text>
                              </LinearGradient>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </Modal>

            {/* view for picked images */}

            {/* {this.isImagePicked()} */}

            {/* End of picked images view */}
            {/* bottom view */}
            {/* <View style={{ flexDirection: 'row', backgroundColor: '#ff1c48', bottom: 0, position: 'absolute', width: wp('100%') }}> */}
            {/* <View style={{ width: wp('100%'), height: deviceHeight * 0.09, backgroundColor: '#00000000',marginBottom:'-5.5%' }}> */}
            <View
              style={{
                borderRadius: 10,
                marginLeft: 10,
                marginBottom: 5,
                flexDirection: "row",
                bottom: Platform.OS == "ios" ? this.state.keyboardOffset : 0,
                backgroundColor: "#fb0143",
                position: "absolute",
                width: wp("95%"),
                height: deviceHeight * 0.06,
                borderWidth: 0.5,
                borderColor: "#e1e1e1",
              }}
            >
              <View
                style={{
                  marginLeft: "2%",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.pickGallery()}
                  activeOpacity={0.5}
                >
                  {Platform.OS === "ios" ? (
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require(imagePath + "NF_add_post.png")}
                    />
                  ) : (
                    <Icon
                      name={"plus-circle-outline"}
                      size={40}
                      color="rgb(255, 255, 255)"
                      type="material-community"
                    />
                  )}
                  {/* <Image source={require('../../Assets/Images/messageAdd.png')} resizeMode={'stretch'} style={{ width: wp('10%'), height: hp('6%'), }} /> */}
                </TouchableOpacity>
              </View>

              <TextInput
                value={this.state.typedMessage}
                placeholder={"Type message..."}
                placeholderTextColor={"#ffffff"}
                onChangeText={(text) => {
                  this.onchangeText(text);
                }}
                multiline={true}
                autoCorrect={false}
                keyboardType="default"
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                //
                // flexWrap: 'wrap'
                // onChangeText={(text) => { this.onchangeText(text) }}
                theme={{
                  colors: {
                    text: "white",
                    primary: "#fb0143",
                    placeholder: "#ffffff",
                  },
                }}
                style={{
                  marginLeft: "2%",
                  marginTop: Platform.OS == 'ios' ? "3%" : 0,
                  width: "70%",
                  backgroundColor: "#fb0143",
                  color: "#ffffff",
                  fontSize: Common_Color.userNameFontSize,
                  fontFamily: Common_Color.fontLight,
                  // position: 'absolute',
                  // bottom:   this.state.keyboardOffset,
                }}
                onSubmitEditing={Keyboard.dismiss}
              />

              <View style={{ justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.sendMessage();
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontFamily: Common_Color.fontBold }}
                  >
                    Send
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* </View>
          </View> */}
        </Container>
        <ImageView
          images={this.state.imageViewData}
          imageIndex={0}
          isVisible={this.state.imageView}
          onClose={() => this.setState({ imageView: false })}
          renderFooter={(image) => <View />}
        />
      </KeyboardAvoidingView>
    );
  }
}

const FABStyle = {
  nextButton: {
    // backgroundColor: "#87cefa",
    justifyContent: "center",
    alignSelf: "center",
    height: hp("5%"),
    width: wp("20%"),
    //    marginTop: 25,
    // marginRight:15,
    borderRadius: 25,
    shadowColor: "#000000",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  LoginButtontxt: {
    color: "#fff",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 16,
    fontFamily: Common_Color.fontBold,
  },
  background: {
    //backgroundColor: 'rgba(0,0,0,.3)',
    position: "absolute",
    width: 30,
    height: 35,
    bottom: 0,
    left: 0,
    borderRadius: 25,
  },
  button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333",
    shadowOpacity: 0.1,
    shadowOffset: { x: 2, y: 0 },
    shadowRadius: 2,
    borderRadius: 25,
    position: "absolute",
    backgroundColor: "yellow",
    bottom: 0,
    left: 16,
  },
  other: {
    backgroundColor: "#FFF",
  },
  payText: {
    color: "#FFF",
  },
  pay: {
    backgroundColor: "#00B15E",
  },
  label: {
    color: "#000",
    position: "absolute",
    fontSize: 16,
    backgroundColor: "#FFF",
    width: 75,
    textAlign: "center",
  },
  button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333",
    shadowOpacity: 0.1,
    shadowOffset: { x: 2, y: 0 },
    shadowRadius: 2,
    borderRadius: 25,
    position: "absolute",
    backgroundColor: "yellow",
    bottom: 0,
    left: 20,
  },
  other: {
    backgroundColor: "#FFF",
  },
  background: {
    // backgroundColor: 'rgba(0,0,0,.3)',
    backgroundColor: "#00000000",
    position: "absolute",
    width: 35,
    height: 35,
    bottom: 0,
    left: 0,
    borderRadius: 25,
  },
};
