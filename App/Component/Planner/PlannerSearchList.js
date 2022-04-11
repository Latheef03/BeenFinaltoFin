import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, StatusBar, AsyncStorage, StatusBarIOS } from 'react-native';
import common_styles from "../../Assets/Styles/Common_Style"
import { Container, Content, Toast, Footer, FooterTab } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import { toastMsg } from '../../Assets/Script/Helper';
import Common_Style from "../../Assets/Styles/Common_Style"
import LinearGradient from "react-native-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
let Common_Api = require('../../Assets/Json/Common.json')
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../Assets/Colors'

export default class PlannerSearchList extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            searchListlocation: ''
        };
        this.arrayholder = [];
    }
    // componentWillMount() {
    //     this.Lpsearchlist();
    // }
    componentDidMount() {
        this.Lpsearchlist();
    }

    Lpsearchlist() {
        const url = serviceUrl.been_url1 + "/PlanerLocations";
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'
            },
        }).then((response) => response.json())
            .then((res) => {
                // console.log('response',res)
                this.setState({
                    searchListlocation: res.result
                });
                this.arrayholder = res.result;
            })

            .catch((error) => {
                console.log('the PlanerLocations error', error);
                // reject(new Error(`Unable to retrieve events.\n${error.message}`));
            });
    }

    selectLocation(item) {
       // debugger;
        const {navigation} = this.props
        console.log('the loca',item);
        navigation.navigate('Search1',{data:item.Location});
    }
    SearchFilterFunction(text) {
       // debugger;
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.Location ? item.Location.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            searchListlocation: newData,
            text: text
        });
    }



    cancel() {
        this.props.navigation.goBack()
    }
   
    render() {
        
        return (
            <View style={{ flex: 1,marginTop:StatusBar.currentHeight,backgroundColor:'#fff' }}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />

              
                 <View style={[Common_Style.searchView, { flexDirection: 'row', margin: 5 }]}>
                    <TextInput value={this.state.text}
                        onChangeText={text => this.SearchFilterFunction(text)}
                        autoCorrect={false}
                        
                        style={[Common_Style.searchTextInput, { width: wp(84) }]}
                        placeholder={'Search'}
                        value={this.state.text}
                        placeholderTextColor={'#6c6c6c'}>
                    </TextInput>
                    <TouchableOpacity style={{}} onPress={() => this.cancel()}>
                    <Text onPress={() => this.cancel()} style={{ marginRight: 10, fontFamily: Common_Color.fontBold, marginLeft: 3 }}>Cancel</Text>
                </TouchableOpacity>
                </View>
                <Content>
                    <FlatList
                        data={this.state.searchListlocation}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                            <ScrollView>
                                <TouchableOpacity onPress={() => this.selectLocation(item)}>
                                    <View style={{ marginLeft: 10,flexDirection: 'row', height: 50, width: wp('100%'), justifyContent: 'flex-start' }}>
                                        <View style={{ width: wp('2%') }} />


                                        <View style={{ width: wp('90%'), }}>
                                            <Text style={{ marginTop: 20, fontSize: Username.FontSize, marginLeft: 5, color: '#010101', fontFamily: Common_Color.fontRegular,}}>
                                                {item.Location}
                                            </Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                        keyExtractor={item => item.id}
                        horizontal={false}
                    />

                </Content>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        loginButton: { backgroundColor: "#87cefa", alignItems: "center", height: hp("6%"), width: wp("98%"), color: "blue", borderRadius: 8, justifyContent: "center", textAlign: "center", shadowColor: '#000000', shadowOffset: { width: 3, height: 3 }, shadowRadius: 5, shadowOpacity: 1.0, },
        LoginButtontxt: { color: "#fff", justifyContent: "center", textAlign: "center", fontSize: 16, fontFamily: Common_Color.fontMedium },
    },
)
