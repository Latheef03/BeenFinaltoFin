import React, { Component } from 'react'
import { View, StyleSheet, Image, StatusBar, Text, ImageBackground, FlatList } from 'react-native'
import { Header, Container, Footer, FooterTab, Content, Button, Spinner, Left } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import searchStyles from '../../../styles/searchStyles';

import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import serviceUrl from '../../../Assets/Script/Service';
import {Common_Color} from '../../../Assets/Colors'
import Common_Style from '../../../Assets/Styles/Common_Style'

export default class Places extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            getPlacesData: ''
        }
        this.arrayholder1 = [];
    }

    componentWillMount() {
        this.getPlace();
    }

    explore() {
        this.props.navigation.navigate('Search');
    }
    account() {
        this.props.navigation.navigate('SearchAccounts');
    }


    getPlace = async () => {
       // debugger;
        this.setState({
            isLoading: true
        });
        var id1 = await AsyncStorage.getItem('userId')
        var data = {
            userId: id1,
            tab : 'places'
        };
        const url = serviceUrl.been_url1 + "/SearchList";
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
                if (responseJson.status == 'True') {
                    this.setState({
                        getPlacesData: responseJson.Place
                    });
                    this.arrayholder1 = responseJson.Place;
                }
            })
            .catch((error) => {
                console.log("Error", error);
                //toastMsg('danger', 'Sorry..something network error.Please try again.')
            });
    };


    SearchFilterFunction(text) {
       // debugger;
        //passing the inserted text in textinput
        const newData = this.arrayholder1.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.PlaceName ? item.PlaceName.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            getPlacesData: newData,
            text: text
        });
    }

    getPlaceData(item){
        debugger
        var data={data:item,screen:'place'}
        this.props.navigation.navigate('GetData',{data:data});
    }

    render() {
        return (
            <View style={{ width: wp('100%'), height: hp('100%'), }}>
                
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                {/* <View style={{ width: wp('100%'), height: hp('80%') }}> */}
                    <FlatList
                       style={{marginBottom:15}}
                        data={this.state.getPlacesData}
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1, margin: 5, borderRadius: 10, flexDirection: 'row', marginTop: 5,marginBottom:10, alignContent: 'center', alignItems: 'center' }}>
                               <TouchableOpacity onPress={()=>this.getPlaceData(item)}>
                                <View style={{ width: wp('100%'), height: hp(6), flexDirection: 'row', marginLeft: 10,justifyContent:'flex-start',alignItems:'center' }}>
                                    <Image source={require('../../../Assets/Images/location1.png')}
                                        style={{ width:35, height:35, }} 
                                     //  resizeMode={'center'} 
                                         />
                                    <Text style={[Common_Style.name1,{marginLeft:5} ]}>{item.PlaceName}</Text>
                                </View>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={(<View style={{backgroundColor:'#FFF',height:5}}></View>)}
                    />
                {/* </View> */}
            </View>
        );
    }
}












