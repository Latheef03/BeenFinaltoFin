import React, { Component } from 'react';
import { View, Text, Image, Alert, FlatList, ToastAndroid,PickerIOSComponent,PickerIOSItem, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body, Tabs, Footer, Picker} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput, Menu, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import { DatePickerDialog } from "react-native-datepicker-dialog";
import moment from "moment";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Loader from '../../Assets/Script/Loader';
import styles from '../../styles/NewsFeedUploadStyle'
import QB from 'quickblox-react-native-sdk';
import plannerStyles from '../Planner/styles/plannerStyles'
import common_styles from "../../Assets/Styles/Common_Style"
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
const imagepath = './images/';
import { Toolbar } from '../commoncomponent'
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import { initiateChat, isConnection, createUserSession, createConnectionToServer, checkSessions } from '../Chats/chatHelper';

export default class Create_group extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            distance1: 1000,
            minDistance1: 500,
            maxDistance1: 10000,
            distance2: 500,
            minDistance2: 10500,
            maxDistance2: 20000,
            title: '',
            Location: '',
            min: "",
            max: "",
            Travel: '',
            Description: '',
            Currency: 'Rs',
            FromDate: '',
            ToDate: '',
            dateOption: 0, newFromDate: "",
            locationEditable: true,
            isPlacesModal: false,
            coords: '', isLoader: false,
            isDisabled: false,state:'',country:"",location:'',
            place_id:"",coords:""
        }
    }

    UNSAFE_componentWillMount() {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => { this.setState({ isLoader: false }) })
    }
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

    onDOBPress = (optionNo) => {
       
        if (optionNo == 1) {
            
            if(this.refs.dobDialog)
            this.refs.dobDialog.open({
                date: new Date(),
                minDate: new Date(),
                maxDate: new Date("2120") //To restirct future date
            });
        }
        else {
            if(this.refs.dobDialog1)
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

    onFocusMethod() {
        return <PickerIOSComponent
            selectedValue={this.state.gender}
            style={{ height: 50, width: '100%',fontSize: profilename.FontSize, fontFamily: profilename.Font}}
            onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
            <PickerIOSItem label="Rs" value="Rs" />
            <PickerIOSItem label="Euros" value="Euros" />
            <PickerIOSItem label="Dollars" value="Dollars" />
        </PickerIOSComponent>

    }

    onDOBDatePicked = (date, fromDate) => {
     
        const { FromDate, newFromDate } = this.state;
        var flag = true;

        if (FromDate != '') {
            let convertTime = new Date(newFromDate).getTime();
            let selectedTime = new Date(fromDate).getTime();
            if (convertTime > selectedTime) {
                flag = false;
                toastMsg1('danger', 'Please change the date.because, you can\'t time travel from future to past. ')
            }
        }
        if (date == 'from') {

            const ordinalString = (d) => {
                if (d > 3 && d < 21) return 'th';
                switch (d % 10) {
                    case 1: return "st";
                    case 2: return "nd";
                    case 3: return "rd";
                    default: return "th";
                }
            }
            const actualDate = fromDate
            // const date = actualDate.getDate()
            const date = actualDate.getDate()
            const monArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const mnth = actualDate.getMonth() ;
            const yr = actualDate.getFullYear();
            console.log("DAta from from month",date + ordinalString(date) + ' ' + monArr[mnth] + ' ' + yr)
            this.setState({
                newFromDate: fromDate,
                // FromDate: moment(fromDate).format("DD-MM-YYYY")
                // FromDate: moment(fromDate).format('DD MMMM YYYY')
                // FromDate:dateFormat("dddd, mmmm dS, yyyy")
                FromDate: date + ordinalString(date) + ' ' + monArr[mnth] + ' ' + yr
            });
        } else {
            const ordinalString = (d) => {
                if (d > 3 && d < 21) return 'th';
                switch (d % 10) {
                    case 1: return "st";
                    case 2: return "nd";
                    case 3: return "rd";
                    default: return "th";
                }
            }
            const actualDate = fromDate
            // const date = actualDate.getDate()
            const dateTo = actualDate.getDate()
            const monArrTo = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const mnthTo = actualDate.getMonth() ;
            const yrTo = actualDate.getFullYear();
            console.log(dateTo + ordinalString(dateTo) + ' ' + monArrTo[mnthTo] + ' ' + yrTo)
            this.setState({
                // newFromDate: fromDate,
                // FromDate: moment(fromDate).format("DD-MM-YYYY")
                // FromDate: moment(fromDate).format('DD MMMM YYYY')
                // FromDate:dateFormat("dddd, mmmm dS, yyyy")
                ToDate: flag ? dateTo + ordinalString(dateTo) + ' ' + monArrTo[mnthTo] + ' ' + yrTo : ''
            })
            // this.setState({
            //     ToDate: flag ? moment(fromDate).format("DD-MM-YYYY") : ''
            // });
        }
    };

    _onfocus = () => {
        this.setState({
            locationEditable: false,
            isPlacesModal: true
        })

    }
    _handlePress = (data, details) => {
        debugger;
        let addr = details.formatted_address.split(', ');
        let locName = addr[0],
            counName = addr[addr.length - 1];
            stateName = addr[addr.length - 2];
        let lat = details.geometry ? details.geometry.location.lat : null,
            lng = details.geometry ? details.geometry.location.lng : null;
        var geom = {
            latitude: lat,
            longitude: lng
        }
        let data_id = '', place_id = '';
        if (data) {
          place_id = data.place_id
        }
        this.setState({
            location: locName,
            country: counName,
            state: stateName,
            place_id: place_id,
            coords: JSON.stringify(geom)
        })

    }

    selectCurrency = (item) => {
        this.setState({ Currency: item })
    }

    onReadMoreClose = (isModal) => {
        // alert('as')
        this.setState({
            isPlacesModal: false,
            // locationEditable : true,
        })
    };

    createGroupForGChat = async () => {
        // debugger;
        const { title, location, Currency, FromDate, ToDate, description, min, max } = this.state;
        let chatUserID = await AsyncStorage.getItem('chatUserID');
        let loginCred = await AsyncStorage.getItem('email')
        let chatUserPwd = await AsyncStorage.getItem('chatUserPWD');
        let isAllFieldFilled = true;
        if (title == "") {
            isAllFieldFilled = false;
        } else if (location == "" || location == undefined) {
            isAllFieldFilled = false;
        } else if (Currency == "") {
            isAllFieldFilled = false;
        } else if (FromDate == "") {
            isAllFieldFilled = false;
        } else if (ToDate == "") {
            isAllFieldFilled = false;
        } else if (description == "") {
            isAllFieldFilled = false;
        } else if (min == "") {
            isAllFieldFilled = false;
        } else if (max == "") {
            isAllFieldFilled = false;
        } else {
            isAllFieldFilled = true;
        }

        if (!isAllFieldFilled) {
            toastMsg1('danger', "Please fill all the fields.")
            //Alert.alert('Warning', 'Please fill all the fields.')
            return false;
        }

        let mini = parseInt(min), maxi = parseInt(max);
        if (mini >= maxi) {
            toastMsg1('danger', "you cannot enter less amount than minimum amount")
            //  Alert.alert('Warning', 'you cannot enter less amount than minimum amount')
            return false;
        }

        console.log('chat user id', chatUserID)
        if (chatUserID == null || chatUserID == "null" || chatUserID == undefined) {
            //toastMsg('danger','Can\'t create group without chat user id')
            return false;
        }

        if (typeof chatUserID == "string") {
            chatUserID = parseInt(chatUserID)
        }
        initiateChat()

        let checK_user_conn = await isConnection();
        if (!checK_user_conn) {
            let checkConn = await createConnectionToServer(chatUserID, chatUserPwd);
            console.log('session user is', checkConn)
        }

        let uSess = await createUserSession(loginCred, chatUserPwd)
        console.log('create user session', uSess)
        console.log('check connection', checK_user_conn);
        // let check_user_sess = await checkSessions()
        // console.log('check user session connection',check_user_sess);
        let isSessionExist = (uSess || uSess != undefined) && uSess.session && uSess.session.token ? true : false
        if (isSessionExist) {
            let chatid = uSess && uSess.user && uSess.user.id ? uSess.user.id : chatUserID
            this.setState({
                isDisabled: true
            })
            QB.chat
                .createDialog({
                    type: QB.chat.DIALOG_TYPE.GROUP_CHAT,
                    name: title,
                    occupantsIds: [chatid]
                })
                .then(dialog => {
                    console.log("dialog gchatss", dialog);
                    this.CreateGroup(dialog);
                })
                .catch(e => {
                    //toastMsg(
                    //     "danger",
                    //     "sorry , cannot create the group at this moment. try again once"
                    // );
                    this.setState({
                        isDisabled: false
                    })
                    console.log("error with gchat", e);
                    // handle error
                });
        } else {
            //toastMsg(
            //     "danger",
            //     "sorry , Something error..while create the group. try again later or contact support"
            // );
            this.setState({
                isDisabled: false
            })
        }




    }

    async CreateGroup(dialog) {
        // debugger;
        this.setState({ isLoader: true });
        var data = {
            userId: await AsyncStorage.getItem('userId'),
            Title: this.state.title,
            Location: this.state.location != undefined ? this.state.location+" "+this.state.state+" "+this.state.country : "",
            TravelDates: this.state.FromDate + '  -  ' + this.state.ToDate,
            Currency: this.state.Currency,
            Description: this.state.description,
            MinPrice: this.state.min,
            MaxPrice: this.state.max,
            chatIsJoined: dialog.isJoined,
            groupId: dialog.id,
            roomJid: dialog.roomJid,
            createdUserId: dialog.userId,
            createdAt: dialog.createdAt,
            place_id:this.state.place_id,
            coords:this.state.coords
        };
        const url = serviceUrl.been_urlP01 + "/CreatePlanner";
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
                this.setState({ isLoader: false });
                toastMsg('success', "Group Created Successfully")
                // ToastAndroid.show("Group Created Successfully", ToastAndroid.LONG)
                this.props.navigation.navigate('Planner');
            })
            .catch((error) => {
                // console.error(error);
                toastMsg('danger', 'Sorry..something network error.Try again please.')
                this.setState({
                    isDisabled: false,
                    isLoader: false

                })
            });

    }
    googlePlcac() {
        return
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
        const { isDisabled } = this.state
        return (
            <Container style={[plannerStyles.parentView, { marginTop: 0}]}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle="Create Group" rightImgView={this.renderRightImgdone()} />
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
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                        <View style={{ width: wp('101%'), marginLeft: -18, marginTop: 2 }}>
                            <GooglePlacesAutocomplete
                                placeholder='Destination'
                                minLength={1} // minimum length of text to search
                                autoFocus={false}
                                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                listViewDisplayed={false}    // true/false/undefined
                                fetchDetails={true}
                                value={this.state.location}
                                onChangeText={this.location}
                                renderDescription={row => row.description} // custom description render
                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    // console.log(data, details);
                                    this._handlePress(data, details);
                                }}

                                getDefaultValue={() => ''}

                                query={{
                                    key: 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20',
                                   
                                    language: 'en', // language of the results
                                    types: '' // default: 'geocode' || ,cities
                                }}

                                styles={{
                                    textInputContainer: {
                                        width: '89%',
                                        height: 37,
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        borderWidth: .7,
                                        borderColor: '#000',
                                        margin: 10,
                                        borderRadius: 10,
                                        borderTopWidth: 1,
                                        borderBottomWidth: 1,
                                        marginLeft: 18,
                                    },
                                    description: {
                                        fontSize: profilename.FontSize, 
                                        //fontFamily: profilename.Font,
                                        color: "black",

                                    },
                                    predefinedPlacesDescription: {
                                        color: 'black'
                                    },
                                    textInput: {
                                        // backgroundColor:'#c1c1c1',
                                        height: 23,
                                        fontSize: profilename.FontSize, 
                                        //fontFamily: profilename.Font,
                                        paddingLeft: 0,

                                    }
                                }}

                                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                currentLocationLabel="Current location"
                                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                GoogleReverseGeocodingQuery={{
                                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                }}
                                GooglePlacesSearchQuery={{
                                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                    rankby: 'distance,keyword,name', //distance
                                    type: 'cafe' //cafe
                                }}

                                GooglePlacesDetailsQuery={{
                                    // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                    fields: 'formatted_address,name,geometry',
                                }}

                                filterReverseGeocodingByTypes={['country', 'locality',
                                    'street_address', 'food', 'address', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'geometry']}
                                debounce={200}
                                enablePoweredByContainer={false}

                            />
                        </View>
                        <View style={[searchInputStyle.textInputContainer, { flexDirection: 'row', marginLeft: -10, marginTop: '0.5%' }]}>
                            <View style={{ width: '53%', marginTop: -8, }}>
                                <TouchableOpacity onPress={this.onDOBPress.bind(this, 1)} 
                                >
                                    {/* <TextInput
                                    onPressIn={this.onDOBPress.bind(this, 1)}
                                        editable={false}
                                        label='Travel Dates From'
                                        mode="outlined"
                                        value={this.state.FromDate}
                                        onChangeText={this.onDOBDatePicked}
                                        mode="outlined"
                                        style={[common_styles.textInputSignUp, { width: '93%', height: 37, marginLeft: 5 }]}
                                        selectionColor={'#f0275d'}
                                        theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }}
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
                                    {/* <DatePickerDialog
                                        ref="dobDialog"
                                        onDatePicked={this.onDOBDatePicked.bind(this, 'from')}
                                    /> */}
                                </TouchableOpacity>
                            </View>
                            <Text> </Text>
                            <View style={{ width: '52%', marginTop: -8 }}>
                                <TouchableOpacity onPress={this.onDOBPress.bind(this, 2)}>
                                    {/* <TextInput
                                    onPressIn={this.onDOBPress.bind(this, 2)}
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

                        <View style={{ borderWidth: 1, borderColor: '#000', marginTop: '5%', backgroundColor: '#fff', width: '100%', height: 40, alignSelf: 'center', borderRadius: 10 }} >
                            <View style={{ bottom: 10, width: '80%', }}>
                                <Text style={{ textAlign: 'left', backgroundColor: '#fff', width: '24%', marginLeft: 10, fontSize: profilename.FontSize, fontFamily: profilename.Font }}> Currency</Text>
                                <Picker
                                    selectedValue={this.state.Currency}
                                    style={{ marginLeft: 4, fontSize: profilename.FontSize, fontFamily: profilename.Font,width:'100%',
                                    bottom : 10}}
                                    // style={{ height: 35, marginLeft: 4, width: '100%', alignContent: 'center',fontSize: Common_Color.userNameFontSize, fontFamily: Common_Color.fontLight }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ Currency: itemValue })}>
                                    <Picker.Item label="Rupee" value="₹" />
                                    <Picker.Item label="Euros" value="€" />
                                    <Picker.Item label="Dollars" value="$" />
                                
                                </Picker>
                            </View>
                        </View>



                        <TextInput
                            label="Min Price"
                            mode="outlined"
                            value={this.state.min}
                            keyboardType={'number-pad'}
                            onChangeText={text => this.min(text)}
                            style={[common_styles.textInputSignUp, { width: '100%', marginTop: 10 }]}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />


                        <TextInput
                            label="Max Price"
                            mode="outlined"
                            value={this.state.max}
                            keyboardType={'number-pad'}
                            onChangeText={text => this.max(text)}
                            style={[common_styles.textInputSignUp, { width: '100%', marginTop: 5 }]}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                        <TextInput
                            label=" Description"
                            placeholderStyle={{ fontWeight: 'bold', color: 'red' }}
                            mode="outlined"
                            multiline={true}
                            maxLength={500}
                            autoCorrect={false}
                            
                            value={this.state.description}
                            onChangeText={(text) => { this.setState({ description: text }) }}
                            style={{
                                fontSize: profilename.FontSize, fontFamily: profilename.Font, backgroundColor: '#fff', width: '100%', marginTop: 4,
                                marginLeft: 2
                            }}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                        {this.state.isLoader ? <Loader /> :
                            <TouchableOpacity disabled={isDisabled} style={{ width: '100%', height: '100%' }}
                                onPress={() => this.createGroupForGChat()}>
                                <View style={[common_styles.Common_button, { marginTop: 15 }]}>
                                    <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '97%', height: '100%', marginLeft: -5 }}>
                                        {/* <TouchableOpacity disabled={isDisabled} style={{ width: '100%', height: '100%' }}
                                            onPress={() => this.createGroupForGChat()}> */}
                                        <Text style={[common_styles.Common_btn_txt, { marginTop: 12, marginLeft: -15 }]}> Create</Text>
                                        {/* </TouchableOpacity> */}
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        }



                    </View>

                </Content>

            </Container >
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




