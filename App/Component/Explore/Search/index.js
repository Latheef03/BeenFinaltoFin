import React, { Component } from 'react'
import { View, StyleSheet, Image, ImageBackground, Text, StatusBar,NativeModules, StatusBarIOS, FlatList,TouchableOpacity,Keyboard} from 'react-native'
import { Header, Container, Footer, FooterTab, Content, Button, Spinner, Left,Tabs, Tab } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult} from '../../../Assets/Colors'
import Common_Style from "../../../Assets/Styles/Common_Style";

import Search from './Search';
import Places from './Places';
import SearchAccounts from './SearchAccounts';
const { StatusBarManager } = NativeModules;


export default class searchExplore extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            tabHeading : 'Hashtag',
            searchText : '',
            tabIndex : 0
        }

     this.onchangeTabEvents = this.onchangeTabEvents.bind(this)
     this.filterData = this.filterData.bind(this);
        
    }

    componentDidMount(){
        // if(this.textInputField){
            this.textInputField.focus()
        // }
        // this.filterData
        if (Platform.OS === 'ios') {
          StatusBarManager.getHeight(response =>
              this.setState({iosStatusBarHeight: response.height})
          )
      
          this.listener = StatusBarIOS.addListener('statusBarFrameWillChange',
            (statusBarData) =>
              this.setState({iosStatusBarHeight: statusBarData.frame.height})
          )
        }
    }

    componentWillUnmount = () => {
    
      if (Platform.OS === 'ios' && this.listener) {
        this.listener.remove()
      }
    }


    onchangeTabEvents = ({i,ref}) =>{
        this.setState({
            tabHeading : ref.props.heading,
            tabIndex : i,
            text : ''
        })
    }

    filterData(text) {
        const {tabIndex} = this.state;
        switch(tabIndex){
          case 0 :
            this.refs.searchHash.SearchFilterFunction(text);
            break;
          case 1 :
            this.refs.searchPlaces.SearchFilterFunction(text);
            break;
          case 2 :
            this.refs.searchAcc.SearchFilterFunction(text);
            break;      
        }
        this.setState({text:text})
    }

    

    render() {
        const {tabHeading,iosStatusBarHeight} = this.state;
        const  topPosition =  Platform.OS == 'ios' ? iosStatusBarHeight : StatusBar.currentHeight 

        return (

            <View style={{ flex:1,backgroundColor:'#fff'}}>
              
                <View style={{width:wp('100%'),height:hp('100%'),marginTop:topPosition}}>

                    <View style={{ width:wp('100%'),height:hp('10%'), flexDirection: 'row',justifyContent:'center',alignItems:'center' }}>
                        <View style={{width:wp('85%'),justifyContent:'center',alignItems:'center'}}>
                          <TextInput
                            ref={(ref) => { this.textInputField = ref }}
                            style={[Common_Style.searchTextInput, { width: wp(80),fontSize:12 }]}
                            placeholder={`Search ${tabHeading}`}
                            onChangeText={text => this.filterData(text)}
                            value={this.state.text}
                            autoFocus={true}
                            autoCorrect={false}
                            
                            placeholderTextColor={'#6c6c6c'}>
                          </TextInput>
                        </View>
                        <View style={{width:wp('15%'),}}>
                            
                         <Text onPress={() => this.props.navigation.goBack()} 
                             style={{ fontFamily: Common_Color.fontBold,textAlign:'center', paddingTop:12,paddingBottom:12,marginRight:6 }}>
                              Cancel
                         </Text>
                          
                         
                        </View>
                        </View>

                <Tabs tabBarUnderlineStyle={{ backgroundColor: "#dd374d", }}
                  tabContainerStyle = {{shadowOpacity:0,shadowColor:'#00000000',shadowOffset:{width:0,height:0}}}
                  onChangeTab = {this.onchangeTabEvents}
                 // onScroll = {this.onchangeTabEvents}
                >
                  
                  <Tab heading="Hashtag"
                  tabStyle={{ backgroundColor: "#FFF",}}
                  activeTabStyle={{ backgroundColor: "#FFF" }}
                  textStyle={{ color: "#000000", textAlign: "center",fontSize:TitleHeader.FontSize, fontFamily: Username.Font,}}
                  inactiveTextStyle={{ color: "#000000",fontSize:TitleHeader.FontSize,fontFamily: Username.Font,}}
                  activeTextStyle={{ color: "#dd374d", fontSize:TitleHeader.FontSize, fontFamily: Username.Font,}}
                  
                  >
                    <Search ref='searchHash' {...this.props}  /> 
                  </Tab>

                  <Tab heading="Places"
                  tabStyle={{ backgroundColor: "#FFF",}}
                  activeTabStyle={{ backgroundColor: "#FFF" }}
                  textStyle={{ color: "#000000", textAlign: "center",fontSize: TitleHeader.FontSize, fontFamily: Username.Font,}}
                  inactiveTextStyle={{ color: "#000000",fontSize: TitleHeader.FontSize, fontFamily: Username.Font,}}
                  activeTextStyle={{ color: "#dd374d",fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                  
                  >
                    <Places ref='searchPlaces' {...this.props}/>
                    
                  </Tab>

                  <Tab heading="Accounts"
                  tabStyle={{ backgroundColor: "#FFF",}}
                  activeTabStyle={{ backgroundColor: "#FFF" }}
                  textStyle={{ color: "#000000", textAlign: "center",fontSize: TitleHeader.FontSize, fontFamily: Username.Font,}}
                  inactiveTextStyle={{ color: "#000000",fontSize: TitleHeader.FontSize, fontFamily: Username.Font,}}
                  activeTextStyle={{ color: "#dd374d",fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                  
                  >
                    <SearchAccounts ref='searchAcc' {...this.props} />
                  </Tab>

                </Tabs> 
                
               
                </View>
            
            </View> 

        );
    }
}

const styles = StyleSheet.create(
    {
        image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' }
    }
)

