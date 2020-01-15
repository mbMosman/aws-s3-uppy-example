const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const axios = require('axios');
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

app.get('/api/signurl/put/:filename', (req, res) => {
  const presignedPutUrl = s3.getSignedUrl('putObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: req.params.filename, //filename
      Expires: 5 * 60 //time to expire in seconds - 5 min
  });
  console.log('sending presigned url', presignedPutUrl);
  res.send({url: presignedPutUrl})
})

app.get('/api/signurl/get/:filename', (req, res) => {
  const presignedGetUrl = s3.getSignedUrl('getObject', {
      Bucket: 'presignedurldemo',
      Key: 'image.jpg', //filename
      Expires: 100 //time to expire in seconds - 5 min
  });
  console.log('sending presigned url', presignedGetUrl);
  res.send({url: presignedGetUrl})
})

/** ---------- START SERVER ---------- **/
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});