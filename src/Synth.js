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

const masterVolume = context.createGain();
masterVolume.gain.value = 0.2;
masterVolume.connect(context.destination);

const oscillators = {};
const analyser = context.createAnalyser();

class Synth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keysDown: [],
      oscWave: 'square',
      cutoff: 0,
      delay: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCutoff = this.handleCutoff.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.draw = this.draw.bind(this);
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

  handleSwitch(e) {
    console.log(e);
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

        // cutoff
        if (this.state.cutoff === 0) {
          osc.connect(masterVolume);
        } else {
          const filter = new Tone.Filter({
            type: 'lowpass',
            frequency: this.state.cutoff,
            rolloff: -24,
            Q: 1,
            gain: 0,
          });

          osc.connect(filter);
          filter.connect(masterVolume);
        }
        osc.connect(analyser);
        analyser.connect(masterVolume);

        // analyzer

        this.draw();

        // delay on / off

        if (this.state.delay) {
          const feedbackDelay = new Tone.FeedbackDelay('8n', 0.3);
          masterVolume.connect(feedbackDelay);
          const verb = new Tone.Freeverb();
          verb.dampening.value = 2000;
          feedbackDelay.connect(verb).toMaster();
        } else {
          masterVolume.connect(context.destination);
        }

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

    var sliceWidth = (canvas.width * 1.0) / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * canvas.height) / 2;

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
        <div className="knob">
          <span className="knob">cutoff</span>
          <Knob onChange={this.handleCutoff} detail={this.state.cutoff} />
        </div>
        <label htmlFor="material-switch">
          <Switch
            checked={this.state.delay}
            onChange={this.handleSwitch}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
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

        <p>type to play: A = C3</p>
        <canvas id="oscilloscope" width="600" height="150" />
      </div>
    );
  }
}

export default Synth;
