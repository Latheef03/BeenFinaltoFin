/** @Import_Modules */
import React, { Component } from "react";
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
  StatusBar,
  StatusBarIOS,
  Platform,
  NativeModules
} from "react-native";
import {
  deviceHeight as dh,
  deviceWidth as dw,
  getPicNameExt,
} from "../_utils/CommonUtils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainImage, UserText } from "./_sticker_compo";
import {
  EditorTools,
  TextContainer,
  StickerContainer,
  DisplaySticker,
  SketchContainer,
} from "./Editor_utils";
import ViewShot from "react-native-view-shot";
import { postImgService } from "../_services";
import { TouchableOpacity } from "react-native-gesture-handler";
import RNFS from "react-native-fs";
import { toastMsg1,toastMsg } from "../../Assets/Script/Helper";
import LinearGradient from "react-native-linear-gradient";
import RNHeicConverter from 'react-native-heic-converter';
const daysImage = require("../../Assets/stickers/days.png");

/**
  @Main_Component called @ImageEditor
  @The_Component contains sub components called 
   ( @EditorTools , @TextContainer , @StickerContainer , @DisplaySticker , 
     @SketchContainer , @MainImage , @UserText , @MakeStory )
  @The_Component was written by @MUFTHI :-)
*/
export default class ImageEditor extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      multiImage: [],
      text: {
        words: "",
        index: -1,
        color: "",
      },
      userHashTag: [],
      activeStickers: [],
      selectedMainImage: [],
      GPlaces: {},
      loading: false,
    };
    this.deletedSticker = undefined
  }

  componentDidMount() {
    this.getSnapImage();
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        const datas = this.props.route.params.datas;
        const img_prop = this.props.route.params.imgProp;
        console.log("image props", img_prop);
        if (img_prop != undefined && img_prop.sImg) {
          this.imageManipulte(img_prop);
        }
        if (datas != undefined) {
          this.fetchGPlacesData(datas);
        }
      }
    );
  }

  // componentDidUpdate = (prevProps,prevState) => {
  //   console.log('the prev state',prevProps,prevState);
  //   this.deletedSticker = undefined
  // }

  fetchGPlacesData = (datas) => {
    const { selectedMainImage } = this.state;
    const SMI = selectedMainImage;
    let LocCheck = false;
    if (SMI.imgSticker) {
      const filt = SMI.imgSticker.filter((l) => l.id === 1);
      LocCheck = filt.length > 0 ? true : false;
    }
    // const LocCheck = SMI.imgSticker && SMI.imgSticker.includes(1);
    const updatedSelectedMainImage = {
      ...SMI,
      imgSticker:
        SMI.imgSticker && !LocCheck
          ? [...SMI.imgSticker, { id: 1 }]
          : LocCheck
          ? [...SMI.imgSticker]
          : [{ id: 1 }],
      GPlaces: datas,
    };
    this.updatePropsCoords(updatedSelectedMainImage, true);
  };

  imageManipulte = (prop) => {
    console.log("the imageee props", prop.e);
    this.setStateForImages(null, null, prop);
  };

  getSnapImage = () => {
    const image = this.props.route.params.image;
    console.log("the image", image);
    if (image != undefined) {
      const files = getPicNameExt(image.uri);
      this.setStateForImages(image, files, null);
    }
  };

  /**
   * @param {s} Single_Image
   * @param {f} Splitted_File
   * @param {m} Multi_Image
   */
  setStateForImages = (s, f, m) => {
    const { selectedMainImage, multiImage } = this.state;
    // console.log('the statess single',s,'splitted file',f,'multi',m);
    if (m != null && m.e.length > 0) {
      let hashtags = [];
      m.e.map((m, i) => {
        hashtags.push({ index: i, hashtag: "" });
      });

      this.setState({
        selectedMainImage: {
          ...selectedMainImage,
          ...m.e[0].node.image,
          name: m.e[0].node.image.filename,
          imageIndex: 0,
          type: m.e[0].node.type,
        },
        multiImage:
          m.e.length > 0
            ? m.e.map((i, index) => ({
                ...i.node.image,
                name: i.node.image.filename,
                imageIndex: index,
                type: i.node.type,
              }))
            : [],
        userHashTag: hashtags,
        activeTool: undefined,
      });
    } else {
      this.setState({
        selectedMainImage: {
          ...selectedMainImage,
          uri: s.uri,
          height: s.dimensions.height,
          width: s.dimensions.width,
          filename: f[0] + "." + f[1],
          name: f[0] + "." + f[1],
          type: f[1] == "jpg" ? "image/jpeg" : "image/png",
          imageIndex: 0,
        },
        multiImage: [
          ...multiImage,
          {
            uri: s.uri,
            height: s.dimensions.height,
            width: s.dimensions.width,
            imageIndex: 0,
            filename: f[0] + "." + f[1],
            name: f[0] + "." + f[1],
            type: f[1] == "jpg" ? "image/jpeg" : "image/png",
          },
        ],
        userHashTag: [{ index: 0, hashtag: "" }],
        activeTool: undefined,
      });
    }
  };

  back = () => this.props.navigation.goBack();
  actionTools = (pos) => this.setState({ activeTool: pos });
  readHashTag = (text) => {
    const { selectedMainImage, userHashTag } = this.state;
    const sIndex = selectedMainImage.imageIndex;
    userHashTag[sIndex] = { index: sIndex, hashtag: text.toUpperCase() };
    console.log("the user hashtag", userHashTag);
    this.setState({ userHashTag });
  };

  pickedSticker = (stic) => {
    const { selectedMainImage } = this.state;
    const SMI = selectedMainImage;
    const found =
      SMI.imgSticker && SMI.imgSticker.some((el) => el.id === stic.id)
        ? true
        : false;
    const updatedSelectedMainImage = {
      ...SMI,
      imgSticker:
        SMI.imgSticker && !found
          ? [...SMI.imgSticker, { id: stic.id }]
          : found
          ? [...SMI.imgSticker]
          : [{ id: stic.id }],
    };
    this.updatePropsCoords(updatedSelectedMainImage);
  };

  textDone = (items) => {
    console.log("ImageEditor TextDone Method ==> ", items);
    const { selectedMainImage } = this.state;
    const SMI = selectedMainImage;
    const updatedSelectedMainImage = {
      ...SMI,
      imgText: { ...SMI.imgText, ...items },
    };
    console.log("updatedSelectedMainImage ==> ", updatedSelectedMainImage);
    const updateMultiImage = this.state.multiImage.map((image) => {
      if (image.imageIndex === SMI.imageIndex) {
        image = updatedSelectedMainImage;
      }
      return image;
    });
    console.log("updateMultiImage ==> ", updateMultiImage);
    this.setState({
      multiImage: updateMultiImage,
      selectedMainImage: updatedSelectedMainImage,
      activeTool: undefined,
    });
  };

  savedImage = (img) => {
    const { selectedMainImage } = this.state;
    const SMI = selectedMainImage;
    const updatedSelectedMainImage = {
      ...SMI,
      imgSketch: SMI.imgSketch
        ? [...SMI.imgSketch, { uri: "file://" + img }]
        : [{ uri: "file://" + img }],
    };
    this.updatePropsCoords(updatedSelectedMainImage, true);
  };

  clearSketchImage = () => {
    const { selectedMainImage } = this.state;
    const updateProps = {
      ...selectedMainImage,
      imgSketch: [],
    };
    this.updatePropsCoords(updateProps);
  };

  undoPaths = () => {
    const { selectedMainImage } = this.state;
    const SMI = selectedMainImage;
    if (SMI.imgSketch && SMI.imgSketch.length > 0) {
      const lastPathId = SMI.imgSketch.length - 1;
      if (this.Sketch.state.drawPath == 0) {
        SMI.imgSketch.splice(lastPathId, 1);
        const updateProps = {
          ...SMI,
          imgSketch: [...SMI.imgSketch],
        };
        this.updatePropsCoords(updateProps);
      }
    }
  };

  _setSelectedImage = (image) => {
    // console.log('the set selected image ==> ',image);
    this.setState({
      selectedMainImage: image,
    });
  };

  /**
   * Image display
   */
  renderImage(image) {
    return (
      <TouchableOpacity onPress={() => this._setSelectedImage(image)}>
        <View style={bottomShowImage.imageWrapper}>
          <Image
            style={{ width: "100%", height: "100%" }}
            source={image}
          />
        </View>
      </TouchableOpacity>
    );
  }

  convertLocalIdentifierToAssetLibrary = (localIdentifier, ext) => {
    const hash = localIdentifier.split('/')[0];
    return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
  };

  makeStory = () => {
    this.setState({ loading: true });
    this.sendTobackend();
  };

  sendTobackend = async () => {
    const { multiImage, text, userHashTag, GPlaces } = this.state;
    const MI = multiImage;
    const apiname = "ExploreStory";
    const dateFormat = new Date().toString();
    const datas = new FormData();
    
    const mi = MI.map((m, i) => {
      // const converted = this.convertLocalIdentifierToAssetLibrary(m.uri.replace('ph://', '')
      // ,m.type === 'image' ? 'JPG' : 'mov')
      // console.log('the conv',m);
      // if (m.name.endsWith('.heic') || m.name.endsWith('.HEIC')) {
      //   m.name = `${m.name.split(".")[0]}.JPG`;
      //   m.filename = `${m.name.split(".")[0]}.JPG` ;
      //   // m.uri = this.convertLocalIdentifierToAssetLibrary(m.uri.replace('ph://', ''),'JPG')
      // }  
      // console.log('the rhconvertor',RNHeicConverter.convert)
      // const conURL = await RNHeicConverter.convert({ path: m.uri,  })
      // console.log('conURL',conURL);
      
      let files = getPicNameExt(m.uri);
          const  blobName = files[0];
          const  blobType = files[1];

      datas.append("pic", {
        uri: m.uri,
        name: Platform.OS == 'ios' ?  m.name : blobName+'.'+blobType,
        type: 'image/jpeg' 
        //m.type,
      });
      return m 
    });
    console.log('the mm',mi);
    datas.append("Events", JSON.stringify(mi));
    datas.append("userId", await AsyncStorage.getItem("userId"));
    datas.append("Text", text.words == "" ? null : text.words);
    datas.append(
      "coords",
      GPlaces.hasOwnProperty("coords") ? GPlaces.coords : null
    );
    datas.append(
      "PlaceName",
      GPlaces.hasOwnProperty("name") ? GPlaces.name : null
    );
    datas.append(
      "Country",
      GPlaces.hasOwnProperty("Country") ? GPlaces.Country : null
    );
    datas.append("PostTime", dateFormat);
    // userHashTag.length > 0 && userHashTag.map(t =>{
    // if(t)
    datas.append("HashTag", JSON.stringify(userHashTag));
    // })
    console.log("the datas", datas);
    // this.setState({ loading: false });
    postImgService(apiname, datas)
      .then((res) => {
        console.log("the res", res);
        this.setState({ loading: false });
        if (res.status !== "True") {
          toastMsg1('danger', "Could not upload.please try again once")
          return false;
        }
        this.props.navigation.navigate("MyPager");
      })
      .catch((err) => {
        console.log("the story upload error", err);
        toastMsg1('danger', "Could not upload.please try again once")
        this.setState({ loading: false });
      });
  };

  panEmitter = (items) => {
    const { selectedMainImage } = this.state;
    const SMI = selectedMainImage;
    const updatedSelectedMainImage = {
      ...SMI,
      imgText: { ...SMI.imgText, panCoords: items },
    };
    this.updatePropsCoords(updatedSelectedMainImage);
  };

  rotateEmitter = (item) => {
    const { selectedMainImage } = this.state;
    const SMI = selectedMainImage;
    const updatedSelectedMainImage = {
      ...SMI,
      imgText: { ...SMI.imgText, rotate: item },
    };
    this.updatePropsCoords(updatedSelectedMainImage);
  };
  pinchEmitter = (item) => {
    const { selectedMainImage } = this.state;
    const SMI = selectedMainImage;
    const updatedSelectedMainImage = {
      ...SMI,
      imgText: { ...SMI.imgText, scale: item },
    };
    this.updatePropsCoords(updatedSelectedMainImage);
  };

  updatePropsCoords = (updated_props, activeTool = false) => {
    const { selectedMainImage, multiImage } = this.state;
    const SMI = selectedMainImage;
    const updateMultiImage = multiImage.map((image) => {
      if (image.imageIndex === SMI.imageIndex) {
        image = updated_props;
      }
      return image;
    });
    this.setState({
      multiImage: updateMultiImage,
      selectedMainImage: updated_props,
      ...(activeTool && { activeTool: undefined }),
    });
  };

  updateRevertData = (MIData, SMIData) => {
    // console.log("the updateRevertData ==> ", MIData, SMIData);
    this.setState({
      multiImage: MIData,
      selectedMainImage: SMIData,
    });
  };

  deleteStickerData = (state,id) => {
    console.log('the data is cominf',state,id)
    this.setState({
        deletedSticker:{
          id : id ,
          status : state
        }
    })
  }
  
  deleteSticker = (items) => {
    const {selectedMainImage,multiImage} = this.state
    const sticker = selectedMainImage.imgSticker;
    const index = selectedMainImage.imageIndex;
    const newStickers = sticker.filter(item => item.id !== items.id)
    const updatedSMI = {
      ...selectedMainImage,
      imgSticker : newStickers
    }
    const updateMultiImage = multiImage.map((image) => {
      if (image.imageIndex === index) {
        image = updatedSMI;
      }
      return image;
    });
    this.setState({
      multiImage : updateMultiImage,
      selectedMainImage : updatedSMI,
      deletedSticker : {status : false}
    })
        
  }

  render() {
    const {
      activeTool,
      text,
      activeStickers,
      GPlaces,
      loading,
      userHashTag,
      selectedMainImage,
      multiImage,
      deletedSticker
    } = this.state;
    const SMI = selectedMainImage;
    // console.log('the SMI in IE ==> ',SMI);
    return (
      <View style={{ flex: 1 }}>
        {/* <StatusBar hidden /> */}
        <View style={{ /*width: dw, height: dh,*/ backgroundColor: "black" }}>
          {/* <ViewShot ref={(ref) => (this.viewShot = ref)} options={option}> */}
          <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
          {/**@Background_Blur_Image */}
          <ImageBackground
            source={{ uri: SMI.uri }}
            style={{ width: "100%", height: "100%" }}
            blurRadius={200}
          />
          {/**@Animated_Image */}
          <View style={{ flex:1,...StyleSheet.absoluteFill, marginTop:Platform.OS==='ios' ? StatusBar.currentHeight:StatusBar.currentHeight }}>
            {SMI && multiImage.length > 0 && (
              <MainImage
                {...this.props}
                index={SMI.imageIndex}
                multiImage={multiImage}
                SMI={SMI}
                revertMIData={this.updateRevertData}
              />
            )}
          </View>

          {/**@Sketched_image_display  */}
          {SMI.imgSketch &&
            SMI.imgSketch.length > 0 &&
            SMI.imgSketch.map((m, i) => (
              <View key={`id${i}`} style={{ ...StyleSheet.absoluteFillObject }}>
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: m.uri }}
                />
              </View>
            ))}

          {/** @Animated_Text  */}
          {SMI.imgText && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                justifyContent: "center",
              }}
            >
              <UserText
                selectedMainImage={SMI}
                multiImage={multiImage}
                sIndex={SMI.imageIndex}
                editText={() => this.actionTools(0)}
                panEmitter={this.panEmitter}
                rotateEmitter={this.rotateEmitter}
                pinchEmitter={this.pinchEmitter}
              />
            </View>
          )}

          {/**@Display @Selected_Stickers  */}
          {/* <View collapsable={false}> */}
          <DisplaySticker
            isStickersExist={
              SMI.imgSticker && SMI.imgSticker.length > 0 ? true : false
            }
            stickers={SMI.imgSticker}
            days={
              this.stickerCont ? this.stickerCont.commonDays(daysImage) : null
            }
            date={this.stickerCont ? this.stickerCont.fullDateCommon() : null}
            getLocation={
              SMI.hasOwnProperty("GPlaces") ? SMI.GPlaces.f_address : null
            }
            userHashTagOnType={(text) => this.readHashTag(text)}
            userHashTag={userHashTag}
            multiImage={multiImage}
            SMI={SMI}
            sIndex={SMI.imageIndex}
            revertMIData={this.updateRevertData}
            deleteStickers = {(state,id)=>
               this.deleteStickerData(state,id) 
            }
          />
          {/* </View> */}

          {/* </ViewShot> */}

          {/**@TextContainer  */}
          <TextContainer
            isActive={activeTool === 0}
            actionTools={(pos) => this.actionTools(pos)}
            textDone={this.textDone}
          />

          {/** @custom_drawing  */}
          <SketchContainer
            ref={(evt) => (this.Sketch = evt)}
            isActive={activeTool === 1}
            savedimage={(img) => this.savedImage(img)}
            actionTools={(pos) => this.actionTools(pos)}
            clearSketchImage={() => this.clearSketchImage()}
            undoPaths={() => this.undoPaths()}
          />

          {/** @StickerContainer */}
          <StickerContainer
            {...this.props}
            ref={(ref) => (this.stickerCont = ref)}
            isActive={activeTool === 2}
            actionTools={(pos) => this.actionTools(pos)}
            pickedSticker={(stic) => this.pickedSticker(stic)}
          />

          {/** @Tools => @Close => @Text => @Sketch => @Stickers */}
          <EditorTools
            noActiveTools={activeTool === undefined}
            close={() => this.back()}
            actionTools={(pos) => this.actionTools(pos)}
            deletedStickerData = {deletedSticker}
            deleteSticker = {this.deleteSticker}
          />

          {/**@Make_Story send to @Backend  */}
          {activeTool == undefined && (
            <MakeStory
              onPress={() => this.makeStory()}
              MultiImage={multiImage}
              renderMultiImage={(image) => this.renderImage(image)}
            />
          )}
        </View>

        {loading && (
          <View style={loader.loadView}>
            <ActivityIndicator
              animating={loading}
              size="large"
              color={"#fb0143"}
            />
            <Text style={loader.process}>Processing...</Text>
          </View>
        )}
      </View>
    );
  }
}

