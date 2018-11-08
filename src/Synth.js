import React from 'react';
import Knob from './Knob';

const laptopKeyMap = {
  65: 65.406, // a 'C2'
  87: 69.295, // w 'C#4'
  83: 73.416, // s
  69: 77.781, // e
  68: 82.406, // d
  70: 87.307, // f
  84: 92.498, // t
  71: 97.998, // g
  89: 103.826, // y
  72: 110.0, // h 'A2'
  85: 116.54, // u
  74: 123.47, // j
  75: 130.812, // k 'C3'
  79: 138.591, // o
  76: 146.832, // l
  80: 155.563, // p
};

const context = new AudioContext();

const masterVolume = context.createGain();
masterVolume.gain.value = 0.3;
masterVolume.connect(context.destination);

const oscillators = {};

class Synth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keysDown: [],
      oscWave: '',
      cutoff: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onKeyDown(e) {
    const freq = laptopKeyMap[e.keyCode];
    console.log('......', this.state.oscWave);
    if (freq && this.state.keysDown.indexOf(e.keyCode) === -1) {
      const newKeysDownArr = this.state.keysDown.slice();
      newKeysDownArr.push(e.keyCode);
      this.setState({ keysDown: newKeysDownArr }, () => {
        const osc = context.createOscillator();
        osc.frequency.value = freq;
        oscillators[freq] = osc;
        osc.connect(masterVolume);
        osc.type = this.state.oscWave;
        masterVolume.connect(context.destination);

        osc.start();
      });
    }
  }

  onKeyUp(e) {
    const freq = laptopKeyMap[e.keyCode];
    if (freq && this.state.keysDown.indexOf(e.keyCode) > -1) {
      const newKeysDownArr = this.state.keysDown;
      newKeysDownArr.splice(this.state.keysDown.indexOf(e.keyCode), 1);
      this.setState({ keysDown: newKeysDownArr }, () => {
        oscillators[freq].stop(context.currentTime);
      });
    }
  }

  render() {
    return (
      <div className="synth">
        <h1>m0n0synth</h1>
        <div>
          <span>Current waveform: </span>
          <select name="oscWave" onChange={this.handleChange}>
            <option value="sine">Sine</option>
            <option defaultValue="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        <div className="knob">
          <Knob onChange={this.handleChange} value={this.state.cutoff} />
          <label>cutoff</label>
        </div>

        <p>Type any of the following keys 'a s d f g h j k l'</p>
        <input
          placeholder="Type 'a s d f g h j k l'"
          onKeyDown={e => this.onKeyDown(e)}
          onKeyUp={e => this.onKeyUp(e)}
        />
      </div>
    );
  }
}

export default Synth;
