const { render } = require('ejs');
const express = require('express');
const router = express.Router();


router.get("/productpage", (req,res)=>{
res.render("ProductPage")
})



module.exports = router; 