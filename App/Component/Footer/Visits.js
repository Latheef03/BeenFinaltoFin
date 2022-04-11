import React, { Component, useRef,createRef } from 'react';
import {
    Text, StyleSheet, Image, FitImage, ImageBackground,
    View, ToastAndroid, TextInput, StatusBar, TouchableOpacity, ScrollView, FlatList,
    Modal as RNModal,Animated,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { toastMsg } from '../../Assets/Script/Helper';
import LinearGradient from "react-native-linear-gradient";
import { postServiceP01 } from 'Been/App/Component/_services';
import Spinner from '../../Assets/Script/Loader';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color,TitleHeader } from '../../Assets/Colors'
import common_styles from "../../Assets/Styles/Common_Style"
import { Toolbar, FooterTabBar } from '../commoncomponent'
import styles1 from '../../styles/NewfeedImagePost';
import {invalidText} from '../_utils/CommonUtils';
import ImageView from 'react-native-image-view';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import StoryContainer1 from '../Story/StoryContainer1'
const { profilePic } = serviceUrl;
const modalScroll = createRef()

export default class Visits extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            userName: '',
            getAlbumData: '',
            getMemoryData: '',
            isModalVisible: false,
            customsVisible: false,
            no_record_found: false,
            isLoading: false,
            visitMessage: '',
            deleteimage: '',
            addVisits: '',
            imageDeleteModal: '',
            passingValue: '',
            followersForVisits: [],
            fetchingData : false,
            imageView : false,
            imageViewIndex : 0,
            rnmodal : false,
            imageViewData : [],
            currentScrollValue : 0,
            isTick:false,
            isTickStatus:0
        }
        this.arrayholder1 = [];
    }

    componentWillMount() {

        this.visitsGet();
        this._followersListForVisits();
    }
    componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.visitsGet();
            }
        );
    };

    onStoryNext = (isScroll) => {
        const {imageViewData,imageViewIndex} = this.state
        const newIndex = imageViewIndex + 1;
        if (imageViewData.length - 1 > imageViewIndex) {
            this.setState({
                imageViewIndex : newIndex
            })
          if (!isScroll) {
            modalScroll.current.scrollTo(newIndex, true);
          }
        } else {
            this.setState({rnmodal:false})
        }
      };

      onStoryPrevious = (isScroll) => {
        const {imageViewIndex} = this.state
        const newIndex = imageViewIndex - 1;
        if (imageViewIndex > 0) {
            this.setState({
                imageViewIndex : newIndex
            })
          if (!isScroll) {
            modalScroll.current.scrollTo(newIndex, true);
          }
        }
      };

      onScrollChange = (scrollValue) => {
          const {currentScrollValue} = this.state
        if (currentScrollValue > scrollValue) {
          this.onStoryNext(true);
          console.log('next');
          this.setState({
            currentScrollValue : scrollValue
          })
        }
        if (currentScrollValue < scrollValue) {
          this.onStoryPrevious();
          console.log('previous');
          this.setState({
            currentScrollValue : scrollValue
          })
        }
      };

    visitsImageView = (items,index,itm) => {
        console.log('the items of visits',items);
        console.log('the items of index',index);
        console.log('itm ,--',itm)
    //    const getItemData = items.data.map(d=>{ 
    //       return {
    //         ProfileType : d.ProfileType,
    //         Seen_status : d.isSeen ,
    //         UserName : d.UserName,
    //         UserProfilePic : d.UserProfilePic,
    //         story : items.data,
    //         userId : d.UserId 
    //       } 
    //    })
        // console.log('the viwe data',getItemData);
        // console.log('refs',modalScroll);
        const extraStory = itm.data.filter(item=> item?.storyId?.includes(items._id))
        console.log('extraStory',extraStory);
        delete itm.story
        const story = {...itm,story : [items].concat(extraStory)}
        console.log('the story',story)
        this.setState({
            rnmodal: true,
            imageViewIndex : 0,
            imageViewData: [story]
        });
    }

    async visitsGet() {
        //debugger;
        var id = await AsyncStorage.getItem('userId');
        var data = { UserId: id };
        const url = serviceUrl.been_url + '/GetVisits';
        this.setState({ isLoading: true,fetchingData:true });
       
        fetch(url, {
            method: 'post',
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('the responseJson',responseJson);
                if (responseJson.status == "True") {

                    let resp = responseJson.result;

                    responseJson.result.length > 0 && responseJson.result.map(res => {
                        let alldel = 0, atleastoneDel = 0;
                        res.data.length > 0 && res.data.map((vi, ind) => {

                            if (vi.visitsDelete == 'Yup') {
                                alldel++
                                res.count = res.data.length - alldel;
                            }
                           
                            if (alldel == res.data.length) {
                                res.visitsDelete = 'Yup',
                                    res.count = 0
                            }
                          
                            return vi;
                        })
                        return res;
                    })

                    responseJson.result.length > 0 && responseJson.result.map(res => {
                        res.data.length > 0 && res.data.map((vi, ind) => {
                            if(ind == 0){
                                res.ProfileType = vi.ProfileType
                                res.Seen_status = vi.isSeen
                                res.UserName = vi.UserName
                                res.UserProfilePic = vi.ProfilePic
                                res.userId = vi.UserId
                            }
                            res.story = res.data
                            return vi
                        })
                        return res
                    })


                    

                    console.log('rendered resp ', resp)
                    this.setState({
                        visitMessage: resp,
                        isLoading: false,
                        no_record_found: false,
                        fetchingData : false
                    })
                }
                else {
                    this.setState({
                        isLoading: false,
                        no_record_found: true,
                        fetchingData : false
                    });
                }
            })
    }

    _followersListForVisits = async () => {
        let apiname = 'FollowersList';
        let data = {
            Userid: await AsyncStorage.getItem('userId')
        }
        postServiceP01(apiname, data).then(resp => {
            // console.log('followees resp',resp);
            if (resp.status == 'True') {
                this._dataManipulation(resp)
            } else {
                //toastMsg('danger', resp.message);
            }

        }).catch(err => {
            console.log(err)
            //toastMsg('danger', 'Sorry..something wrong in network,try again once');
        })

    };


    menuPrivacy = async (value,status) => {
        const { passingValue } = this.state;
        console.log("Value is ",value);
        if(value === "public")
        {
         this.setState({isTick:true,isTickStatus:status})
        }
        if(value === "only me")
        {
         this.setState({isTick:true,isTickStatus:status})
        }
        let apiname = 'VisitsPrivacySettings';
        let data = {
            userId: await AsyncStorage.getItem('userId'),
            privacyData: value, 
            placeName: passingValue._id
        }
        console.log('the data menu',data);
        this.setState({ isModalVisible: false,})
        postServiceP01(apiname, data).then(resp => {
            console.log('the privacy',resp);
            if (resp.status == 'True') {
                this.visitsGet();
            }
        }).catch(err => {
            console.log(err)
        })

    };

    _dataManipulation = (data) => {
        let datas = data.result.length > 0 && data.result.map(m => {
            m.selected = false
            data.selectedUsers.length > 0 && data.selectedUsers.map(s => {
                if (m._id == s) {
                    m.selected = true
                }
            })
            return m;
        })

        this.setState({
            followersForVisits: datas
        })
        this.arrayholder1 = datas;
    }

    SearchFilterFunction(text) {
       // debugger;
        //passing the inserted text in textinput
        const newData = this.arrayholder1.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            followersForVisits: newData,
            text: text
        });
    }

    customSettingsForVisits = (status) => {
        if(status === "3"){
            this.setState({isTickStatus:true})
        }
        this.setState({ isModalVisible : false,isTick:true },() => {
            setTimeout(() => {
                this.setState({
                    customsVisible: true
                })
            },300)
        })
    };

    _selectedListForShow = (data) => {
        // alert('ss')
        data.selected = !data.selected;
        const index = this.state.followersForVisits.findIndex(
            item => data._id === item._id
        );
        this.state.followersForVisits[index] = data;
        this.setState({ followersForVisits: this.state.followersForVisits });
    };

    _goAndShowTheVistis = async () => {
        const { followersForVisits } = this.state;
        let apiname = 'CustomSettingsFotVisit';
        let selectedFollwees = followersForVisits.filter(v => v.selected).map(d => d._id);
        let data = {
            FollowersID: selectedFollwees,
            Userid: await AsyncStorage.getItem('userId')
        }
        console.log(data)
        this.setState({ customsVisible: false, isModalVisible: false })
        postServiceP01(apiname, data).then(resp => {
            // console.log('followees resp',resp);
            if (resp.status == 'True') {

            } else {
                //toastMsg('danger', resp.message);
            }

        }).catch(err => {
            console.log(err)
            //toastMsg('danger', 'Sorry..something wrong in network,try again once');
        })
    };



    backArrow() {
        this.props.navigation.goBack();
    }
    memories() {
        this.props.navigation.navigate('UserProfileMemories');
    }
    albums() {
        this.props.navigation.navigate('UserProfileAlbums');
    }
    vlog() {
        this.props.navigation.navigate('VlogGet');
    }

    addmoreVisits(e) {
        // debugger
        // console.log('the add more visitrs',e);
        this.props.navigation.navigate('AddVisits', { visitData: e })
    }


    deleteData(data) {
        this.setState({
            deleteimage: data._id,
            isModalVisible: true
        });
        this.delete();
    }

    renderRightImg() {
        return <View >
            {/* <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image source={require('../../Assets/Images/setting.png')} resizeMode={'stretch'} style={{ width: 20, height: 24, }} />
            </TouchableOpacity> */}
        </View>
    }

    renderRightImgdone() {
        return <View >
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.setState({ addVisits: '' })} >
                <Text style={{ color: '#1d5bf0' }}>Done</Text>
            </TouchableOpacity>
        </View>
    }

    menuData(item) {
        debugger
        this.setState({isModalVisible: true,passingValue: item })
    }

    render() {
        const { fetchingData, visitMessage,imageView } = this.state;
        return (
            <View style={{ flex: 1,marginTop:0,backgroundColor:'#fff' }}>
                <Toolbar {...this.props}icon={"Down"} centerTitle="Visits" rightImgView={this.renderRightImg()} />
                <StatusBar backgroundColor={imageView ? 'rgba(0,0,0,1)' : '#fff'} barStyle={imageView ? 'light-content' : 'dark-content'} animated={true} />

                {fetchingData ?
                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: '22%' }}>
                        <Spinner color="#64b3f2" />
                    </View>
                    : !fetchingData && visitMessage.length == 0 ?
                        <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                            <View style={styles.hasNoMem}>
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                <Text style={Common_Style.noDataText}> You have not created any Visits yet!</Text>
                            </View>
                        </View>
                        :
                        <FlatList
                            style={{  }}
                            ListFooterComponent={<View style={{height:110}} />}
                            data={visitMessage}
                            renderItem={({ item, index }) => (
                                <View key={`id${index}`}>
                                    {item.visitsDelete === "Yup" ? null :
                                        (<View >
                                            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                                <Text style={[styles.visitFont, { marginTop: index === 0 ? 0 : 20,fontFamily:'arial' }]}>{`${item._id},${item.data[0].Country} (${item.data.length})`}</Text>
                                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.menuData(item)}>
                                                    <Image source={require('../../Assets/Images/earth.png')} tintColor={'#000'} resizeMode={'stretch'} style={{ width: 13, height: 13, marginTop: index === 0 ? 0 : 20 }} />
                                                </TouchableOpacity>
                                            </View>
                                            
                                            <ScrollView horizontal={true}
                                             showsHorizontalScrollIndicator={false}
                                            >
                                                {item.data.map((data, index) => {
                                                    // console.log('the data',data);
                                                    const {Events} = data
                                                    const {transforms} = Events
                                                    
                                                    const widthP = wp(25)
                                                    const heightP = hp(21)
                                                    // console.log('the width',widthP , heightP , transforms?.scale);
                                                    const divi = widthP/heightP
                                                    const scaleP = divi * transforms?.scale
                                                    const rotateP = divi *  transforms?.rotate
                                                    const tiltP = divi *  transforms?.tilt
                                                    // console.log(transforms?.tilt)
                                                    /**@MainImage */
                                                    const scale = typeof scaleP == 'number' ? 1 : scaleP
                                                    // //transforms && transforms.scale ? transforms.scale : 1;
                                                    // const rValue = 0
                                                    // //transforms && transforms.rotate ? transforms.rotate : 0;
                                                    // const tValue = 0
                                                    //typeof tiltP == 'number' ? 0 : tiltP
                                                    //transforms && transforms.tilt ? transforms.tilt : 0;
                                                    // let rotate = new Animated.Value(rValue);
                                                    // const rStr = rotate.interpolate({
                                                    //     inputRange: [-100, 100],
                                                    //     outputRange: ["-100rad", "100rad"],
                                                    // });
                                                    // let tilt = new Animated.Value(tValue);
                                                    // const tStr = tilt.interpolate({
                                                    //     inputRange: [-501, -500, 0, 1],
                                                    //     outputRange: ["1rad", "1rad", "0rad", "0rad"],
                                                    // });
                                                    // console.log('!item.storyId',item)
                                                    return (
                                                        // index == 0 && 
                                                !data.storyId && 
                                                        <View key={`id${index}`} style={{
                                                            marginTop: hp('1%'), 
                                                            marginRight: wp('3%'), 
                                                            marginLeft: 8, width: wp(25), 
                                                            height: hp(21), borderRadius: 8, 
                                                            overflow: 'hidden', 
                                                            backgroundColor: '#c1c1c1',
                                                            shadowOffset: { width: 10, height: 10 }, shadowColor: 'grey', shadowOpacity: 1, elevation: 8,
                                                         }}>

                                                            {data.visitsDelete === "Yup" ? null : (

                                                                <TouchableOpacity delayLongPress={250} onLongPress={(e) => { this.addmoreVisits(this.state.visitMessage) }}
                                                                 onPress={()=>this.visitsImageView(data,index,item)}>
                                                                    {data.visitsDelete === "Yup" ? null : (
                                                                        <>
                                                                         <ImageBackground
                                                                            source={{ uri: serviceUrl.StatusImage + data.pic }}
                                                                            style={{ width: "100%", height: "100%" }}
                                                                            resizeMode={'cover'}
                                                                            blurRadius={200}
                                                                         />
                                                                         <View style={{ ...StyleSheet.absoluteFillObject }}>
                                                                            <View
                                                                                style={{
                                                                                overflow: "hidden",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                }} >
                                                                                <Animated.Image source={{ uri: serviceUrl.StatusImage + data.pic }}
                                                                                    resizeMode={'cover'} 
                                                                                    style={{ width: '100%', height: '100%',
                                                                                    transform: [
                                                                                        { perspective: 200 },
                                                                                        { scale: scale },
                                                                                        // { rotate: rStr },
                                                                                        // { rotateX: tStr },
                                                                                      ],
                                                                                     }}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                     </>

                                                                    )}
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>);
                                                })}
                                            </ScrollView>
                                            
                                        </View>)}
                                </View>)}
                                keyExtractor={(item, index) => index.toString()}
                        />
                }

                {/* Modal screen */}
                <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}
                    onBackButtonPress={() => this.setState({ isModalVisible: false })} >
                    <View style={styles1.modalContent}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                       
                        <View style={{ marginTop: 15,flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center' }}>
                            <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',width:'90%'}} onPress={() => this.menuPrivacy('public',1)}>
                                <Text style={styles1.modalText}>  Public</Text>

                            </TouchableOpacity>
                            <View style={{width:'10%',justifyContent:'center',alignItems:'center',}}>
                            {this.state.isTick && this.state.isTickStatus === 1 && <Image style={{width: 18, height: 18,}} source={require('../../Assets/Images/singletick.png')} />}
                            </View>
                        </View>
                        
                        <View style={styles1.horizontalSeparator} />
                        
                        <View style={{ marginTop: 7,flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center'  }}>
                            <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',width:'90%'}} onPress={() => this.menuPrivacy('only me',2)}>
                                <Text style={styles1.modalText}>Only Me</Text>
                            </TouchableOpacity>
                            <View style={{width:'10%',justifyContent:'center',alignItems:'center',}}>
                            {this.state.isTick && this.state.isTickStatus === 2 && <Image style={{width: 18, height: 18,}} source={require('../../Assets/Images/singletick.png')} />}
                            </View>
                        </View>
                        
                        <View style={styles1.horizontalSeparator} />
                        
                        <View style={{ marginTop: 7, marginBottom: 15,flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center' }}>
                            <TouchableOpacity style={{alignSelf:'center',justifyContent:'center',width:'90%'}} onPress={() => { this.customSettingsForVisits(3) }}>
                                <Text style={styles1.modalText}>Customs</Text>
                            </TouchableOpacity>
                            <View style={{width:'10%',justifyContent:'center',alignItems:'center',}}>
                            {this.state.isTick && this.state.isTickStatus === 3 && <Image style={{width: 18, height: 18,}} source={require('../../Assets/Images/singletick.png')} />}
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* customs user modal */}
                <Modal
                    isVisible={this.state.customsVisible}
                    onSwipeComplete={this.close}
                    swipeDirection={['down']}
                    style={styles.view}>
                    <View style={{...Common_Style.modalContent,borderRadius:0,borderTopRightRadius:25,borderTopLeftRadius:25}} >
                        <StatusBar backgroundColor="rgba(0,0,0,1)" barStyle="light-content" />
                        <View style={{ flexDirection: 'row', width: wp('100%'), justifyContent: 'space-between', height: 30, marginTop: 10 }}>
                            <View style={{ width: wp('75%') }}>
                                <Text style={{ fontSize: 18, color: '#383838', marginLeft: 25, fontFamily: Common_Color.fontBold }}>
                                    Who can see this?
                                 </Text>
                            </View>
                            <View style={{ width: wp('10%') }}>
                                <TouchableOpacity onPress={() => { this.setState({ customsVisible: false, isModalVisible: false }) }}>
                                    <Image style={{ width: 18, height: 20, }} tintColor={'#000'}
                                        source={require('../../Assets/Images/close.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[Common_Style.searchView, { margin: 5 }]}>
                            <TextInput value={this.state.text}
                                style={[Common_Style.searchTextInput, { width: wp(90) }]}
                                placeholder={'Search'}
                                autoCorrect={false}
                                keyboardType="default"
                                onChangeText={text => this.SearchFilterFunction(text)}
                                placeholderTextColor={'#6c6c6c'}>
                            </TextInput>
                        </View>


                        <ScrollView contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}>
                            <View style={{ height: 280 }}>
                                <FlatList data={this.state.followersForVisits}
                                    // ItemSeparatorComponent={this.seperator()}
                                    extraData={this.state}
                                    renderItem={({ item, index }) => (
                                        <ScrollView>
                                            <TouchableOpacity onPress={() => this._selectedListForShow(item)}>
                                                <View style={{ flexDirection: 'row', height: 80, width: wp('100%'), justifyContent: 'flex-start' }}>
                                                    <View style={{ width: wp('2%') }} />
                                                    <View style={{ width: wp('15%') }}>
                                                        {item.ProfilePic != null ?
                                                            <Image style={{ width: 50, height: 50, borderRadius: 25, margin: 10 }}
                                                                source={{ uri: profilePic + item.ProfilePic }} />
                                                            :
                                                            <View style={{ width: 50, height: 50, borderRadius: 25, margin: 10, backgroundColor: 'grey' }}
                                                            />
                                                        }
                                                    </View>
                                                    <View style={{ width: wp('70%'), marginTop: 5, marginLeft: 5 }}>
                                                        <Text style={{ marginTop: 20, fontSize: 16, marginLeft: 5, fontFamily: Common_Color.fontMedium }}>
                                                            {item.UserName}
                                                        </Text>
                                                    </View>

                                                    <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                                                        {item.selected === true ?
                                                            <Image style={{ width: 22, height: 22, }}
                                                                source={require('../../Assets/Images/singletick.png')} />
                                                            : null
                                                        }
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </ScrollView>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={false}
                                />
                            </View>
                        </ScrollView>


                        <TouchableOpacity activeOpacity={1} onPress={() => this._goAndShowTheVistis()}>

                            <View style={[common_styles.Common_button, { width: wp('97%'), marginBottom: 10 }]}>
                                <ImageBackground source={require('../../Assets/Images/button.png')}
                                    style={{ width: '100%', height: '100%' }}
                                    borderRadius={10}
                                >
                                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                        onPress={() => this._goAndShowTheVistis()}>
                                        <Text style={common_styles.Common_btn_txt}>Show</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Modal>
                {/*end customs user modal */}

                <FooterTabBar {...this.props} tab={2} />
                 {/* <ImageView
                    images={this.state.imageViewData}
                    imageIndex={this.state.imageViewIndex}
                    isVisible={this.state.imageView}
                    onClose = {()=>this.setState({imageView:false})}
                    animationType = 'slide'
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
                  /> */}

                <RNModal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.rnmodal}
                    style={{ flex: 1 }}
                    onShow={() => {
                        if (this.state.imageViewIndex > 0) { modalScroll.current.scrollTo(this.state.imageViewIndex, false); }
                    }}
                    onRequestClose={() => this.setState({ rnmodal: false })}
                >

                    {/* eslint-disable-next-line max-len */}
                    <CubeNavigationHorizontal 
                      callBackAfterSwipe={g => this.onScrollChange(g)} 
                      ref={modalScroll}
                      style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: 'transparent', width: '100%' }}>

                        {this.state.imageViewData.length > 0 &&
                            this.state.imageViewData.map((item, index) => (
                                <StoryContainer1
                                    key={index.toString()}
                                    onClose={() => this.setState({ rnmodal: false })}
                                    onStoryNext={this.onStoryNext}
                                    onStoryPrevious={this.onStoryPrevious}
                                    user={item}
                                    isNewStory={index !== this.state.imageViewIndex}
                                    navigation={this.props}
                                />
                            ))}
                    </CubeNavigationHorizontal>
                </RNModal>

            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' },
        card: { width: wp('95%'), height: hp('75'), borderWidth: 1, borderRadius: 10, borderColor: '#ddd', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 10, shadowRadius: 10, elevation: 4, marginLeft: 'auto', marginRight: 'auto', marginTop: 5, marginBottom: 5, backgroundColor: '#fff', },
        imageView1: { height: 333, width: "97%" },
        view: { justifyContent: 'flex-end', width: wp('100%'), margin: 0, borderTopLeftRadius: 0 },
        container2: { flexDirection: 'row', width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1.5%', position: 'absolute', bottom: 24 },
        icon: { width: 15, height: 20 },
        searchBar: { flexDirection: 'row', width: wp('90%'), backgroundColor: '#ffffff', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 10, padding: 15, borderWidth: 1.2, borderColor: '#ededef', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
        textInput: { width: wp('90%'), height: 45, marginBottom: 10, color: '#000', marginTop: 12, padding: 15, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', fontFamily: Common_Color.fontMedium },
        footericon: { width: '23%', marginLeft: '5%' },
        fontColor: { color: '#b4b4b4' },
        modalText: { color: '#000', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontFamily: Common_Color.fontMedium },
        // footer font
        fontsize: { fontSize: 12, color: '#010101', fontWeight: 'normal', },
        footerIconImage: { width: wp(8), height: hp(4.5), },
        modalView: { width: wp('90%'), height: hp('20%'), backgroundColor: '#fff', borderRadius: 5 },
        modalView1: { width: wp('90%'), height: hp('13%'), backgroundColor: '#fff', borderRadius: 8 },
        modalView2: { width: wp('90%'), height: hp('33.5%'), backgroundColor: '#fff', borderRadius: 8 },
        visitFont: { color: '#010101', width: wp('91%'),  fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, },
        //add visit style
        addView: { marginTop: hp('2%'), marginRight: wp('3%'), },
        imageBackground: { width: wp(20), height: hp(15) },
        imageBackgroundView: { width: wp(4), height: hp(2.5), backgroundColor: '#fff', marginLeft: wp(16.5), borderRadius: 50 },
        addMore: { fontSize: wp(2.8), textAlign: 'center', marginTop: hp(0.5), color: '#1d5bf0' },
        hasNoMem: { justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
        hideButton: { alignItems: "center", justifyContent: "center", height: hp("6%"), width: wp("100%"), },
        LoginButtontxt: { color: "#fff", justifyContent: "center", textAlign: "center", fontSize: 16, fontFamily: Common_Color.fontBold },
    },
)