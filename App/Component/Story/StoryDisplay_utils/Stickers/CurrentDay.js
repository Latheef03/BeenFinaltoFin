import React from "react";
import { View, Animated, ImageBackground, Text } from "react-native";
import stylesG from "./styles";
import { Days } from "../../../_utils/CommonUtils";
const daysImage = require("../../../../Assets/stickers/days.png");

export default CurrentDay = ({ isActive, points }) => {
  const trX = points && points.panCoords ? points.panCoords.x : 0;
  const trY = points && points.panCoords ? points.panCoords.y : 0;
  const scale = points && points.pinch ? points.pinch : 1;
  const rotValue = points && points.rotate ? points.rotate : 0;
  const rotate = new Animated.Value(rotValue);
  const rotStr = rotate.interpolate({
    inputRange: [-100, 100],
    outputRange: ["-100rad", "100rad"],
  });
  return (
    <View style={stylesG.mainView}>
      {isActive && (
        <View style={[stylesG.box, {
          width: 150,
          height: 50,
        }]}>
          {/* <View style={stylesG.container}> */}
          <Animated.View
            style={[
              stylesG.container,
              {
                transform: [
                  { perspective: 200 },
                  { translateX: trX },
                  { translateY: trY },
                  { scale: scale },
                  { rotate: rotStr },
                ],
              },
            ]}
          >
            <CommonDays />
          </Animated.View>
        </View>
        // </View>
      )}
    </View>
  );
};

const CommonDays = () => (
  <ImageBackground
    source={daysImage}
    style={{ width: "100%", height: "100%", justifyContent: "center" }}
    resizeMode={"contain"}
  >
    <Text style={{ color: "#ef1b66", textAlign: "center", marginLeft: 20 }}>
      {Days()}
    </Text>
  </ImageBackground>
);

const styles = {
  img: {
    width: "100%",
    height: "100%",
  },
};
