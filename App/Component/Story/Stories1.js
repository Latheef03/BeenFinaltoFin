import React, { useRef, useState, useEffect } from 'react';
import { FlatList,StatusBar, Image, Modal, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Modal from 'react-native-modalbox';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import StoryContainer1 from './StoryContainer1';
import serviceUrl from '../../Assets/Script/Service';
import {Common_Color} from '../../Assets/Colors'
import { toastMsg } from '../../Assets/Script/Helper';
import Common_Style from '../../Assets/Styles/Common_Style'
let Common_Api = require('../../Assets/Json/Common.json')


const Stories1 = (navigation) => {
  // console.log('Stories1 navigation',navigation);
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);
  const [datas, setDatas] = useState([]);
  const [id] = useState()
  useEffect(() => {
    const getStories = async () => {
      const data = { Userid: await AsyncStorage.getItem('userId') };
      const url =serviceUrl.been_url + "/StoryFollowPerson";
      let subscribed = true
      // const responseJson = fakedata
      // setDatas(responseJson.userStory)
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
        // console.log("Inside of responseJson story1",responseJson);
        if(subscribed){
         if(responseJson.status == 'False' && responseJson.userStory?.length == 0) setDatas([]);
         else setDatas(responseJson.userStory);
        }
      } catch (error) {
        // console.log("Error: ", error);
        // console.log("Error: ", error);
        //toastMsg('danger', 'Sorry...Some Network Failure,Try after some time.')
      }
      return () => (subscribed = false);
    }
    getStories();
  }, []);


  // console.log("responseJson",datas);

  const onStorySelect = (index) => {
    if(datas[0].story.length == 0) return false;
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
      <StatusBar backgroundColor='rgba(0,0,0,0)' barStyle='dark-content' />
      <FlatList
        data={datas}
        horizontal
        renderItem={({ item, index }) =>
          (
            <View style={{ width: 80, height: 120, margin: 4,backgroundColor:'#c1c1c1',borderRadius:8}} >
              <TouchableOpacity activeOpacity={1}  onPress={() =>  onStorySelect(index)}>
                {
                  item.story.length > 0 ?
                    <ImageBackground style={{ width:80, height: 120 }} borderRadius={8} source={{ uri: serviceUrl.StatusImage + item.story[0].pic }}
                    
                    >
                      {item.UserProfilePic != null ?
                        <Image
                        style={[Common_Style.mediumAvatar,{margin:5,borderWidth: 2, borderColor: '#72bec5',}]} 
                          source={{ uri: serviceUrl.profilePic + item.UserProfilePic }}
                          isHorizontal
                        /> :
                        <Image
                        style={[Common_Style.mediumAvatar,{margin:5,borderWidth: 2, borderColor: '#72bec5',}]}
                          isHorizontal
                        />}
                    </ImageBackground>

                    :
                  <View style={{ width: 80, height: 120, backgroundColor: '#ebebeb', borderRadius: 8 }}>
                    <ImageBackground source={require('../../Assets/Images/profile.png')}
                      style={{ width: 80, height: 120, backgroundColor: '#ebebeb', borderRadius: 8 }}
                      resizeMode={'contain'}
                    >
                    
                    </ImageBackground>
                    </View>
                }


              </TouchableOpacity>
              <Text style={[Common_Style.title,{textAlign: 'center'}]}>
                {item.UserName}
              </Text>
            </View>
          )}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) { modalScroll.current.scrollTo(currentUserIndex, false); }
        }}
        onRequestClose={onStoryClose}
      >
     
        {/* eslint-disable-next-line max-len */}
        <CubeNavigationHorizontal callBackAfterSwipe={g => onScrollChange(g)} ref={modalScroll} style={styles.container}>
          
          {datas.length > 0 && datas.map((item, index) => (
            <StoryContainer1
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
  container: { flex: 1, justifyContent: 'flex-start', backgroundColor: 'transparent',width:'100%' },
  circle: { width: 35, margin: 5, height: 35, borderRadius: 33, borderWidth:1.2, borderColor: '#fff', },
  modal: { flex: 1, },
  
});

export default Stories1;
