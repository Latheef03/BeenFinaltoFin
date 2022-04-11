import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

const HASView = (props) => {
  const { children, hide,  } = props;
  if (hide) {
    return null;
  }
  return (
    <View {...this.props} >
      { children }
    </View>
  );
};

HASView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
    ])),
  ]).isRequired,
//   style: View.propTypes.style,
  hide: PropTypes.bool,
};

export default HASView;