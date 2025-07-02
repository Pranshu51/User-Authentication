const mongoose = require('mongoose');
const { Schema } = mongoose;
const JWT = require('jsonwebtoken');

const userSchema = new Schema({
  name:{
    type: String,
    required:[true, 'user name is required'],
    minLength: [3, 'name must be atleast 3 char'],
    maxLength: [50, 'name should be less than 50 char'],
    trim: true

  },
  email: {
    type: String,
    required :[true, 'email is required'],
    unique:[true, 'already registered'],
    lowercase: true
  },
  password: {
    type: String,
    select: false
  },
  forgotPasswordToken:{
    type: String,
  },
  forgotPasswordExpiryDate: {
    type: Date,
  }
},{
  timestamps:true
});

userSchema.methods = {
  jwtToken(){
    return JWT.sign(      //jwtsign function me 3 part hote 
      {    id: this._id,email: this.email
      },
      process.env.SECRET,
      {expiresIn:'24h'}
)
  }
}

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;