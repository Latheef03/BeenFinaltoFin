/* eslint-disable */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View ,StatusBarIOS,StatusBar} from 'react-native';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'

class UserView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;
    const setResource = props.profile == undefined
    ? require('../../Assets/Images/profile.png')
    : { uri: props.profile }
   
    return (
      <View style={styles.userView}>
        
        <Image
          source={setResource}
          style={styles.image}
        />
        
        <View style={{ flex: 1,}}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.time}>{props.time}</Text>
        </View>
        <TouchableOpacity onPress={props.onClosePress} >
            <View >
              {/* <Text style={styles.closeBut}>x</Text> */}
              <Image source={require('../../Assets/Images/close_white.png')} 
          //   resizeMode={'center'}
               style={{width:20,height:20,}}
              />
            </View>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 8,
    backgroundColor : '#c1c1c1'
  },
  userView: {
    flexDirection: 'row',
    position: 'absolute',
    top:StatusBar.currentHeight + 30,
    width: '96%',
    alignItems: 'center',
  },
  name: {
    fontSize: UnameStory.FontSize,
    fontFamily:UnameStory.Font,
    marginLeft: 12,
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10
  },
  closeBut:{
    color:'#FFF',fontSize:24,textAlign:'center',
    textShadowColor: '#000',
    
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 12,
    
    
  },  
  time: {
    fontSize: Timestamp.FontSize,
    // fontFamily:Timestamp.Font,
    marginTop: 3,
    marginLeft: 12,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10
  },
});

export default UserView;
