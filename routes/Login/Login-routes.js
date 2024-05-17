const { render } = require('ejs');
const express = require('express');
const router = express.Router();

const loginget =  require('../../controllers/appControllers')

const loginpost =  require('../../controllers/appControllers')

//const signupprovider = require('../../controllers/appControllers')
router.get("/", loginget.login_get); // GET request for login page
router.post("/", loginpost.login_post)

module.exports = router; 