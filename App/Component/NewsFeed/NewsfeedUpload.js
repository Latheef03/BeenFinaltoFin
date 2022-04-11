import React, { Component } from 'react';
import {
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, ToastAndroid, StatusBar, Dimensions
  , KeyboardAvoidingView, TouchableOpacity, Keyboard, Platform,
  Animated,
  StatusBarIOS
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Button, Left, Right, Content, Spinner } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { RNCamera } from 'react-native-camera';
import ViewShot from "react-native-view-shot";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import Modal from 'react-native-modalbox';
var mImageSelectedIndex = 0;
import styles from '../../styles/NewsFeedUploadStyle'
import { CheckBox } from 'react-native-elements'
import ImageCropper from 'react-native-simple-image-cropper';
import Common_Style from '../../Assets/Styles/Common_Style';
import { TextInput, HelperText } from 'react-native-paper';
import common_styles from "../../Assets/Styles/Common_Style"
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { deviceWidth as dw, deviceHeight as dh, getHashTags,getPicNameExt } from '../_utils/CommonUtils';
import Modal from "react-native-modal";
import RNFS from 'react-native-fs'
import ImageEditSlider from './ImageEditSlider';
import { Filters,SelectedFilters,EditTools } from './Filter_Edit_utils';
import {
  Brightness
} from 'react-native-color-matrix-image-filters';
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';

const window = Dimensions.get('window');
const w = window.width;

