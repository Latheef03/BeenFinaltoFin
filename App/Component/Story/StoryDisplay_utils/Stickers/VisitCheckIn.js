import React from "react";
import { View, Image, Animated, StyleSheet, Text,TouchableOpacity } from "react-native";
import stylesG from "./styles";

export default VisitCheckIn = ({ isActive, points, location,userData,navigation,onClose }) => {
  const trX = points && points.panCoords ? points.panCoords.x : 0;
  const trY = points && points.panCoords ? points.panCoords.y : 0;
  const scale = points && points.pinch ? points.pinch : 1;
  const rotValue = points && points.rotate ? points.rotate : 0;
  const rotate = new Animated.Value(rotValue);
  const rotStr = rotate.interpolate({
    inputRange: [-100, 100],
    outputRange: ["-100rad", "100rad"],
  });
  
  const addLocationIntoUserData = {
    ...userData,
    coords : location?.coords && JSON.stringify(location.coords),
    Place_Name : userData.PlaceName,
    userId : userData.UserId,
    Country : userData.Country
  };


  const gotoLocationDetails = ({navigation},onClose) =>{
    // console.log('the navigation fnprops',navigation);
    // console.log('the nav onclose ',onClose)
    // console.log('the navi',onClose);
    onClose()
    navigation.navigate('BusinessPlaceHomeOther',{data:addLocationIntoUserData})
  }

  return (
    <View style={stylesG.mainView}>
      {isActive && (
        <View style={[stylesG.box,{ width: 300, height: 100,}]}>
          <View style={stylesG.container}>
            <TouchableOpacity style={{width:'100%',height:'100%'}} onPress={()=>gotoLocationDetails(navigation,onClose)} >
            <Animated.View
              style={[
                styles.visitCSty,
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
              <Image
                style={styles.locImg}
                source={require("../../../../Assets/Images/new/story_location.png")}
                resizeMode={"contain"}
              />
              <Text style={styles.locSty}>{location.f_address}</Text>
            </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = {
  visitCSty: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
  },
  locSty: {
    fontSize: 20,
    color: "#222222",
    textAlign: "center",
    alignSelf: "center",
    marginTop: -3,
  },
  locImg: {
    width: 30, 
    height: 30,
    marginRight:5,
    top : -20,
    position:'absolute',
    marginLeft:0
  },
};
