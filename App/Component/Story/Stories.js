import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View, ImageBackground,
StatusBar } from 'react-native';
// import Modal from 'react-native-modalbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import StoryContainer from './StoryContainer';
import serviceUrl from '../../Assets/Script/Service';
import Common_Style from '../../Assets/Styles/Common_Style'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



const Stories = (navigation) => {
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);
  const [datas, setDatas] = useState([]);
  const [id] = useState()

  useEffect(() => {
    //debugger
    // alert('test ok');
    const getStories = async () => {
      const data = { Userid: await AsyncStorage.getItem('userId') };
      const url = serviceUrl.been_url + "/StoryFollowPerson";
      //console.log('the fake json data',fakedata);
      let subscribed = true
      // const responseJson = fakedata
      // setDatas(responseJson.userStory);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
          },
          body: JSON.stringify(data)
        });

        const responseJson = await response.json();
        // console.log("Inside of responseJson of stories",responseJson);
        if (subscribed) {
          setDatas(responseJson.result);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
      return () => (subscribed = false);
    }
    getStories();
  }, []);


  // console.log("responseJson",datas);

  const onStorySelect = (index, item) => {
    // console.log('items are',item)
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onStoryClose = () => {
    setModel(false);
  };

  const onStoryNext = (isScroll) => {
    const newIndex = currentUserIndex + 1;
    if (datas.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = (isScroll) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      console.log('next');
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious();
      console.log('previous');
      setCurrentScrollValue(scrollValue);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="dark-content" />
      <FlatList
        data={datas}
        horizontal
        renderItem={({ item, index }) =>
          (
          <View key={index.toString()} style={{ width: 80, height: 120, margin: 4,
            backgroundColor:item.story?.length > 0 ?'#c1c1c1' : '#00000000',borderRadius:8 }} >
            {typeof item.story != undefined && item.story.length > 0 ?
              <TouchableOpacity onPress={() => onStorySelect(index, item)}>
                <ImageBackground style={{ width: 80, height: 120, }} 
                  borderRadius={8} source={{ uri: serviceUrl.StatusImage + item.story[0].pic }}
                  rezizeMode={'cover'}
                >
                  {item.VerificationRequest == "Approved" ? (
                    <View>
                      {item.UserProfilePic == null ? (
                        <View >
                          <ImageBackground style={[Common_Style.mediumAvatar,{margin:5,borderWidth: 2, borderColor: '#72bec5',}]}  borderRadius={50}
                            source={require(imagePath + 'profile.png')}
                            resizeMode={'cover'}
                            >
                          
                          </ImageBackground>
                        </View>)
                        : (
                          <View>
                             <ImageBackground style={[Common_Style.mediumAvatar,{margin:5,borderWidth: 2, borderColor: '#72bec5',}]}  borderRadius={50}
                              source={{ uri: serviceUrl.profilePic + item.UserProfilePic }}>
                              <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImagesmall} />
                            </ImageBackground>
                          </View>
                        )}
                    </View>
                  ) :
                    (<View style={{}}>
                      {item.UserProfilePic == null ?
                        <Image style={[Common_Style.mediumAvatar,{margin:5,borderWidth: 2, borderColor: '#72bec5',}]} rezizeMode={'cover'}
                          source={require(imagePath + 'profile.png')}></Image>
                        :
                        <Image style={[Common_Style.mediumAvatar,{margin:5,borderWidth: 2, borderColor: '#72bec5',}]} rezizeMode={'cover'}
                          source={{ uri: serviceUrl.profilePic + item.UserProfilePic }} />}
                    </View>)}

                </ImageBackground>
              </TouchableOpacity> : null}

            {typeof item.story != undefined && item.story.length > 0 ?
              <Text style={[Common_Style.title,{textAlign: 'center',}]}>
                {item.UserName}
              </Text> : null}
          </View>
          )}
          keyExtractor={(item,index)=>index.toString()}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll.current.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}
      >
        {/* eslint-disable-next-line max-len */}
        <CubeNavigationHorizontal callBackAfterSwipe={g => onScrollChange(g)} ref={modalScroll} style={styles.container}>
          {datas.length > 0 && datas.map((item, index) => (
            <StoryContainer
              key = {index.toString()}
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              user={item}
              isNewStory={index !== currentUserIndex}
              navigation = {navigation}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', backgroundColor: 'transparent', },
  circle: {  width: 35, margin: 5, height: 35, borderRadius: 33, borderWidth:1.2, borderColor: '#fff', },
  modal: { flex: 1, },
  title: { fontSize: 12, textAlign: 'left', color: '#fff', fontWeight: '400', marginTop: 3 },
});

export default Stories;
