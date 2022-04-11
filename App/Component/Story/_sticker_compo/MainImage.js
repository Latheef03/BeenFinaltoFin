import React from 'react';
import {Animated, StyleSheet, Dimensions, ImageBackground, View,PixelRatio} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
} from 'react-native-gesture-handler';

import {USE_NATIVE_DRIVER,deviceHeight as dh ,deviceWidth as dw} from '../../_utils/CommonUtils';

export class MainImage extends React.Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();
  constructor(props) {
    super(props);
    // console.log('the constr props',props)
    /* Pinching */
    // this.scale = []
    this._baseScale = props.multiImage.map(()=> new Animated.Value(1) )
    this._pinchScale = props.multiImage.map(()=> new Animated.Value(1) ) ;
    this._scale = props.multiImage.map((d,i)=> Animated.multiply(this._baseScale[i], this._pinchScale[i]) );
    this._lastScale = props.multiImage.map(()=>  1 );

    this._onPinchGestureEvent = Animated.event(
      [{nativeEvent: { scale: this._pinchScale[props.index] }}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );

    /* Rotation */
    this._rotate = props.multiImage.map(()=> new Animated.Value(0) );
    this._rotateStr = props.multiImage.map((d,i)=>this._rotate[i].interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
    }) );
    this._lastRotate = props.multiImage.map(()=>0);
    this._onRotateGestureEvent = Animated.event(
      [{nativeEvent: {rotation: this._rotate[props.index]}}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );

    /* Tilt */
    this._tilt = props.multiImage.map(()=>new Animated.Value(0));
    this._tiltStr = props.multiImage.map((d,i)=> this._tilt[i].interpolate({
      inputRange: [-501, -500, 0, 1],
      outputRange: ['1rad', '1rad', '0rad', '0rad'],
    }) );
    this._lastTilt = props.multiImage.map(()=> 0 );
    this._onTiltGestureEvent = Animated.event(
      [{nativeEvent: {translationY: this._tilt[props.index]}}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );
  }

  _onRotateHandlerStateChange = event => {
    const {index} = this.props
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate[index] += event.nativeEvent.rotation;
      this._rotate[index].setOffset(this._lastRotate[index]);
      this._rotate[index].setValue(0);
      this.REmitter(this._lastRotate[index])
    }
  };
  _onPinchHandlerStateChange = event => {
    const {index} = this.props
    // console.log('the lastscale before',this._lastScale)
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale[index] *= event.nativeEvent.scale;
      this._baseScale[index].setValue(this._lastScale[index]);
      this._pinchScale[index].setValue(1);
      this.pinEmitter(this._lastScale[index])
    }
  };
  _onTiltGestureStateChange = event => {
    const {index} = this.props
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastTilt[index] += event.nativeEvent.translationY;
      this._tilt[index].setOffset(this._lastTilt[index]);
      this._tilt[index].setValue(0);
      this.TiltEmitter(this._lastTilt[index])
    }
  };

  pinEmitter = (events) =>{
    const {SMI} = this.props;
    const UpdatedSMI = {...SMI,
      transforms : {...SMI.transforms,scale:events}
    }
    this.updateStickerProps(UpdatedSMI)
   }

   REmitter = (events) => {
    const {SMI} = this.props;
    const UpdatedSMI = { ...SMI,
      transforms : {...SMI.transforms,rotate:events}
    }
    this.updateStickerProps(UpdatedSMI)
   }

   TiltEmitter = (events) =>{
    const {SMI} = this.props;
    const UpdatedSMI = { ...SMI,
      transforms : {...SMI.transforms,tilt:events}
    }
    this.updateStickerProps(UpdatedSMI)
   }

  updateStickerProps = (updated_props) =>{
    const {SMI,multiImage} = this.props;
    const updateMultiImage = multiImage.map((image) => {
      if (image.imageIndex === SMI.imageIndex) {
        image = updated_props;
      }
      return image;
    });
    this.props.revertMIData(updateMultiImage,updated_props);
  }

  render() {
    const {SMI,multiImage,index} = this.props
    const {height,width,uri} = SMI;

    return (
       <PanGestureHandler
        {...this.props}
        ref={this.panRef}
        onGestureEvent={this._onTiltGestureEvent}
        onHandlerStateChange={this._onTiltGestureStateChange}
        minDist={10}
        minPointers={2}
        maxPointers={2}
        avgTouches>
        <Animated.View style={styles.wrapper}>
          <RotationGestureHandler
            ref={this.rotationRef}
            simultaneousHandlers={this.pinchRef}
            onGestureEvent={this._onRotateGestureEvent}
            onHandlerStateChange={this._onRotateHandlerStateChange}>
            <Animated.View style={styles.wrapper}>
              <PinchGestureHandler
                ref={this.pinchRef}
                simultaneousHandlers={this.rotationRef}
                onGestureEvent={this._onPinchGestureEvent}
                onHandlerStateChange={this._onPinchHandlerStateChange}>
                <Animated.View style={styles.container} collapsable={false}>
                  <Animated.Image
                    style={[
                      styles.pinchableImage,
                      {
                        aspectRatio: width > height ? 2/3 : 3/2,
                        transform: [
                          {perspective: 200},
                          {scale: this._scale[index]},
                          {rotate: this._rotateStr[index]},
                          {rotateX: this._tiltStr[index]},
                        ],
                      },
                    ]}
                    source={{uri: uri}}
                    resizeMode={'contain'}
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

export default MainImage;

const styles ={
  container: {
    // ...StyleSheet.absoluteFillObject,
    // backgroundColor: '#00000000',
    // flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    // flex: 0.9,
    justifyContent: 'center',
  },
  pinchableImage: {
    width: dw,
    height: dh,
   // alignSelf : 'center'
  },
//   pinchableImage1: {
//     width: 100,
//     height: 100,
//   },
  wrapper: {
    // height:dh,
    // width:dw
    // flex: 1,
  },
};
