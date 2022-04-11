import React, { Component } from 'react'
import {
    Text, StatusBar, StyleSheet, Image, FlatList, Animated,
    LayoutAnimation, UIManager, Platform, TouchableWithoutFeedback, ActivityIndicator,
    View, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
import { TouchableOpacity } from 'react-native-gesture-handler';
import savedpost from './savedpost';
import { Toolbar, } from '../commoncomponent'
const { been_url, method, headers, been_image_urlExplore } = serviceUrl;
import LinearGradient from "react-native-linear-gradient";
import {toastMsg1} from '../../Assets/Script/Helper'


export default class savedfolder extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }
        this.state = {
            storiesData: [],
            respectiveLocation: '',
            viewLayoutHeight: 35,
            updatedHeight: 0,
            expand: false,
            loading: false,
            loadingApi: false,
            savedPostData: [],
            folderName: ''
        }
    }

    componentDidMount() {
        const getData = this.props.route.params.data
        console.log('asdfff', getData);
        if (getData !== undefined) {
            this.setState({
                savedPostData: getData.savedPostData,
                folderId: getData._id,
                getData : getData,
                wholeGetData : getData.getData
            })
        }
    }

    animated_sliding_view = (selectedCount) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (selectedCount > 0) {
            this.setState({
                updatedHeight: this.state.viewLayoutHeight,
                expand: true,
            });
        }
        else {
            this.setState({
                updatedHeight: 0,
                expand: false,
            });
        }
    }

    selectItem(data) {

        data.isSelect = !data.isSelect;
        // data.selectedClass = data.isSelect ? styles.selected : styles.list;
        const index = this.state.savedPostData.findIndex(
            item => data.PostId === item.PostId
        );
        this.state.savedPostData[index] = data;
        this.setState({
            savedPostData: this.state.savedPostData,
        });

        const itemNumber = this.state.savedPostData.filter(item => item.isSelect).length;
        this.animated_sliding_view(itemNumber)

    };

    async addpost() {
        const { folderId,getData,wholeGetData } = this.state;
        // debugger;
        let selectedData = this.state.savedPostData.filter(item => item.isSelect)
        let permittedValues = selectedData.map(value => value.PostId);
        var userid = await AsyncStorage.getItem('userId');

        let data = {
            Userid: userid,
            Feed: permittedValues,
            Folderid: folderId
        }
        // console.log('permitted values',permittedValues,'--',data);
        const url = serviceUrl.been_url2 + '/FolderAddedPosts'
        this.setState({ loadingApi: true })
        const savedData = getData.savedPostData;
        const getSelectedData = savedData && savedData.filter(item => item.isSelect);
        const feedDatas = wholeGetData.FeedId;
        const isSameResultExists =  feedDatas.filter(({ PostId: fId }) => getSelectedData.some(({ PostId: sId }) => fId === sId));
        // console.log('the logs',isSameResultExists);
        if(isSameResultExists && isSameResultExists.length > 0){
            toastMsg1('','You have already saved the post to one of these.Try with new posts.',3000);
            this.setState({ loadingApi : false })
            return false;
        }
        const addFeedData = [...feedDatas,...getSelectedData];
        // isSameResultExists.length == 0 ? [...feedDatas,...getSelectedData] : feedDatas;
        wholeGetData.FeedId = addFeedData;
        // console.log('the whole data ',wholeGetData);
        return fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('asdas', responseJson);
                if (responseJson.status == "True") {
                    this.setState({ loadingApi: false })

                    // this.props.navigation.navigate('savedpostlist',{ data: wholeGetData });
                    this.props.navigation.goBack();
                }
                else {
                    this.setState({ loadingApi: false })
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch(err => {
                this.setState({ loadingApi: false })
                console.log("Error:Line 175,Getstories", err)
                //toastMsg('danger', 'Sorry..Something network error.please try again once.')
            })
    }

    renderRightImg() {
        return <View >
            <Image resizeMode={'stretch'} style={{ width: 20, height: 24, }} />
        </View>
    }


    render() {
        const itemNumber = this.state.savedPostData.filter(item => item.isSelect).length;
        if (this.state.loading) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="pink" />
                </View>
            );
        }
        return (
            <View style={{ flex:1,backgroundColor: '#fff', marginTop: 0 }}>
                <Toolbar {...this.props} centerTitle="All Saved Post" rightImgView={this.renderRightImg()} />

                <View style={{
                    height: this.state.updatedHeight, overflow: 'hidden',
                    backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1,
                    flexDirection: 'row',
                }}>
                    <View style={{ justifyContent: 'center', width: '25%', height: this.state.updatedHeight, }}>
                        <Text style={{ textAlign: 'center', fontSize: 14, }}
                        // onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}
                        >
                            {`Selected ${itemNumber} `}
                        </Text>
                    </View>
                    <TouchableWithoutFeedback activeOpacity={0.5} onPress={() => this.addpost()}>
                        <View style={{
                            alignSelf: 'center', right: 0, position: 'absolute',
                            height: '100%', padding: 8, paddingRight: 10, justifyContent: 'center',
                        }}>
                            {!this.state.loadingApi ?
                                <Image source={require('../../Assets/Images/check.png')}
                                 resizeMode={'center'}
                                    style={{ width: 19, height: 19, alignSelf: 'center', }}
                                />
                                :

                                <View style={styles.loader}>
                                    <ActivityIndicator size="large" color="pink" />
                                </View>
                            }
                        </View>

                    </TouchableWithoutFeedback>
                </View>
                <FlatList
                    data={this.state.savedPostData}
                    extraData={this.state}
                    renderItem={({ item, index }) => (
                        <View key={`id${index}`}>
                            <View style={{ width: wp('33.3%'), height: hp('20%'), backgroundColor: '#c1c1c1', }}>
                                <TouchableOpacity
                                    onPress={() => this.selectItem(item)}>

                                    <ImageBackground source={{ uri: serviceUrl.newsFeddStoriesUrl + item.Image }} style={{
                                        width: wp('33.3%'), height: hp('20%'),
                                        opacity: item.isSelect ? 0.4 : 1
                                    }}
                                        resizeMode={'cover'} >
                                        <LinearGradient
                                            style={{ height: 70 }}
                                            colors={["#0f0f0f94", "#0f0f0f00"]}
                                        >
                                            <Text style={{
                                                justifyContent: "center", textAlign: "center", color: "#fff", textShadowColor: '#000',
                                                textShadowOffset: { width: 1, height: 1 },
                                                textShadowRadius: 10
                                            }}>{item.UserName && item.UserName.length>10?item.UserName.substring(0, 10) + ".....":item.UserName}</Text>
                                        </LinearGradient>
                                    </ImageBackground>

                                </TouchableOpacity>

                            </View>
                            {/* #2196F3-blue */}
                            {item.isSelect ?
                                <View style={styles.selectedIconView}>
                                    <Image source={require('../../Assets/Images/check_white.png')}
                                        style={{ width: 12, height: 12, alignSelf: 'center', }}
                                  resizeMode={'center'}
                                    />
                                </View>
                                : null
                            }
                        </View>

                    )}
                    keyExtractor={item => item._id}
                    horizontal={false}
                    numColumns={3}
                />



            </View>
        )
    }
}

const styles = {
    images: { width: wp('33.3%'), height: hp('20%'), },
    selectedIconView: {
        backgroundColor: '#2196F3',
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        position: 'absolute',
        margin: 5, right: 0,
        borderWidth: 1.5,
        borderColor: "#fff",
        justifyContent: 'center',
        overflow: 'hidden'
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
}