const CROP_AREA_WIDTH = w;
const CROP_AREA_HEIGHT = w;
var cropUrl = '';
export default class NewsfeedUpload extends Component {

  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.state = {
      cropperParams: {
        positionX: 0,
        positionY: 0,
        width: 0,
        height: 0,
        minScale: 1.01,
        adjustedHeight: 0,
        loading: true
      },
      croppedImage: '',
      avatarSource: null,
      avatarSource1: null,
      avatarSource2: null,
      video_status: false,
      TagId: [],
      imagesSelected: null,
      location: '',
      country: '',
      sponsored: '',
      description: '',
      fileName: '',
      isLoading: false,
      fileType: '',
      camType: RNCamera.Constants.Type.back,
      imagecolor: 0,
      id: '',
      locationEditable: true,
      isPlacesModal: false,
      screenShot: null,
      coords: '',
      data_id: '',
      place_id: '',
      f_address: '',
      isRecording: false,
      tagCount: 0,
      checkedbox: false,
      profileType: 0, editCrop: 0, edit: true,
      activeScroll: false, RequestModal: false, cropUrlfinal: '', croptrue: true,
      isSelectEdit: false, 
      contrast: false, light: false, saturation: false, origin: true,
      brightX: '', hueX: '', lightx: '', selectImage: '', selectImageUri: ''
    };
    this.setCropperParams = this.setCropperParams.bind(this)
  }


  setCropperParams = cropperParams => {
    console.log('cropper params', cropperParams);
    const {avatarSource1,imagesSelected} = this.state;
    const updateSI = {
      ...avatarSource1,
      crops : cropperParams
    };
    const updateMI = imagesSelected.map((image)=>{
      if(image.imageIndex == avatarSource1.imageIndex){
        image = updateSI
      }
      return image;
    })

    this.updateRevertData(updateSI,updateMI);
    // this.setState(prevState => ({
    //   ...prevState,
    //   cropperParams,
    // }));
  };

  // handlePressdone = async () => {
  //  // debugger;
  //   var select = this.state.selectImage;
  //   if (select != "" || this.state.croptrue == true) {
  //     const { cropperParams } = this.state;
  //     const cropSize = {
  //       width: 1024,
  //       height: 1024,
  //     };
  //     const cropAreaSize = {
  //       width: CROP_AREA_WIDTH,
  //       height: CROP_AREA_HEIGHT,
  //     };
  //     try {
  //       const result = await ImageCropper.crop({
  //         ...cropperParams,
  //         imageUri: this.state.selectImageUri,
  //         cropSize,
  //         cropAreaSize,
  //       });
  //       console.log('the final URL ==> ', result);
  //       this.setState(prevState => ({
  //         ...prevState,
  //         image: 4,
  //         cropUrlfinal: result,
  //       }));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   else if (select == "" || this.state.croptrue == true) {
  //     const { cropperParams } = this.state;
  //     const cropSize = {
  //       width: 1024,
  //       height: 1024,
  //     };
  //     const cropAreaSize = {
  //       width: CROP_AREA_WIDTH,
  //       height: CROP_AREA_HEIGHT,
  //     };
  //     try {
  //       const result = await ImageCropper.crop({
  //         ...cropperParams,
  //         imageUri: this.state.avatarSource1.uri,
  //         cropSize,
  //         cropAreaSize,
  //       });
  //       console.log('the final URL ==> ', result);
  //       this.setState(prevState => ({
  //         ...prevState,
  //         image: 4,
  //         cropUrlfinal: result,
  //       }));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   else {
  //     this.setState({
  //       image: 4
  //     })
  //   }
  // };

  handlePressdone = () => {
    const {avatarSource1,imagesSelected} = this.state;
    const SI = avatarSource1;
    // this.refs.viewShot.capture().then(uri => {
    //   const updateSI = {
    //     ...SI,
    //     viewshotURI : uri
    //   };
    //   const updateMI = imagesSelected.map((image)=>{
    //     if(image.imageIndex == SI.imageIndex){
    //       image = updateSI
    //     }
    //     return image;
    //   });

      this.setState({
        // avatarSource1 : updateSI,
        // imagesSelected : updateMI,
        image: 3,
        editCrop: 0
      });

    // }).catch(err=>console.log('the errr',err))
    
  }

  location = text => {
    this.setState({ location: text });
  };

  country = text => {
    this.setState({ country: text });
  };
  sponsored = text => {
    this.setState({ sponsored: text });
  }

  description = (text, e) => {
    const { imagesSelected } = this.state;
    const index = imagesSelected.findIndex(d => d.imageIndex == e.imageIndex);
    if (text.length >= 500) {
      if(Platform.OS == 'ios'){
        alert('A maximum of 500 characters is allowed')
        
      }else{
        ToastAndroid.showWithGravityAndOffset(
          `A maximum of 500 characters is allowed`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
      
    }
    e.desc = text;
    e.imgId = e.imageIndex;
    imagesSelected[index] = e
    // console.log('event is ',e,'--text is',text);
    // console.log('descccc',imagesSelected); 
    this.setState({
      imagesSelected: imagesSelected,
      eachImgDescription: imagesSelected
    });
  };

  // componentWillMount() {
  //   this.onLoad();
  //   this.imageManipulte()
  // }

  componentDidMount = async () => {
   // debugger;
    this.onLoad();
    this.imageManipulte()
    

    this.focusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        const Comments = this.props.route.params.data;
        if (Comments != undefined) {
          this.setState({
            TagId: Comments.tagId,
            tagCount: Comments.tagCount
          })
        }
      }
    );
  }

  // componentWillUnmount () {
  //   this.keyboardDidShowListener.removeListener();
  //   this.keyboardDidHideListener.removeListener();
  // }



  onLoad = async () => {
    var data = { userId: await AsyncStorage.getItem('userId') };
    const url = serviceUrl.been_url1 + '/UserProfile';
    const getType = await AsyncStorage.getItem('profileType')
    const pType = parseInt(getType);
    this.setState({ profileType: pType })
  }

  imageManipulte = () => {

    const prop = this.props.route.params.imgProp;
    if (prop == undefined) {
      return false;
    }
    // console.log('image props from nf upload ', prop.e[0].node.image.uri.replace('file:///', ''));
    console.log('image a ', prop.e[0].node.image);

    if (prop.e && prop.e.length > 0) {
      this.setState({
        image: 3,
        avatarSource: prop.e[0].node.image.uri.replace('file:///', ''),
        avatarSource1: { ...prop.e[0].node.image, imageIndex: 0,filterId:0 },
        imagesSelected: prop.e.map((i, index) => {
          return {
            uri: i.node.image.uri, width: i.node.image.width,
            height: i.node.image.height, mime: i.node.type, imageIndex: index,
            filterId : 0,filename:i.node.image.filename
          };
        })
      });
    }
  }

  onImageLoad = () => {
    //// debugger;
    this.refs.viewShot.capture().then(uri => {
      this.setState({ avatarSource2: uri });
      this.onImageLoad();
    })
  };

  // onImageLoad1() {
  //   this.refs.viewShot1.capture()
  //     .then(uri => {
  //       this.setState({ screenShot: uri, avatarSource1: uri });
  //       this.save();
  //     })
  //     .catch((error)=> {
  //       console.log('warn', error)
  //     });
  // };

  _setSelectedImage(image) {
    mImageSelectedIndex = image.imageIndex;
    const { avatarSource1, imagesSelected } = this.state
    const updateMultiImage = imagesSelected.map((images) => {
      if (images.imageIndex == image.imageIndex) {
        images = image
      }
      return images;
    });

    this.setState({
      avatarSource: image.uri.replace("file:///", ''),
      avatarSource1: image,
      imagesSelected: updateMultiImage,
      imagecolor: image.filter, selectImage: image
    })
    console.log('image.', image)
  }

  updateRevertData = (SI, MI) => {
    this.setState({
      avatarSource1: SI,
      imagesSelected: MI
    })
  }

  imageFilterAvatar = (avatarNum) => {
    if (mImageSelectedIndex >= 0) {
      let imagesChangedPath = this.state.imagesSelected
      imagesChangedPath[mImageSelectedIndex] = { ...imagesChangedPath[mImageSelectedIndex], filter: avatarNum }
      this.setState({ imagesSelected: imagesChangedPath, imagecolor: avatarNum })
    }
    console.log('image filter avatar', this.state.imagesSelected)
    console.log('image filter image color', this.state.imagecolor)
  }


  renderImage(image) {
    return (
      <Image style={styles.imageBinding} source={image} />
    )
  }

  renderImage1(image) {
    //  console.log("Image with index", image);
     const scale = image.crops && image.crops.scale ? image.crops.scale : 1.0001;
     const trX =  image.crops && image.crops.positionX && scale >= 1.01 ? image.crops.positionX : 0;
     const  trY = image.crops && image.crops.positionY && scale >= 1.01 ? image.crops.positionY : 0;
     const actualURI = image.uri;
     //image.viewshotURI ? image.viewshotURI : image.uri;
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={() => this._setSelectedImage(image)}>
         <SelectedFilters images = {image} 
          childrenComponent = {(
            <View style={{width:wp(96),height:hp(47),margin:7,borderRadius:20,overflow: 'hidden',}}>
           <Animated.Image source={{ uri: actualURI }} style={{
             width:'100%',height:'100%',
             transform:[
               {perspective:200},
               {scale: scale},
               {translateX : trX},
               {translateY : trY}
             ]
            }} 
            />
           </View>
          )}
         />
         
      </TouchableOpacity>
    )
  }

  renderImageWOFilters(data,index) {
    const scale = data.crops && data.crops.scale ? data.crops.scale : 1.0001;
    const trX =  data.crops && data.crops.positionX && scale >= 1.01 ? data.crops.positionX : 0;
    const trY = data.crops && data.crops.positionY && scale >= 1.01 ? data.crops.positionY : 0;
    return (
      <View style={{ width: dw, height: dh }}>
        <SelectedFilters images = {data} 
          childrenComponent = {(
            <View style={{width:wp(96),height:hp(47),margin:7,borderRadius:20,overflow: 'hidden',}}>
              <ViewShot ref={`combImage${index}`}
                //ref={refs => this.combImage = refs}
              >
            <Animated.Image style={{
              width: '100%', height: '100%',
              transform: [
                {perspective:200},
                { scale: scale },
                { translateX: trX },
                { translateY: trY }
              ]
            }}
              // borderRadius={12} 
              source={{ uri: data.uri }
              }
              //  source={image}
              resizeMode={'contain'}
            />
            
          </ViewShot>
           {/* <Animated.Image source={{ uri: actualURI }} style={{
             width:'100%',height:'100%',
             transform:[
               {perspective:200},
               {scale: scale},
               {translateX : trX},
               {translateY : trY}
             ]
            }} 
            /> */}
           </View>
          )}
         />
        {/* <View style={{
          marginBottom: 0, margin: 7, width: wp(96), height: hp(47), backgroundColor: 'white',
          borderRadius: 12, overflow: 'hidden'
        }}> */}
          {/* <View style={{ backgroundColor: `hsl(${this.state.hueX}, ${this.state.brightX}%,  ${this.state.lightx}%)`,  width: wp(96), height: hp(45), marginLeft: 15, borderRadius: 20, opacity: 0.5 }}> */}
          
        {/* </View> */}
        {/* </View> */}
        <TextInput
          label="Description"
          mode="outlined"
          value={data.description}
          maxLength={500}
          autoCorrect={false}
          
          numberOfLines={2}
          onChangeText={text => this.description(text, data)}
          multiline={true}
          // error={this.state.is_Valid_mail}
          style={{
            fontSize: profilename.FontSize, fontFamily: profilename.Font, backgroundColor: '#fff', width: wp('97%'), marginTop: 2,
            margin: 6,
          }}
          // style={{ paddingLeft: 0, width: wp('96%'), height: hp(8), marginLeft: 8, backgroundColor: '#FFF', fontSize: profilename.FontSize, fontFamily: profilename.Font, }}
          selectionColor={'#f0275d'}
          theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 14, paddingLeft: 5 } }}
        />
      </View>

    );
  }


  addTag() {
    const { TagId } = this.state;
    var data = {
      screeName: "post",
      tags: TagId
    }
    console.log('tha add tag NFU', data);
    this.props.navigation.navigate('AddTag', { data: data })
  }

  imageNull() {
    this.props.navigation.goBack();
  }

  reqCancel() {
    this.setState({ RequestModal: false, })
  }
  methodCrop() {
    this.setState({
      image: 1,
      editCrop: 1
    })
  }

  method2() {
    // this.onImageLoad();
    this.setState({
      image: 2

    })
  }

  method3() {
    this.setState({
      image: 3
    })
  }

  method4() {
    // alert('done')
    this.setState({
      image: 4
    })
  }
  editCancel() {
    this.setState({
      image: 3,
      editCrop: 0
    })
  }
  editCrop() {
    this.setState({
        editCrop: 1,
        edit: true,
        image: 1,
      })
  }


  cropdata() {
    this.setState({ croptrue: true })
    //  return(
    //   <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
    //   {this.state.imagesSelected ? this.state.imagesSelected.map(i => <View key={i.uri}>{this.cropp(i)}</View>) : null}
    // </ScrollView>
    //  )
  }
  bright() {
    this.setState({
      bright: true
    })
  }

  takeShot = async() =>{
    // console.log('INITIATING...');
    this.setState({ isLoading: true });
    const {imagesSelected,location,country} = this.state;
    
    if (location == "") {
      this.setState({ isLoading : false })
      toastMsg1('danger', " Please Drop the location here")
    }
    else if (country == "") {
      toastMsg1('danger', " Please Drop the Country here")
      this.setState({ isLoading: false });
    }else{
      let finalIndex = 0;
      this.save(imagesSelected);
      
    } 
  }
  save = async (imagesSelected) => {
    
    const { data_id, place_id, f_address, eachImgDescription } = this.state;
    
    var id = await AsyncStorage.getItem("userId");
    // console.log("Id is come or not", id, '--desc', eachImgDescription);
    const url = serviceUrl.been_url + "/NewsFeed"
    const data2 = new FormData();
    let eventsArr = []
    if (imagesSelected != null) {
      console.log('the if cond');
      for (let i = 0; imagesSelected.length > i; i++) {
        const fileName = imagesSelected[i].filename
        // const fileNameWithJpg = fileName?.replace(/HEIC/g,'JPG')
        let blobName,blobType
        if(Platform.OS=='android'){
          let files = getPicNameExt(imagesSelected[i].uri);
           blobName = files[0];
           blobType = files[1];
        }
      
        const Events = {
          filterId : imagesSelected[i].filterId,
          crops : imagesSelected[i].crops,
          BSV : imagesSelected[i].BSV,
          CSV: imagesSelected[i].CSV,
          LSV : imagesSelected[i].LSV,
          SSV: imagesSelected[i].SSV
        }
        eventsArr.push(Events)
        // let URI = ''
        // const fileURI = imagesSelected[i].uri
        // const appleId = fileURI.substring(5, 41);
        // const filename = fileURI
        // const fileNameLength = filename.length
        // const ext = filename.substring(fileNameLength - 3);
        // URI = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
        // console.log('the URI ',URI);
        console.log('the ext ',imagesSelected[i].mime );
        

        data2.append("NewsFeedPost",
          {
            uri: imagesSelected[i].uri,
            name: Platform.OS == 'ios' ? fileName : blobName+'.'+blobType,
            //blobName + '.' + blobType,
            // name: blobName + '@' + imagesSelected[i].imageIndex + '.' + blobType,
            type:imagesSelected[i].mime 
            //blobType == 'png' ? "image/png" : "image/jpeg"
            // imagesSelected[i].mime ? imagesSelected[i].mime : 
          });
      }
    }
    else {
      console.log('the else cond');
      data2.append("NewsFeedPost",
        {
          uri: this.state.avatarSource2,
          name: this.state.fileName,
          type: this.state.fileType == 'jpg' ? 'image/jpeg' : '​​image/png'
        });
    }

    // console.log('theee taggs', this.state.TagId, ' and its type', typeof this.state.TagId);

    data2.append("Events", JSON.stringify(eventsArr));

    data2.append("SponsoredBy", this.state.sponsored == "" ? null : this.state.sponsored);
    data2.append("TagsId", this.state.TagId == "" || this.state.TagId == undefined ? null : this.state.TagId.toString());
    data2.append("Location", this.state.location == "" ? null : this.state.location);
    data2.append("Country", this.state.country == "" ? null : this.state.country);
    // data2.append("Description", this.state.description == "" ? null : this.state.description);
    data2.append("coords", this.state.coords == "" ? null : this.state.coords);
    data2.append("UserId", id == "" ? null : id);
    data2.append("data_id", data_id);
    data2.append("place_id", place_id);
    data2.append("formattedAddress", f_address);
    

    let hashtagsArr = [], descArr = []
    if (eachImgDescription != undefined) {
      if (eachImgDescription.length > 0) {
        for (let i = 0; eachImgDescription.length > i; i++) {
          //  if(eachImgDescription[i].imgId !=undefined && eachImgDescription[i].desc !=undefined)
          descArr.push({
            imgId: eachImgDescription[i].imgId != undefined
              ? eachImgDescription[i].imgId
              : null,
            desc: eachImgDescription[i].desc != undefined
              ? eachImgDescription[i].desc
              : null
          })
          let ht = getHashTags(eachImgDescription[i].desc);
          ht.length > 0 ? hashtagsArr.push(ht) : null
          // console.log('let be know ht',ht);
        }

      }
    }

    descArr.length > 0
      ? data2.append("Description", JSON.stringify(descArr))
      : null;

    hashtagsArr.length > 0 ?
      data2.append("HashTag", hashtagsArr.join())
      : null;
    console.log('hasttag arr', hashtagsArr, '--descarr', descArr);
    console.log('the data2 are ', data2)

    
    //this.setState({ isLoading: false });
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
      },
      body: data2,
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.status == "True") {
          this.setState({ isLoading: false });
          this.props.navigation.navigate('MyPager');
        } else {
          this.setState({ isLoading: false });
          toastMsg1('danger', responseJson.message)
        }
      }).catch((error) => {
        this.setState({ isLoading: false });
        console.log("Line nuber 672", error);
      });
  // } //else end
}

  vlog() {
    this.props.navigation.navigate('Vlog');
  }

  _onfocus = () => {

  }

  _handlePress = (data, details) => {

    console.log('data', data);
    console.log('------------------------------');
    console.log('details', details);
    let addr = details.formatted_address.split(', ');
    let locName = data ? data.structured_formatting.main_text : null,
      counName = addr[addr.length - 1];
    let lat = details.geometry ? details.geometry.location.lat : null,
      lng = details.geometry ? details.geometry.location.lng : null;
    var geom = {
      latitude: lat,
      longitude: lng
    }
    let data_id = '', place_id = '';
    if (data) {
      data_id = data.id;
      place_id = data.place_id
    }
    this.setState({
      location: locName,
      country: counName,
      isPlacesModal: false,
      coords: JSON.stringify(geom),
      data_id: data_id,
      place_id: place_id,
      f_address: data ? data.structured_formatting.main_text + ', ' +
        data.structured_formatting.secondary_text : null
    })
  }

  onReadMoreClose = (isModal) => {
    this.setState({ isPlacesModal: false, })
  };

  // Edit Events
  cropp(){
    const {selectedTool,BSV} = this.state.avatarSource1;
    const crop = selectedTool === 0 ? true : false ;
    console.log('this.state.avatarSource1',this.state.avatarSource1);
    return (
      <View style={{  width: dw, height: dh * .55,backgroundColor:'transparent'}}>
        {/* <ViewShot ref="viewShot"> */}
            <SelectedFilters images = {this.state.avatarSource1} 
              childrenComponent = {
               <View style={{}}>
                {/* {!crop && <View style={{...StyleSheet.absoluteFillObject,overflow: 'hidden',zIndex:1}} />} */}
                    <ImageCropper
                      imageUri={this.state.avatarSource1.uri}
                      cropAreaWidth={CROP_AREA_WIDTH}
                      cropAreaHeight={CROP_AREA_HEIGHT}
                      setCropperParams={this.setCropperParams}
                    /> 
              </View>
            }
           />
        {/* </ViewShot> */}
      </View>
    )
  }


  render() {
    const { croppedImage, activeScroll,avatarSource1,edit,isSelectEdit,imagesSelected } = this.state;
    const src = { uri: croppedImage };
    const imagePath = '../../Assets/Images/';
    console.log('the whole image =>',imagesSelected);
    // console.log('the si is=>',avatarSource1);
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1,backgroundColor:'#fff' }}
      >

        {/* <StatusBar hidden
        //backgroundColor="#FFF" barStyle='dark-content' 
        /> */}
        <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="dark-content" />

        {(this.state.image === 3) && (this.state.avatarSource != null) ?
          <View style={{
            marginTop:Platform.OS === "ios"? StatusBar.currentHeight : StatusBar.currentHeight , height: dh * 0.05, flexDirection: 'row', justifyContent: 'center',
            width: dw, marginBottom: 10
          }}>
            {/* <Left> */}
            <TouchableOpacity onPress={() => this.imageNull()}>
              <View style={{ width: dw * .1, height: '100%', justifyContent: 'center' }}>
                <Image source={require('../../Assets/Images/backArrow.png')}
                  style={{ width: 25, height: 25, alignSelf: 'center', }}
                //  resizeMode={'center'}
                />
              </View>
            </TouchableOpacity>
            {/* </Left> */}
            <View style={{ width: dw * .8, height: '100%', justifyContent: 'center' }}>
              <Text style={[Common_Style.headerText, { marginTop: 0 }]}>Memory Post</Text>
            </View>
            {/* <View style={{ width: 60, height: 20, marginTop: 15, marginLeft: 10, backgroundColor: '#c6c6c6' }}><Text style={[styles.headerText, { color: '#fff' }]}>VLog</Text></View> */}
            {/* <Right> */}
            <TouchableOpacity onPress={() => this.method4()}>
              <View style={{ width: dw * .1, height: '100%', justifyContent: 'center' }}>
                <Image source={require('../../Assets/Images/backArrow.png')}
                  style={{ width: 25, height: 25, alignSelf: 'center', transform: [{ rotate: '180deg' }] }}
                //  resizeMode={'center'} 
                  />
              </View>
            </TouchableOpacity>
            {/* </Right> */}
          </View> :
           (this.state.image == 4) && (this.state.avatarSource != null) ?
            (<View style={{ marginTop:Platform.OS === "ios"? StatusBar.currentHeight : StatusBar.currentHeight , height: dh * 0.05, flexDirection: 'row', justifyContent: 'center',
              width: dw, 
            }}>
              {/* <Left> */}
              <TouchableOpacity onPress={() => this.method3()}>
                <View style={{ width: dw * .15, height: '100%', justifyContent: 'center'}}>
                  <Image source={require('../../Assets/Images/backArrow.png')}
                    style={{ width: 25, height: 25, marginLeft: 8 ,}} />
                </View>
              </TouchableOpacity>
              {/* </Left> */}

              <View style={{ width: dw * .70, height: '100%', justifyContent: 'center' }}>
                <Text style={[Common_Style.headerText, { marginTop: 0 }]}>Memory Post</Text>
              </View>
              {/* <View style={{ width: 60, height: 20, marginTop: 15, marginLeft: 10, backgroundColor: '#c6c6c6' }}><Text style={[styles.headerText, { color: '#fff' }]}>VLog</Text></View> */}

              <View style={{ width: dw * .15, height: '100%', justifyContent: 'center', }}>
                {this.state.isLoading ?
                  <Spinner size="small" color="#fb0143" />
                  :
                  <Text onPress={() => this.takeShot()} style={{ color: '#eb3415', marginLeft: 12, fontFamily: Common_Color.fontBold }}>Fly it</Text>
                }
              </View>

            </View>)
            :

            (this.state.avatarSource != null) && (this.state.image === 1) && (this.state.editCrop === 1) ?
              <View style={{
                marginTop:Platform.OS === "ios"? StatusBar.currentHeight : StatusBar.currentHeight, height: dh * 0.05, flexDirection: 'row', justifyContent: 'center',
                width: dw, marginBottom: 10
              }}>
                {/* <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="dark-content" /> */}
                {/* <Left> */}
                <TouchableOpacity hitSlop={styles.touchOpcity} onPress={() => this.editCancel()}>
                  <View style={{ width: dw * .15, height: '100%', justifyContent: 'center', }}>
                    <Text style={{ fontSize: 14, textAlign: 'center', }}>Cancel</Text>
                  </View>
                </TouchableOpacity>
                {/* </Left> */}

                <View style={{ width: dw * .70, height: '100%', justifyContent: 'center', }}>
                  <Text style={[Common_Style.headerText, { marginTop: 0 }]}>Memory Post</Text>
                </View>

                {/* <View style={{ width: 60, height: 20, marginTop: 15, marginLeft: 10, backgroundColor: '#c6c6c6' }}><Text style={[styles.headerText, { color: '#fff' }]}>VLog</Text></View> */}
                {/* <Right> */}
                <TouchableOpacity hitSlop={styles.touchOpcity} onPress={() => this.handlePressdone()}>
                  <View style={{ width: dw * .15, height: '100%', justifyContent: 'center', }}>
                    <Text style={{ fontSize: 14, textAlign: 'center', }}>Done</Text>
                  </View>
                </TouchableOpacity>
                {/* </Right> */}
              </View> :

              <View style={{ backgroundColor: '#fff', height: 45, flexDirection: 'row', justifyContent: 'center' }}>
                <Left>
                  <TouchableOpacity hitSlop={styles.touchOpcity} onPress={() => this.imageNull()}>
                    <Image source={require('../../Assets/Images/leftArrow.png')} style={{ width: 15, height: 15, marginLeft: 8 }}></Image>
                  </TouchableOpacity>
                </Left>

                <Text style={[Common_Style.headerText, { marginTop: 10 }]}>MPost</Text>

                {/* <View style={{ width: 60, height: 20, marginTop: 15, marginLeft: 10, backgroundColor: '#c6c6c6' }}><Text style={[styles.headerText, { color: '#fff' }]}>VLog</Text></View> */}
                <Right>
                  <TouchableOpacity hitSlop={styles.touchOpcity} onPress={() => this.method2()}>
                    <Image source={require('../../Assets/Images/rightArrowHeader.png')} style={{ width: 15, height: 15, marginRight: 5 }}></Image>
                  </TouchableOpacity>
                </Right>
              </View>
        }

        {
          this.state.editCrop === 0 && this.state.avatarSource != null && this.state.image == 1 ?
            <View>
              <ViewShot ref="viewShot">

                <ImageBackground source={{ uri: this.state.avatarSource1.uri }} style={{ width: wp('100%'), height: 400, marginTop: 10 }} resizeMode={'stretch'}>
                  {this.state.imagecolor == 0 ? (<View style={{ width: '100%', height: '100%' }}></View>) : null}
                  {this.state.imagecolor == 1 ? (<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,254,0.15)' }}></View>) : null}
                  {this.state.imagecolor == 2 ? (<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(154,73,34,0.7)' }}></View>) : null}
                  {this.state.imagecolor == 3 ? (<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(133,170,197,0.4)' }}></View>) : null}
                  {this.state.imagecolor == 4 ? (<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(252,89,159,0.2)' }}></View>) : null}
                </ImageBackground>

              </ViewShot>

              {/*Filters For Image*/}
              <ScrollView horizontal={true}
                style={{
                  width: '100%', height: '20%',
                  marginTop: '10%',
                }}
                showsHorizontalScrollIndicator={false}
              >
                <Filters sImage={this.state.avatarSource1}
                  MIData={this.state.imagesSelected}
                  revertData={(SI, MI) => this.updateRevertData(SI, MI)}
                />

              </ScrollView>


              {/* {this.state.edit == false ?
                <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-around' }}>
                  <Text style={{ fontSize: 14, color: '#80a2f8' }}>Filter</Text>
                  <Text onPress={() => this.editCrop()} style={{ fontSize: 14, color: '#000' }}>Edit</Text>
                </View> :
                <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-around', marginTop: '2%' }}>
                  <Text style={{ fontSize: 14, color: '#80a2f8' }}>Filter</Text>
                  <TouchableOpacity onPress={() => this.editCrop()}>
                    <Text onPress={() => this.editCrop()} style={{ fontSize: 14, color: '#000' }}>Edit</Text>
                  </TouchableOpacity>
                </View>} */}

            </View>
            :

            this.state.editCrop === 1 && this.state.avatarSource != null && this.state.image == 1 ?
              <View style={{ height : dh * .9 , width : dw }}>
                {this.state.croptrue == false ?
                  // <ImageCropper
                  //   style={{ width: wp('100%'), height: hp('80%') }}
                  //   imageUri={this.state.avatarSource1}
                  //   cropAreaWidth={CROP_AREA_WIDTH}
                  //   cropAreaHeight={CROP_AREA_HEIGHT}
                  //   setCropperParams={this.setCropperParams}
                  // />
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>

                    <ViewShot ref="viewShot">
                      {/* {this.state.imagesSelected ? this.state.imagesSelected.map(i =>
                      <View key={i.uri}>{
                        <ImageCropper
                        style={{ width: wp('100%'), height: hp('80%') }}
                        imageUri={this.state.avatarSource1}
                        cropAreaWidth={CROP_AREA_WIDTH}
                        cropAreaHeight={CROP_AREA_HEIGHT}
                        setCropperParams={this.setCropperParams}
                      />
                      }</View>) : null} */}

                    </ViewShot>

                    {/* {this.state.imagesSelected ? this.state.imagesSelected.map(i => <View key={i.uri}></View>) : null} */}
                  </ScrollView>
                  : null}

                {this.state.croptrue == false ?
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>

                    {/* <ViewShot ref="viewShot"> */}

                    {this.state.imagesSelected ? this.state.imagesSelected.map(i =>
                      <View key={i.uri}>{
                        <ImageBackground source={{ uri: this.state.avatarSource1.uri }} style={{ width: wp('100%'), height: 400, marginTop: 0 }} resizeMode={'contain'}>
                          <View style={{ width: dw , height: dh * .9, marginTop: 10, opacity: 0.5 }}>
                            {/* {this.state.imagecolor == 0 ? (<View style={{ width: '100%', height: '100%' }}></View>) : null}
                              {this.state.imagecolor == 1 ? (<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,254,0.15)' }}></View>) : null}

                              {this.state.imagecolor == 2 ? (<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(154,73,34,0.7)' }}></View>) : null}
                              {this.state.imagecolor == 3 ? (<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(133,170,197,0.4)' }}></View>) : null}
                              {this.state.imagecolor == 4 ? (<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(252,89,159,0.2)' }}></View>) : null} */}
                          </View>
                        </ImageBackground>
                      }</View>)
                      : null}

                    {/* </ViewShot> */}

                    {/* {this.state.imagesSelected ? this.state.imagesSelected.map(i => <View key={i.uri}></View>) : null} */}
                  </ScrollView> :

                  <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}
                  >
                    {this.cropp()}
                    {/* {this.state.imagesSelected ? this.state.imagesSelected.map(i => <View key={i.uri}>{this.cropp(i)}</View>) : null} */}
                  </ScrollView>}
                {/* {this.state.origin == false ? */}

                <View style={{
                  width: dw , height: dh * .28,flexDirection: 'row',                 
                }}>
                  <ImageEditSlider
                    sImage = {avatarSource1}
                    multiImage = {imagesSelected}
                    revertData = {(SI,MI)=>this.updateRevertData(SI,MI)}
                  />
                </View>

                <View style={{width : dw , height : dh * .08,flexDirection:'row', marginBottom:20}}> 
                      <TouchableOpacity onPress={() => this.setState({ editCrop: 0, isSelectEdit: false, image: 3 })}>
                        <View style={{ width: dw * .5,height:'100%', justifyContent:'center' }}>
                          <Text style={{ fontSize: 14, color: isSelectEdit ? '#ef1b66' : '#000',textAlign:'center' }}>Filterrr</Text>
                        </View>  
                      </TouchableOpacity >
                      
                      <TouchableOpacity onPress={() => this.editCrop()} >
                        <View style={{ width: dw * .5,height:'100%',justifyContent:'center' }}>  
                          <Text style={{ fontSize: 14, color: isSelectEdit ? '#000' : '#ef1b66' ,textAlign:'center' }}>Edit</Text>
                        </View>  
                      </TouchableOpacity>
                </View>   
              </View>
              :
              //Gallery Pick with Multiple image with filter
              this.state.avatarSource != null && this.state.image === 3 ?
                <View style={{height:dh * .9 ,width:dw,}}>

                  <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                    {this.state.imagesSelected ? this.state.imagesSelected.map((i,ind) => <View key={`id${ind}`}>{this.renderImage1(i)}</View>) : null}
                  </ScrollView>

                  {/* BOTTOM filter */}
                  <Filters sImage={this.state.avatarSource1}
                    MIData={this.state.imagesSelected}
                    revertData={(SI, MI) => this.updateRevertData(SI, MI)}
                  />
                  {/* :
                    // more than selected 
                    null} */}
                  {/* {edit == true ? */}
                  {/* <View style={{bottom:0,position:'absolute'}}> */}
                   <View style={{width : dw , height : dh * .08,flexDirection:'row',marginBottom:20 }}> 
                      <TouchableOpacity onPress={() => this.setState({ editCrop: 0, bright: false, image: 3 })}>
                        <View style={{ width: dw * .5,height:'100%', justifyContent:'center' }}>
                          <Text  style={{ fontSize: 14, color: edit ? '#ef1b66' : '#000',textAlign:'center' }}>Filterrr</Text>
                        </View>  
                      </TouchableOpacity >
                      
                      <TouchableOpacity onPress={() => this.editCrop()} >
                        <View style={{ width: dw * .5,height:'100%',justifyContent:'center' }}>  
                          <Text  style={{ fontSize: 14, color: edit ? '#000' : '#ef1b66' ,textAlign:'center' }}>Edit</Text>
                        </View>  
                      </TouchableOpacity>
                   </View>   
                   {/* </View> */}
                  {/* //  :
                  //   <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-around', marginBottom: '3%', height: '5%' }}>
                  //     <Text onPress={() => this.setState({ editCrop: 0, bright: false, image: 3 })} style={{ fontSize: 14, color: '#000' }}>Filter</Text>
                  //     <Text onPress={() => this.editCrop()} style={{ fontSize: 14, color: '#80a2f8' }}>Edit</Text>
                  //   </View>
                  // } */}
                  {/* <View style={{ width: dw, }}>
                    {this.state.edit == true ?
                      <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-around' }}>
                        {/* #80a2f8 */}
                  {/* <Text onPress={() => this.setState({ editCrop: 0, bright: false,image:3 })} style={{ fontSize: 14, color: '#80a2f8' }}>Filter</Text>
                        <Text onPress={() => this.editCrop()} style={{ fontSize: 14, color: '#000' }}>Edit</Text>
                      </View> :
                      <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-around', marginTop: '2%' }}>
                        <Text onPress={() => this.setState({ editCrop: 0, bright: false,image:3 })}  style={{ fontSize: 14, color: '#80a2f8' }}>Filter</Text>
                        <TouchableOpacity onPress={() => this.editCrop()}>
                          <Text onPress={() => this.editCrop()} style={{ fontSize: 14, color: '#000' }}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    } */}
                  {/* </View> */}
                </View>
                :

                //Multi Image Picking

                this.state.avatarSource != null && this.state.image == 4 ?

                  <ScrollView
                    keyboardShouldPersistTaps='always'
                    style={{ height: hp('90%'), }}
                    scrollEnabled={true}
                  >

                    <View style={{
                      flexDirection: 'column', height: hp('90%'),

                    }}>
                      <View style={{ flexDirection: 'row', }}>
                        <GooglePlacesAutocomplete
                          placeholder='Location'
                          placeholderTextColor='#000'
                          minLength={2}
                          autoFocus={false}
                          returnKeyType={'search'}
                          keyboardAppearance={'light'}
                          listViewDisplayed={false}
                          fetchDetails={true}
                          enablePoweredByContainer={false}
                          // styles={searchInputStyle}
                          styles={{
                            textInputContainer: {
                              width: '97%',
                              height: 37,
                              backgroundColor: 'rgba(0,0,0,0)',

                              borderColor: '#000',
                              margin: 6,
                              borderRadius: 10,
                              borderTopWidth: 2,
                              borderBottomWidth: 2,
                              borderWidth: 1,

                            },
                            description: {
                              fontSize: profilename.FontSize, fontFamily: profilename.Font,
                              color: "#4c4c4c",

                            },
                            predefinedPlacesDescription: {
                              color: '#1faadb'
                            },
                            textInput: {
                              // backgroundColor:'#c1c1c1',
                              height: 23,
                              fontSize: profilename.FontSize, fontFamily: profilename.Font,
                              paddingLeft: 0,

                            }
                          }}
                          renderDescription={row => row.description}
                          onPress={(data, details = null) => {
                            this._handlePress(data, details);
                          }}
                          getDefaultValue={() => ''}
                          query={{
                            key: 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20',
                            language: 'en', types: ''
                          }}
                          currentLocation={false}
                          currentLocationLabel="Current location"
                          nearbyPlacesAPI='GooglePlacesSearch'
                          GoogleReverseGeocodingQuery={{}}
                          GooglePlacesSearchQuery={{ rankby: 'distance,keyword,name', type: 'cafe' }}
                          GooglePlacesDetailsQuery={{ fields: 'formatted_address,name,geometry', }}
                          filterReverseGeocodingByTypes={['country', 'locality', 'street_address', 'food', 'address', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'geometry']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                          debounce={200}
                        />
                      </View>

                      <View >

                        <TextInput
                        
                          label="Country"
                          mode="outlined"
                          editable={false}
                          value={this.state.country}
                          autoCorrect={false}
                          
                          onChangeText={this.country}
                          style={[common_styles.textInputSignUp, { width: '97%' }]}
                          // style={{ width: wp('96%'), height: 40, marginLeft: 8, backgroundColor: '#FFF', fontSize: profilename.FontSize, fontFamily: profilename.Font, }}
                          selectionColor={'#f0275d'}
                          theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 6, } }} />
                      </View>

                      <View style={{ width: '100%', flexDirection: 'row', height: '5%' }}>
                        {this.state.profileType != 0 ?
                          (<View style={{ width: '50%', justifyContent: 'center', marginLeft: 5, alignItems: 'flex-start', }}>
                            <View style={{ flexDirection: 'row' }} >
                              <TouchableOpacity onPress={() => this.setState({ checkedbox: !this.state.checkedbox })}>
                                <Image style={{ marginTop: 8, width: 13, height: 13, marginLeft: 5 }}
                                  source={!this.state.checkedbox ?
                                    require('../../Assets/Images/ic_checkbox.png')
                                    :
                                    require('../../Assets/Images/ic_checkbox_selected.png')
                                  } />
                              </TouchableOpacity>


                              <Text onPress={() => this.setState({ checkedbox: !this.state.checkedbox })}
                                style={{  fontSize: 13, marginLeft: 8, color: '#2c2d2d', marginTop: 5 }}>
                                Sponsored
                           </Text>
                            </View>
                          </View>) :
                          <View style={{ width: '50%' }} />
                        }

                        <View style={{
                          width: '48%', justifyContent: 'center', alignItems: 'flex-end', marginTop: 8,
                        }}>
                          <Text onPress={() => this.addTag()} style={{
                            fontSize: 12, textAlign: 'right',
                            color: '#0e8de8', marginRight: 12, fontFamily: Common_Color.fontBold,
                            marginRight: 8
                          }}>
                            {this.state.tagCount > 0 ? this.state.tagCount : null} Add Tag
                          </Text>
                        </View>
                      </View>

                      {this.state.profileType != 0 ?
                        this.state.checkedbox === true ?
                          <View style={{ justifyContent: 'center' }}>
                            {/* <TextInput
                              placeholder='Sponsored By'
                              value={this.state.sponsored}
                              onChangeText={this.sponsored}
                              style={[styles.locationText, { width: '80%', height: 37 }]}
                              theme={{ colors: { primary: 'white' } }}
                            /> */}
                            <TextInput
                              label="Sponsored By"
                              mode="outlined"
                              value={this.state.sponsored}
                              autoCorrect={false}
                              
                              onChangeText={this.sponsored}
                              style={[common_styles.textInputSignUp, { width: '97%', marginTop: 5, }]}
                              selectionColor={'#f0275d'}
                              theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                          </View> : null
                        : null}

                      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        {this.state.imagesSelected ? this.state.imagesSelected.map((i,ind) => <View key={i.uri}>{this.renderImageWOFilters(i,ind)}</View>) : null}
                      </ScrollView>
                      {/* {this.renderImageWOFilters()} */}

                      <View >

                      </View>
                    </View>
                    {/* Request cancel Modal */}
                    <Modal isVisible={this.state.RequestModal}
                      onBackdropPress={() => this.setState({ RequestModal: false })}
                      onBackButtonPress={() => this.setState({ RequestModal: false })} >
                      <View style={{ backgroundColor: '#fff', borderRadius: 8 }} >

                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                          <Text style={{ color: '#acacac', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 16, marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%', marginLeft: '8%' }}>
                            Please Drop the location here

                            +
                                    </Text>
                        </View>
                        <View style={[Common_Style.Common_button, { width: wp(88), margin: 3, marginBottom: 15 }]}>

                          <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                            borderRadius={10}
                          >
                            <TouchableOpacity onPress={() => { this.reqCancel() }}>
                              <Text onPress={() => { this.reqCancel() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}>Ok</Text>
                            </TouchableOpacity>
                          </ImageBackground>

                        </View>

                      </View>
                    </Modal>


                  </ScrollView>

                  :

                  <Image style={styles.imageBinding}
                    source={this.state.avatarSource} />
        }

      </KeyboardAvoidingView>
    )
  }
}

const searchInputStyle = {
  // backgroundColor: '#fff', width: '84%', height: 37, alignSelf: 'center', 
  // marginTop: 8, marginBottom: 6, 
  // borderRadius: 10, fontSize: profilename.FontSize, fontFamily: profilename.Font },
  textInputContainer: {
    width: '97%',
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderWidth: 1,
    borderColor: '#000',
    margin: 6,
    borderRadius: 10,
  },
  description: {
    fontSize: profilename.FontSize, fontFamily: profilename.Font,

  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  textInput: {
    // backgroundColor:'#c1c1c1',
    height: 33,
    paddingLeft: 5,
    fontSize: profilename.FontSize, fontFamily: profilename.Font,

  }
}

const gSearchBox = {
  // top: 0,
  //         position: "absolute",
  //         flex: 1,
  //         justifyContent: 'center',
  width: '95%',
  padding: 0,
  margin: 0,
  marginLeft: 0,
  backgroundColor: 'grey'
}



