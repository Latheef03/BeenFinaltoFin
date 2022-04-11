import React, { useState,useEffect } from 'react';
import {
  ActivityIndicator, Share,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View, ScrollView,
  Image, Text, StatusBar, TextInput, KeyboardAvoidingView, Platform, Alert, ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
//import Modal from 'react-native-modalbox';
import GestureRecognizer from 'react-native-swipe-gestures';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Story from './Story';
import LinearGradient from "react-native-linear-gradient";
import UserView from './UserView';
import ProgressArray from './ProgressArray';
import serviceUrl from '../../Assets/Script/Service';
// import { ScrollView, } from 'react-native-gesture-handler';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style';
import { OneToOneChat } from '../Chats';
import styles1 from '../../styles/NewfeedImagePost';
import SD from './StorycontainerDummy';
import { toastMsg } from '../../Assets/Script/Helper';

const SCREEN_WIDTH = Dimensions.get('window').width;

const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;

const one2onechat = new OneToOneChat;

const StoryContainer = (props) => {

 
  const { user } = props;

  const { story = [] } = user || {};
  const [name, setName] = useState("")
  const [messageName, setMessgaeName] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModelOpen, setModel] = useState(false);
  const [reportModal, setReportModel] = useState(false);
  const [reportModal1, setReportModel1] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [clickedSend, setClickedSend] = useState(false)
  const [isSendMessageModal, setSendModel] = useState(false);

  const [duration, setDuration] = useState(6);
  const [userID,setUserID] = useState({});
  const {Userid} = userID ;
  const story1 = story.length ? story[currentIndex] : {};
  const { isReadMore, UserId, _id, time, pic } = story1 || {};

  useEffect(() => {
    let isSubscribed = true
    const getFollowing = async () => {
      const data = { Userid: await AsyncStorage.getItem('userId') };
      setUserID(data)
      return () => isSubscribed = false
    }
 
  getFollowing();
},
  []
  )

  const seenStories = async () => {
    if (currentIndex === story.length - 1) {
      // if(setCurrentIndex(currentIndex + 1) === user.story.length){
      const data = {
        Userid: await AsyncStorage.getItem('userId'),
        SeenUserId: [UserId]
      }
      const url = serviceUrl.been_url + '/SeenStory';
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
          // alert(JSON.stringify(responseJson))  
          if (responseJson.status == "True") {
          }
          else {
          }
        })
    }
    else {
    }
  }

  const viewedBy = async () => {
    if (currentIndex === story.length - 1) {
      // if(setCurrentIndex(currentIndex + 1) === user.story.length){
      const data = {
        Userid: UserId,
        PostId: _id,
        otherid: [await AsyncStorage.getItem('userId')],
      }
      const url = serviceUrl.been_url + '/viewedby';
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
          if (responseJson.status == "True") {
          }
          else {
          }
        })
    }
    else {
    }
  }

  const share_option = async () => {
    setModel(false);
    setIsPause(true);
    try {
      const result = await Share.share({
        message:
          'http://been.com/5e47d048e301b51201e8adab',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };



  const unFollow = async () => {
    debugger
    const data = {
      Userid: await AsyncStorage.getItem('userId'),
      Otheruserid: story[currentIndex].UserId
    }
    const url = serviceUrl.been_url + '/Unfollow';
    // console.log('the story index',currentIndex)
    // console.log('the story',story[currentIndex])
    Close();

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
        if (responseJson.status !== "True") {

        }

      }).catch(err => {
        console.log('err', err);
      })
  };


  const Close = () => {
    props.onClose();
  }

  const changeStory = (evt) => {
    if (evt.locationX > SCREEN_WIDTH / 2) {
      seenStories();
      viewedBy();
      nextStory();
    } else {
      prevStory();
    }
  };

  const nextStory = () => {
    if (story.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
      setLoaded(false);
      setDuration(6);
    } else {
      setCurrentIndex(0);
      props.onStoryNext();
    }
  };


  const onStoryClose = () => {
    setIsPause(false);
    setModel(false);

  };

  const onReportClose = () => {
    setReportModel(false);
    setModel(true)
  }

  const onSendMessageReportClose = () => {
    setSendModel(false);
    setIsPause(false)
  }

  const onReportClose1 = () => {
    setReportModel1(false);
    setModel(false)
  }


  const prevStory = () => {
    if (currentIndex > 0 && story.length) {
      setCurrentIndex(currentIndex - 1);
      setLoaded(false);
      setDuration(6);
    } else {
      setCurrentIndex(0);
      props.onStoryPrevious();
    }
  };

  const onImageLoaded = () => {
    setLoaded(true);
    seenStories();
    viewedBy();
  };

  const onVideoLoaded = (length) => {
    setLoaded(true);
    setDuration(length.duration);
    seenStories();
    viewedBy();
  };

  const onPause = (result) => {
    setIsPause(result);
  };

  const onReadMoreOpen = () => {
    setIsPause(true);
    setModel(true);
  };

  const openReport = () => {
    setIsPause(true);
    setModel(false);
    setReportModel(true);
  }

  const openReportOkay = () => {
    setReportModel1(true)
    setIsPause(true);
    setReportModel(false);
    setModel(false);
    report()
  }

  const report = async () => {
    var data = {
      Userid: await AsyncStorage.getItem('userId'),
      Reportid: UserId,
      // Otheruserid: this.state.postId,
      Postid: _id,
      Content: name,
      TypeAs: "Explore"
    };
    const url = serviceUrl.been_url + "/Reportpost";
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
        this.setState({
          reportModal: false,
          setReportModel1: true,
          setIsPause: true,
          setReportModel: false,
          setModel: false, isModalVisible2: true, name: ''
        })
      })
      .catch((error) => {
        // console.error(error);
      });
  };


  const loading = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          <View style={{ width: 1, height: 1 }}>
            {/* <Story
              onImageLoaded={onImageLoaded} pause
              onVideoLoaded={onVideoLoaded}
              story={story1} /> */}
          </View>
          <ActivityIndicator color="white" />
        </View>
      );
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipeDown = () => {
    if (!isModelOpen) {
      props.onClose();
    } else {
      setSendModel(false);
    }
  };

  const onSwipeUp = () => {
    // if (!isModelOpen && isReadMore) {
    //   setModel(true);
    //   setIsPause(true);
    // }
    if (!isSendMessageModal) {
      // setModel(true);
      setSendModel(true)
      setIsPause(true);
    }
  };

  const sendMessage = (story) => {
    setIsPause(true)
    setSendModel(true)
  }

  const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;

  const sendMessageToOther = async (data) => {
    // debugger;

    if (data[currentIndex].ChatUserId == undefined || data[currentIndex].ChatUserId == null || data[currentIndex].ChatUserId == "null") {
      ToastAndroid.showWithGravityAndOffset(
        `You cannot send this post to ${data[currentIndex].UserName} without chat user unique ID`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return false;
    }

    const datas = {
      occupants_ids: data[currentIndex].ChatUserId,
      name: data[currentIndex].UserName
    };
    setClickedSend(true);
    console.log("Data is coming or not from chat", datas);

    await one2onechat.initChatForNF();
    const session = await one2onechat.getSessionForNF();
    console.log('the session', session);
    if (session != false && session.token) {
      const checkConn = await one2onechat.checkConnectionFromChatServerForNF();
      if (checkConn) {
        createDialog(datas)
      }
      else {
        createConnectionToChatServer(datas);
      }
    } else {
      createSessionsNF(datas)
    }

  }


  const createDialog = async (datas) => {
    console.log('the create dilg data', datas);

    const dialogs = await one2onechat.createDialogueForNF(datas);

    console.log('the dils from create dilg', dialogs);
    if (dialogs === false) {
      createDialog(datas);
    }
    sendMessageToUser(dialogs);
    // console.log('dilIDddsss NF', dialogs);
  }

  const sendMessageToUser = async (dialogs) => {
    const appUserId = await AsyncStorage.getItem('chatUserID');
    console.log("Message api is calling or not", dialogs)
    const sentId = dialogs.occupantsIds[0] === parseInt(appUserId)
      ? dialogs.occupantsIds[1]
      : dialogs.occupantsIds[0];
    const msg = await one2onechat.sendMessageForNF(dialogs, messageName);
    toastMsg('success', 'Message Sent')
    //ToastAndroid.show('Message Sent', ToastAndroid.SHORT);
    setClickedSend(false);
    setSendModel(false);
    setMessgaeName('');
    setIsPause(false);
  }

  const createSessionsNF = async (datas) => {
    // setIsPause(false);
    // setSendModel(false);
    const info = await one2onechat.createSessionForNF();
    console.log('object check', info)
    if (info != false && info.constructor == Object) {
      const checkConn = await one2onechat.checkConnectionFromChatServerForNF();
      if (checkConn) {
        createDialog(datas)
      } else {
        createConnectionToChatServer(datas);
      }

    } else {
      createSessionsNF(datas);
    }
  }

  const createConnectionToChatServer = async (datas) => {
    const checkConSer = await one2onechat.createConnectionToServerForNF();
    // if(checkConSer){
    createDialog(datas)
    // }else{
    //   this.createConnectionToChatServer(datas);
    // }
  }

  return (
    <GestureRecognizer
      onSwipeDown={onSwipeDown}
      onSwipeUp={onSwipeUp}
      config={config}
      style={styles.container}
    >
      <StatusBar hidden
      // backgroundColor="#ffffff" barStyle='dark-content' 
      />
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={300}
        onPress={e => changeStory(e.nativeEvent)}
        onLongPress={() => onPause(true)}
        onPressOut={() => onPause(false)}
        style={styles.container}
      >
        <View style={styles.container}>
          <Story onImageLoaded={onImageLoaded}
            pause={isPause}
            isNewStory={props.isNewStory}
            onVideoLoaded={onVideoLoaded}
            story={story1}
            navigation={props.navigation}
            onClose={props.onClose}
          />

          {loading()}

          <UserView
            name={user.UserName}
            time={time}
            profile={serviceUrl.profilePic + user.UserProfilePic}
            onClosePress={props.onClose} />

          <ProgressArray
            next={nextStory}
            isLoaded={isLoaded}
            duration={duration}
            pause={isPause}
            isNewStory={props.isNewStory}
            stories={story}
            currentIndex={currentIndex}
            currentStory={story[currentIndex]}
            length={story.map((_, i) => i)}
            progress={{ id: currentIndex }}
          />
        </View>
      </TouchableOpacity>


      {isReadMore && Userid !== UserId ?

        <View style={styles.readMore}>

          <View style={{ width: wp('20%') }} />

          <View style={{ backgroundColor: '#00000000', flexDirection: 'column', width: wp('70%'), justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => sendMessage(story)}>
              <Image style={{ width: 18, height: 18, marginLeft: 5, transform: [{ rotate: '90deg' }], alignSelf: 'center' }}
                source={require('../../Assets/Images/leftwhitearrow.png')}
              resizeMode={'center'} 
                />
              <Text onPress={() => sendMessage(story)}  style={{ color: '#fff', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
                Swipe up to reply
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => onReadMoreOpen()}>
            <View style={{width: wp('10%'), height: hp('9%'), justifyContent: 'center', alignItems: 'center',alignContent: 'center',}}>
              <Image source={require('../../Assets/Images/3dots1.png')}
                style={{ width: 22, height: 22, alignSelf: 'center' }}
            // resizeMode={'center'}
              />
            </View>
          </TouchableOpacity>

          <Modal pause={isPause}
            onBackdropPress={onStoryClose}
            onBackButtonPress={onStoryClose}
            isVisible={isModelOpen}
            onRequestClose={onStoryClose}>
            <View style={styles1.modalContent}>
              <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

              <View style={{ marginTop: 15, width: '100%' }}>
                <Text onPress={() => null}style={styles1.modalText}>
                  Share status
                </Text>
              </View>

              <View style={styles1.horizontalSeparator} />

              <View style={{ marginTop: 7, width: '100%' }}>
                <Text onPress={() => share_option()} style={styles1.modalText}>
                  Share
              </Text>
              </View>

              <View style={styles1.horizontalSeparator} />
              <View style={{ marginTop: 7, width: '100%' }} >
                <Text onPress={() => unFollow()}
                  style={styles1.modalText} >
                  Unfollow account
                </Text>
              </View>

              <View style={styles1.horizontalSeparator} />

              <View style={{ marginTop: 7, marginBottom: 15, width: '100%' }}>
                <Text onPress={() => openReport()} style={[styles1.modalText, { color: '#708fd5' }]}>
                  Report
                </Text>
              </View>
            </View>
          </Modal>


          <Modal isVisible={reportModal}
            onBackdropPress={onReportClose}
            onBackButtonPress={onReportClose} >
            <View style={Common_Style.parentViewReport} >
              <Image style={Common_Style.iconReport} source={require('../../Assets/Images/new/Expression.png')}></Image>
              <Text style={Common_Style.headerReport} >
                Inappropriate Content!
             </Text>
              <Text style={Common_Style.subHeaderReport} >
                We are sorry for the inconvenience!
              </Text>
              <View style={Common_Style.contentViewReport}>
                <Text style={Common_Style.contentReport} >
                  We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
                </Text>
              </View>

              {/* <View style={styles.inputView}> */}
              <TextInput
                onChangeText={text => setName(text)}
                value={name}
                placeholder="Type here"
                multiline={true}
                autoCorrect={false}
                
                style={{
                  marginTop: 10, backgroundColor: '#fff', width: '95%', marginLeft: 8,
                  fontSize: profilename.FontSize, fontFamily: profilename.Font,
                  borderWidth: 1
                }}
              />
              {/* </View>  */}
              <View style={Common_Style.buttonViewReport}>
                <TouchableOpacity onPress={openReportOkay}activeOpacity={1.5}>
                  <LinearGradient start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }}  style={Common_Style.ButtonReport}     colors={["#fb0043", "#fb0043"]}>
                    <Text onPress={openReportOkay} style={Common_Style.ButtonTextReport}>
                      Report
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={onReportClose} activeOpacity={1.5} >
                  <View style={Common_Style.ButtonCancel}>
                    <Text onPress={onReportClose} style={Common_Style.CancelButtonTextReport}>
                      Cancel
                   </Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </Modal>

          <Modal isVisible={reportModal1}
            onBackdropPress={onReportClose1}
            onBackButtonPress={onReportClose1} >
            <View style={styles.parentView} >
              <Text style={styles.headerInModalTwo} >
                Thank you for your voice!</Text>

              <View style={styles.contentViewInModalTwo}>
                <Text style={styles.contentTextInModalTwo} >
                  We would like to show you our utmost gratitude for raising your voice against inappropriate behaviour and thus helping in making this a safe and happy place for people around you!
                </Text>
              </View>

              <View style={styles.contentViewInModalTwo}>
                <Text style={[styles.contentTextInModalTwo, { marginTop: 40 }]} >
                  Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
              </Text>
              </View>
              <View style={styles.okayButton}>
                <TouchableOpacity onPress={onReportClose1} activeOpacity={1.5}>
                  <Text onPress={onReportClose1} style={styles.okayButtonText}>
                    Okay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View> : null
      }


      <Modal pause={isPause}
        onBackdropPress={onSendMessageReportClose}
        onBackButtonPress={onSendMessageReportClose}
        isVisible={isSendMessageModal}
        onRequestClose={onSendMessageReportClose}
        style={{ flex: 1 }}
      >
        <ScrollView style={{
          backgroundColor: '#fff',
          borderWidth: .5, borderColor: '#000',
          borderRadius: 20, marginLeft: 5, position: 'absolute', bottom: 5
        }}
          contentContainerStyle={{
            flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center',
          }}
          keyboardShouldPersistTaps='always'

        >

          < TextInput
            style={[Common_Style.searchTextInput, {
              width: wp('90%'), paddingRight: '14%',
              paddingLeft: '6%'
            }]}
            autoCorrect={false}
            
            value={messageName}
            onChangeText={(text) => setMessgaeName(text)}
            placeholder="Type here"
            autoFocus={true}
            placeholderTextColor='#010101'
            selectionColor={'#f0275d'}
            underlineColorAndroid={'#00000000'}
            returnKeyType='done'
          // multiline={true}
          />

          {messageName != "" ?
            <TouchableOpacity style={{
              padding: 10,
              alignItems: 'center', right: 0, position: 'absolute',
              // backgroundColor:'#ebebeb'
            }}
              onPress={() => { clickedSend ? null : sendMessageToOther(story) }}>
              <Text style={{
                fontSize: 12, fontFamily: Common_Color.fontMedium, color: '#dd374d',
                textAlign: 'center'
              }}>
                {clickedSend ? 'Sending...' : 'Send'}
              </Text>

            </TouchableOpacity>
            :
            null
          }
        </ScrollView>
      </Modal>
    </GestureRecognizer>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#00000000',
    // marginTop:StatusBar.currentHeight
  },


  SectionStyle: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderWidth: .5, borderColor: '#000', height: 40, borderRadius: 20, marginLeft: 15, marginBottom: 5 },
  ImageStyle: { padding: 5, margin: 5, height: 25, width: 25, resizeMode: 'stretch', alignItems: 'center' },
  SectionStyle1: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#fff',
    borderWidth: .5, borderColor: '#000', height: 40,
    borderRadius: 20, marginLeft: 5,
  },
  parentView: { width: "100%", borderRadius: 15, backgroundColor: "white" },
  icon: { width: wp(8), height: hp(4.5), marginLeft: '45%', marginBottom: '5%', marginTop: '5%' },
  header: { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, marginTop: 10, textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#000', },
  subHeader: { marginTop: 15, fontSize: 12, textAlign: "center", alignSelf: "center", fontWeight: 'normal', color: '#959595' },
  contentView: { width: '95%', textAlign: "center", },
  content1: { marginTop: 10, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#9e9e9e' },
  inputView: { borderColor: '#a5a5a5', borderWidth: 1, width: "85%", padding: 5, height: '35%', marginLeft: 25, color: "grey", marginTop: 25, marginBottom: 15, borderRadius: 5, },
  buttonView: { justifyContent: "center", textAlign: "center", alignItems: "center", marginVertical: 10, marginTop: 10, justifyContent: "space-evenly", margin: 10, marginLeft: 20 },

  // success msg  View
  headerInModalTwo: { fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontMedium, marginTop: 25, textAlign: "center", alignSelf: "center", textAlign: 'center', color: '#000', },
  contentViewInModalTwo: { width: '95%', textAlign: "center", },
  contentTextInModalTwo: { marginTop: 20, fontSize: 12, textAlign: "center", alignSelf: "center", color: '#9e9e9e' },
  okayButton: { justifyContent: "center", textAlign: "center", alignItems: "center", marginVertical: 10, marginTop: 40, justifyContent: "space-evenly", margin: 10, marginLeft: 20, fontWeight: 'bold' },
  okayButtonText: { color: "#d12c5e", textAlign: "center", justifyContent: "center", fontSize: 25, fontWeight: 'bold', },

  modalText: { color: '#010101', fontFamily: Common_Color.fontMedium, marginTop: hp('2%'), marginLeft: wp('6%'), marginBottom: hp('1.3%'), textAlign: 'center' },
  modalView1: { backgroundColor: '#000', borderRadius: 8, width: wp('96%'), height: hp('20%'), justifyContent: 'center', alignContent: 'center' },
  readMore: {
    width: wp('100%'),
    height: 60,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    flex: 0.9
  },
  progressBarArray: {
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    width: '98%',
    height: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userView: {
    flexDirection: 'row',
    position: 'absolute',
    top: 55,
    width: '98%',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 12,
    color: 'white',
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 3,
    marginLeft: 12,
    color: 'white',
  },
  content: {
    width: '100%',
    height: '100%',
  },
  loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: { backgroundColor: "#FFF", borderRadius: 20, borderColor: "rgba(0, 0, 0, 0.1)", justifyContent: 'center', alignItems: 'center' },

  bar: {
    width: 50,
    height: 8,
    backgroundColor: 'blue',
    alignSelf: 'center',
    borderRadius: 4,
    marginTop: 8,
  },
});

export default StoryContainer;