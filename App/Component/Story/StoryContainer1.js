import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,TouchableWithoutFeedback, ImageBackground,
  View,Platform,
  Image, Text, ToastAndroid, FlatList, Alert, StatusBar, PermissionsAndroid
} from 'react-native';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Toast, Separator } from "native-base";
import { Common_Color,Username } from '../../Assets/Colors'
//import Modal from 'react-native-modalbox';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Footer, FooterTab, Content, Container } from 'native-base'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
import Story1 from './Story1';
import UserView from './UserView';
import ProgressArray1 from './ProgressArray1';
import serviceUrl from '../../Assets/Script/Service';
import common_styles from "../../Assets/Styles/Common_Style"
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { postService } from 'Been/App/Component/_services'
import CommonStyle from '../../styles/NewfeedImagePost';
import Profile_Style from "../../Assets/Styles/Profile_Style"
import Common_Style from '../../Assets/Styles/Common_Style';
import styles1 from '../../styles/NewfeedImagePost';
import { Icon } from 'react-native-elements'
import RNFS from 'react-native-fs'
import { StatusBarIOS } from 'react-native';



const SCREEN_WIDTH = Dimensions.get('window').width;
const { been_url, profilePic, been_image_urlExplore } = serviceUrl;
const imagepath1 = 'Been/App/Assets/Images/';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'

