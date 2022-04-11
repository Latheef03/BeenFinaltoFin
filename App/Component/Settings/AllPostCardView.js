import React, { Component,PureComponent } from 'react';
import {
	View, Clipboard, Text, ImageBackground, Image, Share, 
	Dimensions, KeyboardAvoidingView, ScrollView, ToastAndroid,
	Animated, StatusBar, FlatList, TouchableOpacity,TouchableWithoutFeedback,Keyboard,Platform,TextInput as RNTextInput,
	SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
let Common_Api = require('../../Assets/Json/Common.json')
import { Footer, FooterTab, Button, Spinner, Content } from 'native-base'
import { DrawerLayoutAndroid } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import { TextInput, } from 'react-native-paper';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Modal from "react-native-modal";
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'
import LinearGradient from "react-native-linear-gradient";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import styles from '../../styles/NewfeedImagePost';
import ViewMoreText from 'react-native-view-more-text';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar,HBTitleBack } from '../commoncomponent'
import Loader from '../../Assets/Script/Loader';
import { deviceHeight as dh, deviceWidth as dw} from '../_utils/CommonUtils';
import { OneToOneChat } from '../Chats/';
import { postServiceP01 } from 'Been/App/Component/_services';
import ParsedText from 'react-native-parsed-text';
import { Icon } from 'react-native-elements'
import TransBack from '../CustomComponent/TransBack';
import { TapGestureHandler,State, } from 'react-native-gesture-handler';

const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'

const shareOptions = {
	title: "Title",
	message:'Post Shared',
	url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
	subject: "Subject"
};
const { width, height } = Dimensions.get("window");
const { headers, been_url, newsFeddStoriesUrl, profilePic } = serviceUrl;

