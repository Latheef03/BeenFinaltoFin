import React, { Component,createRef } from 'react';
import {
    Text, StyleSheet, Image, FitImage, ImageBackground,
    View, ToastAndroid, TextInput, ActivityIndicator, TouchableOpacity, ScrollView, FlatList,
    StatusBar,Modal as RNModal
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { toastMsg } from '../../Assets/Script/Helper';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color } from '../../Assets/Colors'
import { Toolbar,FooterTabBar1 } from '../commoncomponent'
import Spinner from '../../Assets/Script/Loader';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import LinearGradient from "react-native-linear-gradient";
import {invalidText} from '../_utils/CommonUtils';
import ImageView from 'react-native-image-view';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import StoryContainer from '../Story/StoryContainer'
const modalScroll = createRef()

export default class OtherVisits extends Component {

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
            visitMessage: '',
            deleteimage: '',
            addVisits: '',
            imageDeleteModal: '',
            otherid: "",
            no_record_found: false,
            isLoading: false,otherid:'',
            imageView : false,
            imageViewIndex : 0,
            rnmodal : false,
            imageViewData : [],
            currentScrollValue : 0
        }
    }

    async componentWillMount() {
        const { navigation } = this.props;
        var id1 = await AsyncStorage.getItem("OtherUserId");
        const Comments = this.props.route.params?.data
        if (Comments != undefined || null) {
            this.setState({
                otherid: Comments.otherid == undefined ? id1 : Comments.otherid,
                userName: Comments.userName
            });
        }
        this.visitsGet();
    }
  async componentDidMount () {
    this.focusSubscription = this.props.navigation.addListener(
        "focus",
        () => {
            console.log('this props',this.props);
            const { navigation } = this.props;
            const Comments = this.props.route.params?.data
            if(Comments!=undefined||null){
            this.setState({
                otherid: Comments.otherid == undefined ? id1 : Comments.otherid,
                userName: Comments.userName
            });
        }
            this.visitsGet();
            // navigation.state.params = {loader:false};
           
            console.log('the comments',Comments);
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

    visitsImageView = (items,index) => {
        // console.log('items',items);
        const getItemData = items.data.map(d=>{ 
            return {
              ProfileType : d.ProfileType,
              Seen_status : d.isSeen ,
              UserName : d.UserName,
              UserProfilePic : d.ProfilePic,
              story : [d],
              userId : d.UserId 
            } 
         })
         console.log('items',getItemData);
          this.setState({
              rnmodal: true,
              imageViewIndex : index,
              imageViewData: getItemData
          });
     }

    async visitsGet() {
       // debugger;
        var id = await AsyncStorage.getItem('userId');
        var GetOtherId = await AsyncStorage.getItem('OtherUserId')
        this.setState({ isLoading: true });
        var data = {

            UserId: id,
            followedId: GetOtherId

        };
        const url = serviceUrl.been_url + '/GetVisits';
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    let resp = responseJson.result;
                    responseJson.result.length > 0 && responseJson.result.map(res => {
                        let alldel = 0, atleastoneDel = 0;
                        res.data.length > 0 && res.data.map((vi, ind) => {

                            if (vi.visitsDelete == 'Yup') {
                                alldel++
                                res.count = res.data.length - alldel;
                            }
                            console.log('alldel count', alldel, '--- ind count', res.data.length)

                            if (alldel == res.data.length) {
                                res.visitsDelete = 'Yup',
                                    res.count = 0
                            }
                        })
                        return res;
                    })

                    console.log('rendered resp ', resp)
                    this.setState({
                        visitMessage: resp,
                        isLoading: false,
                        no_record_found: false
                    })
                }
                else {
                    this.setState({
                        isLoading: false,
                        no_record_found: true,

                    });
                }
            })
    }

    backArrow() {
        this.props.navigation.navigate('OtherUserProfile');
    }


    deleteData(data) {
        this.setState({
            deleteimage: data._id,
            isModalVisible: true
        });
        this.delete();
    }

    renderRightImgdone() {
        return <View>
            <View style={[stylesFromToolbar.leftIconContainer,{flexDirection:'row',}]}>
              <View >
                <Image  style={{ width: 20, height: 20 }} />
              </View>
            </View>
        </View>
      }



    render() {
        const {imageView} = this.state
        return (
            <View style={{ flex: 1,marginTop: 0,backgroundColor:'#fff'}}>
                {/* header of screen */}
                <Toolbar  {...this.props} icon={"Down1"} centerTitle="Visits" rightImgView={this.renderRightImgdone()} />
                <StatusBar backgroundColor={imageView ? 'rgba(0,0,0,1)' : '#fff'} 
                barStyle={imageView ? 'light-content' : 'dark-content'} 
                animated={true} />
                {/* <Content> */}

                    {/* <ScrollView> */}
                    {this.state.isLoading != true ?
                        <FlatList data={this.state.visitMessage}
                            style={{ }}
                            ListFooterComponent={<View style={{height:75}} />}
                            renderItem={({ item }) => (
                                <View>
                                    {item.visitsDelete === "Yup" ? null :
                                        (<View>
                                            <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                                                <Text style={styles.visitFont}>{`${item._id} (${item.count})`}</Text>
                                            </View>

                                            <ScrollView horizontal={true}>
                                                {item.data.map((data,index) => {
                                                    return (
                                                        <View style={{ marginTop: hp('1%'), marginRight: wp('3%'), marginLeft: 8, width: wp(25), height: hp(21), borderRadius: 8, overflow: 'hidden', backgroundColor: '#c1c1c1', shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, }}>
                                                            {data.visitsDelete === "Yup" ? null : (
                                                                <View >
                                                                    {/* <TouchableOpacity onLongPress={() => { this.setState({ addVisits: 1 }) }}> */}
                                                                    <TouchableOpacity onPress={()=>this.visitsImageView(item,index)}>
                                                                        {data.visitsDelete === "Yup" ? null : (<Image source={{
                                                                            uri: serviceUrl.StatusImage + data.pic
                                                                        }}
                                                                            resizeMode={'stretch'} style={{ width: '100%', height: '100%' }}
                                                                        />)}

                                                                    </TouchableOpacity>
                                                                </View>)}
                                                        </View>
                                                    );
                                                }
                                                )
                                                }
                                            </ScrollView>
                                        </View>)}
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        :
                        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: '30%' }}>
                            <Spinner color="#64b3f2" />
                        </View>}

                    <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                        {this.state.no_record_found === true ? (
                            <View style={styles.hasNoMem}>
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                <Text style={Common_Style.noDataText}> Nothing created yet!!</Text>
                            </View>
                        ) : null}
                    </View>

                {/* </Content> */}

                <FooterTabBar1 {...this.props} tab={2} />
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
                    <CubeNavigationHorizontal callBackAfterSwipe={g => this.onScrollChange(g)} ref={modalScroll}
                        style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: 'transparent', width: '100%' }}>

                        {this.state.imageViewData.length > 0 &&
                            this.state.imageViewData.map((item, index) => (
                                <StoryContainer
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
        icon: { width: 15, height: 20 },
        searchBar: { flexDirection: 'row', width: wp('90%'), backgroundColor: '#ffffff', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 10, padding: 15, borderWidth: 1.2, borderColor: '#ededef', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
        textInput: { width: wp('90%'), height: 45, marginBottom: 10, color: '#000', marginTop: 12, padding: 15, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', fontFamily: Common_Color.fontMedium },
        fontColor: { color: '#b4b4b4' },
        modalText: { color: '#000', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontFamily: Common_Color.fontMedium },
        // footer font
        fontsize: { fontSize: 12, color: '#010101', fontWeight: 'normal', },
        modalView: { width: wp('90%'), height: hp('20%'), backgroundColor: '#fff', borderRadius: 5 },
        modalView1: { width: wp('90%'), height: hp('13%'), backgroundColor: '#fff', borderRadius: 8 },
        modalView2: { width: wp('90%'), height: hp('33.5%'), backgroundColor: '#fff', borderRadius: 8 },
        visitFont: { color: '#010101', marginTop: 20, width: wp('91%'), fontFamily: Common_Color.fontBold, fontSize: 14 },

        //add visit style
        addView: { marginTop: hp('2%'), marginRight: wp('3%'), },
        imageBackground: { width: wp(20), height: hp(15) },
        imageBackgroundView: { width: wp(4), height: hp(2.5), backgroundColor: '#fff', marginLeft: wp(16.5), borderRadius: 50 },
        addMore: { fontSize: wp(2.8), textAlign: 'center', marginTop: hp(0.5), color: '#1d5bf0' },
        hasNoMem: { justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
        hideButton: { alignItems: "center", justifyContent: "center", height: hp("6%"), width: wp("100%"), },
        LoginButtontxt: { color: "#fff", justifyContent: "center", textAlign: "center", fontSize: 16, fontFamily: Common_Color.fontBold },


        footericon: { width: '23%', marginLeft: '5%', marginBottom: '2%', alignItems: 'center', justifyContent: 'center', marginBottom: 8, flex: 1, },
        fontsize: { fontSize: 9, color: '#010101', fontFamily: Common_Color.fontLight, textAlign: 'center' },
        footerIconImage: { width: wp(8), height: hp(4.5), },
        container2: { flexDirection: 'row', width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1.5%', position: 'absolute', bottom: 5 },
    },
)