import React, { Component,createRef } from 'react'
import {
    Text, StyleSheet, Image, FitImage, StatusBar, ImageBackground, Dimensions,
    View, ToastAndroid, TouchableWithoutFeedback, TouchableOpacity, ScrollView, FlatList, TextInput,
    Modal as RNModal,StatusBarIOS
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Content } from 'native-base';
import Common_Style from '../../Assets/Styles/Common_Style'
import {Common_Color, TitleHeader} from '../../Assets/Colors'
import { Toolbar } from '../commoncomponent'
import serviceUrl from '../../Assets/Script/Service';
import LinearGradient from "react-native-linear-gradient";
import ImageView from 'react-native-image-view';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import StoryContainer from '../Story/StoryContainer'
const modalScroll = createRef()

const { width, height } = Dimensions.get("window");
export default class OtherFootPrints extends Component {
    
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {
            dataSource: '',
            convertedImages1: '',
            footPrintsScreen: 0,
            isModalVisible: false,
            followers: 0,
            search: '',
            footPrints: [],
            Visitscount: 0,
            memories: [],
            vlog:[],
            MemoriesCount: 0,
            selectedFPTitle: '',
            selectedFPTitleImg: '',
            imageFrom: '',
            selectedFPVisits: [],
            memoriesList: [],
            videoList: [],
            imageView : false,
            imageViewIndex : 0,
            rnmodal : false,
            imageViewData : [],
            currentScrollValue : 0
        }
    }

    UNSAFE_componentWillMount() {
        
        const datas = this.props.route.params?.data
        this.getFootPrintsData(datas);
    }

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

    visitsViewImage = (index)=>{
        const {selectedFPVisits} = this.state;
        const {data} = selectedFPVisits
        const getItemData = data.map(d=>{ 
            return {
              ProfileType : d.ProfileType,
              Seen_status : d.isSeen ,
              UserName : d.UserName,
              UserProfilePic : d.ProfilePic,
              story : [d],
              userId : d.UserId 
            } 
         });
        //  console.log('the get item',getItemData);
        this.setState({
            rnmodal: true,
            imageViewIndex : index,
            imageViewData: getItemData
        })
    }

    getFootPrintsData(datas) {
        debugger
        console.log('datas get fp other', datas);
        if (datas && datas.status == "True") {
            this.setState({
                footPrints: datas.Footprints,
                Visitscount: datas.Visitscount,
                memories: datas.memories,
                vlog: datas.Vlog,
                MemoriesCount: datas.MemoriesCount,
                visits: datas.result
            })
        }
        else {
            this.setState({
                footPrints: [],
                memories: [],
                vlog: [],
                visits: []
            })
        }
    }

    seperator() {
        <View style={{ width: "50%", margin: '5%' }}></View>
    }

    navigation() {
        this.setState({ userProfileScreen: 1, })
    }

    backArrow() {
        this.setState({ userProfileScreen: 0, })
    }

    goBack = () => {
        if (this.state.footPrintsScreen === 1) {
            this.setState({
                footPrintsScreen: 0
            })
        } else {
            this.props.navigation.goBack();
        }
    }

    footPrintsScreen(title, datas) {
       // debugger;
       console.log('the titel',title);
        const { footPrints, memories, vlog,visits } = this.state;
        let totalDatas;
        let memoriesDetails = [];
        let vlogDetails = [];
        let totalVists = [];

        footPrints && footPrints.length > 0 && footPrints.map(data => {
            if (data._id == title) {
                totalDatas = data;
            }
        })

        visits && visits.length > 0 && visits.map(data => {
            if (data._id == title) {
                totalVists = data;
            } 
        })

        memoriesDetails = memories && memories.length > 0 && memories.filter(m =>
            m.Location == title)

        vlogDetails = vlog && vlog.length > 0 && vlog.filter(
            video => video.Location == title
        )

        this.setState({
            footPrintsScreen: 1,
            selectedFPTitle: title,
            imageFrom: datas[0].From,
            selectedFPTitleImg: datas[0].pic,
            selectedFPVisits: totalVists,
            memoriesList: memoriesDetails,
            videoList: vlogDetails
        })
    }

    redirectToListView = (mem,type) =>{
        const {memoriesList,videoList} = this.state
        let memoryData = {}
        memoryData.result = type == 'vlog' ? videoList : memoriesList;
        memoryData.status = "True";
        
        memoryData.result.map((d,ind)=>{
          d.Image  = d.NewsFeedPost
          d.ProfilePic = d.UserProfilePic
          d.Postid = d.PostId
          d.userId = d.UserId
          if(d.PostId == mem.PostId){
            memoryData.result.splice(ind,1)
            memoryData.result.unshift(d)
            // selectedData = [...selectedData,d];
          }
        });
  
        memoryData.result.map((d,ind)=>{
          d.Image  = d.NewsFeedPost
          d.ProfilePic = d.UserProfilePic
          d.Postid = d.PostId
          d.userId = d.UserId
          return d
        });
        
        // // memoryData.result = [...selectedData,...memoryData.result];
        console.log('complete mem data',memoryData);
        var props = { screenName: 'FootPronts',memoryData:memoryData, }
        this.props.navigation.navigate('GetData', { data: props });
    }

    renderRightImgdone() {
        return <View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
            </TouchableOpacity>
        </View>
    }

    render() {
        const { footPrints, selectedFPTitle, selectedFPTitleImg,
            selectedFPVisits, memoriesList, videoList } = this.state;
        const { been_image_urlExplore, newsFeddStoriesUrl } = serviceUrl;

        return (
            <View style={{ backgroundColor: '#fff',marginTop:0 }}>
                {this.state.footPrintsScreen === 0 ? (
                    <View style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
                        {/* {/ header of screen /} */}
                        <Toolbar {...this.props} centerTitle="Footprints" rightImgView={this.renderRightImgdone()} />

                        {/* {/ main container /} */}
                        <View>
                            <View style={{ width: wp('100%'), height: hp('100%'), marginTop: hp('2%') }}>
                                <FlatList
                                    data={footPrints}
                                    ListFooterComponent={<View style={{height:70}} />}
                                    style={{ backgroundColor: '#fff',}}
                                    ItemSeparatorComponent={this.seperator()}
                                    renderItem={({ item,index }) => (
                                        <View key={`id${index}`} style={{ height: '100%', marginLeft: '3.7%', marginBottom: '3.3%', shadowOffset: { width: 5, height: 5 }, shadowColor: 'grey', shadowOpacity: .2, elevation: 8, }}>
                                            <TouchableOpacity onPress={() => this.footPrintsScreen(item._id, item.data)}>
                                                {/* <View style={{width: deviceWidth * .045, height: hp(25), borderRadius:17,overflow: 'hidden',borderWidth:.2,backgroundColor:'#fff',shadowOffset: { width: 3, height: 3, }, shadowOpacity: 0.5,  shadowRadius:5.5,elevation: 6,}}> */}
                                                <View style={Common_Style.ShadowCurveView}>
                                                    {item.data.length > 0 ?
                                                        <ImageBackground
                                                            source={item.data[0].From == "feed" ? { uri: newsFeddStoriesUrl + item.data[0].pic }
                                                                : { uri: been_image_urlExplore + item.data[0].pic }}
                                                            borderRadius={17} resizeMode={'cover'} style={{ width: '100%', height: '100%', }}>
                                                            <View style={{ width: wp(45), height: hp(25), }}>
                                                            <View style={{width:'100%',height:'100%',backgroundColor:'#00000050',...StyleSheet.absoluteFillObject,borderRadius:17}} />
                                                                <View style={{justifyContent: 'center',alignItems:'center',height:'100%' }}>
                                                                    <Text style={{  color: '#fff', fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font }}>{item._id}</Text>
                                                                </View>
                                                            </View>
                                                        </ImageBackground>
                                                        :
                                                        null
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    keyExtractor={item => item.id}
                                    horizontal={false}
                                    numColumns={2} />
                            </View>
                        </View>
                    </View>
                ) : null}

                {this.state.footPrintsScreen === 1 ? (
                    //header
                    <View style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
                        {this.state.imageView ?
                            <StatusBar  backgroundColor="rgba(0,0,0,0.8)" barStyle='light-content' />
                            :
                            <StatusBar  backgroundColor="transparent" />
                        }
                        {/* {/ header of screen /} */}
                        <View style={{ flexDirection: 'row', width: '100%', height:250, }}>
                            <ImageBackground
                                source={this.state.imageFrom != undefined
                                    ? { uri: newsFeddStoriesUrl + selectedFPTitleImg }
                                    : { uri: been_image_urlExplore + selectedFPTitleImg }}
                                style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
                                 
                                 <View style={{flexDirection:'row',width:'100%' , bottom:0,position: 'absolute',}} >
                                 <LinearGradient style={{ height: 45, flexDirection: 'row', width: '100%' }} colors={[ "#0f0f0f00" ,"#0f0f0f44", ]} >
                
                                <View style={{ width: '100%',height: '100%',}}>
                                    <Text style={[Common_Style.locationText, {textAlign:'center',marginTop:18,marginLeft:'1%' }]}>{selectedFPTitle}</Text>
                                </View>
                                </LinearGradient>
                                </View>
                                
                            </ImageBackground>
                        </View>

                        {/* {/ main container /} */}
                        <Content style={{ width: wp('100%'), height: hp('100%'), marginTop: hp('3%') }} >
                            <View>
                                <View style={{ marginLeft: wp('5%') }} >
                                {Object.keys(selectedFPVisits).length > 0 ?
                                        <Text style={styles.visitFont}>Visits {`(${selectedFPVisits.data.length})`}</Text>
                                        : <Text style={styles.visitFont}>Visits (0)</Text>}
                                </View>
                                {/* <View style={{ width: '100%', height: hp(1), borderBottomWidth: 1, marginTop: '0.5%', borderBottomColor: '#f5f5f5' }}></View> */}

                                <ScrollView horizontal={true} style={{ marginLeft: wp('5%') }}>
                                    {selectedFPVisits.data &&
                                        selectedFPVisits.data.length > 0 && selectedFPVisits.data.map((d,i) => {
                                            return <TouchableOpacity activeOpacity={0.8} onPress={()=>this.visitsViewImage(i)}>
                                                <View style={{ marginTop: hp('1%'), marginRight: wp('3%') }}>
                                                    <View style={styles.imageView}>
                                                        <Image source={{ uri: been_image_urlExplore + d.pic }}
                                                            resizeMode={'cover'} style={{ width: '100%', height: '100%', }} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        })
                                    }
                                </ScrollView>
                            </View>

                            {/* {/ Memory /} */}
                            <View>
                                <View style={{ marginTop: hp('3%'), marginLeft: wp('5%') }}>
                                    {memoriesList != undefined ?
                                        <Text style={styles.visitFont}>Memory {`(${memoriesList.length == undefined?0:memoriesList.length})`}</Text>
                                        : <Text style={styles.visitFont}>Memory 0</Text>}
                                </View>

                                <ScrollView horizontal={true} style={{ marginLeft: wp('5%') }} >
                                    {memoriesList && memoriesList.length > 0 &&
                                    //?
                                     memoriesList.map((memoriesLog,index) => {
                                        return <TouchableOpacity key={`idMem${index}`} activeOpacity={0.8} onPress={()=> this.redirectToListView(memoriesLog)} >
                                            <View style={{ marginTop: hp('1%'), marginRight: wp('3%') }}>
                                                <View style={styles.imageView}>
                                                    <Image source={{ uri: newsFeddStoriesUrl + memoriesLog.NewsFeedPost }} borderRadius={10}
                                                        resizeMode={'cover'} style={{ width: '100%', height: '100%', }} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }) 
                                    // : 
                                    // <View style={{ marginTop: hp('1%'), marginRight: wp('3%') }}>
                                    //         <View style={styles.emptyimageView}>
                                    //         </View>
                                    //     </View>
                                        }
                                    
                                </ScrollView>

                              
                                <View style={{ marginLeft: wp('5%'), marginBottom: hp('5%') }}>
                                    <View style={{ marginTop: hp('3%'), }}>
                                        <Text style={styles.visitFont}> {`Vlog (${videoList.length == undefined ? 0 : videoList.length})`} </Text>
                                    </View>
                                    <ScrollView horizontal={true}>
                                        {videoList &&
                                            videoList.length > 0 && videoList.map((m,index) => {
                                                return  <TouchableOpacity key={`idVg${index}`} activeOpacity={0.8} onPress={()=>this.redirectToListView(m,'vlog')}>
                                                    <View style={{ marginTop: hp('1%'), marginRight: wp('3%'), }}>
                                                        <View style={styles.imageView}>
                                                            <Image source={{ uri: newsFeddStoriesUrl + m.NewsFeedPost }} borderRadius={10}
                                                                resizeMode={'cover'} style={{ width: '100%', height: '100%', }} />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </ScrollView>
                                </View>

                            </View>
                        </Content>

                        <TouchableWithoutFeedback onPress={() => this.setState({ footPrintsScreen: 0 })}>
                            <View style={{ width: 40, height: 40, top: StatusBar.currentHeight, left: 12, position: 'absolute', }} >
                                <Image
                                    source={require('../../Assets/Images/Backfeed.png')}
                                    style={{ width: '100%', height: '100%' }}
                                 //  resizeMode={'center'}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                ) : null}
                
                {/* <ImageView
                    images={this.state.imageViewData}
                    imageIndex={this.state.selectedIndex}
                    isVisible={this.state.imageView}
                    onClose={() => this.setState({ imageView: false })}
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

        imageView: { width: wp(25), height: hp(21), borderRadius:8, overflow: 'hidden', backgroundColor: '#c1c1c1', shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, }
        ,
        emptyimageView: { width: wp(25), height: hp(21), borderRadius:8,backgroundColor: '#fff', }
        ,
        image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' }, card: {
            width: wp('95%'), height: hp('75'), borderWidth: 1,
            borderRadius: 10,
            borderColor: '#ddd',
            borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 10,
            shadowRadius: 10,
            elevation: 4,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: '#fff',


        },
        container2: {
            flexDirection: 'row', width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop: '3%'
        },

        icon: {
            width: 15, height: 20
        },
        footericon: {
            width: '23%', marginLeft: '5%'
        },
        fontColor: {
            color: '#b4b4b4'
        },

        // footer font
        fontsize: {
            fontSize: 10,
            color: '#858585'
        },
        footerIconImage: {
            width: 20, height: 20,
        },
        modalView: {
            width: wp('90%'),
            height: hp('20%'),
            backgroundColor: '#fff',
            borderRadius: 5

        },
        modalView1: {
            width: wp('90%'),
            height: hp('13%'),
            backgroundColor: '#fff',
            borderRadius: 8
        },
        modalView2: {
            width: wp('90%'),
            height: hp('33.5%'),
            backgroundColor: '#fff',
            borderRadius: 8
        },
        visitFont: {
            color: '#010101',
            width: wp('91%')
            , fontFamily: Common_Color.fontBold, fontSize: 14
        },
        searchFollower: {
            flexDirection: 'row', width: wp('80%'), borderWidth: 1, borderRadius: 50, alignItems: 'center', marginTop: '3%', borderColor: '#fff', marginLeft: '10%', shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 10,
            shadowRadius: 10,
            elevation: 4,

        }
    },
)









