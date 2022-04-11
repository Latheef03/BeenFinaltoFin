import React, { Component } from 'react'
import {
    Text, Clipboard, Image, FitImage, ImageBackground, StatusBar,
    View, ToastAndroid, TextInput, Share, TouchableOpacity, ScrollView, FlatList
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Spinner from '../../Assets/Script/Loader';
import styles from '../../styles/FooterStyle'
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar, FooterTabBar } from '../commoncomponent';
import LinearGradient from "react-native-linear-gradient";
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import {ExploreLoader} from '../commoncomponent/AnimatedLoader';
const shareOptions = {
    title: "Title",
    message:'Post Shared',
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};

export default class Promote extends Component {
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
            isModalVisible1: false,
            isModalVisible2: false,
            no_record_found: false,
            isLoading: false,
            followers: 0,
            search: '',
            albumSingleImg: null,
            selectedMemoryData: {},
            userdata: {},
            screenName: '',
            location: '',
            notifications: "",
            postId: '',
            newsfeed: '',
            country: '',
            tags: '',
            description: '',
            fetchingData : false,
            wholeMemoryData : {}
        }
    }

    UNSAFE_componentWillMount =()=>{
        const Comments = this.props.route?.params?.data
        console.log('the comments',Comments);
        const loader = Comments != undefined ? Comments.loader : false; 
        // console.log('the loader',loader);
        this.getMemeories();
        this.setState({ screenName: Comments ? Comments.screenName : '', })   
    }

    // componentDidMount = () => {
    //     this.focusSubscription = this.props.navigation.addListener(
    //         "willFOcus",
    //         () => {
    //             console.log('this props',this.props);
    //             const Comments = this.props.route.params.data
    //             console.log('the comments',Comments);
    //             const loader = Comments != undefined ? Comments.loader : false; 
    //             // console.log('the loader',loader);
    //             this.getMemeories();
    //             this.setState({ screenName: Comments ? Comments.screenName : '', })   
    //         }            
    //     );
    // };



    getMemeories = async () => {
       
        var data = { UserId: await AsyncStorage.getItem('userId') }
        const url = been_url + "/GetMemoriesPlace";
        this.setState({fetchingData:true})
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    let result = responseJson.result;
                    console.log('the get memories',responseJson)
                    this.setState({
                        getMemoryData: result,
                        fetchingData : false,
                    })
                }
                else {
                    this.setState({
                        fetchingData : false,
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    fetchingData : false,
                })
                console.log('ErrorUPM:', error);
            });
    }

    backArrow() {
        var userProfile = AsyncStorage.setItem('UserProfileType');
        console.log("user profile type is coming or not", userProfile);

        this.props.navigation.goBack();
    }

    getLocation(data) {
        AsyncStorage.mergeItem('PlaceName', data.Location);
        AsyncStorage.setItem('PlaceName', data.Location);
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }
   
    seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }

    renderRightImgdone() {
        return <View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
            </TouchableOpacity>
        </View>
    }

    navigation(item){
        this.props.navigation.navigate('PromoteParticular', { data: item });
    }

    render() {
        const {fetchingData,getMemoryData} = this.state;
        return (
            <View style={{ flex: 1,marginTop:0 }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <Toolbar  {...this.props} icon={"Down"} centerTitle="Memories" rightImgView={this.renderRightImgdone()} />

                   
                {fetchingData ?
                     <ExploreLoader />
                    : !fetchingData && getMemoryData.length == 0 ?
                    <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                      <View style={styles.hasNoMem}>
                         <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                         <Text style={Common_Style.noDataText}> You have not created any Memories yet!</Text>
                      </View>
                    </View>
                    :
                        <FlatList
                            style={{ marginBottom:0, }}
                            ListFooterComponent={<View style={{height:20}} />}
                            data={getMemoryData}
                            ItemSeparatorComponent={this.seperator()}
                            renderItem={({ item,index }) => (
                                <View style={Common_Style.locationShadowView}>
                                 <View style={Common_Style.ShadowViewImage}>
                                        <ImageBackground source={{ uri: newsFeddStoriesUrl + item.NewsFeedPost.split(',')[0] }}
                                         style={{ height: '100%', width: "100%",}}>
                                            <TouchableOpacity style={{ width: "100%", height: '100%' }} onPress={() =>this.navigation(item)} >
                                                <View style={{ width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                                    <LinearGradient
                                                         style={{height:70}}
                                                        colors={["#0f0f0f94", "#0f0f0f00"]}
                                                    >
                                                     <Text style={[Common_Style.locationText,{marginTop:10}]}>{item.Location == null ? "" : item.Location}</Text>
                                                     <Text style={Common_Style.locationText}>{item.Country == null ? "null" : item.Country}</Text>
                                                    </LinearGradient>
                                                </View>
                                                <View style={{width:wp('100%'), backgroundColor: '#00000000',height:'25%',
                                                     marginBottom: 0,bottom:0,right:0,position:'absolute' }}>
                                                         <LinearGradient  style={{height:80,flex:1}} colors={[  "#0f0f0f00" , "#0f0f0f94"]}   >
                                                    <Image source={require('../../Assets/Images/new/LIKE-2.png')} style={[Common_Style.likeImage,{ right:15,position:'absolute'}]} 
                                                   resizeMode={'stretch'}
                                                     />
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
                       }


                {/* <FooterTabBar {...this.props} tab={1} /> */}
            </View>

        )
    }
}

