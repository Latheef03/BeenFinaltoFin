/** @Import_Modules */
import React,{Component} from 'react';
import { View,StyleSheet,Text,FlatList,Image,TouchableOpacity,ImageBackground,StatusBar } from 'react-native';
import {deviceWidth as dw , deviceHeight as dh,Days,date} from '../../_utils/CommonUtils';
import stickers from './Stickers';
import Modal from 'react-native-modalbox';

/**
  @Main_Component called @StickerContainer
  @The_Component includes third party library (- @Modal -)
  @The_Component was written by @MUFTHI :-)
*/
export default class StickerContainer extends Component{
   constructor(props){
     super(props);
     this.state = {
        stickers: stickers
     }
   }

   componentDidMount = () =>{
    
   }

   modalClose = () =>{
    this.refs.stickersMod.close()
    this.props.actionTools(undefined)
   }
   
   selectSticker = (items) =>{
    // console.log('the props',this.props);
    if(items.id == 1){
      this.props.navigation.navigate('Gplaces');
      this.refs.stickersMod.close()
      return
    }
    this.refs.stickersMod.close()
    this.props.actionTools(undefined)
    this.props.pickedSticker(items)
    
   }

   commonDays = (image) =>(
        <ImageBackground source={image} 
          style={{ width: '100%', height: '100%',justifyContent:'center' }}
          resizeMode='contain'
           >
          <Text style={{ color: '#ef1b66', textAlign: 'center', marginLeft: 20 }}>
            {Days()}
          </Text>
        </ImageBackground>
   )

   fullDateCommon = () =>(
      <View style={{ justifyContent: 'center' }}>
      <Text style={{
        textAlign: 'center', color: '#FFF', fontSize: 20, fontWeight: 'bold'
      }}>
        {date()}
      </Text>
      </View>
    )

   render(){
     const {isActive,actionTools,pickedSticker} = this.props
     const {stickers} = this.state
     return(
       isActive && (
        <View style={{...StyleSheet.absoluteFillObject,}}>
          
          <Modal backdrop={false} 
            style={{width:dw,height:dh,backgroundColor: "rgba(0,0,0,.7)",}} 
            isOpen={isActive}
            onClosed = {()=>actionTools(undefined)}
            position={"bottom"} 
            animationDuration = {100}
            useNativeDriver = {true}
            ref={"stickersMod"}>
            <View style={{width:dw,height:dh,}}>
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
             {/** @Location */}
             <TouchableOpacity onPress={()=>this.selectSticker({id:1})}>
              <View style={{width:'80%',height: dh * .15,marginTop:10,justifyContent:'center',alignSelf:'center'}}>
                <Image source={require('../../../Assets/stickers/new/visit_check_in.png')} 
                   style={{width: '100%',height:'100%'}} 
                   resizeMode='contain'
                />
               </View>
              </TouchableOpacity>

              <FlatList
                data = {stickers}
                renderItem = {({item,index})=>(
                 <TouchableOpacity onPress={()=>this.selectSticker(item)}>
                  <View key={`id${index}`} style={{width:dw / 3,height: 105,}}>
                     {item.id !== 15 && item.id !== 16 && (
                       <Image source={item.image} 
                       style={{width: '100%',height:'100%'}}
                        resizeMode='contain'
                     />
                     )}
                     
                     {item.id == 15 && ( 
                       <View style={{height:105,justifyContent:'center'}}>
                        {this.commonDays(item.image) }
                       </View>
                     )} 

                     {item.id == 16 && ( 
                       <View style={{height:105,justifyContent:'center',}}>
                        {this.fullDateCommon()}
                       </View>
                     )} 
                      
                  </View>
                 </TouchableOpacity>    
                )}
                keyExtractor = {(item,index)=>index.toString()}
                numColumns = {3}
              /> 

              {/**@Cancel  */}
              <TouchableOpacity style={{bottom:5,position:'absolute',}}
                 onPress={()=>this.modalClose()} 
                >
                <View style={{ height: dh * .1,width:dw, justifyContent: 'center', }}>
                    <Text style={{ fontSize: 20, color: '#fff', textAlign: 'center' }}>Cancel</Text>
                 </View>
              </TouchableOpacity>
             </View>
          </Modal>
        </View>
        ) 
      ) 
   } 
}