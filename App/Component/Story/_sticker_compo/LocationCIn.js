import React, {Component} from 'react';
import {Animated, StyleSheet, View, Image, Dimensions, Text} from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  ScrollView,
  State,
} from 'react-native-gesture-handler';

import {USE_NATIVE_DRIVER} from '../../_utils/CommonUtils';
const {width} = Dimensions.get('window');

export class DraggableEvent extends Component {
  
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();
  constructor(props) {
   // debugger;
    super(props);
    
    const MI = this.props.multiImage;
    const sIndex = this.props.sIndex;
    const sticId = this.props.sticId;
    
    // const {points} = this.props
    //const pc = imgSticker.some(el=> el.id == sticId && el.panCoords)
    // const x = this.checkProp(points,'panCoords') ? points.panCoords.x : 0
    // const y = this.checkProp(points,'panCoords') ? points.panCoords.y : 0
    this._translateX = MI.map(()=> new Animated.Value(0) );
    this._translateY = MI.map(()=> new Animated.Value(0) );
    this._lastOffset = MI.map(()=>({x: 0, y:  0 }));

    /* draggable */
    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translateX[sIndex],
            translationY: this._translateY[sIndex],
          },
        },
      ],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );

    /* Pinching */
    this._baseScale = MI.map(()=>new Animated.Value(1));
    this._pinchScale = MI.map(()=>new Animated.Value(1));
    this._scale = MI.map((d,i)=> Animated.multiply(this._baseScale[i], this._pinchScale[i]));
    this._lastScale = MI.map(()=> 1 );

    this._onPinchGestureEvent = Animated.event(
      [{nativeEvent: {scale: this._pinchScale[sIndex]}}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );

    /* Rotation */
    this._rotate = MI.map(()=>new Animated.Value(0));
    this._rotateStr = MI.map((d,i)=> this._rotate[i].interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
    }));
    this._lastRotate = MI.map(()=> 0 );
    this._onRotateGestureEvent = Animated.event(
      [{nativeEvent: {rotation: this._rotate[sIndex]}}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );
  }

  _onHandlerStateChange = event => {
    const {sIndex,sticId,EmitterRoutes} = this.props
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset[sIndex].x += event.nativeEvent.translationX;
      this._lastOffset[sIndex].y += event.nativeEvent.translationY;
      this._translateX[sIndex].setOffset(this._lastOffset[sIndex].x);
      this._translateX[sIndex].setValue(0);
      this._translateY[sIndex].setOffset(this._lastOffset[sIndex].y);
      this._translateY[sIndex].setValue(0);
      EmitterRoutes('pan',this._lastOffset[sIndex],sticId)
      // panEmitter(this._lastOffset[sIndex],sticId)
    }
  };

  _onRotateHandlerStateChange = event => {
    const {sIndex,EmitterRoutes,sticId} = this.props
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate[sIndex] += event.nativeEvent.rotation;
      this._rotate[sIndex].setOffset(this._lastRotate[sIndex]);
      this._rotate[sIndex].setValue(0);
      EmitterRoutes('rot',this._lastRotate[sIndex],sticId)
      // REmitter(this._lastRotate[sIndex],sticId)
    }
  };

  _onPinchHandlerStateChange = event => {
    const {sIndex,EmitterRoutes,sticId} = this.props
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale[sIndex] *= event.nativeEvent.scale;
      this._baseScale[sIndex].setValue(this._lastScale[sIndex]);
      this._pinchScale[sIndex].setValue(1);
      EmitterRoutes('pin',this._lastScale[sIndex],sticId)
      // pinEmitter(this._lastScale[sIndex],sticId);
    }
  };

  // checkStic = (SMI,ob,ind) =>{
  //   let obj = false;
  //   if(SMI 
  //     && SMI.imgSticker 
  //     && SMI.imgSticker.length 
  //     && SMI.imgSticker[ind][ob] 
  //    ){  obj = true }
  //   return obj;
  // }

  checkProp = (points,prop) =>{
    let property = false;
    if(points.hasOwnProperty(prop)){
      property = true;
    }
    return property;
  }

  render() {
    const {sIndex,SMI,sticId,points} = this.props;
    /**@PanHandler */
    const x = this.checkProp(points,'panCoords') ? points.panCoords.x : 0
    const y = this.checkProp(points,'panCoords') ? points.panCoords.y : 0
    this._translateX[sIndex].setOffset(x);
    this._translateX[sIndex].setValue(0);
    this._translateY[sIndex].setOffset(y);
    this._translateY[sIndex].setValue(0);
    
    /**@RotateHandler */
    const scale = this.checkProp(points,'rotate') ? points.rotate : 0
    // console.log('the loc scale ==> ',scale)
    this._rotate[sIndex].setOffset(scale);
    this._rotate[sIndex].setValue(0);

    /**@PinchHandler */
    const scaleP = this.checkProp(points,'pinch')? points.pinch : 1
    // console.log('the loc pinch value ==> ',scale)
    this._baseScale[sIndex].setValue(scaleP);
    this._pinchScale[sIndex].setValue(1);

    return (
      <PanGestureHandler
        {...this.props}
        ref={this.panRef}
        onGestureEvent={this._onGestureEvent}
        onHandlerStateChange={this._onHandlerStateChange}
        minDist={10}
        minPointers={1}
        maxPointers={1}
        avgTouches
      >
        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                { translateX: this._translateX[sIndex] 
                },
                { translateY: this._translateY[sIndex] 
                }
              ]
            }
            
          ]}
        
        >
        <RotationGestureHandler
            ref={this.rotationRef}
           simultaneousHandlers={this.pinchRef}
            onGestureEvent={this._onRotateGestureEvent}
            onHandlerStateChange={this._onRotateHandlerStateChange}
          >
         <Animated.View style={styles.container} collapsable={false}>
          <PinchGestureHandler
            ref={this.pinchRef}
            simultaneousHandlers={this.rotationRef}
            onGestureEvent={this._onPinchGestureEvent}
            onHandlerStateChange={this._onPinchHandlerStateChange}
          >
            <Animated.View style={styles.container} collapsable={false}>
              <Animated.Image
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [
                    { perspective: 200 },
                    { scale: this._scale[sIndex] },
                    { rotate: this._rotateStr[sIndex] }
                    //   {rotateX: this._tiltStr},
                  ]
                }}
                source={require("../../../Assets/stickers/new/location_check_in.png")}
              resizeMode={'center'}
              />
            </Animated.View>
          </PinchGestureHandler>
          </Animated.View>
          </RotationGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      
    );
  }
}

export default class LocationCIn extends Component {
  render() {
    const {isActive,multiImage, SMI,sIndex,sticId,EmitterRoutes,points} = this.props;
    return (
      <View style={styles.mainView}>
       {isActive && (
         <DraggableEvent 
          multiImage ={multiImage}
          SMI = {SMI}
          points = {points}
          sIndex = {sIndex}
          sticId = {sticId}
          EmitterRoutes = {EmitterRoutes}
         />
         )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  container: {
     ...StyleSheet.absoluteFillObject,
    // backgroundColor: '#000',
    // overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  box: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
    //margin: 0,
    zIndex: 200,
  },
  pinchableImage: {
    width: width,
    height: '100%',
  },
  wrapper: {
    flex: 1,
  },

});