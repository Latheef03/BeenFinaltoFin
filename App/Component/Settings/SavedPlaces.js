
import React, { Component } from 'react'
import {
    Text, StatusBar, StyleSheet, Image, Animated, Button, ImageBackground,
    View, ToastAndroid, ActivityIndicator, TouchableOpacity,FlatList
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import { TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import serviceUrl from '../../Assets/Script/Service';
import Common_Style from '../../Assets/Styles/Common_Style'
import {Common_Color, Username} from '../../Assets/Colors'
import {Toolbar} from '../commoncomponent';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import { toastMsg1,toastMsg } from '../../Assets/Script/Helper';
import { SelectedFilters } from '../NewsFeed/Filter_Edit_utils'
const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

export default class SavedPlace extends Component {

    static navigationOptions = {
        header: null
 
    }

    constructor(props){
        super(props)
        this.state = { 
          masterData:[], 
          savedPostData:[], 
          isModalVisible: false, 
          modaltext: '', 
          savedpostimages1: '', 
          savedpostimages2: '', 
          savedpostimages3: '', 
          savedpostimages4: '' , 
          folderdata:'',
          inputError : false,
          creatingData : false
        }
    }

    

    // componentWillMount() {
    //     this.savedPlace();
    // }
    componentDidMount = async () => {
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
                this.savedPlace();
            }
        );
    };

    savedPlace = async () => {
        debugger
        // debugger;
        var data = {
            Userid: await AsyncStorage.getItem('userId') 
       
        };
        const url = serviceUrl.been_url1 + '/GetSavedplace';
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) =>
            {
            if(response.ok){
                return (response.json())
            }throw new Error ('Request failed!')
        
           },networkError=>{console.log(networkError)}
            )
            .then((responseJson) => {
                console.log('saved post responses', responseJson);
                if (responseJson && responseJson.status == 'True') {
                    // console.log('hi', responseJson)
                    let images=responseJson.result;
                    
                    this.setState({
                        savedPostData: responseJson.result,
                        masterData: responseJson.CreateSavedPlaces
                    })
                  
                }
                 
            })
            .catch((error) => {
                console.log(error);
            });
    };

    renderSavedPosts = () => {
        debugger
        const { savedPostData } = this.state;
        // console.log('images of post ',savedPostData)
       return savedPostData.length > 0 && savedPostData.map((data,ind)=>{
        const event = data.Events && data.Events[0] || {}
        const scale = event.crops && event.crops.scale ? event.crops.scale : 1.0001;
        const trX = event.crops && event.crops.positionX && scale >= 1.01 ? event.crops.positionX : 0;
        const trY = event.crops && event.crops.positionY && scale >= 1.01 ? event.crops.positionY : 0;   
            //let img = data.PostedImage.includes(',') ? data.PostedImage.split(',') : data.PostedImage;
            //let image = img.constructor == Array ? img[0] : img;
            let img =  data.PostedImage.split(',')[0];
            let image = img;
           
            //  console.log('images from saved posts',image)
           if(ind == 0){
                return(
                  <View key={`id${ind}`}>
                    <SelectedFilters images={event}
                        childrenComponent={(
                    <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                    source={{
                        uri: serviceUrl.newsFeddStoriesUrl + image
                    }}></Image>)}/>
                  </View>
                ) 
           }else if(ind <= 1){
            
            if(ind == 0  ){
                return(
                  <View style={{width:'50%',height:'100%',overflow: 'hidden',
                    left:0,position:'absolute',}}>
                       <SelectedFilters images={event}
                        childrenComponent={(
                    <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                    source={{
                        uri:serviceUrl.newsFeddStoriesUrl + image
                        
                    }}></Image>)}/>
                  </View>
                ) 
                }
            if(ind == 1){
                    return(
                        <View style={{width:'50%',height:'100%',overflow: 'hidden',flexDirection:'column',
                          right:0,position:'absolute',}}>
                              <SelectedFilters images={event}
                        childrenComponent={(
                          <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                          source={{
                              uri: serviceUrl.newsFeddStoriesUrl + image
                              
                          }}></Image>)}/>
                        </View>
                      )   
                }
           }else if(ind <= 2){
            
            if(ind == 0  ){
               return(
               
                 <View style={{width:'50%',height:'50%',overflow: 'hidden',
                   left:0,position:'absolute',}}>
                       <SelectedFilters images={event}
                        childrenComponent={(
                   <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                   source={{
                       uri:serviceUrl.newsFeddStoriesUrl + image
                       
                   }}></Image>)}/>
                 </View>
               ) 
               }
           if(ind == 1){
                   return(
                       <View style={{width:'50%',height:'50%',overflow: 'hidden',flexDirection:'column',
                         right:0,top:0,position:'absolute',}}>
                             <SelectedFilters images={event}
                        childrenComponent={(
                         <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                         source={{
                             uri: serviceUrl.newsFeddStoriesUrl + image
                             
                         }}></Image>)}/>
                       </View>
                     )   
               }
           if(ind == 2){
                   return(
               
                       <View style={{width:'100%',height:'50%',overflow: 'hidden',flexDirection:'column',
                         bottom:0,position:'absolute',}}>
                          <SelectedFilters images={event}
                        childrenComponent={(
                           <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                         source={{
                             uri: serviceUrl.newsFeddStoriesUrl + image
                             
                         }}></Image>)}/>
                       </View>
                     )   
               }
           }else if(ind <= 3){
               
            if(ind == 0  ){
            return(
            
              <View style={{width:'50%',height:'50%',overflow: 'hidden',
                left:0,position:'absolute',}}>
                    <SelectedFilters images={event}
                        childrenComponent={(
                <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                source={{ uri: serviceUrl.newsFeddStoriesUrl + image}}></Image>)}/>
              </View>
            ) 
            }
            if(ind == 1){
                return(
                    <View style={{width:'50%',height:'50%',overflow: 'hidden',flexDirection:'column',
                      left:0,bottom:0,position:'absolute',}}>
                        <SelectedFilters images={event}
                        childrenComponent={(
                        <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                      source={{
                          uri: serviceUrl.newsFeddStoriesUrl + image
                          
                      }}></Image>)}/>
                    </View>
                  )   
            }
            if(ind == 2){
                return(
            
                    <View style={{width:'50%',height:'50%',overflow: 'hidden',flexDirection:'column',
                      right:0,position:'absolute',}}>
                          <SelectedFilters images={event}
                        childrenComponent={(
                      <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                      source={{  uri: serviceUrl.newsFeddStoriesUrl+ image

                      }}></Image>)}/>
                    </View>
                  )   
            }
            if(ind == 3){
                return(
            
                    <View style={{width:'50%',height:'50%',overflow: 'hidden',flexDirection:'column',
                      right:0,bottom:0,position:'absolute',}}>
                       <SelectedFilters images={event}
                        childrenComponent={(
                           <Image style={{width:'100%',height:'100%'}} resizeMode="cover"
                              source={{ uri: serviceUrl.newsFeddStoriesUrl + image
                      }}></Image>)}/>
                    </View>
                  )   
            }
        }
           
        })
      
    };  

    onchangeTextEvents = text =>{

        this.setState({ modaltext: text,inputError:false});
        if(text == ''){
            this.setState({ inputError: true });
            return false;
        }
        
    }

    create = async () => {
        const { modaltext } = this.state;
        if (modaltext == '') {
            this.setState({
                inputError: true
            });
            return false;
        }

        if(modaltext.length > 15){
          toastMsg1('danger', "Enter 15 characters")
           // ToastAndroid.show('Enter 15 characters',ToastAndroid.SHORT);
            return false;
        }

        var data = {
            // Userid: "5df489bd1bc2097d72dd07c2",
            Foldername:modaltext,
            Userid: await AsyncStorage.getItem('userId') 
        };
        const url = serviceUrl.been_url1 + '/Createsavedplaces';
        this.setState({creatingData : true})
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
            },
            body: JSON.stringify(data)
        })
            .then((response) =>
            {
            if(response.ok){
                return (response.json())
            }throw new Error ('Request failed!')
        
           },networkError=>{console.log(networkError)}
            )
            .then((responseJson) => {
                if (responseJson.status == 'True') {

                    this.setState({
                      modaltext: '',
                      folderdata:responseJson.FolderId,
                      isModalVisible : false,
                      creatingData : false
                    });
                    this.savedPlace()
                }else{
                    this.setState({
                        isModalVisible : false,
                        creatingData : false
                      })
                }
               
            })
            .catch((error) => {
                this.setState({
                    isModalVisible : false,
                    creatingData : false
                  })
                console.log(error);
            });
    };


    getStoriesdatapass()
    {  
        this.setState({ isModalVisible: false })
        var data={savedPostData:this.state.savedPostData, folderdata:this.state.folderdata}
        this.props.navigation.navigate('SavedFolderPlace',{data:data })
    }
    
    folderDataPass(item){
      const {savedPostData,masterData} = this.state;
      let data = item;
      data.SavedAllPlaces = savedPostData;
      console.log('the data.SavedAllPlaces',data)
      this.props.navigation.navigate('savedPlaceList',{data:data })
    }

    createFolderIconView = () => {
      const { savedPostData } = this.state;
      if(savedPostData.length == 0){
        return <View />
      }
      if (savedPostData.length > 0) {
        return (
          <View style={{}}>
            <TouchableOpacity hitSlop={Common_Style.touchView} onPress={() => this.setState({ isModalVisible: true, inputError: false, modaltext: '' })}>
              <Text style={{ fontSize: 24,}}> + </Text>
            </TouchableOpacity>
          </View>
          // <View style={[stylesFromToolbar.leftIconContainer,]}>
          //   <TouchableOpacity hitSlop={Common_Style.touchView} onPress={() => this.setState({ isModalVisible: true, inputError: false, modaltext: '' })}>
          //     <Text style={{ fontSize: 10, color: '#000', marginRight: 5, marginTop: 0 }}>+</Text>
          //   </TouchableOpacity>
          // </View>
        )
      }
    }

    render() {
        const {creatingData,savedPostData} = this.state
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>

                {/* header */}
                <View style={{justifyContent:'center',alignItems:'center'}}> 
                  <Toolbar {...this.props} leftTitle='Saved Places' rightImgView={this.createFolderIconView()} />
                </View>
                {/* sign to all places */}
                <View style={{ alignItems: 'center',}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                       savedPostData.length > 0 ? this.props.navigation.navigate('allplaces',{data:savedPostData})
                       :null 
                    }}>
                       <View style={{ width: wp('84%'), height: hp('25%'),backgroundColor: '#c1c1c1', 
                          borderRadius:15,margin:10,overflow:'hidden', }}>
                              {this.renderSavedPosts()}
                       </View>
                    </TouchableOpacity>
                </View>
                
                <View style={{width:wp('100%'),height:hp('100%'),flexDirection:'column',}}>
                  <View style={{ marginTop: '2%',width:'84%',alignSelf:'center', }}>
                     <Text style={styles.textcolor}>All Places</Text>
                  </View>

                  <View style={{width:wp('84%'),height:hp('60%'), alignSelf:'center', marginTop: '1%',}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={this.state.masterData}
                      renderItem={({ item,index }) => (
                      <View key={`id${index}`} style={styles.createdImagesView}>
                          {item.saveplaces.length > 0 ? (
                             <TouchableOpacity onPress={() => { this.folderDataPass(item) }} >
                              <View>
                                 {item.saveplaces[0].PostedImage.indexOf(".mp4") != -1 ? (
                                   <View style={{width:wp('40%'),height:hp('12%'),backgroundColor:'#c1c1c1',
                                   borderRadius:8,overflow: 'hidden',}} >
                                 <Image style={{ width: '100%',height: '100%', borderRadius: 5, backgroundColor: "#c1c1c1", }}
                                    resizeMode="cover"
                                    source={require("../../Assets/Images/videoCont.png")}
                                  />
                                  </View>
                                 ) : (
                                  <View style={{width:wp('40%'),height:hp('12%'),backgroundColor:'#c1c1c1',
                                  borderRadius:8,overflow: 'hidden',}} >
                                 <Image style={{ width: '100%',height: '100%',borderRadius: 5,backgroundColor: "#c1c1c1",}}
                                    resizeMode="cover"
                                    source={{uri:serviceUrl.newsFeddStoriesUrl + item.saveplaces[0].PostedImage.split(","), }} />
                                    </View>
                                )}
                             
                                <Text style={[styles.textcolor,{ textAlign: "center", marginTop: 10, }, ]} >
                                   {item.SavedName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                           ) : (
                           <TouchableOpacity onPress={() => { this.folderDataPass(item) }} >
                            <View>
                            <View style={{width:wp('40%'),height:hp('12%'),backgroundColor:'#c1c1c1',
                                     borderRadius:8,overflow: 'hidden',}} />
                                {/* <Image style={{width: 160, height: 100, borderRadius: 5, backgroundColor: "#c1c1c1", }}
                                resizeMode="cover"
                                /> */}
                                <Text style={[styles.textcolor,{ textAlign: "center", marginTop: 10, }, ]} >
                                    {item.SavedName}
                                    </Text>
                            </View>
                            </TouchableOpacity>
                           )}
                          
                         </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    />
                </View>
            </View>  
           

        <Modal
         isVisible={this.state.isModalVisible} onBackdropPress={() =>this.setState({ isModalVisible: false })}
         onBackButtonPress={() =>  this.setState({ isModalVisible: false })
         } >

        <View style={[Common_Style.modalContent, { borderRadius: 10, backgroundColor: 'rgba(10,10,10,0.70)', height: '150%',width:"180%",margin:-30 }]} >
                        <StatusBar backgroundColor='rgba(10,10,10,0.70)' barStyle="light-content" />
                        <View style={{left:-100}}>
            <View style={{ width: wp(89), marginTop: 5, }}>

              <TextInput
                label="Type here"
                mode="outlined"
                // value={this.state.is_Valid_mail}
                onChangeText={(val) => {
                    this.onchangeTextEvents(val)
                }}
                autoCorrect={false}
                //keyboardType="visible-password"
                error = {this.state.inputError}
                // style={{ width: '98%', paddingLeft: 8, margin: 5, borderWidth: .7, borderColor: 'grey', borderRadius: 12 }}
                style={[Common_Style.textInputSignUp, { width: '98%' }]}
                selectionColor={'#f0275d'}
                theme={{ roundness: 10, colors: { placeholder: '#000', text: '#000', primary: '#000', underlineColor: '#000', fontSize: 16, paddingLeft: 5 } }} />

            </View>

            {this.state.inputError && (
                <View style={{ marginLeft: 10,width:'98%', }}>
                    <Text style={{ color: "red" }}>
                      <Text style={{ fontWeight: "bold" }}>*</Text>
                         Cannot leave empty
                      </Text>
                </View>
             )}

            <View style={[Common_Style.Common_button, { width: wp(88), marginTop: 10 }]}>

              <ImageBackground source={require('../../Assets/Images/button.png')} style={{ width: '100%', height: '100%' }}
                borderRadius={10}
              >
                <TouchableOpacity onPress={() => { creatingData ? null : this.create() }}>
                  <Text onPress={() => { creatingData ? null : this.create() }} style={[Common_Style.Common_btn_txt, { marginTop: 12 }]}> {creatingData ? 'Creating...' : 'Create'} </Text>
                </TouchableOpacity>
              </ImageBackground>

            </View>
            <View style={[Common_Style.Common_button, { width: wp(95), marginTop: 20, marginBottom: -10 }]}>
            <TouchableOpacity style={{ height: hp('5.7%') }} onPress={() =>
                                    this.setState({ isModalVisible: false })
                                } >

                <Text onPress={() => this.setState({ isModalVisible: false })} style={[Common_Style.Common_btn_txt, { color: '#fff', marginLeft: -25 }]}>Cancel</Text>
              </TouchableOpacity>

            </View>
            </View>
          </View>
        </Modal>
      </View>
     );
    }
}


const styles = StyleSheet.create({

    textcolor: {  color: '#010101',fontFamily:Username.Font,fontSize:Username.FontSize },
    modaltext: { width: wp('80%'),height: hp('7%'), marginTop: '5%',borderWidth: 1,alignSelf: 'center',borderRadius: 12,borderColor: '#9f9f9f', paddingLeft: 20,fontSize:Username.FontSize,fontFamily:Username.Font},
    modalsImage: {width: wp('30%'),height: hp('6%'),},
    modalView: {width: wp('90%'),height: 'auto',backgroundColor: '#fff', borderRadius: 7},
    cancelbtn: {width: wp('30%'),height: hp('6%'),borderWidth: 1,borderRadius: 7,marginLeft: '18%',borderColor: '#9f9f9f'},
    margins: { marginLeft: 'auto',marginRight: 'auto',marginTop: 'auto',marginBottom: 'auto',fontFamily:Common_Color.fontBold},
    text: {color: '#fff' },
    savedImages: {width: wp(50), height: hp(15),},
    createdImages: {width: wp(45), height: hp(15),},
    createdImagesView: {
        width: wp('42%'), 
        height: hp('18%'), 
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor:'red'
    }
})



