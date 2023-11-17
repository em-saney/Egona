const SignUpSchema = require('../models/authModel');
const jwt = require('jsonwebtoken');
const sendEmail  = require('./sendEmailController');

/* Creating webtokens to store in cookie */
maxAge = 5 * 24 * 60 * 60;
const createTokens = (id) => {
   return jwt.sign({ id }, 'In the land of myth and the time of magic, the destiny of a great kingdom rests on the shoulder of a young man, his name, Zangetsu', {
      expiresIn: maxAge
   });
}

/* Handling errors */
const handleErrors = (err) => {
   let error = {name: '', email: '', password: '', phoneNumber: ''};
   // console.log(err.message, err.code);

   //validation errors
   if (err.message.includes('signUpSchema validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
         error[ properties.path ] = properties.message;
      })
   }

   //duplicate keys
   if (err.code === 11000){
      error.email = 'This user has already been registered';
   }

   //handling errors from logging in
   if (err.message === 'This user is not registered') {
      error.email = 'This user is not registered';
   }

   if (err.message === 'Incorrect password'){
      error.password = 'Incorrect password';
   }
   return error
}


/* Signing the user up */
exports.signUp = async (req, res) => {
   const { name, email, phoneNumber, password, confirmPassword} = req.body;

   try {
      if (password !== confirmPassword) {
         return res.status(401).json({ sucess: false, confirmErrorMessage: 'Password do not match'});
      }
      const user = await SignUpSchema.create({
         name,
         email, 
         phoneNumber,
         password,
         confirmPassword
      });   

      /* Sending an email to the user whenever they sign up */
      const userEmail = user.email;
      const emailSubject = `Welcome to E-Gona, ${user.name}!!!`;
      const emailText = `We are delighted to have you on E-Gona, we are geared at offering you the best services when it comes to purchasing fresh and healthy agricultural products. We have carefully vetted all these products before bringing to you. We have made buying groceries relatively convenient with our seamless and easy purchasing methods and we also ensure safe and fast delivery at you.
      
      At E-Gona, our farmers are our driving force, with their beautiful and fresh farm produce, they are able to reach a larger audience and also sell their products, by setting up their stores and making sales.
      
      A Customer on E-Gona is happy person and a Farmer on E-Gona is....omo i don lost😞😞`; 

      const result = await sendEmail(userEmail, emailSubject, emailText);
      console.log('Email sent', result)

      //validating if password and confirm password match
      const token = createTokens(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
     return res.status(201).json({ success: true, user: user._id });
   } 
   catch (err) {
      const error = handleErrors(err);
      res.status(400).json({ success: false, error });
   }
}

/* Loging in the user */
exports.login = async (req, res) => {
   const { email, phoneNumber, password } = req.body;

   try {
      const user = await SignUpSchema.login(email, phoneNumber, password);

       /* Sending an email to the user whenever they sign up */
      const userEmail = user.email;
      const emailSubject = `Login alert from an unknown device`;
      const emailText = 'Senior man, we don recieve login alert from unknown device o, make you try very if na you, if not sharply change password oo, no talk say i no tanana you early😉'; 
 
      const result = await sendEmail(userEmail, emailSubject, emailText);
      console.log('Email sent', result);

      const token = createTokens(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge});
      res.status(200).json({sucess: true, user: user._id})
   } catch (err) {
      const error = handleErrors(err);
      res.status(400).json({sucess: false, error})
   }
   
}