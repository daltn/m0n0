import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Sequencer from './Sequencer/Sequencer';
import Synth from './Synth';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Synth} />
          <Route path="/sequencer" component={Sequencer} />
        </Switch>
      </div>
    );
  }
}

export default App;
