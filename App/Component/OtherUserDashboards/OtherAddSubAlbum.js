import React, { Component } from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, ScrollView,
    ImageBackground, Alert, FlatList,ToastAndroid,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content, Item,Spinner } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader';
let Common_Api = require('../../Assets/Json/Common.json')
import Modal from "react-native-modal";
import { postService, postImgService, postServiceP01 } from '../_services';
const { album_image } = serviceUrl;
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import { TextInput } from 'react-native-paper';
import styles1 from '../../styles/NewfeedImagePost';
import {invalidText} from '../_utils/CommonUtils'
import ImageView from 'react-native-image-view';


export default class OtherAddSubAlbum extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            id: '',
            albumName: '',
            subAlbum: '',
            //albumId come from last screen
            albumId: '',
            //GetSubalbum api
            AlbumId: '',
            albumImg: '',
            isModalVisible: false,
            albumData: null,
            deleteModal: 0,
            photoPath: null,
            photoPath1: null,
            images: null,
            subalbumname: '',
            subAlbumImg: '',
            getAlbumData: '',
            firstImg: "",
            subAlbumData: [],
            description: '',
            isLoading : false,
            inputError : false, 
            imageView : false

        }
    }


    UNSAFE_componentWillMount() {
       // debugger;
       const isa = this.props.route.params.imgData
        console.log('the isa',isa.subAlbums);
        isa.albumimg = isa.albumimg.filter(v => v.Image !== null);
        let subAlbums = [...isa.subAlbums, ...isa.albumimg];
        subAlbums = subAlbums.length > 0 && subAlbums.map(v => ({ ...v, selected: false }));
        subAlbums = subAlbums.length > 0 && subAlbums.map(v=>{
            if(v.albumimg){
                v.albumimg = v.albumimg.filter(c=>c.Image !== null);
            }
           return v;
        })
        console.log('the total subalbumss',subAlbums);
        this.setState({
            albumName: isa.albumName,
            albumImg: isa.albumimg.length === 0 ? [] : isa.albumimg,
            albumId: isa.albumId,
            subAlbumData: subAlbums
        });

        this.imageManipulte();

    }

    componentDidMount() {
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.imageManipulte();
            });

    }


    subAlbum = text => {
        this.setState({ subAlbum: text,inputError:false});
        if(text == ''){
            this.setState({ inputError: true });
            return false;
        }
     };

    subAlbumView = (data) => {
        if (data.Type == 'album') {
            console.log('the data',data);
            this.setState({
                imageView : true,
                imageViewData : [
                    {
                        source: {
                            uri : serviceUrl.album_image + data.Image
                        },
                        title : data.description ?  data.description : ''
                    }
                ]
            })
            return false
        }
        this.props.navigation.navigate('OtherSubAlbumView', { sData: data })
    }

    nextModal() {
        this.setState({ isModalVisible: false, deleteModal: 1 });
    }
    destroyModal() {
        this.setState({ deleteModal: 0 })
    }
    cancel() {
        this.setState({
           albumData:null,
           inputError:false,
           subAlbum:'',

        })
        // this.props.navigation.navigate('UserProfileAlbums')
    }
    close() {
        this.setState({deleteModal:0})
        // this.props.navigation.navigate('UserProfileAlbums')
    }

    takeImage() {
       // debugger;
        this.setState({ albumData: 1, isModalVisible: false });
        // this._openGallery();
        const { navigation } = this.props

        // let screenProps = blobType == 'Photos' ? 'NewsfeedUpload' : 'Vlog';
        // console.log('screen props',screenProps);
        navigation.navigate('GalleryPicker', { screen: 'AddSubAlbum', type: 'Photos' });
    }

    _selectedListForDel = (data) => {
        /**@Author by mufthi*/
        data.selected = !data.selected;
        const index = this.state.subAlbumData.findIndex(
            item => !data._id ? data.albumid === item.albumid : data._id === item._id
        );
        this.state.subAlbumData[index] = data;
        this.setState({
            subAlbumData: this.state.subAlbumData,
        });
        console.log('selected delete items are', data);
    };

    _deleteAlbums = async () => {
        /@Author by mufthi/
        const { subAlbumData } = this.state;
        let selectedAlbumsForDelete = subAlbumData.filter(d => d.selected)
            .map(({ albumid, _id }) => (!_id ? { albumid } : { _id }));

        if (selectedAlbumsForDelete.length == 0) {
            toastMsg1('danger','Select atleast one to delete')
           // ToastAndroid.show('Select atleast one to delete',ToastAndroid.SHORT)
            return;
        }
        let deleteLocally = subAlbumData.filter(d => !d.selected);
        this.setState({ subAlbumData: deleteLocally, deleteModal: 0 })
        let apiname = 'DeleteAlbumSub';
        let data = {}; data.ids = selectedAlbumsForDelete;

        postService(apiname, data).then(m => {
            if (m.status == "True") {

            } else {
                //toastMsg('danger', m.message)
            }
        })
            .catch(err => {
                console.log(err)
                //toastMsg('danger', 'Sorry..something wrong in network ,try again once')
            })

        console.log('go and delete ids', data);

    };

    next = async () => {
        //debugger;
        const { subAlbum } = this.state;
        console.log('asdasd',subAlbum);
        if (subAlbum == '') {
            this.setState({
                inputError: true
            });
            return false;
        }

        if(subAlbum.length > 15){
            toastMsg1('danger','Enter 15 characters')
            //ToastAndroid.show('Enter 15 characters',ToastAndroid.SHORT);
            return false;
        }
        const apiname = "CreateAlbums";
        var id = await AsyncStorage.getItem("userId");
        var data2 = {};
        data2.UserId = id;
        data2.Name = this.state.subAlbum;
        data2.albumid = this.state.albumId;
        data2.Type = "subalbum";
        this.setState({ isLoading: true });
        // console.log('into formdatas in add sub albums', data2);
        postServiceP01(apiname, data2).then(data => {
            this.close();
            // console.log('callback albums name', data);
            if (data.status == "True") {
                this.setState({ isLoading: false });
                //subAlbum: data.result.SubAlbumName,
              this.props.navigation.navigate('UserProfileAlbums');
            } else {
                this.setState({ isLoading: false });
                //toastMsg('danger', response.message)
            }

        }).catch(err => {
            this.setState({ isLoading: false });
            console.log(err)
            
            //toastMsg('danger', 'Sorry..something wrong in network ,try again once')
        })

    }

    imageUpload = async () => {
       // debugger;
        let data2 = new FormData();
        this.setState({isLoading:true})
        var id = await AsyncStorage.getItem("userId");
        this.state.images.length > 0 && this.state.images.map((data, i) => {

            var str = data.uri;
            function fileNameAndExt(str) {
                var file = str.split('/').pop();
                return [file.substr(0, file.lastIndexOf('.')), file.substr(file.lastIndexOf('.') + 1, file.length)]
            }
            let files = fileNameAndExt(str);
            let blobName = files[0] + '.' + files[1];

            data2.append("Image",
                {
                    uri: data.uri,
                    name: blobName,
                    type: data.mime
                }
            )
        });
        data2.append("Userid", id);
        data2.append("albumid", this.state.albumId);
        data2.append("Type", "album");
        const apiname = 'Albums';
        console.log('data222', data2);
        postImgService(apiname, data2).then(data => {
            console.log('info for inserted', data);
            if (data.status == "True") {
                this.setState({ albumData: null,isLoading:false })
                this.props.navigation.navigate('UserProfileAlbums');
            } else {
                this.setState({isLoading:false})
                //toastMsg('danger', data.message)
            }
        }).catch(err => {
            this.setState({isLoading:false})
            console.log(err);
            //toastMsg('danger', 'Sorry..something wrong in network ,try again once')
        })
        console.log('formdatas are', data2);
    };

    imageManipulte = () => {
        console.log('called method')
        const prop = this.props.route.params?.imgProp
        if (prop == undefined) {
            return false;
        }
        console.log('image manipulate', prop.e[0].node.image.uri)
        if (prop.e && prop.e.length > 0) {
            this.setState({
                isModalVisible: false,
                albumData: 1,
                photoPath: prop.e[0].node.image.uri.replace('file:///', ''),
                photoPath1: prop.e[0].node.image.uri,
                images: prop.e.map((i, index) => {
                    return {
                        uri: i.node.image.uri, width: i.node.image.width,
                        height: i.node.image.height, mime: i.node.type, imageIndex: index
                    };
                })
            });
        }
    }


    renderImage(image) {
        return (
            <TouchableOpacity onPress={() => this._setSelectedImage(image)}>

                <View style={{
                    backgroundColor: '#c1c1c1', width: 45, height: 70, borderRadius: 5, overflow: 'hidden'
                    , borderWidth: 0.6, borderColor: '#fff', marginRight: 8, flexWrap: 'wrap'
                }} >
                    <Image style={{ width: '100%', height: '100%', }} source={image} />
                </View>

                {/* <TextInput placeholder='Type here...' placeholderTextColor='#fff'
                    style={styles.textInput} /> */}
            </TouchableOpacity>
        )
    }

    _setSelectedImage(image) {
        this.setState({
            photoPath: image.uri.replace("file:///", ''),
            photoPath1: image.uri
        })
    }

    addsubAlbum() {
        this.setState({
            isModalVisible:false,
            albumData: 2
        })
    }

    seperator() {
       <View style={{ width: "50%", margin: '5%' }}></View>
    }

    renderRightImgdone() {
        return <View>
            {/* <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image source={require('../../Assets/Images/3dots.png')} resizeMode={'center'} style={{ width: 16, height: 16,marginTop:6 }} />
            </TouchableOpacity> */}
        </View>

    }

    renderAlbSAlbums = (item,index) =>{
        // console.log('item albumss',item);
        return(
            <View key={`id${index}`} style={{ height: '100%', marginLeft: '3.5%', marginBottom: '3.3%', shadowOffset: { width: 5, height: 5 }, shadowColor: '#000', shadowOpacity: .2,shadowRadius:5, elevation: 8, }}>
                <TouchableOpacity activeOpacity={1} onPress={() => this.subAlbumView(item)}>
                    <View style={Common_Style.ShadowCurveView}>
                        {item.albumimg && item.albumimg.length > 0 ?
                            <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 5, height: 5 }, shadowColor: '#000', shadowOpacity: .2, elevation: 8, }}>
                               <ImageBackground source={{ uri: serviceUrl.album_image + item.albumimg[0].Image }}
                                     resizeMode={'cover'} borderRadius={17} style={{ width: '100%', height: '100%',}}>
                                    <View style={{width:wp(45),height:hp(25),backgroundColor:'#00000050'}} />
                                   <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', 
                                       alignItems: 'center', shadowOffset: { width: 5, height: 5 }, shadowColor: 'grey', shadowOpacity: .2,shadowRadius:5, elevation: 8,  }}>
                                     <Text style={{  color: '#fff', fontSize: Username.FontSize, fontFamily: Username.Font }}>{item.albumName}</Text>
                                   </View>
                                </ImageBackground>
                                
                            </View>
                           
                            :
                            item.albumimg && item.albumimg.length == 0 ?
                                <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 5, height: 5 }, shadowColor: '#000', shadowOpacity: .2,shadowRadius:5, elevation: 8, }}>
                                    <View style={{width:wp(45),height:hp(25),backgroundColor:'#00000050'}} />
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 5, height: 5 }, shadowColor: 'grey', shadowOpacity: .2,shadowRadius:5, elevation: 8, }}>
                                        <Text style={{ color: '#FFF', fontSize: Username.FontSize, fontFamily: Username.Font }}>{item.albumName}</Text>
                                    </View>
                                </View>
                                :
                                <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 5, height: 5 }, shadowColor: '#000', shadowOpacity: 1,shadowRadius:5, }}>
                                    <Image source={{ uri: album_image + item.Image }}
                                        resizeMode={'cover'} style={{ width: '100%', borderRadius: 17, height: '100%', shadowColor: 'grey', shadowOpacity: 1, elevation: 8, }} />
                                </View>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const {isLoading,inputError,albumData,albumName,deleteModal,
          subAlbumData,subAlbum} = this.state;
        return (

            <View style={{ flex:1, backgroundColor: '#fff',marginTop:0 }}>

                {/* header of screen */}
                {albumData == 2 ?
                        <Toolbar {...this.props} icon={"Down1"} centerTitle="Add Sub Albums   " /> :
                        <Toolbar {...this.props} icon={"Down1"} centerTitle={albumName+'        '} rightImgView={this.renderRightImgdone()} />
                 }
                  <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}
                    onBackButtonPress={() => this.setState({ isModalVisible: false })} >
                    <View style={styles1.modalContent}>
                      <View style={{ marginTop: 15, }}>
                         <TouchableOpacity onPress={() => this.addsubAlbum()}>
                            <Text style={[styles1.modalText, { color: '#010101' }]}>
                                Add Sub Album
                            </Text>
                         </TouchableOpacity>
                      </View>
                      <View style={styles1.horizontalSeparator} />
                        <View style={{ marginTop: 7, }}>
                           <TouchableOpacity onPress={() => this.takeImage()}>
                              <Text style={[styles1.modalText, { color: '#010101' }]}>
                                 Photos
                               </Text>
                           </TouchableOpacity>
                        </View>
                        <View style={styles1.horizontalSeparator} />
                          <View style={{ marginTop: 7, marginBottom: 15 }}>
                             <TouchableOpacity onPress={() => { this.nextModal() }}>
                                <Text style={[styles1.modalText, { color: '#f00' }]}>
                                   Delete
                                </Text>
                             </TouchableOpacity>
                          </View>
                        </View>
                  </Modal>

                 {/* Delete Modal */}
                  <Modal
                    isVisible={deleteModal == 1}
                    onSwipeComplete={()=>this.close()}
                    swipeDirection={['down']}
                    style={styles.view}
                  >
                    <View style={{
                        backgroundColor: '#fff', height: hp('70%'), width: wp('100%'),
                        justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 15,
                        borderTopLeftRadius: 15, borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/>
                        <View style={{
                            flexDirection: 'row', width: wp('100%'),
                            justifyContent: 'space-between', height: 30, marginBottom: 10, marginTop: 10,
                            borderBottomColor: '#868686', borderBottomWidth: 0.5, backgroundColor: '#fff'
                        }}>
                            <View >
                                <Text style={{ fontSize: 16, color: '#4c4c4c', marginLeft: 20, fontFamily: Common_Color.fontBold }}>
                                    Delete
                                    </Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.destroyModal()}>
                                    <Image style={{ width: 22, height: 22, marginRight: 20 }}
                                        source={require('../../Assets/Images/close.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={subAlbumData}
                            ItemSeparatorComponent={this.seperator()}
                            extraData={this.state}
                            renderItem={({ item, index }) => (
                             <TouchableOpacity onPress={() => this._selectedListForDel(item)}>
                               <View key={`id${index}`} style={{ flexDirection: 'row', height: 80, width: wp('100%'), justifyContent: 'flex-start' }}>
                                 <View style={{ width: wp('2%') }} />
                                   <View style={{ width: wp('15%') }}>
                                      {item.albumimg && item.albumimg.length > 0 ?
                                     <Image style={{ width: 50, height: 50, borderRadius: 10, margin: 10 }}
                                       source={{ uri: serviceUrl.album_image + item.albumimg[0].Image }} />
                                       : item.albumimg && item.albumimg.length == 0 ?
                                       <View style={{ width: 50, height: 50, borderRadius: 10, margin: 10, backgroundColor: '#c1c1c1' }}
                                        />
                                       :  <Image style={{ width: 50, height: 50, borderRadius: 10, margin: 10 }}
                                            source={{ uri: serviceUrl.album_image + item.Image }} />  
                                       }
                                    </View>
                                    <View style={{ width: wp('70%'), }}>
                                      <Text style={{ marginTop: 20,  marginLeft: 10,fontSize: Username.FontSize, fontFamily: Username.Font }}>
                                         {item.albumName}
                                      </Text>
                                    </View>
                                    {item.selected === true ?
                                      <Image style={{ width: 22, height: 22, marginTop: 15 }}
                                        source={require('../../Assets/Images/check.png')} />
                                      : null
                                    }
                                </View>
                            </TouchableOpacity>
                               
                            )}
                            keyExtractor={(item,index) => index.toString()}
                            horizontal={false}
                        />
                        {/* </View> */}
                        {/* </Content> */}

                        <TouchableOpacity onPress={() => this._deleteAlbums()}>
                            <LinearGradient
                                start={{ x: 0, y: 0.75 }}
                                end={{ x: 1, y: 0.25 }}
                                style={styles.loginButton}
                                colors={["#f44236", "#f44236"]} >
                                <Text style={styles.LoginButtontxt}>Delete</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* Add Sub Album View Start */}
                {albumData == null ?
                   <View style={{ width: wp('100%'), height: hp('100%') }}>
                      <FlatList
                         style={{ marginBottom: 60 }}
                         data={subAlbumData}
                         ItemSeparatorComponent={this.seperator()}
                         renderItem={({ item,index }) => (
                             this.renderAlbSAlbums(item,index) 
                          )}
                         keyExtractor={(item, index) => index.toString()}
                         horizontal={false}
                         numColumns={2} />
                   </View>
                 :
                    //  add photos inside album section
                albumData == 1 ?
                 (
                  <ImageBackground style={{ width: '100%', height: hp('100%'), flex: 1, flexWrap: 'wrap' }}
                                source={{ uri: this.state.photoPath1 }}
                                resizeMode={'cover'}
                            >

                                <View style={{ backgroundColor: 'transparent', width: wp('100%'), height: '100%' }}>
                                    <View style={{ width: wp('15%') }}>
                                        <TouchableOpacity onPress={() => this.close()}>
                                            <Image style={{ width: 18, height: 18, margin: 10 }}
                                                source={require('../../Assets/Images/close.png')} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* <View style={{ height: hp('68%'),backgroundColor:'red' }} /> */}
                                    <View style={{
                                        bottom: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center',
                                        alignSelf: 'center', marginRight: 10
                                    }}>

                                        <View style={{
                                            width: wp('90%'), height: hp('8%'), backgroundColor: '#00000070',
                                            marginBottom: 10, borderWidth: 1, borderColor: '#000', borderRadius: 50,
                                            overflow: 'hidden', justifyContent: 'center', paddingLeft: 15, paddingRight: 15
                                        }}>
                                            <TextInput
                                                placeholder='Type Here'
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor='#fff'
                                                multiline={true}
                                                numberOfLines={3}
                                                autoCorrect={false}
                                                //  keyboardType="visible-password"
                                                selectionColor={'#f0275d'}
                                                value={this.state.description}
                                                onChangeText={(e) => this.setState({ description: e })}
                                                style={{
                                                    backgroundColor: 'transparent', color: '#fff', fontSize: 16
                                                }}
                                            />
                                        </View>

                                        {/* #526c6b */}
                                        <View style={{ width: wp('100%'), height: hp('14%'), flexDirection: 'row', backgroundColor: '#00000070' }}>

                                            <View style={{
                                                width: wp('75%'), height: hp('14%'), flexDirection: 'row',
                                                justifyContent: 'center', alignItems: 'center', marginLeft: 5
                                            }} >
                                                <ScrollView horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 5, paddingEnd: 5 }}>
                                                    {this.state.images ? this.state.images.map(i =>
                                                        <View key={i.uri}>{this.renderImage(i)}

                                                        </View>) : null}
                                                </ScrollView>
                                            </View>

                                            <View style={{
                                                width: wp('25%'), height: hp('14%'), justifyContent: 'center',
                                            }}>
                                                {isLoading ? 
                                                 (<Spinner size="large" color="#fb0143" />)
                                                :

                                                <TouchableOpacity onPress={() => this.imageUpload()}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.75 }}
                                                        end={{ x: 1, y: 0.25 }}
                                                        style={styles.nextButton}
                                                        colors={["#fff", "#ffffff"]} >
                                                        <Text style={[styles.LoginButtontxt, {
                                                            color: '#4f4f4f'
                                                            , textAlign: 'center'
                                                        }]}>Next</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                              }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                 )
                :
                albumData == 2 ?
                 (<View>
                    <TextInput
                      label="Type Sub-Album Name"
                      placeholderStyle={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}
                      mode="outlined"
                      value={subAlbum}
                      onChangeText={this.subAlbum}
                      error={inputError}
                      autoCorrect={false}
                      //  keyboardType="visible-password"
                      style={{ backgroundColor: '#fff', width: wp(97), height: 37, alignSelf: 'center', fontSize: profilename.FontSize, fontFamily: profilename.Font, marginTop: 8, marginBottom: 8 }}
                      selectionColor={'#f0275d'}
                      theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />
                    
                    {inputError && (
                      <View style={{ marginLeft: 10, marginTop: 5 }}>
                         <Text style={{ color: "red" }}>
                            <Text style={{ fontWeight: "bold" }}>*</Text>
                               Cannot leave empty
                          </Text>
                       </View>
                    )}

                    <View style={[Common_Style.Common_button, { width: wp('100%'),alignSelf:'center' }]}>
                      <TouchableOpacity style={{width:wp('95%'),}} onPress={() => { isLoading ?  null : this.next() }}>
                        <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%',alignItems:'center',justifyContent:'center', }}
                           borderRadius={10}
                         >
                          <Text onPress={() => { isLoading ?  null : this.next() }} style={[Common_Style.Common_btn_txt,{padding:8,width:wp('95%')}]}>{isLoading ? 'Creating SubAlbum....' : 'Create'}</Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    </View>
                    <View style={[Common_Style.Common_button, { width: wp(97), marginTop: 5, marginBottom: 5 }]}>
                       <TouchableOpacity onPress={() => this.cancel()}>
                          <Text onPress={() => this.cancel()} style={[Common_Style.Common_btn_txt, { color: 'black', marginLeft: 15 }]}>Cancel</Text>
                       </TouchableOpacity>
                    </View>
                  </View>)
                :
              null
             }

            <ImageView
                images={this.state.imageViewData}
                imageIndex={0}
                isVisible={this.state.imageView}
                onClose = {()=>this.setState({imageView:false})}
                renderFooter={(image) => (
                    <LinearGradient 
                     colors={["#00000000","#00000050", "#00000098"]}
                     style={{ width: wp('100%')}}
                    >
                        <Text style={{color:'#fff',textAlign:'center',margin:10}}>
                            {invalidText(image.title)?null : image.title}
                        </Text>
                    </LinearGradient>    
                )}
              />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: "#87cefa",  alignItems: "center", height: hp("6%"),
      width: wp("100%"), color: "blue", borderRadius: 0,justifyContent: "center",
      textAlign: "center",shadowColor: '#000000', shadowOffset: {  width: 3,  height: 3 },
      shadowRadius: 5,  shadowOpacity: 1.0,marginBottom:0
    },
    deleteButton: { backgroundColor: "#87cefa", alignItems: "center", height: hp("6%"), width: wp("90%"), color: "blue", borderRadius: 8, justifyContent: "center", textAlign: "center", shadowColor: '#000000', shadowOffset: { width: 3, height: 3 }, shadowRadius: 5, shadowOpacity: 1.0, marginBottom: 8 },
    view: { justifyContent: 'flex-end', margin: 0, },
    modalView1: { width: wp('90%'), height: hp('20%'), backgroundColor: '#fff', borderRadius: 8 },
    nextButton: {
        // backgroundColor: "#87cefa",
        justifyContent: 'center',
        alignSelf: 'center',
        height: hp("5%"),
        width: wp("20%"),
        //    marginTop: 25,
        // marginRight:15,
        borderRadius: 4,
        shadowColor: '#000000',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    LoginButtontxt: {
        color: "#fff",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 16,
        fontFamily: Common_Color.fontBold
    },
    textInput: {
        width: wp('90%'), backgroundColor: 'red',
        height: hp('8%'), borderRadius: 15,
        padding: 0, borderWidth: 1, borderColor: '#cbcbcb',
        justifyContent: 'center', alignContent: 'center', alignSelf: 'center'
    },
})