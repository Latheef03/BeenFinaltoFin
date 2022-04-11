import React, { PureComponent } from 'react';
import {TouchableWithoutFeedback,View,Image,StatusBar,Platform,StatusBarIOS} from 'react-native';

const TransBack = ({props,iosHeaderHeight}) =>{
  // console.log('√StatusBar.currentHeight',StatusBar.currentHeight);
  return(
    <TouchableWithoutFeedback onPress={()=>props.goBack()}>
      <View style={{width:40,height:40,top:Platform.OS =='ios' ? StatusBar.currentHeight : StatusBar.currentHeight,
         left:12,position:'absolute',}} >
         <Image 
            source={require('../../Assets/Images/Backfeed.png')}
            style={{width:'100%',height:'100%'}}
          // resizeMode={'center'}
          />
       </View>
    </TouchableWithoutFeedback>
    )
}

export default TransBack;