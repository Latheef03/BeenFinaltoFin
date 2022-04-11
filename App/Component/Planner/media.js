import React from 'react';
import { Toolbar } from '../commoncomponent';
import { View,Text,FlatList,Image,StatusBar,TouchableOpacity } from 'react-native';
import QB from 'quickblox-react-native-sdk';
import Loader from '../../Assets/Script/Loader';
import {deviceWidth as dw , deviceHeight as dh} from '../_utils/CommonUtils';
import { Spinner} from "native-base";
import { Common_Color, TitleHeader, Username, profilename, Description, Viewmore, UnameStory, Timestamp, Searchresult } from '../../Assets/Colors';
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'
import ImageView from 'react-native-image-view';

export default class PlannerMedia extends React.Component {
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props)
        // GC = new GroupChat()
        this.state ={
            isLoading : false,
            mediaContent : [],
            imageLoader : false,
            imageView : false
        }
    }

    componentDidMount = () =>{
        const { navigation,route } = this.props;
        const mediaContent = route?.params?.data
        this.getMediaUrl(mediaContent)
        // console.log('prosp',navigation.getParam('data'))
    }

    getMediaUrl = (media) =>{
      this.setState({isLoading:true})  
      let mcnt =  media.length > 0 &&
        media.map(m=>{
            const [att] = m.attachments
            QB.content.getPrivateURL({ uid: att.id })
            .then((url) => {
              m.imageURL = url
              console.log('is coming URl',url);
            })
            .catch(function (e) { console.log('line383', e) })
            return m;
        });
       console.log('image url', mcnt);  
       this.setState({mediaContent:mcnt,isLoading:false})
    }

    imageFullView = (data, index) => {
        const { mediaContent } = this.state
        // console.log('the items',data);
        this.setState({
            imageView: true,
            imageIndex: index,
            imageViewData: mediaContent.length > 0 && mediaContent.map(d => {
                return {
                    source: {
                        uri: d.imageURL
                    },
                }
            })
        })
    }

    screenTitle = () =>(
        <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: '#010101', fontFamily: Common_Color.fontBold }}>Media</Text>
        </View>
    )

    isLoading = () =>(
       <Loader/>
    )

    ImageLoader = () =>(
        <Spinner/>
     )
     plannerText() {
        return <View style={{ flexDirection: 'column' }}>
            <Text style={{ textAlign: 'center', color: '#010101', fontSize: TitleHeader.FontSize, fontFamily: TitleHeader.Font, }}>Media</Text>
        </View>
    }
    renderRightImgdone() {
        return <View>
         
            <View style={[stylesFromToolbar.leftIconContainer, { flexDirection: 'row', }]}>
              <View >
                <Image resizeMode={'stretch'} style={{ width: 20, height: 20 }} />
              </View>
            </View>
         
    
        </View>
      }
    renderedItems = (item,index) =>{
        // console.log('all items',item);
        // console.log('dils',item.chat_dialog_id);
        // console.log('atta url',item.imageURL);
        const {imageLoader} = this.state;
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>this.imageFullView(item,index)}>
                <View key={index.toString()} style={{ ...styles.ImageView, borderRightWidth: index % 3 == 2 ? 0 : 5 }}>
                    <Image style={{ width: '100%', height: '100%' }}
                        source={{ uri: item.imageURL }}
                        onLoadStart={() => this.setState({ imageLoader: true })}
                        onLoadEnd={() => this.setState({ imageLoader: false })}
                    />
                    {imageLoader ? this.ImageLoader() : null}
                </View>
            </TouchableOpacity>
        
        )
      }

    render(){
        const { mediaContent,isLoading } = this.state
        return(
            <View style={{flex:1,marginTop:0,marginBottom:'-3%',backgroundColor:'#fff'}}>
            <StatusBar  backgroundColor="#ffffff" barStyle='dark-content' />
                <Toolbar {...this.props} centerTitleColumn={this.plannerText()}  rightImgView={this.renderRightImgdone()} />

                {isLoading ? this.isLoading()
                :
                <FlatList
                    style={{marginBottom:5}}
                    showsVerticalScrollIndicator={false}
                    data={mediaContent}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
                    numColumns={3}
                    renderItem={({ item, index }) => this.renderedItems(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                />
                }
                
                <ImageView
                    images={this.state.imageViewData}
                    imageIndex={this.state.imageIndex}
                    isVisible={this.state.imageView}
                    onClose={() => this.setState({ imageView: false })}
                />
            </View>
        )
    }
}

const styles = {
    ImageView: {
        width: dw / 3,
        height: 150,
        backgroundColor: 'grey',
        borderRightColor: '#fff',
        borderBottomWidth: 5,
        borderBottomColor: '#fff',
        overflow: 'hidden',
    }
}