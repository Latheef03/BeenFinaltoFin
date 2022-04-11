import React, { Component } from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, ScrollView,
    ImageBackground, Alert,TextInput,FlatList,StatusBar,
    ToastAndroid,TouchableNativeFeedback,StatusBarIOS
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content, Item, Spinner } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Modal from "react-native-modal";
import { postService, postImgService } from '../_services';
import styles1 from '../../styles/NewfeedImagePost';
import Common_Style from '../../Assets/Styles/Common_Style'
import {Common_Color,TitleHeader} from '../../Assets/Colors';
import {deviceWidth as dw , deviceHeight as dh,invalidText} from '../_utils/CommonUtils'
import ImageView from 'react-native-image-view';
import {Toolbar} from '../commoncomponent'
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';

const { album_image } = serviceUrl;

export default class SubAlbumView extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            id: '',
            albumName: '',
            isModalVisible:false,
            owner : '' ,
            isLoading : false,
            subAlbumData : [],   
            albumData : null  ,
            images : null     ,
            imageView : false ,
            deleteModal : false,
            keyboardOffset : 0
        }
    }


    componentDidMount = () => {

        const datas = this.props.route.params.sData
        console.log('subalbumview',datas);
        const subalbums = datas.albumimg && datas.albumimg.length > 0 && datas.albumimg.map(v => ({ ...v, selected: false }));
        console.log('asas subalbum as', datas);
        this.setState({
            albumName: datas.albumName,
            owner: datas.albumid,
            subAlbumData: !subalbums ? [] : subalbums
        })

        this.keyboardWillShow = Keyboard.addListener('keyboardDidShow',this.keyboardDidShow.bind(this))
        this.keyboardWillHide = Keyboard.addListener('keyboardDidHide',this.keyboardDidHide.bind(this))
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.imageManipulte();
            });
    }

    componentWillUnmount() {
        this.keyboardWillShow?.remove();
        this.keyboardWillHide?.remove();
      }

    keyboardDidShow = (event) => {
        this.setState({
            keyboardOffset: event.endCoordinates.height,
        })
    }

    keyboardDidHide = () =>{
        this.setState({
            keyboardOffset: 0,
        })
    }

    addDescription = (desc) =>{
        const {images,imageIndex} = this.state;
        const imageWithDesc = {...images[imageIndex],description:desc};
        images[imageIndex] = imageWithDesc;
        console.log('the descc',images);
        this.setState({ 
            images,
            description : desc 
        })
    }

    subAlbumImageView = (data,index)=>{
        console.log('the items are',data);
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
    } 

    imageManipulte = () => {
        const prop = this.props.route.params.imgProp
        console.log('thee props',prop);
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
                imageIndex : 0,
                images: prop.e.map((i, index) => {
                    return {
                        uri: i.node.image.uri, width: i.node.image.width,
                        height: i.node.image.height, mime: i.node.type, imageIndex: index,
                        filename : i.node.image.filename
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
                    <Image style={{ width: '100%', height: '100%', }} source={image} 
                        resizeMode={'cover'}
                    />
                </View>

                {/* <TextInput placeholder='Type here...' placeholderTextColor='#fff'
                    style={styles.textInput} /> */}
            </TouchableOpacity>
        )
    }

    _selectedListForDel = (data) => {
        /**@Author by mufthi*/
        data.selected = !data.selected;
        const index = this.state.subAlbumData.findIndex(
            item => data._id === item._id
        );
        this.state.subAlbumData[index] = data;
        this.setState({
            subAlbumData: this.state.subAlbumData,
        });
        // console.log('selected delete items are', data);
    };

    _deleteAlbums = async () => {
        /@Author by mufthi/
        const { subAlbumData } = this.state;
        let selectedAlbumsForDelete = subAlbumData.filter(d => d.selected)
            .map(({ _id }) =>  _id );

        if (selectedAlbumsForDelete.length == 0) {
            toastMsg1('danger', 'Select atleast one to delete')
           // ToastAndroid.show('Select atleast one to delete',ToastAndroid.SHORT)
            return;
        }
        
        let deleteLocally = subAlbumData.filter(d => !d.selected);
        this.setState({ subAlbumData: deleteLocally, deleteModal: false })
        let apiname = 'DeleteSubAlbumImage';
        let data = {}; data.ids = selectedAlbumsForDelete;
        data.Userid = await AsyncStorage.getItem('userId'),

        postService(apiname, data).then(m => {
            if (m.status == "True") {
                this.props.navigation.navigate('UserProfileAlbums');
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

    renderDelete = (item,index) =>{
        return(
            <TouchableOpacity onPress={() => this._selectedListForDel(item)}>
                <View key={`id${index}`} style={{ flexDirection: 'row', height: 80, width: wp('100%'), 
                    justifyContent: 'flex-start',}}>
                    <View style={{ width: wp('2%') }} />
                    <View style={{ width: wp('15%') }}>
                      <Image style={{ width: 50, height: 50,backgroundColor:'grey', borderRadius: 10, margin: 10 }}
                        source={{ uri: serviceUrl.album_image + item.Image }} />
                      
                    </View>

                    <View style={{ width: wp('70%'), }}>
                        {/* <Text style={{ marginTop: 20, marginLeft: 10, fontSize: Username.FontSize, fontFamily: Username.Font }}>
                            {item.albumName}
                        </Text> */}
                    </View>

                    {item.selected?
                        <Image style={{ width: 22, height: 22,marginTop:15}}
                            source={require('../../Assets/Images/check.png')} />
                        : null
                    }
                </View>
            </TouchableOpacity>
        )
    }

    _setSelectedImage(image) {
        console.log('the image index',image)
        this.setState({
            photoPath: image.uri.replace("file:///", ''),
            photoPath1: image.uri,
            imageIndex : image.imageIndex,
        })
    }

    imageUpload = async () => {
       // debugger;
        let data2 = new FormData();
        var id = await AsyncStorage.getItem("userId");
        this.setState({isLoading : true}) 
        this.state.images.length > 0 && this.state.images.map((data, i) => {
            console.log('the datas blob',data);
            // var str = data.uri;
            // function fileNameAndExt(str) {
            //     var file = str.split('/').pop();
            //     return [file.substr(0, file.lastIndexOf('.')), file.substr(file.lastIndexOf('.') + 1, file.length)]
            // }
            // let files = fileNameAndExt(str);
            // let blobName = files[0] + '.' + files[1];

            data2.append("Image",
                {
                    uri: data.uri,
                    name: data.filename,
                    type: data.mime
                }
            )
            data2.append('description',data.description)
        });
        data2.append("Userid", id);
        data2.append("albumid", this.state.owner);
        data2.append("Type", "subalbum");
        const apiname = 'Albums';
        console.log('data222', data2);

        // this.setState({isLoading : false})
        postImgService(apiname, data2).then(data => {
            console.log('info for inserted', data);
            if (data.status == "True") {
                this.setState({isLoading : false}) 
                this.props.navigation.navigate('UserProfileAlbums');
            } else {
                this.setState({isLoading : false}) 
                //toastMsg('danger', data.message)
            }
        }).catch(err => {
            console.log(err);
            this.setState({isLoading : false}) 
            //toastMsg('danger', 'Sorry..something wrong in network ,try again once')
        })
        
    };

    nextModal() {
        this.setState({ isModalVisible: false},()=>{
            setTimeout(()=>{
                this.setState({
                    deleteModal: true
                })
            },300)            
        }) ;
    }
    destroyModal() {
        this.setState({ deleteModal: false })
    }
    cancel() {
        this.props.navigation.navigate('UserProfileAlbums')
    }
    close() {
        this.setState({deleteModal:false})
    }

    takeImage() {
       // debugger;
        this.setState({ isModalVisible: false });
        const { navigation } = this.props
        navigation.navigate('GalleryPicker', { screen: 'SubAlbumView', type: 'Photos' });
    }
  
    renderAlbums = (item, index) => {
     return (
       <View key={`id${index}`} style={{ height: '100%', marginLeft: '3.5%', marginBottom: '3.3%', shadowOffset: { width: 5, height: 5 }, shadowColor: '#000', shadowOpacity: .2,shadowRadius:5, elevation: 8, }}>
        <TouchableOpacity activeOpacity={1} onPress={() => this.subAlbumImageView(item,index)}>
         <View style={Common_Style.ShadowCurveView}>
            <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 5, height: 5 }, shadowColor: '#000', shadowOpacity: .2,shadowRadius:5 }}>
              <Image source={{ uri: album_image + item.Image }}
                  resizeMode={'cover'} style={{ width: '100%', borderRadius: 17, height: '100%', shadowColor: 'grey', shadowOpacity: 1, }} />
            </View>
         </View>
         </TouchableOpacity>
       </View>
      )
      
    }

    addsubAlbum() {
        this.setState({
            isModalVisible:false,
            albumData: 2
        })
    }

    renderRightImgdone() {
        return <View>
            <TouchableOpacity style={{ width: '10%', justifyContent: 'center' }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <View style={{}}>
                    <Image source={require('../../Assets/Images/3dots.png')}
                        resizeMode={'contain'}
                        style={{ width: 15, height: 15, alignSelf: 'center' }} />
                </View>
            </TouchableOpacity>
        </View>

    }

    render() {
        const {albumName, isModalVisible, isLoading,images,imageIndex} = this.state;
        return (

            <View style={{ flex:1, backgroundColor: '#fff',marginTop:0 }}>
                <StatusBar hidden/>
                {/* header of screen */}

                
                    {this.state.albumData == null  && (
                        <Toolbar {...this.props}  centerTitle={albumName} rightImgView={this.renderRightImgdone()} />
                    //  <View style={{ flexDirection: 'row', width: dw, height: dh * .07,marginTop:StatusBar.currentHeight,backgroundColor:'plum' }}>
                      
                    //      <TouchableOpacity style={{ width : '10%',justifyContent:'center'}} onPress={() => this.props.navigation.goBack()} >
                    //       <View style={{  }}>
                    //          <Image source={require('../../Assets/Images/backArrow.png')}
                    //         // resizeMode={'center'} 
                    //          style={{ width: 20, height: 20, alignSelf:'center' }} />
                    //        </View>
                    //      </TouchableOpacity>
                     

                    //  <View style={{ width : '80%',justifyContent:'center' }}>
                    //      <Text style={{ fontSize: TitleHeader.fontSize,fontFamily:TitleHeader.Font,textAlign: 'center', }}>{albumName}</Text>
                    //  </View>
                        
                    //  <TouchableOpacity style={{ width : '10%',justifyContent:'center'  }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                    //  <View style={{  }}>
                    //          <Image source={require('../../Assets/Images/3dots.png')} 
                    //  //  resizeMode={'center'} 
                    //           style={{ width: 15, height: 15,alignSelf:'center'}} />
                    //  </View>
                    //  </TouchableOpacity>
                    // </View>
                  )}
                   

                    <Modal isVisible={isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}
                        onBackButtonPress={() => this.setState({ isModalVisible: false })} >
                        <View style={styles1.modalContent} >
                            
                            <View style={{  marginTop: 15,width:dw * .8}}>
                                <TouchableOpacity onPress={() => this.takeImage()}>
                                    <Text style={[styles1.modalText, { color: '#010101',width:'100%' }]}>
                                        Photos
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles1.horizontalSeparator} />
                            <View style={{ marginTop: 7, marginBottom: 15,width:dw * .8, }}>
                              <TouchableOpacity onPress={() => { this.nextModal() }}>
                                <Text style={[styles1.modalText, { color: '#f00',width : '100%' }]}>
                                    Delete
                                 </Text>
                              </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    
                    {/* Delete Modal */}
                 <Modal
                    isVisible={this.state.deleteModal }
                    onSwipeComplete={()=>this.close()}
                    swipeDirection={['down']}
                    style={styles.view}
                  >
                    <View style={{
                        backgroundColor: '#fff', height: hp('70%'), width: wp('100%'),
                        justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 15,
                        borderTopLeftRadius: 15, borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}>
                        {/* <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/> */}
                        <View style={{
                            flexDirection: 'row', width: wp('100%'),
                            justifyContent: 'space-between', height: 30, marginBottom: 10, marginTop: 10,
                            backgroundColor: '#fff'
                        }}>
                            <View >
                                {/* <Text style={{ fontSize: 16, color: '#4c4c4c', marginLeft: 20, fontFamily: Common_Color.fontBold }}>
                                    Delete
                                    </Text> */}
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.destroyModal()}>
                                    <Image style={{ width: 22, height: 22, marginRight: 20 ,marginTop : 10 }}
                                        source={require('../../Assets/Images/close.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={this.state.subAlbumData}
                            // ItemSeparatorComponent={this.seperator()}
                            extraData={this.state}
                            renderItem={({ item, index }) => (
                                this.renderDelete(item,index)
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
                    
                {/* </View> */}

                {/* <Content> */}
                    <View style={{ flex:1,}}>
                        
                    {this.state.albumData == 1 ?
                        (
                            <ImageBackground style={{ width: '100%', height: dh, flex: 1,
                            flexWrap: 'wrap',  }}
                            source={{ uri: this.state.photoPath1 }}
                            resizeMode={'cover'}
                        >
                         <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                            <View style={{ backgroundColor: 'transparent', width: wp('100%'), height: '100%' }}>
                                <View style={{ width: wp('15%'),marginTop:StatusBar.currentHeight }}>
                                    <TouchableOpacity onPress={() => this.setState({albumData : null}) }>
                                        <Image style={{ width: 18, height: 18, margin: 10 ,marginTop : StatusBar.currentHeight}}
                                            source={require('../../Assets/Images/close_white.png')} />
                                    </TouchableOpacity>
                                </View>

                                {/* <View style={{ height: hp('68%'),backgroundColor:'red' }} /> */}
                                <View style={{
                                    bottom: this.state.keyboardOffset, position: 'absolute', justifyContent: 'center', alignItems: 'center',
                                    alignSelf: 'center', marginRight: 10
                                }}>

                                    <View style={{
                                        width: wp('90%'), height: 40, backgroundColor: '#00000070',
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
                                            keyboardType="default"
                                            // selectionColor={'#f0275d'}
                                            value={images !=null ?
                                                invalidText(images[imageIndex].description)?null:
                                                images[imageIndex].description
                                                : null}
                                            onChangeText={(e) => this.addDescription(e)}
                                            style={{
                                                color: '#fff', fontSize: 14
                                            }}
                                        />
                                    </View>

                                    {/* #526c6b */}
                                    <LinearGradient
                                          style={{ width: wp('100%'), height: hp('14%'), flexDirection: 'row', }}
                                          colors={["#00000000","#00000050", "#00000098"]} >

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
                                            <TouchableOpacity onPress={() => this.imageUpload()} >
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
                                    </LinearGradient>
                                </View>
                            </View>
                            </TouchableWithoutFeedback>
                        </ImageBackground>
                        )
                     :
                   <FlatList
                    style={{marginBottom:0}}
                    data={this.state.subAlbumData}
                    // ItemSeparatorComponent={this.seperator()}
                    renderItem={({item,index}) => this.renderAlbums(item,index)}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                   />
                }


                    </View>
                {/* </Content> */}
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
    textInput: { width: wp('90%'), backgroundColor: 'transparent', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 25, padding: 15, borderWidth: 1, borderColor: '#cbcbcb', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
})