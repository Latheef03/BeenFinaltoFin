import React from "react";
import { View, Animated, Text, StyleSheet } from "react-native";
import {
  deviceWidth as dw,
  deviceHeight as dh,
} from "../../_utils/CommonUtils";

export default DisplayText = ({ imgText }) => {
    const trX = imgText.panCoords ? imgText.panCoords.x : 0;
    const trY = imgText.panCoords ? imgText.panCoords.y : 0;
    const scale = imgText.scale ? imgText.scale : 1;
    const rotateValue = imgText.rotate ? imgText.rotate : 0;
    const rotate = new Animated.Value(rotateValue);
    const rotateStr =  rotate.interpolate({
        inputRange: [-100, 100],
        outputRange: ["-100rad", "100rad"],
    });

  return imgText && (
    <View collapsable={false}>
      <Animated.View
        style={{
          width: dw,
          height: 300,
          zIndex: 200,
          alignSelf: "center",
          justifyContent: "center",
          transform: [
            { perspective: 200 },
            { translateX: trX },
            { translateY: trY },
            { scale: scale },
            { rotate: rotateStr },
          ],
        }}
      >
        <Text style={{color:imgText.textColor,
            fontSize: 20,textAlign: "center",padding: 10,}}>
            {imgText.text}
        </Text>
      </Animated.View>
    </View> 
  );
};
