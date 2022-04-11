import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableOpacity,
  Slider,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { deviceWidth as dw, deviceHeight as dh } from "../_utils/CommonUtils";

class ImageEditSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateProps = (toolID) => {
    const { sImage, multiImage, revertData } = this.props;
    const updateSI = {
      ...sImage,
      selectedTool: toolID,
    };

    const updateMI = multiImage.map((image) => {
      if (image.imageIndex == sImage.imageIndex) {
        image = updateSI;
      }
      return image;
    });

    revertData(updateSI, updateMI);
  };

  setOnSlide(val, tID) {
    const { sImage, multiImage, revertData } = this.props;
    const updateSI = {
      ...sImage,
      ...(tID === 1 && { BSV: val }),
      ...(tID === 2 && { CSV: val }),
      ...(tID === 3 && { LSV: val }),
      ...(tID === 4 && { SSV: val }),
    };

    const updateMI = multiImage.map((image) => {
      if (image.imageIndex == sImage.imageIndex) {
        image = updateSI;
      }
      return image;
    });

    revertData(updateSI, updateMI);
  }

  render() {
    const imagePath = "../../Assets/Images/";
    const { sImage, multiImage } = this.props;
    const { selectedTool } = sImage;
    let sliderValue = 0;
    if (selectedTool === 1) sliderValue = sImage.BSV ? sImage.BSV : 0;
    else if (selectedTool === 2) sliderValue = sImage.CSV ? sImage.CSV : 0;
    else if (selectedTool === 3) sliderValue = sImage.LSV ? sImage.LSV : 0;
    else if (selectedTool === 4) sliderValue = sImage.SSV ? sImage.SSV : 1;

    return (
      <View style={[styles.parent]}>
        {selectedTool >= 1 && (
          <View style={styles.controlsLayout}>
            <SliderTool
              sValue={sliderValue}
              selectedTool={selectedTool}
              onSlideValue={(val, tID) => this.setOnSlide(val, tID)}
            />
          </View>
        )}

        <View style={{ height: dh * 0.8, marginTop: 15 }}>
          <View style={styles.mainToolsView}>
            <View style={{ width: dw / 5, height: "100%",  }}>
              <Text style={{ color: "#000",textAlign:'center',marginRight:5 }}>Crop</Text>
              <TouchableOpacity onPress={() => this.updateProps((id = 0))}>
                {/* <TouchableOpacity onPress={() =>  this.cro()}> */}
                <View style={styles.toolsView}>
                  <Image
                    source={require(imagePath + "crop.png")}
                    style={styles.toolsImageStyle}
                    resizeMode={"center"}
                    
                  />
                </View>
              </TouchableOpacity>

              {selectedTool == 0 && <View style={styles.activeToolIndicator} />}
            </View>

            <View style={{ width: dw / 5, height: "100%", }}>
              <Text style={{ color: "#000",textAlign:'center',marginRight:6 }}>Brightness</Text>
              <TouchableOpacity onPress={() => this.updateProps((id = 1))}>
                <View style={styles.toolsView}>
                  <Image
                    source={require(imagePath + "bright.png")}
                    style={styles.toolsImageStyle}
                    resizeMode={"center"}
                    
                  />
                </View>
              </TouchableOpacity>
              {selectedTool == 1 && <View style={styles.activeToolIndicator} />}
            </View>

            <View style={{ width: dw / 5, height: "100%", }}>
              <Text style={{ color: "#000",textAlign:'center',marginRight:5 }}>Contrast</Text>
              <TouchableOpacity onPress={() => this.updateProps((id = 2))}>
                <View style={styles.toolsView}>
                  <Image
                    source={require(imagePath + "contrast.png")}
                    style={styles.toolsImageStyle}
                    resizeMode={"center"}
                    
                  />
                </View>
              </TouchableOpacity>
              {selectedTool == 2 && <View style={styles.activeToolIndicator} />}
            </View>

            <View style={{ width: dw / 5, height: "100%",}}>
              <Text style={{ color: "#000",textAlign:'center',marginRight:8 }}>Light</Text>
              <TouchableOpacity onPress={() => this.updateProps((id = 3))}>
                <View style={styles.toolsView}>
                  <Image
                    source={require(imagePath + "light.png")}
                    style={styles.toolsImageStyle}
                    resizeMode={"center"}
                    
                  />
                </View>
              </TouchableOpacity>
              {selectedTool == 3 && <View style={styles.activeToolIndicator} />}
            </View>

            <View style={{ width: dw / 5, height: "100%", }}>
              <Text style={{ color: "#000",textAlign:'center' }}>Saturation</Text>
              <TouchableOpacity onPress={() => this.updateProps((id = 4))}>
                <View style={styles.toolsView}>
                  <Image
                    source={require(imagePath + "saturation.png")}
                    style={styles.toolsImageStyle}
                    resizeMode={"center"}
                    
                  />
                </View>
              </TouchableOpacity>
              {selectedTool == 4 && <View style={styles.activeToolIndicator} />}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default ImageEditSlider;

const SliderTool = ({ sValue, selectedTool, onSlideValue }) => {
  const st = selectedTool
  return (
    <Slider
      maximumTrackTintColor="#000"
      minimumTrackTintColor="#000"
      thumbTintColor="#000"
      minimumValue = {st == 4 ? 1 : 1}
      maximumValue = {st == 4 ? 0.01 : 1.8}
      value={sValue}
      onValueChange={(val) => onSlideValue(val, selectedTool)}
      style={{ width: wp("96%"), alignSelf: "center" }}
    />
  );
};

const styles = {
  parent: {
    flex: 1,
    // ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: dw,
    height: dh * 0.08,
    justifyContent: "center",
  },
  mainToolsView: {
    width: dw,
    height: dh * 0.2,
    borderRadius: 20,
    flexDirection: "row",
  },
  toolsView: {
    borderColor: "grey",
    // borderRadius: 0.5,
    // borderWidth: 1,
    height: dh * 0.09,
    width: dw * 0.18,
    marginTop: 15,
    justifyContent: "center",
  },
  activeToolIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#666",
    borderRadius: 8 / 2,
    alignSelf: "center",
    marginTop: 10,
    marginRight : 5
  },
  toolsImageStyle: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  controlParentLay: {
    width: wp("100%"),
    height: hp("8%"),
    flexDirection: "column",
    marginTop: 5,
    flex: 1,
  },
  controlsLayout: {
    width: dw,
    height: dh * 0.08,
    justifyContent: "center",
  },
  controllersView: {
    flexDirection: "row",
    width: wp("90%"),
    marginLeft: 10,
  },
};
