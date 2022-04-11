import React, { Component } from 'react'
import { View, StyleSheet, Image, ImageBackground, Text, StatusBar, FlatList,TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../../Assets/Script/Service';
import Common_Style from "../../../Assets/Styles/Common_Style";
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../../Assets/Colors'


export default class Search extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            getHashTagData: []
        }
        this.arrayholder1 = [];
        this.SearchFilterFunction = this.SearchFilterFunction.bind(this);
    }

    componentDidMount() {
        this.getHashtags();
        this.SearchFilterFunction = this.SearchFilterFunction.bind(this);
    }

    getHashtags = async () => {
       // debugger;
        this.setState({
            isLoading: true
        });
        var id1 = await AsyncStorage.getItem('userId')
        var data = {
            userId: id1,
            tab : 'hashtag'
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
                console.log('the hasstag data',responseJson);
                if (responseJson.status == 'True') {
                    this.setState({
                        getHashTagData: responseJson.HashTag
                    });
                    this.arrayholder1 = responseJson.HashTag;
                }
            })
            .catch((error) => {
                //console.error("Error", error);
            });
    };

    SearchFilterFunction(text) {
       // debugger;
        //passing the inserted text in textinput
        console.log('the search textss',text)
        console.log('the search textss',this.arrayholder1)
        const newData = this.arrayholder1.filter((item)=> {
            //applying filter for the inserted text in search bar
            console.log('the filter fn',item)
            const itemData = item.HashTag ? item.HashTag.toUpperCase() : "".toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        
        this.setState({
            getHashTagData: newData,
            // text: text
        });
    }


    getPlaceData(item){
        debugger
        var data={data:item,screen:'hashtag'}
        this.props.navigation.navigate('GetData',{data:data});
    }

    // demoMethod(text){
    //     console.log('demo',text);
    //     console.log('the search textss',this.arrayholder1)
    // }


    render() {
        return (

            <View style={{ flex:1 }}>
                <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
                {/* <View style={{ width: wp('100%'), height: hp('80%')}}> */}
                    <FlatList
                        style={{backgroundColor:'#FFF', marginTop: 5,marginBottom:10 }}
                        data={this.state.getHashTagData}
                        ListFooterComponent={<View style={{height:0}} />}
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderItem={({ item,index }) => (
                            <View key={`id${index}`} style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center',marginBottom:10 }}>
                               <TouchableOpacity onPress={()=>this.getPlaceData(item)}>
                                <View style={{ width: wp('100%'), height: hp(5), flexDirection: 'row', marginLeft: 10,justifyContent:'flex-start',alignItems:'center', }}> 
                                   <Text style={{fontSize:20,color:'#000',textAlign:'center',}}>#</Text>
                                    {/* <Image source={require('../../Assets/Images/location1.png')}
                                        style={{ width: wp(12), height: hp(7) }} borderRadius={50} /> */}
                                    <Text style={[Common_Style.name1, {marginLeft:5, }]}>{item.HashTag}</Text>
                                </View>
                                </TouchableOpacity>
                            </View>
                        )}
                        extraData = {this.state}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={(<View style={{backgroundColor:'#FFF',height:5}}></View>)}
                    />
                {/* </View> */}
            </View>

        );
    }
}

const styles = StyleSheet.create(
    {
        image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' }
    }
)











