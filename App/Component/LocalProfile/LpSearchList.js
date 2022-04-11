import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, StatusBar, AsyncStorage } from 'react-native';
import common_styles from "../../Assets/Styles/Common_Style"
import { Container, Content, Toast, Footer, FooterTab } from 'native-base';
import Common_Style from "../../Assets/Styles/Common_Style"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
let Common_Api = require('../../Assets/Json/Common.json')
import {Common_Color, Username} from '../../Assets/Colors'
import { Platform } from 'react-native';
import { StatusBarIOS } from 'react-native';
// import Common_Color from '../../Assets/Colors/Common_Color';



export default class LpSearchList extends Component {

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
    componentWillMount() {
        this.Lpsearchlist();
    }
    componentDidMount() {
        this.Lpsearchlist();
    }

    Lpsearchlist() {
        
    
            const url = serviceUrl.been_url1 + "/SearchLP";
            fetch(url, {
                method: "GET",
                headers: serviceUrl.headers,
            }).then((response) => response.json())
                .then((res) => {
                this.setState({
                    searchListlocation: res.SearchList
                });
                this.arrayholder = res.SearchList;
            })

            .catch(function (error) {
                reject(new Error(`Unable to retrieve events.\n${error.message}`));
            });
    }

    selectLocation(item) {
       // debugger;
        const { navigation } = this.props
        navigation.navigate('LocalProfileSearchList', { data: item.Place });
    }
    SearchFilterFunction(text) {
      
        const newData = this.arrayholder.filter(function (item) {
            const itemData = item.Place ? item.Place.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            searchListlocation: newData,
            text: text
        });
    }



    cancel() {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={{ flex: 1,marginTop:Platform.OS=== "ios" ? StatusBar.currentHeight: StatusBar.currentHeight,backgroundColor:'#fff' }}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />

                <View style={[Common_Style.searchView, { flexDirection: 'row',marginLeft:10  }]}>
                    <TextInput value={this.state.text}
                        onChangeText={text => this.SearchFilterFunction(text)}
                        style={[Common_Style.searchTextInput, { width: wp(82) }]}
                        placeholder={'Search Place '}
                        autoCorrect={false}
                        
                        //value={this.state.text}
                        placeholderTextColor={'#6c6c6c'}>
                    </TextInput>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ marginRight: 10, fontFamily: Username.Font, marginLeft: 8 }}>Done</Text>
                        </View>
                    </TouchableOpacity>
                </View>
              

                <Content >
                    <FlatList
                        data={this.state.searchListlocation}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                           <TouchableOpacity onPress={() => this.selectLocation(item)}>
                              <View key={index.toString()} style={{ flexDirection: 'row', height: 50, width: wp('100%'), justifyContent: 'flex-start' }}>
                                <View style={{ width: wp('2%') }} />
                                <View style={{ width: wp('90%'), }}>
                                  <Text style={{ marginTop: 20, fontSize: Username.FontSize, marginLeft: 5, color: '#9e9e9e', fontFamily: Common_Color.fontBold, }}>
                                      {item.Place}
                                  </Text>
                                </View>

                             </View>
                           </TouchableOpacity>
                            
                        )}
                        keyExtractor={(item,index) => index.toString()}
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
