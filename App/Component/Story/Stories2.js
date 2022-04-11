import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, StatusBar, TouchableOpacity, View, ImageBackground } from 'react-native';
// import Modal from 'react-native-modalbox';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StoryContainer from './StoryContainer';
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Common_Style from '../../Assets/Styles/Common_Style'
import Loader from '../../Assets/Script/Loader';

const Stories2 = (props) => {
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);
  const [loader ,setLoader] = useState(true)
  const [datas, setDatas] = useState([]);
  const [id] = useState()

  useEffect(() => {
    //debugger
    // console.log('the stories2 props',props);
    // alert('test ok');
    const getStories = async () => {
        // if(!props.placeId){
        //   return false
        // }
      const data = { 
          userId: await AsyncStorage.getItem('userId'),
          PlaceId : props.placeId
        };
        setLoader(true);
      const url = serviceUrl.been_url + "/GetStoryForPlace";
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
        console.log('responseJson stories2',responseJson);
        if(responseJson.status !== "True" ){
          setLoader(false);
        }
        setLoader(false);
        setDatas(responseJson.result || []);
      } catch (error) {
        setLoader(false);
        console.log("Error: ", error);
      }
    }
    getStories();
  }, []);

  const onStorySelect = (index) => {
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

      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious();

      setCurrentScrollValue(scrollValue);
    }
  };

  const renderStoryItems = (item, index) => {
    console.log('the item',item);
    return (
      
      <View key={index.toString()} style={{
        width: wp('29%'), height: hp(32), marginLeft: wp(2.5),
        maxWidth: "29%", borderRadius: 10, marginTop: hp(2.5), overflow: 'hidden', backgroundColor: '#c1c1c1'
      }} >
        <Text>{item.UserName}</Text>
        {item.story && item.story.length > 0 ?
          <TouchableOpacity onPress={() => onStorySelect(index)}>
            <ImageBackground
              resizeMode={'cover'}
              style={{ width: wp('30%'), height: hp(36) }}
              source={{ uri: serviceUrl.StatusImage + item.story[0].pic }}>

              {item.UserProfilePic != null ?
                <Image
                  style={styles.circle}
                  source={{ uri: serviceUrl.profilePic + item.UserProfilePic }}
                  isHorizontal
                /> :
                <Image
                  style={styles.circle}
                  source={require('../../Assets/Images/profile.png')}
                  isHorizontal />}

              {item.story && item.story.length > 0 ?
                <Text style={[Common_Style.title, { textAlign: 'center' }]}>
                  {item.UserName}
                </Text> : null}

            </ImageBackground>
          </TouchableOpacity> : null}
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
      {!loader && datas.length > 0 ?
      <FlatList
        data={datas}
        ListFooterComponent={<View style={{height:90}} />}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={false}
        renderItem={({ item, index }) => (renderStoryItems(item,index) )}
        numColumns={3}
        keyExtractor={(item,index)=>index.toString()}
      />
      : !loader && datas.length == 0 ?
        <View style={{flex: 1,justifyContent: "center", alignItems: "center",marginTop: '0%'}}>
          <Text style={{...Common_Style.noDataText,fontWeight:'100'}}> No Stories Yet..! </Text>
        </View>
      :
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: '0%' }}>
          <Loader />
        </View>
      }

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
          {datas.map((item, index) => (
            <StoryContainer
              key = {index.toString()}
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              user={item}
              isNewStory={index !== currentUserIndex}
              navigation = {props.navigation}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    // backgroundColor: 'red',
    marginBottom: 20 
   },
  circle: { width: 25, margin: 5, height: 25, borderRadius: 33,borderWidth:1.2, borderColor: '#fff',alignContent:'center',alignSelf:'center' },
  modal: { flex: 1, },
  title: { fontSize: 14,marginLeft:5,textAlign: 'center',fontWeight:'700', color: '#fff', marginTop: 8,position:'absolute',bottom:5 },
});

export default Stories2;
