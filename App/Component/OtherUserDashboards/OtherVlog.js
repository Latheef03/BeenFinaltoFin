import React, { Component } from 'react'
import {
    Text, StyleSheet, Image, FitImage, ImageBackground,
    View, ToastAndroid, TextInput, ActivityIndicator, TouchableOpacity, ScrollView, FlatList,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PLAYER_STATES } from "react-native-media-controls";
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color } from '../../Assets/Colors'
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
import { Toolbar,FooterTabBar1 } from '../commoncomponent'
import Spinner from '../../Assets/Script/Loader';
import LinearGradient from "react-native-linear-gradient";
import footerStyleS from '../../styles/FooterStyle'
import Video from "react-native-video";
import {ExploreLoader} from '../commoncomponent/AnimatedLoader';

export default class OtherVlog extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            userName: '',
            getAlbumData: '',
            otherid: '',
            getMemoryData: '',
            convertedImages1: '',
            userProfileScreen: 0,
            isModalVisible: false,
            followers: 0,
            search: '',
            albumSingleImg: null,
            selectedMemoryData: {},
            userdata: {},
            no_record_found: false,
            isLoading: false,
            wholeMemoryData: {},otherid:''
        }

    }
    async UNSAFE_componentWillMount() {
       
        var id1 = await AsyncStorage.getItem("OtherUserId");
        const Comments = this.props.route.params?.data
        if(Comments!=undefined||null){
           this.setState({
             otherid: Comments.otherid == undefined ? id1 : Comments.otherid,
             userName: Comments.userName
           });
         }
        this.getMemeories();
     }

    UNSAFE_componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                
                const Comments = this.props.route.params?.data

                if(Comments!=undefined||null){
                this.setState({
                    otherid: Comments.otherid == undefined ? id1 : Comments.otherid,
                    userName: Comments.userName
                });
            }
                this.getMemeories();
                // navigation.state.params = {loader:false};
               
                console.log('the comments',Comments);
            }  
        );
    };


    onProgressVideo = (e,data,index) =>{

      const {getMemoryData} = this.state;
      data.pause = e.currentTime > 0 ? true : false ;
      getMemoryData[index] = data;
      this.setState({
        getMemoryData
      })  
    }


    getMemeories = async () => {
       // debugger;
        // var data = { Userid: await AsyncStorage.getItem('GetOtherId') }
        var userId = await AsyncStorage.getItem('userId');
        var GetOtherId = await AsyncStorage.getItem('OtherUserId')
        // var GetOtherId = await AsyncStorage.getItem('GetOtherId');

        var data = {
            Userid: userId,
            followedId: GetOtherId

        }

        this.setState({ isLoading: true });
        const url = serviceUrl.been_url1 + "/GetVlog";
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    let result = responseJson.Result;
                    console.log('the get memories', responseJson)
                    result.length > 0 && result.map(m => {
                        m.totalLike = 0
                        m.data.length > 0 && m.data.map(s => {
                            if (m._id == s.Location) {
                                m.totalLike += s.likecount ? s.likecount : 0
                            }
                            return s;
                        })
                        return m;
                    })
                    this.setState({
                        getMemoryData: result,
                        wholeMemoryData: responseJson,
                        isLoading: false,
                        no_record_found: false
                    })
                  
                }
                else {
                    this.setState({
                        isLoading: false,
                        no_record_found: true
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                })
                console.log('ErrorUPM:', error);
            });
    }


    seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }
    navigation(item, index) {
        const { getMemoryData, wholeMemoryData } = this.state;
        console.log('the mem items are', index);
        const arrayLen = getMemoryData.length;
        let actualIndex = 0;
        // console.log('the likes',getMemoryData)

        let memoryData = { result : [] };
        memoryData.UserLiked = wholeMemoryData.likes;
        memoryData.status = wholeMemoryData.status;
        memoryData.userData = wholeMemoryData.userData;
        memoryData.Bookmarked = wholeMemoryData.Bookmark;



        getMemoryData.length > 0 && getMemoryData.map(m => {
            m.data.map(v => {
                v.Postid = v._id
                memoryData.result.push(v);
            })
        });

        memoryData.UserLiked && memoryData.UserLiked.length > 0 && memoryData.UserLiked.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                if (moment.Postid === item.Postid) {
                    moment.likes = true;
                }
                return moment;
            });
            return item;
        });

        memoryData.Bookmarked && memoryData.Bookmarked.length > 0 && memoryData.Bookmarked.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                if (moment.Postid === item.Postid) {
                    moment.Bookmarks = true;
                }
                return moment;
            });
            return item;
        });

        console.log('the memory data', memoryData);
        let selectedData = []
        memoryData.result.map((d, ind) => {
            d.Image = d.NewsFeedPost
            d.userId = d.UserId
            if (d.Location == item._id) {
                memoryData.result.splice(ind, 1)
                selectedData = [...selectedData, d];
            }
        });

        memoryData.result.map((d, ind) => {
            d.Image = d.NewsFeedPost
            d.userId = d.UserId
           return d
        });

      
      memoryData.result = [...selectedData,...memoryData.result];
        // if (index > 0) {
        //     const currentIndex = index;
        //     let dataLen = 0;
        //     getMemoryData.map((m, i) => {
        //         if (currentIndex > i) {
        //             dataLen += m.data.length
        //             actualIndex = dataLen
        //         }
        //     });
        // }
        console.log('complete mem data',memoryData);
        var props = { screenName: 'Vlog', selectedPostId: actualIndex, memoryData: memoryData, other: this.state.otherid }
        this.props.navigation.navigate('GetData', { data: props });
    }


    backArrow() {
        const { userProfileScreen } = this.state;
        if (userProfileScreen === 1) {
            this.setState({
                userProfileScreen: 0
            })
        } else {
            this.props.navigation.navigate('OtherUserProfile');
        }
    }

    renderRightImgdone() {
        return <View style={[]}>
            <View >
                <Image style={{ width: 20, height: 20 }} />
            </View>
        </View>
    }

    onProgressVideo = (e,data,index) =>{
        const {getMemoryData} = this.state;
        data.pause = e.currentTime > 0 ? true : false ;
        getMemoryData[index] = data;
        this.setState({
          getMemoryData
        })  
      }


    render() {
        const { selectedMemoryData, userdata,isLoading } = this.state;
        const { _id, data, } = selectedMemoryData;
        const { username, ProfilePic } = userdata;
        return (
            <View style={{ flex: 1, marginTop: 0,backgroundColor:'#fff' }}>

                <Toolbar  {...this.props} icon={"Down1"} centerTitle="Vlog"  rightImgView={this.renderRightImgdone()}  />
                
                {isLoading ?
                    <ExploreLoader />
                    : !isLoading && this.state.getMemoryData.length == 0 ?
                        <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                            <View style={styles.hasNoMem}>
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                <Text style={Common_Style.noDataText}> Nothing created yet!</Text>
                            </View>
                        </View>
                        :
                        <FlatList
                            style={{}}
                            data={this.state.getMemoryData}
                            ItemSeparatorComponent={this.seperator()}
                            renderItem={({ item, index }) => (
                                <View style={Common_Style.locationShadowView}>
                                    <View style={[Common_Style.ShadowViewImage, { flex: 1 }]}>
                                        <Video
                                            resizeMode={'cover'}
                                            source={{ uri: newsFeddStoriesUrl + item.data[0].NewsFeedPost }}
                                            paused={item.pause}
                                            volume={0}
                                            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, }}
                                            onProgress={e => this.onProgressVideo(e, item, index)}
                                        />
                                        <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => { this.navigation(item, index) }} >
                                            <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                                <LinearGradient
                                                    style={{ height: 70, }}
                                                    colors={["#0f0f0f94", "#0f0f0f00"]}
                                                >
                                                    <Text style={[Common_Style.locationText, { marginTop: 10 }]}>{item._id == "null" ? null : item._id}</Text>
                                                    <Text style={Common_Style.locationText}>{item.data[0].Country == "null" ? null : item.data[0].Country}</Text>
                                                </LinearGradient>
                                            </View>
                                            <View style={{
                                                width: wp('100%'), backgroundColor: '#00000000', height: '25%',
                                                marginBottom: 0, bottom: 0, right: 0, position: 'absolute'
                                            }}>
                                                <LinearGradient style={{ height: 80, flex: 1 }} colors={["#0f0f0f00", "#0f0f0f94"]}   >
                                                <Image source={require('../../Assets/Images/new/LIKE-2.png')} style={[Common_Style.likeImage, { right: 15, position: 'absolute',width: 25, height: 25,bottom: 30, }]} resizeMode={'stretch'} />
                                                    <View style={{ flexDirection: 'row', backgroundColor: '#00000000', right: 12, bottom: 15, position: 'absolute' }}>
                                                        <Text style={[Common_Style.likeCount,]}>
                                                            {item.likecount == null ? 0 : item.likecount}
                                                        </Text>
                                                        <Text style={[Common_Style.likeCount]}> likes</Text>

                                                    </View>
                                                </LinearGradient>
                                            </View>
                                        </TouchableOpacity>

                                    </View>

                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                        />
                    }
                       

                    {/* <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                        {this.state.no_record_found === true ? (
                            <View style={styles.hasNoMem}>
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                <Text style={Common_Style.noDataText}> Not created any Vlog yet!</Text>
                            </View>
                        ) : null}
                    </View> */}

                
                <FooterTabBar1 {...this.props} tab={4} />
            </View>

        )
    }
}


