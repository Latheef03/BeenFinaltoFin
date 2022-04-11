/* eslint-disable react/no-unused-prop-types */
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Animated,
  StatusBarIOS
} from "react-native";
import Video from "react-native-video";
// import Image from 'react-native-scalable-image';
import PropTypes from "prop-types";
import serviceUrl from "../../Assets/Script/Service";
import {
  deviceWidth as dw,
  deviceHeight as dh,
  invalidText,
} from "../_utils/CommonUtils";
import {
  DisplaySketch,
  DisplayText,
  DisplayStorySticker,
} from "./StoryDisplay_utils";

import ViewShot from "react-native-view-shot";

const ScreenWidth = Dimensions.get("window").width;

const Story1 = React.forwardRef((props, ref) => {
  // debugger;
  //  console.log('the screen width', props);
  const { story } = props;
  const { pic } = story || {};
  const { Events, HashTag } = story;
  const { transforms, imgSketch, imgSticker, imgText, GPlaces } = Events || {};
  // console.log("story1 props.navigation", props.navigation);
  // console.log('the fwdd ref props ',props.onClose)
  /**@MainImage */
  const scale = transforms && transforms.scale ? transforms.scale : 1;
  const rValue = transforms && transforms.rotate ? transforms.rotate : 0;
  const tValue = transforms && transforms.tilt ? transforms.tilt : 0;
  let rotate = new Animated.Value(rValue);
  const rStr = rotate.interpolate({
    inputRange: [-100, 100],
    outputRange: ["-100rad", "100rad"],
  });
  let tilt = new Animated.Value(tValue);
  const tStr = tilt.interpolate({
    inputRange: [-501, -500, 0, 1],
    outputRange: ["1rad", "1rad", "0rad", "0rad"],
  });

  let imageshot = React.useRef();

  /**@Sketch */
  const SketchData = imgSketch ? imgSketch : [];

  return (
    <View style={{ flex: 1 }}>
      <ViewShot ref={ref}>
        <View style={styles.container} collapsable={false}>
          <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
          {/* {!props.isLoaded && (
      <View style={styles.loading}>
        <ActivityIndicator color="white" />
      </View>
      )} */}

          <ImageBackground
            source={{ uri: serviceUrl.StatusImage + pic }}
            style={{ width: "100%", height: "100%" }}
            resizeMode={'cover'}
            blurRadius={200}
          />

          <View style={{
            ...StyleSheet.absoluteFillObject,
            
          }}>
            <View
              style={{
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Animated.Image
                source={{ uri: serviceUrl.StatusImage + pic }}
                onLoadEnd={props.onImageLoaded}
                style={[
                  styles.content,
                  {
                    aspectRatio: Events.width > Events.height ? 2 / 3 : 3 / 2,
                    transform: [
                      { perspective: 200 },
                      { scale: scale },
                      { rotate: rStr },
                      { rotateX: tStr },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          </View>

          {/**@Sketched_image_display  */}
          <DisplaySketch sketch={SketchData} />

          {/**@Display_Text */}
          {imgText && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                justifyContent: "center",
              }}
            >
              <DisplayText imgText={imgText} />
            </View>
          )}

          {/**@Display_Stickers */}
          {imgSticker && (
            <DisplayStorySticker
              imgSticker={imgSticker}
              gPlaces={GPlaces}
              userHashTag={invalidText(HashTag) ? null : HashTag}
              userData={story}
              navigation={props.navigation}
              onClose={props.onClose}
            />
          )}
          {
            // type === 'image' ? (
            // )
            //   : (
            //     <Video
            //       source={{ uri: url }}
            //       paused={props.pause || props.isNewStory}
            //       onLoad={item => props.onVideoLoaded(item)}
            //       style={styles.content}
            //     />
            //   )
          }

        </View>
      </ViewShot>
    </View>
  );
});

Story1.propTypes = {
  story1: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const styles = StyleSheet.create({
  container: {
    width: dw,
    height: dh,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: dw,
    height: dh,
  },
  imageContent: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  loading: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Story1;
