
import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet, Text, Dimensions,
  View, ImageBackground, TextInput, Alert, TouchableOpacity,
  Image, ToastAndroid, Platform, ScrollView, FlatList,
  PanResponder,StatusBar,TouchableHighlight,TouchableWithoutFeedback,
  Animated,Keyboard,
  BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper'
import { RNCamera } from 'react-native-camera';
import Modal from 'react-native-modalbox';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
// import ImagePicker from 'react-native-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FooterTab, Footer, Container, Toast, Spinner } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';

import ViewShot from "react-native-view-shot";
import Geolocation from '@react-native-community/geolocation';
import {deviceHeight as dh , deviceWidth as dw} from '../_utils/CommonUtils'

import {
  MainImage, VisitCheckIn, EnrouteMile, LocationCIn,
  EnrouteBoard, EnrouteText, AwardFloral, GymTime ,HikeDay,
  ChaiTime, Rectangle, Delicious, Run, HalfBox, HashTag,
  CurrentDay,CurrentDate,UserText
} from './_sticker_compo';

import {GalleryPicker} from '../commoncomponent';
import { Pressable } from 'react-native';


//old from 28032020
// const data = [
//   { id: 1, image: require('../../Assets/Images/locationSticker.jpg'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 2, image: require('../../Assets/stickers/hashtag.png'), country: 'India', name: 'Mufthi' },
//   { id: 3, image: require('../../Assets/stickers/heart.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 4, image: require('../../Assets/stickers/heartEyes.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 5, image: require('../../Assets/stickers/kiss.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 6, image: require('../../Assets/stickers/party.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 7, image: require('../../Assets/stickers/robot.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 8, image: require('../../Assets/stickers/smile.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 9, image: require('../../Assets/stickers/sunglasses.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 10, image: require('../../Assets/stickers/ghost.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 11, image: require('../../Assets/stickers/thumbsup.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 12, image: require('../../Assets/stickers/backgroundColor.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 13, image: require('../../Assets/stickers/backgroundColor.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 14, image:require('../../Assets/stickers/days.png'), country: 'Sydney,Australia', name: 'Daniel' },
//   { id: 15, image:require('../../Assets/stickers/Rectangle.png'), country: 'Sydney,Australia', name: 'Daniel' },
// ];

//new 

/* Static Stickers */
const data = [
  { id: 1, image: require('../../Assets/stickers/new/visit_check_in.png'),  },
  { id: 2, image: require('../../Assets/stickers/new/location_check_in.png') },
  { id: 3, image: require('../../Assets/stickers/new/enroute_2.png') },
  { id: 4, image: require('../../Assets/stickers/new/enroute-sticker-2.png')},
  { id: 5, image: require('../../Assets/stickers/new/enroute-sticker.png') },
  { id: 6, image: require('../../Assets/stickers/new/Award_wings.png') },
  { id: 7, image: require('../../Assets/stickers/new/gym_time.png') },
  { id: 8, image: require('../../Assets/stickers/new/hike_day.png') },
  { id: 9, image: require('../../Assets/stickers/new/box.png') },
  { id: 10, image: require('../../Assets/stickers/new/chai_time.png') },
  { id: 11, image: require('../../Assets/stickers/backgroundColor.png') },
  { id: 12, image: require('../../Assets/stickers/new/delecious.png') },
  { id: 13, image: require('../../Assets/stickers/new/run.png') },
  { id: 14, image: require('../../Assets/stickers/hashtag.png') },
  { id: 15, image:require('../../Assets/stickers/days.png'), },
];


var time='';
var fulldate='';
var day='';
var temp="";
const flashon = require('../../Assets/Images/flash_on.png');
const flashoff = require('../../Assets/Images/flash_off.png');
const flashauto = require('../../Assets/Images/flash_auto.png');

