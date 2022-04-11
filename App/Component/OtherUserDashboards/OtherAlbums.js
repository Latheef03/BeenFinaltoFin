import React, { Component } from 'react';
import {
    Text, StyleSheet, Image, FitImage, ImageBackground, StatusBar,
    View, ToastAndroid,  ActivityIndicator, TouchableOpacity, ScrollView, FlatList, TextInput, Share
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Footer, FooterTab, Content } from 'native-base'
import serviceUrl from '../../Assets/Script/Service';
import LinearGradient from "react-native-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import styles from '../../styles/FooterStyle'
import Common_Style from '../../Assets/Styles/Common_Style'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { Toolbar, FooterTabBar1 } from '../commoncomponent'
import Spinner from '../../Assets/Script/Loader';
import styles1 from '../../styles/NewfeedImagePost';
import { ExploreLoader } from '../commoncomponent/AnimatedLoader';
const shareOptions = {
    title: "Title",
    message: 'Post Shared',
    url: "http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg",
    subject: "Subject"
};

export default class OtherAlbums extends Component {
    // _isNoAlbums = false;
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
            convertedImages1: '',
            isModalVisible: false,
            followers: 0,
            search: '',
            albumSingleImg: null,
            arrayName: [],
            arrayNameid: [],
            albumName: null,
            albumId: null,
            _isNoAlbums: false,
            albumData: [], permission_Value: "",
            no_record_found: false,
            isLoading: false, otherid: ''
        }
    }

    async componentDidMount() {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                const Comments = this.props.route.params?.data
                if (Comments != undefined || null) {
                    this.setState({
                        otherid: Comments.otherid == undefined ? id1 : Comments.otherid,
                        userName: Comments.userName
                    });
                }
                this.getAlbum();
                // navigation.state.params = {loader:false};

                console.log('the comments', Comments);
            }
        );
    };

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
        this.getAlbum();
    }


    permission_Value = text => {
        this.setState({ permission_Value: text });
    };
    subAlbum(item) {
        // console.log('itemss are',item)
        this.setState({
            isModalVisible: false,
        })
        this.props.navigation.navigate('OtherAddSubAlbum', { imgData: item, });
    }
    _arrangeAlbumsSubalbums = (responseJson) => {
        responseJson.Albums = responseJson.Albums.length > 0 && responseJson.Albums.map(m => {
            m.selected = false;
            m.subAlbums = [];
            m.isSubAlbum = 'noSubAlbums';
            m.albumimg = m.albumimg.filter(v => v.Image !== null)
            responseJson.subAlbums.length > 0 && responseJson.subAlbums.map(s => {
                if (m.albumId == s.subAlbumOwner) {
                    m.subAlbums.push(s);
                    m.isSubAlbum = 'Yup';
                }
            })
            return m;
        });
        // .filter(v => v.albumimg).map(d => d.Image!==null)

        console.log('total album and sub album', responseJson.Albums)
        if (!responseJson.Albums) {
            this.setState({
                _isNoAlbums: false,
                getAlbumData: []
            });
            return false;
        } else {
            this.setState({
                getAlbumData: responseJson.Albums,
                _isNoAlbums: true
            })
        }


    };
    getAlbum = async () => {
        // debugger;

        var GetOtherId = await AsyncStorage.getItem('OtherUserId');
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            followId: GetOtherId
        }

        this.setState({ isLoading: true });
        const url = serviceUrl.been_url + "/GetAlbums";
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
                    this._arrangeAlbumsSubalbums(responseJson);
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

    addAlbum() {
        this.setState({
            isModalVisible: false,
        })
        this.props.navigation.navigate('AddAlbum');
    }


    backArrow() {
        this.props.navigation.navigate('OtherUserProfile');
    }
    albums() {
        this.props.navigation.navigate('OtherAlbums')
    }



    seperator() {
        <View style={{ width: "50%", margin: '5%' }}></View>
    }
    _selectedListForDel = (newData) => {
        console.log('newdatas for album ', newData);
        var albname = newData.albumName;
        var albid = newData._id;
        newData.selected = !newData.selected;
        if (newData.selected == true) {
            this.state.arrayName.push(albname.toString());
            this.state.arrayNameid.push(albid.toString());
        }
        if (newData.selected == false) {
            let arrName = this.state.arrayName;
            arrName = arrName.filter(e => e !== albname);
            this.state.arrayName = arrName;
            let arrid = this.state.arrayNameid;
            arrid = arrid.filter(e => e !== albid);
            this.state.arrayNameid = arrid;
        }
        this.state.getAlbumData.map(data => {
            if (this.state.arrayNameid.includes(data._id)) {
                data.selected = true;
            }
            return data
        })
        this.setState({
            albumName: this.state.arrayName,
            albumId: this.state.arrayNameid
        })
    }


    share_option() {
        this.setState({ isModalVisible: false })
        Share.share(shareOptions);
    }


    _toggleModal1() {
        this.setState({
            isModalVisible: null,
            isvisibleModal: null,
            permission_Value: "",
            isModalVisible1: !this.state.isModalVisible1
        });
    }

    _toggleModal12() {
        // debugger;
        this.setState({
            isModalVisible: null,
            isvisibleModal: null,
            //  permission_Value: "",
            isModalVisible1: !this.state.isModalVisible1
        });
        this.report1();
    }
    async report1() {
        // debugger;
        if (this.state.permission_Value == "" || null || undefined) {
            toastMsg1('danger', "Please give a report")
            // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
        }
        else {
            this.setState({
                visibleModal: null,
                isvisibleModal: null
            });
            var data = {
                Userid: await AsyncStorage.getItem('userId'),
                Otheruserid: await AsyncStorage.getItem('OtherUserId'),
                Content: this.state.permission_Value
            };
            const url = serviceUrl.been_url + "/ReportOtheruser";
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
                    //toastMsg('success', responseJson.message)
                })
                .catch((error) => {
                    // console.error(error);
                    //toastMsg('danger', 'Sorry..something network error.Try again please.')
                });
        }
    }
    async unfollow() {
        this.setState({ isModalVisible: false })
        var data = {
            // Userid: "5e1993a35f1480407aa46430"
            Userid: await AsyncStorage.getItem('userId'),
            Otheruserid: await AsyncStorage.getItem('OtherUserId')
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
                //toastMsg('success', responseJson.message)
            })
            .catch((error) => {
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }

    renderRightImgdone() {
        return <View>
            {/* <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.setState({ isModalVisible: true }) }}>
                <Image source={require('../../Assets/Images/3dots.png')} resizeMode={'stretch'} style={{ width: 18, height: 18, }} />
            </TouchableOpacity> */}
        </View>
    }
    render() {
        const { isLoading, getAlbumData } = this.state;
        return (

            <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 0, }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <Toolbar {...this.props} icon={"Down1"} centerTitle="Albums          " />

                {/* <ScrollView> */}
                    {isLoading?
                            <ExploreLoader />
                               : !isLoading && getAlbumData.length == 0 ?
                        <View style={{ width: wp("100%"), flex: 1, justifyContent: "center", alignContent: "center" }}>
                            <View style={styles.hasNoMem}>
                                <Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: "15%", width: "15%", marginBottom: 20 }} />
                                <Text style={Common_Style.noDataText}> Nothing created yet!</Text>
                            </View>
                        </View>
                        :
                        <FlatList
                            style={{}}
                            ListFooterComponent={<View style={{ height: 75 }} />}
                            data={this.state.getAlbumData}
                            ItemSeparatorComponent={this.seperator()}
                            renderItem={({ item, index }) => (
                                <View key={`id${index}`} style={{ height: '100%', marginLeft: '3.5%', marginBottom: '3.3%', shadowOffset: { width: 5, height: 5 }, shadowColor: '#000', shadowOpacity: .2,shadowRadius:5, elevation: 8, }}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.subAlbum(item)}>
                                        <View style={Common_Style.ShadowCurveView}>
                                            {item.albumimg.length != 0 ?
                                                <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 10, height: 10 }, shadowColor: 'grey', shadowOpacity: 1, elevation: 8, }}>
                                                    <ImageBackground source={{ uri: serviceUrl.album_image + item.albumimg[0].Image }}
                                                        resizeMode={'cover'} borderRadius={17} style={{ width: '100%', height: '100%', }}>
                                                        <View style={{ width: wp(45), height: hp(25), backgroundColor: '#00000050' }} />
                                                        <View style={styles.centeredText}>
                                                            <Text style={{ color: '#fff', fontSize: Username.FontSize, fontFamily: Username.Font }}>{item.albumName}</Text>
                                                        </View>
                                                    </ImageBackground>
                                                </View>

                                                :
                                                <View style={{ width: wp(45), height: hp(25), overflow: 'hidden', backgroundColor: '#c1c1c1', borderRadius: 17, shadowOffset: { width: 10, height: 10 }, shadowColor: 'grey', shadowOpacity: 1, elevation: 8, }}>
                                                    <View style={{ width: wp(45), height: hp(25), backgroundColor: '#00000050' }} />
                                                    <View style={styles.centeredText}>
                                                        <Text style={{ color: '#fff', fontSize: Username.FontSize, fontFamily: Username.Font }}>{item.albumName}</Text>
                                                    </View>
                                                </View>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={false}
                            numColumns={2} />
                        }


                {/* </ScrollView> */}

                {/* Modal screen */}

                <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}
                    onBackButtonPress={() => this.setState({ isModalVisible: false })} >
                    <View style={styles1.modalContent}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View style={{ marginTop: 15, }}>
                            <TouchableOpacity onPress={() => this.addAlbum()}>
                                <Text style={[styles1.modalText, { color: '#010101' }]}>
                                    Add Albums
                                            </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles1.horizontalSeparator} />
                        <View style={{ marginTop: 7, marginBottom: 15 }}>
                            <TouchableOpacity onPress={() => { this.nextModal() }}>
                                <Text style={[styles1.modalText, { color: '#f00' }]}>
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
                        <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View style={{
                            flexDirection: 'row', width: wp('100%'),
                            justifyContent: 'space-between', height: 30, marginBottom: 10, marginTop: 10,
                            borderBottomColor: '#868686', borderBottomWidth: 0.5, backgroundColor: '#fff'
                        }}>
                            <View >
                                <Text style={{ fontSize: 16, color: '#4c4c4c', marginLeft: 20, fontFamily: Common_Color.fontBold }}>
                                    Delete
                                    </Text>
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
                            style={{ marginBottom: 60, backgroundColor: 'red' }}
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
                                                <Text style={{ marginTop: 20, fontSize: 16, marginLeft: 10, fontFamily: Common_Color.fontMedium }}>
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
                            keyExtractor={item => item.id}
                            horizontal={false}
                        />

                    </View>
                </Modal>

                <FooterTabBar1 {...this.props} tab={3} />

            </View >


        )
    }
}
