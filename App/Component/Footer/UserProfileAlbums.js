import React, { Component } from 'react';
import {
    Text, StyleSheet, Image, FitImage, ImageBackground,
    View, ToastAndroid, ActivityIndicator,StatusBar, TouchableOpacity, ScrollView, FlatList
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import LinearGradient from "react-native-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import Spinner from '../../Assets/Script/Loader';
import styles from '../../styles/FooterStyle';
import { postServiceP01 } from '../_services';
import Common_Style from '../../Assets/Styles/Common_Style'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from '../../Assets/Colors'
import { Toolbar, FooterTabBar } from '../commoncomponent'
import styles1 from '../../styles/NewfeedImagePost';
import {ExploreLoader } from '../commoncomponent/AnimatedLoader';
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';

export default class UserProfileAlbums extends Component {
    // _isNoAlbums = false;
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            userName: '',
            getAlbumData: [],
            getSubAlbumData: [],
            getMemoryData: '',
            convertedImages1: '',
            deleteModal: 0,
            isModalVisible: false,
            followers: 0,
            search: '',
            albumSingleImg: null,
            albumName: null,
            albumId: null,
            _isNoAlbums: false,
            albumData: [],
            no_record_found: false,
            isLoading: false,

        }
    }


    componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => { 
                this.getAlbum(); 
            }
        );
    };

    // componentWillMount() {
    //     const { navigation } = this.props;
    //     this.getAlbum();
    // }

    getAlbum = async () => {
        var data = { Userid: await AsyncStorage.getItem('userId') }
        this.setState({ isLoading: true });
        const apiname = "GetAlbums";
        postServiceP01(apiname, data).then(datas => {
            console.log('the resultss',datas)
            if (datas.status == 'True') {
                this._arrangeAlbumsSubalbums(datas);
                this.setState({
                    isLoading: false,
                    no_record_found: false
                })
            } else {
                this.setState({
                    isLoading: false,
                    no_record_found: true,

                });
            }
        }).catch(err => {
            console.log(err)
            //toastMsg('danger', 'something wrong in network,please try after some time.')
        })

    }

    _arrangeAlbumsSubalbums = (datas) => {
        datas.Albums = datas.Albums.length > 0 && datas.Albums.map(m => {
            m.selected = false;
            m.subAlbums = [];
            m.isSubAlbum = 'noSubAlbums';
            m.albumimg = m.albumimg.filter(v => v.Image !== null)
            datas.subAlbums.length > 0 && datas.subAlbums.map(s => {
                if (m.albumId == s.subAlbumOwner) {
                    m.subAlbums.push(s);
                    m.isSubAlbum = 'Yup';
                }
            })
            return m;
        });
        // .filter(v => v.albumimg).map(d => d.Image!==null)

        console.log('total album and sub album', datas.Albums)
        if (!datas.Albums) {
            this.setState({
                _isNoAlbums: false,
                getAlbumData: []
            });
            return false;
        } else {
            this.setState({
                getAlbumData: datas.Albums,
                _isNoAlbums: true
            })
        }


    };

    _deleteAlbums = async () => {
        const {getAlbumData} = this.state;
        const apiname = 'DeleteAlbumSub';
        const deletedList = getAlbumData.filter(d=>d.selected).map(({albumId}) => ({ albumid: albumId }) );
        if(deletedList.length == 0){
            toastMsg1('danger', 'Select atleast one to delete')
            //ToastAndroid.show('Select atleast one to delete',ToastAndroid.SHORT)
            return false;
        }
        console.log('the deleted list',deletedList);
        let deleteLocally = getAlbumData.filter(d => !d.selected);
        let data = {}; data.ids = deletedList;
        this.setState({ getAlbumData: deleteLocally, deleteModal: 0 })

        postServiceP01(apiname,data).then(cb=>{
            console.log('the deleted cb',cb);
           if(cb.status !== 'True'){
              let bringBackData = getAlbumData.map(d =>({...d,selected:false}));
              this.setState({getAlbumData:bringBackData});
              toastMsg1('danger', 'couldn\'t delete.try again once')
              //ToastAndroid.show('couldn\'t delete.try again once',ToastAndroid.LONG)
           }
        }).catch(err=>{
            console.log(err);
            let bringBackData = getAlbumData.map(d =>({...d,selected:false}));
            this.setState({getAlbumData:bringBackData});
            toastMsg1('danger', 'couldn\'t delete.try again once')
            //ToastAndroid.show('couldn\'t delete.try again once',ToastAndroid.LONG)

        });
        
    }

    addAlbum() {
        this.setState({
            isModalVisible: false,
        })
        this.props.navigation.navigate('AddAlbum');
    }

    subAlbum(item) {
       // debugger;
        // console.log('itemss are',item)
        this.setState({
            isModalVisible: false,
        })
        this.props.navigation.navigate('AddSubAlbum', { imgData: item, });
    }

    nextModal = () => {
        this.setState({ isModalVisible: false, 
        },()=>{ setTimeout(()=>{
                  this.setState({
                    deleteModal: 1
                  })
                },600)
              })
    }
    backArrow() {
        this.props.navigation.goBack();
    }
    memories() {
        this.props.navigation.navigate('UserProfileMemories');
    }
    visits() {
        this.props.navigation.navigate('Visits');
    }
    vlog() {
        this.props.navigation.navigate('VlogGet');
    }
    destroyModal() {
        this.setState({ deleteModal: 0 })
    }

    seperator() {
        <View style={{ width: "50%", margin: '5%' }}></View>
    }
    _selectedListForDel = (newData) => {
        const {getAlbumData} = this.state;
        newData.selected = !newData.selected;
        const index = getAlbumData.findIndex(item=>item.albumId == newData.albumId); 
        getAlbumData[index] = {...getAlbumData[index],selected:newData.selected };
        this.setState({getAlbumData});
    }

    onErrorImage = e =>{
        console.log('image load error',e.nativeEvent)
    }

    renderAlbums = (item,index) =>(
        
      <View key={`id${index}`} style={{ height: '100%',marginLeft: '3.5%', marginBottom: '3.3%', 
        shadowOffset: { width: 5, height: 5 }, shadowColor: '#000', shadowOpacity: 0.2,shadowRadius:5, elevation: 8, }}>
        <TouchableOpacity activeOpacity={1} onPress={() => this.subAlbum(item)}>
           <View style={Common_Style.ShadowCurveView}>
              {item.albumimg.length != 0 ?
               <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 10, height: 10 }, shadowColor: 'grey', shadowOpacity: 1, elevation: 8, }}>
                   
                <ImageBackground source={{ uri: serviceUrl.album_image + item.albumimg[0].Image 
                // 'http://51.15.201.39/uploads/Albums/1647501769388-IMG_0001.JPG'
                // 'http://51.15.201.39/webp/uploads/Albums/1647501769388-IMG_0001.JPG'
                //'http://51.15.201.39/webp/uploads/Albums/Image_1647514278934.JPG'
                // 'http://1.bp.blogspot.com/-A0_3uvHgsz8/UM9cb9UGZJI/AAAAAAAAGio/4IG92Oedv-4/s1600/debug_fingerprints.png'
            }}
            onError={e=>this.onErrorImage(e)}
            
                   resizeMode={'cover'} style={{ width: '100%', height: '100%',}}>
                  <View style={{width:wp(45),height:hp(25),backgroundColor:'#00000050'}} />
                  <View style={styles.centeredText}>
                     <Text style={{ color: '#fff', fontSize: Username.FontSize, fontFamily: Username.Font }}>{item.albumName}</Text>
                   </View>
                </ImageBackground>
               </View>
              :
              <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 10, height: 10 }, shadowColor: 'grey', shadowOpacity: 1, elevation: 8, }}>
                
                <View style={{width:wp(45),height:hp(25),backgroundColor:'#00000050'}} />
                <View style={styles.centeredText}>
                   <Text style={{ color: '#fff', fontSize: Username.FontSize, fontFamily: Username.Font }}>{item.albumName}</Text>
                 </View>
                 
              </View>
             }
           </View>
        </TouchableOpacity>
     </View>
    )


    renderRightImgdone() {
        return <View >
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image source={require('../../Assets/Images/3dots.png')} 
            // resizeMode={'center'} 
                style={{ width: 16, height: 16,marginTop:6 }} />
            </TouchableOpacity>
        </View>

    }
    render() {
        const {isLoading,getAlbumData} = this.state;
        return (
            <View style={{ flex: 1,backgroundColor:'#fff',marginTop:0 }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <Toolbar {...this.props} icon={"Down"} centerTitle="Albums" rightImgView={this.renderRightImgdone()} />

                {/* <ScrollView> */}
                    {isLoading?
                      <ExploreLoader />
                     : !isLoading && getAlbumData.length == 0 ?
                     <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                     <View style={styles.hasNoMem}>
                        <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                        <Text style={Common_Style.noDataText}> You have not created any Albums yet!</Text>
                     </View>
                   </View>
                     : <FlatList
                            style={{ marginBottom: 60, }}
                            data={getAlbumData}
                            extraData = {this.state}
                            ItemSeparatorComponent={this.seperator()}
                            renderItem={({ item,index }) => (
                             this.renderAlbums(item,index)
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={false}
                            numColumns={2} 
                        />
                    }

                {/* Modal screen */}

                <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}
                    onBackButtonPress={() => this.setState({ isModalVisible: false })} >
                     <View style={styles1.modalContent}>
                    <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/>
                    <View style={{ marginTop: 15, }}>
                            <TouchableOpacity onPress={() => this.addAlbum()}>
                                <Text style={[styles1.modalText,{ color: '#010101'}]}>
                                    Add Albums
                                            </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles1.horizontalSeparator} />
                        <View style={{ marginTop: 7, marginBottom: 15 }}>
                            <TouchableOpacity onPress={() => { this.state.getAlbumData.length > 0 ?
                             this.nextModal() :null }}>
                            <Text style={[styles1.modalText,{ color: '#f00'}]}>
                                    Delete
                                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    isVisible={this.state.deleteModal == 1}
                    onSwipeComplete={this.close}
                    swipeDirection={['down']}
                    style={styles.view}
                //styles.view
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
                             backgroundColor: '#fff'
                        }}>
                            <View >
                            
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.destroyModal()}>
                                    <Image style={{ width: 22, height: 22, marginRight: 20 }}
                                        source={require('../../Assets/Images/close.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={this.state.getAlbumData}
                            ItemSeparatorComponent={this.seperator()}
                            extraData={this.state}
                            renderItem={({ item, index }) => (
                                <ScrollView>
                                    <TouchableOpacity onPress={() => this._selectedListForDel(item)}>
                                        <View style={{ flexDirection: 'row', height: 80, width: wp('100%'), justifyContent: 'flex-start' }}>
                                            <View style={{ width: wp('2%') }} />
                                            <View style={{ width: wp('15%') }}>
                                                {item.albumimg.length > 0 ?
                                                    <Image style={{ width: 50, height: 50, borderRadius: 10, margin: 10 }}
                                                        source={{ uri: serviceUrl.album_image + item.albumimg[0].Image }} />

                                                    :
                                                    <View style={{ width: 50, height: 50, borderRadius: 10, margin: 10, backgroundColor: '#c1c1c1' }}
                                                    />
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
                                </ScrollView>
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

                <FooterTabBar {...this.props} tab={3} />
            </View >
        )
    }
}
