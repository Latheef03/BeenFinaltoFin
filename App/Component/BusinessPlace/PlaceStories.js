import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
// import Modal from 'react-native-modalbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import StoryContainer from '../Story/StoryContainer';
import serviceUrl from '../../Assets/Script/Service';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Common_Style from '../../Assets/Styles/Common_Style'

const PlaceSrories = (props) => {
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);
  const [datas, setDatas] = useState([]);
  const [id] = useState()

  useEffect(() => {
    debugger
    // alert('test ok');

    const getStories = async () => {
      const data = {
        PlaceName: await AsyncStorage.getItem("PlaceName")
      };
      const url = serviceUrl.been_url + "/getstories"

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: serviceUrl.headers,
          body: JSON.stringify(data)
        });

        const responseJson = await response.json();
        // console.log("Inside of responseJson",responseJson);
        setDatas(responseJson.Result);
      } catch (error) {
        console.log("Error: ", error);
      }
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
     
     {datas != undefined ?
      <FlatList
        data={datas}
        horizontal
        renderItem={({ item, index }) =>
          (<View style={{ width: 170, height: 220, margin: 4, marginTop: 5 }} >
            
              <TouchableOpacity onPress={() => onStorySelect(index, item)}>
                <ImageBackground style={{ width: 170, height: 220 }} borderRadius={8} source={{ uri: serviceUrl.StatusImage + item.story[0].pic }}>

                  {item.UserProfilePic != null ?
                    <Image
                      style={styles.circle}
                      source={{ uri: serviceUrl.profilePic + item.UserProfilePic }}
                      isHorizontal
                    /> :
                    <Image
                      style={styles.circle}
                      source={require('../../Assets/Images/assam.jpg')}
                      isHorizontal />}

                </ImageBackground>
              </TouchableOpacity> 

            {typeof item.story != undefined && item.story.length > 0 ?
              <Text style={styles.title}>
                {item.UserName}
              </Text> : null}
          </View>
          )}
      />

      :  
      <View>
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center",alignItems:'center',marginTop:'100%' }}>
        <View style={styles.hasNoMem}>
          <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: 65, width:65, }} />
          <Text style={Common_Style.noDataText}> You have not created any Stories yet!</Text>
        </View>
      </View>
        </View> }

        {datas != undefined ?
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
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              user={item}
              isNewStory={index !== currentUserIndex}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal> : null}
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', backgroundColor: 'transparent', },
  circle: { width: 35, margin: 5, height: 32, borderRadius: 33, borderWidth: 2, borderColor: '#72bec5', },
  modal: { flex: 1, },
  title: { fontSize: 12, textAlign: 'left', color: '#fff', fontFamily: 'Roboto-Regular', marginTop: 3 },
  hasNoMem: { justifyContent: 'center', alignItems: 'center'   },
});

export default PlaceSrories;
