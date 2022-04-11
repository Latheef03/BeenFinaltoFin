import React from 'react';
import { View,PanResponder,Animated,useState } from 'react-native';


export var panlist =
{
  pan0 :  new Animated.ValueXY(),
  pan1 : new Animated.ValueXY(),
  pan2 : new Animated.ValueXY(),
  pan3 :  new Animated.ValueXY(),
  pan4 : new Animated.ValueXY(),
  pan5 : new Animated.ValueXY(),
  pan6 :  new Animated.ValueXY(),
  pan7 : new Animated.ValueXY(),
  pan8 : new Animated.ValueXY(),
  pan9 : new Animated.ValueXY(),
  pan10 : new Animated.ValueXY(),
  pan11 : new Animated.ValueXY(),
  pan12 : new Animated.ValueXY(),
  pan14:new Animated.ValueXY(),
  pan15:new Animated.ValueXY(),
  
}

export const panResponder0 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan0.x,
        dy: panlist.pan0.y,
      },
    ]),
   
  });

export const panResponder1 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan1.x,
        dy: panlist.pan1.y,
      },
    ]),

  });


export const panResponder2 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan2.x,
        dy: panlist.pan2.y,
      },
    ]),

  });

export const panResponder3 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan3.x,
        dy: panlist.pan3.y,
      },
    ]),

  });

export const panResponder4 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan4.x,
        dy: panlist.pan4.y,
      },
    ]),

  }); 

export const panResponder5 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan5.x,
        dy: panlist.pan5.y,
      },
    ]),

  });

export const panResponder6 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan6.x,
        dy: panlist.pan6.y,
      },
    ]),

  }); 
  
export const panResponder7 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan7.x,
        dy: panlist.pan7.y,
      },
    ]),

  });
  
export const panResponder8 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan8.x,
        dy: panlist.pan8.y,
      },
    ]),

  }); 

export const panResponder9 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan9.x,
        dy: panlist.pan9.y,
      },
    ]),

  });
 
export const panResponder10 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan10.x,
        dy: panlist.pan10.y,
      },
    ]),

    

  });   

  export const panResponder14 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan14.x,
        dy: panlist.pan14.y,
      },
    ]),

    

  });   
  
  export const panResponder15 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: panlist.pan15.x,
        dy: panlist.pan15.y,
      },
    ]),

    

  });   
  
  

 
  