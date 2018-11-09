import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Sequencer from './Sequencer/Sequencer';
import Synth from './Synth';
import SynthSynth from './SynthSynth';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Synth} />
          <Route path="/sequencer" component={Sequencer} />
          <Route path="/legowelt" component={SynthSynth} />
        </Switch>
      </div>
    );
  }
}

export default App;
