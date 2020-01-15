import React, { Component } from 'react';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import Axios from 'axios';
import { DashboardModal } from '@uppy/react'
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';


class UploadModalButton extends Component {

  constructor(props) {

    super(props);

    this.state = {
      modalOpen: false
    }

    // Create & configure Uppy instance
    this.uppy = Uppy({
      id: 'uppy',
      restrictions: { 
        maxFileSize: 10000000, //10MB
        allowedFileTypes: ['image/*'],
        maxNumberOfFiles: 1,
      },
      autoProceed: false,
      debug: true
    })

    // Tell it to use their AWS S3 plugin
    // Will get pre-signed URL from server API
    this.uppy.use(AwsS3, {
      getUploadParameters (file) {
        console.log('file: ', file);
        return Axios(`/api/signurl/put/${file.name}`)
          .then(response => {
            console.log('response: ', response);
            // Return an object in the correct shape.
            return {
              method: 'PUT',
              url: response.data.url,
              fields: []
            }
          });
      }
    })
  }

  componentWillUnmount () {
    // Close the Uppy instance
    this.uppy.close()
  }

  handleOpen = () => {
    this.setState({
      modalOpen: true
    })
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  }

  render () {
    return (
      <div>
        <button onClick={this.handleOpen}>Upload some images</button>
        <DashboardModal
          uppy={this.uppy}
          closeModalOnClickOutside
          open={this.state.modalOpen}
          onRequestClose={this.handleClose}
        />
      </div>
    );
  }
}

export default UploadModalButton;