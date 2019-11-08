const express = require('express');
const router =express.Router();
const mongoose = require('mongoose');
const phone = mongoose.model('phone');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


router.get('/',ensureGuest,(req,res)=>{
    res.render('index/welcome');
});

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    phone.find({user:req.user.id})
  .then(phones => {
    res.render('index/dashboard', {
        phones: phones
    });
  }); 
});

router.get('/about', (req, res) => {
    res.render('index/about');
  });
  


module.exports = router;