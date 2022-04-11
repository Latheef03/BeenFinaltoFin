import React, { Component } from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, ScrollView,
    ImageBackground, Alert,TextInput,FlatList,StatusBar,
    ToastAndroid
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
import {Common_Color} from '../../Assets/Colors';
import {invalidText} from '../_utils/CommonUtils'
const { album_image } = serviceUrl;
import ImageView from 'react-native-image-view';
import { Toolbar } from '../commoncomponent';


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
            imageView : false        
        }
    }


    componentDidMount = () => {
        console.log('this.props.route.',this.props.route.params);
        const datas = this.props.route.params?.sData
        const subalbums = datas.albumimg && datas.albumimg.length > 0 && datas.albumimg.map(v => ({ ...v, selected: false }));
        this.setState({
            albumName: datas.albumName,
            owner: datas.albumid,
            subAlbumData: !subalbums ? [] : subalbums
        })

        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.imageManipulte();
            });


    }

    subAlbumImageView = (data,index)=>{
        // console.log('the items are',data);
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
        const prop = this.props.route.params?.imgProp
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
            toastMsg1('danger', "Select atleast one to delete")
            //ToastAndroid.show('Select atleast one to delete',ToastAndroid.SHORT)
            return;
        }
        
        let deleteLocally = subAlbumData.filter(d => !d.selected);
        this.setState({ subAlbumData: deleteLocally, deleteModal: 0 })
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
                      <Image style={{ width: 50, height: 50, borderRadius: 10, margin: 10 }}
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
        this.setState({
            photoPath: image.uri.replace("file:///", ''),
            photoPath1: image.uri
        })
    }

    imageUpload = async () => {
       // debugger;
        let data2 = new FormData();
        var id = await AsyncStorage.getItem("userId");
        this.setState({isLoading : true}) 
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
        data2.append("albumid", this.state.owner);
        data2.append("Type", "subalbum");
        const apiname = 'Albums';
        console.log('data222', data2);

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
        this.setState({ isModalVisible: false, deleteModal: 1 });
    }
    destroyModal() {
        this.setState({ deleteModal: 0 })
    }
    cancel() {
        this.props.navigation.navigate('UserProfileAlbums')
    }
    close() {
        this.setState({deleteModal:0})
    }

    takeImage() {
       // debugger;
        this.setState({ albumData: 1, isModalVisible: false });
        const { navigation } = this.props
        navigation.navigate('GalleryPicker', { screen: 'SubAlbumView', type: 'Photos' });
    }
  
    renderAlbums = (item, index) => {
     return (
       <View key={`id${index}`} style={{ height: '100%', marginLeft: '3.5%', marginBottom: '3.3%', shadowOffset: { width: 10, height: 10 }, shadowColor: '#000', shadowOpacity: 1, elevation: 8, }}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.subAlbumImageView(item)}>
         <View style={Common_Style.ShadowCurveView}>
            <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 10, height: 10 }, shadowColor: '#000', shadowOpacity: 1, }}>
              <Image source={{ uri: album_image + item.Image }}
                  resizeMode={'cover'} style={{ width: '100%', borderRadius: 17, height: '100%', shadowColor: 'grey', shadowOpacity: 1, elevation: 8, }} />
            </View>
         </View>
         </TouchableOpacity>
       </View>
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

    renderRightImgdone() {
        return <View>
            
        </View>
    }

    render() {
        const {albumName, isModalVisible, isLoading} = this.state;
        return (

            <View style={{ flex:1, backgroundColor: '#fff',marginTop:StatusBar.currentHeight }}>

                {/* header of screen */}
                <Toolbar {...this.props}  centerTitle={albumName} rightImgView={this.renderRightImgdone()} />

                <View style={{ flexDirection: 'row', width: '100%', height: 40, }}>
                    {/* <View style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: '2%', marginTop: 5 }}>
                        <TouchableOpacity style={{ height: '60%', }} onPress={() => this.props.navigation.goBack()} >
                            <Image source={require('../../Assets/Images/backArrow.png')}
                       // resizeMode={'center'} 
                             style={{ width: 20, height: 20, marginTop: '40%' }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '84%', marginTop: 'auto', marginBottom: 'auto', marginLeft: '2%', }}>
                        <Text style={{ fontSize: 16, textAlign: 'center', color: '#333', }}>{albumName}</Text>
                    </View> */}

                    {/* <View style={{ marginTop: hp("2%") }}>
                         <TouchableOpacity style={{ height: '80%', }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                            <Image source={require('../../Assets/Images/3dots.png')} resizeMode={'center'} style={{ width: 15, height: 15, }} />
                        </TouchableOpacity> 
                    </View> */}

                    <Modal isVisible={isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}
                        onBackButtonPress={() => this.setState({ isModalVisible: false })} >
                        <View style={styles1.modalContent} >
                            
                            <View style={{  marginTop: 15}}>
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
                    isVisible={this.state.deleteModal == 1}
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
                    
                </View>

                {/* <Content> */}
                    <View style={{ flex:1 }}>
                        
                    {this.state.albumData == 1 ?
                        (
                            <ImageBackground style={{ width: '100%', height: hp('100%'), flex: 1, flexWrap: 'wrap' }}
                            source={{ uri: this.state.photoPath1 }}
                            resizeMode={'cover'}
                        >

                            <View style={{ backgroundColor: 'transparent', width: wp('100%'), height: '100%' }}>
                                <View style={{ width: wp('15%') }}>
                                    <TouchableOpacity onPress={() => { }}>
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
                                    </View>
                                </View>
                            </View>
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