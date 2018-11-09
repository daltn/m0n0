import React, { Component } from 'react';
import Tone from 'tone';

export default class ToneSynth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oscillator: {
        type: 'square',
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.2,
        release: 0.9,
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    // this.onKeyUp = this.onKeyUp.bind(this);saass
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onKeyDown(e) {
    const synth = new Tone.Synth(this.state).toMaster();
    synth.triggerAttack('D2', '2');
  }

  // onKeyUp(e) {
  //   synth.triggerRelease();
  // }

  //start the note "D3" one second from now

  render() {
    return (
      <div className="synth">
        <h1>TONEsynth</h1>
        <div>
          <span>waveform </span>
          <select name="oscWave" onChange={this.handleChange}>
            <option value="square">square</option>
            <option value="sine">sine</option>
            <option value="sawtooth">sawtooth</option>
            <option value="triangle">triangle</option>
          </select>
        </div>

        <p>type to play: A = C3</p>
      </div>
    );
  }
}