const styles = StyleSheet.create(
    {
        image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' },
        card: {
            width: '95%', borderWidth: 1,
            borderRadius: 10,
            borderColor: '#ddd',
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: hp(1),
            marginBottom: hp(1.3),
            backgroundColor: '#fff',
        },
        imageView1: { height: 333, width: "97%" },
        view: { justifyContent: 'flex-end', margin: 10, },
        container2: { flexDirection: 'row', width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1.5%', position: 'absolute', bottom: 5 },
        icon: { width: 15, height: 20 },
        searchBar: { flexDirection: 'row', width: wp('90%'), backgroundColor: '#ffffff', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 25, padding: 15, borderWidth: 1.2, borderColor: '#ededef', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
        textInput: { width: wp('90%'), height: 45, marginBottom: 10, color: '#000', marginTop: 12, padding: 15, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
        footericon: { width: '23%', marginLeft: '5%' },
        fontColor: { color: '#b4b4b4' },
        // footer font
        fontsize: { fontSize: 12, color: '#010101', fontFamily: Common_Color.fontMedium },
        footerIconImage: { width: wp(8), height: hp(4.5), },
        modalView: { width: wp('90%'), height: hp('20%'), backgroundColor: '#fff', borderRadius: 5 },
        modalView1: { width: wp('90%'), height: hp('13%'), backgroundColor: '#fff', borderRadius: 8 },
        modalView2: { width: wp('90%'), height: hp('33.5%'), backgroundColor: '#fff', borderRadius: 8 },
        visitFont: { color: '#898989', width: wp('91%') },
        hasNoMem: {
            justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        }
    },

)
const common = StyleSheet.create({
    textinput: { borderWidth: 1, height: 43, borderColor: '#cecece', marginTop: '0.5%', borderRadius: 5 },
    container1: { width: "60%", height: '100%', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', },

    signin: { color: '#8d8d8d', fontFamily: "OpenSans-BoldItalic", fontWeight: 'bold' },

    textInput: { width: wp('90%'), backgroundColor: 'transparent', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 25, padding: 15, borderWidth: 1, borderColor: 'grey', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
    signin2: { marginTop: 10, marginLeft: 'auto', marginRight: 'auto', color: '#fcf6f6', fontWeight: 'bold' },
    signup: { color: '#f5255f', fontFamily: "OpenSans-BoldItalic", textDecorationLine: 'underline' },
    bar: {
        width: 50, height: 8, backgroundColor: 'gray',
        alignSelf: 'center', borderRadius: 4, marginTop: 8,
    },

})

