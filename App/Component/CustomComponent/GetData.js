import React, { Component } from 'react';
import { View, Clipboard, Text, ImageBackground, Image, Share, TextInput, Dimensions,
      StatusBar,TouchableOpacity, ScrollView, ToastAndroid, Animated, 
      KeyboardAvoidingView, FlatList,Keyboard,TouchableWithoutFeedback,
    StyleSheet, StatusBarIOS,
    Platform} from 'react-native';
let Common_Api = require('../../Assets/Json/Common.json')
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput as NPTextInput, } from 'react-native-paper';
// import { TouchableOpacity, DrawerLayoutAndroid } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import common_styles from "../../Assets/Styles/Common_Style"
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import styles from '../../styles/NewfeedImagePost';
import ViewMoreText from 'react-native-view-more-text';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;
const { width, height } = Dimensions.get("window");
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const imagePath = '../../Assets/Images/'
import { Toolbar } from '../commoncomponent'
import Spinner from '../../Assets/Script/Loader'
import ParsedText from 'react-native-parsed-text';
import { postServiceP01 } from '../_services';
import { deviceHeight as dh, deviceWidth as dw, getTime } from '../_utils/CommonUtils';
import { OneToOneChat } from '../Chats/';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import TransBack from './TransBack'
import { TapGestureHandler,State, } from 'react-native-gesture-handler';
import VideoController from '../CustomComponent/VideoController';
import UserView from '../commoncomponent/UserView'

const shareOptions = {
    title: "Title",
    message:'Post Shared',
    //message:'Post Shared',
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};


export default class GetData extends Component {

    static navigationOptions = {
        header: null,
    };
    doubleTapRef = React.createRef();

    constructor(props) {
        super(props);
        one2onechat = new OneToOneChat();
        this.state = {
            newsFeedData: [],
            userBookmarkState: false,
            isModalVisible: false,
            isModalVisible1: false,
            isModalVisible2: false,
            visibleModal: false,
            userProfileType: '',
            postId: '',
            newsfeed: '',
            country: '',
            tags: '',
            description: '',
            screenName: '',
            isSelectSendTo: false,
            _isSendToLoader: false,
            followeeList: [],
            /*For Video*/
            paused: false,
            duration : 0.1,
            currentTime : 0.0,
            volume : 0.5,
            volumeMuted : false,
            showControl : false,
            singleTapPostId : '',
            mScrollIndex : -1,
            dTapLikeEnable : false,
            tappedPostId : '',
            isLoading : true,
            zone: '', 
            ProfileType: "",
            analyticsLike:'',
            analyticsCmd:'',
            analyticsShareCount:'',
            analyticsReachCount:'',
            analyticsVisitCount:'',
            analyticsSaved:'',
            selectedPostImage: '',
        }
        this.followListForSearch = [];
        this.layoutHeight = [];
        this.player = Array();
    }
    sendModalTimeout;

    async UNSAFE_componentWillMount() {
       // debugger;
        var userId = await AsyncStorage.getItem('userId');
        var ProfileType = await AsyncStorage.getItem('profileType');
        // console.log('the pro type',ProfileType);
        const Comments =  this.props.route.params.data
        const screen = Comments.screen;
        const FeedId = Comments.feedId;
        const mData = Comments.memoryData;

        this.setState({
            userProfileType: ProfileType, userId: userId,
            placeName: Comments.data && Comments.data.PlaceName,
            hashtags: Comments.data && Comments.data.HashTag,
            isLoading: true
        })
        if(screen && screen == 'hashtag' || screen == 'place'){
            this.getPlacehashTags()
            return false
        }
        if(screen && screen == 'notification'){
            this.getNotificationDetails(FeedId);
            return false;
        }
        this.setState({
            userProfileType: ProfileType, userId: userId,
            selectedPostId: Comments != undefined ? Comments.selectedPostId : ''
        })
        console.log('mdata',mData);
        this.fetchDetails(mData); 
    }

    componentWillUnmount = () =>{
        // StatusBar.setTranslucent(false);
        clearTimeout(this.dTapTimeout);
        clearTimeout(this.sendModalTimeout)
        this.setState({
          mScrollIndex : -1,
          volume : 0.0,
        })
      }

    getNotificationDetails = async (feedId) => {
        var id = await AsyncStorage.getItem("userId");
        var data = { UserId: id, FeedId: feedId };
        //const url = serviceUrl.been_url + "/GetNewsFeedList";
        const url = serviceUrl.been_url1 + "/SpecificFeedDetails";
        const header = serviceUrl.headers;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    {
                        this.setState({ isLoading: false });
                        let likeStatus = responseJson;
                        let userStatus = responseJson
                        likeStatus.UserLiked && likeStatus.UserLiked.length > 0 && likeStatus.UserLiked.map(item => {
                            userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
                                if (moment.PostId === item.Postid) {
                                    moment.likes = true;
                                }
                                return moment;
                            });
                            return item;
                        });

