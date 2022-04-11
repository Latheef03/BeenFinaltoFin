/**@Import_Modules */
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, StatusBar, Text, StatusBarIOS } from 'react-native';
import { deviceWidth as dw, deviceHeight as dh } from '../../_utils/CommonUtils';

/**
  @Main_Component called @EditorTools
  @param {close,Text,sketch,sticker}
  @The_Component was written by @MUFTHI :-)
*/
export default class EditorTools extends Component {
  render() {
    const { noActiveTools, close, actionTools, deletedStickerData, deleteSticker } = this.props
    console.log('deletedStickerData', deletedStickerData)
    return (
      noActiveTools && (
        <>
        {/* <View style={{
        //   width: dw, height: dh, 
        //   // position: 'relative'
        //   //  zIndex:1,...StyleSheet.absoluteFill,
        //   // backgroundColor: 'green'
        //   // 'rgba(0,0,0,0.5)'
        // }}> */}
          <View style={{
            // width: dw , height: dh * 0.075,
            marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight + 10: StatusBar.currentHeight,
            position:'absolute',left:10
          }}>
            {/**@Close  */}
            <TouchableOpacity onPress={() => close()}>
              <View style={{ padding:10 }}>
                <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../../Assets/Images/close_white.png')} />
              </View>
            </TouchableOpacity>

            {/* <View style={{ width: dw * 0.65,backgroundColor:'red' }} /> */}

          </View>

          { deletedStickerData != undefined && deletedStickerData.status &&
          <View style={{
            // width: dw , height: dh * 0.075,
            marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight + 10: StatusBar.currentHeight,
            position:'absolute',right:0 ,
            
          }}>
              <TouchableOpacity onPress={() => deleteSticker(deletedStickerData)}>
                <View style={{padding: 10,backgroundColor: 'rgba(0,0,0,.2)',borderTopLeftRadius: 20, borderBottomLeftRadius: 20,}}>
                  {/* <Image style={{ width: 20, height: 20,alignSelf:'flex-end' }} source={require('../../../Assets/Images/close_white.png')} /> */}
                  <Text style={{
                    color: '#fff',  textAlign: 'center',
                     fontSize: 16, 
                  }}>Delete</Text>
                </View>
              </TouchableOpacity>
              </View>
            } 

          <View style={{
            width: dw * 0.15, height: '80%', flexDirection: 'column', justifyContent: 'flex-end',
            alignSelf: 'flex-end', position:'absolute',bottom : dh * 0.08,
           
          }}>

            {/**@Text  */}
            <TouchableOpacity onPress={()=>actionTools(0)}>
                  <View style={styles.mainTools}>
                    <Image style={{ width: 20, height: 20,alignSelf:'center'  }} source={require('../../../Assets/Images/text.png')} 
                     // resizeMode={'center'}
                    />
                  </View>
                </TouchableOpacity>

            {/**@Sketch  */}
            <TouchableOpacity onPress={()=>actionTools(1)}>
                  <View style={styles.mainTools}>
                    <Image style={{ width: 15, height: 15,alignSelf:'center'  }} source={require('../../../Assets/Images/edit.png')} 
                    // resizeMode={'center'}
                    />
                  </View>
                </TouchableOpacity>

            {/**@Sticker  */}
            <TouchableOpacity onPress={() => actionTools(2)}>
              <View style={styles.mainTools}>
                <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../../Assets/Images/sticker.png')}
                // resizeMode={'center'}
                />
              </View>
            </TouchableOpacity>

          </View>

</>
        // </View>
      )
    )
  }
}

const styles = {
  mainTools: {
    // width:dw ,
    height: '15%',
    justifyContent: 'center',
    marginRight: 0,
    // backgroundColor: 'plum',
    padding: 25,
  }
}