const ContactSchema  = require('../models/contactUsModel');
const sendEmail = require('./sendEmailController');

/* Handling error */
const handleError = (err) => {
  let error = { name: '' ,email: '', phoneNumber: '' };
  console.log(err.message, err.code);
   
  /* handling errors when certain conditions aren't met */
   if (err.message.includes('Contact-Submission validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
         error[ properties.path ] = properties.message;
      })   
   }
   
   //handling duplicate emails
   if(err.code === 11000){
      error.email = 'Request has been recieved from this email';
      return error;
   }
   return error;
}


const contact_post = async (req, res) => {
   const { name, email, phoneNumber, message } = req.body;

   try {
      const user = await ContactSchema.create({
         name,
         email,
         phoneNumber,
         message
      });

      const userEmail = user.email;
      const emailSubject = `Submission Received`;
      const emailText = `Your submission has been received, a response will be sent by our response team shortly. Thank You for choosing E-Gona`; 

      const result = await sendEmail(userEmail, emailSubject, emailText);
      console.log('Email sent', result)
      
      res.status(201).json({ sucess: true, user: user._id, message: 'Request sent successfully'});
   } catch (err) {
      const error = handleError(err)
      res.status(400).json({ error });
      console.log(err)
   }
}

module.exports = { contact_post };