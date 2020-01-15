import React, { Component } from 'react';
import axios from 'axios';

class Gallery extends Component {

  state = {
    images: []
  }

  componentDidMount() {
    this.getAllImages();
  }

  getAllImages = () => {
    axios.get('/api/image')
      .then( response => {
        console.log('Got images', response.data);
        this.setState({
          images: response.data
        })
      })
      .catch( error => {
        console.log('Error getting images', error)
      })
  }

  render() {
    return (
      <>
        <button onClick={this.getAllImages}>Refresh</button>
        <div>
          { this.state.images.map( (url, i) => <img key={i} src={url} /> ) }
        </div>
      </>
    )
  }

}

export default Gallery;
