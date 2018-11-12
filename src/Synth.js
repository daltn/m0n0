import React from 'react';
import Tone from 'tone';
import Knob from './Knob';
import Switch from 'react-switch';

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

const oscOutput = context.createGain();
oscOutput.gain.value = 0.8;

const masterVolume = context.createGain();
masterVolume.gain.value = 0.025;

const comp = new Tone.Compressor(-30, 8);
masterVolume.connect(comp);

comp.connect(context.destination);

const oscillators = {};
const analyser = context.createAnalyser();

class Synth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keysDown: [],
      oscWave: 'square',
      cutoff: 3500,
      res: 1,
      delay: false,
      delValue: 0.1,
      delNotes: 0.3,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCutoff = this.handleCutoff.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.draw = this.draw.bind(this);
    this.handleResonance = this.handleResonance.bind(this);
    this.delay = this.delay.bind(this);
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

  handleCutoff(e) {
    this.setState({
      cutoff: e.detail,
    });
  }

  handleResonance(e) {
    this.setState({
      res: e.detail,
    });
  }

  handleSwitch(e) {
    this.setState({
      delay: !this.state.delay,
    });
  }

  onKeyDown(e) {
    const freq = laptopKeyMap[e.keyCode];

    if (freq && this.state.keysDown.indexOf(e.keyCode) === -1) {
      const newKeysDownArr = this.state.keysDown.slice();
      newKeysDownArr.push(e.keyCode);

      this.setState({ keysDown: newKeysDownArr }, () => {
        // osc
        const osc = context.createOscillator();
        osc.frequency.value = freq;
        oscillators[freq] = osc;
        osc.type = this.state.oscWave;

        const filter = new Tone.Filter({
          type: 'lowpass',
          frequency: this.state.cutoff,
          rolloff: -24,
          Q: this.state.res,
          gain: 0,
        });

        osc.connect(filter);
        filter.connect(oscOutput);
        filter.connect(analyser);

        this.draw();
        this.delay(this.state.delay);
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

  delay(delSwitch) {
    const feedbackDelay = new Tone.FeedbackDelay(
      this.state.delNotes,
      this.state.delValue
    );
    if (delSwitch) {
      feedbackDelay.connect(masterVolume);
      oscOutput.connect(feedbackDelay);
    } else {
      feedbackDelay.dispose();
      oscOutput.connect(masterVolume);
    }
  }

  draw() {
    analyser.fftSize = 2048;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    const canvas = document.getElementById('oscilloscope');
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.fillStyle = 'green';
    requestAnimationFrame(this.draw);
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = 'rgb(56, 163, 159)';
    canvasCtx.beginPath();

    let sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * canvas.height) / 2;
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }

  render() {
    console.log(this.state.delay);
    // oscOutput.connect(masterVolume);

    return (
      <div className="synth">
        <div className="waveform">
          <label>waveform </label>
          <select name="oscWave" onChange={this.handleChange}>
            <option value="square">square</option>
            <option value="sine">sine</option>
            <option value="sawtooth">sawtooth</option>
            <option value="triangle">triangle</option>
          </select>
        </div>
        <div className="filterDiv">
          <h3>VCF</h3>
          <section className="VCF">
            <div className="knob-VCF" id="filter">
              <label className="cutoff-knob">cutoff </label>
              <Knob
                name="cutoff"
                onChange={this.handleCutoff}
                detail={this.state.cutoff}
                font_family="Roboto Mono"
                value_min={0}
                value_max={3500}
                default_value={3500}
              />
            </div>
            <div className="knob-VCF" id="resonance">
              <label className="resonance-knob">resonance</label>
              <Knob
                name="resonance"
                onChange={this.handleResonance}
                detail={this.state.Q}
                value_min={1}
                value_max={15}
                default_value={1}
              />
            </div>
          </section>
        </div>
        <label htmlFor="material-switch">
          <Switch
            checked={this.state.delay}
            onChange={this.handleSwitch}
            offColor="#D8D8D8"
            offHandleColor="#c3e3e2"
            onHandleColor="#38a39f"
            onColor="#D8D8D8"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            height={20}
            width={48}
            className="react-switch"
            id="delay"
          />
          <span> Delay on / off </span>
        </label>

        <div>
          <input
            type="range"
            id="delValue"
            name="delValue"
            min="0"
            max="0.4"
            defaultValue={this.state.delValue}
            onChange={this.handleChange}
            step="0.01"
          />
          <span>Feedback : {this.state.delValue}</span>
        </div>
        <div>
          <input
            type="range"
            id="delNotes"
            name="delNotes"
            min="0"
            max="1"
            defaultValue={this.state.delNotes}
            onChange={this.handleChange}
            step="0.01"
          />
          <span>Delay Time : {this.state.delNotes}</span>
        </div>

        <p>type to play: A = C3</p>
        <canvas id="oscilloscope" width="600" height="150" />
      </div>
    );
  }
}

export default Synth;
