import React, { Component } from 'react';
import {View,Text,Image } from 'react-native';
import { Body, Tabs, Tab } from 'native-base';
import { TitleHeader, Username } from '../../Assets/Colors'
import { Toolbar,Search } from '../commoncomponent'
import Followers from '../CustomComponent/Followers'
import Followings from '../CustomComponent/Followings'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
export default class extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            follow_Count:0,
            following_Count:0
        }
    }

    componentWillMount(){
        debugger
        const Comments = this.props.route.params.data
        if (Comments != undefined) {
            this.setState({
                follow_Count: Comments.followerCount,
                following_Count:Comments.followingCount
            })
        }
    }
    title(){
        return <View style={{backgroundColor:'#fff'}}>
            <Text style={{fontSize:14,}}>{this.state.follow_Count} Follower</Text>
        </View>
    }

    titleFollwing(){
        return <View style={{backgroundColor:'#fff'}}>
        <Text style={{fontSize:14,}}>{this.state.following_Count} Following</Text>
    </View>
    }

    renderRightImgdone() {
        return <View style={[stylesFromToolbar.leftIconContainer]}> 
            <View >
                <Image  style={{ width: 20, height: 20 }} />
              </View>
         </View>    
      }

    render() {
        return (
            <View style={{flex:1,marginTop:0,backgroundColor:'#FFF'}}>
             <Toolbar {...this.props} centerTitle="" rightImgView={this.renderRightImgdone()} />
            <Tabs tabBarUnderlineStyle={{ backgroundColor: "#dd374d", }}
                onChangeTab={this.onchangeTabEvents} tabContainerStyle={{elevation: 0,}} >
                <Tab heading={this.title()}
                    tabStyle={{ backgroundColor: "#FFF", }}
                    activeTabStyle={{ backgroundColor: "#FFF" }}
                    textStyle={{ color: "#000000", textAlign: "center", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                    inactiveTextStyle={{ color: "#000000", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                    activeTextStyle={{ color: "#dd374d", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                >
                <Followers navigation={this.props.navigation}/>
                </Tab>

                <Tab heading={this.titleFollwing()}
                    tabStyle={{ backgroundColor: "#FFF", }}
                    activeTabStyle={{ backgroundColor: "#FFF" }}
                    textStyle={{ color: "#000000", textAlign: "center", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                    inactiveTextStyle={{ color: "#000000", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                    activeTextStyle={{ color: "#dd374d", fontSize: TitleHeader.FontSize, fontFamily: Username.Font, }}
                >
                     <Followings navigation={this.props.navigation}/>
                </Tab>

            </Tabs>

            
          
            </View>
        )
    }
}
