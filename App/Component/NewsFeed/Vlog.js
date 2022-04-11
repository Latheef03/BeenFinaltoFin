import React, { Component } from 'react';
import {
    View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, ToastAndroid, StatusBar,
    TouchableWithoutFeedback,KeyboardAvoidingView,Keyboard,
    Platform,StatusBarIOS
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Button, Left, Right, Content, Spinner } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import ViewShot from "react-native-view-shot";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modalbox';
import Video from "react-native-video";
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'
var mImageSelectedIndex = 0;
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
import Common_Style from '../../Assets/Styles/Common_Style'
import common_styles from "../../Assets/Styles/Common_Style"
import styles from '../../styles/NewsFeedUploadStyle'
import { TextInput, HelperText } from 'react-native-paper';
import { HashTag } from '../Story/_sticker_compo';
import {deviceWidth as dw , deviceHeight as dh , getTime, getPicNameExt} from '../_utils/CommonUtils';
import VideoController from '../CustomComponent/VideoController';

export default class Vlog extends Component {

    static navigationOptions = {
        header: null,
    };

    state = {
        avatarSource: null,
        avatarSource1: null,
        avatarSource2: null,
        video_status: false,
        TagId: '',
        imagesSelected: null,
        location: '',
        country: '',
        description: '',
        fileName: '',
        isLoading: false,
        tagCount: 0,
        fileType: '',
        imagecolor: 0,
        id: '',
        locationEditable: true,
        isPlacesModal: false,
        screenShot: null,
        isLoading: false,
        isRecording: false,
        coords: '',
        checkedbox: false,
        sponsored: '',
        profileType: 0,
        /*For Video */
        paused : true,
        duration : 0.1,
        currentTime : 0,
        volume : 1.0,
        volumeMuted : false,
        showControl : false
    }

    gRef

    location = text => {
        this.setState({ location: text });
    };
    sponsored = text => {
        this.setState({ sponsored: text });
    }
    country = text => {
        this.setState({ country: text });
    };

    description = text => {
        this.setState({ description: text });
    };

    UNSAFE_componentWillMount() {
      // console.log('UNSAFE_componentWillMount hitted');
        this.imageManipulte()
    }

    componentWillUnmount(){
      clearTimeout(this.tapTimer);
      this.setState({
        paused : true
      })
    }


