var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var classs = require('../modals/classes');
var Register = require('../modals/registration');
var Workshop = require('../modals/workshop');
var WRegister = require('../modals/wRegister');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './public/images/workshops/');
    },
    filename: function(req,file, cb){
        cb(null, file.originalname);
    }
});

var fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }
    else{
        cb(null,true);
    }
    
}

var upload = multer({
    storage:storage,
    limits:{fileSize: 1024 * 1024 * 2},
    fileFilter: fileFilter
});


router.get('/', function(req,res,next){
    if(req.session.adminStatus === true){
     return res.render('backstage/dashboard', {title:'BackStage | NatyaTaara'});   
    }
    return res.render('backstage/login', {title: 'BackStage | NatyaTaara', message:null});
});

router.get('/dashboard', adminAuthentication, function(req,res,next){
    res.render('backstage/dashboard', {title:'BackStage | NatyaTaara'});
})

router.get('/login', function(req,res,next){
    res.render('backstage/login', {message:null});
})

router.post('/login', function(req,res,next){
    if (req.body.email === process.env.ADMIN_ID && req.body.password === process.env.ADMIN_PASSWORD){
        req.session.adminStatus = true;
        console.log(req.session.adminStatus);
        res.render('backstage/dashboard', {title:'BackStage | NatyaTaara'});
    }
    else{
        req.session.adminStatus = false;
        return res.render('backstage/login', {title:'BackStage | NatyaTaara', message: 'Invalid Admin Username or Password'})
    }
})

router.get('/logout', function(req,res,next){
    req.session.adminStatus = false;
    res.render('backstage/login', {title:'BackStage | Natyataara', message:null});
})

router.get('/getRegister', adminAuthentication, function(req,res,next){
    Register.find(function(err,courseList){
        if(err){
            return res.render('backstage/dashboard');
        }
        console.log(courseList);
        res.render('backstage/courseRegister', {title:'BackStage | NatyaTaara', course:courseList});
    });
})

router.get('/feesUpdate/:id', adminAuthentication, function(req,res,next){
    var courseId = req.params.id;
    Register.findById(courseId, function(err, course){
        if(err){
          return res.redirect('backstage/dashboard');
        }
        Register.updateOne({_id: courseId},{$set: {"feesStatus": true}}, function(err, result){
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            res.redirect('/backstage/getRegister');
        });
})
});

router.get('/block/:id', adminAuthentication, function(req,res,next){
    var courseId = req.params.id;
    Register.findById(courseId, function(err, course){
        if(err){
          return res.redirect('backstage/dashboard');
        }
        Register.updateOne({_id: courseId},{$set: {"studentStatus": false}}, function(err, result){
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            res.redirect('/backstage/getRegister');
        });
})
});

router.get('/revoke/:id', adminAuthentication, function(req,res,next){
    var courseId = req.params.id;
    Register.findById(courseId, function(err, course){
        if(err){
          return res.redirect('backstage/dashboard');
        }
        Register.updateOne({_id: courseId},{$set: {"studentStatus": true}}, function(err, result){
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            res.redirect('/backstage/getRegister');
        });
})
});

router.get('/remove/:id', function(req,res,next){
    var id = req.params.id;
    Register.deleteOne({_id: id}, function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        res.redirect('/backstage/getRegister');
    })
})

router.get('/resetPayments', adminAuthentication, function(req,res,next){
    Register.find(function(err, course){
        if(err){
            return res.redirect('backstage/dashboard')
        }
        Register.updateMany({},{$set: {"feesStatus": false}}, function(err, result){
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            res.redirect('/backstage'); 
    })
    })
})

router.get('/courses', adminAuthentication, function(req,res,next){
    classs.find(function(err,courses){
        if(err){
            console.log(err);
            return res.redirect('/backstage');
        }
        
        res.render('backstage/courses', {title: 'Courses | NatyaTaara', courseList: courses});
    })
})

router.post('/updateCourse/:id', adminAuthentication, function(req,res,next){
    var courseId = req.params.id;
    var title = req.body.title;
    var ageGroup = req.body.age;
    var level = req.body.level;
    var session1 = req.body.session1;
    var timing1 = req.body.timing1;
    var session2 = req.body.session2;
    var timing2 = req.body.timing2;
    var fees = req.body.fees;
    var classType = req.body.classType;

    classs.findById(courseId, function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        classs.updateOne({_id: courseId},{$set: {
            "title": title, 
            "ageGroup": ageGroup, 
            "level":level, 
            "session1" : session1,
            "timing1" : timing1,
            "session2" : session2,
            "timing2" : timing2,
            "fees" : fees,
            "classType" : classType
        }}, function(err, result){
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            console.log(result);
            res.redirect('/backstage/courses');
        });
    })

})

router.get('/makeInactive/:id', adminAuthentication, function(req,res,next){
    var courseId = req.params.id;
    console.log(courseId);
    classs.findById(courseId, function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        console.log(result);
        classs.updateOne({_id: courseId},{$set: {"status": false}}, function(err,resul){
            res.redirect('/backstage/courses');
        });
        

    })
});

