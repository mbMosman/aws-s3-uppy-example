# Upload to AWS S3 from React

This is a simple React project to spike out doing a secure AWS image upload and access.

## Things I'm exploring w/ this code

- Configuring security on an AWS bucket w/ an IAM user
- Uploading to AWS directly from the brower w/ pre-signed URLs
- Displaying images uploaded to the AWS bucket. 


## AWS Setup

To work through this, you need an AWS account, fortunately they'll let you play around with stuff for free to learn. (Super smart on their part.)

To get things setup, I used this resource from Amazon: https://docs.aws.amazon.com/AmazonS3/latest/dev/example-walkthroughs-managing-access-example1.html

I'll include notes below on some of the steps from my own walkthrough:

- When creating the AccountAdmin, it says to give it administrator or full access. To do this, on the 2nd screen of the "Add User" process where you "Set Permissions", I used the button to "Attach existing policies directly", then selected the AdministratorAccess policy from the list displayed. I repeated this for the "Set permission boundary". __Make sure to record all the information, including the access URL, for the new user. The secret key isn't available again.__

- AWS CLI - the amazon docs tell you to do this w/ pip if you're on a Mac. I just used Homebrew: `brew install awscli`

- When configuring the CLI, make sure to setup a specific profile for each user. The walkthrough has you do this for AccountAdmin, but it is really the next account *user* account that is really needed, so it's fine to skip the profile for the admin.

- While setting up your bucket, note the region you select. You can get the region needed in the code using this table: https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region

- For the 2nd *user* account, I gave that account "programmatic access" only, no access to the management console. When you "Set Permissions", use the button to "Attach existing policies directly", then click "Create Policy". Switch to JSON view and paste in the example. __You will need to update the bucket ARN.__  I got the bucket ARN by opening another window & going to the bucket in S3, then clicked on the "Permissions" tab and "Bucket Policy". The ARN was shown there. (You'll also need this open to update the bucket policy, where you need the new user ARN.) __Once the policy is created, don't forget to attach it to the user!__ I set no permission boundary for this user.

- Once the user is created, you can update the bucket policy using the example from the article. __You must update both the bucket ARN & the user ARN in two places.__

- To get things working through this app vs the CLI, I also needed to setup a CORS configuration on the bucket. 

The example below would work for something deployed, but while testing locally I set the AllowedOrigin to `*` to allow access from any origin.
```
<CORSConfiguration>
 <CORSRule>
   <AllowedOrigin>http://www.example1.com</AllowedOrigin>
   
   <AllowedMethod>GET</AllowedMethod>
   <AllowedMethod>PUT</AllowedMethod>
   <AllowedMethod>POST</AllowedMethod>
   <AllowedMethod>DELETE</AllowedMethod>

   <AllowedHeader>*</AllowedHeader>
 </CORSRule>
</CORSConfiguration>
```

- At this point I was able to setup a profile for the user on the CLI and upload a test image through the CLI. 

## Image Upload from App

So, instead of trying to build something myself to allow the user to select a file to upload, I did a quick web search for an existing React Component. I was hoping for one that would allow drag-and-drop, as well as browsing to select a file. The first thing I came across was [`react-dropzone`](https://react-dropzone.js.org/), so I gave it a go and realized I was going to be doing a lot of work to make it look good and work the way I wanted.

Instead I decided to try out [uppy](https://uppy.io). They have some nice documentation & examples too: 
 - https://uppy.io/docs/aws-s3/
 - https://uppy.io/docs/aws-s3/#example-presigned-url