    componentDidMount = async () => {

        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.onLoad();
               // const { navigation } = this.props;
                const Comments = this.props.route.params?.data ;
                if (Comments != undefined) {
                    this.setState({
                        TagId: Comments.tagId,
                        tagCount: Comments.tagCount
                    })
                }
            }
        );
        this.setState({
          profileType : await AsyncStorage.getItem('profileType')
        }) 
        // this.imageManipulte();
    }

    imageManipulte = () =>{
        debugger
        //const {navigation} = this.props;
        const prop = this.props.route.params?.imgProp || {};

        console.log('the propd imageManipulte hit',prop);

        if(prop == undefined && !prop.sImg){
          return false;
        }

        if (prop.e && prop.e.length > 0) {
          let URI = '',filename = ''
          // console.log('the prop',prop);
          if(Platform.OS == 'ios'){
            const fileURI = prop.e[0].node.image.uri;
            filename = prop.e[0].node.image.filename;
            const appleId = fileURI.substring(5, 41);
            const fileNameLength = filename.length;
            const ext = filename.substring(fileNameLength - 3);
            URI = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
          }else{
            URI = prop.e[0].node.image.uri
          }
          
          //console.log(VID_URI)
          // const img = prop.e[0]
          // console.log('the img',img);
          this.setState({
            image: 2,
            
            //avatarSource: prop.e[0].node.image.uri.replace('file:///', ''),
            imgSource : prop.e[0].node.image,
            avatarSource2: URI,
            filename : prop.e[0].node.image.filename,
            fileType: prop.e[0].node.type,
            imagesSelected: prop.e.map((i, index) => {
              return {
                uri: i.node.image.uri, width: i.node.image.width,
                height: i.node.image.height, mime: i.node.type,filter: 0, imageIndex: index
              };
            })
          });
        }
      }
      
    onLoad = async () => {
        var data = { userId: await AsyncStorage.getItem('userId') };
        const url = serviceUrl.been_url1 + '/UserProfile';
        return fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo" },
          body: JSON.stringify(data)
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log('user profile', responseJson)
            if (responseJson.status == "True") {
              this.setState({ profileType:responseJson.result[0].UserDetails[0].ProfileType })
            }
          })
          .catch((error) => {
            //toastMsg('danger',' Oops! something is wrong ,Please check your networks!! ' )
          });
    }

    getHashTags(inputText) {
      var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
      var matches = [];
      var match;
  
      while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
      }
  
      return matches;
    }

    save = async () => {
        debugger
        if (this.state.location == "") {
          toastMsg1('danger',"Drop the location here")
           // ToastAndroid.show("Drop the location here", ToastAndroid.LONG);
        }
        else if (this.state.country == "") {
          toastMsg1('danger', "Drop the Country here")
           // ToastAndroid.show("Drop the Country here", ToastAndroid.LONG);
        }
        else {
           // this.props.navigation.navigate('Newsfeed');
            this.setState({ isLoading: true });
            var id = await AsyncStorage.getItem("userId");
            console.log("this.state.avatarSource2", this.state.avatarSource2);
            const url = serviceUrl.been_url + "/NewsFeed"
            const data2 = new FormData();
            
            let files = getPicNameExt(this.state.imgSource.uri);
            const  blobName = files[0];
            const  blobType = files[1];
            data2.append("NewsFeedPost",
                {
                    uri: this.state.imgSource.uri,
                    // name: this.state.avatarSource2.fileName == undefined || "" ? "video.mp4" : this.state.avatarSource2.fileName,
                    name: Platform.OS == 'ios' ? this.state.imgSource.filename : blobName+'.'+blobType,
                    // type: this.state.avatarSource2.type == undefined || "" ? "video/mp4" : this.state.imageResponseData.type
                    type: this.state.fileType
                }
              );
            data2.append("SponsoredBy", this.state.sponsored == "" ? null : this.state.sponsored);
            data2.append("TagsId", this.state.TagId == "" ? null : this.state.TagId.toString());
            data2.append("Location", this.state.location == "" ? null : this.state.location);
            data2.append("Country", this.state.country == "" ? null : this.state.country);
            data2.append("Description", this.state.description == "" ? null : 
               JSON.stringify([{desc:this.state.description}]) );
            data2.append("coords", this.state.coords == "" ? null : this.state.coords);
            data2.append("UserId", id == "" ? null : id);
            data2.append("data_id", this.state.data_id);
            data2.append("place_id", this.state.place_id);
            data2.append("formattedAddress", this.state.f_address);
            const hashtag = this.getHashTags(this.state.description)
            hashtag.length > 0 ? 
              data2.append("HashTag", hashtag.join()) 
              : null;
            // console.log('the ht',hashtag);
            console.log('asdsada',data2);
            // this.setState({ isLoading: false });
            fetch(url, {
                method: 'POST',
                headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo',
                'Content-Type': 'multipart/form-data',
                },
                body: data2,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                    console.log('vlogggg',responseJson);
                     this.setState({ isLoading: false });
                    if (responseJson.status == "True") {
                        this.props.navigation.navigate('MyPager');
                    } else {
                        this.setState({ isLoading: false });
                        toastMsg1('danger',responseJson.message)
                        //toastMsg('danger', responseJson.message)
                    }
                }).catch((error)=> {
                    this.setState({ isLoading: false });
                    console.log("Line nuber 176", error);
                });
        }
    }

    addTag() {
      const {TagId} = this.state;
        var data = {
            screeName: "video",
            tags : TagId
        }
        this.props.navigation.navigate('AddTag',{data:data})
    }


    imageNull() {
        this.props.naviagtion.naviagte('NewssfeedUpload')
    }

    _onfocus = () => {
        this.setState({
            locationEditable: false,
            isPlacesModal: true
        })
    }

   _singleTap = () =>{
    this.setState({showControl:true});
    Keyboard.dismiss()
    clearTimeout(this.tapTimer);
    this.tapTimer = setTimeout(()=>{
      this.setState({showControl:false});
    },5 * 1000)
   }
    /*Video controller methods */
    onloadVideo = ({duration}) => this.setState({ duration });
    onprogressVideo = ({currentTime}) => this.setState({ currentTime })
    getSliderValue = e => this.player.seek(e * this.state.duration);
    controlChanges = () => this.setState({ paused : !this.state.paused })

    VolumeControl = muted => {
      this.setState({
        volume : muted ? 0.0 : 1.0,
        volumeMuted:muted})
     }

    onVideoEnd = () =>{
      this.player.seek(0 * this.state.duration);
      this.setState({paused:true,currentTime:0})
    }

    videoError = e =>{
      console.log('thee video error',e)
    }

    method1() {
        this.setState({
            image: 1
        })
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
          location: locName, country: counName, isPlacesModal: false,
          coords: JSON.stringify(geom), data_id: data_id, place_id: place_id,
          f_address: data ? data.structured_formatting.main_text + ', ' +
            data.structured_formatting.secondary_text : null
        })
      }

    onReadMoreClose = (isModal) => {
        // alert('as')
        this.setState({
            isPlacesModal: false,
            // locationEditable : true,
        })
    };

    render() {
      const {duration,currentTime,paused,volumeMuted,volume,showControl} =this.state
      // console.log('the url avatar',paused);
     return (
      <KeyboardAvoidingView
       behavior={Platform.OS == "ios" ? "padding" : "height"}
       style={{flex: 1,backgroundColor:'#fff'}}
    >
         
         <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                {/* Default Header */}
         {this.state.avatarSource2 == null && this.state.image == null ?
               null :
         <View style={{ backgroundColor:'#fff', marginTop:StatusBar.currentHeight, height: dh * 0.05, flexDirection: 'row', justifyContent: 'center',
         width:dw,marginBottom:10}}>
           
            <TouchableOpacity hitSlop={styles.touchOpcity} onPress={() => this.props.navigation.goBack()}>
            <View style={{width:dw * .15,height:'100%',justifyContent:'center',}}>
              <Image source={require('../../Assets/Images/backArrow.png')} 
                style={{ width: 25, height: 25, marginLeft: 8 }} 
               // resizeMode={'center'}
                />
              </View>
            </TouchableOpacity>
           
            <View style={{width:dw * .70,height:'100%',justifyContent:'center',}}>
           <Text style={[Common_Style.headerText, { marginTop: 0 }]}>Vlog</Text>
           </View>
             
           <View style={{width:dw * .15,height:'100%',justifyContent:'center',}}>  
            {this.state.isLoading ?
              <Spinner size="small" color="#fb0143" />
            :
            <Text onPress={() => this.save()} style={{ color: '#eb3415', marginLeft:12,fontFamily: Common_Color.fontBold }}>Fly it</Text>
            //old color => #5db2f0
            }
           </View>
            
         </View>
        }


      <ScrollView
        keyboardShouldPersistTaps='always'
        style={{height:'90%',}}
        scrollEnabled = { true }
        >
        {this.state.avatarSource2 != null && this.state.image == 2 ?
         
          <View style={{ lexDirection: 'column',height:'90%'}}>
            <View style={{flexDirection: 'row' }}>
              <GooglePlacesAutocomplete
                placeholder='Location'
                placeholderTextColor='#000'
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                keyboardAppearance={'light'}
                listViewDisplayed={false}
                fetchDetails={true}
                styles={searchInputStyle}
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
                enablePoweredByContainer={false}
              />

              {/* <TouchableOpacity onPress={() => this._onfocus()}>
                <Image style={{ height: 20, width: 20, marginTop: 15 }}
                  source={require('../../Assets/Images/location1.png')} />
              </TouchableOpacity> */}
            </View>

            <View >
              <TextInput
                label="Country"
                mode="outlined"
                editable = {false}
                value={this.state.country}
                autoCorrect={false}
                ////  keyboardType="visible-password"
                onChangeText={this.country}
                style={[common_styles.textInputSignUp, { width: '97%' }]}
                selectionColor={'#f0275d'}
                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 6, } }} />
            </View>

          <View style={{  width: '100%',flexDirection: 'row',height:'8%' }}>
            {this.state.profileType != 0 ?
             (<View style={{width:'50%',justifyContent: 'center',marginLeft:5,alignItems:'flex-start',}}>
              <View style={{flexDirection:'row'}} >
                <TouchableOpacity onPress={() => this.setState({ checkedbox: !this.state.checkedbox })}>
                  <Image style={{ marginTop: 8, width: 13, height: 13, marginLeft: 5 }} 
                    source={!this.state.checkedbox?
                     require('../../Assets/Images/ic_checkbox.png')
                      :
                     require('../../Assets/Images/ic_checkbox_selected.png')
                   } />
                </TouchableOpacity> 

                <Text onPress={() => this.setState({ checkedbox: !this.state.checkedbox })}
                  style={{ 
                    // fontFamily: 'ProximaNova-Regular ',
                    fontSize: 13, marginLeft: 8, color: '#2c2d2d',marginTop:5 }}>
                    Sponsored
                </Text>
             </View>
           </View>) : 
           <View style={{width:'50%'}} />
          }

          <View style={{width:'48%', justifyContent: 'center',alignItems:'flex-end',marginTop:8}}>
            <Text onPress={() => this.addTag()} style={{ fontSize: 12, textAlign: 'right',
              color: '#0e8de8', marginRight: 12, fontFamily: Common_Color.fontBold,
              marginRight:8 }}>
              {this.state.tagCount > 0 ? this.state.tagCount :null} Add Tag
           </Text>
         </View> 
       </View>

       {this.state.profileType != 0 ?
         this.state.checkedbox === true ?
        <View style={{justifyContent:'center'}}>
          {/* <TextInput
            placeholder='Sponsored By'
            value={this.state.sponsored}
            onChangeText={this.sponsored}
            style={styles.locationText} /> */}
            <TextInput
              label="Sponsored By"
              mode="outlined"
              value={this.state.sponsored}
              onChangeText={this.sponsored}
              autoCorrect={false}
              ////  keyboardType="visible-password"
              style={[common_styles.textInputSignUp, { width: '97%', marginTop: 2, }]}
              selectionColor={'#f0275d'}
              theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

        </View> : null
       : null
       }
    
       <View style={{ width: dw * .96, height: hp('50%'),margin: 10,borderRadius:12,overflow:'hidden',
        flexDirection:'column', }}>
      
        <TouchableWithoutFeedback onPress={()=>this._singleTap()}>
         <Video
          ref={ref => {this.player = ref;}}
          resizeMode='cover'
          controls={true}
          onEnd = {this.onVideoEnd}
          onError = {this.videoError}
          source={{ uri: this.state.avatarSource2
            //'http://51.15.201.39/webp/uploads/NewsFeedStories/1614341659053-video.mp4'
            //this.state.avatarSource2 
          }} // // Can be a URL or a local file.
          repeat={true}
          volume={volume}  
          paused = {paused}
          onLoad = {this.onloadVideo}
          onProgress = {this.onprogressVideo}
          // muted = {volume}
          style={{ width: wp("100%"),height: hp('50%'), borderRadius:12,
           }}
         />
         </TouchableWithoutFeedback>
        
         <VideoController 
           showControl = {false}
           //showControl
           pause = {paused}
           changeControl = {this.controlChanges}
           totalDuration = {getTime(duration)}
           currentVidTime = {getTime(currentTime)}
           sliderValue = {currentTime / duration}
           sliderMovingValue = {this.getSliderValue}
           volumeControl = {this.VolumeControl}
           volume = {volumeMuted}
         />

        

       </View>
       

      <View style={{marginTop:5,marginBottom:40}}>
       <TextInput
          label="Description"
          mode="outlined"
          value={this.state.description}
          maxLength = {500}
          numberOfLines = {2}
          autoCorrect={false}
          ////  keyboardType="visible-password"
          onChangeText={text => this.description(text)}
          multiline={true}
          // error={this.state.is_Valid_mail}
          style={{ fontSize: profilename.FontSize, fontFamily: profilename.Font, backgroundColor: '#fff', width: wp('97%'), marginTop: 2,
          margin:6}}
          selectionColor={'#f0275d'}
          theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 14, paddingLeft: 5 } }}
        /> 
      </View>
    </View>
  
    :
    <Image style={styles.imageBinding}
      source={this.state.avatarSource} />
   }
    </ScrollView>
   
   
  </KeyboardAvoidingView >
  
  )}
}

const searchInputStyle = {
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
    fontSize: profilename.FontSize, 
    // fontFamily: profilename.Font,
    color: "#4c4c4c",

  },
  predefinedPlacesDescription: {
    color: '#1faadb'
  },
  textInput: {
    // backgroundColor:'#c1c1c1',
    height: 23,
    fontSize: profilename.FontSize, 
    // fontFamily: profilename.Font,
    paddingLeft: 0,

  }
}



