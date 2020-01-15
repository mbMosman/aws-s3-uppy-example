const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

// This is for our env config, to get our api key from the .env
const dotenv = require('dotenv');
dotenv.config();
console.log('ENV variables: ', process.env);

// This will setup AWS
AWS.config.update({
  credentials: {
      accessKeyId: process.env.USER_ACCESS_KEY,
      secretAccessKey : process.env.USER_SECRET_KEY
  }, 
  region: process.env.BUCKET_REGION
});
const s3 = new AWS.S3();

/** ---------- MIDDLEWARE ---------- **/
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('build'));



/** ---------- EXPRESS ROUTES ---------- **/

// GET - signed url for upload
app.get('/api/signurl/put/:filename', (req, res) => {
  const presignedPutUrl = s3.getSignedUrl('putObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: req.params.filename, //filename
      Expires: 5 * 60 //time to expire in seconds - 5 min
  });
  console.log('sending presigned url', presignedPutUrl);
  res.send({url: presignedPutUrl})
})

// GET - signed URL to view
app.get('/api/signurl/get/:filename', (req, res) => {
  const presignedGetUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: req.params.filename, 
      Expires: 100 //time to expire in seconds - 5 min
  });
  console.log('sending presigned url', presignedGetUrl);
  res.send({url: presignedGetUrl})
})

// GET signed urls for all images in the s3 bucket
app.get('/api/image', (req, res) => {
  const params = {
    Bucket: process.env.BUCKET_NAME 
  };
  s3.listObjectsV2(params, (err, data) => {
    console.log('S3 List', data);
    // Package signed URLs for each to send back to client
    let images = []
    for (let item of data.Contents) {
      let url = s3.getSignedUrl('getObject', {
          Bucket: process.env.BUCKET_NAME,
          Key: item.Key, 
          Expires: 100 //time to expire in seconds - 5 min
      });
      images.push(url);
    }
    res.send(images);
  })
})

/** ---------- START SERVER ---------- **/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});