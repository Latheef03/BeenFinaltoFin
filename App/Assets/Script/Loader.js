import React from "react";
import { Spinner, View } from "native-base";
import common_styles from "../../Assets/Styles/Common_Style"


export default class Loader extends React.Component {

  render() {
    const {size} = this.props
    return (
      <View style={common_styles.Spinner_View_style}>
        <Spinner color="#fb0143" size={size ? size : 'large'} />
      </View>
    );
  }
}
