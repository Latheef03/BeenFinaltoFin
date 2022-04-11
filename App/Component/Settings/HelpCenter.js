import React, { Component } from 'react';
import { View, Text, TextInput, ImageBackground,ToastAndroid } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { toastMsg, toastMsg1 } from '../../Assets/Script/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';
import { Toolbar } from '../commoncomponent'
import Common_Style from '../../Assets/Styles/Common_Style'
import common_styles from "../../Assets/Styles/Common_Style"
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors'


export default class ReportaProblem extends Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            report: '',status:false
        }
    }



    async report() {
       // debugger;
        if (this.state.report == "" || null || undefined) {
            // toastMsg1('danger', "Please give a report")
           // ToastAndroid.show("Please give a report", ToastAndroid.LONG)
           this.setState({
            status:true
        })
        }
        else {
        var data = {
            // Userid: "5df489bd1bc2097d72dd07c2",
            Content: this.state.report,
            Userid: await AsyncStorage.getItem('userId')
        };
        const url = serviceUrl.been_url + "/ReportSetting";
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
                this.setState({ report: '' })
                toastMsg("success", "Thank you! Your report has been received and we will revert back at the earliest");
                this.props.navigation.navigate('Help')
            })
            .catch((error) => {
                //toastMsg('danger', 'Sorry..something network error.Try again please.')
            });
        }
    }
    createFolderIconView = () => <View />
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff',marginTop:0 }}>
                <Toolbar {...this.props} leftTitle="Help Center" rightImgView={this.createFolderIconView()} />
                <View style={{ marginLeft: wp('3%') }}>
                 

                    {/* <View style={{ width: wp('94%'), height: hp('30%'), borderWidth: 1, borderRadius: 10, marginTop: hp('3%'), borderColor: '#c6c6c6' }}>
                        <TextInput placeholder="Type here" placeholderTextColor="#010101" autoCorrect={false}
                  //  keyboardType="visible-password" multiline={true} onChangeText={(text) => { this.setState({ report: text }) }} style={{ marginLeft: '3%', fontSize: profilename.FontSize, fontFamily: profilename.Font }} />
                    </View> */}
                      {this.state.status == true ?
                        <View style={{ width: wp('94%'), height: hp('30%'), borderWidth: 1, borderRadius: 10, marginTop: hp('3%'), borderColor: 'red' }}>
                            <TextInput placeholder="Type here" placeholderTextColor="#010101" autoCorrect={false} autoCorrect={false}
                                keyboardType= "visible-password"
                                //  keyboardType="visible-password" 
                                multiline={true} onChangeText={(text) => { this.setState({ report: text,status:false }) }} style={{ marginLeft: '3%', fontSize: profilename.FontSize, fontFamily: profilename.Font }} />
                        </View>
                        :
                        <View style={{ width: wp('94%'), height: hp('30%'), borderWidth: 1, borderRadius: 10, marginTop: hp('3%'), borderColor: '#c6c6c6' }}>
                            <TextInput placeholder="Type here" placeholderTextColor="#010101" autoCorrect={false} autoCorrect={false}
                                //  keyboardType="visible-password"
                                //  keyboardType="visible-password" 
                                multiline={true} onChangeText={(text) => { this.setState({ report: text,status:false }) }} style={{ marginLeft: '3%', fontSize: profilename.FontSize, fontFamily: profilename.Font }} />
                        </View>
                    }
                    {/* 
                   <View  style={{width:wp('26%'),height:hp('6%'),marginTop:hp('4%'),marginLeft:wp('65%')}}>
                       <TouchableOpacity onPress={()=>{this.report()}}>
                       <ImageBackground source={require('../../Assets/Images/button.png')} style={{width:'100%',height:'100%'}} borderRadius={5} >
                           <Text style={{textAlign:'center',marginTop:'auto',marginBottom:'auto',color:'#fff',fontFamily:Common_Color.fontBold}}>Submit</Text>
                           </ImageBackground>           
                       </TouchableOpacity> 
                       </View> */}

                    <View style={[common_styles.Common_button, { width: wp(96), margin: "-1%" }]}>
                        <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                            borderRadius={10}
                        >

                            <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}
                                onPress={() => this.report()}>
                                <Text style={common_styles.Common_btn_txt}>Submit</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                </View>

            </View>
        )
    }

}