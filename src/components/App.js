import React, { Component } from 'react';
import 'typeface-roboto';
import '../styles/App.css';
import Main from '../containers/Main';

class App extends Component {
  render() {
    return (
      <div className="mainpage">
        <Main />
      </div>
    );
  }
}

export default App;