export default class AllPostCardView extends Component {

	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		one2onechat = new OneToOneChat();
		this.state = {
			newsFeedData: [],
			getTagdata: [],
			userBookmarkState: false,
			userFollowState: false,
			isModalVisible: false,
			isModalVisible1: false,
			isModalVisible2: false,
			visibleModal: false,
			notifications: 'Off',
			postId: '',
			newsfeed: '',
			country: '',
			tags: '',
			description: '',
			screenName: '',
			otherUserId: '',
			userId: '',
			//Video	
			volume: 0,
			zone: '',
			permission_Value: '', isvisibleModal: false, isModalVisible2: false,
			isSelectSendTo: false,
			_isSendToLoader: false,
			followeeList: [],
			selectedPostImage: '',
			mScrollIndex: -1,
			selectedPostId:'',
			buttonName : 'Delete',
			dTapLikeEnable : false,
			  tappedPostId : '',
			  reportEmpty : false

		}
		this.followListForSearch = [];
		this.layoutHeight = [];
	}

	dTapTimeout

	async componentDidMount() {
		debugger;
		var userId = await AsyncStorage.getItem('userId');
		var ProfileType = await AsyncStorage.getItem('profileType');
		const { navigation } = this.props;
		console.log("User profile type is", ProfileType);
		const allpostData = this.props.route.params.data
		// const mData = Comments.memoryData;
		this.setState({
			userProfileType: ProfileType, userId: userId,
			// selectedPostId: Comments != undefined ? Comments.selectedPostId : 0
        })
        // console.log('allpostData',allpostData);
		this.fetchDetails(allpostData);
	}

	// componentDidMount(){
	
	// }

	componentWillUnmount = () =>{
		clearTimeout(this.dTapTimeout);
	}


	fetchDetails = async (responseJson) => {
		debugger;
		console.log('the res',responseJson);
		if (responseJson.status == "True") {
			let getData = responseJson.result == undefined ? responseJson.Result : responseJson.result
		
			this.setState({
				newsFeedData: getData
					? getData : [],
				isLoading: false
			})
		}
	}

	makeRefreshData = ({Postid}) =>{
	  console.log('the id',Postid);
	  const {newsFeedData} = this.state;
	  const index = newsFeedData.findIndex(item=>item.PostId==Postid)
	  const noti = newsFeedData[index].Notificationsetting == 'Off' ? 'On' : 'Off';
	  newsFeedData[index] = {...newsFeedData[index],Notificationsetting : noti }
	  this.setState({newsFeedData})
	}

	deleteData = async () => {
		debugger
		this.setState({
			buttonName : 'Deleting...'
		})
		var data = {
		  Userid: await AsyncStorage.getItem('userId'),
		  postid: this.state.postId
		};
		const url = serviceUrl.been_url1 + "/MemoriesDelete";
		return fetch(url, {
		  method: "POST",
		  headers: serviceUrl.headers,
		  body: JSON.stringify(data)
		})
		  .then(response => response.json())
		  .then(responseJson => {
			  console.log('erre',responseJson)
			if (responseJson.status == "True") {
				this.setState({ isModalVisible3: false, isModalVisible: false });
			    this.props.navigation.navigate('MyPager');
			}
			else {
			}
		  })
		  .catch((error)=> {
			console.log('erre',error)
			// reject(new Error(`Unable to retrieve events.\n${error.message}`));
		  });
	  }
	
	  _onDoubleTap = (event,data) => {
    
		if (event.nativeEvent.state === State.ACTIVE) {
		 this.setState({dTapLikeEnable : true,tappedPostId:data.PostId})
		 this.dTapTimeout = setTimeout(()=>{
			this.setState({dTapLikeEnable : false})
		  },2000)
		  this.likes(data,true);
		  // alert('Double tap,!');
		}
	  };

	async likes(data,doubleTap = false) {
		console.log('the datas',data);
		var id = await AsyncStorage.getItem('userId');
		var datas = {
			Userid: id,
			Postid: data.PostId
		};
		const { newsFeedData } = this.state;
		if(doubleTap && data.userLiked ){
			return false;
		  }

		data.userLiked = !data.userLiked;
		const index = newsFeedData.findIndex(d => d.PostId == data.PostId);
		data.LikeCount = data.userLiked ? newsFeedData[index].LikeCount + 1 :
		newsFeedData[index].LikeCount - 1;
    	newsFeedData[index] = data;

		this.setState({ newsFeedData });
		this.callLikeApi(datas,data);
	}

	callLikeApi = async (datas,data) => {
		const url = serviceUrl.been_url + "/LikeFeedPost";
		return fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		}).then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status !== "True") {
					this.likeErrorHandling(datas,data)
				}

			})
			.catch((error) => {
				console.log("Catch Error", error);
				this.likeErrorHandling(datas,data)
			});
	}

	likeErrorHandling = (datas,data) => {
		const { newsFeedData } = this.state;
		data.userLiked = false;
		const index = newsFeedData.findIndex(item=>item.PostId == data.PostId);
		data.LikeCount = newsFeedData[index].LikeCount - 1;
		newsFeedData[index] = data;

		this.setState({ newsFeedData });
	}

	async bookmarkLikes() {
		debugger
		const {newsFeedData,postId,userFollowState,userBookmarkState} = this.state;
		
		const ind = newsFeedData.findIndex(d=>d.PostId == postId);
		newsFeedData[ind] = {...newsFeedData[ind],Bookmarks:!userFollowState}
		this.setState({
			newsFeedData,
			userBookmarkState : !userBookmarkState,
			visibleModal : false
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
		this.makeRefreshData(data);
		var base_url = serviceUrl.been_url1 + "/TurnOnOffNotitfication";
		//var base_url = serviceUrl.end_user + "/NotificationSettings";
		return fetch(base_url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log('turn off explore',responseJson)
				if (responseJson.status == "True") {
					this.setState({ visibleModal: null });
					// this.makeRefreshData(data);
					//toastMsg("success", responseJson.message);
				  }
			})
			.catch(function (error) {
				console.log(error);
			});
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

	extractDesctiption = (data) => {

		if (data == undefined || data.length == 0) {
		  return null;
		}
	
		// console.log('the data',data[0].desc);
		return data[0].desc != undefined ? data[0].desc : null;
	  }


	reportModal() {
		this.setState({
			visibleModal: null,
			visibleModal: 3
		});
	}

	sendReportModal() {
		this.setState({
			visibleModal: null,
		});
		this.reportApi();
	}

	_toggleModal12() {
		if (this.state.permission_Value == "" || null || undefined) {
			this.setState({
				reportEmpty : true
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
	_toggleModal1() {
		this.setState({
			isModalVisible: null,
			isvisibleModal: null,
			permission_Value: "",
			modalVisible: '',
			isModalVisible1: !this.state.isModalVisible1
		});
	}

	deletePost() {
		this.setState({
		  visibleModal: null,
		  isModalVisible3: true,
		})
	  }

	sendTo = () => {
		this.setState({
			visibleModal: false,
			isSelectSendTo: true
		})
		this.getFolloweesList();
	}

	getFolloweesList = async () => {
		const { _isSendToLoader, followeeList } = this.state
		console.log('called get followee list', _isSendToLoader);
		const data = {
			UserId: await AsyncStorage.getItem('userId'),
		}
		const apiname = 'FollowerFollowingsList';
		if (followeeList.length === 0) {
			this.setState({ _isSendToLoader: true })
		}
		postServiceP01(apiname, data).then(cb => {
			console.log('datas are ', cb);
			if (cb.status == 'True') {
				// console.log('sd', cb)
				cb.result.length > 0 && cb.result.map(s => {
					s.buttonFlag = 'send'
					return s;
				});
				// console.log('sd', cb)
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
				<Loader />
			)
		}
	}

	sendToUser = async (data) => {
		// console.log('data',data)
		const { selectedPostImage, followeeList } = this.state;
		console.log('the chat user id ', data.ChatUserId);
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
		console.log('the foloowee list ',followeeList[index])
		this.setState({
			followeeList: followeeList
		});

		const datas = {
			occupants_ids: data.ChatUserId,
			name: data.UserName
		};
		const postImgUrl = selectedPostImage;
		console.log('sss', postImgUrl);


		await one2onechat.initChatForNF();
		const checkConn = await one2onechat.checkConnectionFromChatServerForNF();
		if (checkConn) {
			this.createDialog(datas)
		} else {
			this.createSessionsNF(datas);
		}
	}

	createDialog = async (datas) => {
		const dialogs = await one2onechat.createDialogueForNF(datas);
		if (dialogs === false) {
			this.createDialog(datas);
		}
		this.sendMessageToUser(dialogs);
		console.log('dilIDddsss NF', dialogs);
	}

	createSessionsNF = async (datas) => {
		const info = await one2onechat.createSessionForNF();
		console.log('object check', info)
		if (info.constructor == Object) {
			this.createConnectionToChatServer(datas);
		} else {
			this.createSessionsNF(datas);
		}
	}

	createConnectionToChatServer = async (datas) => {
		const checkConSer = await one2onechat.createConnectionToServerForNF();
		this.createDialog(datas)

	}

	sendMessageToUser = async (dialogs) => {
		const { selectedPostImage, followeeList } = this.state;
		console.log('llll', dialogs);
		const appUserId = await AsyncStorage.getItem('chatUserID');
		const sentId = dialogs.occupantsIds[0] === parseInt(appUserId)
			? dialogs.occupantsIds[1]
			: dialogs.occupantsIds[0];
		const msg = await one2onechat.sendMessageForNF(dialogs, selectedPostImage);
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


	hasNoData = () => {
		const { followeeList, _isSendToLoader } = this.state;
		if (followeeList.length === 0) {
			return ( 
				// <View style={[stylesL.hasNoMem,{backgroundColor:'#00000000'}]}>
					//{/* <Text style={{ color: '#4a4a4a', fontSize: 20 }}>No Datas Yet..</Text> */}
				// </View>
				null)
		}
	}


	async report() {
	
		var data = {
			Userid: await AsyncStorage.getItem('userId'),
			Otheruserid: this.state.postId,
			Content: this.state.permission_Value
		};
		const url = serviceUrl.been_url1 + "/ReportLocalProfile";
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
				this.setState({ isModalVisible1: false, isModalVisible2: true, permission_Value: '' })
			})
			.catch((error) => {
				// console.error(error);
			});
		
	};

	async reportApi() {
		
		debugger;
		
		var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Reportid:this.state.otherUserId,
            Postid:this.state.postId,
            // Otheruserid: this.state.postId,
			Content: this.state.permission_Value,
			TypeAs : "Newsfeed"
        };
        const url = serviceUrl.been_url + "/Reportpost";
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
				//toastMsg('success', "Thank you for reporting");
				this.setState({ isModalVisible1: false, isModalVisible2: true, permission_Value: '' })
			})
			.catch((error) => {
				//toastMsg('danger', 'Sorry..something network error.Try again please.')
			});
		
	}


	unfollow = async (data) => {
		const {newsFeedData,postId,userFollowState} = this.state;
		const ind = newsFeedData.findIndex(d=>d.PostId == postId);
		newsFeedData[ind] = {...newsFeedData[ind],Follow:!userFollowState}
		this.setState({
			newsFeedData,
			userFollowState  : !userFollowState
		})
		var data = { Userid: this.state.userId,	Otheruserid: this.state.otherUserId,};
		this.setState({ visibleModal: null });
		var data = {
			Otheruserid: this.state.otherUserId,
			Userid: await AsyncStorage.getItem('userId')
		};
		const url = serviceUrl.been_url + "/Unfollow";

		return fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		}).then((response) => response.json())
			.then((responseJson) => {
				console.log('the res',responseJson);
				if (responseJson.status !== "True") {
					this.followState()
				}
			})
			.catch((error)=> {
				console.log("Catch Error", error);
			});
	}

	followState = () =>{
		toastMsg1('danger','post could not Follow or Unfollow, please try again');
		const {newsFeedData,userFollowState,postId} = this.state;
		console.log("newsfeed data for checking follow or unfollow",newsFeedData)
		const ind = newsFeedData.findIndex(d=>d.PostId == postId);
		newsFeedData[ind] = {...newsFeedData[ind],Follow: userFollowState ? false : true}
		this.setState({
			newsFeedData,
			userFollowState : userFollowState ? false : true
		});
	}

	follow = async (data) => {
		const {newsFeedData,postId,userFollowState} = this.state;
		const ind = newsFeedData.findIndex(d=>d.PostId == postId);
		newsFeedData[ind] = {...newsFeedData[ind],Follow:!userFollowState}
		this.setState({
			newsFeedData,
			userFollowState  : !userFollowState
		})
		var data = { Userid: this.state.userId,	Otheruserid: this.state.otherUserId,};
		this.setState({ visibleModal: null });
		const url = serviceUrl.been_url + "/SendFollowReq";

		return fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		}).then((response) => response.json())
			.then((responseJson) => {
				console.log('the res',responseJson);
				if (responseJson.status !== "True") {
					this.followStateChange()
				}
			})
			.catch((error)=> {
				console.log("Catch Error", error);
			});
	}

	followStateChange = () =>{
		toastMsg1('danger','Already Follow this account');
		const {newsFeedData,userFollowState,postId} = this.state;
		console.log("newsfeed data for checking follow or unfollow",newsFeedData)
		const ind = newsFeedData.findIndex(d=>d.PostId == postId);
		newsFeedData[ind] = {...newsFeedData[ind],Follow: userFollowState ? false : true}
		this.setState({
			newsFeedData,
			userFollowState : userFollowState ? false : true
		});
	}


	openUserModal(data) {
		// alert(JSON.stringify(data));
		// console.log('the user selected post',data);
		this.setState({
			visibleModal: 3,
			postId: data.PostId,
			otherUserId: data.userId,
			notifications: data.Notificationsetting == 'Off' ? 'On' : 'Off',
			userBookmarkState: data.Bookmarks ? true : false,
		})
	}

	modalOpen(data) {
		// console.log('the other user selected post',data);
		this.setState({
			visibleModal: 1,
			postId: data.PostId,
			otherUserId: data.userId,
			userBookmarkState: data.Bookmarks ? true : false,
			notifications: data.Notificationsetting == 'Off' ? 'On' : 'Off',
			selectedPostImage: newsFeddStoriesUrl + data.Image.split(',')[0]
		})
	}

	share_option() {
		Share.share(shareOptions)
		this.setState({
			visibleModal: null
		})
	}

	likesView(data) {
		console.log('the likes data',data);
		var data = {
			data: data.PostId === undefined ? data.Postid : data.PostId,
			screen: "Likes",
			likesCount : data.LikeCount
		}
		this.props.navigation.navigate('LikesView', { data: data });
	}


	readFromClipboard = async () => {
		this.setState({ visibleModal: null })
		//To get the text from clipboard
		const clipboardContent = await Clipboard.getString();
		this.setState({ clipboardContent });
	};

	writeToClipboard = async () => {
		this.setState({ visibleModal: null })
		//To copy the text to clipboard
		await Clipboard.setString("http://Been.com/" + this.state.postId);
		//toastMsg("Pending", "Link Copied");
	};


	comments(data) {
		this.props.navigation.navigate('comments', { data: data });
	}

	// imageModal(data) {
	// 	debugger
	// 	var data = {
	// 		data: data.Image,
	// 		desc: data.Desc
	// 	}
	// 	this.props.navigation.navigate("ScrollImage", { data: data })
	// }

	imageModal(data) {
		console.log('the data NF', data);
		var data = {
		  data: data.Image,
		  desc: data.Desc,
		  postLocation: data.Location + ', ' + data.Country
		}
		this.props.navigation.navigate("MultiImageView", { data: data })
	  }

	  getLocation(data) {
       // debugger;
        AsyncStorage.mergeItem('PlaceName', data.Location);
        AsyncStorage.setItem('PlaceName', data.Location);
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }


	onViewableItemsChanged = ({viewableItems, changed}) => {
		console.log("Visible items are", viewableItems);
		console.log("Changed in this iteration", changed);
		this.setState({
            selectedPostId: changed[0].index,
          })
	}

	seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }

	renderViewMore(onPress) {
		return (
			<Text style={Common_Style.viewMoreText} onPress={onPress}>
				View more
			</Text>
		)
	}
	renderViewLess(onPress) {
		return (
	    // <Text onPress={onPress}
		//  style={Common_Style.viewMoreText}>
		//    View less
		// </Text>)
		<Text style={Common_Style.viewMoreText} onPress={onPress} >View Less</Text>)
		// 	<Text onPress={onPress} style={Common_Style.viewMoreText} >View less</Text>
		// )
	}

	async OtheruserDashboard(item) {
		debugger;
		var data = {
			Userid: await AsyncStorage.getItem('userId'),
			Otheruserid: item.userId
		};
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
				AsyncStorage.setItem('OtherUserId', item.userId);
			
			if (responseJson.connectionstatus === "True") {
				AsyncStorage.setItem('OtherUserId', item.userId);
				var data = {
					ProfileAs: responseJson.ProfileAs
				}
				if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
					// this.props.navigation.navigate('LocalUserProfile', { data: data })
				}
				else if (responseJson.ProfileAs === 2) {
					this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
				}
				else {
					this.props.navigation.navigate('OtherUserProfile', { data: data })
				}
			}
			else if (responseJson.connectionstatus === "Pending") {
				AsyncStorage.setItem('OtherUserId', item.userId);
				var data = {
					ProfileAs: responseJson.ProfileAs
				}
				if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
					// this.props.navigation.navigate('LocalUserProfile', { data: data })
				}
				else if (responseJson.ProfileAs === 2) {
					this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
				}
				else {
					this.props.navigation.navigate('OtherUserProfile', { data: data })
				}
			}
			else if (responseJson.connectionstatus === "False") {
				AsyncStorage.setItem('OtherUserId', item.userId);
				var data = {
					ProfileAs: responseJson.ProfileAs
				}
				if (responseJson.LocalProfile != undefined && responseJson.LocalProfile === 'Yes') {
					// this.props.navigation.navigate('LocalUserProfile', { data: data })
				}
				else if (responseJson.ProfileAs === 2) {
					this.props.navigation.navigate('BusinessPlacProfileOthers', { data: data })
				}
				else {
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
	profileChanger = async () => {
		let local;
		debugger;
		let businessProfile;
		var data = { userId: await AsyncStorage.getItem('userId') };
		const url = serviceUrl.been_url1+'/UserProfile';
		const getType = await AsyncStorage.getItem('profileType');
		const pType = parseInt(getType);
		const localP = await AsyncStorage.getItem('localProfile');
		console.log('the ptype ',pType,' and its type ',typeof pType);
	
		if(localP && localP == "Yes"){
		  this.props.navigation.navigate('LocalUserProfile')
		}else if(pType === 2){
		  this.props.navigation.navigate('BusinessPlaceProfile')
		}else{
		  console.log('the ptype ',pType,' and its type profile1 ',typeof pType);
		  this.props.navigation.navigate('Profile')
		}
	
	  }

	itemLayout = (data,index) =>{
		const length = this.layoutHeight.length > 0 ? this.layoutHeight[index] : 410;
		const offset = this.layoutHeight.slice(0,index).reduce((a, c) => a + c, 0)
       return { length: length ? length : 410, offset: offset , index }
	}

	renderPostItem = (data, index) => {
		const {showControl,paused,volumeMuted,duration,currentTime,volume,
		  singleTapPostId} = this.state;
		return (
		  <View key={index.toString()} style={[styles.card, { height: 'auto' }]}>
			{/* <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle='light-content' /> */}
			<View style={styles.cardImage}>
			  <View style={{ flexDirection: 'row', width: '100%',marginTop:index === 0 ? StatusBar.currentHeight : 0}} >
				<View style={{ width: '10%' }} />
				<View style={{ marginTop: '2%', width: '80%', }}>
				  {data.Location === "null" ? null : (<Text onPress={() => this.getLocation(data)} 
					style={[Common_Style.cardViewLocationText,{ }]}>
					{data.Location}
				   </Text>)}
				  {data.Country === "null" ? null : (<Text onPress={() => this.getLocation(data)} 
					style={[Common_Style.cardViewLocationText, { marginBottom: 8 }]}>
					{data.Country}
				  </Text>)}
				</View>
	
				<View style={{ justifyContent: 'center', alignContent: 'center',
				  width: '10%', }}>
				  {data.userId == this.state.userId ?
					<TouchableOpacity  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.openUserModal(data)}>
					  <View style={{width: '10%',alignSelf:"center",marginRight:5}}>
					  <Image style={{ width: 16, height: 16,  }}
						source={require('../../Assets/Images/3dots.png')}
					//	resizeMode={'center'}
						></Image>
					  </View>
					</TouchableOpacity>
					:
					data.PrmoteData == "Yes" ?
					  <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.modalOpen1(data)}>
						<View style={{width: '10%',alignSelf:"center",marginRight:5}}>
						<Image style={{ width: 16, height: 16,alignSelf:"center" }}
						  source={require('../../Assets/Images/3dots.png')}
						// resizeMode={'center'}
						  ></Image>
						</View>
					  </TouchableOpacity> :
					  <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.modalOpen(data)}>
						<View style={{width: '10%',alignSelf:"center",marginRight:5}}>
						<Image style={{ width: 16, height: 16,alignSelf:"center" }}
						  source={require('../../Assets/Images/3dots.png')}
			//	  resizeMode={'center'}
						  ></Image>
						  </View>
					  </TouchableOpacity>}
				</View>
			  </View>
				
			  <TapGestureHandler ref={this.doubleTapRef}
				  onHandlerStateChange={(event)=>this._onDoubleTap(event,data)}
				  numberOfTaps={2} 
			  >  
			  <View style={[styles.imageBackGroundView, { borderRadius: 15, height: hp('62%'), }]}>
				{data.Image != undefined && data.Image.indexOf(".mp4") != -1 ?
				  <View style={{ width: "100%",height: "100%", overflow:'hidden',
				  flexDirection:'column',
				   }}>
						
					<TouchableWithoutFeedback onPress={()=> null
						//this._singleTap(data,index)
						}>
					  {/* {data.mIndex == this.state.mScrollIndex && ( */}
					 							<Video
									resizeMode="cover"
									source={{ uri: serviceUrl.newsFeddStoriesUrl + data.Image }}
									paused={data.mIndex != this.state.mScrollIndex}
									repeat={true}
									controls={false}
									resizeMode='cover'
									style={{ width: wp('90%'), height: 400, }}
									volume={this.state.volume}>
								</Video>
					  {/* )} */}
	
					</TouchableWithoutFeedback>
					{this.state.dTapLikeEnable && data.PostId == this.state.tappedPostId && (
						  <View style={{width:'100%',height:'100%',justifyContent:'center',
						  ...StyleSheet.absoluteFillObject
							}}>
						  <Image source={require('../../Assets/Images/new/LIKE-2.png')} 
					//	   resizeMode={'center'}
						   style={{width:50,height:80,alignSelf:'center',}}
						  />
						  </View>
					  )}
					{singleTapPostId == data.PostId && 
					// data.mIndex == this.state.mScrollIndex && 
					  (
					<VideoController
					  showControl={showControl}
					  pause={data.mIndex != this.state.mScrollIndex}
					  changeControl={()=>this.controlChanges(data,index)}
					  totalDuration={getTime(data.duration)}
					  currentVidTime={getTime(currentTime)}
					  sliderValue={currentTime / data.duration}
					  sliderMovingValue={e=>this.getSliderValue(e,data,index)}
					  volumeControl={this.VolumeControl}
					  volume={volumeMuted}
					/>
					)}
					  
				  
				   </View>
				  
				  :
				   
					<View style={{ height: '100%', }}>
					  <ImageBackground style={{ width: '100%', height: '100%', }} resizeMode={'cover'}
						source={data.Image == null ? require('../../Assets/Images/story2.jpg') : 
						 { 
						  // uri:data.Image
						   uri: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0] 
						 }}>
						<View style={{ flexDirection: 'row', marginTop: '3%', marginRight: 5,
						  justifyContent:'flex-end' }}>
						  <View style={{ width: '88%', }}></View>
						  <View style={{width:wp(10),height:hp(6),justifyContent:'center'}}>
							{data.Image.split(',').length > 1 ?
							  <TouchableOpacity activeOpacity={1} onPress={() => data.Image.split(',').length > 1 ? this.imageModal(data) : null} >
								<Image style={{ width: wp(6), height: hp(4), marginTop: '5%',alignSelf:'center' }}
								  source={require('../../Assets/Images/MULTIPIC.png')}>
								</Image>
							   </TouchableOpacity>
							  :
							  <Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} ></Image>
							 }
						  </View>
						</View>
						{this.state.dTapLikeEnable && data.PostId == this.state.tappedPostId && (
						  <View style={{width:'100%',height:'75%',justifyContent:'center',
						  
							}}>
						  <Image source={require('../../Assets/Images/new/LIKE-2.png')} 
						 resizeMode={'center'}
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
						{data.UserProfilePic === undefined || data.UserProfilePic === null ? (
						  <View >
							<Image style={[Common_Style.mediumAvatar, { marginTop: 8 }]}
							  source={{
								uri: serviceUrl.profilePic + data.UserProfilePic
							  }}></Image>
						  </View>)
						  : (
							<ImageBackground style={[Common_Style.mediumAvatar,]} borderRadius={50}
							  source={{ uri: serviceUrl.profilePic + data.UserProfilePic }}>
							  <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImagesmall} />
							</ImageBackground>
						  )}
					  </View>
					) :
					  (<View>
						{data.UserProfilePic === undefined || data.UserProfilePic === null ?
						  <Image style={[Common_Style.mediumAvatar, { marginTop: 5 }]}
							source={require(imagePath + 'profile.png')}></Image>
						  :
						  <Image style={[Common_Style.mediumAvatar, { marginTop: 5 }]}
							source={{ uri: serviceUrl.profilePic + data.UserProfilePic }}></Image>}
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
					  <TouchableOpacity onPress={() => { this.likes(data) }}>
						<Image style={{ width: '130%', height: '110%', }} resizeMode={'stretch'} source={
						  data && data.userLiked && data.userLiked == true ?
							require('../../Assets/Images/new/LIKE-2.png') :
							require('../../Assets/Images/new/likeBlack.png')}></Image>
					  </TouchableOpacity>
					</View>
					<TouchableOpacity onPress={() => this.likesView(data)} hitSlop={{ left: 8, right: 8, top: 5, bottom: 5 }} >
					  <Text onPress={() => this.likesView(data)} style={[Common_Style.countFont, { marginLeft: 12, marginTop: 7 }]} >
						{data.LikeCount != 0 || null || undefined ? data.LikeCount : 0}
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
					  <Text onPress={() => this.comments(data)} style={[Common_Style.countFont, { marginLeft: 12, marginTop: 7 }]} >
						{data.Commentcount != 0 || null || undefined ? data.Commentcount : 0}
					  </Text></TouchableOpacity>
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
			flexDirection: 'row',marginBottom:30
		  }}>

		   <Text >  </Text>
	
		  </View>
		);
	  }

	render() {
		const {selectedPostId} = this.state;
        const {navigation} = this.props;
		const data = this.props.route.params.data
		const sIndex = data.selectedPostId ? data.selectedPostId : 0;
		const screen = data !=undefined && data.screenName !=undefined ? data.screenName : null;
		// const selectedIndex = data.selectedPostId;
        const title = screen == undefined ? null : screen
		return (
			<View style={{ flex: 1 }}>

				<StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle='dark-content' />

					{this.state.isLoading != true && this.state.newsFeedData.length != 0 ?
						<View style={{ height: dh + StatusBar.currentHeight ,backgroundColor:'black',}}>
							
							<FlatList
                                style={{ width: '100%',}}
								ref={ref => this.flatList = ref}
								onMomentumScrollEnd={(event) => {
                                    const index = Math.round(event.nativeEvent.contentOffset.y / event.nativeEvent.layoutMeasurement.height)
                                    //this.setState({ mScrollIndex: index })
                                  }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
								// onViewableItemsChanged={this.onViewableItemsChanged}
								viewabilityConfig={{ 
									itemVisiblePercentThreshold: 60,
									// minimumViewTime: 500,
        							// viewAreaCoveragePercentThreshold: 60,
								}}
                                initialScrollIndex = {0}
								data={this.state.newsFeedData}
								renderItem={({ item, index }) => ( this.renderPostItem(item, index))}
								onLayout={this.onlayouEvents}
								getItemLayout = {this.itemLayout}
								// onContentSizeChange={(contentWidth, contentHeight) => {
                                //     // console.log('contentidth',contentWidth,'--conHeig',contentHeight);
                                //     this.flatList.scrollToIndex({
								// 		animated: false, 
								// 		// viewPosition: 0,
                                //         index: selectedPostId
                                //     })
								// }}
								
								ListFooterComponent={this.renderFooter.bind(this)}
                                extraData = {this.state} 
                                keyExtractor={(item, index ) => index.toString()}
                            />	
						 
						</View>
						:
						<View style={{ flex: 1, flexDirection: "column", marginTop: '45%' }} >
							<Spinner color="#fb0143" />
						</View>
					}

				{/* Other Users */}
				<Modal
					isVisible={this.state.visibleModal === 1}
					onBackdropPress={() => this.setState({ visibleModal: false })}
					onBackButtonPress={() => this.setState({ visibleModal: false })}
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
							<View style={{ marginTop: 0, width: '100%',}}>
								{/* {this.state.userBookmarkState == true ? */}
									<Text onPress={() => { this.bookmarkLikes() }} style={styles.modalText}>
										Saved
									  </Text> 
									  {/* : */}
									{/* <Text onPress={() => { this.bookmarkLikes() }} style={styles.modalText}>
										Save Post
									 </Text>} */}
							</View>
						{/* </TouchableOpacity> */}

						<View style={styles.horizontalSeparator} />

						<View style={{ width:'100%' }}>
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

						<View style={{width:'100%'}} >
							<Text onPress={() => this.share_option()}
								style={[styles.modalText]} >
								Share
				  			</Text>
						</View>

						<View style={styles.horizontalSeparator} />

						<TouchableOpacity onPress={() => this.writeToClipboard()} style={{ width: '100%', }}>
							<Text onPress={() => this.writeToClipboard()} style={[styles.modalText]}>
								Copy Link
				  </Text></TouchableOpacity>
						<View style={styles.horizontalSeparator} />

					<View style={{ width: '100%', }} >
					{this.state.userFollowState == true ?
					 <Text onPress={() => this.unfollow()} style={[styles.modalText, { color: '#708fd5',}]}>
									Unfollow account
						   </Text> :
						   <Text onPress={() => this.follow()} style={[styles.modalText, { color: '#708fd5',}]}>
						   Follow account
				  </Text>}
     				</View>


						<View style={styles.horizontalSeparator} />
						<TouchableOpacity onPress={() => this.setState({ visibleModal: null, isModalVisible1: true })} style={{ width: '100%', }}>
							<Text onPress={() => this.setState({ visibleModal: null, isModalVisible1: true })} 
							 style={[styles.modalText, { color: '#e45d1b'}]}>
								Report post
				  			</Text>
						</TouchableOpacity>
						
					</View>
				</Modal>

				<Modal isVisible={this.state.visibleModal === 3}
					onBackdropPress={() =>
						this.setState({ visibleModal: null })}
					onBackButtonPress={() => this.setState({ visibleModal: null })} >
					<View style={styles.modalContent} >
						{/* <StatusBar hidden /> */}
						<StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

						<View style={{ width:'100%' }}>
							<TouchableOpacity onPress={() => this.editPost()}>
								<Text style={styles.modalText}>
									Edit
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.horizontalSeparator} />

						<View style={{ width:'100%' }}>
							<Text onPress={() => this.sendTo()} style={styles.modalText}>
								Send
							 </Text></View>
						<View style={styles.horizontalSeparator} />

						<View style={{width:'100%'}} >
							<TouchableOpacity onPress={() => this.share_option()}>
								<Text style={styles.modalText}>
									Share
							   </Text>
							</TouchableOpacity>
						</View>

						<View style={styles.horizontalSeparator} />

						<View style={{width:'100%'}}>
							<TouchableOpacity onPress={() => this.writeToClipboard()}>
								<Text style={styles.modalText}>
									Copy Link
								</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.horizontalSeparator} />


						<View style={{width:'100%'}}>
							<TouchableOpacity onPress={() => this.deletePost()}>
								<Text style={[styles.modalText, { color: '#fb874c' }]}>
									Delete Post
								</Text>
							</TouchableOpacity>
						</View>

					</View>
				</Modal>

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
								// marginBottom: 8, borderBottomColor: '#a7a7a7', borderBottomWidth: 0.5
							}}>
								<View>
									<Text style={{ fontSize: 14,fontFamily: Username.Font, color: '#222', marginLeft: 20 }}>
										Send To
				   					</Text>
								</View>
								<View>
									<TouchableOpacity onPress={() => this.setState({ isSelectSendTo: false })}>
									<View style={{width:'100%',marginBottom:10,justifyContent:'center'}}>
									<Icon
										name={"chevron-down" }
										size={Platform.OS === "ios" ? 30 : 26}
										color="#000"
										type="material-community"
										// onPress={}
										iconStyle={{marginRight: 26,}} 
										/>
									</View>
										{/* <Image style={{ width: 22, height: 22, marginRight: 30, }}
											source={require('../../Assets/Images/downarrow.png')} /> */}
									</TouchableOpacity>
								</View>
							</View>

							{/* <View style={{ marginTop: 8, marginBottom: 8 }}> */}
								<View style={[Common_Style.searchView, { width: wp('97%') }]}>
									{/* <Image source={require('../../Assets/Images/Search.png')} resizeMode={'center'}
										style={{ width: wp(5), height: hp(3), marginLeft: 10, top: 11, position: 'absolute' }} /> */}
									<RNTextInput
										// value={this.state.search} 
										onChangeText={text => this.SearchFilterFunction1(text)}
										style={Common_Style.searchTextInput}
										autoCorrect={false}
										//  keyboardType="visible-password"
										theme={{ colors: { primary: 'white' } }}
										placeholder={'Search '} placeholderTextColor={'#6c6c6c'} />
									{/* <TextInput
										placeholder='Search...'
										placeholderTextColor='#000'
										style={stylesL.textInput}
										//onChangeText={text => this.SearchFilterFunction1(text)}
										selectionColor='red'
										style={stylesL.textInput} /> */}
								</View>
							{/* </View> */}
							{/* <ScrollView contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}> */}

							<View style={{ flex: 1 }}>
								{this.sendToLoader()}
								<FlatList
									data={this.state.followeeList}
									extraData={this.state}
									// ItemSeparatorComponent={seperator()}
									keyboardShouldPersistTaps="always"
									onScroll={() => Keyboard.dismiss()}
									renderItem={({ item, index }) => (
										
										<View key={`id${index}`} style={{ flexDirection: 'row', height: 70, width: wp('100%'), justifyContent: 'flex-start' }}>
											<View style={{ width: wp('2%') }} />
											<View style={{ width: wp('15%'), }}>
												{item.ProfilePic != null ?
													<View style={{
														width: 50, height: 50, borderRadius: 25, overflow: 'hidden',
														alignSelf: 'center', backgroundColor: '#c1c1c1', margin: 10
													}}>
														<Image style={{ width: '100%', height: '100%', }}
															resizeMode={'cover'}
															source={{ uri: profilePic + item.ProfilePic }} />
													</View>
													:
													<View style={{
														width: 50, height: 50, borderRadius: 25, overflow: 'hidden',
														alignSelf: 'center', backgroundColor: '#c1c1c1', margin: 10
													}}>
														<Image style={{ width: '100%', height: '100%', }}
															resizeMode={'cover'}
															source={require('../../Assets/Images/profile.png')} />
													</View>
												}
											</View>

											<View style={{ width: wp('55%'), }}>
												<Text style={{ marginTop: 20, fontSize: 16, marginLeft: 5 }}>
													{item.UserName}
												</Text>
											</View>


											<View style={{ justifyContent: 'center', width: wp('23%'), alignSelf: 'center' }}>
												{item.buttonFlag == 'waiting' && (
													<Text style={{ color: '#444', textAlign: 'center', fontSize: 14, fontFamily: Username.Font,
														}}>
														Sending...
													</Text>
												)}

												{item.buttonFlag == 'sent' && (
													<Image source={require('../../Assets/Images/check.png')}
													 resizeMode={'contain'}
													style={{ width: 20, height: 20, alignSelf: 'center' }}
													/>
												)}
												<TouchableOpacity disabled={item.buttonFlag == 'sent' || item.buttonFlag == 'waiting'}
													onPress={() => this.sendToUser(item)}>
													{item.buttonFlag == 'send' && (
													<View style={{
														backgroundColor: '#ff1c49', paddingTop: 8, paddingBottom: 8,
														paddingLeft: 12, paddingRight: 12, borderRadius: 10,
													}}>
														
															<Text style={{ color: Common_Color.common_white, fontSize: 14, textAlign: 'center',fontFamily: Username.Font }}>
																Send
                             								</Text>
													  </View>
													)}		 
												</TouchableOpacity>
											</View>

											<View style={{ width: wp('3%') }} />

										</View>

									)}
									keyExtractor={(item, index) => index.toString()}
									horizontal={false}
								/>
								{/* </KeyboardAvoidingView> */}
							</View>
							{/* </ScrollView> */}
							{this.hasNoData()}
						</View>

					</KeyboardAvoidingView>
				</Modal>

                {/* Report models */}
				<Modal isVisible={this.state.isModalVisible1}
                                        onBackdropPress={() => this.setState({ isModalVisible1: null })}
                                        onBackButtonPress={() => this.setState({ isModalVisible1: null })} >
                                        <View style={[Common_Style.parentViewReport,{borderRadius:25,justifyContent: 'center',}]} >
                                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                                            <Image style={[{marginTop:10,alignSelf:'center',width:42,height:42}]} source={require('../../Assets/Images/new/Expression.png')} resizeMode={'contain'}/>
                                            <Text style={Common_Style.headerReport} >
                                                Inappropriate Content!
											</Text>
                                            <Text style={Common_Style.subHeaderReport} >
                                                We are sorry for the inconvenience!
											</Text>
                                            <View style={[Common_Style.contentViewReport,{alignSelf: 'center',}]}>
                                                <Text style={Common_Style.contentReport} >
                                                    We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
												</Text>
                                            </View>
                                            <TextInput
                                                label=" Type Here..."
                                                placeholderStyle={Common_Style.PstyleReport}
                                                mode="outlined" gnb
                                                multiline={true}
												maxLength={500}
												autoCorrect={false}
												//  keyboardType="visible-password"
												// flexWrap: 'wrap'
												error = {this.state.reportEmpty}
                                                onChangeText={(text) => { this.setState({ permission_Value: text,reportEmpty : false }) }}
                                                value={this.state.permission_Value}
                                                style={[Common_Style.TstyleReport,{marginLeft:0,alignSelf:'center'}]}
                                                selectionColor={'#f0275d'} theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000',  paddingLeft: 5 } }} />

                                            <View style={Common_Style.buttonViewReport} >

                                                <TouchableOpacity
                                                    onPress={() => this._toggleModal12()}
                                                    activeOpacity={1.5}
                                                >
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.75 }}
                                                        end={{ x: 1, y: 0.25 }}
                                                        style={Common_Style.ButtonReport}
                                                        colors={["#fb0043", "#fb0043"]}
                                                    >

                                                        <Text onPress={() => this._toggleModal12()}
                                                            style={Common_Style.ButtonTextReport}>
                                                            Report
