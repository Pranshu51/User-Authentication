const userModel = require('../model/userSchema');
const emailValidator = require("email-validator");
const bcrypt = require('bcrypt');

const signup = async (req,res,next) => {
  const { name ,email, password ,confirmPassword} = req.body;
  console.log(name ,email, password ,confirmPassword);

  if (!name || !password || !email || !confirmPassword){
     return res.status(400).json({
    success :false,
    message: 'Every field is required'
  })
    
  }

  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
     return res.status(400).json({
    success :false,
    message: 'Please provide a valid email id'
  })
    
  }

  if(password !== confirmPassword){
    return res.status(400).json({
    success :false,
    message: 'password and confirmPassowrd is not same'
  })
  }

  try{
  const userInfo = userModel(req.body);

  const result = await userInfo.save();//databse me save karne eklie

  return res.status(200).json({
    success :true,
    data : result
  })

  }catch(e){
    if (e.code === 11000){
    return res.status(400).json({
    success :false,
    message: 'Account alredy exists with the provided email id'
  })
    }
    return res.status(400).json({
    success :false,
    message : e.message
  })

  }
}

const signin = async (req, res) => {
  const{email, password} =req.body;

  if(!email || !password){
    return res.status(400).json({
    success :false,
    message: 'every field is mendatory'
  })
  }

 try{
     const user = await userModel
  .findOne({
    email
  })
  .select('+password');


  if (!user || !(await bcrypt.compare( password, user.password ) )){
    return res.status(400).json({
    success :false,
    message: 'invalid credentials'
  })

  }
 const token = user.jwtToken();
 user.password = undefined;

 const cookieOption ={
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly:true  //client side javascript se aap isko access nhi kar skte 
 };
  
  res.cookie("token", token, cookieOption);
  res.status(200).json({
    success:true,
    data:user
  })


 }catch(e){
  res.status(400).json({
    success:false,
    message:e.message
  })

 }
}


const  getUser = async (req, res, next) => {
  const userId = req.user.id;

  try{
       const user = await userModel.findById(userId);
       return res.status(200).json({
        success:true,
        data:user
       })
       
  }catch(e){
    return res.status(400)
.json({
  success :false,
  message:e.message
})
  }
}

const logout = (req,res) => {
  try {
    const cookieOption ={
      expires: new Date(),
      httpOnly: true

    };
    res.cookie("token", null ,cookieOption);
    res.status(200).json({
      success:true,
      meassage:' logout successfully'
    })

  }catch(e){
    res.status(400).json({
    success: false,
    message: e.message
  })

  }

}
 
module.exports =  {
  signup,signin,getUser,logout}
