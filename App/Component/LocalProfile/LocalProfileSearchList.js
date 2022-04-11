import React, { Component } from 'react';
import { View, Text, Image, TextInput, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar, StyleSheet } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer } from 'native-base';
import searchList from './styles/searchList'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toastMsg } from '../../Assets/Script/Helper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
import serviceUrl from '../../Assets/Script/Service';
import Common_Style from '../../Assets/Styles/Common_Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { StatusBarIOS } from 'react-native';
var searchdata;

const imagepath = '../../Assets/Images/localProfile/';
const imagePath1 = '../../Assets/Images/';

export default class LocalProfileSearchList extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            searchText: '', data: '', localGuide: '',
            locationEditable: true,
            isPlacesModal: false,
            coords: '', location: '', searchListlocation: '', lpplacedata: ""
        }
    }

UNSAFE_componentWillMount = () =>{
        this.search()
}


    componentDidMount = () => {

        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                const lpplacedata = this.props.route.params?.data;
                console.log('ddd', lpplacedata);
                {
                    lpplacedata == undefined ?
                        this.setState({
                            lpplacedata: lpplacedata
                        }) :
                        this.setState({
                            lpplacedata: lpplacedata
                        })
                    this.search()
                }
            }
        );

    };
    search = async () => {
        // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId'),
            //  Userid:'5e219b53bd333366c1be32ec',
            PlaceName: this.state.lpplacedata
            // PlaceName: this.state.lpplacedata
        };
        const url = serviceUrl.been_url + '/GetAllLocalProfile'

        return fetch(url, {
            method: "POST",
            headers: serviceUrl.headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == 'True') {
                    //toastMsg('success', '' + responseJson.message)
                    this.setState({ data: responseJson.Result })
                }
                else {
                    console.log("error from  search");
                    //toastMsg('danger', 'Sorry no location available')
                }
            })
            .catch((error) => {
                // console.log(error);
                //toastMsg('danger', error + 'Sorry..something network error.Try again please.')
            });
    };
    stars(count) {
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= count; i++) {
            stars.push((
                <Fontisto name="star" size={20} style={{ marginLeft: 4 }} color="#fe9102" />));
        }

        return (stars);
    }

    _onfocus = () => {
        this.setState({
            locationEditable: false,
            isPlacesModal: true
        })

    }

    Lpsearchlist() {
     
        this.props.navigation.navigate('LpSearchList');
    }

    _handlePress = (data, details) => {
        // debugger;
        let addr = details.formatted_address.split(', ');
        let locName = addr[0],
            counName = addr[addr.length - 1];

        let lat = details.geometry ? details.geometry.location.lat : null,
            lng = details.geometry ? details.geometry.location.lng : null;
        var geom = {
            latitude: lat,
            longitude: lng
        }

        this.setState({
            location: locName,
            country: counName,
            // isPlacesModal: false,
            coords: JSON.stringify(geom)
        })
        // Alert.alert("loc",JSON.stringify(locName))
    }

    onReadMoreClose = (isModal) => {
        // alert('as')
        this.setState({
            isPlacesModal: false,
            // locationEditable : true,
        })
    };


    searchresult(item) {
        console.log("Item is passing ",item)
        var data = {
            data: item.Userid
        }
        this.props.navigation.navigate('LocalProfile5', { data: data })
    }

    render() {
        return (
            <View style={{backgroundColor:'#fff',flex:1}}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <View style={{ marginLeft: 10, marginTop:Platform.OS === "ios" ? StatusBar.currentHeight : StatusBar.currentHeight }}>

                    <View style={[Common_Style.searchView, { flexDirection: 'row', margin: 0 }]}>
                        <TouchableOpacity style={{ width: '84%', height: '90%',}} onPress={() => this.Lpsearchlist()}>
                            <View pointerEvents='none'>
                             <TextInput
                                onPressIn={() => this.Lpsearchlist()}
                                style={[Common_Style.searchTextInput, { width: wp(80), }]}
                                placeholder={'Search'}
                                autoCorrect={false}
                                value={this.state.lpplacedata}
                                editable={false}
                                placeholderTextColor={'#6c6c6c'}
                           />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text onPress={() => this.props.navigation.goBack()} style={{ fontSize: Username.FontSize, fontFamily: Username.Font, marginLeft: 8 }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={{ margin: 10, marginTop: 10, fontFamily: Common_Color.fontRegular, fontSize: Username.FontSize, }}>{this.state.data.length} Locals</Text>
                    </View>


                    <View style={{ marginTop: '5%', marginBottom: 80 }}>
                        {this.state.data.length > 0 || null ?
                            <FlatList
                                data={this.state.data}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{ marginTop: '-5%', marginBottom: '5%' }}
                                renderItem={({ item }) => (
                                    <View style={{ marginTop: '5%', marginBottom: 40, }}>
                                        {item.LocalProfilePic != null ?
                                            <ImageBackground source={{ uri: serviceUrl.profilePic + item.LocalProfilePic }}
                                                style={searchList.userProfile}
                                                borderRadius={20} >
                                                <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => this.searchresult(item)}>
                                                    <View style={{ alignSelf: 'flex-end', margin: '5%' }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                            <Image source={require(imagepath + 'pin.png')} style={[searchList.planner, { height: hp(2), width: wp(3), marginRight: 5, marginTop: 5 }]} />
                                                            <Text style={[searchList.textColor, { fontSize: Searchresult.FontSize, fontFamily: Common_Color.fontRegular, marginLeft: 4, }]}>{item.Spotcount}</Text>
                                                            <Text style={[searchList.textColor, { fontSize: TitleHeader.FontSize, fontFamily: Common_Color.fontRegular, marginLeft: 4, marginTop: 5 }]}>Spots</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, textAlign: 'center' }]}>
                                                                { Math.floor(item.AvgRatings)}
                                                            </Text>

                                                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                                {this.stars(item.AvgRatings)}
                                                            </View>

                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                                                                <Text style={[searchList.textColor, { fontSize: 18, fontFamily: Common_Color.fontMedium, textAlign: 'center' }]}>{item.Reviews}  reviews</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ position: 'absolute', bottom: 20 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '2%' }}>
                                                            <View style={{ width: '50%' }}>
                                                                <Text style={[searchList.textColor, { letterSpacing: .2, fontSize: Username.FontSize, fontFamily: Username.Font, }]}>{item.UserName}</Text>
                                                                <Text style={[searchList.textColor, { fontSize: TitleHeader.FontSize, fontFamily: Common_Color.fontRegular, }]}>{item.tagline}</Text>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Image source={require(imagepath + 'pin.png')} style={[searchList.planner, { height: hp(2), width: wp(3), marginTop: '1%' }]} />
                                                                    <Text style={[searchList.textColor, { fontSize: TitleHeader.FontSize, fontFamily: Common_Color.fontRegular, marginLeft: 5 }]}>{item.Location}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ width: '90%', }}>
                                                                <Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, marginTop: 0, textAlign: 'center' }]}>{item.TourAdvice}<Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, marginTop: 3, textAlign: 'center' }]}>Rs/hr</Text></Text>
                                                                <Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, marginTop: 3, textAlign: 'center' }]}>{item.PersonalTour}<Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, marginTop: 3, textAlign: 'center' }]}>Rs/Advice</Text></Text>


                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </ImageBackground>
                                            :
                                            <ImageBackground style={searchList.userProfile}
                                                borderRadius={20}
                                                source={require(imagePath1 + 'profile.png')}>

                                                <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => this.searchresult(item)}>
                                                    <View style={{ alignSelf: 'flex-end', margin: '5%' }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                            <Image source={require(imagepath + 'pin.png')} style={[searchList.planner, { height: hp(2), width: wp(3), marginRight: 5, marginTop: 5 }]} />
                                                            <Text style={[searchList.textColor, { fontSize: Searchresult.FontSize, fontFamily: Common_Color.fontRegular, marginLeft: 4}]}>{item.Spotcount}</Text>
                                                            <Text style={[searchList.textColor, { fontSize: TitleHeader.FontSize, fontFamily: Common_Color.fontRegular, marginLeft: 4, marginTop: 5 }]}>Spots</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, textAlign: 'center' }]}>
                                                                {Math.floor(item.AvgRatings)}
                                                            </Text>

                                                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                                {this.stars(item.AvgRatings)}
                                                            </View>

                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                                                                <Text style={[searchList.textColor, { fontSize: 18, fontFamily: Common_Color.fontMedium, textAlign: 'center' }]}>{item.Reviews}  reviews</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ position: 'absolute', bottom: 20 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '2%' }}>
                                                            <View style={{ width: '50%' }}>
                                                                <Text style={[searchList.textColor, { letterSpacing: .2, fontSize: Username.FontSize, fontFamily: Username.Font, }]}>{item.UserName}</Text>
                                                                <Text style={[searchList.textColor, { fontSize: TitleHeader.FontSize, fontFamily: Common_Color.fontRegular, }]}>{item.tagline}</Text>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Image source={require(imagepath + 'pin.png')} style={[searchList.planner, { height: hp(2), width: wp(3), marginTop: '1%' }]} />
                                                                    <Text style={[searchList.textColor, { fontSize: TitleHeader.FontSize, fontFamily: Common_Color.fontRegular, marginLeft: 5 }]}>{item.Location}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ width: '90%', }}>
                                                                <Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, marginTop: 0, textAlign: 'center' }]}>{item.TourAdvice}<Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, marginTop: 3, textAlign: 'center' }]}>Rs/hr</Text></Text>
                                                                <Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, marginTop: 3, textAlign: 'center' }]}>{item.PersonalTour}<Text style={[searchList.textColor, { fontSize: 22, fontFamily: Common_Color.fontBold, marginTop: 3, textAlign: 'center' }]}>Rs/Advice</Text></Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </ImageBackground>
                                        }
                                    </View>


                                )}

                                keyExtractor={(item, index) => index.toString()}
                            />

                            :
                            <View
                                style={{
                                    flex: 1, flexDirection: "column", justifyContent: "center",
                                    alignItems: "center"
                                }} >
                            </View>}

                    </View>


                </View>
            </View >

        )
    }
}


const searchInputStyle = {
    textInputContainer: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: 10,
        elevation: 0,
        borderColor: '#000',
        borderTopWidth: 0,
        borderBottomWidth: 0, marginLeft: 10
    },
    container: { width: '96%', height: '40%' },
    description: {
        fontWeight: 'bold',
        color: "#4c4c4c",

    },
    predefinedPlacesDescription: {
        color: '#1faadb'
    },
    textInput: {
        // backgroundColor:'#c1c1c1',
        height: 30,
        fontSize: 14,
        paddingLeft: 0,
        elevation: 0

    }
}





