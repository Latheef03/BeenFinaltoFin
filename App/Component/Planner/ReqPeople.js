import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Content, Toast, Footer, FooterTab } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import LinearGradient from "react-native-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
import Profile_Style from "../../Assets/Styles/Profile_Style"
import {Common_Color} from '../../Assets/Colors'
import Common_Style from '../../Assets/Styles/Common_Style';
let Common_Api = require('../../Assets/Json/Common.json')

export default class ReqPeople extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            partnerData: '',
            dataSource: '',
            arrayName: [],
            arrayNameid: [],
            albumId: null,
            UserId: null,
            UserName: null
        };
        this.arrayholder = [];
    }
    componentWillMount() {
        this.getTagPeople();
    }
    componentDidMount() {
        this.getTagPeople();
    }

    seperator() {
        <View style={{ width: "50%", margin: '5%' }}></View>
    }
    _selectedListForDel = (newData) => {
        var UserName = newData.userName;
        var Userid = newData._id;
        newData.selected = !newData.selected;
        if (newData.selected == true) {
            this.state.arrayName.push(UserName.toString());
            this.state.arrayNameid.push(Userid.toString());
        }
        if (newData.selected == false) {
            let arrName = this.state.arrayName;
            arrName = arrName.filter(e => e !== UserName);
            this.state.arrayName = arrName;
            let arrid = this.state.arrayNameid;
            arrid = arrid.filter(e => e !== Userid);
            this.state.arrayNameid = arrid;
        }
        this.state.partnerData.map(data => {
            if (this.state.arrayNameid.includes(data._id)) {
                data.selected = true;
            }
            return data
        })

        this.setState({
            UserName: this.state.arrayName,
            UserId: this.state.arrayNameid
        })
    }

    async getTagPeople() {
       // debugger;
        var data = {
            userId: await AsyncStorage.getItem('userId'),
        };
        const url = serviceUrl.been_url + "/GetTags";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status == 'True') {
                    let arrImg = [];
                    res.result.length > 0 && res.result.map(v => {
                        //let imgs = v.ProfilePic.split(',');
                        arrImg.push({
                            _id: v._id,
                            userName: v.UserName,
                            userPic: v.ProfilePic,
                            selected: false
                        })
                    }),

                        this.setState({
                            partnerData: arrImg,
                            dataSource: res.result
                        }),
                        this.arrayholder = partnerData;
                }
                else {
                    alert('status false')
                    //toastMsg('danger', responseJson.message)
                }
            })
            .catch(function (error) {
                console.log("Eroror", error);
                reject(new Error(`Unable to retrieve events.\n${error.message}`));
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
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            partnerData: newData,
            text: text
        });
    }



    cancel() {
        var data = {
            image: 1
        }
        this.props.navigation.navigate('NewsfeedUpload', { data: data });
    }

    getTags = () => {
        debugger
        var data = {
            tagId: this.state.UserId,
            image: 1
        }
        this.props.navigation.navigate('NewsfeedUpload', { data: data });
    }



    render() {
        return (
            <Container>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />

                <View style={{ borderRadius: 10, flexDirection: 'row', width: '76%', margin: 10, height: 40, borderColor: 'grey', borderWidth: .7, }}>
                    <Image source={require('../../Assets/Images/Search.png')}
                        style={{ width: 15, height: 15, marginTop: 10, marginLeft: 10 }} />
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor="#010101"
                        underlineColorAndroid="transparent"
                        autoCorrect={false}

                        onChangeText={text => this.SearchFilterFunction(text)}
                        value={this.state.text}
                        selectionColor='red'
                        style={{ color: '#010101',fontSize:14,fontWeight:'normal', padding: 10, hieght:40, width: '100%',marginTop:5,fontFamily:Common_Color.fontMedium }} />
                    <Text onPress={() =>this.cancel()} style={{ marginRight: 10, marginTop: 5,color: '#010101',fontSize:14,fontWeight:'normal',fontFamily:Common_Color.fontMedium }}>Cancel</Text>
                </View>
                <Content>

                    <FlatList
                        data={this.state.partnerData}
                        ItemSeparatorComponent={this.seperator()}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                            <ScrollView>
                                <TouchableOpacity onPress={() => this._selectedListForDel(item)}>
                                    <View style={{ flexDirection: 'row', height: 50, width: wp('100%'), justifyContent: 'flex-start' }}>
                                        <View style={{ width: wp('2%') }} />
                                        <View style={{ width: wp('15%') }}>

                                            {item.VerificationRequest === "Approved" ? (
                                                <View>
                                                    {item.userPic == undefined || null ? (
                                                        <View >
                                                            <Image
                                                                source={require(imagePath + 'profile.png')}
                                                                style={Profile_Style.avatarProfile1} />

                                                        </View>)
                                                        : (
                                                            <View>
                                                                <ImageBackground
                                                                    source={{ uri: serviceUrl.profilePic + item.userPic }}
                                                                    style={Profile_Style.avatarProfile1} >
                                                                    <Image source={require(imagePath1 + 'TickSmall.png')} style={Common_Style.tickImage} />
                                                                    {/* ,marginTop:-50 */}
                                                                    {/* style={businessProfileStyle.verify} /> */}
                                                                </ImageBackground>
                                                            </View>
                                                        )}
                                                </View>
                                            ) :
                                                (<View>
                                                    {item.userPic == undefined || null ?
                                                        <Image style={Profile_Style.avatarProfile1}
                                                            source={require(imagePath + 'profile.png')}></Image>
                                                        :
                                                        <Image style={Profile_Style.avatarProfile1}
                                                            source={{ uri: serviceUrl.profilePic + item.userPic }} />}
                                                </View>)}
                                           
                                        </View>

                                        <View style={{ width: wp('70%'), }}>
                                            <Text style={{ marginTop: 20, fontSize: 16, marginLeft: 5,color:'#010101',fontFamily:Common_Color.fontMedium }}>
                                                {item.userName}
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

                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: '#fff' }}>
                        <TouchableOpacity onPress={() => this.getTags()}>
                            <LinearGradient
                                start={{ x: 0, y: 0.75 }}
                                end={{ x: 1, y: 0.25 }}
                                style={styles.loginButton}
                                colors={["#fb0141", "#f44"]} >
                                <Text style={styles.LoginButtontxt}>Done</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const styles = StyleSheet.create(
    {
loginButton: { backgroundColor: "#87cefa",  alignItems: "center", height: hp("6%"),width: wp("98%"), color: "blue", borderRadius: 8,justifyContent: "center",textAlign: "center",shadowColor: '#000000', shadowOffset: {  width: 3,  height: 3   },  shadowRadius: 5,  shadowOpacity: 1.0,},
LoginButtontxt: { color: "#fff", justifyContent: "center",textAlign: "center", fontSize: 16,fontWeight:'bold',fontFamily:Common_Color.fontBold
},
},
)
