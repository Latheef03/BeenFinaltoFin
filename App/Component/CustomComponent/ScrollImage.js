import React, { Component } from 'react';
import { View, Text, Image, PanResponder, FlatList, Animated, TouchableOpacity,Dimensions,StatusBar  } from 'react-native';
import { Container, Title, Content, Button, Header, Toast, Badge, Left, Right, Body } from 'native-base';
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Toolbar,HBTitleBack } from '../commoncomponent'
import styles from '../../styles/NewfeedImagePost';
import Common_Style from '../../Assets/Styles/Common_Style'
import ImageView from 'react-native-image-view';
const {width} = Dimensions.get('window');
import ParsedText from 'react-native-parsed-text';

export default class ScrollImage extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(prop) {
        super(prop);
        this.state = {
            data: [],
            dataWithUrl : [],
            move: true,
            imageDesc : [],
            imageIndex: 0,
            isImageViewVisible: false,
        }
      this.renderFooter = this.renderFooter.bind(this);
    }

    componentDidMount() {
        debugger
        const { navigation } = this.props;
        const Comments = navigation.getParam("data");
        const Description = Comments.desc;
        var ImageArray = Comments.data.split(',');
        console.log("Array image", ImageArray);
        console.log('the images bag',Comments);
        this.imageWithDescriptionManipulate(ImageArray,Description);
        this.setState({ data: ImageArray, imageDesc : Description })
    }

    imageWithDescriptionManipulate = (ImageArray,Description) =>{
      let imageWithUrl = []
       ImageArray.length > 0 && ImageArray.map(m=>{
          let source = {uri:serviceUrl.newsFeddStoriesUrl+m},
          title = null;
          imageWithUrl.push({source,title});
      });
      
      imageWithUrl.length > 0 && imageWithUrl.map((s,i)=>{
        Description.length > 0 && Description.map(v=>{
          // console.log('as',s,'--gh',v);
          if(v.imgId == i){
            s.title = v.desc;
            // console.log('the text len',v.desc !=null ? v.desc.length : null)
          }
          return s;
        });
        return s;
      })

      this.setState({dataWithUrl : imageWithUrl })
      console.log('imageWithUrl',imageWithUrl);
    }

    shortenText = (title) =>{
      const CHARLIMIT = 150;
      if(title == null) return null;
      // if(title.length > CHARLIMIT){
      return title;
        // }
  
    }


    renderFooter({title}) {
      return (
        <View style={sy.footer}>
          <ParsedText style={sy.footerText}
            parse={[{ pattern: /#(\w+)/, style: {color:'#35ccfe'} },] } 
          >
            {this.shortenText(title)}
          </ParsedText>
        </View>
      );
    }
  

    seperator() {
        <View style={{ width: "100%", margin: '5%' }}></View>
    }
   
    render() {
      const {isImageViewVisible,imageIndex,dataWithUrl} = this.state;
        return (
            <View style={{ width: wp('100%'), height: hp('100%'),marginTop:StatusBar.currentHeight, }}>
               
                 {/* <Content > */}

                {/* <Toolbar {...this.props} centerTitle = {' '}  /> */}
                <HBTitleBack {...this.props} title={false} />

                <View style={{height: hp('90%') }}>
                    <FlatList
                        data={this.state.data}
                        style={{}}
                        ItemSeparatorComponent={this.seperator()}
                        renderItem={({item, index}) => (
                            

                          <View style={{backgroundColor:'#6b6b6b',borderRadius:15
                          ,marginLeft:10,marginRight:10,marginTop:10,overflow: 'hidden',}}>
                            <TouchableOpacity key={index.toString()} onPress={() => {
                              this.setState({
                                imageIndex: index,
                                isImageViewVisible: true,
                              });
                            }} >
                              <Image source={{ uri: serviceUrl.newsFeddStoriesUrl + item }}
                              style={{width: wp('100%'), height: hp(30),}} />
                            </TouchableOpacity>
                          </View>  
                          

                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

              
                {/* <View style={[styles.mapDrawerOverlayLeft]} {...this._panResponder.panHandlers} /> */}
                {/* </Content> */}
                <ImageView
                glideAlways
                images={dataWithUrl}
                imageIndex={imageIndex}
                animationType="fade"
                isVisible={isImageViewVisible}
                renderFooter={this.renderFooter}
                onClose={() =>
                  this.setState({
                    isImageViewVisible: false,
                  })
                }
                onImageChange={index => {
                  console.log(index);
                }}
              />
                {/* <StatusBar hidden /> */}
               
            </View>
        )
    }
}

const sy = {
  footer: {
    
    width,
    // height: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    //rgba(0, 0, 0, 0.4)
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  footerText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
}

