const { render } = require('ejs');//signup-ruotse
const express = require('express');
const router = express.Router();

const signuppost = require('../../controllers/appControllers')

const signupget = require('../../controllers/appControllers')


router.get("/", signupget.signin_get)
router.post("/",signuppost.signin_post)



    
module.exports = router; 