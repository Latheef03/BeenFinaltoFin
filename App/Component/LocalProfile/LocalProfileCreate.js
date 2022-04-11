import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, ImageBackground, StatusBar, Platform } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileChat from './styles/ProfileChat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Menu, Divider } from 'react-native-paper';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper'
import serviceUrl from '../../Assets/Script/Service';
import common_styles from "../../Assets/Styles/Common_Style"
const imagepath = '../../Assets/Images/localProfile/';
import { Toolbar } from '../commoncomponent'
const imagePath1 = '../../Assets/Images/'
import { initiateChat } from '../Chats/chatHelper';
import Modal from 'react-native-modalbox';
import { deviceWidth as dw, deviceHeight as dh,invalidText } from '../_utils/CommonUtils'

/* If you change this content also change for LocalProfileSave*/
const currencyData = [
    { name: "rupee", value: '₹' },
    { name: "dollar", value: '$' },
    { name: "euro", value: '€' },
]
export default class LocalProfileCreate extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            tagLine: '',
            description: '',
            personalTour: '',
            tourAdvice: '',
            photo: '',
            photo1: '',
            fileName: '',
            fileType: '',
            userName: "",
            originalName: '',
            profilePic: '',
            selectedCurrency:'₹',
            isLoading: false 
        }
    }
    // componentDidMount = () => {
    //     initiateChat()
    //     this.focusSubscription = this.props.navigation.addListener(
    //         "focus",
    //         () => {
        // const datas = route.params.datas;
        // const img_prop = route.params.imgProp;
        // console.log("Image prop is", img_prop)
        // if (img_prop != undefined && img_prop.sImg) {
        //     this.imageManipulte(img_prop);
        // }
    //             this.getuserProfile();
    //         }
    //     );
    // };

    UNSAFE_componentWillMount() {
        this.getuserProfile();

    }
    getuserProfile = async () => {
        // debugger;
        var data = {
            userId: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url1 + '/UserProfile';
        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "True") {
                    AsyncStorage.setItem('profileType', responseJson.result[0].UserDetails[0].ProfileType.toString());
                    this.setState({
                        userName: responseJson.result[0].UserDetails[0].UserName,
                        originalName: responseJson.result[0].UserDetails[0].name,
                        profilePic: responseJson.result[0].UserDetails[0].ProfilePic,
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    join() {
        const { tagLine, description, personalTour, tourAdvice } = this.state
        if (tagLine === '') {
            toastMsg1('danger', 'Please fill the all fields')
            // alert('Please fill the all fields')
        }
        else if (description === '') {
            toastMsg1('danger', 'Please fill the all fields')
            // alert('Please fill the all fields')
        }
        else if (personalTour === '') {
            toastMsg1('danger', 'Please fill the all fields')
            // alert('Please fill the all fields')
        }
        else if (tourAdvice === '') {
            toastMsg1('danger', "Please fill the all fields")
            // alert('Please fill the all fields')
        }

        else {
            this.joinApi();
        }
    }

    joinApi = async () => {
        // debugger;
        this.setState({ isLoading: true })
        var data = {
            // Userid: "5df489bd1bc2097d72dd07c2",
            Userid: await AsyncStorage.getItem('userId'),
            tagline: this.state.tagLine,
            description: this.state.description,
            Personaltour: this.state.personalTour,
            TourAdvice: this.state.tourAdvice,
            LocalProfilePic: this.state.profilePic,
            currency:this.state.selectedCurrency
        };
        console.log("data of data",data)
        const data2 = new FormData();
        data2.append("Userid", await AsyncStorage.getItem('userId'));
        data2.append("tagline", this.state.tagLine);
        data2.append("description", this.state.description);
        data2.append("Personaltour", this.state.personalTour);
        data2.append("TourAdvice", this.state.tourAdvice);
        data2.append("currency",this.state.selectedCurrency);
        data2.append("LocalProfilePic", {
            uri: "file://" + this.state.photo,
            name: this.state.fileName,
            type: this.state.fileType
        }
        );
        if (this.state.fileName != '') {
            fetch(serviceUrl.been_url + '/localprofile', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
                },
                body: data2
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if (responseJson.status == "True") {
                        this.setState({
                            tagLine: '',
                            description: '',
                            personaltour: '',
                            TourAdvice: '',
                            isLoading: false
                        });
                        AsyncStorage.setItem('localProfile', 'Yes');
                        //toastMsg('success', responseJson.message)
                        this.props.navigation.navigate('MyPager')
                    } else {
                        //toastMsg('danger', responseJson.message)
                        this.setState({ isLoader: false });
                    }
                }).catch(function (error) {
                    console.log("Line nuber 176", error);
                    //toastMsg('danger', 'please check your internet an Try again')
                });
        }
        else {
            fetch(serviceUrl.been_url + '/createLocalprofile', {
                method: 'POST',
                headers: serviceUrl.headers,
                body: JSON.stringify(data)
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if (responseJson.status == "True") {
                        this.setState({
                            tagLine: '',
                            description: '',
                            personaltour: '',
                            TourAdvice: '',
                            isLoading: false
                        })
                        AsyncStorage.setItem('localProfile', 'Yes');
                        //toastMsg('success', responseJson.message)
                        this.props.navigation.navigate('MyPager')
                    } else {
                        //toastMsg('danger', responseJson.message)
                        this.setState({ isLoader: false });
                    }
                }).catch((error) => {
                    console.log("Line nuber 176", error);
                    //toastMsg('danger', 'please check your internet an Try again')
                });
        }
    }


    imageManipulte = (prop) => {
        console.log("the imageee props", prop.e);
        this.setStateForImages(prop);
    };

    setStateForImages(prop) {
        console.log("Image set for prop", prop)
        if (prop != null && prop.e.length > 0) {
            this.setState({
                photo: prop.e[0].node.image.uri,
                //photo:prop.e[0].node.image.filename,
                fileType: prop.e[0].node.type,
                fileName: prop.e[0].node.image.filename
            })
        }
    }

    currencyList = () => {
        return currencyData.constructor === Array && currencyData.length > 0 &&
            currencyData.map((k, i) => {
                return (
                    <Picker.Item key={i} label={k.title} value={k.title} />
                )
            });
    }

    setSelectedValue = (value) =>{
        this.refs.listmodal.close()
        console.log("selected value",value)
        this.setState({
          selectedCurrency: value
        })
      console.log('selected currency is',this.state.selectedCurrency)
      }

      FlatListItemSeparator = () => {
        return (
          <View style={{height: .8,width: "100%",backgroundColor: "#ddd",}}
          />
        );
      }
    
      onLayoutGet = e =>{
        console.log('the layout',e);
      }



    getAlbum = () => {
        this.props.navigation.navigate('GalleryPicker', { screen: 'LocalProfileCreate', type: 'Photos', multiPic: false });
    }

    render() {
        return (
            <View style={{ flex: 1, marginTop: 0 }}>
                <Toolbar {...this.props} />

                <Content>
                    <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                    <View>
                        <View style={{ alignItems: 'center', marginTop: '8%' }}>
                            <View style={[ProfileChat.profilePic, { overflow: 'hidden' }]}  >
                                {this.state.fileName != '' && this.state.photo != null || "" ?
                                    <Image source={{ uri: this.state.photo }}
                                        style={ProfileChat.profilePic} resizeMode={'cover'} />
                                    :
                                    <Image source={require(imagePath1 + 'profile.png')}
                                        style={ProfileChat.profilePic} resizeMode={'cover'} />}
                            </View>


                            <View style={{ position: 'absolute', top: hp(0.7), right: wp('27%') }}>
                                <TouchableOpacity hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }} onPress={() => { this.getAlbum() }}>
                                    <Image source={require(imagepath + 'add.png')}
                                        style={{ width: wp(8), height: hp(5) }} resizeMode={'contain'} /></TouchableOpacity>
                            </View>
                            <Text style={[ProfileChat.userName, { fontSize: 20, }]}>{this.state.userName}</Text>
                            <Text style={[ProfileChat.userName, { fontSize: 16, }]}>{this.state.originalName && this.state.originalName === "null" || this.state.originalName && this.state.originalName === null ? "" : this.state.originalName}</Text>

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
                                    // style={{ backgroundColor: '#fff', width: '100%', height: 45, alignSelf: 'center', fontWeight: 'normal', marginTop: 0, marginBottom: 0 }}
                                    selectionColor={'#f0275d'}
                                    theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />


                            </View>

                            <TextInput
                                label=" Description"
                                placeholderStyle={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}
                                mode="outlined" gnb
                                multiline={true}
                                maxLength={500}
                                autoCorrect={false}
                                
                                // flexWrap: 'wrap'
                                value={this.state.description}
                                onChangeText={(text) => { this.setState({ description: text }) }}
                                style={{ backgroundColor: '#fff', fontSize: Description.FontSize, fontFamily: Description.Font }}
                                selectionColor={'#f0275d'}
                                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />


                            <View style={{ marginTop: '3%' }}>
                                {/* <Text style={{ fontSize: 16, marginLeft: '15%' }}>Personal Tour</Text> */}
                                <View style={{ flexDirection: 'row', marginLeft:4 }}>
                                <View style={{ width: '13%', }}>
                                        <TouchableOpacity onPress={() => this.refs.listmodal.open()}>
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
                                        label="  Personal Tour"
                                        placeholderStyle={{ fontSize: Common_Color.countFontSize, fontFamily: Common_Color.fontMedium, color: 'red' }}
                                        mode="outlined"
                                        value={this.state.personalTour}
                                        maxLength={6}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => { this.setState({ personalTour: text }) }}
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
                                                 // resizeMode={'center'}
                                                    style={{ width: 10, height: 10, marginLeft: 5, marginTop:0 }}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        label="  Tour Advice"
                                        placeholderStyle={{ fontSize: Common_Color.countFontSize, fontFamily: Common_Color.fontMedium, }}
                                        mode="outlined"
                                        value={this.state.tourAdvice}
                                        maxLength={6}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => { this.setState({ tourAdvice: text }) }}
                                        style={{ marginLeft: -9, backgroundColor: '#fff', width: '88%', height: 37, alignSelf: 'center', fontWeight: 'normal', marginTop: -5, marginBottom: 0 }}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />
                                </View>


                                <View style={common_styles.Common_button}>
                                    <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '97%', height: '100%', marginLeft: -5 }}>
                                        {this.state.isLoading === false ?
                                            <TouchableOpacity style={{ width: '100%', height: '100%' }}
                                                onPress={() => this.join()}>
                                                <Text style={[common_styles.Common_btn_txt, { marginTop: 12, marginLeft: -15 }]}> Join</Text>
                                            </TouchableOpacity> :
                                            <Text style={[common_styles.Common_btn_txt, { marginTop: 12, marginLeft: -15 }]}>Joining...</Text>}
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