const MakeStory = ({ onPress, MultiImage, renderMultiImage }) => (
  // <View
  //   style={[
  //     makestoryStyle.container,
  //     // {
  //     //   backgroundColor: MultiImage.length > 1 ? "#00000080" : "#00000000",
  //     // },
  //   ]}
  // >
    
     <LinearGradient 
                     colors={
                      MultiImage.length > 1 ? ["#00000000","#00000050", "#00000098"] 
                      : ["#00000000","#00000000", "#00000000"]
                      }
                     style={makestoryStyle.container}
                    >
    <View style={{ width: dw * 0.7, height: "100%", justifyContent: "center" }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={makestoryStyle.scrollViewMI}
      >
        {MultiImage.length > 1
          ? MultiImage.map((i, indx) => (
              <View key={indx.toString()}>{renderMultiImage(i)}</View>
            ))
          : null}
      </ScrollView>
    </View>

    <View style={makestoryStyle.msButton}>
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <ImageBackground
          borderRadius={20}
          source={require("../../Assets/Images/storyButton.png")}
          style={makestoryStyle.imageStyle}
        >
          <Text style={makestoryStyle.msText}>Make Story</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  // </View>
);

const makestoryStyle = {
  container: {
    width: dw,
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    height: dh * 0.1,
    justifyContent: "center",
  },
  imageStyle: {
    width: '100%',
    height: dh * 0.055,
    justifyContent: "center",
    alignSelf: "center",
  },
  scrollViewMI: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "flex-start",
    paddingStart: 5,
    paddingEnd: 5,
  },
  msButton: {
    width: dw * 0.3,
    height: "100%",
    right : -20,
    position: 'relative',
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  msText: {
    color: "#fff",
    textAlign: "center",
    alignSelf: "center",
    padding: 8,
    paddingRight : 25
  },
};

const loader = {
  loadView: {
    width: dw,
    height: dh,
    backgroundColor: "rgba(0,0,0,.8)",
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  process: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
  },
};

const bottomShowImage = {
  imageWrapper: {
    backgroundColor: "#c1c1c1",
    width: 32,
    height: 52,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 0.6,
    borderColor: "#fff",
    marginRight: 8,
    flexWrap: "wrap",
  },
};
