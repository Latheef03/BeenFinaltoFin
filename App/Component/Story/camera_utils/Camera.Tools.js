import React,{Component} from 'react';
import { Platform } from 'react-native';
import { View,StyleSheet,TouchableWithoutFeedback,Image,TouchableOpacity,StatusBar,StatusBarIOS } from 'react-native';
import {deviceHeight as dh , deviceWidth as dw} from '../../_utils/CommonUtils';

export default class CameraTools extends Component{

    render(){
        const {flashImage,closeCamera,flashMode,gallery,snap,cameraTurn} = this.props
        return(
            <View style={{flex:1,...StyleSheet.absoluteFillObject}}> 
            {/* Close Camera */}
            <TouchableWithoutFeedback onPress={() => closeCamera()}>
              <View style={styles.closeView} >
                <Image source={require('../../../Assets/Images/close_white.png')}
                  style={{ width: 25, height: 25, alignSelf: 'center' }}
                //  resizeMode={'center'}
                />
              </View>
            </TouchableWithoutFeedback>

            {/* Flash for camera */}
            <TouchableWithoutFeedback onPress={() => flashMode()}>
              <View style={styles.flashView} >
                {/* <Text style={{color:'#FFF'}}>kkkk</Text> */}
                <Image source={flashImage}
                   style={{ width: 25, height: 25, alignSelf: 'center', }}
                  //  resizeMode={'center'}
                />
              </View>
            </TouchableWithoutFeedback>

            {/**
             * @Elements => @Gallery_picker @Snap @Turn_Camera
            */}
             <View style={styles.mainToolView}>
                 {/* Gallery picker */}
                  <View style={{width:dw * 0.2, height: dh * 0.06,justifyContent:'center'}}>
                    <TouchableOpacity  onPress={() => gallery()} style={styles.capture}>
                      <Image source={require('../../../Assets/Images/story/gallery.png')} style={{ width: 30, height: 30,}} 
                      //resizeMode={'center'}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Snap */}
                  <View style={{width:dw * 0.4,height:dh * 0.13,justifyContent:'center',bottom:30,position:'relative',
                   }}>
                  <TouchableOpacity  onPress={()=>snap()} style={styles.capture}>
                    <Image source={require('../../../Assets/Images/story/snap.png')} style={{ width: 70, height: 70, }} 
                  // resizeMode={'center'} 
                    />
                  </TouchableOpacity>
                  </View>

                  {/*Turn Camera*/}
                  <View style={{width:dw * 0.2,height:dh * 0.06,justifyContent:'center'}}>
                  <TouchableOpacity onPress={() => cameraTurn()} style={styles.capture}>
                    <Image source={require('../../../Assets/Images/story/turncam.png')} style={{ width: 35, height: 35, }} 
                    //resizeMode={'center'}
                    />
                  </TouchableOpacity> 
                </View>
             </View>

         </View>
        )
    }
}

const styles = {
    closeView:{
      width: dw * 0.08, 
      height: dh * 0.05, 
      top:Platform.OS === 'ios'?StatusBar.currentHeight: StatusBar.currentHeight + 5,
      position: 'absolute', 
      right: 10, 
      justifyContent: 'center'
    },
    flashView:{
      width: dw * 0.08, 
      height: dh * 0.05, 
      bottom: 150,
      position: 'absolute', 
      right: 10, 
      justifyContent: 'center',
    },
    mainToolView:{
      flexDirection: 'row', 
      height:dh * 0.06,
      width:dw * 0.8,
      borderRadius:25,
      backgroundColor:'#fff',
      bottom:40,
      position : 'absolute',
      marginLeft:'10%',
    },
    capture:{
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20
    }
}