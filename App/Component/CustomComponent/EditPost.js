import React, { Component } from 'react';
import {
    View, Text, ImageBackground, Image, ScrollView, StyleSheet,
 TouchableOpacity, ToastAndroid, StatusBar,StatusBarIOS
} from 'react-native';
import { Footer, FooterTab, Button, Left, Right, Content, Spinner, Header } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modalbox';
var mImageSelectedIndex = 0;
import styles from '../../styles/NewsFeedUploadStyle'
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import { TextInput, HelperText } from 'react-native-paper';
import common_styles from "../../Assets/Styles/Common_Style"
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style'
import {invalidText,getHashTags,deviceWidth as dw,deviceHeight as dh} from '../_utils/CommonUtils'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EditPost extends Component {

    static navigationOptions = {
        header: null,
    };

    state = {
        TagId: "",
        newsFeedImg: '',
        location: '',
        country: '',
        description: '',
        id: '',
        locationEditable: true,
        isPlacesModal: false,
        coords: '',
        postId: '',
        tagCount: 0,
        //Video
        currentTime: 0,
        duration: 0,
        isLoading: false,
        userPlay: false,
        paused: false,
        volume: 0,
        profileType : 0,
        playerState: PLAYER_STATES.PLAYING,
        sponsored : '',
        checkedbox : false,

    }

    componentDidMount = () => {
        this.receiveEditProps()
        // console.log('the paaras',this.props);
        // const Comments = this.props.route?.params?.data || {}; 
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                const Comments = this.props.route?.params?.datas || {}; 
                console.log('the tagsss commenr',Comments);
                if (Comments != undefined) {
                    this.setState({
                        TagId: Comments.tagId,
                        tagCount: Comments.tagCount
                    })
                }
            }
        );
    };

    receiveEditProps = async() =>{
        const { navigation } = this.props;
        const datas = this.props.route?.params?.data || {};
        // console.log('the paaras',navigation);
        const getType = await AsyncStorage.getItem('profileType')
        const pType = parseInt(getType);
        // const localP = await AsyncStorage.getItem('localProfile');
        // console.log('the edit screen',datas,'--pt',pType);
        if (datas != undefined) {
            const ImgArr = datas.Image.split(',');
            console.log('edit post img',ImgArr);
           let feedImagesKeys = []
           ImgArr.length > 0 && ImgArr.map((d,ind)=>{
            feedImagesKeys.push({uri:d,imgIndex:ind});
           });
           
          const feedImages = feedImagesKeys.length > 0 && feedImagesKeys.map(d=>{
                d.desc = ''
                datas.Desc.length > 0 && datas.Desc.map(m=>{
                    if(d.uri.indexOf(".mp4") != -1){
                        d.desc = m.desc
                    }
                    
                    if(m.imgId==d.imgIndex){
                        d.desc = m.desc
                    };
                    return m;
                });
              return d;
            });

            const tags = invalidText(datas.tagid) ? null : datas.tagid.split(',');
            const tagCount = tags !== null ? tags.length : 0
// console.log('the tags',tags,'and len',tagCount)
            this.setState({
                postId: datas.PostId,
                newsFeedImg: feedImages ? feedImages : [],
                country: datas.Country,
                location: datas.Location,
                description: datas.Desc,
                profileType : pType,
                sponsored : invalidText(datas.SponsoredBy) 
                  ? null : datas.SponsoredBy ,
                checkedbox : invalidText(datas.SponsoredBy) 
                  ? false : true,
                coords : datas.coords,
                TagId : tags,
                tagCount: tagCount,
                // f_address : datas.formattedAddress,

            })
        }
    }

    onSeek = seek => {
        //Handler for change in seekbar
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        //Handler for Video Pause
        if (this.state.userPlay == true) {
            this.setState({ paused: !this.state.paused, userPlay: false, playerState, });
        } else { this.setState({ paused: !this.state.paused, userPlay: true, playerState, }); }
    };


    muteVolume = playerState => {
        //Handler for Video Pause
        if (this.state.volume == 10) {
            this.setState({ volume: 0, playerState, });
        } else { this.setState({ volume: 10, playerState, }); }
    };

    onReplay = () => {
        //Handler for Replay
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };

    onProgress = data => {
        const { isLoading, playerState } = this.state;
        // Video Player will continue progress even if the video already ended
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({ currentTime: data.currentTime });
        }
    };
    onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });
    onError = () => alert('Oh! ', error);
    exitFullScreen = () => { alert('Exit full screen'); };
    enterFullScreen = () => { };
    onSeeking = currentTime => this.setState({ currentTime });

    location = text => {
        this.setState({ location: text });
    };

    country = text => {
        this.setState({ country: text });
    };
    sponsored = text => {
        this.setState({ sponsored: text });
    }

    description = (text,e) => {
        const { newsFeedImg,description } = this.state;
        const index = newsFeedImg.findIndex(d => d.imgIndex == e.imgIndex);
        if (text && text.length >= 500) {
            ToastAndroid.showWithGravityAndOffset(
                `A maximum of 500 characters is allowed`,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
        e.desc = text;
        newsFeedImg[index] = e
        this.setState({newsFeedImg})
    };

    addTag() {
        const {TagId} = this.state;
        var data = {
            screeName: "editPost",
            tags: TagId
        }
        console.log('the add ta',data);
        this.props.navigation.navigate('AddTag', { data: data })
    }

    renderImageWOFilters(image) {
        console.log('aaaa',image);
        console.log('aaaa',image.uri.indexOf(".mp4"));
        const {paused,volume} = this.state;
        return (
    
          <View style={{marginBottom:20}}>
            {image.uri.indexOf(".mp4") != -1 ? 
            <View style={{marginTop:5}}>
           <Video
             resizeMode="contain"
             source={{ uri: serviceUrl.newsFeddStoriesUrl + image.uri }}
             paused={paused}
             repeat={false}
             controls={false}
             resizeMode='cover'
             style={[styles.imageBinding] }
             volume={volume} 
             />
            
            </View>
          
            :
             <ImageBackground
                style={styles.imageBinding}
                borderRadius={12} source={{ uri: serviceUrl.newsFeddStoriesUrl + image.uri }}
                resizeMode={'cover'}
             />
            }  
            <TextInput
              label="Description"
              mode="outlined"
              value={image.desc}
              maxLength={500}
              numberOfLines={2}
              autoCorrect={false}
              
              onChangeText={text => this.description(text,image)}
              multiline={true}
              //error={this.state.is_Valid_mail}
              style={{
                fontSize: profilename.FontSize, fontFamily: profilename.Font, backgroundColor: '#fff', width: dw * 0.97, marginTop: 2,
                margin: 6
              }}
             
              selectionColor={'#f0275d'}
              theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 14, paddingLeft: 5 } }}
            />
  
          </View>
    
        );
      }
    

    _onfocus = () => { this.setState({ locationEditable: false, isPlacesModal: true }) }

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

    

    editPost = async () => {
        const {sponsored,newsFeedImg,TagId,postId,country,
             location,coords,data_id,place_id,f_address
          } = this.state;
        if (this.state.location == "") {
            toastMsg1('danger', "Drop the location here")
            //ToastAndroid.show("Drop the location here", ToastAndroid.LONG);
          }
          else if (this.state.country == "") {
            toastMsg1('danger',"Drop the Country here")
            //ToastAndroid.show("Drop the Country here", ToastAndroid.LONG);
          }
        var id = await AsyncStorage.getItem("userId");
        var data = {
            userId: id,
            postId: postId ,
            Country: country ,
            Location: location ,
            ...!invalidText(TagId) && { TagsId: TagId.join() },
            SponsoredBy: sponsored == '' ? 'null' : sponsored,
            ...!invalidText(data_id) && { data_id : data_id },
            ...!invalidText(place_id) && { place_id :place_id  },
            ...!invalidText(f_address) && { formattedAddress :f_address  },
            ...!invalidText(coords) && { coords :coords  }
        };
        let Description = [], Hashtags = []; 
        newsFeedImg.map(d=>{
            Description = [...Description,{
                imgId:d.imgIndex,
                desc:d.desc
            }];
            
         let ht = getHashTags(d.desc);
         ht.length > 0 ? Hashtags = [...Hashtags,...ht] : null
        });
        data.Description = Description;
        data.HashTag = Hashtags.join()
        console.log('the data',data);

        const url = serviceUrl.been_url1 + "/EditFeedDetails";
        
        this.setState({isLoading : true })

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('the edit resp',responseJson);
                if (responseJson.status == "True") {
                    //toastMsg("succes","Details updated successfully");
                    this.setState({ isLoading: false })
                    this.props.navigation.goBack();
                }
                else {
                    this.setState({ isLoading: false })
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch((error)=> {
                this.setState({ isLoading: false })
                console.log('the err',error);
                //toastMsg('danger', 'Sorry..something network error.Please try again.')
            });
    }


    render() {
        const datas = this.props.route?.params?.data || {}
        const feedLocation = datas.Location ? datas.Location :'';
        
        return (
            <View style={{flex:1,backgroundColor:'#fff', marginTop:Platform.OS==='ios' ? StatusBar.currentHeight :StatusBar.currentHeight}}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />

                {/* Header section */}
                <View style={{ height: 45, flexDirection: 'row', width: dw, }}>
                 
                  <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <View style={{ width: dw * 0.1,height: 45,justifyContent:'center' }}>
                       <Image source={require('../../Assets/Images/close_black.png')}
                         style={{ width: 20, height: 20,alignSelf:'center'}} 
                         resizeMode={'center'}
                         />
                    </View>
                  </TouchableOpacity>
                    
                    <View style={{ width: dw * 0.8, }}>
                        <Text style={[Common_Style.headerText,]}>Edit Post</Text>
                    </View>
                    
                    <TouchableOpacity style={{ width: '100%' }} onPress={() => this.editPost()}>
                      <View style={{ width: dw * 0.1,height: 45,justifyContent:'center' }}>
                       {this.state.isLoading ?
                        <Spinner size="small" color="#fb0143" />
                        :
                          <Image style={{ width: 20, height: 20,alignSelf:'center'}} 
                              source={require('../../Assets/Images/check.png')} 
                              resizeMode={'center'}
                          />
                       }
                      </View>
                    </TouchableOpacity>
                </View>

               {/* Body Section */}
                    <ScrollView
                        keyboardShouldPersistTaps='always'
                        style={{ height: '100%'}}>
                        <View style={{ flexDirection: 'column', }}>
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

                                    getDefaultValue={() => feedLocation}

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
                                    autoCorrect={false}
                                    
                                    editable={false}
                                    value={this.state.country}
                                    onChangeText={this.country}
                                    style={[common_styles.textInputSignUp, { width: '97%' }]}
                                    // style={{ width: dw('96%'), height: 40, marginLeft: 8, backgroundColor: '#FFF', fontSize: profilename.FontSize, fontFamily: profilename.Font, }}
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
                                                style={{ //fontFamily: 'ProximaNova-Regular ',
                                                 fontSize: 13, marginLeft: 8, color: '#2c2d2d', marginTop: 5 }}>
                                                Sponsored
                                            </Text>
                                        </View>
                                    </View>) :
                                    <View style={{ width: '50%' }} />
                                }

                                <View style={{ width: '48%', justifyContent: 'center', alignItems: 'flex-end', marginTop: 8,
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
                                    <View style={{justifyContent:'center' }}>
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
                                            autoCorrect={false}
                                            
                                            value={this.state.sponsored}
                                            onChangeText={this.sponsored}
                                            style={[common_styles.textInputSignUp, { width: '97%',marginTop:5, }]}
                                            selectionColor={'#f0275d'}
                                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                                    </View> : null
                                : null}

                            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}
                            >
                              {this.state.newsFeedImg ? this.state.newsFeedImg.map((i,index) => <View key={`id${index}`}>{this.renderImageWOFilters(i)}</View>) : null}
                                {/* {this.state.newsFeedImg.indexOf('.mp4') != -1 ?
                                    <View style={{ width: "90%", flex: 1, }}>
                                        <Video
                                            resizeMode="cover"
                                            source={{ uri: serviceUrl.newsFeddStoriesUrl + this.state.newsFeedImg }}
                                            paused={this.state.paused ? true : false}
                                            repeat={true}
                                            controls={true}
                                            resizeMode='cover'
                                            style={styles.imageBinding}
                                            volume={this.state.volume}>

                                        </Video>
                                    </View>
                                    :
                                    <ImageBackground style={[styles.imageBinding,{backgroundColor:'red'}]}
                                    borderRadius={12}
                                       resizeMode={'cover'}
                                        source={{ uri: serviceUrl.newsFeddStoriesUrl + this.state.newsFeedImg.split(',')[0] }} >
                                    </ImageBackground>} */}

                            </ScrollView>
                            {/* <View style={{ marginTop:8,}}>
                                <TextInput
                                    label="Description"
                                    mode="outlined"
                                    value={this.state.description}
                                    maxLength={500}
                                    numberOfLines={2}
                                    onChangeText={text => this.description(text)}
                                    multiline={true}
                                    // error={this.state.is_Valid_mail}
                                    style={{
                                        fontSize: profilename.FontSize, fontFamily: profilename.Font, backgroundColor: '#fff', width: dw('97%'), marginTop: 2,
                                        margin: 6
                                    }}
                                    // style={{ paddingLeft: 0, width: dw('96%'), height: dh(8), marginLeft: 8, backgroundColor: '#FFF', fontSize: profilename.FontSize, fontFamily: profilename.Font, }}
                                    selectionColor={'#f0275d'}
                                    theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 14, paddingLeft: 5 } }}
                                />
                            </View> */}

                            <View >

                                {/* <TextInput
                          label="Description"
                          mode="outlined"
                          value={this.state.description}
                          onChangeText={this.description}
                          multiline={true}
                          maxLength={500}
                          // error={this.state.is_Valid_mail}
                          style={{ paddingLeft: 0, width: '96%', marginLeft: 8, backgroundColor: '#FFF', marginTop: -5 }}
                          selectionColor={'#f0275d'}
                          theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', fontSize: 14, paddingLeft: 5 } }} /> */}
                            </View>
                        </View>
                    </ScrollView>
                

                {/* places modal */}
                <Modal style={styles.modal} position="bottom"
                    isOpen={this.state.isPlacesModal}
                    // swipeToClose = {false}
                    onClosed={() => this.onReadMoreClose(false)}
                    backdropColor='transparent'
                >
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        minLength={2} // minimum length of text to search
                        autoFocus={false}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                        listViewDisplayed={false}    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            // console.log(data, details);
                            this._handlePress(data, details);
                        }}
                        getDefaultValue={() => ''}
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20',
                            //our Key (Been) => AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20
                            //git key (Uber clone) => AIzaSyB1O8amubeMkw_7ok2jUhtVj9IkME9K8sc
                            language: 'en', // language of the results
                            types: '' // default: 'geocode' || ,cities
                        }}

                        styles={searchInputStyle}
                        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                        currentLocationLabel="Current location"
                        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={{
                            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                        }}
                        GooglePlacesSearchQuery={{
                            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                            rankby: 'distance,keyword,name', //distance
                            type: 'cafe' //cafe
                        }}
                        GooglePlacesDetailsQuery={{
                            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                            fields: 'formatted_address,name,geometry',
                        }}
                        filterReverseGeocodingByTypes={['country', 'locality',
                            'street_address', 'food', 'address',
                            'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'geometry']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        // predefinedPlaces={[homePlace, workPlace]}
                        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    />

                </Modal>
            </View >
        )
    }
}

const searchInputStyle = {
    textInputContainer: {
        width: '94%',
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: .7,
        borderColor: '#000',
        margin: 10,
        borderRadius: 10,
    },
    description: {
        fontWeight: 'bold',
        color: "#4c4c4c",

    },
    predefinedPlacesDescription: {
        color: '#1faadb'
    },
    textInput: {
        // backgroundColor:'#c1c1c1',
        height: 33,
        fontSize: 14,
        paddingLeft: 0,

    }
}


