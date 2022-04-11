import React, { Component } from 'react';
import { View, Text, Image, ImageBackground,KeyboardAvoidingView, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Footer, FooterTab, Container, Content,} from "native-base";
import { TextInput } from 'react-native-gesture-handler';
import serviceUrl from '../../Assets/Script/Service';

export default class StoryRead extends Component {


  constructor(props) {
    super(props);
    this.state = {
      hidePassword: true,
      isfocus : false,
      password: '',
      UserName:'',
      Pic:'',
      Text:''
    }
  }
  static navigationOptions = {
    header: null,
  };


  componentDidMount = () => {
    this.focusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        setTimeout(() => {
          this.props.navigation.navigate('Map');
        },3000)
      }
    );
  }

  componentWillMount = () => {
   // debugger;
    const { navigation } = this.props;
    const Comments = navigation.getParam("data");
    this.setState({
      UserName: Comments.storiesData.UserName,
      Pic:Comments.storiesData.pic,
      Text:Comments.storiesData.text
    });
  };

     onFocusMethod = () =>{
       this.setState({
        isfocus : true
      })
    }

    keyboardDismiss = () => {
     this.setState({
         isfocus : false
     })
     Keyboard.dismiss();
    }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  render() {
     const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
    return (
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={Platform.OS === "ios" ? "padding" : null}
       >
       <Container>       
        <ImageBackground 
        source={{uri:serviceUrl.been_image_urlExplore+this.state.Pic}}
          style={{width:wp('100%'),height:hp('98% ')}}>
           <Content>
            <View style={{width:wp('100%'),height:wp('15%'),}}>
               <View style={{height:hp('4%')}}/>
               <View style={{backgroundColor:'transparent',width:wp('100%'),flexDirection:'row',height:hp('6%')}}>
                  <View style={{width:wp('3%')}}/>
                  <Image source={require('../../Assets/Images/assam.jpg')}
                  style={{width:25,height:25,borderRadius:15}}/>
                  <Text style={{marginLeft:10,color:'#000',fontSize:16}}>{this.state.UserName}</Text>
               </View>
            </View>
          </Content>

            <Text style={{justifyContent:'center',alignItems:'center',textAlign:'center',fontSize:22,color:'#000',marginTop:100}}>{this.state.Text != "" ? this.state.Text:null}</Text>
            <Footer>
              <FooterTab style={{ backgroundColor: '#fff' }}>
              <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={keyboardVerticalOffset}
                    behavior={Platform.OS === "ios" ? "padding" : null}
                  >
                 <View style={styles.SectionStyle}>
               
                    <TextInput 
                       placeholder=" Type Here"
                       onFocus = { () => this.onFocusMethod () }
                       autoCorrect={false}
                       //
                       onSubmitEditing={()=>{this.keyboardDismiss()}}
                       style={styles.textInput}/>
                       
                    <Image source={require('../../Assets/Images/send.png')}
                         style={{width:18,height:18,marginTop:10}}/>
                </View>
                </KeyboardAvoidingView>
                <Image source={require('../../Assets/Images/3dots.png')}
                  style={{width:12,height:20,margin:8,marginRight:10}}/>
              </FooterTab>
            </Footer>
                
           </ImageBackground>
        </Container>
        </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create(
  {
    container:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'grey',
      paddingHorizontal: 15,
      paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
    textInput:{width:wp('65%'),height:hp('5%'),margin:5},
    SectionStyle: {  flexDirection: "row",justifyContent:'center',marginLeft:10,height:hp('6%'), width:wp('82%'),backgroundColor:'#fff',borderRadius:15
    },
  
    textBoxBtnHolder:
    {
      position: 'relative',
      alignSelf: 'stretch',
      justifyContent: 'center'
    },

    textBox:
    {
      fontSize: 18,
      alignSelf: 'stretch',
      height: 45,
      paddingRight: 45,
      paddingLeft: 8,
      borderWidth: 1,
      paddingVertical: 0,
      borderColor: 'grey',
      borderRadius: 5
    },
    frame_layout: {
      flex: 1,
      width: wp("100%"),
      height: "100%",
      backgroundColor: "#fff",
      marginTop: "2%"
    },

    visibilityBtn:
    {
      position: 'absolute',
      right: 3,
      height: 40,
      width: 40,
      padding: 5
    },

    btnImage:
    {
      resizeMode: 'contain',
      height: '100%',
      width: '100%'
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,height:50
    }
  });
