import React, { Component } from 'react';
import UploadModalButton from './components/UploadModalButton';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>AWS Image Upload</h1>
        </header>

        <p>Testing...</p>
        <UploadModalButton />
      </div>
    );
  }
}

export default App;
