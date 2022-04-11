import React, { Component } from "react";
import { Animated, StyleSheet, View, Image, Dimensions, Text, } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  ScrollView,
  State,
} from "react-native-gesture-handler";
import { USE_NATIVE_DRIVER, deviceWidth as dw, deviceHeight as dh, } from "../../_utils/CommonUtils";

export class DraggableEvent extends Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      SMI : props.selectedMainImage
    }
    // console.log("selectedMainImage UserText", this.props.selectedMainImage);
    const {imgText,imageIndex} = this.state.SMI;
    const {sIndex} = this.props
    console.log('the props multi image ==> ',props.multiImage);
    const { x,y } = imgText.panCoords || {x : 0 , y : 0 }
    console.log('the x and y ==> ',x,y);
    
    this._translateX = props.multiImage.map((d)=>new Animated.Value(
     d.imgText && d.imgText.panCoords ? d.imgText.panCoords.x : 0
    ));
    this._translateY = props.multiImage.map((d)=>new Animated.Value(
      d.imgText && d.imgText.panCoords ? d.imgText.panCoords.y : 0
    ));
    this._lastOffset = props.multiImage.map(()=>({ x: 0, y: 0 }))
 
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
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

    /* Pinching */
    this._baseScale = props.multiImage.map(()=>new Animated.Value(1));
    this._pinchScale = props.multiImage.map(()=>new Animated.Value(1));
    this._scale = props.multiImage.map((d,i)=> Animated.multiply(
      d.imgText && d.imgText.scale ? d.imgText.scale : this._baseScale[i]
      ,this._pinchScale[i]
    ));
    this._lastScale = props.multiImage.map(()=> 1 );

    this._onPinchGestureEvent = Animated.event(
      [{ nativeEvent: { scale: this._pinchScale[sIndex] } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

    /* Rotation */
    this._rotate = props.multiImage.map((d,i)=>
      new Animated.Value(
        d.imgText && d.imgText.rotate ? d.imgText.rotate
        : 0
      )
    );
    this._rotateStr = props.multiImage.map((d,i)=>this._rotate[i].interpolate({
      inputRange: [-100, 100],
      outputRange: ["-100rad", "100rad"],
    }));
    this._lastRotate = props.multiImage.map(()=> 0 );
    this._onRotateGestureEvent = Animated.event(
      [{ nativeEvent: { rotation: this._rotate[sIndex] } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );
    
  }
  /**@constructor end */

  _onHandlerStateChange = (event) => {
    const {sIndex} = this.props
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset[sIndex].x += event.nativeEvent.translationX;
      this._lastOffset[sIndex].y += event.nativeEvent.translationY;
      this._translateX[sIndex].setOffset(this._lastOffset[sIndex].x);
      this._translateX[sIndex].setValue(0);
      this._translateY[sIndex].setOffset(this._lastOffset[sIndex].y);
      this._translateY[sIndex].setValue(0);
      this.props.panEmitter(this._lastOffset[sIndex]);
    }
  };

  _onRotateHandlerStateChange = (event) => {
    const {sIndex} = this.props
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate[sIndex] += event.nativeEvent.rotation;
      this._rotate[sIndex].setOffset(this._lastRotate[sIndex]);
      this._rotate[sIndex].setValue(0);
      this.props.rotateEmitter(this._lastRotate[sIndex]);
    }
  };

  _onPinchHandlerStateChange = (event) => {
    const {sIndex} = this.props
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale[sIndex] *= event.nativeEvent.scale;
      this._baseScale[sIndex].setValue(this._lastScale[sIndex]);
      this._pinchScale[sIndex].setValue(1);
      this.props.pinchEmitter(this._lastScale[sIndex]);
    }
  };

  onpressText = () => {
    this.props.editText();
  };

  render() {
    const { imgText,imageIndex } = this.props.selectedMainImage;
    const {sIndex} = this.props;
    const {panCoords} = imgText
    console.log('the img text ==> ',imgText.panCoords);
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
                { translateX: this._translateX[sIndex]},
                  // panCoords ? panCoords.x : 0  },
                { translateY: this._translateY[sIndex]},
                  // panCoords ? panCoords.y : 0 },
                { perspective: 200 },
                { scale: this._scale[sIndex] },
                { rotate: this._rotateStr[sIndex] },
              ],
            },
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
                  <Animated.Text
                    style={{
                      //   width: "100%",
                      //   height: "100%",
                      fontSize: 20,
                      color: imgText.textColor,
                      textAlign: "center",
                      padding: 10,
                      // backgroundColor:'yellow',
                      // transform: [
                      //   { perspective: 200 },
                      //   { scale: this._scale[sIndex] },
                      //   { rotate: this._rotateStr[sIndex] },
                      //   //{rotateX: this._tiltStr},
                      // ],
                    }}
                    onPress={() => this.onpressText()}
                    // source={require("../../../Assets/stickers/new/run.png")}
                    resizeMode={'center'}
                  >
                    {imgText.text}
                  </Animated.Text>
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </RotationGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

export default class UserText extends Component {
  render() {
    return (
      <View style={[styles.mainView]} collapsable={false}>
        <DraggableEvent
          selectedMainImage={this.props.selectedMainImage}
          editText={this.props.editText}
          panEmitter={this.props.panEmitter}
          sIndex = {this.props.sIndex}
          multiImage = {this.props.multiImage}
          rotateEmitter = {this.props.rotateEmitter}
          pinchEmitter = {this.props.pinchEmitter}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    // flex: 1,
  },
  container: {
    //  ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'plum',
    // overflow: 'hidden',
    // alignItems: 'center',
    // flex: 1,
    // justifyContent: 'center',
  },
  box: {
    width: dw,
    height: 300,
    justifyContent: "center",
    alignSelf: "center",
    // backgroundColor: 'red',
    //margin: 0,
    zIndex: 200,
  },
  pinchableImage: {
    width: dw,
    height: "100%",
  },
  wrapper: {
    flex: 1,
  },
});
