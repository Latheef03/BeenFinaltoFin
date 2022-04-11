import React from 'react';
import { View, Animated, } from 'react-native';
import {NLStyles as nstyles} from './styles';
import {initiateChat} from '../../Chats/chatHelper'

export default class ExploreLoader extends React.Component {

  static navigationOptions = {
    header: null,
  };
  
  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(1),
    }
  }

  componentDidMount() {
    initiateChat()
    setInterval(() => {
      this.startAnimation()
    }, 1500);
  }

  componentWillUnmount(){
    clearInterval(this.startAnimation());
  }

  startAnimation = () => {

    Animated.timing(this.state.animation, {
      toValue: 0.2,
      timing: 800,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }).start();
    })

  }

  render() {
    const animatedStyle = { opacity: this.state.animation }
    return (
      <View style={nstyles.container}>
        <SubView animatedStyle={animatedStyle} />
      </View>
    );
  }
}


const SubView = ({animatedStyle}) => (
  <View style={{ flex: 1,alignItems:'center', flexDirection: 'column', marginBottom: 10 }}>
    <AnimatedView aniStyle={animatedStyle} />
    <AnimatedView aniStyle={animatedStyle} /> 
    <AnimatedView aniStyle={animatedStyle} />
    <AnimatedView aniStyle={animatedStyle} />
    <AnimatedView aniStyle={animatedStyle} />
  </View>
)

const AnimatedView = ({ aniStyle }) => (
  <Animated.View style={[aniStyle, nstyles.dataView]} >
    <View style={nstyles.circleView} />
     <View style={nstyles.parentTextView}>
        <View style={nstyles.BigText} />
        <View style={nstyles.SmallText} />
    </View>  
  </Animated.View>
)

