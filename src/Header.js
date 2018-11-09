import React from 'react';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keysDown: [],
    };
  }
  render() {
    return (
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Synth</Link>
            </li>
            <li>
              <Link to="/sequencer">Sequencer</Link>
            </li>
            <li>
              <Link to="/legowelt">About</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
