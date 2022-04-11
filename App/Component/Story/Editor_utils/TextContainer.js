/** @Import_Modules */
import React, { Component, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  FlatList, StatusBar,Image,SafeAreaView
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  deviceHeight as dh,
  deviceWidth as dw,
} from "../../_utils/CommonUtils";
import { Common_Color } from "../../../Assets/Colors/Common_Color";
import colors from "./TextColors";
import TextColors from "./TextColorsContainer";

/**
  @Main_Component called @TextContainer
  @The_Component also contains two sub functional component called,
  @TopView And @TextColors .
  @The_Component was written by @MUFTHI :-)
*/
export default class TextContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colours: colors,
      text: "",
      textColor: "#fff",
      colorIndex: -1,
    };
  }

  typingText = (text) => this.setState({ text: text });

  changeColor = (item) => {
    const { colours } = this.state;
    item.selected = true;
    const index = colours.findIndex((m) => m.id == item.id);
    colours.filter((u) => u.id !== item.id).map((f) => (f.selected = false));
    colours[index] = item;
    this.setState({ colours, textColor: item.color, colorIndex: item.id });
  };

  textDone = (options) => {
    console.log("TRIGGER TEXTDONE ", options);
    const { colours, text, textColor, colorIndex } = options;
    this.props.textDone({
      text: text,
      textColor: textColor,
      colorIndex: colorIndex,
    });
  };
  
  render() {
    const { isActive, actionTools, textDone } = this.props;
    const { colours, text, textColor, colorIndex } = this.state;
    return (
      isActive && (
        
        <KeyboardAvoidingView
          style={{
            flex:1,
            backgroundColor: "rgba(0,0,0,.7)",
            ...StyleSheet.absoluteFillObject,
            flexDirection: "column",
            justifyContent: "center",
          }}
          enabled
          keyboardVerticalOffset = {0}
          behavior='height'
        >
          
          <TopView
            actionCancel={() => actionTools(undefined)}
            actionDone={() => this.textDone(this.state)}
          />
          <ScrollView
            style={{ marginTop: 0 }}
            contentContainerStyle={{
              justifyContent: "center",
              alignSelf: "center",
              height: dh * 0.65,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ width: dw, height: dh * 0.25, }}>
              <TextInput
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignSelf: "center",
                  color: textColor,
                  fontSize: 20,
                }}
                autoFocus={true}
                textAlign={"center"}
                selectionColor={"white"}
                multiline={true}
                autoCorrect={false}
                
                value={text}
                onChangeText={(text) => this.typingText(text)}
              />
            </View>
          </ScrollView>
          <TextColors
            colours={colours}
            changeColor={(item) => this.changeColor(item)}
          />
          
        </KeyboardAvoidingView>
        
      )
    );
  }
}

/**
 @component
 @Actions => @Cancel and @ @Done
*/
const TopView = ({ actionCancel, actionDone }) => (
  <View
    style={{
      height: dh * 0.1,
      width: dw * 0.9,
      marginTop: Platform.OS==='ios' ? 50:StatusBar.currentHeight,
      // position: "absolute",
      flexDirection: "row",
      alignSelf: "center",
    }}
  >
    <TouchableOpacity style={{width: dw * 0.45,}} onPress={() => actionCancel()}>
      <View
        style={{ height: "100%", width: dw * 0.45, justifyContent: "center",
         }}
      >
        {/* <Text
          style={{
            marginLeft: 10,
            fontSize: 16,
            color: "#FFF",
            fontFamily: Common_Color.fontLight,
          }}
        >
          x
        </Text> */}
        <Image style={{ width: 20, height: 20, }} source={require('../../../Assets/Images/close_white.png')} />
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => actionDone()}>
      <View
        style={{ height: "100%", width: dw * 0.45, justifyContent: "center" }}
      >
        <Text
          style={{
            textAlign: "right",
            // marginRight: 8,
            fontSize: 16,
            fontFamily: Common_Color.fontLight,
            color: "#FFF",
          }}
        >
          Done
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);
