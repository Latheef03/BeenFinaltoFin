import React, { Component } from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, ScrollView,
    ImageBackground, Alert,ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import Loader from '../../Assets/Script/Loader';
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import { TextInput } from 'react-native-paper';

export default class AddAlbum extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            id: '',
            albumName: '',
            albumData: null,
            photoPath: null,
            photoPath1: null,
            images: null,
            inputError : false,
            isLoading : false
        }
    }


    albumName = text => {
        this.setState({ albumName: text,inputError:false});
        if(text == ''){
            this.setState({ inputError: true });
            return false;
        }
    };

    

    cancel() {
        this.props.navigation.navigate('UserProfileAlbums')
    }

    close() {
        this.props.navigation.navigate('UserProfileAlbums')
    }

    create() {
        this.setState({ albumData: 1 });
        this._openGallery();
    }

    next = async () => {
        debugger
        const { albumName } = this.state;
        if (albumName == '') {
            this.setState({
                inputError: true
            });
            return false;
        }

        if(albumName.length > 15){
            toastMsg1('danger', 'Enter 15 characters')
           // ToastAndroid.show('Enter 15 characters',ToastAndroid.SHORT);
            return false;
        }

        this.setState({
            isLoading: true
        });
        var id = await AsyncStorage.getItem("userId");
        console.log('ida', id)
        const url = serviceUrl.been_urlP01 + "/CreateAlbums";
        var data2 = {
            UserId: id,
            Name: this.state.albumName,
            Type: 'album'
        }
        console.log('into formdatas', data2);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
                },
                body: JSON.stringify(data2),
            });
            const responseJson = await response.json();
            if (responseJson.status == "True") {
                console.log('responseJson true', responseJson)
                this.close();
                this.setState({ isLoading: false });
            } else {
                console.log('response json ', responseJson);
                //toastMsg('danger', response.message, '#cb1f4c')
                this.setState({ isLoading: false });
            }
        }
        catch (error) {
            console.log("Line nuber 101", error);
            this.setState({ isLoading: false });
            reject(new Error(`Unable to retrieve events.\n${error.message}`));
        }
    }

    _openGallery = () => {
        /**
         * @NEED @Import_customized_gallery_picker
         */
        // ImagePicker.openPicker({
        //     isCamera: false,
        //     multiple: true
        // }).then(images => {
        //     console.log('received images callback', images);
        //     this.setState({
        //         photoPath: images[0].path.replace('file:///', ''),
        //         photoPath1: images[0].path,
        //         images: images.map(i => {
        //             return { uri: i.path, width: i.width, height: i.height, mime: i.mime };
        //         })
        //     });
        // }).catch(e => alert(e));
    }

    renderImage(image) {
        return (
            <TouchableOpacity onPress={() => this._setSelectedImage(image)}>
                <Image style={{ width: 40, height: 60, margin: 8, resizeMode: 'contain' }} source={image} />
            </TouchableOpacity>
        )
    }

    _setSelectedImage(image) {
        this.setState({
            photoPath: image.uri.replace("file:///", ''),
            photoPath1: image.uri
        })
    }


    render() {
        const {isLoading,albumData,albumName,inputError} = this.state;
        return (

            <View style={{ width: '100%', height: '100%', backgroundColor: '#fff',marginTop:0 }}>
                {/* header of screen */}
                {albumData == null ?
                    <Toolbar {...this.props} icon={"Down"} centerTitle="Add Albums" />
                    : null}

                {/* Add Album View Start */}
                {albumData == null ?
                    (<View>
                        <TextInput
                            label="Album Name"
                            placeholderStyle={{ fontWeight: 'bold', fontSize: 20, color: 'red' }}
                            mode="outlined"
                            value={albumName}
                            autoCorrect={false}
                            keyboardType="default"
                            onChangeText={this.albumName}
                            error={inputError}
                            style={{ backgroundColor: '#fff',  width: wp(97), height: 37, alignSelf: 'center', fontSize: profilename.FontSize, fontFamily: profilename.Font, marginTop: 8, marginBottom: 8 }}
                            selectionColor={'#f0275d'}
                            theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />

                        {inputError && (
                            <View style={{ marginLeft: 10, marginTop: 5 }}>
                                <Text style={{ color: "red" }}>
                                    <Text style={{ fontWeight: "bold" }}>*</Text>
                                     Cannot leave empty
                                 </Text>
                            </View>
                        )}

                        <View style={[Common_Style.Common_button, { width: wp('100%'),alignSelf:'center' }]}>
                        <TouchableOpacity style={{width:wp('95%'),}} onPress={() => { isLoading ? null : this.next() }}>
                            <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%',alignContent:'center',justifyContent:'center' }}
                                borderRadius={10}
                            >
                               <Text onPress={() => { isLoading ? null : this.next() }} style={[Common_Style.Common_btn_txt,{padding:8}]}> {isLoading ? 'Creating Album...' :'Create'}</Text>
                            </ImageBackground>
                         </TouchableOpacity>

                        </View>
                        <View style={[Common_Style.Common_button, { width: wp(97), marginTop: 5, marginBottom: 5 }]}>
                        <TouchableOpacity onPress={() => this.cancel()}>
                            <Text onPress={() => this.cancel()} style={[Common_Style.Common_btn_txt, { color: 'black', marginLeft: 15 }]}>Cancel</Text>
                         </TouchableOpacity>

                        </View>
                       
                    </View>) :
                    // Add Album View End

                    this.state.albumData == 1 ?
                        (
                            <ImageBackground style={{ width: '100%', height: hp('100%'), }}
                                source={{ uri: this.state.photoPath1 }} >

                                <View style={{ backgroundColor: 'transparent', width: wp('100%'), height: '100%' }}>
                                    <View style={{ width: wp('15%') }}>
                                        <TouchableOpacity onPress={() => this.close()}>
                                            <Image style={{ width: 18, height: 18, margin: 10 }}
                                                source={require('../../Assets/Images/close.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: hp('68%') }} />
                                    <TextInput
                                        placeholder='Type here...'
                                        autoCorrect={false}
                                        keyboardType="default"
                                        placeholderTextColor='#fff'
                                        style={styles.textInput}
                                    />
                                    <View style={{ flexDirection: 'row', backgroundColor: '#526c6b' }}>
                                        <View style={{ width: wp('80%'), height: hp('15%'), marginBottom: 10, marginLeft: 5, flexDirection: 'row' }} >
                                            <ScrollView horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', paddingStart: 5, paddingEnd: 5 }}>
                                                {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderImage(i)}</View>) : null}
                                            </ScrollView>
                                        </View>
                                        <View style={{ marginTop: 15 }}>
                                            {this.state.isLoading != true ? (
                                                <TouchableOpacity onPress={() => this.next()}>
                                                    <LinearGradient
                                                        start={{ x: 0, y: 0.75 }}
                                                        end={{ x: 1, y: 0.25 }}
                                                        style={styles.nextButton}
                                                        colors={["#ffffff", "#ffffff"]} >
                                                        <Text style={[styles.LoginButtontxt, { marginTop: 5 }]}>Next</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>) :
                                                (
                                                    <Loader />
                                                )}
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        )
                        : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: "#87cefa",
        alignItems: "center",
        height: hp("6%"),
        width: wp("34%"),
        color: "blue",
        borderRadius: 8,
        justifyContent: "center",
        textAlign: "center",
        shadowColor: '#000000',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    nextButton: {
        backgroundColor: "#87cefa",
        height: hp("5%"),
        width: wp("20%"),
        marginTop: 25,
        borderRadius: 4,
        shadowColor: '#000000',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    LoginButtontxt: {
        color: "#909090",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 16,
        fontFamily: Common_Color.fontBold
    },
    textInput: { width: wp('90%'), fontFamily: Common_Color.fontBold, backgroundColor: 'transparent', height: 45, marginBottom: 10, borderRadius: 20, marginTop: 25, padding: 15, borderWidth: 1, borderColor: '#cbcbcb', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' },
})