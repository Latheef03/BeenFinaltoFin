/**@Import_modules */
import React from 'react';
import { View,FlatList,TouchableOpacity, } from 'react-native';
import {deviceHeight as dh , deviceWidth as dw} from '../../_utils/CommonUtils';

/**
 @component
 @Text_Custom_Colors
*/
const colorsDimens = 30;
const seletedDim = 40;

const TextColors = ({colours,changeColor}) =>(
  <View style={{width:dw,height:dh * .08,flexDirection:'row',bottom:10,position:'absolute'}}>
    <FlatList
      data = {colours}
      horizontal
      keyboardShouldPersistTaps = 'handled'
      contentContainerStyle={{alignItems:'center'}}
      showsHorizontalScrollIndicator = {false}
      renderItem = {({item,index})=>(
       <TouchableOpacity onPress={()=>changeColor(item,index)}>
        <View key={`id${index}`} 
          style={{
            width:item.selected?seletedDim: colorsDimens,
            height:item.selected?seletedDim:colorsDimens,
            borderRadius:item.selected?seletedDim:colorsDimens / 2,
            backgroundColor:item.color,marginLeft:7.5,marginRight:7.5,
            borderWidth:1,borderColor:'#FFF' ,
            
          }}
         />
       </TouchableOpacity>
      )}
      keyExtractor = {(item,index)=>index.toString()}
      extraData = {colours}
    />
  </View>
)

export default TextColors;