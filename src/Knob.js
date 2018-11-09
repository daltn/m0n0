import React, { Component } from 'react';
import SvgKnob from 'svg-knob';

class Knob extends Component {
  constructor(props) {
    super(props);
  }
  handleChange = e => {
    if (this.props.onChange) this.props.onChange(e);
  };

  componentDidMount() {
    this.k = new SvgKnob(this.dom, {
      value_min: 0,
      value_max: 8000,
    });

    this.dom.addEventListener('change', this.handleChange);
  }

  shouldComponentUpdate() {
    return this.k === null;
  }

  render() {
    return <svg ref={elem => (this.dom = elem)} name="cutoff" />;
  }
}

export default Knob;
