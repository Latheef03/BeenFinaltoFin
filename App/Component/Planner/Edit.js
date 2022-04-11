import React, { Component } from 'react';
import { View, Text, Image, FlatList, KeyboardAvoidingView, TouchableOpacity, ScrollView, ImageBackground, StatusBar, Alert } from 'react-native';
import { Picker } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput, Menu, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serviceUrl from '../../Assets/Script/Service';
import { DatePickerDialog } from "react-native-datepicker-dialog";
import moment from "moment";
import plannerStyles from '../Planner/styles/plannerStyles'
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import common_styles from "../../Assets/Styles/Common_Style"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Toolbar } from '../commoncomponent'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { toastMsg1 } from '../../Assets/Script/Helper';


export default class Edit extends Component {

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
            location: '',
            Travel: '',
            Description: '',
            Currency: '', 
            result: "",
            dobDate: null,
            dobDate1: null,
            dobFmt: "",
            dobFmt1: "",
            min: "",
            max: "", FromDate: '',
            ToDate: '',
            dateOption: 0, newFromDate: "", locationEditable: true,
            isPlacesModal: false,
            coords: '', place_id: ""
        }
    }
    componentWillMount() {
        // debugger;
        const { route } = this.props;
        const Comments = route.params.data;
        this.setState({
            result: Comments.result,
            FromDate: Comments.result.TravelDates.split('-')[0],
            ToDate: Comments.result.TravelDates.split('-')[1],
            Currency:Comments.result.Currency,
            title: Comments.result.Title,
            location: Comments.result.Location,
            min: Comments.result.MinPrice,
            max: Comments.result.MaxPrice,
            Description: Comments.result.Description,
        });
    }

    title = text => {
        this.setState({
            title: text
        });
    };
    location = text => {
        // debugger;
        this.setState({
            location: text
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
    time() {
        // debugger;
        alert("fgbfd")
        this.setState({
            FromDate: this.state.result.TravelDates.split('-')[0] + -+this.state.result.TravelDates.split('-')[1] + -+this.state.result.TravelDates.split('-')[2]
        })

    }
    _onfocus = () => {
        this.setState({
            locationEditable: false,
            isPlacesModal: true
        })

    }
    _handlePress = (data, details) => {
        debugger
        let addr = details.formatted_address.split(', ');
        let locName = addr[0],
            counName = addr[addr.length - 1];
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
            // isPlacesModal: false,
            place_id: place_id,
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
        debugger;
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
            const date = actualDate.getDate()
            const monArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const mnth = actualDate.getMonth() + 1;
            const yr = actualDate.getFullYear();
            console.log(date + ordinalString(date) + ' ' + monArr[mnth] + ' ' + yr)
            this.setState({
                newFromDate: fromDate,
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
            const dateTo = actualDate.getDate()
            const monArrTo = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const mnthTo = actualDate.getMonth() + 1;
            const yrTo = actualDate.getFullYear();
            console.log(dateTo + ordinalString(dateTo) + ' ' + monArrTo[mnthTo] + ' ' + yrTo)
            this.setState({
                ToDate: flag ? dateTo + ordinalString(dateTo) + ' ' + monArrTo[mnthTo] + ' ' + yrTo : ''
            })
        }
    };

    async UpdateGroup() {
        debugger;
        if (parseInt(this.state.min) < parseInt(this.state.max)) {
            this.setState({
                isModalVisible: false ,
                isLoader : true
            })
            var data = {
                userId: await AsyncStorage.getItem('userId'),
                groupId: await AsyncStorage.getItem('OtherUserIdPlanner'),
                title: this.state.title,
                location: this.state.location != undefined ? this.state.location : "",
                traveldate: this.state.FromDate + '-' + this.state.ToDate,
                currency: this.state.Currency,
                description: this.state.Description,
                minPrice: this.state.min,
                maxPrice: this.state.max,
                // place_id:this.state.place_id
            };

            const url = serviceUrl.been_url1 + "/EditPlanner";
            return fetch(url, {
                method: "POST",
                headers: serviceUrl.headers,
                body: JSON.stringify(data)
            }).then((response) => response.json())
              .then((responseJson) => {
                this.setState({ isLoader : false })
                console.log('responseJson',responseJson);
                    //toastMsg('success', responseJson.message)
                    this.props.navigation.navigate('Planner');
            }).catch((error) => {
                    console.log('error',error);
                    toastMsg1('danger',error.message || 'something went wrong.')
                    this.setState({ isLoader : false })
            });
        }
        else if (parseInt(this.state.min) > parseInt(this.state.max)) {
            toastMsg1('danger', 'Please Give more Maximum Price')
            // Alert.alert('Warning', 'Please Give more Maximum Price');
        }
        else {
            toastMsg1('danger', 'Please fill all fields')
            // Alert.alert('Warning', 'Please fill all fields');
        }
        renderRightImgdone = () => {
            return (
                <View style={[stylesFromToolbar.leftIconContainer, { flexDirection: 'row', }]}>
                    <View >
                        <Image resizeMode={'stretch'} style={{ width: 20, height: 20 }} />
                    </View>
                </View>

            )
        }
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
        const keyboardVerticalOffset = Platform.OS === "ios" ? 5 : 0;
        return (
            <KeyboardAvoidingView style={{ flex: 1, marginTop: 0,backgroundColor:'#fff' }}
                keyboardVerticalOffset={keyboardVerticalOffset} behavior={Platform.OS === "ios" ? "padding" : null}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitle="Edit" rightImgView={this.renderRightImgdone()} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
                    <View style={{ marginTop: '0%', }} >
                        <View style={{ marginVertical: '2%', margin: '3%', marginLeft: '5%', }}>
                            <Text style={{ fontSize: 18, color: '#010101', fontFamily: Common_Color.fontBold }}>
                                {this.state.result.Title}-{this.state.result.Location}
                            </Text>
                        </View>
                        <View style={{ margin: '5%', marginTop: '-3%', }}>
                            <TextInput
                                label="Title"
                                mode="outlined"
                                value={this.state.title}
                                autoCorrect={false}
                                
                                onChangeText={text => this.title(text)}
                                style={[common_styles.textInputSignUp, { width: '99.5%' }]}
                                selectionColor={'#f0275d'}
                                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                            <View style={{ width: wp('101%'), marginLeft: -18, marginTop: 2 }}>
                                <GooglePlacesAutocomplete
                                    placeholder='Search Locations'
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
                                        this._handlePress(data, details);
                                    }}
                                    getDefaultValue={() => this.state.location}
                                    query={{  key: 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20',language: 'en',   types: ''   }}

                                    styles={{
                                        textInputContainer: { width: '89%', height: 37,backgroundColor: 'rgba(0,0,0,0)', borderWidth: .7, borderColor: '#000', margin: 10, borderRadius: 10, borderTopWidth: 1, borderBottomWidth: 1, marginLeft: 18, },
                                        description: {fontSize: profilename.FontSize, 
                                            // fontFamily: profilename.Font,
                                            color: "#4c4c4c", },
                                        predefinedPlacesDescription: {color: '#1faadb' },
                                        textInput: { height: 23, fontSize: profilename.FontSize, 
                                            // fontFamily: profilename.Font,  
                                            paddingLeft: 0, }
                                    }}

                                    currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                    currentLocationLabel="Current location"
                                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{}}
                                    GooglePlacesSearchQuery={{
                                        rankby: 'distance,keyword,name', //distance
                                        type: 'cafe' //cafe
                                    }}
                                    GooglePlacesDetailsQuery={{ fields: 'formatted_address,name,geometry',}}
                                    filterReverseGeocodingByTypes={['country', 'locality',
                                        'street_address', 'food', 'address', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'geometry']}
                                    debounce={200}
                                    enablePoweredByContainer={false}
                                />
                            </View>

                            <View style={[searchInputStyle.textInputContainer, { flexDirection: 'row', marginLeft: -10, marginTop: '0.5%' }]}>
                                <View style={{ width: '53%', marginTop: -10 }}>
                                    <TouchableOpacity onPress={this.onDOBPress.bind(this, 1)}>
                                        <View pointerEvents='none'>
                                        <TextInput
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
                                        </View>
                                        <DatePickerDialog
                                            ref="dobDialog"
                                            onDatePicked={this.onDOBDatePicked.bind(this, 'from')}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ width: '52%', marginTop: -10 }}>
                                    <TouchableOpacity onPress={this.onDOBPress.bind(this, 2)}>
                                        <View pointerEvents='none'>
                                        <TextInput
                                            style={{ marginLeft: '10%' }}
                                            editable={false}
                                            label='Travel Dates To'
                                            mode="outlined"
                                            value={this.state.ToDate}
                                            onChangeText={this.onDOBDatePicked}
                                            mode="outlined"
                                            style={[common_styles.textInputSignUp, { width: '94%', height: 37, marginLeft: -5 }]}
                                            selectionColor={'#f0275d'}
                                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }}
                                        />
                                        </View>
                                        <DatePickerDialog
                                            ref="dobDialog1"
                                            onDatePicked={this.onDOBDatePicked.bind(this, 'to')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>



                            <View style={{ borderWidth: 1, borderColor: '#000', marginTop: '2.8%', backgroundColor: '#fff', width: '100%', height: 40, alignSelf: 'center', borderRadius: 10 }} >
                                <View style={{ bottom: 12, width: '96%',}}>
                                    <Text style={{ textAlign: 'left', backgroundColor: '#fff', width: '24%', marginLeft: 10, fontSize: profilename.FontSize, fontFamily: profilename.Font }}> Currency</Text>
                                    <Picker
                                        selectedValue={this.state.Currency}
                                        style={{ marginLeft: 4,width: '96%',fontSize: profilename.FontSize, fontFamily: profilename.Font, marginTop: -7 }}
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
                                label="Description..."
                                mode="outlined"
                                value={this.state.Description}
                                onChangeText={text => this.Description(text)}
                                multiline={true}
                                autoCorrect={false}
                                
                                maxLength={500}
                                style={{  fontSize: profilename.FontSize, fontFamily: profilename.Font, backgroundColor: '#fff', width: '100%', marginTop: 4,marginLeft: 2 }}
                                selectionColor={'#f0275d'}
                                numberOfLines={5}
                                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', paddingLeft: 5 } }} />

                            <View style={[common_styles.Common_button, { marginTop: 15 }]}>
                                <ImageBackground borderRadius={10} source={require('../../Assets/Images/button.png')} style={{ width: '97%', height: '100%', marginLeft: -5 }}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%' }}
                                        onPress={() => this.UpdateGroup()}>
                                        <Text style={[common_styles.Common_btn_txt, { marginTop: 12, marginLeft: -15 }]}> 
                                            {this.state.isLoader ? 'Updating...':'Update'}
                                        </Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>

                        </View>
                    </View>

                </ScrollView>

            </KeyboardAvoidingView>
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
