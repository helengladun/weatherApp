import React, { Component } from 'react';
import 'typeface-roboto';
import logo from './logo.svg';
import './App.css';
import Main from './components/Main';

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
