var passport = require('passport');
var User = require('../modals/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id, function(err, user){
        done(err,user);
    })
});

passport.use('local.signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function(req, email, password, done){
        req.checkBody('email', 'invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Password must be minimum 8 characters long').notEmpty().isLength({min:8});
        var errors = req.validationErrors();
        if(errors){
            var messages = [];
            errors.forEach(error => {
                messages.push(error.msg);               
            });
            return done(null, false, req.flash('error', messages));
        }
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if (user){
            return done(null, false, {message:'Email is already in use'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err){
            if(err){
                return done(err);
            }
            else{
                return done(null, newUser);
            }
        })
    })
}));

passport.use('local.signin', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function(req, email, password, done){
    req.checkBody('email', 'invalid email').notEmpty().isEmail();
    req.checkBody('password', 'invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(error => {
            messages.push(error.msg);               
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if (!user){
            return done(null, false, {message:'No User Found!'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message:'Wrong Password'})
        }
        return done(null, user);
    })
}))