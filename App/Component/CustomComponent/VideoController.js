import React,{Component} from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Image,Slider } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import PropTypes from 'prop-types';
import {deviceWidth as dw , deviceHeight as dh} from '../_utils/CommonUtils';

const playBut = require('../../Assets/Images/play.png');
const pauseBut = require('../../Assets/Images/pause.png');
const audioOn = require('../../Assets/Images/audio_on.png');
const audioOff = require('../../Assets/Images/audio_off.png');
const thumbCircle = require('../../Assets/Images/thumbCircle.png')
class VideoController extends Component {
   
    static navigationOptions = {
        header: null
    };
    
    constructor(props){
        super(props);
    }

    controls = () => this.props.changeControl()
    onslide = v => this.props.sliderMovingValue(v)
    VolumeControl = () => this.props.volumeControl(!this.props.volume);

    render(){ 
        const {pause,totalDuration,currentVidTime,sliderValue,
          volume,showControl} = this.props;
     return(
       
      showControl && (
      <View style={styles.parent}>
       <View style={styles.container}>
         <View style={styles.controlParentLay}>
           <View style={styles.controlsLayout}>
             <Slider
               maximumTrackTintColor='#FFF'
               minimumTrackTintColor='#FFF'
              //  thumbTintColor='#FFF'
               thumbImage={thumbCircle}
               value={sliderValue}
               onValueChange={this.onslide}
               style={{width: wp('96%'),

              //  transform: [{scaleX: 0.2}, {scaleY: .2}],
              }} 
             />
             <View style={styles.controllersView}>
               <TouchableOpacity onPress={this.controls}>
                 <View style={{ width: wp('7%') }}  >
                   <Image source={pause ? playBut : pauseBut}
                    resizeMode={'contain'}
                     style={styles.playPause}
                   />
                 </View>
               </TouchableOpacity>

               <View style={styles.timer}>
                 <Text style={{ color: '#FFF', fontSize: 12 }}>
                   {currentVidTime} / {totalDuration}
                 </Text>
               </View>

               <TouchableOpacity style={{ justifyContent: 'center' }} 
                 onPress={this.VolumeControl}>
                 <View style={styles.audio}>
                   <Image source={volume ? audioOff : audioOn}
                    resizeMode={'contain'}
                     style={{ width: 18, height: 18, }}
                   />
                 </View>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </View>
      </View> 
      )
        
    )}
}

VideoController.propTypes = {
  showControl :PropTypes.bool.isRequired,
  pause : PropTypes.bool.isRequired,
  changeControl : PropTypes.func.isRequired,
  totalDuration : PropTypes.string.isRequired,
  currentVidTime : PropTypes.string.isRequired,
  sliderValue : PropTypes.number.isRequired,
  sliderMovingValue : PropTypes.func.isRequired,
  volumeControl : PropTypes.func.isRequired,
  volume : PropTypes.bool.isRequired,
}

/*customized throw error */
// VideoController.propTypes = {
//   pause(props, propName, componentName) {
//     if(props[propName] == undefined){
//       console.error('asdsadasdsa');
//     }
//     if (typeof props[propName] !== 'string') {
//       console.log('does it work?')
//       return new Error(
//         `Hey, you should pass a string for ${propName} in ${componentName} but you passed a ${typeof props[propName]}!`
//       )
//     }
//   },
// }

export default VideoController;

const styles={
  parent:{
    flex:1,
    ...StyleSheet.absoluteFillObject
  },
 container:{
       width:wp('100%'),
       height:hp('12%'), 
       backgroundColor:'#00000070',
       bottom:0,
       position: 'absolute',
  },
  controlParentLay : {
    width: wp('100%'),
    height: hp('8%'),
    flexDirection: 'column',
    marginTop: 8, 
    flex: 1
  },
  controlsLayout :{
        width: wp('95%') , 
        justifyContent: 'center',
  },
  controllersView:{
    flexDirection: 'row', 
    width: wp('90%'),
    marginLeft: 10,
  },
  playPause:{
    width: 24, 
    height: 24
  },
  timer:{
    width: wp('73%'), 
    alignItems: 'flex-end', 
    justifyContent: 'center',
  },
  audio:{ 
    width: wp('10%'), 
    alignItems: 'flex-end',
  }
  

}