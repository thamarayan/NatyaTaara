var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Razorpay = require('razorpay');
var classs = require('../modals/classes');
var Register = require('../modals/registration');

var csrfProtection = csrf();
router.use(csrfProtection);

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});


router.get('/profile', isLoggedIn, function(req,res,next){
  var userEmail = req.user.email;
    Register.find({user: req.user}).lean()
    .exec(function(err, course) {
        if(err){
            return res.write('Error!');
        }
        console.log(course)
        res.render('user/profile', {title:'Profile | NatyaTaara', csrfToken : req.csrfToken(), courses: course, user:userEmail});
    });;
});

router.get('/registration', isLoggedIn, function(req,res,next){
  res.render('user/registration',{title: 'Registration | NatyaTaara '});
})

router.get('/add-course/:id', isLoggedIn, function(req,res,next){
  var courseId = req.params.id;
  classs.findById(courseId, function(err, course){
    if(err){
      return res.redirect('/');
    }
    res.render('user/registration', {csrfToken : req.csrfToken(), newCourse : course});   
  })
})

router.post('/newRegistration', isLoggedIn, function(req,res,next){

  var courseId = req.body.courseId;
  
  classs.findById(courseId, function(err, newCourse){
    if(err){
      return res.render('/');
    }
    var register = new Register({
      user:req.user,
      studentName: req.body.studentName,
      studentAge: req.body.studentAge,
      contact: req.body.contact,
      address: req.body.address,
      course:newCourse,
    })
    register.save(function(err,result){
      if(err){
        console.log(err);
        res.redirect('/');
      }
      console.log(result);
      res.redirect('/user/profile');
    })

  }).lean();


  
})

router.post('/create/orderId', isLoggedIn, function(req,res,next){
  console.log('create order id request', req.body);

  req.session.classID = req.body.courseTag;
  console.log("This is the " + req.body.courseTag);
  console.log("this is from session " + req.session.classID);
  var feesAmount = req.body.courseFees;
  var keyId = process.env.KEY_ID;

  Register.findById(req.body.courseTag, function(err, docs){
    if(err){
      return res.redirect('/');
    }
    var options = {
      amount: feesAmount * 100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
      payment_capture:'1'
    };
    console.log(docs);
    instance.orders.create(options, function(err, order) {
      console.log(order);
      res.render('user/checkout',{orderId : order.id, fees: order.amount, courseDetails:docs, keyValue: keyId, csrfToken : req.csrfToken()});
    });
  });

  })


router.get('/logout', isLoggedIn, function(req,res,next){
  req.logout();
  res.redirect('/');
})


router.use('/', notLoggedIn, function(req,res,next){
  next();
})

/* GET users listing. */
router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {title:'NatyaTaara', csrfToken : req.csrfToken(), messages:messages});
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {title:'NatyaTaara', csrfToken : req.csrfToken(), messages:messages});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect:'/user/profile',
  failureRedirect:'/user/signup',
  failureFlash:true
}));

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect:'/user/profile',
  failureRedirect:'/user/signin',
  failureFlash:true
}));


module.exports = router;


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}

function notLoggedIn(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}