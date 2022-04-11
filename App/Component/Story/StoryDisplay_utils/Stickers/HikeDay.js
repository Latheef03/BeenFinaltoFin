import React from "react";
import { View, Animated, Image } from "react-native";
import stylesG from "./styles";

export default HikeDay = ({ isActive, points }) => {
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
        <View style={[stylesG.box]}>
          <View style={stylesG.container}>
            <Animated.Image
              style={[
                styles.img,
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
              source={require("../../../../Assets/stickers/new/hike_day.png")}
          resizeMode={'contain'}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = {
  img: {
    width: "100%",
    height: "100%",
  },
};
