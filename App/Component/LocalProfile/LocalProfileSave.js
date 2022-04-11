import React, { Component } from 'react';
import { View, Text, Image, FlatList,  TouchableOpacity, ScrollView, Platform, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileChat from './styles/ProfileChat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Menu, Divider } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import { toastMsg } from '../../Assets/Script/Helper';
import serviceUrl from '../../Assets/Script/Service';
import { Toolbar } from '../commoncomponent'
const imagepath = '../../Assets/Images/localProfile/';
const imagePath1 = '../../Assets/Images/'

import common_styles from "../../Assets/Styles/Common_Style"
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Modal from 'react-native-modalbox';
import { deviceWidth as dw, deviceHeight as dh, invalidText } from '../_utils/CommonUtils'

const currencyData = [
    { name: "rupee", value: '₹' },
    { name: "dollar", value: '$' },
    { name: "euro", value: '€' },
]

export default class LocalProfileSave extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            masterData: '',
            _Id: '',
            profilePic: '',
            userName: '',
            name: '',
            tagLine: '',
            description: '',
            personaltour: '',
            TourAdvice: '',
            photo: '',
            photo1: '',
            fileName: '',
            fileType: '',
            selectedCurrency: '',
        }
    }
    UNSAFE_componentWillMount() {
        this.getApi();
    }
    componentDidMount() {
        // debugger;
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.getApi();
            });
    }
    async getApi() {
        // debugger;
        var data = {
            //  Userid: "5e219b53bd333366c1be32ec"
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + '/GetLocalprofile';
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('album responses', responseJson);
                if (responseJson.status == 'True') {
                    this.setState({
                        masterData: responseJson.result,
                        _Id: responseJson.result[0]._id,
                        profilePic: responseJson.result[0].LocalProfilePic,
                        userName: responseJson.result[0].UserName,
                        name: responseJson.result[0].name,
                        tagLine: responseJson.result[0].tagline,
                        description: responseJson.result[0].Description,
                        personaltour: responseJson.result[0].PersonalTour,
                        TourAdvice: responseJson.result[0].TourAdvice,
                        selectedCurrency: responseJson.result[0].currenry
                    })
                    console.log(this.state.masterData)
                    console.log(this.state._Id)
                }
                else {
                    console.log('contain false')
                }
            })
            .catch((error) => {
                //toastMsg('danger',error+'please check your internet and try again! ')
            });
    };


    save() {
        const { tagLine, description, personaltour, TourAdvice } = this.state
        if (tagLine === '') {
            toastMsg('success', 'Please fill the all fields')
            //alert('Please fill the all fields')
        }
        else if (description === '') {
            toastMsg('success', 'Please fill the all fields')
            // alert('Please fill the all fields')
        }
        else if (personaltour === '') {
            toastMsg('success', 'Please fill the all fields')
            // alert('Please fill the all fields')
        }
        else if (TourAdvice === '') {
            toastMsg('success', 'Please fill the all fields')
            //alert('Please fill the all fields')
        }

        else {
            this.saveApi();
        }
    }

    saveApi = async () => {
        const userid = await AsyncStorage.getItem('userId')

        var data = {
            //    Userid: "5df489bd1bc2097d72dd07c2",
            Userid: userid,
            _id: this.state._Id,
            tagline: this.state.tagLine,
            description: this.state.description,
            Personaltour: this.state.personaltour,
            TourAdvice: this.state.TourAdvice,
            currency: this.state.selectedCurrency
        };
        console.log("Update local",data)
        const data2 = new FormData();
        data2.append("_id", this.state._Id);
        data2.append("Userid", userid);
        data2.append("tagline", this.state.tagLine);
        data2.append("description", this.state.description);
        data2.append("Personaltour", this.state.personaltour);
        data2.append("TourAdvice", this.state.TourAdvice);
        data2.append("currency", this.state.selectedCurrency);
        data2.append("LocalProfilePic",
            {
                uri: "file://" + this.state.photo1,
                name: this.state.fileName,
                type: this.state.fileType
            }
        );


        console.log(this.state.photo1)
        console.log(data2)

        if (this.state.fileName != '') {
            fetch(serviceUrl.been_url + '/updateLocalprofile', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
                },
                body: data2,
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if (responseJson.status == "True") {
                        this.setState({
                            tagLine: '',
                            description: '',
                            personaltour: '',
                            TourAdvice: '',
                        })
                        //toastMsg('success', responseJson.message)
                        this.props.navigation.navigate('LocalProfileFullView')
                    } else {
                        //toastMsg('danger', responseJson.message)
                        this.setState({ isLoader: false });
                    }
                }).catch(function (error) {
                    console.log("Line nuber 176", error);
                    //toastMsg('danger','please check your internet an Try again')
                });
        }
        else {
            fetch(serviceUrl.been_url + '/updatelocal', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
                },
                body: JSON.stringify(data),
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if (responseJson.status == "True") {
                        this.setState({
                            tagLine: '',
                            description: '',
                            personaltour: '',
                            TourAdvice: '',
                        })
                        //toastMsg('success', responseJson.message)
                        this.props.navigation.navigate('LocalProfileFullView')
                    } else {
                        //toastMsg('danger', responseJson.message)
                        this.setState({ isLoader: false });
                    }
                }).catch(function (error) {
                    console.log("Line nuber 176", error);
                    //toastMsg('danger','please check your internet an Try again')
                });
        }
    }

    handleChoosePhoto1 = () => {
        //// debugger;
        const options = { noData: true };
        ImagePicker.launchImageLibrary(options, response => {
            console.log('response', response);
            if (response.uri) {
                this.setState({
                    photo: response.uri,
                    photo1: response.path,
                    fileName: response.fileName,
                    fileType: response.type,
                });
            }
        })
    }

    currencyList = () => {
        return currencyData.constructor === Array && currencyData.length > 0 &&
            currencyData.map((k, i) => {
                return (
                    <Picker.Item key={i} label={k.title} value={k.title} />
                )
            });
    }

    setSelectedValue = (value) => {
        this.refs.listmodal.close()
        console.log("selected value", value)
        this.setState({
            selectedCurrency: value
        })
        console.log('selected currency is', this.state.selectedCurrency)
    }

    FlatListItemSeparator = () => {
        return (
            <View style={{ height: .8, width: "100%", backgroundColor: "#ddd", }}
            />
        );
    }

    onLayoutGet = e => {
        console.log('the layout', e);
    }



    render() {
        return (
            <View style={{ flex: 1, marginTop: 0,backgroundColor:'#fff' }}>

                <Toolbar {...this.props} />

                <Content style={{ height: '100%' }}>
                    <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                    <View>
                        <View style={{ alignItems: 'center', marginTop: '8%' }}>

                            {
                                this.state.photo === '' && this.state.fileName != '' ?
                                    <Image source={require(imagePath1 + 'profile.png')}
                                        style={[ProfileChat.profilePic,{backgroundColor:'grey'}]} resizeMode={'cover'} />
                                    :
                                    this.state.fileName === '' && this.state.photo === '' ? <Image source={{ uri: serviceUrl.profilePic + this.state.profilePic }}
                                        style={[ProfileChat.profilePic,{backgroundColor:'#c1c1c1'}]} resizeMode={'cover'} />
                                        :
                                        <Image source={{ uri: this.state.photo }}
                                            style={ProfileChat.profilePic} resizeMode={'cover'} />
                            }

                            <View style={{ position: 'absolute', top: wp(4), right: hp(14) }}>
                                <TouchableOpacity onPress={() => { this.handleChoosePhoto1() }}>
                                    <Image source={require(imagepath + 'add.png')}
                                        style={{ width: wp(5), height: hp(3) }} resizeMode={'contain'} /></TouchableOpacity>
                            </View>
                            <Text style={[ProfileChat.userName, { fontSize: 20, fontFamily: Common_Color.fontBold }]}>{this.state.userName
                            }</Text>
                            <Text style={[ProfileChat.userName, { fontSize: 16, fontFamily: Common_Color.fontBold }]}>{this.state.name && this.state.name === undefined || this.state.name && this.state.name === null || this.state.name && this.state.name === "" || this.state.name && this.state.name === "null" || this.state.name && this.state.name === "undefined" ? "" : this.state.name}</Text>

                        </View>
                        <View style={{ margin: '5%' }}>
                            <View>
                                <TextInput
                                    label="  Tag line"
                                    placeholderStyle={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}
                                    mode="outlined"
                                    maxLength={60}
                                    autoCorrect={false}
                                    
                                    onChangeText={(text) => { this.setState({ tagLine: text }) }}
                                    value={this.state.tagLine}
                                    style={[common_styles.textInputSignUp, { width: '100%', fontSize: profilename.FontSize, fontFamily: profilename.Font }]}
                                    // style={{backgroundColor: '#fff', width: '100%', height: 45, alignSelf: 'center', fontWeight: 'normal',marginTop:0,marginBottom:0}}
                                    selectionColor={'#f0275d'}
                                    theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />

                            </View>


                            <TextInput
                                label=" Description"
                                placeholderStyle={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}
                                mode="outlined" gnb
                                multiline={true}
                                autoCorrect={false}
                                
                                maxLength={500}
                                value={this.state.description}
                                onChangeText={(text) => { this.setState({ description: text }) }}
                                style={{ backgroundColor: '#fff', fontSize: Description.FontSize, fontFamily: Description.Font }}
                                selectionColor={'#f0275d'}
                                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />


                            <View style={{ marginTop: '3%' }}>
                                {/* <Text style={{ fontSize: 16, marginLeft: '15%' }}>Personal Tour</Text> */}
                                <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                                    <View style={{ width: '13%', }}>
                                        <TouchableOpacity onPress={() => this.refs.listmodal.open()}>
                                            <View style={{ flexDirection: 'row', height: 37, alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={{ textAlign: 'left', fontSize: 14, fontFamily: Common_Color.fontMedium, }}>
                                                    {!invalidText(this.state.selectedCurrency) ? this.state.selectedCurrency : `₹`}
                                                </Text>
                                                <Image source={require('../../Assets/Images/pickerIcon.png')}
                                            //   resizeMode={'center'}
                                                    style={{ width: 10, height: 10, marginLeft: 5, marginTop: 0 }}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        label="  Personal Tour"
                                        placeholderStyle={{ fontSize: Common_Color.countFontSize, fontFamily: Common_Color.fontMedium, color: 'red' }}
                                        mode="outlined"
                                        maxLength={6}
                                        value={this.state.personaltour}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => { this.setState({ personaltour: text }) }}
                                        style={{ marginLeft: -9, width: '88%', height: 37, alignSelf: 'center', fontWeight: 'normal', marginTop: -5, marginBottom: 0 }}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />


                                </View>
                            </View>
                            <View style={{ marginTop: '3%' }}>
                                {/* <Text style={{ fontSize: 16, marginLeft: '15%' }}>Tour Advice</Text> */}
                                <View style={{ flexDirection: 'row',marginLeft:4 }}>

                                    <View style={{ width: '13%', }}>
                                        <TouchableOpacity >
                                            <View style={{ flexDirection: 'row', height: 37, alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={{ textAlign: 'left', fontSize: 14, fontFamily: Common_Color.fontMedium, }}>
                                             
                                                {!invalidText(this.state.selectedCurrency) ? this.state.selectedCurrency : `₹`} 
                                                </Text>
                                                <Image source={require('../../Assets/Images/pickerIcon.png')}
                                            //  resizeMode={'center'}
                                                    style={{ width: 10, height: 10, marginLeft: 5, marginTop:0 }}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        label="  Tour Advice"
                                        placeholderStyle={{ fontSize: Common_Color.countFontSize, fontFamily: Common_Color.fontMedium, color: 'red' }}
                                        mode="outlined"
                                        maxLength={6}
                                        value={this.state.TourAdvice}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => { this.setState({ TourAdvice: text }) }}
                                        style={{ marginLeft: -9, backgroundColor: '#fff', width: '88%', height: 37, alignSelf: 'center', fontWeight: 'normal', marginTop: -5, marginBottom: 0 }}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />
                                </View>


                                <View style={common_styles.Common_button}>
                                    <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '97%', height: '100%', marginLeft: -5 }}>
                                        <TouchableOpacity style={{ width: '100%', height: '100%' }}
                                            onPress={() => this.save()}>
                                            <Text style={[common_styles.Common_btn_txt, { marginTop: 12, marginLeft: -15 }]}> save</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>


                            </View>
                        </View>
                    </View>


                </Content>

                <Modal style={{ width: dw * .9, height: dh * .6, backgroundColor: '#00000000' }}
                    position={"center"}
                    ref={"listmodal"}
                    entry="bottom"
                    useNativeDriver={true}
                    backButtonClose={true}
                    animationDuration={100}
                    swipeToClose={true}
                >
                    <View style={{width: dw * .9, height: dh * .6, backgroundColor: '#FFF', justifyContent: "center", overflow: 'hidden',alignItems: "center", borderRadius: 20}}>
                        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
                        <FlatList
                            data={currencyData}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => this.setSelectedValue(item.value)}>
                                    <View key={`id${index}`} style={{ width: dw * .9, justifyContent: 'center', }}
                                        onLayout={e => this.onLayoutGet(e)}
                                    >

                                        <Text style={{ textAlign: 'center', padding: 12, fontSize: 16, fontFamily: Common_Color.fontMedium }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </Modal>
            </View>
        )
    }
}