                        likeStatus.UserBookMark && likeStatus.UserBookMark.length > 0 && likeStatus.UserBookMark.map(item => {
                            userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
                                if (moment.PostId === item.Postid) {
                                    moment.Bookmarks = true;
                                }
                                return moment;
                            });
                            return item;
                        });

                        userStatus.result && userStatus.result.length > 0 && userStatus.result.map((m, i) => {
                            m.mIndex = i
                            m.duration = 0.1
                            m.NewsFeedPost = m.Image
                            m.likecount = m.LikeCount
                            m.Postid = m.PostId
                            m.ProfilePic = m.UserProfilePic
                            m.TagsId = m.tagid
                            m.userId = m.userId
                            return m;
                        })

                        console.log('the user result',userStatus.result);
                        this.setState({
                            newsFeedData: userStatus.result ? userStatus.result : [],
                        })
                    }
                }
                else if (responseJson.status === 'False') {
                    this.setState({ likeStatus: false, isLoading: false })
                }

                else {
                    this.setState({ isLoading: false });
                    //toastMsg('danger', response.data.message)
                }
            })
            .catch((error) => {
                console.log('Error:', error)
                //toastMsg('danger', 'Sorry..something network error.Please try again.')
            });
    }

    getPlacehashTags = async () => {
		debugger
		const { headers, been_url } = serviceUrl;
		const url = serviceUrl.been_url1 + "/GetSpecificHTagPlaceFeeds";
		var UserId = await AsyncStorage.getItem('userId');
		var data = {
			userId: UserId,
			search: this.state.placeName == undefined || "" ? this.state.hashtags : this.state.placeName,
			searchfor: this.state.hashtags == undefined || "" ? "Place" : "HashTag"
		}
		this.setState({
			isLoading : true
		})
		return fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		}).then((response) => response.json())
			.then((responseJson) => {
				console.log('tehe ht ',responseJson);
				if (responseJson.status == "True") {
					let likeStatus = responseJson;
					let userStatus = responseJson;

					likeStatus.Likes && likeStatus.Likes.length > 0 && likeStatus.Likes.map(item => {
						userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
							if (moment.Postid === item.Postid) {
								moment.likes = true;
							}
							return moment;
						});
						return item;
					});

					likeStatus.Bookmarks && likeStatus.Bookmarks.length > 0 && likeStatus.Bookmarks.map(item => {
						userStatus.result && userStatus.result.length > 0 && userStatus.result.map(moment => {
							if (moment.Postid === item.Postid) {
								moment.Bookmarks = true;
							}
							return moment;
						});
						return item;
                    });
                    
                    userStatus.result && userStatus.result.length > 0 && userStatus.result.map((m, i) => {
                        m.mIndex = i
                        m.duration = 0.1
                        m.NewsFeedPost = m.Image
                        m.likecount = m.LikeCount
                        m.ProfilePic = m.UserProfilePic
                        return m;
                    })
                    console.log('user status res',userStatus.result);

                    this.setState({
                        newsFeedData: userStatus.result ? userStatus.result : [],
                        isLoading : false
                    })

					// if (userStatus.result != null) {
					// 	var alterList = userStatus.result.map((i, index) => {
					// 		return { ...i, mIndex: index };
					// 	})
					// 	this.setState({
					// 		newsFeedData: alterList,
					// 		isLoading : false
					// 	})
					// }

				} else {
					this.setState({ isLoading: false });
					//toastMsg('danger', responseJson.message)
				}
			})
			.catch((error) =>{
				this.setState({ isLoading: false });
				//toastMsg('danger', 'Sorry..something network error.Please try again.')
			});
	}



    fetchDetails = async (responseJson) => {
       // debugger;
        if (responseJson.status == "True" || responseJson.status == undefined) {
            let getData = responseJson.result == undefined ? responseJson.Result : responseJson.result
            console.log('the get data',getData);
            getData.length > 0 && getData.map((m,i)=>{
                m.mIndex = i
                m.duration = 0.1
                return m;
            })
            this.setState({
                newsFeedData: getData
                    ? getData : [],
                isLoading: false
            })
        }
    }

    /** 
     * @IMPORTANT method(dont delete) by mms 
     * */
    // onFlatListRender = flatListRef => {
    //     if (images.length > 0) {
    //         const nextTick = new Promise(resolve => setTimeout(resolve, 0));
    //         nextTick.then(() => {
    //             flatListRef.scrollToIndex({
    //                 index: imageIndex,
    //                 animated: false,
    //             });
    //         });
    //     }
    // }

    _onDoubleTap = (event,data) => {
    // console.log('the events double data',data);
        if (event.nativeEvent.state === State.ACTIVE) {
         this.setState({
             dTapLikeEnable : true,
             tappedPostId:data.Postid
         })
         this.dTapTimeout = setTimeout(()=>{
            this.setState({dTapLikeEnable : false})
          },2000)
          this.likes(data,true);
         
        }
      };

    itemLayout = (data, index) => {
        const length = this.layoutHeight.length > 0 ? this.layoutHeight[index] : 410;
		const offset = this.layoutHeight.slice(0,index).reduce((a, c) => a + c, 0)
       return { length: length ? length : 410, offset: offset, index }
    }

    sendToUser = async (data) => {
        console.log('data', data)
        const { selectedPostImage, followeeList } = this.state;

        if (data.ChatUserId == undefined || data.ChatUserId == null || data.ChatUserId == "null") {
            // toastMsg('danger', `${data.UserName} has no chat user ID`)
            ToastAndroid.showWithGravityAndOffset(
                `You cannot send this post to ${data.UserName} without chat user unique ID`,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            return false;
        }

        data.buttonFlag = 'waiting';
        // data.sendingFlag = true;
        const index = followeeList.findIndex(d => d.ChatUserId == data.ChatUserId);
        followeeList[index] = data;

        this.setState({
            followeeList: followeeList
        });

        const datas = {
            occupants_ids: data.ChatUserId,
            name: data.UserName
        };

        console.log('the datas', datas);
        console.log('the followee list', followeeList)
        // const postImgUrl = selectedPostImage;

        await one2onechat.initChatForNF();
        const session = await one2onechat.getSessionForNF();
        console.log('the session', session);
        if (session != false && session.token) {
            const checkConn = await one2onechat.checkConnectionFromChatServerForNF();
            if (checkConn) {
                this.createDialog(datas)
            }
            else {
                this.createConnectionToChatServer(datas);
            }
        } else {
            this.createSessionsNF(datas)
        }
    }

    createDialog = async (datas) => {
        console.log('the create dilg data', datas);
        const dialogs = await one2onechat.createDialogueForNF(datas);
        console.log('the dils from create dilg', dialogs);
        if (dialogs === false) {
            this.createDialog(datas);
        }
        this.sendMessageToUser(dialogs);
    }

    sendMessageToUser = async (dialogs) => {
        const { selectedPostImage, followeeList,feedData } = this.state;
        const appUserId = await AsyncStorage.getItem('chatUserID');
        const sentId = dialogs.occupantsIds[0] === parseInt(appUserId)
            ? dialogs.occupantsIds[1]
            : dialogs.occupantsIds[0];
       console.log(dialogs,'sentId',sentId);
        const msg = await one2onechat.sendMessageForNF(dialogs, selectedPostImage,feedData);
        if (msg) {
            const index = followeeList.findIndex(d => d.ChatUserId == sentId);
            followeeList[index] = { ...followeeList[index], buttonFlag: 'sent' };
            this.setState({
                followeeList: followeeList
            })
        } else {
            const index = followeeList.findIndex(d => d.ChatUserId == sentId);
            followeeList[index] = { ...followeeList[index], buttonFlag: 'send' };
            this.setState({
                followeeList: followeeList
            })
        }

    }

    createSessionsNF = async (datas) => {

        const info = await one2onechat.createSessionForNF();
        console.log('object check', info)
        if (info != false && info.constructor == Object) {
            const checkConn = await one2onechat.checkConnectionFromChatServerForNF();
            if (checkConn) {
                this.createDialog(datas)
            } else {
                this.createConnectionToChatServer(datas);
            }

        } else {
            this.createSessionsNF(datas);
        }
    }

    createConnectionToChatServer = async (datas) => {
        const checkConSer = await one2onechat.createConnectionToServerForNF();
        this.createDialog(datas)
        
    }


    async likes(data,doubleTap = false) {
        console.log("GetData from memories",data)
        const { newsFeedData } = this.state;
        if(doubleTap && data.likes ){
            return false;
          }
        var datasApi = {
            Userid: this.state.userId,
            Postid: data.Postid
        };
        data.likes = !data.likes;
        const index = newsFeedData.findIndex(d => d.Postid == data.Postid);
        data.likecount = data.likes ? newsFeedData[index].likecount + 1 :
        newsFeedData[index].likecount - 1;
        newsFeedData[index] = data;
        this.setState({ newsFeedData });
        this.callLikeApi(datasApi,data);
    }

    callLikeApi = async (data,userData) => {
        const url = serviceUrl.been_url + "/LikeFeedPost";
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {  
                }
                else {
                    this.likeErrorHandling(userData)
                }
            })
            .catch((error) => {
                console.log("Catch Error", error);
                this.likeErrorHandling(userData)
            });
    }

    likeErrorHandling = (data) => {
        const { newsFeedData } = this.state;
        data.likes = false;
        const index = newsFeedData.findIndex(item=>item.Postid == data.Postid);
        data.likecount = newsFeedData[index].likecount - 1;
        newsFeedData[index] = data;
        this.setState({ newsFeedData });
        toastMsg1('danger','Couldn\'t like.try again')
        }


    async bookmarkLikes() {
		debugger
		const {newsFeedData,postId,userFollowState,userBookmarkState} = this.state;
		
		const ind = newsFeedData.findIndex(d=>d.PostId == postId);
		newsFeedData[ind] = {...newsFeedData[ind],Bookmarks:!userFollowState}
		this.setState({
			newsFeedData,
			userBookmarkState : !userBookmarkState
		})
		var data = { Userid: this.state.userId, Postid: this.state.postId };
		const url = serviceUrl.been_url + "/Bookmark";
		return fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		}).then((response) => response.json())
			.then((responseJson) => {
				console.log('the res',responseJson);
				if (responseJson.status !== "True") {
					this.changeState()
				}
			})
			.catch((error)=> {
				this.changeState()
				console.log("Catch Error", error);
			});

    }
    
    changeState = () =>{
		toastMsg1('danger','post could not save or unsave, please try again');
		const {newsFeedData,userBookmarkState,postId} = this.state;
		const ind = newsFeedData.findIndex(d=>d.PostId == postId);
		newsFeedData[ind] = {...newsFeedData[ind],Bookmarks: userBookmarkState ? false : true}
		this.setState({
			newsFeedData,
			userBookmarkState : userBookmarkState ? false : true
		});
    }
    
    async notifyData() {
		const {notifications,newsFeedData,postId} = this.state;
				
		var data = {
			Userid: await AsyncStorage.getItem('userId'),
			Postid: this.state.postId,
			Otheruserid: this.state.otherUserId,
        };
        
        console.log('the notifydata',data);
		await this.makeRefreshData(data);
		var base_url = serviceUrl.been_url1 + "/TurnOnOffNotitfication";
		
		return fetch(base_url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log('turn off explore',responseJson)
				if (responseJson.status == "True") {
					// this.setState({ visibleModal: null });
					// this.makeRefreshData(data);
					//toastMsg("success", responseJson.message);
				  }
			})
			.catch((error)=> {
				console.log(error);
		 });
    }
    
    makeRefreshData = async({Postid}) =>{
        // console.log('the id',Postid);
        const {notifications} = this.state
        const {newsFeedData} = this.state;
        const index = newsFeedData.findIndex(item=>item.Postid==Postid)
        const noti = newsFeedData[index].Notificationsetting == 'Off' ? 'On' : 'Off';
        newsFeedData[index] = {...newsFeedData[index],Notificationsetting : noti }
        this.setState({
            newsFeedData,
            notifications: notifications == 'On' ? 'Off' : 'On'
        })
    }

    SearchFilterFunction1(text) {
        //passing the inserted text in textinput
        const newData = this.followListForSearch.filter(function (item) {
          //applying filter for the inserted text in search bar
          const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          followeeList: newData,
          text: text
        });
      }

    async OtheruserDashboard(item) {
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: item.userId
        };
        if(data.Userid == item.userId){
            this.profileChanger();
            return false
        }
        const url = serviceUrl.been_url2 + "/OtherUserStatus";
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.connectionstatus === "True") {
                    AsyncStorage.setItem('OtherUserId', item.userId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "Pending") {
                    AsyncStorage.setItem('OtherUserId', item.userId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }
                else if (responseJson.connectionstatus === "False") {
                    AsyncStorage.setItem('OtherUserId', item.userId);
                    var data = {
                        ProfileAs: responseJson.ProfileAs
                    }
                    if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        // this.props.navigation.navigate('LocalUserProfile', { data: data })
                    }
                    else if (responseJson.ProfileAs === 2) {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
                    }
                    else {
                        AsyncStorage.setItem('OtherUserId', item.userId);
                        this.props.navigation.navigate('OtherUserProfile', { data: data })
                    }
                }

                else if (responseJson.connectionstatus === "Mismatch") {
                    // this.props.navigation.navigate('Profile')
                    this.profileChanger();
                }
                else {
                }
            })
            .catch((error) => {
            });
    }

    // deletePost() {
    //     this.setState({
    //         isModalVisible: false,
    //         isModalVisible1: false,
    //         isModalVisible2: true,
    //     })
    // }

    deletePost() {
        // if(this.state.visibleModal === 3 ){
        this.setState({
            isModalVisible: false,
            isModalVisible1: false,
        })
        this.modalsTimeout = setTimeout(()=>{
          this.setState({
            isModalVisible2: true,
          })
        },500)
       
      }

    deleteData = async () => {
       // debugger;
       const {newsFeedData} = this.state
        this.setState({ isModalVisible2: false, });
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            postid: this.state.postId
        };
        const deletedData = newsFeedData.filter(d=> (d.Postid || d.PostId) !== data.postid )
        this.setState({
            newsFeedData : deletedData
        })
        const url = serviceUrl.been_url1 + "/MemoriesDelete";
        return fetch(url, { method: "POST", headers: headers, body: JSON.stringify(data) })
            .then(response => response.json())
            .then(responseJson => {
                console.log('the resposne',responseJson);
                if (responseJson.status == "True") {
                    //toastMsg('success', responseJson.message);
                    // this.getMemeories();
                }
                else {
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch((error)=> {
                // this.setState({ isLoading: false });
                reject(new Error(`Unable to retrieve events.\n${error.message}`));
            });
    }

    reportModal() {
        this.setState({
            visibleModal: null,
            visibleModal: 3
        });
    }

    sendReportModal() {
        // if (this.state.postContent == "" || null || undefined) {
        //     toastMsg1('danger', "Please give a report")  
        //     this.setState({

        //     })
        //     //ToastAndroid.show("Please give a report", ToastAndroid.LONG)
        // }
        // else {
        this.setState({
            reportModal: false,
        });
        this.reportApi();
     //}
    }

    async reportApi() {
       
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Reportid: this.state.otherUserId,
            Postid: this.state.postId,
            // Otheruserid: this.state.postId,
            Content: this.state.postContent
        };
        const url = serviceUrl.been_url + "/Reportpost";
        console.log('the data',data);
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // toastMsg('success', "Thank you for reporting");
                this.setState({reportThanksModal:true})
            })
            .catch((error) => {
                toastMsg('danger', error.message)
            });
    }


    unfollow = async (data) => {
       // debugger;
        this.setState({ otherUserModal: null });
        //debugger
        var data = {
            Otheruserid: this.state.postId,
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/Unfollow";
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    //toastMsg("success", responseJson.message);
                    // this.fetchDetails();
                }
                else {
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    mute = async (data) => {
        this.setState({ visibleModal: null });
        //debugger
        var data = {
            Otheruserid: this.state.postId,
            Userid: await AsyncStorage.getItem('userId')
            // Userid:"5e1d7e4ff08ddb166184af2c"
        };
        const url = serviceUrl.been_url1 + '/MuteAccount'
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'True') {
                    //toastMsg('success', responseJson.message)
                    this.fetchDetails();

                }
            })
            .catch((error) => {
                console.log(error);
                //toastMsg('danger', 'Sorry..Something network error.please try again once.')
            });
    };

    follow = async (data) => {
        this.setState({ otherUserModal: null });
        var data = {
            Otheruserid: this.state.postId,
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/SendFollowReq";
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    //toastMsg("success", responseJson.message);
                    this.fetchDetails();
                }
                else {
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    share_option() {
        // this.setState({
        //     isModalVisible1: false,
        //     isModalVisible: false,
        //     otherUserModal : false,
        // })
        
        Share.share(shareOptions)
    }

    editPost() {
        this.setState({ isModalVisible: false,isModalVisible1:false })
        var data = {
            PostId: this.state.postId ,
            Image: this.state.newsfeed,
            Country: this.state.country,
            Location: this.state.location,
            tagid: this.state.tags,
            Desc: this.state.description
        }
        console.log('the data',data);
        this.props.navigation.navigate('EditPost', { data: data });
    }

    // otherUserModal(data) {
    //     // console.log('the other user selected post',data);
    //     this.setState({
    //         otherUserModal: true,
    //         postId: data.PostId ? data.PostId : data.Postid ,
    //         otherUserId: data.userId,
    //         userBookmarkState: data.Bookmarks ? true : false,
    //         notifications: data.Notificationsetting == 'Off' ? 'On' : 'Off',
    //         selectedPostImage: newsFeddStoriesUrl + data.Image.split(',')[0],
    //         feedData: [data]
    //     })
    // }

    // modalOpen1(data) {
    //     console.log('the data modal', data)
    //     this.setState({
    //         isModalVisible: true,
    //         isModalVisible1: false,
    //         isModalVisible2: false,
    //         newsfeed: data.NewsFeedPost || data.Image ,
    //         country: data.Country,
    //         tags: data.TagsId,
    //         description: data.Desc,
    //         location: data.Location,
    //         postId: data.Postid || data.PostId,
    //         otherUserId: data.UserId || data.userId,
    //         notifications: data.Notificationsetting,
    //         selectedPostImage: serviceUrl.newsFeddStoriesUrl + data.NewsFeedPost.split(',')[0],
    //         feedData: [data]
    //     })
    // }
    // openModalBusiness(data) {
    //     console.log('the data modal business', data)
    //     this.setState({
    //         isModalVisible: false,
    //         isModalVisible1: true,
    //         isModalVisible2: false,
    //         newsfeed: data.NewsFeedPost || data.Image,
    //         country: data.Country,
    //         tags: data.TagsId,
    //         description: data.Desc,
    //         location: data.Location,
    //         postId: data.Postid,
    //         otherUserId: data.UserId || data.userId,
    //         notifications: data.Notificationsetting,
    //         selectedPostImage: serviceUrl.newsFeddStoriesUrl + data.NewsFeedPost.split(',')[0] || data.Image.split(',')[0],
    //         feedData: [data]
    //     })
    // }

    openUserModal(data) {
        if(data.userId === this.state.userId){
         this.setState({
            isModalVisible: true,
           userBookmarkState: data.userBookmarked,
           selectedPostImage: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0],
           userDataForEdit: data,
           postId: data.PostId,
           feedData: [data]
         })
       }
     
       else {
         this.setState({
           otherUserModal: true,
           postId: data.PostId,
           otherUserId: data.userId,
           userBookmarkState: data.userBookmarked,
           notifications: data.Notificationsetting == "Off" ? "On" : 'Off',
           selectedPostImage: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0],
           feedData: [data]
         })
       }
     }
     

    analyticsData(data){
        this.setState({
            visibleModal:2, 
            analyticsLike:data.likecount == undefined ? 0 : data.likecount,
            analyticsCmd:data.Commentcount == undefined ? 0 : data.Commentcount ,
            analyticsShareCount:data.ShareCount == undefined ? 0 : data.ShareCount,
            analyticsReachCount:data.ReachCount == undefined ? 0 : data.ReachCount,
            analyticsVisitCount:data.VisitCount == undefined ? 0 : data.VisitCount,
            analyticsSaved:data.Bookmarkcount== undefined ? 0 : data.Bookmarkcount

        })
    }

    likesView(data) {
        console.log("Likes data",data)
        // alert(JSON.stringify(data))
        var data = {
            data: data.Postid,
            screen: "Likes",
            likesCount: data.likecount
        }
        this.props.navigation.navigate('LikesView', { data: data });
    }

    bookmarkView(data) {
        var data = {
            data: data.PostId === undefined ? data.Postid : data._id,
            screen: "Bookamarks"
        }
        this.props.navigation.navigate('LikesView', { data: data });
    }

    readFromClipboard = async () => {
        this.setState({ isModalVisible: false })
        //To get the text from clipboard
        const clipboardContent = await Clipboard.getString();
        this.setState({ clipboardContent });
    };

    writeToClipboard = async () => {
        this.setState({ 
           isModalVisible1: false , 
           isModalVisible: false ,
           otherUserModal : false,
        })
        //To copy the text to clipboard
        await Clipboard.setString("http://Been.com/" + this.state.postId);
        //toastMsg("Pending", "Link Copied");
    };


    comments(data) {
        this.props.navigation.navigate('comments', { data: data });
    }

    imageModal(data) {
        var data = {
            data: data.NewsFeedPost,
            desc: data.Desc,
            events:data.Events,
            postLocation: data.Location + ', ' + data.Country
        }
        this.props.navigation.navigate("MultiImageView", { data: data })
    }

    getLocation(data) {
        AsyncStorage.mergeItem('PlaceName', data.Location);
        AsyncStorage.setItem('PlaceName', data.Location);
        console.log('getdata',data)
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }

    // sendTo = () => {
    //     this.setState({
    //         isModalVisible: false,
    //         otherUserModal : false,
    //         isSelectSendTo: true
    //     })
    //     this.getFolloweesList();
    // }

    sendTo = () => {
        this.setState({
          isModalVisible: false,
          otherUserModal : false,
        },()=>{
          this.sendModalTimeout = setTimeout(()=>{
            console.log("is called")
            this.setState({
              isSelectSendTo: true
            })
          },600)
        })
        this.getFolloweesList();
      }

      reportTo = () => {
        this.setState({
            otherUserModal: false,
            
        },()=>{
          this.reportModalTimeout = setTimeout(()=>{
            this.setState({
                reportModal: true 
            })
          },700)
        })
      }

    getFolloweesList = async () => {
        const { _isSendToLoader } = this.state
        console.log('called get followee list', _isSendToLoader);
        const data = { UserId: await AsyncStorage.getItem('userId'), }
        const apiname = 'FollowerFollowingsList';
        this.setState({ _isSendToLoader: true })
        postServiceP01(apiname, data).then(cb => {
            console.log('datas are ', cb);
            if (cb.status == 'True') {
                console.log('sd', cb)
                cb.result.length > 0 && cb.result.map(s => {
                    s.buttonFlag = 'send'
                    return s;
                });
                this.setState({
                    followeeList: cb.result,
                    _isSendToLoader: false,
                })
                this.followListForSearch = cb.result;
            } else {
                this.setState({
                    _isSendToLoader: false
                });
                //toastMsg('danger', cb.message);
            }
        }).catch(err => {
            console.log(err);
            this.setState({
                _isSendToLoader: false
            })
            //toastMsg('danger', 'something wrong in network,please try after some time.')
        })
    }

    sendToLoader = () => {
        const { _isSendToLoader } = this.state
        if (_isSendToLoader) {
            return (
             <Spinner color="#fb0143" />
            )
        }
    }

    _toggleModal12() {
        if (this.state.permission_Value == "" || null || undefined) {
          this.setState({
            reportEmpty: true
          })
          // toastMsg1('danger', "Please give a report")
          // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
        }
        else {
          this.setState({
            isModalVisible: null,
            isvisibleModal: null,
            //  permission_Value: "",
            isModalVisible1: !this.state.isModalVisible1
          });
          this.reportApi();
        }
      }

    hasNoData = () => {
        const { followeeList, _isSendToLoader } = this.state;
        if (followeeList.length === 0) {
            return (
                <View style={stylesL.hasNoMem}>
                    <Text style={{ color: '#4a4a4a', fontSize: 20 }}>No Users Yet..</Text>
                </View>)
        }
    }

    getRenderView(item) {
        return <View style={[Common_Style.StatusView, { width: '100%' }]}>
          {item.buttonFlag == 'waiting' && (
            <Text style={{ color: '#444', textAlign: 'center', 
            // fontSize: 14, fontFamily: Username.Font, 
            }}>
              Sending...
            </Text>
          )}
    
          {item.buttonFlag == 'sent' && (
            <Image source={require('../../Assets/Images/check.png')}
              resizeMode={'contain'}
              style={{ width: 20, height: 20, alignSelf: 'center', }}
            />
          )}
    
          <TouchableOpacity disabled={item.buttonFlag == 'sent' || item.buttonFlag == 'waiting'} onPress={() => this.sendToUser(item)}>
    
            {item.buttonFlag == 'send' && (
              <View style={{ backgroundColor: '#fb0042', borderRadius: 5, paddingLeft: 23.5, paddingRight: 23.5, paddingTop: 5, paddingBottom: 5, }}>
                <Text style={{ color: Common_Color.common_white, textAlign: 'center', 
                // fontSize: 14, fontFamily: Username.Font 
                }}>
                  Send
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      }

      profileChanger = async () => {
        let local;
        // debugger;
        let businessProfile;
        var data = { userId: await AsyncStorage.getItem('userId') };
        const url = serviceUrl.been_url1 + '/UserProfile';
        const getType = await AsyncStorage.getItem('profileType');
        const pType = parseInt(getType);
        const localP = await AsyncStorage.getItem('localProfile');
        console.log('the ptype ', pType, ' and its type ', typeof pType);
    
        if (localP && localP == "Yes") {
          this.props.navigation.navigate('LocalUserProfile')
        } else if (pType === 2) {
          this.props.navigation.navigate('BusinessPlaceProfile')
        } else {
          console.log('the ptype ', pType, ' and its type profile1 ', typeof pType);
          this.props.navigation.navigate('Profile')
        }
    
      }

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        console.log("Visible items are", viewableItems);
        console.log("Changed in this iteration", changed);
    }

    seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }

    renderViewMore(onPress) {
        return (
          <Text onPress={onPress} style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }}>View more</Text>)
      
      }
      renderViewLess(onPress) {
        return (
            <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }} onPress={onPress} >View Less</Text>)
        //   <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, }}></Text>)
      }

    extractDesctiption = (data) => {
        if (data == undefined || data.length == 0) {
            return null;
        }
        return data[0].desc != undefined ? data[0].desc : data[0].Description;
    }

    /*Video Controllers events */
    _singleTap = (data, index) => {
        this.setState({
            showControl: true,
            singleTapPostId: data.Postid,
        });

        clearTimeout(this.tapTimer);
        this.tapTimer = setTimeout(() => {
            this.setState({
                showControl: false,
                singleTapPostId: '',
            });
        }, 5 * 1000)
    }

    onloadVideo = (meta, data, index) => {
        const { newsFeedData } = this.state
        data.duration = meta.duration
        newsFeedData[index] = data;
        // console.log('the news',newsFeedData);
        this.setState({ newsFeedData })
    }

    onprogressVideo = ({ currentTime }) => {
        this.setState({ currentTime })
    }
    loadStart = e => {
        // console.log('the load start', e)
    }
    getSliderValue = (e, data, index) => {
        console.log('the duration', e * data.duration);
        this.player[index].seek(e * data.duration);
    }
    controlChanges = (data, index) => {
        const { newsFeedData, paused, mScrollIndex } = this.state;
        this.setState({
            paused: !this.state.paused,
            mScrollIndex: !paused ? -1 : index
        })
    }

    onBufferVideo = (e) => {
        // console.log('the buffr video', e);
    }

    VolumeControl = muted => {
        this.setState({
            volume: muted ? 0.0 : 1.0,
            volumeMuted: muted
        })
    }
    onVideoEnd = (data, index) => {
        this.player[index].seek(0);
        this.setState({
            mScrollIndex: -1
        })
        // this.setState({paused:true,currentTime:0})
    }
    videoError = e => {
        console.log('thee video error', e)
    }
 /* End Video Control Events */

    renderThreeDots = (data) => {
        const { userId, userProfileType } = this.state
        if (data.userId == userId) {
            if (userProfileType == "1" || userProfileType == "2") {
                return (
                    <>
                        <TouchableOpacity hitSlop={{ top: 10, left: 8, bottom: 10, right: 0, }} onPress={() => this.analyticsData(data)}>
                            <Image source={require(imagePath1 + 'bar-chart.png')}
                                style={{ width: 18, height: 18, marginBottom: 5, marginRight: 5 }} />
                        </TouchableOpacity>

                        <TouchableOpacity hitSlop={{ top: 10, left: 0, bottom: 10, right: 8, }} onPress={() => this.openUserModal(data)}>
                            <Image style={{ width: 16, height: 16, marginLeft: 'auto', marginRight: 'auto', }} 
                            //resizeMode={'stretch'}
                                source={require('../../Assets/Images/3dots.png')}></Image>
                        </TouchableOpacity>
                    </>
                )
            } else if (userProfileType == "0") {
                return (
                    <>
                    <Image style={{ width: 18, height: 18, marginBottom: 5, marginRight: 5 }} />

                    <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.openUserModal(data)}>
                        <Image style={{ width: 16, height: 16, marginLeft: 'auto', marginRight: 'auto', }} 
                        // resizeMode={'stretch'}
                            source={require('../../Assets/Images/3dots.png')}></Image>
                    </TouchableOpacity>
                   </> 
                )
            }
        }else{
            return (
                <>
                <Image style={{ width: 18, height: 18, marginBottom: 5, marginRight: 5 }} />

                <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.openUserModal(data)}>
                    <Image style={{ width: 16, height: 16, marginLeft: 'auto', marginRight: 'auto', }} 
                    // resizeMode={'stretch'}
                        source={require('../../Assets/Images/3dots.png')}></Image>
                </TouchableOpacity>
               </> 
            )
        }

    }

    renderPostItem = (data, index) => {
       
        if(index === 0){
            console.log('the datasss',data);
        }
        const {showControl,paused,volumeMuted,duration,currentTime,volume,
            singleTapPostId} = this.state;
        return (
            <View key={index.toString()} style={styles.card}
               onLayout={(e)=>{this.layoutHeight[index]=e.nativeEvent.layout.height}}
            >
                <View style={styles.cardImage}>
                <View style={{ flexDirection: 'row', width: '100%',marginTop: index === 0 ? StatusBar.currentHeight : 0 }} >
                        <View style={{ width: '13%' }} />
                        <View style={{ marginTop: '2%', width: '75%', }}>
                            {data.Location === "null" ? null : (<Text onPress={() => this.getLocation(data)} style={[Common_Style.cardViewLocationText,]}>{data.Location}</Text>)}
                            {data.Country === "null" ? null : (<Text onPress={() => this.getLocation(data)} style={[Common_Style.cardViewLocationText,]}>{data.Country}</Text>)}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 5, }}>
                            {/* {data.userId == this.state.userId ? 
                                <TouchableOpacity hitSlop={{ top: 10, left: 0, bottom: 10, right: 8, }} onPress={() => this.openModalBusiness(data)}>
                                    <Image style={{ width: 16, height: 16, marginLeft: 'auto', marginRight: 'auto', }} resizeMode={'stretch'}
                                        source={require('../../Assets/Images/3dots.png')}/>
                                </TouchableOpacity>    
                        } */}
                           {this.renderThreeDots(data)}
                       </View>
          </View>
            
          <TapGestureHandler ref={this.doubleTapRef}
              onHandlerStateChange={(event)=>this._onDoubleTap(event,data)}
              numberOfTaps={2} 
          >  
          <View style={[styles.imageBackGroundView, { borderRadius: 15, height: hp('62%'),marginTop:10 }]}>
            {data.NewsFeedPost != undefined && data.NewsFeedPost.indexOf(".mp4") != -1 ?
              <View style={{ width: "100%",height: "100%", overflow:'hidden',
              flexDirection:'column',
               }}>
                    
                <TouchableWithoutFeedback onPress={()=>this._singleTap(data,index)}>
                            <Video
                                ref={ref => { this.player[index] = ref }}
                                resizeMode="cover"
                                source={{ uri: serviceUrl.newsFeddStoriesUrl + data.NewsFeedPost }}
                                paused={data.mIndex != this.state.mScrollIndex}
                                repeat={false}
                                controls={true}
                                resizeMode='cover'
                                style={{ width: wp('96%'), height: "100%", }}
                                volume={this.state.volume}
                                onBuffer={this.onBufferVideo}
                                bufferConfig={{
                                    minBufferMs: 15000,
                                    maxBufferMs: 50000,
                                    bufferForPlaybackMs: 2500,
                                    bufferForPlaybackAfterRebufferMs: 5000
                                  }}
                                onLoadStart={this.loadStart}
                                onEnd={() => data.mIndex == this.state.mScrollIndex ? this.onVideoEnd(data, index) : null}
                                onError={this.videoError}
                                onLoad={e => this.onloadVideo(e, data, index)}
                                onProgress={data.mIndex == this.state.mScrollIndex ? this.onprogressVideo : null}

                            >
                            </Video>
                  {/* )} */}

                </TouchableWithoutFeedback>
                {this.state.dTapLikeEnable && data.Postid == this.state.tappedPostId && (
                      <View style={{width:'100%',height:'100%',justifyContent:'center',
                      ...StyleSheet.absoluteFillObject
                        }}>
                      <Image source={require('../../Assets/Images/new/LIKE-2.png')} 
                      resizeMode={'contain'}
                       style={{width:50,height:80,alignSelf:'center',}}
                      />
                      </View>
                  )}
                {/* {singleTapPostId == data.Postid &&  */}
                {/* // data.mIndex == this.state.mScrollIndex && 
                ( */}
                    <VideoController
                        showControl={false}
                        pause={data.mIndex != this.state.mScrollIndex}
                        changeControl={()=>this.controlChanges(data,index)}
                        totalDuration={getTime(data.duration)}
                        currentVidTime={getTime(currentTime)}
                        sliderValue={currentTime / data.duration}
                        sliderMovingValue={e=>this.getSliderValue(e,data,index)}
                        volumeControl={this.VolumeControl}
                        volume={volumeMuted}
                    />
                {/* )} */}
                  
              
               </View>
              
              :
               
                <View style={{ height: '100%', }}>
                  <ImageBackground style={{ width: '100%', height: '100%', }} resizeMode={'cover'}
                    source={data.NewsFeedPost == null ? require('../../Assets/Images/story2.jpg') : 
                     { 
                      // uri:data.NewsFeedPost
                       uri: serviceUrl.newsFeddStoriesUrl + data.NewsFeedPost.split(',')[0] 
                     }}>
                    <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: 5,
                      justifyContent:'flex-end' }}>
                      <View style={{ width: '88%', }}></View>
                      <View style={{width:wp(10),height:hp(6),justifyContent:'center'}}>
                        {data.NewsFeedPost?.split(',').length > 1 ?
                          <TouchableOpacity activeOpacity={1} onPress={() => data.NewsFeedPost.split(',').length > 1 ? this.imageModal(data) : null} >
                            <Image style={{ width: wp(6), height: hp(4), marginTop: '5%',alignSelf:'center' }}
                              source={require('../../Assets/Images/MULTIPIC.png')}>
                            </Image>
                           </TouchableOpacity>
                          :
                          <Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} ></Image>
                         }
                      </View>
                    </View>
                    {this.state.dTapLikeEnable && data.Postid == this.state.tappedPostId && (
                      <View style={{width:'100%',height:'75%',justifyContent:'center',
                      
                        }}>
                      <Image source={require('../../Assets/Images/new/LIKE-2.png')} 
                       resizeMode={'contain'}
                       style={{width:50,height:80,alignSelf:'center',}}
                      />
                      </View>
                    )}
                    
                  </ImageBackground>
                 
                </View>
               
              
            }
           
          </View>
          </TapGestureHandler>

          <View style={{ flexDirection: 'row', marginTop: '2%', marginBottom: 10 }}>
            <View style={{ width: '85%' }}>
              <View style={{ flexDirection: 'row', }}>

                {data.VerificationRequest === "Approved" ? (
                  <View >
                    {data.ProfilePic === undefined || data.ProfilePic === null ? (
                      <View >
                        <Image style={[Common_Style.mediumAvatar, { marginTop: 8 }]}
                          source={{
                            uri: serviceUrl.profilePic + data.ProfilePic
                          }}></Image>
                      </View>)
                      : (
                        <ImageBackground style={[Common_Style.mediumAvatar,]} borderRadius={50}
                          source={{ uri: serviceUrl.profilePic + data.ProfilePic }}>
                          <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImagesmall} />
                        </ImageBackground>
                      )}
                  </View>
                ) :
                  (<View>
                    {data.ProfilePic === undefined || data.ProfilePic === null ?
                      <Image style={[Common_Style.mediumAvatar, { marginTop: 5 }]}
                        source={require(imagePath + 'profile.png')}></Image>
                      :
                      <Image style={[Common_Style.mediumAvatar, { marginTop: 5 }]}
                        source={{ uri: serviceUrl.profilePic + data.ProfilePic }}></Image>}
                  </View>)}


                <View style={{ width: '80%', justifyContent: 'center',padding:2 }}>
                  <Text onPress={() => this.OtheruserDashboard(data)} style={[Common_Style.userName, 
                     { marginTop: 0, marginLeft: '2%',marginBottom:0 ,}]}>
                    {data.UserName}
                  </Text>
                </View>
              </View>

              <View style={{ width: '85%', height: 'auto', marginTop: -10, marginBottom:0, marginLeft: 4,
                flexDirection:'row',padding:4, }}>
                  <View style={{width:30,height:30,marginLeft:4,}}/>
                <ViewMoreText
                  numberOfLines={2}
                  renderViewMore={this.renderViewMore}
                  renderViewLess={this.renderViewLess}
                >

                  <ParsedText style={[Common_Style.descriptionText, { fontSize: Description.FontSize, fontFamily: Description.Font }]}
                    parse={[{ pattern: /#(\w+)/, style: Common_Style.hashtagColor },]}  >

                    {this.extractDesctiption(data.Desc)}

                  </ParsedText>

                </ViewMoreText>
              </View>
            </View>

            <View style={{ width: '100%', height: 80, justifyContent: 'space-evenly', marginRight: '100%' }}>
              {/* Like  */}
              <View style={{ flexDirection: 'row', marginRight: '100%', width: '100%', }}>
                <View style={{ width: 25, height: 25 }}>
                <TouchableOpacity onPress={() =>  this.likes(data) }>
                <Image style={{ width: '130%', height: '110%', }} resizeMode={'stretch'} source={
                                            data && data.likes && data.likes == true ?
                                                require('../../Assets/Images/new/LIKE-2.png') :
                                                require('../../Assets/Images/new/likeBlack.png')}></Image>
                                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.likesView(data)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
                  <Text onPress={() => this.likesView(data)} style={[Common_Style.countFont, { marginLeft: 12, marginTop: 7 }]} >
                    {data.likecount}
                  </Text></TouchableOpacity>
              </View>

              {/* Comment  */}
              <View style={{ flexDirection: 'row', marginTop: 8, }}>
                <View style={{ width: 25, height: 25 }}>
                  <TouchableOpacity onPress={() => { this.comments(data) }}>
                    <Image style={{ width: '130%', height: '110%', }} resizeMode={'stretch'}
                      source={require('../../Assets/Images/new/commentBlack.png')} ></Image>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.comments(data)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
                  <Text onPress={() => this.comments(data)} style={[Common_Style.countFont, { marginLeft: 12, marginTop: 8 }]} >
                    {data.Commentcount == undefined || null ? 0 : data.Commentcount}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </View  >

          {data.SponsoredBy != null && data.SponsoredBy != 'null' ?
            <Text style={{ textAlign: 'center', color: '#ff5555', fontFamily: Viewmore.Font, fontSize: Viewmore.FontSize, marginVertical: 5, marginTop: -20, marginBottom: 10 }}>Sponsored by {data.SponsoredBy}</Text>
            : null}
        </View>
      </View>

    )
  }

    renderFooter() {
		return (
		  <View style={{
			padding: 10, justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',marginBottom:30,
		  }}>
		  </View>
		);
	  }

    renderRightImgdone() {
        return <View style={[stylesFromToolbar.leftIconContainer]}> 
            <View >
                <Image  style={{ width: 20, height: 20 }} />
              </View>
                </View>    
      }


    render() {
        // const {selectedPostId} = this.state;
        const data =  this.props.route.params?.data
        const screen = data != undefined && data.screenName != undefined ? data.screenName == 'Vlog' ? "Vlog" : "Memories" : null ;
        const title = screen == undefined ? null : screen
        return (
            <View style={{ flex: 1,}}>
                  <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle='dark-content' />
               
                    {this.state.isLoading != true  &&
                         this.state.newsFeedData.length !== 0 ?
                            <View style={{ height: dh,backgroundColor:'black',}}>
                            <FlatList
                                // style={{marginTop:Platform.OS === 'ios' ? 20 : 0,}}
                                ref={ref => this.flatList = ref}
                                onMomentumScrollEnd={(event) => {
                                    const index = Math.round(event.nativeEvent.contentOffset.y / event.nativeEvent.layoutMeasurement.height) 
                                    this.setState({ mScrollIndex: index })}}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
                                initialScrollIndex={0}
                                data={this.state.newsFeedData}
                                renderItem={({ item, index }) => (this.renderPostItem(item, index))}
                                getItemLayout={this.itemLayout}
                                ListFooterComponent={this.renderFooter.bind(this)}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                            />
                         </View>
                        :
                        !this.state.isLoading && this.state.newsFeedData.length == 0 ?
                         <View style={{justifyContent: 'center',alignItems:'center',marginTop: '45%'}}>
                            <Text styles={{fontSize:14}}> No Posts </Text>     
                         </View>
                         :
                        <View style={{ justifyContent: 'center', alignItems: 'center',marginTop: '45%' }} >
                            <Spinner color="#fb0143" />
                        </View>
                    }
              
                    {/*user Modal screen */}
                    <Modal
                        isVisible={this.state.isModalVisible}
                        onBackdropPress={() => this.setState({ isModalVisible: false })}
                        onBackButtonPress={() => this.setState({ isModalVisible: false })}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                    >
                        <View style={styles.modalContent}>
                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                            <TouchableOpacity onPress={() => this.editPost()} style={{ width: '100%', marginTop: 5 }}>
                                <Text onPress={() => this.editPost()} style={[styles.modalText,]}>
                                    Edit
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.horizontalSeparator} />

                            <View style={{ marginTop: 7 }}>
                                <Text onPress={() => this.sendTo()} style={styles.modalText}>
                                    Send
							 </Text></View>
                            <View style={styles.horizontalSeparator} />


                            <View onPress={() => this.share_option()} >
                                <Text onPress={() => this.share_option()}
                                    style={styles.modalText} >
                                    Share
                                        </Text>
                            </View>

                            <View style={styles.horizontalSeparator} />

                            <TouchableOpacity onPress={() => this.writeToClipboard()} style={{ width: '100%', }}>
                                <Text onPress={() => this.writeToClipboard()} style={styles.modalText}>
                                    Copy Link
                                        </Text></TouchableOpacity>
                            <View style={styles.horizontalSeparator} />

                            <TouchableOpacity onPress={() => this.deletePost()} style={{ width: '100%', }}>
                                <Text onPress={() => this.deletePost()} style={[styles.modalText, { color: '#e45d1b' }]}>
                                    Delete Post
                                        </Text>
                            </TouchableOpacity>
                            {/* <View style={styles.horizontalSeparator} /> */}
                        </View>
                    </Modal>

                {/* other user modal */}
                <Modal
                    isVisible={this.state.otherUserModal}
                    onBackdropPress={() => this.setState({ otherUserModal: false })}
                    onBackButtonPress={() => this.setState({ otherUserModal: false })}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                >

                    <View style={styles.modalContent}>
                        {/* <StatusBar hidden /> */}
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

                        {/* <TouchableOpacity style={{ width: '100%', }} onPress={() => { this.bookmarkLikes() }}> */}
                        <View style={{ marginTop: 0, width: '100%', }}>
                            {this.state.userBookmarkState == true ?
                                <Text onPress={() => { this.bookmarkLikes() }} style={styles.modalText}>
                                    Saved
									  </Text> :
                                <Text onPress={() => { this.bookmarkLikes() }} style={styles.modalText}>
                                    Save Post
									 </Text>}
                        </View>
                        {/* </TouchableOpacity> */}

                        <View style={styles.horizontalSeparator} />

                        <View style={{ width: '100%' }}>
                            <Text onPress={() => this.sendTo()}
                                style={[styles.modalText]}>
                                Send
						</Text></View>
                        <View style={styles.horizontalSeparator} />

                        <TouchableOpacity onPress={() => this.notifyData()} style={{ width: '100%', }}>
                            <Text onPress={() => this.notifyData()} style={[styles.modalText]}>
                                Turn {this.state.notifications} Notifications
				  			</Text>
                        </TouchableOpacity>

                        <View style={styles.horizontalSeparator} />

                        <View style={{ width: '100%' }} >
                            <Text onPress={() => this.share_option()}
                                style={[styles.modalText]} >
                                Share
				  			</Text>
                        </View>

                        <View style={styles.horizontalSeparator} />

                        <TouchableOpacity onPress={() => this.writeToClipboard()} style={{ width: '100%', }}>
                            <Text onPress={() => this.writeToClipboard()} style={[styles.modalText]}>
                               Copy Link
				            </Text>
                        </TouchableOpacity>
                        
                        <View style={styles.horizontalSeparator} />

                        <View style={{ width: '100%', }} >
                            {this.state.userFollowState == true ?
                                <Text onPress={() => this.unfollow()} style={[styles.modalText, { color: '#708fd5', }]}>
                                    Unfollow account
                                </Text> 
                              :
                                <Text onPress={() => this.follow()} style={[styles.modalText, { color: '#708fd5', }]}>
                                    Follow account
				                </Text>
                            }
                        </View>


                        <View style={styles.horizontalSeparator} />
                        <TouchableOpacity onPress={() => this.reportTo()} style={{ width: '100%', }}>
                            <Text onPress={() => this.reportTo()}
                                style={[styles.modalText, { color: '#e45d1b' }]}>
                                Report post
				  			</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>



                    {/* Business Profile Memories */}
                    <Modal
                        isVisible={this.state.isModalVisible1}
                        onBackdropPress={() => this.setState({ isModalVisible1: false })}
                        onBackButtonPress={() => this.setState({ isModalVisible1: false })}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                    >
                        <View style={styles.modalContent}>
                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                         

                            <TouchableOpacity onPress={() => this.editPost()}>
                                <View style={{ marginTop: 15, }}>

                                </View>
                            </TouchableOpacity>

                            <View style={styles.horizontalSeparator} />
                            <TouchableOpacity style={{ width: '100%', }} onPress={() => this.editPost()}>
                            
                                    <Text onPress={() => this.editPost()} style={[styles.modalText,]}>

                                        Edit
                                    </Text>
                              
                            </TouchableOpacity>

                            <View style={styles.horizontalSeparator} />

                            <View style={{ marginTop: 7,width:'100%' }}>
                                <Text onPress={() => this.share_option()}
                                    style={styles.modalText} >
                                    Share
                                        </Text>
                            </View>

                            <View style={styles.horizontalSeparator} />

                            <TouchableOpacity onPress={() => this.writeToClipboard()} style={{ width: '100%', }}>
                                <View style={{ marginTop: 7, }}>
                                    <Text onPress={() => this.writeToClipboard()} style={styles.modalText}>
                                        Copy Link
                                        </Text>
                                </View></TouchableOpacity>
                            <View style={styles.horizontalSeparator} />

                            <TouchableOpacity style={{ width: '100%', }} onPress={() => { this.setState({ isModalVisible1: false }) }}>
                                <View style={{ marginTop: 7, }}>
                                    <Text style={styles.modalText}>
                                        Share Post Insight
                                         </Text></View>
                            </TouchableOpacity>

                            <View style={styles.horizontalSeparator} />
                            <TouchableOpacity onPress={() => this.deletePost()} style={{ width: '100%', }}>
                                <View style={{ marginTop: 7, marginBottom: 15 }}>
                                    <Text onPress={() => this.deletePost()} style={[styles.modalText, { color: '#e45d1b' }]}>
                                        Delete Post
                                        </Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </Modal>

                    {/* Report Modal */}
                    
                <Modal isVisible={this.state.reportModal}
                    onBackdropPress={() => this.setState({ reportModal: false })}
                    onBackButtonPress={() => this.setState({ reportModal: false })} >
                    <View style={[Common_Style.parentViewReport, { borderRadius: 25, justifyContent: 'center', }]} >
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <Image style={[{ marginTop: 10, alignSelf: 'center', width: 42, height: 42 }]} source={require('../../Assets/Images/new/Expression.png')} resizeMode={'contain'} />
                        <Text style={Common_Style.headerReport} >
                            Inappropriate Content!
											</Text>
                        <Text style={Common_Style.subHeaderReport} >
                            We are sorry for the inconvenience!
											</Text>
                        <View style={[Common_Style.contentViewReport, { alignSelf: 'center', }]}>
                            <Text style={Common_Style.contentReport} >
                                We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
												</Text>
                        </View>
                        <NPTextInput
                            label=" Type Here..."
                            placeholderStyle={Common_Style.PstyleReport}
                            mode="outlined" 
                            // gnb
                            multiline={true}
                            maxLength={500}
                            autoCorrect={false}
                            //  keyboardType="visible-password"
                            // flexWrap: 'wrap'
                            error={this.state.reportEmpty}
                            onChangeText={(text) => { this.setState({ postContent: text }) }}
                            value={this.state.permission_Value}
                            style={[Common_Style.TstyleReport, { marginLeft: 0, alignSelf: 'center' }]}
                            selectionColor={'#f0275d'} theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                        <View style={Common_Style.buttonViewReport} >

                            <TouchableOpacity
                                onPress={() => this.sendReportModal()}
                                activeOpacity={1.5}
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 0.75 }}
                                    end={{ x: 1, y: 0.25 }}
                                    style={Common_Style.ButtonReport}
                                    colors={["#fb0043", "#fb0043"]}
                                >

                                    <Text onPress={() => this.sendReportModal()}
                                        style={Common_Style.ButtonTextReport}>
                                        Report