const StoryContainer1 = (props) => {
  const { user } = props;
  const { story = [] } = user || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passStoryId, setStoryId] = useState("")
  const [isModelOpen, setModel] = useState(false);
  const [isModelOpen1, setModel1] = useState(false);
  const [isModelOpen2, setModel2] = useState(false);
  const [isModelOpen3, setModel3] = useState(false);
  const [isViewModal, setViewModal] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(6);
  const [datas, setDatas] = useState([]);
  const [filterDatas, setFilterDatas] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [hideStory, setHideStory] = useState(false);
  const [cacheImg,setCacheImg] = useState('');
  const story2 = story.length ? story[currentIndex] : {};
  const { isReadMore, pic, _id, time, UserId, Hide } = story2 || {};
  let captureImg = React.createRef();
  // console.log('story hide',Hide,'and typof',typeof Hide);

  // console.log('StoryContainer1 props.navigation',props.navigation);
  const setProfilePic = user.UserProfilePic == null ? undefined
    : serviceUrl.profilePic + user.UserProfilePic

  useEffect(() => {
   // debugger;
    setHideStory(Hide)
    // alert('test ok');
    let isSubscribed = true
    const getFollowing = async () => {
      const data = { Userid: await AsyncStorage.getItem('userId') };
      const apiname = "FollowcustomSettings";
      postService(apiname, data).then(data => {
        console.log('the follo data', data);

        data.result = data.status == 'True' && data.result.length > 0 && data.result.map(m => {
          m.selected = false;
          return m;
        })
        if (isSubscribed && data.result){
          setDatas(data.result)
          setFilterDatas(data.result)
        }
        // console.log('services call',data.result)
      }).catch(err => {
        console.log(err)
        //toastMsg('danger','Something wrong.please try again once')
      })
      return () => isSubscribed = false
    }
    getFollowing();
    getPermissionForImage();
  }, []);
  

  const getPermissionForImage = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            'title': 'Been Storage Permission',
            'message': 'Been App needs access to your storage to download Photos.'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        }
        else {
        }
      } catch (err) {
        console.log(err)
      }
    }
  };

  const oncaptureImage = (uri) =>{
    console.log('the uri is ',uri)
    setCacheImg(uri);
  }

  const downloadImage = () => {
    var date = new Date();
    var localImge = serviceUrl.been_image_urlExplore + pic
    var image_URL = localImge;
    // console.log('the refers is==>',textInput.current.capture);
    console.log("Download image url is", image_URL);
    console.log('the refss ',captureImg.current);

    captureImg.current && captureImg.current.capture().then(uri=>{
      console.log('the uri RNFS==> ',RNFS);
      
      // DownloadDirectoryPath
      const destPath = RNFS.DocumentDirectoryPath +'/'+ 
      'Been_IMG' + Math.floor(date.getTime() + date.getSeconds() / 2) +'.jpg' ;
      const filePath = uri;
      console.log('the destpath ==> ',destPath)
      RNFS.moveFile(filePath,destPath).then((result)=>{
        console.log('the file moved ',result);
        // toastMsg('success', "Image Downloaded Successfully")
        alert(`Image Downloaded Successfully on '${destPath}'`)
        //ToastAndroid.show(`Image Downloaded Successfully on '${destPath}'`, ToastAndroid.LONG);
      }).catch(err=>console.log('the file move err',err));
    })
    .catch(err=>console.log('the err',err));
  
    // moveFile
    // var ext = getExtention(image_URL);
    // ext = "." + ext[0];
    // const { config, fs } = RNFetchBlob;
    // let PictureDir = fs.dirs.PictureDir
    // let options = {
    //   fileCache: true,
    //   addAndroidDownloads: {
    //     useDownloadManager: true,
    //     notification: true,
    //     path: PictureDir + "/image_" + Math.floor(date.getTime()
    //       + date.getSeconds() / 2) + ext,
    //     description: 'Image'
    //   }
    // }
    // config(options).fetch('GET', image_URL).then((res) => {
    //   ToastAndroid.show("Image Downloaded Successfully", ToastAndroid.SHORT);
    // });
  }

  const getExtention = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) :
      undefined;
  }


  const viewDBy = async (story) => {
    // debugger
    const data = {
      Userid: await AsyncStorage.getItem('userId'),
      PostId: story[currentIndex]._id
    }
    console.log('the data viewdBy',data);
    // setViewData([{UserName:'mufthi'}]);
    const url = serviceUrl.been_url + '/GetViewedbyList';
     await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'True' && responseJson.result.length > 0) {
          console.log("Viewd by data", responseJson.result);
          setViewData(responseJson.result);
        }
        // else {

        // }
      }).catch(err=>{
        console.log('the err viewdby',err)
      })
  }


  const changeStory = (evt) => {
    if (evt.locationX > SCREEN_WIDTH / 2) {
      nextStory();
    } else {
      prevStory();
    }
  };

  const deleteData = async (story, index) => {
    console.log('users after cliked delete meth', props)
    props.user;
    console.log('the index is ', index)
    props.user.story.splice(index, 1)
    const data = {
      UserId: story.UserId,
      _id: story._id
    }
    Close();
    const url = serviceUrl.been_url + '/DeleteStory';
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
        console.log('the delete response is', responseJson)
        if (responseJson.status == "True") {
          Close();
          // ToastAndroid("Your story is Delelted Successfully", ToastAndroid.LONG)
          // props.navigation.navigate('MyPager')
        }
        else {
          Close();
        }
      })
  };

  const SearchFilterFunction = async (text) => {
   // debugger;
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      requestData: newData,
      text: text
    });
  }

  const hideData = async (story) => {
    onStoryClose();
    console.log('story hidee', story[currentIndex]);
    const { _id, UserId } = story[currentIndex];
    debugger
    const data = {
      UserId: UserId,
      Sid: _id
    };

    // console.log('story id',data);
    // console.log('the hide story',hideStory);
    const url = serviceUrl.been_url + '/hide';
    setHideStory(!hideStory)
    setModel2(false);
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
        console.log('the rsp hide', responseJson);
        if (responseJson.status == "True") {
          // Close();
          setHideStory(!hideStory);
          toastMsg('success', "Your story is Hide Successfully")
        // ToastAndroid("Your story is Hide Successfully", ToastAndroid.LONG);
          this.props.navigation.navigate('MyPager')
        }
        else {
          // Close();
          setHideStory(!hideStory);
          //toastMsg('danger', error.response.message, '#cb1f4c')

        }
      }).catch(err => {
        setHideStory(!hideStory);
        console.log('hide err', err);
      })
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
    setModel(false);
  };
  const onStoryClose1 = () => {
    setModel1(false);
    setModel2(false)
  };


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
  };

  const onVideoLoaded = (length) => {
    setLoaded(true);
    setDuration(length.duration);
  };

  const onPause = (result) => {
    console.log('the crnt time',new Date().getMilliseconds())
    setIsPause(result);
  };

  const onReadMoreOpen = () => {
    setIsPause(true);
    setModel(true);
  };

  const onDownoad = () => {
    downloadImage();
  }

  // const onReadMoreOpen1 = () => {
  //   setIsPause(true);
  //   setModel1(true);
  //   setModel(false);
  // };

  const onReadMoreOpen1  = () =>{
    setModel(false)
    setTimeout(()=>{
     console.log("is called")
       setIsPause(true);
        setModel1(true);
    },600)
        
    }

    // const openCustom = () => {
    //   setModel3(true);
    //   setModel(false);
    //   setIsPause(true)
    // };

   const openCustom  = () =>{
    setModel(false);
    
      setTimeout(()=>{
        console.log("is called")
        setIsPause(true);
        setModel3(true);
      },600)
    
    }

  // const onReadMoreOpen2 = () => {
  //   setIsPause(true);
  //   setModel(false);
  //   setModel1(false);
  //   setModel2(true);
  // };

  const onReadMoreOpen2  = () =>{
     setModel(false);
    setModel1(false);
    
     setTimeout(()=>{
        console.log("is called")
        setModel2(true);
        setIsPause(true);
      },600)
    
    }

  const seperator = () => { <View style={{ width: "50%", backgroundColor: 'red' }}></View> };

  const _selectedListForHide = (data) => {
    data.selected = !data.selected;
    const index = datas.findIndex(item => data._id === item._id);
    datas[index] = data;
    setDatas([...datas]);
  };

  const _goAndHideTheFollowees = async () => {
    //use arrow function
    let selectedFollowees = datas.length > 0 && datas.filter((item) => item.selected)
      .map(({ _id }) => ({ _id }));
    if (selectedFollowees.length === 0) {
      toastMsg1('danger', 'You have to select atleast one if there is any followings.')
     // Alert.alert('Warning', 'You have to select atleast one if there is any followings.')
      return;
    }

    const data = {
      Userid: await AsyncStorage.getItem('userId'),
      otherid: selectedFollowees
    };
    const apiname = "FollowHidecustomSettings";

    postService(apiname, data).then(data => {
      if (data.status == 'True') {
        setModel3(false);
      }
    }).catch(err => {
      console.log(err)
      //toastMsg('danger','Something wrong.please try again once')
    })

  };

  const SearchFilterFunction1 = (text) => {
    //passing the inserted text in textinput
    const newData = filterDatas.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setDatas(newData);
   
  }

  const loading = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          <View style={{ width: 1, height: 1 }}>
          
            {/* <Story1
              onImageLoaded={onImageLoaded} pause
              onVideoLoaded={onVideoLoaded}
              story={story2} 
              isLoaded = {isLoaded}
            /> */}
           
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
    } else if (!isModelOpen1) {
      props.onClose();
    }
    else {
      setModel(false);
    }
  };

  const Close = () => {
    props.onClose();
  }

  const onSwipeUp = () => {
    if (!isModelOpen && isReadMore) {
      setModel(true);
    }
    else if (!isModelOpen1 && isReadMore) {
      setModel1(true);
    }
  };

  const destroyModal = () => {
    setModel3(false);
    setIsPause(false)
  };

  

  const openViewByUsers = async(story) => {
    debugger
    setIsPause(true);
    setTimeout(async()=>{
      await viewDBy(story);
      setViewModal(true);
    },300)
  };

  const closeViewByUsers = () => {
    setIsPause(false);
    setViewModal(false);
  }

  return (
    <GestureRecognizer
      onSwipeDown={onSwipeDown}
      // onSwipeUp={onSwipeUp}
      config={config}
      style={styles.container}
    >
      <TouchableWithoutFeedback
        activeOpacity={1}
        delayLongPress={200}
        onPress={e => changeStory(e.nativeEvent)}
        onPressIn = {() => onPause(true)}
        onLongPress={() => onPause(true)}
        onPressOut={() => onPause(false)}
        style={styles.container}
      >
        <View style={styles.container}>
          <StatusBar hidden
          //backgroundColor="#ffffff" barStyle='dark-content' 
          />
          <Story1 onImageLoaded={onImageLoaded}
            pause={isPause} isNewStory={props.isNewStory} onVideoLoaded={onVideoLoaded}
            story={story2} 
            ref = {captureImg}
            navigation = {props.navigation}
            onClose = {props.onClose}
            isLoaded={isLoaded}
            />
             {/* <ViewShot onCapture={oncaptureImage} captureMode='update'> */}
                {loading()}
             {/* </ViewShot>    */}
          <UserView
            name={user.UserName}
            time={time}
            profile={setProfilePic}
            onClosePress={props.onClose} />

          {isReadMore &&
            <View style={styles.readMore}>

              <View style={{ width: widthPercentageToDP('84%'), flexDirection: 'row' }}>
                <View style={{ width: widthPercentageToDP('4%') }} />
                <TouchableOpacity onPress={() => openViewByUsers(story)}>
                  <View >
                    <Image source={require('../../Assets/Images/view.png')}
                      style={{ width: 20, height: 20, marginLeft: 10 }}
                     // resizeMode={'center'}
                    />
                    <Text onPress={() => openViewByUsers(story)} style={{ fontSize: 12, color: '#fff', fontFamily: Common_Color.fontMedium }} >View By</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => onDownoad()}>
                  <Image source={require('../../Assets/Images/download.png')}
                    style={{ width: 20, height: 20, marginTop: 5,padding:5, marginLeft: 5,}}
                   // resizeMode={'center'}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onReadMoreOpen()}>
                  <Image source={require('../../Assets/Images/3dots1.png')}
                    style={{ width: 20, height: 20, marginTop: 5,padding:5, marginLeft: 10 }}
                  //  resizeMode={'center'}
                  />
                </TouchableOpacity>
              </View>



              <Modal pause={isPause}
                isVisible={isModelOpen} onRequestClose={onStoryClose}
                onBackdropPress={() => setModel(false)}
                // onBackdropPress={setModel(false)}
                >
                <View style={[styles1.modalContent,{width:wp('90%'),}]}>
                  <StatusBar hidden
                  //backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" 
                  />
                  {/* <ScrollView style={{width:wp('90%'),}}

                  > */}
                    <View style={{width:wp('90%') }}>
                      <Text
                        style={[styles1.modalText,]} onPress={() => onReadMoreOpen1()}>
                        Delete Story
                      </Text>
                    </View>

                    <View style={styles1.horizontalSeparator} />


                    <View style={{ width:wp('90%') }}>
                      <Text onPress={() => openCustom()} style={[styles1.modalText]}>
                        Custom Setting
                      </Text>
                    </View>
                    <View style={styles1.horizontalSeparator} />


                    <View style={{width:wp('90%')}}>
                      <Text onPress={() => onReadMoreOpen2()} style={[styles1.modalText]}>
                        {hideStory == false ? 'Hide' : 'Unhide'}
                      </Text>
                    </View>

                  {/* </ScrollView> */}
                </View>
              </Modal>

              <Modal pause={isPause}
                isVisible={isModelOpen1} onRequestClose={onStoryClose}
                onBackdropPress={() => setModel1(false)}
                >
                <View style={styles.modalContent}>
                  <StatusBar hidden
                  //backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" 
                  />
                  
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                      <Text style={{ color: '#222',fontSize:12,marginTop: heightPercentageToDP('2%'), marginLeft: 0, marginBottom: heightPercentageToDP('1.3%'),
                        fontFamily: Common_Color.fontLight  }}>
                        Are you sure you want to delete this picture from your story ? 
                      </Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: widthPercentageToDP('58%'), marginTop: 15, marginBottom: 15 }}>
                      <View style={{ width: widthPercentageToDP('20%') }}> */}

                <View style={[common_styles.Common_button, { width: wp(88), margin: 3 }]}>

                  <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                    borderRadius={10}
                  >
                    <TouchableOpacity onPress={() => { deleteData(story[currentIndex], currentIndex) }}>
                      <Text onPress={() => { deleteData(story[currentIndex], currentIndex) }} 
                        style={[common_styles.Common_btn_txt, { marginTop: 12,fontFamily: Common_Color.fontLight }]}>Delete</Text>
                    </TouchableOpacity>
                  </ImageBackground>

                </View>

                <View style={[common_styles.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
                  <TouchableOpacity onPress={() => { onStoryClose1() }}>

                    <Text onPress={() => { onStoryClose1() }} 
                     style={[common_styles.Common_btn_txt, { color: Common_Color.common_black, alignItems: 'center', justifyContent: 'center',
                     fontFamily: Common_Color.fontLight }]}>Cancel</Text>
                  </TouchableOpacity>

                </View>
              </View>

          </Modal>


          <Modal pause={isPause}
                isVisible={isModelOpen2} onRequestClose={onStoryClose}
                onBackdropPress={() => setModel2(false)}
                >
                <View style={styles.modalContent}>
                  <StatusBar hidden
                  //backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" 
                  />
                  
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5', marginBottom: 10 }}>
                     {hideStory ?
                        <Text style={{ color: '#222', marginTop: heightPercentageToDP('2%'), textAlign: 'center', fontSize: 12, fontFamily: Common_Color.fontLight }}>
                           Are you sure you want to unhide this picture ? 
                        </Text>
                     :
                      <Text style={{ color: '#222', marginTop: heightPercentageToDP('2%'), textAlign: 'center', fontSize: 12, fontFamily: Common_Color.fontLight }}>
                           Are you sure you want to hide this picture from your story ? 
                      </Text>
                      }
                      
                    </View>

                      {/* <Text style={{ color: '#222', marginTop: heightPercentageToDP('2%'), textAlign: 'center', fontSize: 12, fontFamily: Common_Color.fontLight }}>
                         {hideStory == false ? 'Hide' : 'Unhide'} photo from your story? 
                      </Text> */}
                      {/* {!hideStory && (
                        <Text style={{ color: '#222', marginTop: heightPercentageToDP('2%'), textAlign: 'center', fontSize: 12, fontFamily: Common_Color.fontLight }}>
                          {/* No one can see your story */}
                          {/* Are you sure you want to hide this picture from your story ?  */}
                        {/* </Text> */}
                      {/* ) }  */} 

                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: widthPercentageToDP('80%'), marginTop: 15, marginBottom: 15 }}>
                      <View style={{ width: widthPercentageToDP('20%') }}> */}
                <View style={[common_styles.Common_button, { width: wp(88), margin: 3 }]}>

                  <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                    borderRadius={10}
                  >
                    <TouchableOpacity onPress={() => {  hideData(story) }}>
                      
                      <Text style={[common_styles.Common_btn_txt,{ marginTop: 12,fontFamily: Common_Color.fontLight }]}>{hideStory == false ? 'Hide' : 'Unhide'}</Text>
                    </TouchableOpacity>
                  </ImageBackground>

                </View>

                <View style={[common_styles.Common_button, { width: wp(88), marginTop: 4.8, margin: 3 }]}>
                  <TouchableOpacity onPress={() => { onStoryClose1() }}>

                  <Text onPress={() => { onStoryClose1() }} style={[common_styles.Common_btn_txt, { color: Common_Color.common_black, alignItems: 'center', justifyContent: 'center',
                  fontFamily: Common_Color.fontLight }]}>Cancel</Text>
                  </TouchableOpacity>

                </View>


                        {/* <ImageBackground borderRadius={5} source={require('../../Assets/Images/button.png')} style={styles.loginButton}>
                          <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                            onPress={() => hideData(story)}>
                            <Text style={common_styles.Common_btn_txt}>{hideStory == false ? 'Hide' : 'UnHide'}</Text>
                          </TouchableOpacity>
                        </ImageBackground> */}

                      {/* </View> */}
                      {/* <View style={{ width: widthPercentageToDP('20%'), borderRadius: 8, marginRight: 5 }}>
                        <TouchableOpacity onPress={() => onStoryClose1()}>
                          <LinearGradient
                            start={{ x: 0, y: 0.75 }}
                            end={{ x: 1, y: 0.25 }}
                            style={styles.loginButton1}
                            colors={["#ffffff", "#ffffff"]} >
                            <Text style={[styles.LoginButtontxt, { color: '#000' }]}>Cancel</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View> */}
                    {/* </View> */}

                 
                </View>
              </Modal>

              <Modal pause={isPause}
                isVisible={isModelOpen3}
                // onSwipeComplete={this.close}
                swipeDirection={['down']}
                onBackdropPress={() => setModel3(false)}
                style={styles.view}>
                <View style={{ backgroundColor: '#fff', height: 500, width: '100%',
                  justifyContent: 'center', alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.1)', 
                  borderTopRightRadius: 15, borderTopLeftRadius: 15}}>
                  <View style={{ flexDirection: 'row', width: widthPercentageToDP('100%'), justifyContent: 'space-between', height: 18, marginTop: 15 }}>
                    <View style={{justifyContent:'center'}}>
                      <Text style={{ fontSize: 14,fontFamily: Username.Font, color: '#222', marginLeft: 18 }}>
                        Custom Setting
                      </Text>
                    </View>
                    <View style={{justifyContent:'center',height:30}}>
                      <TouchableOpacity onPress={() => destroyModal()}>
                      <Icon
                        name={"chevron-down" }
                        size={Platform.OS === "ios" ? 26 : 26}
                        color="#000"
                        type="material-community"
                        // onPress={}
                        iconStyle={{marginRight: 12,marginBottom:5}} 
                        />
                       
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* <View style={styles.searchBar}>
                    <Image source={require('../../Assets/Images/Search.png')} resizeMode={'stretch'}
                      style={{ width: widthPercentageToDP(5), height: heightPercentageToDP(3), marginLeft: 10, marginBottom: 5 }} />
                    <TextInput
                      placeholder='Search...'
                      placeholderTextColor='#000'
                      style={styles.textInput}
                      //onChangeText={text => this.SearchFilterFunction1(text)}
                      selectionColor='red'
                    />
                  </View> */}
                  <View style={[Common_Style.Search, { margin: 5, width: '96%', }]}>
                    <TextInput 
                      style={[Common_Style.searchTextInput, { width: '96%', }]} 
                      placeholder={'Search '}
                      autoCorrect={false}
                     
                      onChangeText={text => SearchFilterFunction1(text)}
                      placeholderTextColor={'#6c6c6c'} 
                    />

                  </View>


                  {/* <ScrollView contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}> */}
                  <FlatList
                    data={datas}
                    ItemSeparatorComponent={seperator()}
                    // extraData={useState}
                    renderItem={({ item, index }) => (
                      
                        <TouchableOpacity onPress={() => _selectedListForHide(item)}>


                          <View key={`id${index}`} style={[Profile_Style.likeView,{}]}>

                            <View style={[Common_Style.ImgView,{}]}>
                              {item.VerificationRequest === "Approved" ? (
                                <View style={Common_Style.avatarProfile}>
                                  {item.ProfilePic == undefined || null ? (
                                    <View >
                                      <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                        rezizeMode={'cover'} borderRadius={50}
                                        source={require(imagePath + 'profile.png')}>
                                        <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                      </ImageBackground>
                                    </View>)
                                    : (
                                      <View>
                                        <ImageBackground style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'} borderRadius={50}
                                          source={{ uri: serviceUrl.profilePic + item.ProfilePic }}>
                                          <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                          {/* style={businessProfileStyle.verify} /> */}
                                        </ImageBackground>
                                      </View>
                                    )}
                                </View>
                              ) :
                                (<View style={Common_Style.avatarProfile}>
                                  {item.ProfilePic == undefined || null ?
                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'}
                                      source={require(imagePath + 'profile.png')}></Image>
                                    :
                                    <Image style={{ width: '100%', height: '100%', borderRadius: 50 }} rezizeMode={'stretch'}
                                      source={{ uri: serviceUrl.profilePic + item.ProfilePic }} />}
                                </View>)}




                              <View style={Common_Style.nameParentView}>
                                <View style={Common_Style.nameView}>
                                  <Text style={Common_Style.nameText1} >{item.UserName}</Text>
                                  <Text style={Common_Style.nameText2} >{item.name != "null" || null ? item.name : null}</Text>
                                </View>
                              </View>

                            </View>

                            {item.selected === true ?
                             <View style={{width:96,marginLeft:'28%'}}>
                              <Image style={{ width: 22, height: 22, marginTop: 15,  }}
                                source={require('../../Assets/Images/check.png')} />
                                </View>
                              : null
                            }
                          </View>



                        </TouchableOpacity>
                     
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={false}
                  />

                  {/* </ScrollView> */}

                  {/* <TouchableOpacity onPress={() => _goAndHideTheFollowees()}>
                    <LinearGradient
                      start={{ x: 0, y: 0.75 }}
                      end={{ x: 1, y: 0.25 }}
                      style={styles.hideButton}
                      colors={["#007fca", "#5da9d6"]} >
                      <Text style={styles.LoginButtontxt}>Hide</Text>
                    </LinearGradient>
                  </TouchableOpacity> */}
                  <TouchableOpacity activeOpacity={1} onPress={() => _goAndHideTheFollowees()}>

                    <View style={[common_styles.Common_button, { width: wp('97%'), marginBottom: 10 }]}>
                      <ImageBackground source={require('../../Assets/Images/button.png')}
                        style={{ width: '100%', height: '100%' }}
                        borderRadius={10}
                      >
                        <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                          onPress={() => _goAndHideTheFollowees()}>
                          <Text style={common_styles.Common_btn_txt}>Hide</Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                </View>
              </Modal>

              <Modal pause={isPause}
                isVisible={isViewModal}
                // onSwipeComplete={this.close}
                swipeDirection={['down']}
                style={styles.view}>

                <Container style={{ width: widthPercentageToDP('100%'), height: heightPercentageToDP('100%'), }}>

                  <View style={{}}>
                    {/* e6e6e6 */}
                    <View style={{
                      flexDirection: 'row', width: '100%', justifyContent: 'center',
                      marginBottom: 10
                    }}>
                      <View style={{ marginTop: StatusBar.currentHeight}}>
                        {/* <TouchableOpacity onPress={() => closeViewByUsers()}>
                          <Image source={require(imagepath1 + 'CancelView.png')}
                            style={{ height: 20, width: 20 }} resizeMode={'stretch'} />
                        </TouchableOpacity> */}
                      </View>

                      <View style={{ marginTop: StatusBar.currentHeight, marginLeft: wp('20%'), }}>
                        <View style={{
                          width: wp('20%'), height: hp('15%'), backgroundColor: '#c1c1c1',
                          borderRadius: 8, overflow: 'hidden'
                        }} >
                          <Image source={{ uri: been_image_urlExplore + story[currentIndex].pic }}
                            style={{ height: '100%', width: '100%' }} 
                           // resizeMode={'cover'} 
                            />
                        </View>
                      </View>
                      <View style={{ marginLeft: wp('20%'), marginTop: wp('4%') }}>
                        {/* <TouchableOpacity onPress={() => onDownoad()}>
                          <Image source={require(imagepath1 + 'downloadView.png')}
                            style={{ height: heightPercentageToDP('3.7%'), width: widthPercentageToDP('5%') }} resizeMode={'stretch'} />
                        </TouchableOpacity> */}
                      </View>
                      <View style={{ marginTop: wp('4%') }}>
                        {/* <TouchableOpacity onPress={() => deleteData(story[currentIndex], currentIndex)}>
                          <Image source={require(imagepath1 + 'deleteView.png')}
                            style={{ height: heightPercentageToDP('3%'), width: widthPercentageToDP('4%') }} resizeMode={'stretch'} />
                        </TouchableOpacity> */}
                      </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                     
                        <View style={{ flexDirection: 'row',justifyContent:'space-between',
                          marginTop: wp('3%'),height: 25, }}>
                          <View style={{ marginLeft: 15,justifyContent:'center', }}>
                            <Text style={{ fontSize: 14,fontFamily :Common_Color.fontMedium,color:'#000' }}>Viewed by {viewData.length}</Text>
                          </View>

                          
                          <TouchableOpacity onPress={() => closeViewByUsers()} >
                          <View style={{justifyContent:'center',}}>
                            <Icon
                              name={"chevron-down"}
                              size={Platform.OS === "ios" ? 30 : 26}
                              color="#000"
                              type="material-community"
                              // onPress={}
                              iconStyle={{ marginRight: 10, marginBottom: 5 }}
                            />
                            </View>
                            {/* <Image source={require(imagepath1 + 'DownArrowView.png')}
                                style={{ height: 20, width: 20, }} resizeMode={'center'} /> */}
                          </TouchableOpacity>
                          
                        </View>

                        <FlatList
                          data={viewData}
                          ItemSeparatorComponent={seperator()}
                          // extraData={useState}
                          renderItem={({ item, index }) => (

                              <View key={`id${index}`} style={{ flexDirection: 'row', height: 80, width: widthPercentageToDP('100%'), justifyContent: 'flex-start' }}>
                                <View style={{ width: widthPercentageToDP('2%') }} />
                                <View style={{ width: widthPercentageToDP('15%') }}>
                                  {item.ProfilePic != null ?
                                    <Image style={{ width: 50, height: 50, borderRadius: 25, margin: 10 }}
                                      source={{ uri: profilePic + item.ProfilePic }} />
                                    :
                                    <View style={{ width: 50, height: 50, borderRadius: 25, margin: 10, backgroundColor: 'grey' }} />
                                  }
                                </View>

                                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10, justifyContent: 'center' }}>
                                  <Text style={{ fontSize: 18 }}>{item.UserName}</Text>
                                  <Text style={{ fontSize: 16, color: 'gray' }}>{item.name != "null" || null ? item.name : null}</Text>
                                </View>

                              </View>
                          
                          )}
                          keyExtractor={(item, index) => index.toString()}
                          horizontal={false}
                        />
                     
                    </View>
                  </View>

                </Container >


              </Modal>


            </View>}

          <ProgressArray1
            next={nextStory}
            isLoaded={isLoaded}
            duration={duration}
            pause={isPause}
            isNewStory={props.isNewStory}
            stories1={story}
            currentIndex={currentIndex}
            currentStory={story[currentIndex]}
            length={story.map((_, i) => i)}
            progress={{ id: currentIndex }}
          />
        </View>
      </TouchableWithoutFeedback>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // paddingTop: 30,
    backgroundColor: '#00000000',
    // marginTop:StatusBar.currentHeight
  },
  modalView1: { backgroundColor: '#000', borderRadius: 8, width: widthPercentageToDP('96%'), height: heightPercentageToDP('20%'), justifyContent: 'center', alignContent: 'center' },
  readMore: {
    width: widthPercentageToDP('100%'),
    height: 50,
    flexDirection: 'row',
    marginBottom: 15,
    // backgroundColor: "#000"
  },
  textInput: { width: widthPercentageToDP('90%'), height: 45, marginBottom: 10, color: '#000', marginTop: 12, padding: 15, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
  searchBar: { flexDirection: 'row', width: widthPercentageToDP('80%'), backgroundColor: '#ffffff', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 25, padding: 15, borderWidth: 1.2, borderColor: '#ededef', borderBottomWidth: 1, borderBottomColor: '#d7d7d7', marginLeft: 12, marginRight: 12 },
  loginButton: {
    backgroundColor: "#87cefa",
    alignItems: "center",
    height: heightPercentageToDP("4%"),
    width: widthPercentageToDP("20%"),
    color: "blue",
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  hideButton: {
    // backgroundColor: "#87cefa",
    alignItems: "center",
    justifyContent: "center",
    // borderBottomRightRadius:10,
    // borderBottomLeftRadius:10,
    height: heightPercentageToDP("6%"),
    width: widthPercentageToDP("100%"),

  },
  modalText1: { fontSize: 16, textAlign: 'center', color: "#010101", fontFamily: Common_Color.fontMedium, marginBottom: 5, marginTop: 5 },
  modalText: { color: '#acacac', fontSize: 14, fontWeight: 'normal', marginTop: heightPercentageToDP('2%'), marginLeft: widthPercentageToDP('6%'), marginBottom: heightPercentageToDP('1.3%') },
  loginButton1: {
    backgroundColor: "#87cefa",
    alignItems: "center",
    height: heightPercentageToDP("4%"),
    width: widthPercentageToDP("20%"),
    color: "blue",
    borderRadius: 5,
    borderWidth: .8,
    borderColor: '#bcbcbc',
    justifyContent: "center",
    shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  LoginButtontxt: {
    color: "#fff",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 16,
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
  modal: { backgroundColor: "#FFF", borderRadius: 25, borderColor: "rgba(0, 0, 0, 0.1)", justifyContent: 'center', alignItems: 'center' },
  modal1: {
    marginLeft: '15%',
    marginRight: '15%',
    height: 100,
    width: widthPercentageToDP('60%'),
    backgroundColor: '#fff',
    borderRadius: 15
  },

  bar: {
    width: 50,
    height: 8,
    backgroundColor: 'blue',
    alignSelf: 'center',
    borderRadius: 4,
    marginTop: 8,
  },
  view: {
    justifyContent: 'flex-end', 
    width: widthPercentageToDP('100%'), 
    margin: 0, 
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: '#00000000'
  },
  modalContent: { backgroundColor: "#FFF", borderRadius: 25, borderColor: "rgba(0, 0, 0, 0.1)", justifyContent: 'center', alignItems: 'center' },
});

export default StoryContainer1;
