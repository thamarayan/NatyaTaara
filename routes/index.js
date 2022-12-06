var express = require('express');
var router = express.Router();
var classs = require('../modals/classes');
var Register = require('../modals/registration');
var Workshops = require('../modals/workshop');
var WRegister = require('../modals/wRegister');
var Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'NatyaTaara' });
});

router.get('/workshops', function(req,res,next){
  Workshops.find(function(err,result){
    var today = new Date();
    res.render('workshops', {title:'Workshops | Natyataara', workshops: result, today:today});
  }).sort({date:1});
})

router.get('/enrollWorkshop/:id', function(req,res,next){
  var id = req.params.id;
  Workshops.findById(id, function(err,result){
    if(err){
      console.log(err);
      return res.redirect('/workshops');
    }
    res.render('workshopRegistration',{title:'Enroll Workshop | NatyaTaara', workshop:result});
    });
})

router.post('/createWorkshop1', function(req,res,next){
  var regisDetails = new WRegister({
    workshop: req.body.workshopID,
    name: req.body.wName,
    contact: req.body.wContact,
    email: req.body.wEmail
  })
  regisDetails.save(function(err,result){
    if(err){
      console.log(err);
    }
    req.session.newRegistration = result._id;
    Workshops.findById(result.workshop, function(err,resultt){
      var keyId = process.env.KEY_ID;
      var options = {
        amount: resultt.fees * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture:'1'
      };
    console.log(result);
    instance.orders.create(options, function(err, order) {
      console.log(order);
      res.render('workshopCheckout',{orderId : order.id, fees: order.amount, details:result, workshop: resultt, keyValue: keyId});
    });


    })

    
  })
} )

router.get('/aboutus', function(req,res,next){
  res.render('aboutus', {title: 'About | NatyaTaara'});
});

router.get('/onlineclass', function(req,res,next){
  classs.find(function(err,docs){
    console.log(docs);
    res.render('onlineclass', { title: 'Class | NatyaTaara', classes:docs });
  }).lean(); 
});

router.get('/studioclass', function(req,res,next){
  classs.find(function(err,docs){
    res.render('studioclass', { title: 'Class | NatyaTaara', classes:docs });
  }).lean(); 
});

router.get('/contact', function(req,res,next){
  res.render('contact', {title: 'Contact | NatyaTaara'});
});

router.post('/api/payment/verify', function(req,res, next){
console.log(req.body.wName);
  let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
  var keySecret = process.env.KEY_SECRET;
   var crypto = require("crypto");
   var expectedSignature = crypto.createHmac('sha256', keySecret)
                                   .update(body.toString())
                                   .digest('hex');
  console.log("sig received " ,req.body.response.razorpay_signature);
  console.log("sig generated " ,expectedSignature);
  
   var response = "false";
   if(expectedSignature === req.body.response.razorpay_signature){
    response="true";
    res.send(response);

    Register.updateOne({"_id" : req.session.classID},{$set: {
      "feesStatus": 1 
  }}, function(err, result){
      if(err){
          console.log(err);
          return res.redirect('/');
      }
      req.session.classID = null;
        
  });
    
   }
   });

   
router.post('/api/payment/verify1', function(req,res, next){
    
      let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
      var keySecret = process.env.KEY_SECRET;
       var crypto = require("crypto");
       var expectedSignature = crypto.createHmac('sha256', keySecret)
                                       .update(body.toString())
                                       .digest('hex');
      console.log("sig received " ,req.body.response.razorpay_signature);
      console.log("sig generated " ,expectedSignature);
      
       var response = "false";
       if(expectedSignature === req.body.response.razorpay_signature){
        response="true";
        res.send(response);
    
        WRegister.updateOne({"_id" : req.session.newRegistration},{$set: {
          "feesStatus": 1 
      }}, function(err, result){
          if(err){
              console.log(err);
              return res.redirect('/');
          }
          req.session.newRegistration = null;
            
      });
        
       }
       });
    
router.get('/spaceForRent', function(req,res,next){
  res.render('spaceForRent', {title:'NatyaTaara'})
})

router.get('/bookStudio', function(req,res,next){
  res.render('bookStudio', {title:'NatyaTaara'})
})
module.exports = router;

