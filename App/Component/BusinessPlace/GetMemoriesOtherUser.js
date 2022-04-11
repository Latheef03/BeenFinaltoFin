import React, { Component } from 'react'
import {
    Text, StyleSheet, Image, FitImage, ImageBackground, StatusBar,
    View, ToastAndroid, TextInput, ActivityIndicator, TouchableOpacity, ScrollView, FlatList, Share,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Toolbar } from '../commoncomponent'
import styles from '../../styles/FooterStyle'
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
import Common_Style from '../../Assets/Styles/Common_Style'
import Spinner from '../../Assets/Script/Loader';
import LinearGradient from "react-native-linear-gradient";



export default class GetMemoriesOtherUser extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            userName: '',
            getAlbumData: '',
            getMemoryData: '',
            convertedImages1: '',
            userProfileScreen: 0,
            isModalVisible: false,
            followers: 0,
            search: '',
            albumSingleImg: null,
            selectedMemoryData: {},
            userdata: {},
            otherid: "",
            reportId: "",
            postId: "",
            checkFollow: true, permission_Value: "",
            no_record_found: false,
            isLoading: false,wholeMemoryData : {},
            fetchingData: false
        }

    }

    componentDidMount = () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                // this.getMemeories();
            }
        );
    };

    componentWillMount() {
        this.getMemeories();
    }
  
    albums() {
        this.props.navigation.navigate('OtherAlbums');
    }
    visits() {
        this.props.navigation.navigate('OtherVisits');
    }
    vlogGet() {
        this.props.navigation.navigate('OtherVlog');
    }
    getMemeories = async () => {
        debugger
        var id1 = await AsyncStorage.getItem('userId');
        var data = {
            UserId: await AsyncStorage.getItem('OtherUserId'),
            // followedId: await AsyncStorage.getItem('OtherUserId')
        }
        const url = been_url + "/GetMemories";
        this.setState({ isLoading: true });
        let subscribed = true
       fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
              
                if (responseJson.status == "True") {
                    let result = responseJson.result;
                    console.log('the get memories',responseJson)
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
                        wholeMemoryData : responseJson,
                        fetchingData: false,isLoading: false,
                    })
                }
                else {
                    this.setState({   fetchingData: false,isLoading: false,  });
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });

            return ()=>(subscribed=false)
    }


    seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }


    navigation(item,index) {
        const { getMemoryData, wholeMemoryData } = this.state;
        console.log('the mem items are', item);
        const arrayLen = getMemoryData.length;
        let actualIndex = 0;
        // console.log('the likes',getMemoryData)
        let memoryData = { result: [] };
        memoryData.likes = wholeMemoryData.likes;
        memoryData.status = wholeMemoryData.status;
        memoryData.userData = wholeMemoryData.userData;
        memoryData.Bookmarks = wholeMemoryData.Bookmark;

        getMemoryData.length > 0 && getMemoryData.map(m => {
            m.data.map(v => {
                v.Postid = v._id
                memoryData.result.push(v);
            })
        });

        memoryData.likes && memoryData.likes.length > 0 && memoryData.likes.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                if (moment.Postid === item.Postid) {
                    moment.likes = true;
                }
                return moment;
            });
            return item;
        });

        memoryData.Bookmarks && memoryData.Bookmarks.length > 0 && memoryData.Bookmarks.map(item => {
            memoryData.result && memoryData.result.length > 0 && memoryData.result.map(moment => {
                if (moment.Postid === item.Postid) {
                    moment.Bookmarks = true;
                }
                return moment;
            });
            return item;
        });

        
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
           return d;
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
        //     console.log('--datalen', dataLen)
        // }
        console.log('the memory data', memoryData);
        var props = { screenName: 'Memories', selectedPostId: actualIndex, memoryData: memoryData, }
        this.props.navigation.navigate('GetData', { data: props });
    }
    permission_Value = text => {
        this.setState({ permission_Value: text });
    };

    onProgressVideo = (e,data,index) =>{
        const {getMemoryData} = this.state;
        data.pause = e.currentTime > 0 ? true : false ;
        getMemoryData[index] = data;
        this.setState({
          getMemoryData
        })  
      }

  
    render() {
        const { selectedMemoryData, userdata } = this.state;
        const { _id, data, } = selectedMemoryData;
        const { username, ProfilePic } = userdata;
        return (
            <View style={{ flex: 1 }}>
                <Content contentContainerStyle={{marginTop:15}}>
                    {this.state.isLoading != true ?
                            <FlatList
                            style={{ marginBottom: 60, }}
                            data={this.state.getMemoryData}
                            ItemSeparatorComponent={this.seperator()}
                            renderItem={({ item,index }) => (
                                <View key={`id${index}`} style={Common_Style.locationShadowView}>
                                 <View style={Common_Style.ShadowViewImage}>
                                        <ImageBackground source={{ uri: newsFeddStoriesUrl + item.data[0].NewsFeedPost.split(',')[0] }}
                                         style={{ height: '100%', width: "100%",}}>
                                            <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() => { this.navigation(item,index) }} >
                                                <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                                    <LinearGradient
                                                         style={{height:70}}
                                                        colors={["#0f0f0f94", "#0f0f0f00"]}
                                                    >
                                                     <Text style={[Common_Style.locationText,{marginTop:10}]}>{item._id == "null" ? null : item._id}</Text>
                                                     <Text style={Common_Style.locationText}>{item.data[0].Country == "null" ? null : item.data[0].Country}</Text>
                                                    </LinearGradient>
                                                </View>
                                                <View style={{width:wp('100%'), backgroundColor: '#00000000',height:'25%',
                                                     marginBottom: 0,bottom:0,right:0,position:'absolute' }}>
                                                         <LinearGradient  style={{height:80}} colors={[  "#0f0f0f00" , "#0f0f0f94"]}   >
                                                    <Image source={require('../../Assets/Images/new/LIKE-2.png')} style={[Common_Style.likeImage,{ right:15,position:'absolute'}]} resizeMode={'contain'} />
                                                    <View style={{ flexDirection: 'row',backgroundColor:'#00000000', right:12,bottom:15,position:'absolute' }}>
                                                         <Text style={[Common_Style.likeCount,]}>
                                                             {item.likecount == null ? 0 : item.likecount }
                                                         </Text>
                                                         <Text style={[Common_Style.likeCount]}> likes</Text>
                                                        
                                                    </View>
                                                    </LinearGradient>
                                                </View>
                                            </TouchableOpacity>

                                        </ImageBackground>
                                    </View>

                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                        />
                            :
                            <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                <Spinner color="#64b3f2" />
                            </View>}

                        <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                            {this.state.no_record_found === true ? (
                                <View style={styles.hasNoMem}>
                                    <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                    <Text style={Common_Style.noDataText}> Not created any Memories yet!</Text>
                                </View>
                            ) : null}
                        </View>
                
                </Content>

            </View>
        )
    }
}