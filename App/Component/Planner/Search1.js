import React, { Component } from 'react';
import { View, Text, Image, FlatList, ToastAndroid, TouchableOpacity, ScrollView, ImageBackground, StatusBar, Alert } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer,Picker } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DatePickerDialog } from "react-native-datepicker-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import serviceUrl from '../../Assets/Script/Service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Toolbar } from '../commoncomponent'
import common_styles from "../../Assets/Styles/Common_Style"
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
import Common_Style from '../../Assets/Styles/Common_Style';
import Loader from '../../Assets/Script/Loader';
import Modal from "react-native-modal";
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { TextInput, Menu, Divider } from 'react-native-paper';
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';
const imagepath = './images/';
const CurrencyArr = [
    { label: "Rs", value: "Rs" },
    { label: "Euros", value: "Euros" },
    { label: "Dollars", value: "Dollars" }
];


export default class Search1 extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            distance1: 1000,
            minDistance1: 500,
            maxDistance1: 10000,
            distance2: 10000,
            minDistance2: 500,
            maxDistance2: 20000,
            title: '',
            Location: '',
            Travel: '',
            Description: '',
            Currency: '',
            dobDate: null,
            dobDate1: null,
            dobFmt: "",
            dobFmt1: "",
            min: '',
            max: '', FromDate: '',
            ToDate: '',
            dateOption: 0, newFromDate: "",
            locationEditable: true,
            isPlacesModal: false, RequestModal: false,
            coords: '', PlannerSearchList: '', plannerplacedata: '', isLoader: false,

        }
    }

    UNSAFE_componentWillMount() {
    
        const plannerplacedata = this.props.route?.params?.data;
        this.setState({
            plannerplacedata: plannerplacedata, isLoader: false
        });
    }

    componentDidMount = () => {
       // debugger;
        this.focusSubscription = this.props.navigation.addListener(
            "focus",() => {
                const plannerplacedata = this.props.route?.params?.data;
                this.setState({
                    plannerplacedata: plannerplacedata
                });
            }
        );

    };

    title = text => {
        this.setState({
            title: text
        });
    };
    Location = text => {
        this.setState({
            Location: text
        });
    };
    Travel = text => {
        this.setState({
            Travel: text
        });
    };
    Description = text => {
        this.setState({
            Description: text
        });
    };
    min = text => {
        this.setState({
            min: text
        });
    };
    max = text => {
        this.setState({
            max: text
        });
    };
    _onfocus = () => {
        this.setState({
            locationEditable: false,
            isPlacesModal: true
        })

    }
    _handlePress = (data, details) => {
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
    }

    onReadMoreClose = (isModal) => {
        // alert('as')
        this.setState({
            isPlacesModal: false,
            // locationEditable : true,
        })
    };
    onDOBPress = (optionNo) => {
        //debugger;
        //To open the dialog
        if (optionNo == 1) {
            this.refs.dobDialog.open({
                date: new Date(),
                minDate: new Date(),
                maxDate: new Date("2120") //To restirct future date
            });
        }
        else {
            this.refs.dobDialog1.open({
                date: new Date(),
                minDate: new Date(),
                maxDate: new Date("2120") //To restirct future date
            });
        }

        this.setState({
            dateOption: optionNo
        })
    };
    onDOBDatePicked = (date, fromDate) => {
        // alert(fromDate)
        const { FromDate, newFromDate } = this.state;
        var flag = true;

        if (FromDate != '') {
            let convertTime = new Date(newFromDate).getTime();
            let selectedTime = new Date(fromDate).getTime();
            if (convertTime > selectedTime) {
                flag = false;
                toastMsg1('danger','Please change the date.because, you can\'t time travel from future to past. ')
                //Alert.alert('Warning', 'Please change the date.because, you can\'t time travel from future to past. ');
                // this.setState({
                //     ToDate: ''
                // });
            }
        }
        if (date == 'from') {
            this.setState({
                newFromDate: fromDate,
                FromDate: moment(fromDate).format("DD-MM-YYYY")
            });
        } else {
            this.setState({
                ToDate: flag ? moment(fromDate).format("DD-MM-YYYY") : ''
            });
        }
    };
    PlannerSearchList() {
        this.props.navigation.navigate('PlannerSearchList');
    }

    SearchGroup1() {
        this.setState({ RequestModal: true, })
    }

    reqCancel() {
        this.setState({ RequestModal: false, })
    }

    async SearchGroup() {
        debugger;
        const { title, plannerplacedata, FromDate, ToDate, Currency, min, max } = this.state;
        if ((title == '' || title == null) && (plannerplacedata == '' || plannerplacedata == undefined) &&
            (FromDate == '' || FromDate == null) &&
            (ToDate == '' || ToDate == null) &&
            (Currency == '' || Currency == null) &&
            (min == '' || min == null) && (max == '' || max == null)) {
                toastMsg1('danger', "You must fill atleast one field");
            // alert('Atleast one field must be filled')
            // this.setState({ RequestModal: true, })
            // setTimeout(() => {
            //     this.setState({ RequestModal: false, })
            // }, 3000)
            // return false;
        }
        this.setState({ isLoader: true })
        var data = {
            userId: await AsyncStorage.getItem('userId'),
            title: this.state.title,
            location: this.state.plannerplacedata != undefined ? this.state.plannerplacedata : "",
            travelDate: this.state.FromDate && this.state.ToDate != null || "" || undefined ? this.state.FromDate + '-' + this.state.ToDate : "",
            currency: this.state.Currency,
            minamount: this.state.min,
            maxamount: this.state.max
        };
        console.log('the data is',data)
        const url = serviceUrl.been_url1 + "/Searchplanner";
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
                //toastMsg('success', responseJson.message);
                if (responseJson.result.length != 0) {
                toastMsg('success', responseJson.message);
                    var data = {
                        res: responseJson.result
                    }
                    this.setState({ isLoader: false });
                    this.props.navigation.navigate('GetSeachPlanner', { data: data });
                }
                else {
                    toastMsg1('danger', "No matches");
                    this.setState({ isLoader: false });
                    this.props.navigation.navigate('Search1');
                }
            })
            .catch((error) => {
                this.setState({ isLoader: false });
                // console.error(error);
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
    }
    renderRightImgdone() {
        return <View>
         
            <View style={[stylesFromToolbar.leftIconContainer, { flexDirection: 'row', }]}>
              <View >
                <Image resizeMode={'stretch'} style={{ width: 20, height: 20 }} />
              </View>
            </View>
         
    
        </View>
      }


    render() {
        return (
            <View style={{ width: wp('100%'), height: hp('100%'), marginTop: 0 ,backgroundColor:'#fff'}}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle="Search" rightImgView={this.renderRightImgdone()} />
                <Content>
                    <View style={{ margin: '5%', }}>
                        
                        <TextInput
                            label="Title"
                            mode="outlined"
                            value={this.state.title}
                            autoCorrect={false}

                            onChangeText={text => this.title(text)}
                            style={[common_styles.textInputSignUp, { width: '100%' }]}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} 
                        />
                        
                        <TouchableOpacity onPress={() => this.PlannerSearchList()}>
                            <View pointerEvents='none'>
                                <TextInput
                                    label="Destination"
                                    mode="outlined"
                                    autoCorrect={false}

                                    editable={false}
                                    value={this.state.plannerplacedata}
                                    onChangeText={text => this.title(text)}
                                    style={[common_styles.textInputSignUp, { width: '100%' }]}
                                    selectionColor={'#f0275d'}
                                    theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />
                            </View>
                        </TouchableOpacity>

                        <View style={[searchInputStyle.textInputContainer, { flexDirection: 'row', marginLeft: -10, marginTop: '0%' }]}>
                            <View style={{ width: '53%', }}>
                                <TouchableOpacity onPress={this.onDOBPress.bind(this, 1)}>
                                    {/* <TextInput
                                        editable={false}
                                        label='Travel Dates From'
                                        mode="outlined"
                                        value={this.state.FromDate}
                                        onChangeText={this.onDOBDatePicked}
                                        mode="outlined"
                                        style={[common_styles.textInputSignUp, { width: '93%', height: 37, marginLeft: 5 }]}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }}
                                    />
                                    <DatePickerDialog
                                        ref="dobDialog"
                                        onDatePicked={this.onDOBDatePicked.bind(this, 'from')}
                                    /> */}
                                    <View style={{ borderWidth: 1, borderColor: '#000', marginTop: '4%', backgroundColor: '#fff', width: '90%', height: 45, alignSelf: 'center', borderRadius: 10 }} >
                                        <View style={{ bottom: 10, width: '90%', }}>
                                            <Text style={{ textAlign: 'left', fontSize: 12, backgroundColor: '#fff', width: '80%', marginLeft: 10, marginTop: 2 }}> 
                                                Travel Dates From
                                            </Text>
                                            <Text style={{ margin: 5, paddingLeft: 7 }}>{this.state.FromDate}</Text>
                                            <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this, 'from')} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text> </Text>
                            <View style={{ width: '52%' }}>
                                <TouchableOpacity onPress={this.onDOBPress.bind(this, 2)}>
                                    {/* <TextInput
                                        style={{ marginLeft: '10%' }}
                                        editable={false}
                                        label='Travel Dates To'
                                        mode="outlined"
                                        value={this.state.ToDate}
                                        onChangeText={this.onDOBDatePicked}
                                        mode="outlined"
                                        style={[common_styles.textInputSignUp, { width: '93%', height: 37, marginLeft: -10 }]}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }}
                                    />

                                    <DatePickerDialog
                                        ref="dobDialog1"
                                        onDatePicked={this.onDOBDatePicked.bind(this, 'to')}
                                    /> */}
                                    <View style={{ borderWidth: 1, borderColor: '#000', marginTop: '4%', backgroundColor: '#fff', width: '90%', height: 45, alignSelf: 'center', borderRadius: 10 }} >
                                        <View style={{ bottom: 10, width: '80%', }}>
                                            <Text style={{ textAlign: 'left', fontSize: 12, backgroundColor: '#fff', width: '80%', marginLeft: 10, marginTop: 2 }}> 
                                                Travel Dates To
                                            </Text>
                                            <Text style={{ margin: 5, paddingLeft: 7 }}>{this.state.ToDate}</Text>
                                            <DatePickerDialog ref="dobDialog1" onDatePicked={this.onDOBDatePicked.bind(this, 'to')} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ borderWidth: 1, borderColor: '#000', marginTop: '3.5%', backgroundColor: '#fff', width: '100%', height: 40, alignSelf: 'center', borderRadius: 10 }} >
                            <View style={{ bottom: 10, width: '80%', }}>
                                <Text style={{ textAlign: 'left', backgroundColor: '#fff', width: '24%', marginLeft: 10, fontSize: profilename.FontSize, fontFamily: profilename.Font }}> Currency</Text>
                                <Picker
                                    selectedValue={this.state.Currency}
                                    style={{ marginLeft: 4, fontSize: profilename.FontSize, fontFamily: profilename.Font, marginTop: 0,width:'100%',
                                    bottom : 10 }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ Currency: itemValue })}>
                                    <Picker.Item label="Rs" value="Rs" />
                                    <Picker.Item label="Euros" value="Euros" />
                                    <Picker.Item label="Dollars" value="Dollars" />
                                </Picker>
                            </View>
                        </View>
                        <TextInput
                            label="Min Price"
                            mode="outlined"
                            value={this.state.min}
                            keyboardType={'number-pad'}
                            onChangeText={text => this.min(text)}
                            style={[common_styles.textInputSignUp, { width: '100%', marginTop: '3.5%', }]}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                        <TextInput
                            label="Max Price"
                            mode="outlined"
                            value={this.state.max}
                            keyboardType={'number-pad'}
                            onChangeText={text => this.max(text)}
                            style={[common_styles.textInputSignUp, { width: '100%', marginTop: '1.8%', }]}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />
                        {this.state.isLoader ? <Loader /> :
                            <TouchableOpacity style={{ width: '100%', height: '100%' }}
                                onPress={() => this.SearchGroup()}>
                                <View style={common_styles.Common_button}>
                                    <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '97%', height: '100%', marginLeft: -14 }}>
                                        <TouchableOpacity style={{ width: '100%', height: '100%' }}
                                            onPress={() => this.SearchGroup()}>
                                            <Text style={[common_styles.Common_btn_txt, { marginTop: 12, marginLeft: -15 }]}> Search</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        }


                    </View>
                   

                </Content>
            </View>
        )
    }
}

const searchInputStyle = {

    textInputContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 0,
        borderColor: '#fff',
        borderTopWidth: 0,
        borderBottomWidth: 0, marginLeft: 10
    },
    container: { width: '100%', height: '40%' },
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
