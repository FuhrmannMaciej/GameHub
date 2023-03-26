import React, { Component } from 'react';
import { Entypo } from '@expo/vector-icons';
import colors from '../colors';

class EntypoIcon extends Component {
  render() {
    return (
      <Entypo
        name={this.props.name}
        size={this.props.size}
        color={this.props.color}
        style={this.props.style}
      />
    );
  }
}

EntypoIcon.defaultProps = {
    name: 'home',
    size: 28,
    color: colors.darkGrey,
    style: {},
};

export default EntypoIcon;