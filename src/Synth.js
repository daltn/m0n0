import React from 'react';

const laptopKeyMap = {
  65: 65.406, // a
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
  75: 130.812, // k
  79: 138.591, // o
  76: 146.832, // l
  80: 155.563, // p

  // 65: 'C4', // a
  // 83: 'D4', // s
  // 68: 'E4', // d
  // 70: 'F4', // f
  // 71: 'G4', // g
  // 72: 'A4', // h
  // 74: 'B4', // j
  // 75: 'C5', // k
  // 76: 'D5', // l

  // 87:  'C#4', // w
  // 69:  'D#4', // e

  // 84:  'F#4', // t
  // 89:  'G#4', // y
  // 85:  'A#4', // u

  // 79:  'C#5', // o
  // 80:  'D#5', // p
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
    };
  }

  onKeyDown(e) {
    const freq = laptopKeyMap[e.keyCode];
    console.log('......', freq);
    if (freq && this.state.keysDown.indexOf(e.keyCode) === -1) {
      const newKeysDownArr = this.state.keysDown.slice();
      newKeysDownArr.push(e.keyCode);
      this.setState({ keysDown: newKeysDownArr }, () => {
        const osc = context.createOscillator();
        osc.frequency.value = freq;
        oscillators[freq] = osc;
        osc.connect(masterVolume);

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
