const express = require('express');
const authRouter = express.Router();
const { signup ,signin ,getUser ,logout} = require('../controller/authController'); 
const jwtAuth = require('../middleware/jwtAuth');

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/user',jwtAuth, getUser);
authRouter.post('/logout', jwtAuth, logout);


module.exports = authRouter;