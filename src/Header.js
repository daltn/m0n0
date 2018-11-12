import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keysDown: [],
    };
  }
  render() {
    return (
      <a href="https://github.com/daltn/m0n0">
        <header>
          <h1>m0n0synth</h1>
        </header>
      </a>
    );
  }
}
