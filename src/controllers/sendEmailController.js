const nodemailer = require('nodemailer');
const { google } = require('googleapis');


/* Creating constants for credentials */
const CLIENT_ID = '917256731893-qcvtl2rg5vrji61c9kemehdp7j75i6ev.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04mkG8eoT4fjLCgYIARAAGAQSNwF-L9IrmJ-7ClNey8X5g9uoGIEyodSDIWZJBjohaxunduEha_zXHzgSSesbWHdwF5-X-ghlLkg';


/* Creating an oauth2 client */
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/* function to create the nodemailer transport and send the email */
async function sendMail(userEmail, emailSubject, emailText, emailHTML) {
   try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = await nodemailer.createTransport({
         service: 'gmail',
         auth: {
            type: 'OAuth2',
            user: 'contactegona@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
         }
      });

      const mailOptions = {
         from: 'Contact@Egona <contactegona@gmail.com>',
         to: userEmail,
         subject: emailSubject,
         text: emailText,
         html: emailHTML
      }
   
      const emailSent = await transport.sendMail(mailOptions);
      return emailSent;
   } 
   catch (error) {
      return error;
   }
}

module.exports = sendMail;