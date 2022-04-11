import React, { Component } from 'react';
import { View, Clipboard, Text, ImageBackground, Image, Share, TextInput, Dimensions, 
  StatusBar, ScrollView, ToastAndroid, 
  Animated, PanResponder, FlatList,TouchableWithoutFeedback } from 'react-native';
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewMoreText from 'react-native-view-more-text';
import styles from '../../styles/NewfeedImagePost';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import ParsedText from 'react-native-parsed-text';
import TransBack from './TransBack';
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

export default class MultiImageView extends Component {

  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      data: [],
      imageDesc : [],
      Events :[]
    }

  }

  UNSAFE_componentWillMount() {
    debugger
    const Comments = this.props.route.params.data
    console.log("Comments data is",Comments)
    const Description = Comments.desc;
    const Events = Comments.events;
    var ImageArray = Comments.data.split(',');
    this.imgManipulation(ImageArray,Description,Events)
}

imgManipulation = (ImageArray,Description,events) =>{
  console.log('Evene is',events)
  let imageWithUrl = []
   ImageArray.length > 0 && ImageArray.map((m,i)=>{
      let source = {uri:serviceUrl.newsFeddStoriesUrl+m},
      title = null,
      event =events[i];
      imageWithUrl.push({source,title,event});
  });

  console.log('imageWithUrl',imageWithUrl);
  
  imageWithUrl.length > 0 && imageWithUrl.map((s,i)=>{
    Description.length > 0 && Description.map(v=>{
      if(v.imgId == i){
        s.title = v.desc;
      }
      return s;
    });
    return s;
  })
  
  this.setState({data : imageWithUrl })
  // console.log('imageWithUrl',imageWithUrl);
} 
  renderViewMore(onPress) {
    return (
      <Text style={Common_Style.viewMoreText} onPress={onPress}>View more</Text>
    )
  }
  renderViewLess() {
    return (
      <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize,fontFamily:Viewmore.Font, }}></Text>)
    //   <Text onPress={onPress} style={Common_Style.viewMoreText} >View less</Text>
    // )
  }


  renderPostItem = (data, index) => {
    console.log("Image edit data event data is ",data.event +"and the index is ",typeof data);
     const event = data.event && data.event || {}
     const scale = event.crops && event.crops.scale ? event.crops.scale : 1.0001;
     const trX =  event.crops && event.crops.positionX && scale >= 1.01 ? event.crops.positionX : 0;
     const trY = event.crops && event.crops.positionY && scale >= 1.01 ? event.crops.positionY : 0;
    
     return (
 
       <View key={index.toString()} style={{backgroundColor: 'transparent'}}>
        
         <SelectedFilters images = {event}
                    childrenComponent = {(
                     <View style={styles.cardImage}>
           <View style={[styles.imageBackGroundView,{marginTop:index === 0 ? Platform.OS === "ios" ? 10 : StatusBar.currentHeight + 5 : 0 }]}>
               {/* <TouchableOpacity activeOpacity={1} onPress={() => data.Image.split(',').length > 1 ? this.imageModal(data) : null} > */}
                 <AnimatedImage  style={{ width: '100%', height: '100%', }}
                   source={data.source}
                   resizeMode = {'cover'}
                   >
                   <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
                     <View style={{ width: '88%', }}></View>
                   </View>
                 </AnimatedImage >
               {/* </TouchableOpacity> */}
           </View>
          
               <View style={{ width: '85%', height: 'auto', margin:'5%',}}>
                   <ParsedText style={Common_Style.descriptionText}
                     parse={[{ pattern: /#(\w+)/, style: Common_Style.hashtagColor },]}>
                     {data.title}
                   </ParsedText>
               </View>
               </View>
 
            )}/>
       
       </View>
 
     )
   }
 
  render() {
    const postLocation = this.props.route.params.data.postLocation
    console.log('the post loca',postLocation);
    return (
      <View style={{ flex: 1,backgroundColor:'#FFF', }}>
        <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle='dark-content' />
        {/* <View> */}

          {/* <Toolbar {...this.props} userNameTitle={postLocation}  /> */}
          
            {/* <View style={{ height: height * 7, marginTop: '3%', }}> */}
            <FlatList
                style={{ width: '100%',height:'100%' }}
                // initialScrollIndex={50}
                // initialNumToRender={2}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                // onViewableItemsChanged={this.onViewableItemsChanged}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 60
                }}
                data={this.state.data}
                // getItemLayout={(data, index) => { return {length: 33, index, offset: 33 * index} }}
                // ref={(ref) => { this.flatListRef = ref; }}
                renderItem={({ item, index }) => (
                  this.renderPostItem(item, index)
                )}
                keyExtractor={(item , index) => index.toString()}
              //getItemLayout={this.getItemLayout}
              />
         
           <TransBack props = {this.props.navigation} />
      
      </View>
    )
  }
}



