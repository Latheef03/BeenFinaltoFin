import React from 'react';
import { StyleSheet, View, BackHandler, Alert,Platform } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Newsfeed from '../NewsFeed/Newsfeed';
import Map from './Map';
import Explore from '../Explore/Explore';

let backPressed = 0;


export default class MyPager extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this.state = {
      isloggedin: false,
      backPressed: 1,
      initialPage: 1,
      pagePosition : 1
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.PageScrollEvent = this.PageScrollEvent.bind(this)
  }

  componentDidMount(){
    if(Platform.OS != 'ios'){
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
  }

  componentWillUnmount() {
    if(Platform.OS != 'ios'){
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
  }
  
  handleBackButtonClick = e =>{
    const {pagePosition} = this.state;
    console.log('the back clicked',e);
    const {navigation} = this.props;
    const RN = this.props.navigation.state?.routeName
    console.log('the RN',RN);
    return false;
    // if(pagePosition == 1 && RN !== 'MyPager'){

    //   console.log('pos',pagePosition )
    //   console.log("the nav",this.props.navigation.state.routeName);
    //   Alert.alert(
    //     'Confirm','Do you want to quit the app?',
    //     [
    //       {text: 'CANCEL', style: 'cancel'},
    //       {text: 'OK', onPress: () => BackHandler.exitApp()}
    //     ]
    //   );
    //   return true;

    // }else if(pagePosition !== 1 && RN !== 'MyPager'){
    //   this.setState({initialPage : 1});
    //   // console.log("the nav",this.props.navigation.state.routeName);
    //   // this.PageScrollEvent
    //   return true;
    // }else{
    //   this.props.navigation.goBack();
          //return true;
    //   // return false;
    // }
    // this.props.navigation.goBack(null);

  }

  PageScrollEvent = e =>{
    /**
     * @param {position-0 = Explore}
     * @param {position-1 = Map}
     * @param {position-2 = Newsfeed}
     */
    const pos = e.nativeEvent.position
    this.setState({
      pagePosition : pos
    })

  }

  pageSelectedEvent = ev =>{
    // console.log('the on page selected evee',ev);
    // console.log('the on page selected evee native',ev.nativeEvent);
    
  }

  PageScrollStateChangedEvent = e =>{
    console.log('the PageScrollStateChangedEvent native',e.nativeEvent)
  }

  render() {
    return (
      <ViewPager style={styles.viewPager} 
       initialPage={this.state.initialPage}
       onPageScroll ={this.PageScrollEvent}
       onPageSelected = {ev=>{this.pageSelectedEvent(ev)}}
       
      //  onPageScrollStateChanged ={e=> this.PageScrollStateChangedEvent(e)}
      >

        <View key="Explore" >
          <Explore {...this.props} />
        </View>
        
        <View key="Map">
          <Map {...this.props} />
        </View>
        {/* */}
        <View key="Newsfeed">
          <Newsfeed {...this.props} />
        </View>
        {/* <View 
        
          key="Explore">
          <Explore {...this.props} />
        </View> */}
      </ViewPager>
    );
  }
};


const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
});