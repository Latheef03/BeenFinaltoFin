import React, { Component } from 'react';
import {
  View,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';

class MotionLabelTextInput extends Component {
  state = {
    isFocused: false,
  };
  _animatedIsFocused = new Animated.Value(0);

  componentDidMount() {
    // this._animatedIsFocused = new Animated.Value(0);
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 16,
      padding: 8,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#000'],
      }),
      backgroundColor : this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['white', 'yellow'],
      })
    };
    return (
      <View style={{ paddingTop: 18,backgroundColor:'#FFF' }}>
        <Animated.Text style={{...labelStyle,backgroundColor:'#FFF',zIndex:1}}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={{ height: 50, fontSize: 20, color: '#000', width:'100%',borderWidth:1,borderColor:'#000',
            borderRadius : 25 }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}

export default MotionLabelTextInput;

// export default class App extends Component {
//   state = {
//     value: '',
//   };

//   handleTextChange = (newText) => this.setState({ value: newText });

//   render() {
//     return (
//       <View style={{ flex: 1, padding: 30, backgroundColor: '#f5fcff' }}>
//         <StatusBar hidden />
//         <FloatingLabelInput
//           label="Email"
//           value={this.state.value}
//           onChangeText={this.handleTextChange}
//         />
//       </View>
//     );
//   }
// }
