import React, { Component } from 'react';
import './InfoBox.css';

class InfoBox extends Component {
  render() {
    return (
      <div className="info-box">{this.props.error.status[0]}</div>
    );
  }
}

export default InfoBox;