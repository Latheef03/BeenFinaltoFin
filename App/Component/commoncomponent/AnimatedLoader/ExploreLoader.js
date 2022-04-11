import React from 'react';
import { View, Animated, } from 'react-native';
import {ELStyle as styles} from './styles';

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
      timing: 1000,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();
    })
  }

  render() {

    const animatedStyle = { opacity: this.state.animation }

    return (
      <View style={{ ...styles.container, flexDirection: 'column', }}>
        <SubView animatedStyle={animatedStyle} />
        <SubView animatedStyle={animatedStyle} />
      </View>
    );
  }
}


const SubView = ({animatedStyle}) => (
  <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginBottom: 10 }}>
    <AnimatedView aniStyle={animatedStyle} />
    <View style={{ width: '2%' }} />
    <AnimatedView aniStyle={animatedStyle} />
  </View>
)

const AnimatedView = ({ aniStyle }) => (
  <Animated.View style={[aniStyle, styles.dataView]} >
    <View style={styles.BigText} />
    <View style={styles.SmallText} />
  </Animated.View>
)

