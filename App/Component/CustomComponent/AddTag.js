import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, StatusBar } from 'react-native';
import Common_Style from "../../Assets/Styles/Common_Style"
import { Container, Content, Toast, Footer, FooterTab } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
let Common_Api = require('../../Assets/Json/Common.json')
import { Common_Color } from '../../Assets/Colors'
import common_styles from "../../Assets/Styles/Common_Style";
import { deviceWidth as dw, deviceHeight as dh } from '../_utils/CommonUtils';
import UserView from '../commoncomponent/UserView';
import { toastMsg1 } from '../../Assets/Script/Helper';

export default class AddTag extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            partnerData: [],
            dataSource: '',
            arrayName: [],
            arrayNameid: [],
            albumId: null,
            UserId: null,
            screenName: '',
            UserName: null,
            tags: [],
        };
        this.arrayholder = [];
    }
    // componentWillMount() {
    //     this.getTagPeople();
    // }

    // UNSAFE_componentWillMount = () => {
    //     // debugger;
       
    //             const Comments = this.props.route.params.data;
    //             console.log('the commnets', Comments);
    //             if (Comments != undefined) {
    //                 this.setState({
    //                     screenName: Comments.screeName,
    //                     tags: Comments.tags != undefined ? Comments.tags : []
    //                 })
    //             }
    //             this.getTagPeople(Comments.tags);
    //         }
        

    componentDidMount = () => {
        // debugger;
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                const Comments = this.props.route.params.data;
                console.log('the commnets', Comments);
                if (Comments != undefined) {
                    this.setState({
                        screenName: Comments.screeName,
                        tags: Comments.tags != undefined ? Comments.tags : []
                    })
                }
                this.getTagPeople(Comments.tags);
            }
        );
    };

    seperator() {
        <View style={{ width: "50%", margin: '5%' }}></View>
    }
    _selectedListForDel = (item) => {
// alert('as')
        const { partnerData } = this.state;
        // console.log('the new data',item);
        item.selected = !item.selected;
        const index = partnerData.findIndex(d => d._id == item._id);
        partnerData[index] = item;
        this.setState({ partnerData });

    }

    getTagPeople = async (tags = []) => {
        debugger
        // const {tags} = this.state;
        console.log('the tagssss', tags);
        var data = { userid: await AsyncStorage.getItem('userId') };
        // console.log('userdd', data);
        const url = serviceUrl.been_url + "/GetTags";
        return fetch(url, { method: "POST", headers: serviceUrl.headers, body: JSON.stringify(data) })
            .then(response => response.json())
            .then(res => {
                console.log('the tag', res)
                if (res.status == "True") {

                    const actualResult = res.result.length > 0 && res.result.map(v => {
                        v.selected = false;
                        tags?.length > 0 && tags.map(m => {
                            //    console.log('tha tag map',m)
                            if (v._id == m) {
                                // console.log('tha tag map cond',m)
                                v.selected = true;
                            }
                        })
                        return v;
                    });

                    const selected = actualResult && actualResult.filter(d => d.selected);
                    const unselected = actualResult && actualResult.filter(d => !d.selected);
                    const manipulatedData = selected.concat(unselected)
                      console.log('the manipulated tags',manipulatedData);

                    this.setState({
                        partnerData: manipulatedData ? manipulatedData : [],
                        dataSource: res.result
                    });
                    //   console.log('asdasd',actualResult);
                    this.arrayholder = actualResult ? actualResult : [];
                }
                else {
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                toastMsg1('danger',error.message || 'something went wrong')
                // reject(new Error(`Unable to retrieve events.\n${error.message}`));
            });
    }


    SearchFilterFunction(text) {
        // debugger;
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.UserName ? item.UserName.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        // console.log(' the new dara',newData);
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            partnerData: newData,
            text: text
        });
    }

    cancel() {
        const { partnerData } = this.state;
        const tagidslen = partnerData.filter(item => item.selected);
        const tagIds = partnerData.filter(item => item.selected)
            .map(({ _id }) => _id)
        var data = {
            image: 1,
            tagCount: tagidslen.length,
            tagId: tagIds,
        }

        console.log('sdfs', data);
        this.state.screenName == "post" ?
            this.props.navigation.navigate('NewsfeedUpload', { data: data })
            :
            this.state.screenName == "video" ?
                this.props.navigation.goBack()
                :
                this.props.navigation.navigate('EditPost', { data: data })

    }

    getTags = () => {
        debugger
        const { UserId, partnerData } = this.state;
        const tagidslen = partnerData.filter(item => item.selected);
        
        if (tagidslen.length == 0) {
            {
                this.state.screenName == "post" ?
                this.props.navigation.navigate('NewsfeedUpload', { data: { tagCount: 0 } })
                :
                this.state.screenName == "video" ?
                    this.props.navigation.navigate('Vlog', { data: { tagCount: 0 } })
                    :
                    this.props.navigation.navigate('EditPost', { data: { tagCount: 0 } })
            }
            return false;
        }
        const tagIds = partnerData.filter(item => item.selected)
            .map(({ _id }) => _id)
        var data = {
            tagId: tagIds,
            tagCount: tagidslen.length > 0 ? tagidslen.length : 0
        }
        // console.log('the tasg',data);
        // console.log('the darta tag',data);
        this.state.screenName == "post" ?
            this.props.navigation.navigate('NewsfeedUpload', { data: data, image: 4 })
            :
            this.state.screenName == "video" ?
                this.props.navigation.navigate('Vlog', { data: data })
                :
                this.props.navigation.navigate('EditPost', { datas: data })

    }

    getRenderView(item) {
        return <View style={[Common_Style.StatusView, { width: '100%' }]}>
            {item.selected === true ?
                <Image style={{ width: 22, height: 22, marginTop:10 }}
                    source={require('../../Assets/Images/check.png')} />
                : null}
        </View>
    }


    render() {
        return (
            <View style={{ flex: 1,backgroundColor:'#fff', marginTop: Platform.OS==='ios' ? 50:StatusBar.currentHeight }}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />


                <View style={[Common_Style.searchView, { flexDirection: 'row', margin: 5 }]}>
                    <TextInput value={this.state.text}
                        onChangeText={text => this.SearchFilterFunction(text)}
                        style={[Common_Style.searchTextInput, { width: wp(84) }]}
                        autoCorrect={false}
                        //
                        placeholder={'Search'}
                        placeholderTextColor={'#6c6c6c'}>
                    </TextInput>
                    <Text onPress={() => this.cancel()} style={{ fontFamily: Common_Color.fontBold, marginLeft: 5 }}>Cancel</Text>
                </View>

                {/* <Content> */}
                <View style={{ height: dh * 0.790, }}>
                    <FlatList
                        data={this.state.partnerData}
                        ItemSeparatorComponent={this.seperator()}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                            <View key={`id${index}`}>
                                <TouchableOpacity onPress={() => this._selectedListForDel(item)}>
                                    <UserView 
                                        userName={item.UserName} 
                                        surName={item.name} 
                                        isVerifyTick={item.VerificationRequest} 
                                        profilePic={item.ProfilePic} 
                                        rightView={this.getRenderView(item)} 
                                        onPress = {()=>this._selectedListForDel(item)}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                    />
                </View>

                <View style={[common_styles.Common_button, { width: wp('97.5%'), marginBottom: 10, margin: 5 }]}>
                    <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}>
                        <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                            onPress={() => this.getTags()}>
                            <Text style={common_styles.Common_btn_txt}>Done</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                {/* </FooterTab>
                </Footer> */}

            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        loginButton: { backgroundColor: "#87cefa", alignItems: "center", height: hp("6%"), width: wp("100%"), color: "blue", borderRadius: 8, justifyContent: "center", textAlign: "center", shadowColor: '#000000', shadowOffset: { width: 3, height: 3 }, shadowRadius: 5, shadowOpacity: 1.0, },
        LoginButtontxt: {
            color: "#fff", justifyContent: "center", textAlign: "center", fontSize: 16, fontFamily: Common_Color.fontBold
        },
    },
)
