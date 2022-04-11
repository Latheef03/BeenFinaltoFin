import React from "react";
import { View, Animated, ImageBackground, Text } from "react-native";
import stylesG from "./styles";
import { date } from "../../../_utils/CommonUtils";

export default CurrentDate = ({ isActive, points, userHashTag }) => {
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
            <FullDateCommon />
          </Animated.View>
        </View>
        // </View>
      )}
    </View>
  );
};

const FullDateCommon = () => (
  <View style={{ justifyContent: 'center' }}>
    <Text style={{
      textAlign: 'center', color: '#FFF', fontSize: 20, fontWeight: 'bold'
    }}>
      {date()}
    </Text>
  </View>
)

const styles = {
  img: {
    width: "100%",
    height: "100%",
  },
};
