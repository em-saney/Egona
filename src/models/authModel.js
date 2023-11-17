const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const signUpSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please enter your fullname']
   },
   email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      validate: [isEmail, 'Enter a valid email'],
      lowercase: true
   },
   phoneNumber: {
      type: String,
      required: [true, 'Phone number is required']
   },
   password: {
      type: String,
      required: [true, 'Enter a password'],
      minlength: [10, 'Password should be a combination of 10 characters']
   },
   confirmPassword: {
      type: String,
      required: true,
      minlength: [10, 'Password should be a combination of 10 characters']
   }
});

/* Hasing passwords before saving into the database */
signUpSchema.pre('save', async function(doc, next) {
   const salt = await bcrypt.genSalt();
   this.password = await bcrypt.hash(this.password, salt);
   this.confirmPassword = await bcrypt.hash(this.confirmPassword, salt);
})


/* Finding a user and comparing their password */
signUpSchema.statics.login = async function(email, phoneNumber, password) {
   const user = await this.findOne({ "$or": [ { email}, { phoneNumber} ] });
   if (user){
      const authLogin = await bcrypt.compare(password, user.password);
      if (authLogin){
         return user;
      }
      throw Error('Incorrect password');
   }
   throw Error('This user is not registered')
}


const SignUpSchema = mongoose.model('signUpSchema', signUpSchema);
module.exports = SignUpSchema;