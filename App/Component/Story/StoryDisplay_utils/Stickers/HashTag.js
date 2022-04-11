import React from "react";
import { View, Animated, TextInput, Text } from "react-native";
import stylesG from "./styles";

export default (HashTag = ({ isActive, points, userHashTag }) => {
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
          width: 280,
          height: 100,
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
            <HashView userHashTag={userHashTag} />
          </Animated.View>
        </View>
        // </View>
      )}
    </View>
  );
});

const HashView = ({ userHashTag }) => {
  // const {sIndex,userHashTag} = this.props
  return (
    <View style={styles.hashMain}>
      {/*#color pink = ef1b66 */}
      <View style={{
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
      }}>
        <Text style={[styles.hashText]}>
          {userHashTag && userHashTag.length > 0 ? "#" : null}
        </Text>
      </View>
      <TextInput
        placeholderTextColor={"#ef1b669e"}
        placeholder="#Hashtag"
        underlineColorAndroid="transparent"
        style={styles.hashtagInput}
        //  onChangeText = {(text)=>{
        //    this.props.userHashTagOnType(text)
        //  }}
        autoCompleteType={"off"}
        autoCapitalize={"characters"}
        spellCheck={false}
        autoCorrect={false}
        maxLength={15}
        autoCorrect={false}
        //
        editable={false}
        value={userHashTag}
      />
    </View>
  );
};

const styles = {
  img: {
    width: "100%",
    height: "100%",
  },
  hashMain: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  hashText: {
    padding: 10,
    paddingRight: 0,
    color: "#ef1b66",
    fontSize: 22,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFF",
    paddingTop: 18,
    paddingBottom: 18,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  hashtagInput: {
    color: "#ef1b66",
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 0,
    backgroundColor: "#fff",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
};
