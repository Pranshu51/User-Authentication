const JWT = require('jsonwebtoken');

const jwtAuth = (req,res,next) =>{
  const token= ( req.cookies && req.cookies.token) || null;

  if (!token)
    return res.status(400).json({
    sucess:false,
    message:'not authorised'})


    try{
      const payload = JWT.verify(token,process.env.SECRET)
      req.user = {
        id: payload.id,
        email: payload.email
      };

    }catch(e){
      return res.status(400).json({
    sucess:false,
    message:e.message})

    }

  next();
}

module.exports = jwtAuth;