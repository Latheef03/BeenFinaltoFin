import React, { Component } from 'react';
import {
	View, Clipboard, Text, ImageBackground, Image, Share, TextInput,
	Dimensions, KeyboardAvoidingView, ScrollView, ToastAndroid,
	Animated, StatusBar, FlatList, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toastMsg,toastMsg1 } from '../../Assets/Script/Helper';
let Common_Api = require('../../Assets/Json/Common.json')
import { Footer, FooterTab, Button, Spinner, Content } from 'native-base'
import { DrawerLayoutAndroid } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import common_styles from "../../Assets/Styles/Common_Style"
import Video from "react-native-video";
import { PLAYER_STATES } from "react-native-media-controls";
import styles from '../../styles/NewfeedImagePost';
import ViewMoreText from 'react-native-view-more-text';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import Loader from '../../Assets/Script/Loader';
import { deviceHeight, deviceWidth } from '../_utils/CommonUtils';
import { OneToOneChat } from '../Chats/';
import { postServiceP01 } from 'Been/App/Component/_services';
import ParsedText from 'react-native-parsed-text';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'
import TransBack from '../CustomComponent/TransBack';
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

export default class PostsLikedAllPost extends Component {

	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		one2onechat = new OneToOneChat();
		this.state = {
			newsFeedData: '',
			getTagdata: '',
			userBookmarkState: false,
			isModalVisible: false,
			isModalVisible1: false,
			isModalVisible2: false,
			visibleModal: false,
			notifications: "",
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

		}
	}

	async componentWillMount() {
		debugger;
		var userId = await AsyncStorage.getItem('userId');
		var ProfileType = await AsyncStorage.getItem('profileType');
		const Comments = this.props.route.params.data
		const mData = Comments.memoryData;
		this.setState({
			// screenName: Comments ? Comments.screenName : '',
			userProfileType: ProfileType, userId: userId,
			selectedPostId: Comments != undefined ? Comments.selectedPostId : ''
		})
		this.fetchDetails(mData);
	}


	fetchDetails = async (responseJson) => {
		debugger;
		if (responseJson.status == "True") {
			let getData = responseJson.result == undefined ? responseJson.Result : responseJson.result
			this.setState({
				newsFeedData: getData
					? getData : [],
				isLoading: false
			})
		}
	}

	async likes(data) {
		var id = await AsyncStorage.getItem('userId');
		var data = {
			Userid: id,
			Postid: data.Postid
		};
		const { newsFeedData } = this.state;
		console.log('the nfdata', newsFeedData);
		const index = newsFeedData.findIndex(d => d._id == data.Postid);
		newsFeedData[index].likes = !newsFeedData[index].likes
		let likeCount = 0
		newsFeedData[index] = { ...newsFeedData[index], likes: newsFeedData[index].likes }

		if (newsFeedData[index].likecount == undefined) {
			likeCount = 1
		}
		else if (newsFeedData[index].likes) {
			likeCount = newsFeedData[index].likecount + 1
		}
		else if (!newsFeedData[index].likes) {
			likeCount = newsFeedData[index].likecount - 1
		}
		console.log('the like counts', likeCount);
		newsFeedData[index] = { ...newsFeedData[index], likecount: likeCount }

		this.setState({ newsFeedData });
		this.callLikeApi(data);
	}

	callLikeApi = async (data) => {
		const url = serviceUrl.been_url + "/LikeFeedPost";
		return fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		}).then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status == "True") {
					// this.fetchDetails();
				}
				else {
					// this.setState({ likes: false })
					this.likeErrorHandling(data)
				}
			})
			.catch((error) => {
				console.log("Catch Error", error);
				this.likeErrorHandling(data)
			});
	}

	likeErrorHandling = (data) => {
		const { newsFeedData } = this.state;
		console.log('the nfdata', newsFeedData);
		const index = newsFeedData.findIndex(d => d._id == data.Postid);
		newsFeedData[index].likes = !newsFeedData[index].likes
		let likeCount = 0
		newsFeedData[index] = { ...newsFeedData[index], likes: newsFeedData[index].likes }

		if (newsFeedData[index].likecount == undefined) {
			likeCount = 1
		}
		else if (newsFeedData[index].likes) {
			likeCount = newsFeedData[index].likecount + 1
		}
		else if (!newsFeedData[index].likes) {
			likeCount = newsFeedData[index].likecount - 1
		}
		console.log('the like counts', likeCount);
		newsFeedData[index] = { ...newsFeedData[index], likecount: likeCount }

		this.setState({ newsFeedData });
	}

	async bookmarkLikes() {
		var data = { Userid: this.state.userId, Postid: this.state.postId };
		const url = serviceUrl.been_url + "/Bookmark";
		return fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		}).then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status == "True") {
					this.fetchDetails();
				}
				else {
					this.setState({ likes: false })
				}
			})
			.catch(function (error) {
				console.log("Catch Error", error);
			});

	}


	async notifyData() {
		this.setState({ visibleModal: null });
		var data = {
			Userid: await AsyncStorage.getItem('userId'),
			Postid: this.state.postId,
			Otheruserid: this.state.otherUserId,
		};
		var base_url = serviceUrl.been_url1 + "/TurnOnOffNotitfication";
		//var base_url = serviceUrl.end_user + "/NotificationSettings";
		return fetch(base_url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.status == "True") {
					this.getTags();
				}
			})
			.catch(function (error) {
				console.log("Error in newsfeed ")
			});
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
			// const url = serviceUrl.been_url1 + "/ReportLocalProfile";
			if (this.state.permission_Value == "" || null || undefined) {
				toastMsg1('danger', "Please give a report")
			//	ToastAndroid.show("Please give a report", ToastAndroid.LONG)
			}
			else {
		this.setState({
			isModalVisible: null,
			isvisibleModal: null,
			//  permission_Value: "",
			isModalVisible1: !this.state.isModalVisible1
		});
		this.report();
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
				console.log('sd', cb)
				this.setState({
					followeeList: cb.result,
					_isSendToLoader: false,

				})
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
		// console.log('the foloowee list ',followeeList)
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
				<View style={stylesL.hasNoMem}>
					<Text style={{ color: '#4a4a4a', fontSize: 20 }}>No Users Yet..</Text>
				</View>)
		}
	}


	async report() {
		debugger;
		// var data = {
		// 	Userid: await AsyncStorage.getItem('userId'),
		// 	Otheruserid: this.state.postId,
		// 	Content: this.state.permission_Value
		// };
	
		var data = {
			Userid: await AsyncStorage.getItem('userId'),
			Reportid: this.state.otherUserId,
			// Otheruserid: this.state.postId,
			Postid: this.state.postId,
			Content:  this.state.permission_Value,
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
				this.setState({ isModalVisible1: false, isModalVisible2: true, permission_Value: '' })
			})
			.catch((error) => {
				// console.error(error);
			});
		
	};

	async reportApi() {
		// var data = {
		// 	Userid: await AsyncStorage.getItem('userId'),
		// 	Otheruserid: this.state.postId,
		// 	Content: this.state.postContent
		// };
		// const url = serviceUrl.been_url + "/ReportOtheruser";
		
		var data = {
            Userid: await AsyncStorage.getItem('userId'),
            Reportid:this.state.otherUserId,
            Postid:this.state.postId,
            // Otheruserid: this.state.postId,
            Content: this.state.postContent
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
			})
			.catch((error) => {
				//toastMsg('danger', 'Sorry..something network error.Try again please.')
			});
		
	}


	unfollow = async (data) => {
		this.setState({ visibleModal: null });
		var data = {
			Otheruserid: this.state.otherUserId,
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

	openUserModal(data) {
		this.setState({
			visibleModal: 3,
			postId: data.PostId,
			otherUserId: data.userId,
			userBookmarkState: data.userBookmarked,
		})
	}

	modalOpen(data) {
		debugger;
		this.setState({
			visibleModal: 1,
			postId: data.PostId,
			otherUserId: data.UserId,
			userBookmarkState: data.userBookmarked,
			notifications: data.Notificationsetting,
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
		var data = {
			data: data.PostId === undefined ? data.Postid : data.PostId,
			screen: "Likes"
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
        AsyncStorage.mergeItem('PlaceName', data.Location);
        AsyncStorage.setItem('PlaceName', data.Location);
        this.props.navigation.navigate('BusinessPlaceHomeOther', { data: data });
    }


	onViewableItemsChanged = ({ viewableItems, changed }) => {
		console.log("Visible items are", viewableItems);
		console.log("Changed in this iteration", changed);
	}

	seperator() { <View style={{ width: "50%", margin: '5%' }}></View> }

	onloadVideo = (meta, data, index) => {
        const { newsFeedData } = this.state
        data.duration = meta.duration
        newsFeedData[index] = data;
        console.log('the news',newsFeedData);
        this.setState({ newsFeedData })
    }

    onprogressVideo = ({ currentTime }) => {
        this.setState({ currentTime })
    }
    loadStart = e => {
        console.log('the load start', e)
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
        console.log('the buffr video', e);
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
	renderViewMore(onPress) {
		return (
			<Text style={Common_Style.viewMoreText} onPress={onPress}>View more</Text>
		)
	}
	renderViewLess(onPress) {
		return (
			<Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize,fontFamily:Viewmore.Font, }}></Text>)
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
			// 	if (responseJson.connectionstatus === "True") {
			// 		AsyncStorage.setItem('OtherUserId', item.userId);
			// 		var data = {
			// 			ProfileAs: responseJson.ProfileAs
			// 		}
			// 		this.props.navigation.navigate('OtherUserProfile', { data: data })
			// 	}
			// 	else if (responseJson.connectionstatus === "Pending") {
			// 		AsyncStorage.setItem('OtherUserId', item.userId);
			// 		this.props.navigation.navigate('OtherUserProfile')
			// 	}
			// 	else if (responseJson.connectionstatus === "False") {
			// 		AsyncStorage.setItem('OtherUserId', item.userId);
			// 		this.props.navigation.navigate('OtherUserProfile')
			// 	}
			// 	else if (responseJson.connectionstatus === "Mismatch") {
			// 		this.props.navigation.navigate('Profile')
			// 	}
			// 	else {
			// 		toastMsg('success', responseJson.message)
			// 	}
			// })
			// .catch((error) => {
			// 	// console.error(error);
			// 	toastMsg('danger', 'Sorry..something network error.Try again please.')
			// });
			if (responseJson.connectionstatus === "True") {
				AsyncStorage.setItem('OtherUserId', item._id);
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
				AsyncStorage.setItem('OtherUserId', item._id);
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
				AsyncStorage.setItem('OtherUserId', item._id);
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
	itemLayout = (data,index) =>(
            { length: 410, offset: 570 * index, index }
	)
	
	extractDesctiption = (data) => {

		if (data == undefined || data.length == 0) {
		  return null;
		}
	
		// console.log('the data',data[0].desc);
		return data[0].desc != undefined ? data[0].desc : null;
	  }

	renderPostItem = (data, index) => {
		debugger
		const {showControl,paused,volumeMuted,duration,currentTime,volume,
            singleTapPostId} = this.state;
		return (
			<View key={index.toString()} style={styles.card}>
				<View style={styles.cardImage}>
					<View style={{ flexDirection: 'row', width: '100%' }} >
						<View style={{ width: '11%' }} />
						<View style={{ marginTop: '2%', width: '80%', }}>
							{data.Location === "null" ? null : (<Text onPress={() => this.getLocation(data)} style={[Common_Style.cardViewLocationText]}>{data.Location}</Text>)}
							{data.Country === "null" ? null : (<Text onPress={() => this.getLocation(data)} style={[Common_Style.cardViewLocationText]}>{data.Country}</Text>)}
						</View>
						<View style={{ justifyContent: 'center', alignContent: 'center' }}>
							{data.userId == this.state.userId ?
								<TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.openUserModal(data)}>
									<Image style={{ width: 20, height: 22, marginLeft: 'auto', marginRight: 'auto', }}
										source={require('../../Assets/Images/3dots.png')}></Image>
								</TouchableOpacity>
								:

								<TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10, }} onPress={() => this.modalOpen(data)}>
									<Image style={{ width: 20, height: 20, marginLeft: 'auto', marginRight: 'auto', }}
										source={require('../../Assets/Images/3dots.png')}></Image>
								</TouchableOpacity>}
						</View>
					</View>

					<View style={styles.imageBackGroundView}>
						{data.Image.indexOf(".mp4") != -1 ?
							<View style={{ width: "90%", flex: 1, }}>
								<Video
									resizeMode="cover"
									source={{ uri: serviceUrl.newsFeddStoriesUrl + data.Image }}
									paused={data.mIndex != this.state.mScrollIndex}
                                  repeat={false}
                                  controls={false}
                                  resizeMode='cover'
                                  style={{ width: wp('96%'), height: '100%', }}
                                  volume={volume}
                                  onBuffer={this.onBufferVideo}
                                  bufferConfig={{
                                    minBufferMs: 15000,
                                    maxBufferMs: 50000,
                                    bufferForPlaybackMs: 2500,
                                    bufferForPlaybackAfterRebufferMs: 5000
                                  }}
                                  onLoadStart={this.loadStart}
                                  onEnd = {()=>data.mIndex == this.state.mScrollIndex ?this.onVideoEnd(data,index) : null}
                                  onError = {this.videoError}
                                  onLoad = {e=>this.onloadVideo(e,data,index)}
                                  onProgress = {data.mIndex == this.state.mScrollIndex ? this.onprogressVideo : null}

                                >
								</Video>
							</View>
							:

							<TouchableOpacity activeOpacity={1} onPress={() => data.Image.split(',').length > 1 ? this.imageModal(data) : null} >
								<View style={{ height: '100%' }}>
									<ImageBackground style={{ width: '100%', height: '100%', }} resizeMode={'cover'}
										source={data.Image == null ? require('../../Assets/Images/story2.jpg') : { uri: serviceUrl.newsFeddStoriesUrl + data.Image.split(',')[0] }}>
										<View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
											<View style={{ width: '88%', }}></View>
											{data.Image.split(',').length > 1 ?
												<Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }}
													source={require('../../Assets/Images/MULTIPIC.png')}>
												</Image> :
												<Image style={{ width: wp(10), height: hp(4), marginTop: '7%' }} ></Image>}
										</View>
									</ImageBackground>
								</View>
							</TouchableOpacity>
						}
					</View>
					<View style={{ flexDirection: 'row', marginTop: '5%' }}>
						<View>
							<View style={{ flexDirection: 'row', }}>

								{data.VerificationRequest === "Approved" ? (
									<View >
										{data.ProfilePic === undefined || null ? (
											<View >
												<Image style={[Common_Style.mediumAvatar, { marginTop: 2 }]}
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
										{data.ProfilePic === undefined || null ?
											<Image style={[Common_Style.mediumAvatar, { marginTop: 2 }]}
												source={require(imagePath + 'profile.png')}></Image>
											:
											<Image style={[Common_Style.mediumAvatar, { marginTop: 2 }]}
												source={{ uri: serviceUrl.profilePic + data.ProfilePic }}></Image>}
									</View>)}


								<View style={{ width: '78%', justifyContent: 'center' }}>
									<Text onPress={() => this.OtheruserDashboard(data)} style={[Common_Style.userName, { marginTop: 3 }]}>{data.Name}</Text>
								</View>
							</View>
							<View style={{ width: '80%', height: 'auto', marginTop: '5%' }}>
								<ViewMoreText
									numberOfLines={2}
									renderViewMore={this.renderViewMore}
									renderViewLess={this.renderViewLess}
								>

									{/* <ParsedText style={Common_Style.descriptionText}
										parse={[{ pattern: /#(\w+)/, style: Common_Style.hashtagColor },]}>
										{data.Description === "null" ? null : data.Description}
									</ParsedText> */}

<ParsedText style={Common_Style.descriptionText}
										parse={[{ pattern: /#(\w+)/, style: Common_Style.hashtagColor },]}>
										{/* {data.Description === "null" ? null : data.Description} */}
										{this.extractDesctiption(data.Desc)}
									</ParsedText>

								</ViewMoreText>
							</View>
						</View>

						<View style={{ width: 60, height: 80, justifyContent: 'space-evenly', marginLeft: '1%' }}>
							{/* Like  */}
							<View style={{ flexDirection: 'row', }}>
								<View style={{ width: 25, height: 25 }}>
									<TouchableOpacity onPress={() => { this.likes(data) }}>
										<Image style={{ width: '100%', height: '100%', }} resizeMode={'stretch'} source={
											data && data.userLiked && data.userLiked == true ?
												require('../../Assets/Images/new/LIKE-2.png') :
												require('../../Assets/Images/new/likeBlack.png')}></Image>
									</TouchableOpacity>
								</View>
								<Text onPress={() => this.likesView(data)} style={Common_Style.countFont} >
									{data.likecount}
								</Text>
							</View>

							{/* Comment  */}
							<View style={{ flexDirection: 'row', }}>
								<View style={{ width: 25, height: 25 }}>
									<TouchableOpacity onPress={() => { this.comments(data) }}>
										<Image style={{ width: '100%', height: '100%', }} resizeMode={'stretch'}
											source={require('../../Assets/Images/new/commentBlack.png')} resizeMode={'stretch'}></Image>
									</TouchableOpacity>
								</View>
								<Text onPress={() => this.comments(data)} style={Common_Style.countFont} >
									{data.Commentcount}
								</Text>
							</View>

						</View>
					</View  >

					{data.SponsoredBy != null && data.SponsoredBy != 'null' ?
						<Text style={{ textAlign: 'center',fontFamily:Viewmore.Font, fontSize: Viewmore.FontSize,color: '#ff5555', marginVertical: 5 }}>Sponsored By {data.SponsoredBy}</Text>
						: null}
				</View>
			</View>

		)
	}

	render() {
		const {selectedPostId} = this.state;
        const {navigation} = this.props;
        const data = navigation.getParam('data');
        const screen = data !=undefined && data.screenName !=undefined ? data.screenName : null;
        const title = screen == undefined ? null : screen
		return (
			<View style={{ flex: 1,marginTop:'5%' }}>

				<View>
					<StatusBar backgroundColor="#fff" barStyle='dark-content' />
					{/* <Toolbar {...this.props}  /> */}

					{this.state.isLoading != true && this.state.getTagdata != null ?
						<View style={{ height: height * .9699 }}>
							
							<FlatList
                                style={{ width: '100%',backgroundColor:'#000' }}
                                ref={ref => this.flatList = ref}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                onViewableItemsChanged={this.onViewableItemsChanged}
                                viewabilityConfig={{    itemVisiblePercentThreshold: 60    }}
                                initialScrollIndex = {0}
                                getItemLayout = {this.itemLayout}
                                data={this.state.newsFeedData}
                                renderItem={({ item, index }) => (    this.renderPostItem(item, index))}
                                onContentSizeChange={(contentWidth, contentHeight) => {  this.flatList.scrollToIndex({ animated: false,viewPosition:0,index:selectedPostId })}}
                                extraData = {this.state} 
                                keyExtractor={(item, index ) => index.toString()}
                            />			
						</View>
						:
						<View style={{ flex: 1, flexDirection: "column", marginTop: '45%' }} >
							<Spinner color="#fb0143" />
						</View>
					}

				</View>

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
						<StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

						<TouchableOpacity style={{ width: '100%', }} onPress={() => { this.bookmarkLikes() }}>
							<View style={{ marginTop: 10, width: '100%', }}>
								{this.state.userBookmarkState == true ?
									<Text onPress={() => { this.bookmarkLikes() }} style={styles.modalText}>
										Saved
									  </Text> :
									<Text onPress={() => { this.bookmarkLikes() }} style={styles.modalText}>
										Save Post
									 </Text>}
							</View>
						</TouchableOpacity>

						<View style={styles.horizontalSeparator} />

						<View style={{ marginTop: 7 }}>
							<Text onPress={() => this.sendTo()} style={styles.modalText}>
								Send
						</Text></View>
						<View style={styles.horizontalSeparator} />

						<TouchableOpacity onPress={() => this.notifyData()} style={{ width: '100%', }}>
							<Text onPress={() => this.notifyData()} style={styles.modalText}>
								Turn {this.state.notifications} Notifications
				  </Text>
						</TouchableOpacity>
						<View style={styles.horizontalSeparator} />


						<View onPress={() => this.share_option()} >
							<Text onPress={() => this.share_option()}
								style={styles.modalText} >
								Share
				  </Text>
						</View>

						<View style={styles.horizontalSeparator} />

						<TouchableOpacity onPress={() => this.writeToClipboard()} style={{ width: '100%', }}>
							<Text onPress={() => this.writeToClipboard()} style={[styles.modalText,]}>
								Copy Link
				  </Text></TouchableOpacity>
						<View style={styles.horizontalSeparator} />

						<View >

							<TouchableOpacity onPress={() => this.unfollow()} style={{ width: '100%', }}>
								<Text onPress={() => this.unfollow()} style={[styles.modalText, { color: '#708fd5' }]}>
									Unfollow account
				  </Text></TouchableOpacity>
						</View>


						<View style={styles.horizontalSeparator} />
						<TouchableOpacity onPress={() => this.setState({ visibleModal: null, isModalVisible1: true })} style={{ width: '100%', }}>
							<Text onPress={() => this.setState({ visibleModal: null, isModalVisible1: true })} style={[styles.modalText, { color: '#e45d1b' }]}>
								Report post
				  </Text>
						</TouchableOpacity>
						<View style={styles.horizontalSeparator} />
					</View>
				</Modal>

				<Modal isVisible={this.state.visibleModal === 3}
					onBackdropPress={() =>
						this.setState({ visibleModal: null })}
					onBackButtonPress={() => this.setState({ visibleModal: null })} >
					<View style={styles.modalContent} >
						<StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

						<View style={{ marginTop: 15 }}>
							<TouchableOpacity onPress={() => this.editPost()}>
								<Text style={styles.modalText}>
									Edit
								</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.horizontalSeparator} />

						<View style={{ marginTop: 7 }}>
							<Text onPress={() => this.sendTo()} style={styles.modalText}>
								Send
							 </Text></View>
						<View style={styles.horizontalSeparator} />

						<View >
							<TouchableOpacity onPress={() => this.share_option()}>
								<Text style={styles.modalText}>
									Share
							   </Text>
							</TouchableOpacity>
						</View>

						<View style={styles.horizontalSeparator} />

						<View >
							<TouchableOpacity onPress={() => this.writeToClipboard()}>
								<Text style={styles.modalText}>
									Copy Link
										   </Text>
							</TouchableOpacity>
						</View>
						<View style={styles.horizontalSeparator} />


						<View style={{ marginBottom: 15 }}>
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
								height: 30, marginTop: 8, marginBottom: 8, borderBottomColor: '#a7a7a7', borderBottomWidth: 0.5
							}}>
								<View>
									<Text style={{ fontSize: 16, color: '#383838', marginLeft: 25 }}>
										Send To
				   </Text>
								</View>
								<View>
									<TouchableOpacity onPress={() => this.setState({ isSelectSendTo: false })}>
										<Image style={{ width: 22, height: 22, marginRight: 30, }}
											source={require('../../Assets/Images/downarrow.png')} />
									</TouchableOpacity>
								</View>
							</View>

							<View style={{ marginTop: 8, marginBottom: 8 }}>
								<View style={stylesL.searchBar}>
									<Image source={require('../../Assets/Images/Search.png')} 
									resizeMode={'center'}
										style={{ width: wp(5), height: hp(3), marginLeft: 10, top: 11, position: 'absolute' }} />
									<TextInput
										placeholder='Search...'
										placeholderTextColor='#000'
										style={stylesL.textInput}
										autoCorrect={false}
//  keyboardType="visible-password"
										//onChangeText={text => this.SearchFilterFunction1(text)}
										selectionColor='red'
										style={stylesL.textInput} />
								</View>
							</View>
							{/* <ScrollView contentContainerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}> */}

							<View style={{ flex: 1 }}>
								{/* {this.sendToLoader()} */}
								<FlatList
									data={this.state.followeeList}
									// ItemSeparatorComponent={seperator()}
									keyboardShouldPersistTaps="always"
									onScroll={() => Keyboard.dismiss()}
									renderItem={({ item, index }) => (

										<View style={{ flexDirection: 'row', height: 70, width: wp('100%'), justifyContent: 'flex-start' }}>
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
												<TouchableOpacity disabled={item.buttonFlag == 'sent' || item.buttonFlag == 'waiting'}
													onPress={() => this.sendToUser(item)}>
													<View style={{
														backgroundColor: '#ff1c49', paddingTop: 8, paddingBottom: 8,
														paddingLeft: 12, paddingRight: 12, borderRadius: 10,
													}}>
														{item.buttonFlag == 'send' ?
															<Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
																send
                             								</Text>
															:
															item.buttonFlag == 'waiting' ?

																<Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
																	sending...
                            									</Text>
																:

																<Image source={require('../../Assets/Images/check_white.png')}
																	resizeMode={'contain'}
																	style={{ width: 20, height: 20, alignSelf: 'center' }}
																/>
														}
													</View>
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
                                        <View style={Common_Style.parentViewReport} >
                                            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                                            <Image style={Common_Style.iconReport} source={require('../../Assets/Images/new/Expression.png')}></Image>
                                            <Text style={Common_Style.headerReport} >
                                                Inappropriate Content!
</Text>
                                            <Text style={Common_Style.subHeaderReport} >
                                                We are sorry for the inconvenience!
</Text>
                                            <View style={Common_Style.contentViewReport}>
                                                <Text style={Common_Style.contentReport} >
                                                    We continuously put effort to provide a safe and happy environment at been. We would like you to please explain the problem in detail so it would help us in providing the most effective service.
</Text>
                                            </View>
                                            <TextInput
                                                label=" Type Here..."
                                                placeholderStyle={Common_Style.PstyleReport}
                                                mode="outlined" gnb
												multiline={true}
												autoCorrect={false}
//  keyboardType="visible-password"
                                                maxLength={500}
                                                // flexWrap: 'wrap'
                                                onChangeText={(text) => { this.setState({ permission_Value: text }) }}
                                                value={this.state.permission_Value}
                                                style={Common_Style.TstyleReport}
                                                selectionColor={'#f0275d'} theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000',  paddingLeft: 5 } }}
												/>



                                            <View
                                                style={Common_Style.buttonViewReport}
                                            >

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
          <View style={Common_Style.TparentView} >
            <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
            <Text style={Common_Style.TheaderInModalTwo} >
              Thank you for your voice!
</Text>

            <View style={Common_Style.TcontentViewInModalTwo}>
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
              <TouchableOpacity onPress={() => this.setState({ isModalVisible2: false })} activeOpacity={1.5} >
                <Text onPress={() => this.setState({ isModalVisible2: false })} style={Common_Style.TokayButtonText}>
                  Okay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
		<TransBack props = {this.props.navigation} />
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