</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>


                                                <TouchableOpacity
                                                    onPress={() => this._toggleModal1()}
                                                    activeOpacity={1.5}
                                                >
                                                    <View style={Common_Style.ButtonCancel}>
                                                        <Text onPress={() => this._toggleModal1()} style={Common_Style.CancelButtonTextReport}>
                                                            Cancel
</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>

			{/* Thanks Modal */}
        <Modal isVisible={this.state.isModalVisible2}
          onBackdropPress={() => this.setState({ isModalVisible2: false })}
          onBackButtonPress={() => this.setState({ isModalVisible2: false })} >
          <View style={[Common_Style.TparentView,{borderRadius:25,justifyContent:'center'}]} >
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            
			<Text style={Common_Style.TheaderInModalTwo} >
              Thank you for your voice!
			</Text>

            <View style={[Common_Style.TcontentViewInModalTwo,{alignSelf:'center'}]}>
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
            <View style={[Common_Style.TokayButton,]}>
              <TouchableOpacity onPress={() => this.setState({ isModalVisible2: false })} activeOpacity={1.5} >
                <Text onPress={() => this.setState({ isModalVisible2: false })} style={[Common_Style.TokayButtonText]}>
                  Okay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

			{/* Delete Modal */}
		<Modal isVisible={this.state.isModalVisible3}
          onBackdropPress={() => this.setState({ isModalVisible3: false })}
          onBackButtonPress={() => this.setState({ isModalVisible3: false })} >
          <View style={[styles.deleteModalView,]} >
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' }}>
              <Text style={{ color: '#c1c1c1', marginTop: hp('2%'), textAlign: 'center', marginBottom: hp('1.3%'), fontSize: 20, fontFamily: Common_Color.fontMedium }}>
                Are you sure want to delete the post?
                                    </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: wp('100%'), marginTop: 10, marginBottom: 10 }}>
              <ImageBackground borderRadius={5} source={require('../../Assets/Images/button.png')}
                style={styles.smallColrButton}>
                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                  onPress={() => this.deleteData()}>
                  <Text style={Common_Style.Common_btn_txt}>{this.state.buttonName}</Text>
                </TouchableOpacity>
              </ImageBackground>
              <View style={{ width: wp('20%'), height: hp("4%"), borderWidth: .5, borderRadius: 5 }}>
                <Text onPress={() => this.setState({ isModalVisible3: false })} style={[styles.modalText, { textAlign: 'center', marginTop: 5 }]}>Cancel</Text>
              </View>
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



