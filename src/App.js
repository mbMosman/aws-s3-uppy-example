import React, { Component } from 'react';
import UploadModalButton from './components/UploadModalButton';
import Gallery from './components/Gallery';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Working w/ AWS S3 and Uppy</h1>
        </header>

        <h2>Upload an image</h2>
        <UploadModalButton />

        <h2>All images</h2>
        <Gallery />
      </div>
    );
  }
}

export default App;