</Text>
                                </LinearGradient>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => this.setState({reportModal:false})}
                                activeOpacity={1.5}
                            >
                                <View style={Common_Style.ButtonCancel}>
                                    <Text  style={Common_Style.CancelButtonTextReport}>
                                        Cancel
</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/*report Thanks Modal */}
        <Modal isVisible={this.state.reportThanksModal}
          onBackdropPress={() => this.setState({ reportThanksModal: false })}
          onBackButtonPress={() => this.setState({ reportThanksModal: false })} >
          <View style={[Common_Style.TparentView, { borderRadius: 25, justifyContent: 'center' }]} >
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <Text style={Common_Style.TheaderInModalTwo} >
              Thank you for your voice!
            </Text>

            <View style={[Common_Style.TcontentViewInModalTwo, { alignSelf: 'center' }]}>
              <Text style={Common_Style.TcontentTextInModalTwo} >
                We would like to show you our utmost gratitude for raising your voice against inappropriate behaviour and thus helping in making this a safe and happy place for people around you!
              </Text>
              <Text style={[Common_Style.TcontentTextInModalTwo, { marginTop: 10 }]} >
                Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
              </Text>
            </View>

            {/* <View style={Common_Style.TcontentViewInModalTwo}>
              <Text style={[Common_Style.TcontentTextInModalTwo, { marginTop: 40 }]} >
                Your case has been raised. We will look into the problem and rectify it at the earliest. It ideally takes 2-3 business days to resolve any issue,it may take a little longer for certain cases.
</Text>
            </View> */}
            <View style={Common_Style.TokayButton}>
              <TouchableOpacity onPress={() => this.setState({ reportThanksModal: false })} activeOpacity={1.5} >
                <Text onPress={() => this.setState({ reportThanksModal: false })} style={Common_Style.TokayButtonText}>
                  Okay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

                    {/* chart modal */}
                    <Modal
                        isVisible={this.state.visibleModal === 2}
                        onBackdropPress={() => this.setState({ visibleModal: null })}
                        onBackButtonPress={() => this.setState({ visibleModal: null })}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        animationInTiming={100}
                        animationOutTiming={100}
                        backdropTransitionInTiming={100}
                        backdropTransitionOutTiming={100}
                    >
                        <View style={Common_Style.modalContent}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                            <View style={[Common_Style.header, { width: '100%',marginTop:8,marginBottom:8}]}>
                                <Text style={Common_Style.headerText}>Post analytics</Text>
                            </View>
                            {/* <View style={Common_Style.horizontalSeparator} /> */}

                            <View style={{ flexDirection: 'row', marginTop: hp('2%') }}>
                                <View style={Common_Style.subView}>
                                    <Text style={Common_Style.subViewText} >Likes</Text>
                                   <Text style={[Common_Style.countsAnalytic]}>{this.state.analyticsLike}</Text>
                                </View>

                                <View style={Common_Style.subView}>
                                    <Text style={Common_Style.subViewText} >Comments</Text>
                    <Text style={[Common_Style.countsAnalytic,]}>{this.state.analyticsCmd}</Text>
                                </View>

                                <View style={Common_Style.subView}>
                                    <Text style={Common_Style.subViewText} >Shares</Text>
                                    <Text style={[Common_Style.countsAnalytic,]}>{this.state.analyticsShareCount}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop:15, marginBottom:25 }}>
                                <View style={Common_Style.subView}>
                                    <Text style={Common_Style.subViewText} >Saves</Text>
                    <Text style={[Common_Style.countsAnalytic,]}>{this.state.analyticsSaved}</Text>
                                </View>

                                <View style={Common_Style.subView}>
                                    <Text style={Common_Style.subViewText} >Reaches</Text>
                    <Text style={[Common_Style.countsAnalytic,]}>{this.state.analyticsReachCount}</Text>
                                </View>

                                <View style={Common_Style.subView}>
                                    <Text style={Common_Style.subViewText} >Profile Visit</Text>
                                    <Text style={[Common_Style.countsAnalytic,]}>{this.state.analyticsVisitCount}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ height: hp('6%'), marginTop: hp('3%'),  borderRadius: 20 }}>
                            <TouchableOpacity onPress={() => { this.setState({ visibleModal: null }) }} style={{ width: '100%', height: '100%' }}>
                                <Text onPress={() => this.setState({ visibleModal: null })} style={{ textAlign: 'center', color: '#f00', marginTop: 'auto', marginBottom: 'auto' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    {/* Send To mOdal */}
                    {/* Send To Modal */}
                    <Modal
                        isVisible={this.state.isSelectSendTo}
                        useNativeDriver={true}
                        // onSwipeComplete={this.close}
                        onBackdropPress={() => this.setState({ isSelectSendTo: false })}
                        onBackButtonPress={() => this.setState({ isSelectSendTo: false })}
                        // swipeDirection={['down']}
                        avoidKeyboard={true}
                        style={{
                            margin: 0, padding: 0
                        }}
                        ref={"modal"}
                    >
                        <KeyboardAvoidingView style={stylesL.keyAvoidView} behavior={Platform.OS == 'ios' ? 'position' : 'height'} enabled>
                            <View style={{
                                backgroundColor: '#fff', height: hp('70%'), width: '100%', justifyContent: 'center',
                                alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.1)', borderTopRightRadius: 15,
                                borderTopLeftRadius: 15
                            }}>
                                <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                                <View style={{
                                    flexDirection: 'row', width: wp('100%'), justifyContent: 'space-between',
                                    height: 12, marginTop: 10, 
                                    // borderBottomColor: '#a7a7a7', borderBottomWidth: 0.5
                                }}>
                                    <View>
                                        <Text style={{ fontSize: 14, color: '#383838', marginLeft: 20 }}>
                                            {/* Send To */}
				                        </Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={() => this.setState({ isSelectSendTo: false })}>
                                        <View style={{ width: '100%', marginBottom: 10, justifyContent: 'center' }}>
                                            <Image style={{ width: 24, height: 24, marginRight: 20,marginTop: 5 }}
                                                source={require('../../Assets/Images/close_black.png')} />
                                          </View>      
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={[Common_Style.searchView, { width: wp('97%'), margin: 5 }]}>
                                        <TextInput
                                            placeholder='Search'
                                            placeholderTextColor='#6c6c6c'
                                            style={[Common_Style.searchTextInput, { width: wp(96), height: 40, paddingLeft: '5%', }]}
                                            onChangeText={text => this.SearchFilterFunction1(text)}
                                            autoCorrect={false}
                                            //  keyboardType="visible-password"
                                            selectionColor='red'
                                         />
                                    {/* </View> */}
                                </View>
                                {/* <ScrollView contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}> */}

                                <View style={{ flex: 1 }}>
                                   {this.sendToLoader()}
                                    <FlatList
                                        data={this.state.followeeList}
                                        // ItemSeparatorComponent={seperator()}
                                        extraData={this.state}
                                        keyboardShouldPersistTaps="always"
                                        onScroll={() => Keyboard.dismiss()}
                                        renderItem={({ item, index }) => (

                                            <View key={`id${index}`} style={{ flexDirection: 'row', height: 70, width: wp('100%'), justifyContent: 'flex-start' }}>
                                                <UserView
                                                    userName={item.UserName}
                                                    surName={item.name}
                                                    onPress={() => this.OtheruserDashboard(item)}
                                                    isVerifyTick={item.VerificationRequest}
                                                    profilePic={item.ProfilePic}
                                                    rightView={this.getRenderView(item)}
                                                />

                                            </View>

                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal={false}
                                    />
                                    {/* </KeyboardAvoidingView> */}
                                </View>
                                {/* </ScrollView> */}
                                {/* {this.hasNoData()} */}
                            </View>

                        </KeyboardAvoidingView>
                    </Modal>

                {/* Delete Modal */}
                <Modal isVisible={this.state.isModalVisible2}
                    onBackdropPress={() => this.setState({ isModalVisible2: false })}
                    onBackButtonPress={() => this.setState({ isModalVisible2: false })} >
                    <View style={styles.deleteModalView} >
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center',}}>
                            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
                                <Text style={{ color: '#555', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 12, }}>
                                    Are you sure want to delete the post?
                                </Text>
                            </View>

                            {/* <View style={{ justifyContent: 'center', alignItems: 'center', width: wp('88%'), marginTop: 10, marginBottom: 10,backgroundColor:'yellow'}}> */}
                                <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')}
                                    style={[{ height: 40, width: '88%',marginTop: 10,alignSelf:'center',justifyContent: 'center',alignItems:'center'  }]}>
                                    <TouchableOpacity style={{ width: wp('100%'), height: '100%',justifyContent: 'center',  }}
                                        onPress={() => this.deleteData()}>
                                        <Text onPress={() => this.deleteData()} style={[common_styles.Common_btn_txt, {}]}>Delete</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                                <View style={{ width: wp('100%'), height: hp("6%"), borderRadius: 10, margin: 4, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text onPress={() => this.setState({ isModalVisible2: false })} style={[common_styles.Common_btn_txt, { marginTop: 5, color: '#000', }]}>Cancel</Text>
                                </View>

                            {/* </View> */}
                        </View>
                    </View>
                </Modal>
               
                <TransBack props={this.props.navigation} />
            </View>
        )
    }
}


const stylesL = {
    view: {
        justifyContent: 'flex-end', width: wp('100%'), margin: 0,
        backgroundColor: '#00000000'
    },
    textInput: {
        width: wp('90%'), height: 45, marginBottom: 10, color: '#000',
        marginTop: 12, padding: 15, justifyContent: 'center', alignContent: 'center',
        alignSelf: 'center'
    },
    hideButton: {
        // backgroundColor: "#87cefa",
        alignItems: "center",
        justifyContent: "center",
        // borderBottomRightRadius:10,
        // borderBottomLeftRadius:10,
        height: hp("6%"),
        width: wp("100%"),

    },
    LoginButtontxt: {
        color: "#fff",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 16,
    },
    searchBar: {
        flexDirection: 'row', width: wp('90%'), backgroundColor: '#ffffff',
        height: 45, marginBottom: 0, borderRadius: 20, marginTop: 0, paddingLeft: 20,
        borderWidth: 1.2, borderColor: '#ededef', borderBottomWidth: 1,
        borderBottomColor: '#d7d7d7', marginLeft: 12, marginRight: 12
    },
    keyAvoidView: {
        position: 'absolute',
        height: hp('70%'), width: wp('100%'), bottom: 0, left: 0, right: 0,
        backgroundColor: 'transparent',
    },
    hasNoMem: {
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    }
}





