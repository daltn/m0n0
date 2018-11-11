import React, { Component } from 'react';
import SvgKnob from 'svg-knob';

class Knob extends Component {
  handleChange = e => {
    if (this.props.onChange) this.props.onChange(e);
  };

  componentDidMount() {
    this.k = new SvgKnob(this.dom, {
      value_min: this.props.value_min,
      value_max: this.props.value_max,
      default_value: this.props.default_value,
      font_family: 'Roboto Mono',
      track_color: '#38a39f',
      track_color_init: '#38a39f',
    });

    this.dom.addEventListener('change', this.handleChange);
  }

  shouldComponentUpdate() {
    return this.k === null;
  }

  render() {
    return <svg ref={elem => (this.dom = elem)} />;
  }
}

export default Knob;
