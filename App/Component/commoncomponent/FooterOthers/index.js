
/**
 * @implements libraries
 */
import React, { Component } from "react";
import { View, Image, Text, Platform, TouchableOpacity,TouchableHighlight } from "react-native";
import { Footer, FooterTab, } from 'native-base';
import UserProfileMemories from '../../Footer/UserProfileMemories';
import Profile from '../../UserProfile/Profile';
import style from "./styles";
const imagePath = '../../../Assets/Images/';

/**
* Represents FooterTabBar.
* @class FooterTabBar
* @extends Component
*/
class FooterTabBar1 extends Component {

    constructor(props) {
        
        super(props);
        this.state = {
            activeTab : 0,
            isActive : false 

        }
    }

    componentDidMount(){
      this.focusSubscription = this.props.navigation.addListener(
        "focus",
        () => {
          this.makeActive(this.props.tab)
        });
      
    }

    makeActive = (tab) =>{
       this.setState({
            activeTab : tab
        });

        if(tab === 1 ){
           this.memories()
         }
         else if(tab === 2){
           this.visits()
         }
         else if(tab === 3){
           this.albums()
         }
         else if(tab === 4){
           this.vlog()
         }

    };

    memories = () => {
        var data = {
          screenName: "BusinessProfile",loader:true
        }
        this.props.navigation.navigate('OtherMemories', { data: data });
      }
      visits = () => {
        this.props.navigation.navigate('OtherVisits');
      }
      albums(){
        this.props.navigation.navigate('OtherAlbums');
      }
      vlog(){
        this.props.navigation.navigate('OtherVlog')
      }



    render(){
        const {activeTab} = this.state;
        return(
            // <View style={style.mainviewStyle}>
              <View style={style.footer}>
                <TouchableOpacity style={style.bottomButtons} onPress={() => this.makeActive(1)}>
                  <Image source={activeTab == 1  ? require(imagePath + 'cameraRed.png') : require(imagePath + 'camera.png')}
                    style={{ width: 30, height:30 }} />
                  <Text style={[style.footerText, { color: activeTab == 1 ? '#ec0355' : 'black' }]}>Memories</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.bottomButtons} onPress={() => this.makeActive(2)}>
                  <Image source={activeTab == 2 ? require(imagePath + 'visitsRed.png') : require(imagePath + 'visits.png')}
                    style={{ width: 25, height:25 }}  />
                  <Text style={[style.footerText, { color: activeTab == 2 ? '#ec0355' : 'black' }]}>Visits</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.bottomButtons} onPress={() => this.makeActive(3)}>
                  <Image source={activeTab == 3? require(imagePath + 'imageRed.png') : require(imagePath + 'image.png')}
                    style={{ width:30, height: 30 }} />
                  <Text style={[style.footerText, { color: activeTab == 3 ? '#ec0355' : 'black' }]}>Albums</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.bottomButtons} onPress={() => this.makeActive(4)}>
                  <Image source={activeTab == 4 ? require(imagePath + 'videoRed.png') : require(imagePath + 'video.png')}
                    style={{ width:25, height: 25, }}
                    resizeMode={'contain'} 
                    />
                  <Text style={[style.footerText, { color: activeTab == 4 ? '#ec0355' : 'black' }]}>VLog</Text>
                </TouchableOpacity>

              </View>
          // </View>
        )
    }


}


export default FooterTabBar1;

