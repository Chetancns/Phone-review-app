const express = require('express');
const router =express.Router();
const mongoose = require('mongoose');
const phone = mongoose.model('phone');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


// Phones Index
router.get('/', (req, res) => {
  phone.find()
  .populate('user')
  .sort({date:'desc'})
  .then(phones=>{
    res.render('phones/index',{
      phones:phones
    });
  });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  phone.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('review.reviewUser')
  .then(phone => {
    res.render('phones/show', {
      phone: phone
    });
  });
});

// List phones from a user
router.get('/user/:userId', (req, res) => {
  phone.find({user: req.params.userId})
    .populate('user')
    .then(phones => {
      res.render('phones/index', {
        phones:phones
      });
    });
}); 

// Logged in users phones
router.get('/my', ensureAuthenticated, (req, res) => {
  phone.find({user: req.user.id})
    .populate('user')
    .then(phones => {
      res.render('phones/index', {
        phones:phones
      });
    });
});



// Add Phone Form
router.get('/add', ensureAuthenticated,(req, res) => {
    res.render('phones/add');
  });

  // Edit Phone Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  phone.findOne({
    _id: req.params.id
  })
  .then(phone => {
    if(phone.user != req.user.id){
      res.redirect('/phones')
    }else{
    res.render('phones/edit', {
      phone: phone
    });
  }
  });
});


// Process of add phone  
router.post('/', ensureAuthenticated,(req, res) => {
    //console.log(req.body);
    let errors = [];

    if(!req.body.name){
      errors.push({text:'Please add a name'});
    }
    if(!req.body.brand){
      errors.push({text:'Please add some brand'});
    }

    if(!req.body.size){
      errors.push({text:'Please add some size'});
    }

    if(!req.body.camera){
      errors.push({text:'Please add some camera'});
    }

    if(!req.body.battery){
      errors.push({text:'Please add some battery'});
    }

    if(!req.body.prize){
      errors.push({text:'Please add some prize'});
    }
  
    if(errors.length > 0){
      res.render('phones/add', {
        errors: errors
      });
    } else {
      phone.findOne({name: req.body.name})
      .then(phones => {
        if(phones){
          req.flash('error_msg', 'Phone is already regsitered');
          res.redirect('phones/add');
        } else {

    const newphone = {
      name: req.body.name,
      brand: req.body.brand,
      size: req.body.size,
      camera: req.body.camera,
      battery: req.body.battery,
      prize: req.body.prize,
      user: req.user.id
    }

    // Create phone
  new phone(newphone)
  .save()
  .then(phone => {
    res.redirect(`/phones/show/${phone.id}`);
  });
        }
      }); 
    }
  });  

  // Edit Form Process
router.put('/:id', (req, res) => {
  phone.findOne({
    _id: req.params.id
  })
  .then (phone => {
    // New values
	    phone.name= req.body.name;
      phone.brand= req.body.brand;
      phone.size= req.body.size;
      phone.camera= req.body.camera;
      phone.battery= req.body.battery;
      phone.prize= req.body.prize;
      phone.user= req.user.id;

    phone.save()
      .then(phone => {
        res.redirect('/dashboard');
      });
  });
});

// Delete phone
router.delete('/:id', (req, res) => {
  phone.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/dashboard');
    });
});

// Add Comment
router.post('/review/:id', (req, res) => {
  phone.findOne({
    _id: req.params.id
  })
  .then(phone => {
    const newReview = {
      reviewBody: req.body.reviewBody,
      reviewUser: req.user.id
    }

    // Add to reviews array
    phone.review.unshift(newReview);

    phone.save()
      .then(phone => {
        res.redirect(`/phones/show/${phone.id}`);
      });
  });
});

module.exports = router;