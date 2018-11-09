import React, { Component } from 'react';
import Iframe from 'react-iframe';

export default class SynthSynth extends Component {
  render() {
    return (
      <Iframe
        url="https://www.youtube.com/embed/P_9_ZDpazd4"
        width="840px"
        height="472.5px"
        display="initial"
        position="relative"
        allowFullScreen
      />
    );
  }
}
