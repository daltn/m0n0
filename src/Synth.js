import React from 'react';
import Tone from 'tone';

const laptopKeyMap = {
  65: 65.406, // a 'C2'
  87: 69.295, // w
  83: 73.416, // s
  69: 77.781, // e
  68: 82.406, // d
  70: 87.307, // f
  84: 92.498, // t
  71: 97.998, // g
  89: 103.826, // y
  72: 110.0, // h
  85: 116.54, // u
  74: 123.47, // j
  75: 130.812, // k 'C3'
  79: 138.591, // o
  76: 146.832, // l
  80: 155.563, // p
};

const context = new AudioContext();

Tone.setContext(context);

const feedbackDelay = new Tone.FeedbackDelay('8n', 0.5).toMaster();

const masterVolume = context.createGain();
masterVolume.gain.value = 0.3;
masterVolume.connect(feedbackDelay);

const oscillators = {};

class Synth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keysDown: [],
      oscWave: 'square',
      cutoff: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
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
    const freq = laptopKeyMap[e.keyCode];

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
    console.log(this.state.cutoff);
    return (
      <div className="synth">
        <h1>m0n0synth</h1>
        <div>
          <span>waveform </span>
          <select name="oscWave" onChange={this.handleChange}>
            <option value="square">square</option>
            <option value="sine">sine</option>
            <option value="sawtooth">sawtooth</option>
            <option value="triangle">triangle</option>
          </select>
        </div>
        {/* <div className="knob">
          <Knob onChange={this.handleChange} value={this.state.cutoff} />
          <label>cutoff</label>
        </div> */}

        <p>type to play: A = C3</p>
      </div>
    );
  }
}

export default Synth;