export default class Camera extends Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();

  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props)
   
    this.state = {
      id: '',
      example: null,
      color: '#FF0000',
      text: '',
      thickness: 5,
      message: '',
      photoPath: null,
      photoPath1: null,
      screenShot: null,
      fileName: null,
      fileType: null,
      scrollEnabled: true,
      isOpen: true,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      imagesSelected: null,
      imageSelectedIndex: -1,
      currentMainIndex : 0,
      textInputFontColor: '#fff',
      camType: RNCamera.Constants.Type.back,
      sticker: '',
      image: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
      image6: '',
      image7: '',
      image8: '',
      image9: '',
      image10: '',
      image11: '',
      image12: '',
      image13:'',
      image14:'',
      image15:'',
      showDraggable: true,
      dropZoneValues: null,
      text1: '',
      textOnChange: false,
      userHashTag: '',
      hashtagEditable: true,
      editStickerDone: '',
      textinput: false,
      screenShot: null,
      coords: null,
      placeName: '',
      isLoading : false,
      flash :{ 
        mode : RNCamera.Constants.FlashMode.on,
        Index : 0,
        Image : flashon
      },
      isfocus : false,
    
    }

    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);

  }
                            
  

  componentDidMount() {
    this.onLoad();
    
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        const { navigation } = this.props;
        // BackHandler.addEventListener("hardwareBackPress", this.backPressed);
        const datas = navigation.route.params.datas;
        const img_prop = navigation.route.params.imgProp;
        console.log('image props',img_prop);
        if(img_prop != undefined && img_prop.sImg){
          this.imageManipulte(img_prop)
        }
        // console.log('location props',datas)
        // console.log('undefined datatype',typeof datas)
        console.log('datas',datas);

        if (datas === undefined) {
          //console.log('')
          this.setState({
            sticker: '',
            image: ''
          });
          // this.refs.modal2.open()
        }

        if (datas != undefined) {
          console.log('cords', datas.coords);
          console.log('----------------')
          console.log('name is ', datas.name);
          this.setState({
            coords: datas.coords,
            placeName: datas.name
          });
        }
        
      })

     
    // console.log('placess coords', this.state.coords,'and the name is ',this.state.placeName);

  }

  _keyboardDidShow =()=> {
    this.setState({
      isfocus : true
    })
  }

  _keyboardDidHide =()=> {
    this.setState({
      isfocus : false
    })
  }

  editTextAni=()=>{
    this.setState({example:2})
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  /**
   * Image get from gallery
   * @param {if()multi image}  
   * @param {else single image}
   */
  imageManipulte = (prop) =>{
   
    if (prop.e && prop.e.length > 1) {
      this.setState({
        photoPath: prop.e[0].node.image.uri.replace('file:///', ''),
        photoPath1: prop.e[0].node.image.uri,
        imagesSelected: prop.e.map((i, index) => {
          return {
            uri: i.node.image.uri, width: i.node.image.width,
            height: i.node.image.height, mime: i.node.type, imageIndex: index
          };
        })
      });
    }
    else{
      function fileNameAndExt(str) {
        var file = str.split('/').pop();
        return [file.substr(0, file.lastIndexOf('.')), file.substr(file.lastIndexOf('.') + 1, file.length)]
      }
      let files = fileNameAndExt(prop.e[0].node.image.uri);
      console.log('files array', files)
      let blobName = files[0],
        blobType = files[1];

      this.setState({
        photoPath: prop.e[0].node.image.uri.replace('file:///', ''),
        photoPath1: prop.e[0].node.image.uri,
        screenShot: prop.e[0].node.image.uri.replace('file:///', ''),
        fileName: blobName + '.' + blobType,
        fileType: blobType
      })
    }
  }


  // findLocation()
  // {
  //   var latitude ;
  //   var longitude;
  //  // debugger;
  //   Geolocation.getCurrentPosition(
  //     position => {
       
  //       latitude = position.coords.latitude
  //       longitude= position.coords.longitude
  //       console.log('location'+latitude,longitude)
  //       this.fetchWeather(latitude,longitude)
       
  //     },
  //     error => console.log('Error', JSON.stringify(error)),
  //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  //   );
  //   // this.watchID = Geolocation.watchPosition(position => {
  //   //   const lastPosition = JSON.stringify(position);
  //   //   this.setState({lastPosition});
  //   // });
    
  // }

  // fetchWeather(lat, lon) {
  //   const API_KEY = '849338767c0e95025b5559533d26b7c4';
	// 	fetch(
      
	// 		`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
	// 	)
	// 		.then(res => res.json())
	// 		.then(json => {
			
  //        let 	temperature= Math.floor(json.main.temp)  
  //       // let 	temperature= Math.floor(-10.3)    
  //       let 	weatherCondition= json.weather[0].main;
  //      this.setState({temparature:temperature})
        
  //       console.log('wether'+temperature+'      '+ 	weatherCondition)
			
	// 		});
  //   }


  async onLoad() {
    // debugger
    var userId = await AsyncStorage.getItem('userId');
    this.setState({
      id: userId,
    })
  }

  /**
   * Image get from camera
   * @param {react-native-camera}  
   */
  takePicture = async function () {
    // debugger
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      // alert(data.uri);
      //console.log('after snap',data);
      var str = data.uri;
      function fileNameAndExt(str) {
        var file = str.split('/').pop();
        return [file.substr(0, file.lastIndexOf('.')), file.substr(file.lastIndexOf('.') + 1, file.length)]
      }
      let files = fileNameAndExt(str);
      console.log('files array', files)
      let blobName = files[0],
        blobType = files[1];
      this.setState({
        photoPath: data.uri.replace('file://', ''),
        photoPath1: data.uri,
        screenShot: data.uri.replace('file://', ''),
        fileName: blobName + '.' + blobType,
        fileType: blobType
      })
    }
  };

  /**
   * Turn camera
   * @param {Front and Back}  
   */
  _turnCamera = () => {
    if (this.state.camType == RNCamera.Constants.Type.back) {
      this.setState({ camType: RNCamera.Constants.Type.front })
    } else {
      this.setState({ camType: RNCamera.Constants.Type.back })
    }
  }

  /**
   * Open Gallery 
   * @param {GalleryPicker-cutom component}
  */
  _openGallery = () => {
    // alert('test ok')
    this.props.navigation.navigate('GalleryPicker',{screen:'Camera',type:'Photos'});
    // ImagePicker.openPicker({
    //   isCamera: false,
    //   isSelectBoth : true,
    //   multiple: true
    // }).then(images => {
    //   console.log('received images callback', images);
    //   this.setState({
    //     photoPath: images[0].path.replace('file:///', ''),
    //     photoPath1: images[0].path,
    //     imagesSelected: images.map((i, index) => {
    //       return { uri: i.path, width: i.width, height: i.height, mime: i.mime, imageIndex: index };
    //     })
    //   });
    // }).catch(e => alert(e));

  }

  /**
   * Image display 
  */
  renderImage(image) {
    return (
      <TouchableOpacity onPress={() => this._setSelectedImage(image)}>
        <View style={{
          backgroundColor: '#c1c1c1', width: 32, height: 52, borderRadius: 5, overflow: 'hidden'
          , borderWidth: 0.6, borderColor: '#fff', marginRight: 8, flexWrap: 'wrap'
        }} >
        <Image style={{ width: '100%', height: '100%',}} source={image} 
       //  resizeMode={'cover'}
          />
        </View>
      </TouchableOpacity>
    )
  }

  readHashTag(text) {
    this.setState({ userHashTag: text.toUpperCase(), })
  }

  hashView = () =>{
    return(
      <View style={{flexDirection:'row'}}>
                {/*#color pink = ef1b66 */}
                <Text style={styles.hashText}>
                   {this.state.userHashTag.length > 0 ? '#':null}
                </Text>
                <TextInput
                placeholderTextColor = {'#ef1b669e'}
                placeholder = '#Hashtag'
                underlineColorAndroid='transparent'
                style={styles.hashtagInput}
                onChangeText = {(text)=>{
                  this.readHashTag(text)
                 }}
                //  caretHidden={true}
                autoCompleteType = {'off'}
                 spellCheck={false}
                autoCorrect={false}
                autoCorrect={false}
                
                maxLength = {15}
                editable = {this.state.hashtagEditable}
                value = {this.state.userHashTag }

                 />
        </View>
    )
  }

  /**
   * set selected image
   */
  _setSelectedImage = (image) => {
    // alert("Selected Index " + image.imageIndex)
    console.log('current path',image);
    this.setState({
      photoPath: image.uri.replace("file:///", ''),
      photoPath1: image.uri,
      imageSelectedIndex: image.imageIndex,
      currentMainIndex : image.imageIndex
    })
  }

  /**
   * set sticker image
   */
  valuPass(item) {
   // debugger;
    console.log('items', item);
    const {currentMainIndex} = this.state;
    console.log('curretn index',currentMainIndex);
    if (item.id === 1) {
      // currentMainIndex
      //old one-> this.setState({ sticker: item.id, image: item.image, editStickerDone: 1 })
      this.setState({ sticker: item.id, image:{uri:item.image,ind : currentMainIndex } })
      this.props.navigation.navigate('Gplaces');
    }
    // console.log('images stickers', item.image);
    if (item.id == 2) {
      this.setState({ sticker: item.id, image1: {uri:item.image,ind:currentMainIndex} })
      // if (!this.state.hashtagEditable) {
      //   this.setState({ hashtagEditable: true })
      // }
    }
    if (item.id == 3) {
      console.log('items', item);
      // console.log('images are', require('../../Assets/stickers/new/enroute_2.png'))
      this.setState({ sticker: item.id, image2: {uri:item.image,ind: currentMainIndex} })
    }
    if (item.id == 4) {
      this.setState({ sticker: item.id, image3: {uri:item.image,ind:currentMainIndex} })
    }
    if (item.id == 5) {
      this.setState({ sticker: item.id, image4: {uri:item.image,ind:currentMainIndex} })
    }
    if (item.id == 6) {
      this.setState({ sticker: item.id, image5: {uri:item.image,ind:currentMainIndex} })
    }
    if (item.id == 7) {
      this.setState({ sticker: item.id, image6: {uri:item.image,ind:currentMainIndex} })
    }
    if (item.id == 8) {
      this.setState({ sticker: item.id, image7: {uri:item.image,ind: currentMainIndex} })
    }
    if (item.id == 9) {
      this.setState({ sticker: item.id, image8: {uri:item.image,ind:currentMainIndex} })
    }
    if (item.id == 10) {
      this.setState({ sticker: item.id, image9: {uri:item.image,ind:currentMainIndex} })
    }
    if (item.id == 11) {
      this.setState({ sticker: item.id, image10: {uri:item.image,ind:currentMainIndex} })
    }
    if (item.id == 12) {  
      this.setState({ sticker: item.id, image11: {uri:item.image,ind:currentMainIndex} })
    }

    if (item.id == 13) {  
      //console.log('this is ',item.id)
      this.setState({ sticker: item.id, image12: {uri:item.image,ind:currentMainIndex} })
    }

    if(item.id == 14){
      this.setState({ sticker: item.id, image13: {uri:item.image,ind:currentMainIndex} })
       if (!this.state.hashtagEditable) {
        this.setState({ hashtagEditable: true })
      }
    }

    if(item.id == 15){
      this.setState({ sticker: item.id, image14: {uri:item.image,ind:currentMainIndex} })
    }

    if(item.id == 16){
      this.setState({ sticker: item.id, image15: {show:'active',ind:currentMainIndex} })
    }
    
    
    // if (item.id == 15) {  this.setState({ sticker: item.id, image15: item.image, editStickerDone: 1 })  }

    this.refs.modal2.close();
  }

  _pencilDraw = (pics) => {
    this.setState({ example: null })
  }

  open() {
    this.refs.modal2.open()
  }
  modalClose(){
    this.refs.modal2.close();
  }

  closeCamera () {
    this.props.navigation.goBack();
  }

  changeFlash(){
    const {flash} = this.state;
    
    if(flash.Index === 0 )
    {
      this.setState({
        flash:{
          Index : 0 + 1,
          mode : RNCamera.Constants.FlashMode.auto,
          Image : flashauto
        }
      })
    }else if(flash.Index === 1){
      this.setState({
        flash:{
          Index : 1 + 1,
          mode : RNCamera.Constants.FlashMode.off,
          Image : flashoff
        }
      })
    }else if(flash.Index === 2){
      this.setState({
        flash:{
          Index : 0,
          mode : RNCamera.Constants.FlashMode.on,
          Image : flashon
        }
      })
    }
    
    
  }

  isDropZone(gesture) {
    var dz = this.state.dropZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }


  setDropZoneValues(event) {
    this.setState({ dropZoneValues: event.nativeEvent.layout, });
  }


  time()
  {
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes();
    time=hours+':'+min
  }

  date()
  {
    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May','Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = new Date().getDate(); //Current Date
    var month = monthNames[new Date().getMonth()];
    var year = new Date().getFullYear(); //Current Year
    fulldate=date+' '+month+' '+year;
    return fulldate;
  }

  Days()
  {
    var d = new Date();
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    day=days[d.getDay()]
    return day;
  }

  fullDateCommon = () =>{
    return(
      <View style={{ width: wp('30%'), justifyContent: 'center' }}>
      <Text style={{
        textAlign: 'center', color: '#FFF', fontSize: 20, fontWeight: 'bold'
      }}>
        {this.date()}
      </Text>
      </View>
    )
  }

  commonDays = () =>{
    return(
      <View style={{ width: wp('30%'), justifyContent: 'center' }}>
        <ImageBackground source={data[14].image} style={{
          width: '100%', height: 50, justifyContent: 'center' }}
         // resizeMode={'center'} 
          >
          <Text style={{ color: '#ef1b66', textAlign: 'center', marginLeft: 20 }}>
            {this.Days()}
          </Text>
        </ImageBackground>
      </View>
    )
  }

  /**
   * stickers display
   * @param {if (multi image)}
   * @param {else for single image}
   */
  renderDraggable() {
    const { image, image1, image2, image3,
      image4, image5, image6, image7, image8,
      image9, image10,image11,image12,image13,image14,image15,placeName,
      imagesSelected,imageSelectedIndex
    } = this.state;

    const { navigation } = this.props;
    const datas = navigation.route.params.datas;
    //datas {coords: {…}, name: "Bengaluru"}]

    console.log('render draggable ',datas);
    let getLocation = '';
    if (datas != undefined) {
      getLocation = datas.name
    }
  
    if(imagesSelected != null && imagesSelected.length > 0 ){
      for (let i = 0; i < imagesSelected.length; ++i) {
        // if (imagesSelected[i].imageIndex == imageSelectedIndex) return true;
     
      return (
        <View>
  
          {image !='' && image.ind == imageSelectedIndex
          ? <VisitCheckIn location = {getLocation}/> : null }
          {/* imageIndex */}
          { image1 != '' && image1.ind == imageSelectedIndex
             ? <LocationCIn uri={image1} /> : null }  
          { image2 != '' && image2.ind == imageSelectedIndex 
             ? <EnrouteMile />  : null }
          { image3 != '' && image3.ind == imageSelectedIndex
            ? <EnrouteBoard uri={image3} /> : null }
          { image4 != '' && image4.ind == imageSelectedIndex
            ? <EnrouteText uri={image4} /> : null }
          { image5 != '' && image5.ind == imageSelectedIndex
            ? <AwardFloral uri={image5} /> : null }
          { image6 != '' && image6.ind == imageSelectedIndex
            ? <GymTime uri={image6} /> : null }
          { image7 != '' && image7.ind == imageSelectedIndex
            ? <HikeDay uri={image7} /> : null }
          { image8 != '' && image8.ind == imageSelectedIndex
            ? <HalfBox uri={image8} /> : null }
          { image9 != '' && image9.ind == imageSelectedIndex
            ? <ChaiTime uri={image9} /> : null }
          { image10 != '' && image10.ind == imageSelectedIndex
            ? <Rectangle uri={image10} /> : null }
          { image11 != '' && image11.ind == imageSelectedIndex
            ? <Delicious uri={image11} /> : null }
          { image12 != '' && image12.ind == imageSelectedIndex
            ? <Run uri={image12} /> : null }
          { image13 != '' && image13.ind == imageSelectedIndex
            ? <HashTag children={this.hashView()} /> :null }
          { image14 !='' && image14.ind == imageSelectedIndex
            ? <CurrentDay children={ this.commonDays()}/>  :null}
          { image15 !='' && image15.ind == imageSelectedIndex
            ? <CurrentDate children={ this.fullDateCommon()}/>  :null}
        
        </View> //Main Parent View
  
      );
     }
    }else{
      return (
        <View>
  
          {image !='' ? <VisitCheckIn location = {getLocation}/> : null }
          {/* imageIndex */}
          { image1 != '' ? <LocationCIn uri={image1} /> : null }  
          { image2 != '' ? <EnrouteMile /> : null }
          { image3 != '' ? <EnrouteBoard uri={image3} /> : null }
          { image4 != '' ? <EnrouteText uri={image4} /> : null }
          { image5 != '' ? <AwardFloral uri={image5} /> : null }
          { image6 != '' ? <GymTime uri={image6} /> : null }
          { image7 != '' ? <HikeDay uri={image7} /> : null }
          { image8 != '' ? <HalfBox uri={image8} /> : null }
          { image9 != '' ? <ChaiTime uri={image9} /> : null }
          { image10 != '' ? <Rectangle uri={image10} /> : null }
          { image11 != '' ? <Delicious uri={image11} /> : null }
          { image12 != '' ? <Run uri={image12} /> : null }
          { image13 != '' ? <HashTag children={this.hashView()} /> :null }
          { image14 !='' ? <CurrentDay children={ this.commonDays()}/>  :null}
          { image15 !='' ? <CurrentDate children={ this.fullDateCommon()}/>  :null}
        
        </View> //Main Parent View
  
      );
    }
    
  }

  /**
   * Capture Image and send backend
   */
  onImageLoad() {
    const {imagesSelected} = this.state;
    console.log('multi images',imagesSelected);
    let mapped = false;
    // imagesSelected.map((d,i)=>{
    //   this.setState({photoPath1:d.uri})
   
    this.refs.viewShot.capture()
      .then(uri => {
        console.log("do something with ", uri);
        // imagesSelected[i] = {...imagesSelected[i] ,uri:uri}
        this.setState({ photoPath1: uri });
        // this.setState({ imagesSelected: imagesSelected });
        this.makeStory();
       
      })
      .catch(function (error) {
        console.log('warn', error)
      });
     
    // })

    // this.makeStory();
  };

  textInputColorShot() {
   // debugger;
    alert('asdas shot');
    // this.refs.viewShot1.capture()
    //   .then(uri => {
    //     console.log("do something with ", uri);
    //     this.setState({
    //       photoPath1: uri, example: 3,
    //       screenShot: uri.replace("file:///", '')
    //     });
    //     console.warn("do something with ", this.state.screenShot);
    //   })
    //   .catch(function (error) {
    //     console.log('warn', error)
    //   });
  }


  doneInput() {
    // alert('the done');
    this.setState({ 
      //photoPath: 1 
      example: 3
    });
  }

  ss = (text) => {
    this.setState({
      text1: text
    })
  }

  onFocusMethod = (e) => {
    console.log('the sdsd',e.nativeEvent)
    this.setState({ isfocus: true })
  }
  

  keyboardDismiss = () => {
    this.setState({
      isfocus: false
    })
    Keyboard.dismiss();
  }

  async makeStory() {
    //debugger;
    const { imagesSelected,userHashTag } = this.state;
    var dateFormat = new Date().toString();
    toastMsg('success', "Uploading...")
  //  ToastAndroid.show("Uploading...", ToastAndroid.LONG);
    // const url = serviceUrl.been_url + "/ExploreStory";
    const url =serviceUrl.been_url +  "/ExploreStory";
    this.setState({isLoading : true})
    const data2 = new FormData();
    let stCords = this.state.coords != null ? JSON.stringify(this.state.coords) : null;
    console.log('stringified coords', stCords);

    function fileNameAndExt(str) {
      var file = str.split('/').pop();
      return [file.substr(0, file.lastIndexOf('.')), file.substr(file.lastIndexOf('.') + 1, file.length)]
    }

    if (imagesSelected != null) {
      for (let i = 0; imagesSelected.length > i; i++) {
        let files = fileNameAndExt(imagesSelected[i].uri);
        let blobName = files[0],
          blobType = files[1];
        data2.append("pic",
          {
            uri: imagesSelected[i].uri,
            name: blobName + '.' + blobType,
            type: imagesSelected[i].mime
          });

      }
    }
    else if (this.state.photoPath1 != null) {
      data2.append("pic",
        {
          uri: this.state.photoPath1,
          name: this.state.fileName,
          type: this.state.fileType == 'jpg' ? 'image/jpeg' : '​​image/png'
        });
    }
    data2.append("userId", this.state.id);
    data2.append("Text", this.state.text == "" ? null : this.state.text);
    data2.append("coords", stCords);
    data2.append("PostTime", dateFormat);

    data2.append("PlaceName", this.state.placeName);
    data2.append("HashTag",userHashTag !="" ?[userHashTag]:null);

    console.log('datasss', data2);
    this.props.navigation.navigate('MyPager');
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
        },
        body: data2,
      })
   
      const responseJson = await response.json();
      // .then((responseJson) => {
      console.log('story post resp', responseJson);
      if (responseJson.status == "True") {
        this.setState({ isLoading: false });
        this.props.navigation.navigate('MyPager');
      } else {
        //toastMsg('danger', response.message, '#cb1f4c')
        this.setState({ isLoading: false });
        toastMsg1('danger', "could not upload.try again")
       // ToastAndroid.show("could not upload.try again", ToastAndroid.LONG);
      }
      // //})
    }
    catch (error) {
      this.setState({ isLoading: false });
      console.log('the make story error:',error);
      toastMsg1('danger', "something went wrong.try again once")
     // ToastAndroid.show("something went wrong.try again once", ToastAndroid.LONG);
      reject(new Error(`Unable to retrieve events.\n${error}`));
    }
  }


  render() {
    const { image } = this.state;
    return (
      <View style={styles.container}>
      <StatusBar hidden />
            
      {
        /* Camera View */
          (this.state.example === null) &&
            (this.state.photoPath === null) ?
            (
            <View style={styles.cameraContainer}>
              <StatusBar hidden/>  
                
               <RNCamera ref={ref => { this.camera = ref; }} style={styles.preview} type={this.state.camType}
                flashMode={this.state.flash.mode} permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'Been need your permission to use your camera phone'} />
               <View style={{...StyleSheet.absoluteFillObject}}> 
               <TouchableWithoutFeedback  onPress={()=>this.closeCamera()}>
                <View style={{width:'10%',height:'100%',height:'5%',top:25,
                  position:'absolute',right:10,justifyContent:'center'}} >                    
                  <Image source={require('../../Assets/Images/close_white.png')}
                   style={{width:25,height:25,alignSelf:'center'}}
                  // resizeMode={'center'}
                   />
                </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback  onPress={()=>this.changeFlash()}>
                <View style={{width:'10%',height:'100%',height:'5%',bottom:150,
                  position:'absolute',right:10,justifyContent:'center',}} >  
                  <Image source={this.state.flash.Image}
                   style={{width:30,height:30,alignSelf:'center',}}
                   //resizeMode={'center'}
                   />
                </View>
                </TouchableWithoutFeedback>

                <View style={{flexDirection: 'row', height:hp('6%'),width:wp('80%'),borderRadius:25,
                  backgroundColor:'#fff',bottom:40,position : 'absolute',marginLeft:'10%',
                }}>
                  <View style={{width:wp('20%'), height:hp('6%'),justifyContent:'center'}}>
                    <TouchableOpacity hitSlop={styles.touchOpcity} onPress={() => this._openGallery()} style={styles.capture}>
                      <Image source={require('../../Assets/Images/story/gallery.png')} style={{ width: 30, height: 30,}} 
                  // resizeMode={'stretch'} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={{width:wp('40%'),height:hp('13%'),justifyContent:'center',bottom:25,position:'relative'}}>
                  <TouchableOpacity hitSlop={styles.touchOpcity} onPress={this.takePicture.bind(this)} style={styles.capture}>
                    <Image source={require('../../Assets/Images/story/snap.png')} style={{ width: 70, height: 70, }} 
                //   resizeMode={'stretch'} 
                    />
                  </TouchableOpacity>
                  </View>
                  <View style={{width:wp('20%'),height:hp('6%'),justifyContent:'center'}}>
                  <TouchableOpacity hitSlop={styles.touchOpcity} onPress={() => this._turnCamera()} style={styles.capture}>
                    <Image source={require('../../Assets/Images/story/turncam.png')} style={{ width: 35, height: 35, }} 
               //   resizeMode={'stretch'} 
                    />
                  </TouchableOpacity> 
                </View>
                </View>
              </View>
            </View>

            )
            /* Camera View End*/
          :
          //Draw Editor 
          /* Sketch View */
            this.state.example === 1
              && this.state.photoPath != null
              ?
              (<Container style={{ flex: 1, backgroundColor: '#fff' }}>

                <RNSketchCanvas
                  localSourceImage={{ filename: this.state.photoPath, directory: null, mode: 'AspectFit' }}
                  containerStyle={{ backgroundColor: '#000', width: wp('100%'), height: hp('100%') }}
                  canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                  onStrokeEnd={data => { }}
                  strokeComponent={color => (
                    <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                  )}
                  strokeSelectedComponent={(color, index, changed) => {
                    return (
                      <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                    )
                  }}
                  strokeWidthComponent={(w) => {
                    return (<View style={styles.strokeWidthButton}>
                      <View style={{ backgroundColor: 'white', marginHorizontal: 2.5, width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2 }} />
                    </View>
                    )
                  }}
                  defaultStrokeIndex={0}
                  defaultStrokeWidth={5}
                  undoComponent={<View style={styles.functionButton}><Text style={{ color: '#222' }}>Undo</Text></View>}
                  clearComponent={<View style={styles.functionButton}><Text style={{ color: '#222' }}>Clear</Text></View>}
                  saveComponent={<View style={styles.functionButton}><Text style={{ color: '#222' }}>Done</Text></View>}
                  savePreference={() => { return { folder: 'Been', filename: String(Math.ceil(Math.random() * 100000000)), transparent: false, imageType: 'png' } }}
                  onSketchSaved={(success, path) => {
                    if (this.state.imageSelectedIndex >= 0) {
                      let imagesChangedPath = this.state.imagesSelected
                      imagesChangedPath[this.state.imageSelectedIndex] = { ...imagesChangedPath[this.state.imageSelectedIndex], uri: "file:///" + path }
                      this.setState({ imagesSelected: imagesChangedPath })
                    }
                    this.setState({ photoPath1: "file:///" + path, screenShot: path, example: null }
                    )
                  }}
                  onPathsChange={(pathsCount) => { console.log('pathsCount', pathsCount) }}
                />
                
              </Container>) 
              /* Sketch View End */
              :
              //Text Editor
              /* Text Editing View */
              this.state.example === 2
                && this.state.photoPath != null
                ?
                ( 
                  <View style={{ width: wp('100%'),backgroundColor:'#000', height: hp('100%'), }}>
                  <View style={{  Width: wp('100%'), flexDirection: 'row', marginTop: hp(4),
                   }}>
                    <TouchableOpacity onPress={()=>{
                        this.setState({example:null})                      
                     }}
                     background={
                       TouchableOpacity.Ripple('grey',true)
                       //TouchableOpacity.SelectableBackground(20)
                      }
                     
                    >
                    <View style={{ width: wp('20%'), }} >
                    <Text style={{textAlign:'left',color:'#FFF',textAlign:'center'}}>
                      Cancel
                    </Text>
                    </View>
                    </TouchableOpacity>
                    <View style={{ width: wp('60%'), }} />
                    {/* <View style={{backgroundColor:'plum',Width: wp('50%'),}}> */}
                     
                    <TouchableOpacity onPress={()=>{
                        this.doneInput()                      
                     }}
                     background={TouchableOpacity.Ripple('grey',true)}
                    >
                     <View style={{ width: wp('20%'), }} >
                    {/* {this.state.textInputColorEdit != '' ?
                      <Text onPress={() => this.textInputColorShot()} style={
                      // styles.doneText
                      {textAlign: 'center', color: '#FFF',fontSize: 14,}
                      }>Done 
                      </Text>
                      : */}
                      <Text style={{
                        textAlign: 'center',  color: '#FFF', fontSize: 14,}}>
                          Done   
                      </Text>
                      {/* } */}
                      </View>
                      </TouchableOpacity>
                     {/* </View> */}
                  </View>
                  

                  <View style={{ width: '100%', height: hp('100%'), }}>
                    {/* <ViewShot ref="viewShot1" > */}
                      <ImageBackground
                        source={{ uri: state.sourceImg }}
                        style={{ width: '100%', height: '100%', }}
                  //      resizeMode='contain' 
                         >
                        <TextInput
                          style={{ fontSize: 22, width: '100%', height: '100%', textAlign: 'center', alignItems: 'center', color: this.state.textInputFontColor, 
                             backgroundColor: this.state.isfocus ? '#00000080' : '#00000000' }}
                          onChangeText={text1 => this.ss(text1)}
                          value={this.state.text1}
                          multiline={true}
                          autoFocus={true}
                          onFocus={this.onFocusMethod}
                          onSubmitEditing={() => { this.keyboardDismiss() }}
                          placeholder={''}
                          editable={this.state.textInputColorEdit}
                          selectionColor={'transparent'}
                          placeholderTintColor={'transparent'}
                          autoCorrect={false}
                          
                          underlineColorAndroid='transparent'
                        />
                      </ImageBackground>
                    {/* </ViewShot> */}
                  </View>

                  <View style={styles.textColorPicker1}>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#f00' }]}>
                      <TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#f00', })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#0f0' }]}>
                      <TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#0f0',  })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#00f' }]}>
                      <TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#00f', })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#ff0' }]}>
                      <TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#ff0', })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#f0f' }]}>
                      <TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#f0f', })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#000', borderColor: '#fff' }]}>
                      <TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#000' })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#0ff' }]}>
                      <TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#0ff' })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#345beb' }]}><TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#345beb' })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#59206e' }]}><TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#59206e' })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#085709' }]}><TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#085709' })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#f0f7ff' }]}><TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#f0f7ff' })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#bfff00' }]}><TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#bfff00' })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>
                    <View style={[styles.textInputFontColor, { backgroundColor: '#8b8c87' }]}><TouchableOpacity onPress={() => this.setState({ textInputFontColor: '#8b8c87' })} style={{ width: '100%', height: '100%' }} ></TouchableOpacity>
                    </View>

                  </View>
                </View>
                )
                /* Text Editing View End */
                :

                /*  Main Image View */
                
                (<Container style={{ width: wp('100%'), height: hp('100%') }}>
                  <View style={{ width: wp('100%'), height: hp('88%'), backgroundColor: '#000' }}>
                    <View style={{ backgroundColor: '#000', }}>
                      
                      {this.state.editStickerDone == 1 ?
                        (<TouchableOpacity onPress={() => this.setState({ editStickerDone: '', hashtagEditable: false, textinput: false })}>
                          <View style={{ borderWidth: 1, borderColor: '#fff', width: wp('20%'), height: hp('4%'), borderRadius: 10, marginTop: hp('1.2%') }}>
                            <Text style={{ textAlign: 'center', color: '#FFF' }}>Done</Text>
                          </View>
                        </TouchableOpacity>) :
                        (
                          <View style={{ flexDirection: 'row', width: wp('100%'), }}>
                            <View style={{ width: wp('20%'), }}>
                              <TouchableOpacity onPress={() => this.setState({ example: null, photoPath: null,text1:'',textInputFontColor:'#fff' })}>
                                <ImageBackground style={{ width: 15, height: 15, margin: 10 }} source={require('../../Assets/Images/close_white.png')}>
                                </ImageBackground></TouchableOpacity>
                            </View>
                            <View style={{ marginLeft: '50%' }}>
                              <TouchableOpacity onPress={() => this.setState({ example: 2 })} >
                                <ImageBackground style={{ width: 20, height: 17, margin: 10, }} source={require('../../Assets/Images/text.png')}></ImageBackground>
                              </TouchableOpacity>
                            </View>
                            <View>
                              <TouchableOpacity onPress={() => this.setState({ photoPath: this.state.screenShot, example: 1, })}>
                                <ImageBackground style={{ width: 17, height: 17, margin: 10, marginLeft: 15 }} source={require('../../Assets/Images/edit.png')}></ImageBackground>
                              </TouchableOpacity>
                            </View>
                            <View>
                              <TouchableOpacity onPress={() => this.open()}>
                                <Image style={{ width: 20, height: 20, margin: 10, }} source={require('../../Assets/Images/sticker.png')} />
                              </TouchableOpacity>
                            </View>
                          </View>)
                      }
                    </View>

                    <View style={{ 
                      height: hp('100%'),width: wp('100%'),overflow:'hidden' }}>
                      <ViewShot ref="viewShot" >
                        <ImageBackground
                          style={{ width: '100%', height: '100%' }}
                          source={{ uri: this.state.photoPath1 }}
                       //   resizeMode={'cover'}
                          blurRadius={100}
                        >
                          
                          <MainImage
                            // ref={ref=>this.mainImage=ref}
                            {...this.props}
                            luri = {this.state.photoPath1}
                          />
                          
                         
                        <View style={{top:0,left:0,bottom:0,right:0,position:'absolute',
                          alignSelf:'center',}}>
                            {this.state.sticker != '' ? this.renderDraggable() : null}
                            {/* <Text style={{fontSize:20,color:'black',textAlign:'center'}}>asdasd</Text> */}
                        </View>

                      {this.state.text1 !='' && (
                        <View style={{top:0,left:0,bottom:0,right:0,position:'absolute',
                        justifyContent:'center',alignItems:'center'}}>
                          <UserText userText={this.state.text1} 
                           fontcolor = {this.state.textInputFontColor} 
                            editText = {()=>this.editTextAni()}
                          />
                      </View>
                      )}
                        
                         
                        </ImageBackground>
                      </ViewShot>
                    </View>
                  </View>

                  {/* sticker modal section*/}
                  <Modal style={[styles.modal2]} backdrop={false}
                    position={"bottom"} ref={"modal2"}>
                      <View style={{flex:1,backgroundColor:'green'}}>
                      <StatusBar 
                        // backgroundColor="rgba(0,0,0,1)"  
                        // barStyle="light-content"
                        hidden
                      />

                        <View style={{ height: hp('20%'),width:wp('80%'), justifyContent: 'center',alignSelf:'center',backgroundColor:'red' }}>
                          <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>Visit Check-In</Text>
                          <TouchableOpacity onPress={this.valuPass.bind(this, data[0])}>
                            <Image source={data[0].image} style={{ width: '100%', height: 70,resizeMode:'cover' }}
                           //   resizeMode={'stretch'} 
                              />
                          </TouchableOpacity>
                        </View>
                          
                        {/* second row  */}
                        <View style={{ height: 200,width:wp('100%'), flexDirection: 'row', justifyContent:'space-between',alignItems:'center',alignContent:'center' }}>
                          <View style={{ width: wp('5%') }} />

                            <Pressable onPress={this.valuPass.bind(this, data[1])} style={{ width: wp('30%'),height:100 }}>
                              <Image source={data[1].image} style={{ alignSelf: 'stretch', flex: 1, resizeMode: 'cover', width: 'auto' }} />
                            </Pressable>

                            <Pressable onPress={this.valuPass.bind(this, data[2])} style={{ width: wp('30%'),height:100 }}>
                              <Image source={data[2].image} style={{ alignSelf: 'stretch', flex: 1, resizeMode: 'cover', width: 'auto'}}/>
                            </Pressable>

                            <Pressable onPress={this.valuPass.bind(this, data[3])} style={{ width: wp('30%'),height:100 }}>
                              <Image source={data[3].image} style={{ alignSelf: 'stretch', flex: 1, resizeMode: 'cover', width: 'auto' }}/>
                            </Pressable>
                          <View style={{ width: wp('5%') }} />
                        </View>

                        {/* third row */}
                        <View style={{ height: 200,width:wp('100%'), flexDirection: 'row', justifyContent:'space-between',alignItems:'center',alignContent:'center' }}>
                          <View style={{ width: wp('5%') }} />

                          <Pressable onPress={this.valuPass.bind(this, data[4])} style={{ width: wp('30%'),height:100 }}>
                              <Image source={data[1].image} style={{ alignSelf: 'stretch', flex: 1, resizeMode: 'cover', width: 'auto' }} />
                            </Pressable>

                            <Pressable onPress={this.valuPass.bind(this, data[2])} style={{ width: wp('30%'),height:100 }}>
                              <Image source={data[4].image} style={{ alignSelf: 'stretch', flex: 1, resizeMode: 'cover', width: 'auto'}}/>
                            </Pressable>

                            <Pressable onPress={this.valuPass.bind(this, data[3])} style={{ width: wp('30%'),height:100 }}>
                              <Image source={data[4].image} style={{ alignSelf: 'stretch', flex: 1, resizeMode: 'cover', width: 'auto' }}/>
                            </Pressable>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[4])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[4].image} style={{ width: '100%', height: 130 }}
                           //  resizeMode={'stretch'}  
                                />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[5])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[5].image} style={{ width: '100%', height: 80 }}
                          //  resizeMode={'stretch'} 
                                />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[6])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[6].image} style={{ width: '100%', height: 80 }}
                      //     resizeMode={'stretch'} 
                                />
                            </View>
                          </TouchableOpacity>
                          <View style={{ width: wp('5%') }} />
                        </View>

                        {/* fourth row */}
                        <View style={{ height: 200,width:wp('100%'), flexDirection: 'row', justifyContent:'space-between',alignItems:'center',alignContent:'center' }}>
                          <View style={{ width: wp('5%') }} />

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[7])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[7].image} style={{ width: '100%', height: 60 }}
                         //    resizeMode={'stretch'}  
                                />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[8])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[8].image} style={{ width: '100%', height: 60 }}
                          //   resizeMode={'stretch'}  
                                />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[9])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[9].image} style={{ width: '100%', height: 80 }}
                         //    resizeMode={'stretch'} 
                                />
                            </View>
                          </TouchableOpacity>

                          <View style={{ width: wp('5%') }} />
                        </View>

                        {/* fifth row */}
                        <View style={{ height: 200,width:wp('100%'), flexDirection: 'row', justifyContent:'space-between',alignItems:'center',alignContent:'center' }}>
                          <View style={{ width: wp('5%') }} />

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[10])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[10].image} style={{ width: '100%', height: 80 }}
                        //   resizeMode={'stretch'} 
                                 />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[11])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[11].image} style={{ width: '100%', height: 130 }}
                      //   resizeMode={'stretch'}  
                                />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[12])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[12].image} style={{ width: '100%', height: 60 }}
                     //     resizeMode={'stretch'}  
                                />
                            </View>
                          </TouchableOpacity>

                          <View style={{ width: wp('5%') }} />
                        </View>

                        {/* sixth row */}
                        <View style={{ height: hp('10%'), flexDirection: 'row',}}>
                          <View style={{ width: wp('5%') }} />

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[13])}>
                            <View style={{ width: wp('30%'), justifyContent: 'center' }}>
                              <Image source={data[13].image} style={{ width: '100%', height: 50 }}
                        //   resizeMode={'stretch'} 
                                />
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.valuPass.bind(this, data[14])}>
                            {this.commonDays()}
                          </TouchableOpacity>

                          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={()=>this.valuPass({id:16})}>
                           
                             {this.fullDateCommon()}
                            
                          </TouchableOpacity>

                        </View>

                      <TouchableHighlight style={{bottom:10,position:'absolute',}}
                       underlayColor={'#000'} onPress={()=>this.modalClose()} >
                       <View style={{ height: hp('10%'),width:wp('100%'), justifyContent: 'center', }}>
                         <Text style={{ fontSize: 20, color: '#fff', textAlign: 'center' }}>Cancel</Text>
                       </View>
                      </TouchableHighlight> 


                    </View>
                  </Modal>

                  

                  <View style={{bottom:0,position:'absolute',width:wp('100%'),height:hp('10%'),justifyContent:'center',
                      backgroundColor: this.state.imagesSelected != null ? 
                        '#00000080' : '#00000000',}}>
                     
                     <View style={{flexDirection: 'row' }}>
                      <View style={{
                        width: wp('70%'),
                        justifyContent: 'center', alignItems: 'center', marginLeft: 5
                      }} >
                        <ScrollView horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 5, paddingEnd: 5 }}>
                          {this.state.imagesSelected ? this.state.imagesSelected.map((i,indx) => <View key={indx.toString()}>{this.renderImage(i)}</View>) : null}
                          </ScrollView>
                      </View>
                      <View style={{
                        width: wp('30%'), justifyContent: 'center',
                        overflow: 'hidden',alignItems:'center'
                      }}>
                        {this.state.isLoading ? 
                          <Spinner size="large" color="#fb0143" />
                         : <ImageBackground borderRadius={20} source={require('../../Assets/Images/storyButton.png')}
                            style={{ width: 100, height: 40, justifyContent: 'center',
                              }}>
                            <Text onPress={() => this.onImageLoad()} style={{ color: '#fff', textAlign: 'center', alignSelf: 'center' }} >
                              Make Story
                            </Text>
                          </ImageBackground>
                         }  
                        </View>
                      </View>
                  </View>

              </Container>)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputFontColor: { width: wp('6%'), height: hp('3.7%'), backgroundColor: '#f00', borderWidth: 1, borderRadius: 50, borderColor: '#000', margin: 5 },
  touchOpcity: { top: 8, bottom: 8, left: 8, right: 8 },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 20,
    height: 20,
    marginBottom: 25,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 12,
    alignItems: 'center',
    backgroundColor: 'red', 
    marginBottom: 10
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  functionButton1: {
    height: 30,
    width: 60,
    marginTop: '95%',
    backgroundColor: '#39579A',
    borderRadius: 5,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: 'transparent',
    
    alignSelf: 'stretch'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  doneText: { 
   textAlign: 'right', 
   color: '#222', 
   fontSize: 14, 
   },
   capture: {
    //flex: 0,
    //  backgroundColor: 'red',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  },

  page: {
    flex: 1,
    height: 300,
    elevation: 2,
    marginVertical: 8,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 2
  },
  modal2: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: "rgba(0,0,0,.7)",
    borderWidth: 0.5,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    borderColor: 'rgba(0,0,0,.5)',
    backgroundColor:'blue'
  },
  textColorPicker: { position: 'absolute', right: 0, top: 0, opacity: 0.5, height: Dimensions.get('window').height, width: wp(3.5), backgroundColor: 'transparent', justifyContent: 'center', marginRight: hp(3) },
  textColorPicker1: { 
    flexDirection: 'row', 
    width: wp('100%'), 
    height: hp('7%'), 
    marginTop: hp('2%'),
    bottom : 15,
    position:'absolute' 
  },
  btnModal: {
    backgroundColor: "transparent"
  },

  text: {
    color: "#fff",
    fontSize: 15
  },

  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff',
  },
  draggableContainer: {
    position: 'absolute',
    // backgroundColor:'yellow',
    top: hp(7),
    left: wp(13),
    width: wp('50%'),
    height: hp('8%'),
  },
  drag: {
    width: '100%',
    height: '100%',

  },
  wrapper: {
    paddingTop: 50,
    flex: 1,
  },

  dropZone: {
    height: 100,
    backgroundColor: '#2c3e50'
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff'
  },
  hashtagInput: {
    color: '#ef1b66',
    fontSize: 20,
    paddingTop:15,
    paddingBottom:15,
    paddingRight:15,
    paddingLeft:0,
    backgroundColor:'#fff',
    borderTopRightRadius:10,borderBottomRightRadius:10

  },
  hashText:{
    padding: 10,
    paddingRight: 0,
    color:'#ef1b66',
    fontSize : 22,
    justifyContent:'center',
    alignSelf:'center',
    backgroundColor:'#FFF',
    paddingTop:15,
    paddingBottom:15,borderTopLeftRadius:10,borderBottomLeftRadius:10
  }

});

AppRegistry.registerComponent('Camera', () => Camera);