router.get('/makeActive/:id', adminAuthentication, function(req,res,next){
    var courseId = req.params.id;
    console.log(courseId);
    classs.findById(courseId, function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        console.log(result);
        classs.updateOne({_id: courseId},{$set: {"status": true}},function(err,resul){
            res.redirect('/backstage/courses');
        });

    })
})

router.get('/students',adminAuthentication, function(req,res,next){
    
    Register.find(function(err,docs){
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        
        res.render('backstage/students', {title:'NatyaTaara', students:docs });
    })
})

router.post('/updateStudent/:id', adminAuthentication, function(req,res,next){
    var studentId = req.params.id;
    var contact = req.body.contact;
    var address = req.body.address;

    Register.findById(studentId, function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        Register.updateOne({_id: studentId},{$set: {
            "contact": contact, 
            "address": address 
        }}, function(err, result){
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            res.redirect('/backstage/students');
        });
    });
})

router.get('/feesUpdation', function(req,res,next){
    Register.find(function(err,docs){
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        res.render('backstage/feesUpdation', {students:docs});
    })
})

router.post('/markPaid', adminAuthentication, function(req,res,next){
    
    const {ids} = req.body;
    
    Register.updateMany({_id: {$in: ids}}, 
    { $set: { 'feesStatus' : true } }, 
    {multi: true} ,
    function(err, records){
        if (err) {
            console.log(err);
            return false;
        }
        console.log(records);
        res.redirect('/backstage/feesUpdation');
    });
})

router.post('/markUnpaid', adminAuthentication, function(req,res,next){
    
    const {ids} = req.body;
   

    Register.updateMany({_id: {$in: ids}}, 
    { $set: { 'feesStatus' : false } }, 
    {multi: true} ,
    function(err, records){
        if (err) {
            console.log(err);
            return false;
        }
        console.log(records);
        res.redirect('/backstage/feesUpdation');
    });
})

router.get('/manualEntry', function(req,res,next){
    classs.find(function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/backstage/dashboard');
        }
        console.log(result);
        res.render('backstage/manualEntry', {title:'Manual Entry | NatyaTaara', courses:result});
    })
})

router.post('/manualEntry', function(req,res,next){
    
    var courseId = req.body.courseSelected;
    var successMessage = "Student Added";
  
  classs.findById(courseId, function(err, newCourse){
    if(err){
      return res.render('/');
    }
    var register = new Register({
      studentName: req.body.studentName,
      studentAge: req.body.studentAge,
      contact: req.body.contact,
      address: req.body.address,
      course:newCourse,
    })
    register.save(function(err,result){
      if(err){
        console.log(err);
        res.redirect('/backstage');
      }
      console.log(result);
      res.redirect('/backstage/manualEntry');
    })

  }).lean();
})

router.get('/workshops', function(req,res,next){
    res.render('backstage/workshops');
})

router.get('/createWorkshop', function(req,res,next){
    res.render('backstage/createWorkshop');
})

router.post('/createWorkshop', upload.single('workshopPoster'), function(req,res,next){

    console.log(req.body.wDate);
    console.log(req.body.wTime);

    var workshop = new Workshop({
        imagePath :req.file.path,
        title : req.body.wName,
        desc : req.body.wDesc,
        date : req.body.wDate,
        time:req.body.wTime,
        type : req.body.wType,
        venue : req.body.wVenue,
        zoomID : req.body.wZoomID,
        fees : req.body.wFees
    })
    workshop.save(function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/backstage/createWorkshop');
        }
        console.log(result);
        res.render('backstage/workshops');
    })
})

router.get('/viewWorkshop', function(req,res,next){
    Workshop.find(function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/backstage/dashboard');
        }
        var today = new Date()
        console.log(result);
        res.render('backstage/viewWorkshop', {workshops:result, today:today});
    }).sort ( { date: 1 } )
})

router.get('/subscribers/:id', function(req,res,next){
    var id = req.params.id;
    
    WRegister.find({ workshop : id }, function(err,result){
        if(err){
            console.log(err)
        }
        console.log(result);
        Workshop.findById(id, function(err,result1){
            res.render('backstage/subscribers', {title:'Subscribers | Natyataara', subscribers:result, name: result1.title});
        })
        
    })
    
})

router.get('/stopSubscriptions/:id', function(req,res,next){
    var id = req.params.id;
    Workshop.updateOne({'_id': id}, {$set: {'status':0}}, function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/backstage/viewWorkshop');
        }
        res.redirect('/backstage/viewWorkshop');
    })
})

router.get('/startSubscriptions/:id', function(req,res,next){
    var id = req.params.id;
    
    Workshop.updateOne({'_id': id}, {$set: {'status':1}}, function(err,result){
        if(err){
            console.log(err);
            return res.redirect('/backstage/viewWorkshop');
        }
        res.redirect('/backstage/viewWorkshop');
    })
})

router.get('/removeWorkshop/:id', function(req,res,next){
    var id = req.params.id;
    Workshop.deleteOne({'_id' : id}, function(err,result){
        if(err){
            console.log(err);
            return res.render('backstage/viewWorkshop');
        }
        res.redirect('/backstage/viewWorkshop');
    })
})

module.exports = router;

function adminAuthentication(req,res,next){
    if(req.session.adminStatus === true){
        return next();
    }
    return res.redirect('/backstage/login');
}