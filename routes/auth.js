const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const UserModel = require('../models/userModel');

const router = express.Router();


router.post('/api/signup', (req, res, next) => {
    if (!req.body.name || !req.body.password) {
        // 400 for client errors (user needs to fix something)
        res.status(400).json({ message: 'Need both email and password 💩' });
        return;
    } // This has been already checked by the Angular Client using "validation"



    UserModel.findOne(
      { name: req.body.name },
      (err, userFromDb) => {
          if (err) {
            // 500 for server errors (nothing user can do)
            res.status(500).json({ message: '500: server fail while looking name' });
            return;
          }

          if (userFromDb) {
            // 400 for client errors (user needs to fix something)
            res.status(400).json({ message: 'Name already exists' });
            return;
          }

          const salt = bcrypt.genSaltSync(10);
          const scrambledPassword = bcrypt.hashSync(req.body.password, salt);

          const newUser = new UserModel({
            name: req.body.name,
            encryptedPassword: scrambledPassword,
            base64: req.body.base64
          });

          console.log(newUser);

          newUser.save((err) => {
              if (err) {
                res.status(500).json({ message: '500: server fail while saving' });
                return;
              }

              // Automatically logs them in after the sign up
              // (req.login() is defined by passport)

              req.login(newUser, (err) => {
                  if (err) {
                    console.log(err);
                    res.status(500).json({ message: '500: server fail while automatically loggin in after sign up' });
                    return;
                  }

                  // Clear the encryptedPassword before sending
                  // (not from the database, just from the object)
                  newUser.encryptedPassword = undefined;

                  // Send the user's information to the frontend
                  res.status(200).json(newUser);
              }); // close req.login()
          }); // close theUser.save()
      }
    ); // close UserModel.findOne()
}); // close router.post('/signup', ...


// This is different because passport.authenticate() redirects
// (APIs normally shouldn't redirect)
router.post('/api/login', (req, res, next) => {
    const authenticateFunction =
      passport.authenticate('local', (err, theUser, extraInfo) => {
          // Errors prevented us from deciding if login was a success or failure
          if (err) {
            res.status(500).json({ message: 'Serverfail while authenticating' });
            return;
          }
          console.log(req.body);
          console.log(theUser);

          // Login failed for sure if "theUser" is empty
          if (!theUser) {
            // "extraInfo" contains feedback messages from LocalStrategy
            res.status(401).json(extraInfo);
            return;
          }

          // Login successful, save them in the session.
          req.login(theUser, (err) => {
              if (err) {
                res.status(500).json({ message: 'Session save error 💩' });
                return;
              }

              // Clear the encryptedPassword before sending
              // (not from the database, just from the object)
              theUser.encryptedPassword = undefined;

              // Everything worked! Send the user's information to the client.
              res.status(200).json(theUser);
          });
      });

    authenticateFunction(req, res, next);
});


router.post('/api/logout', (req, res, next) => {
    // req.logout() is defined by passport
    req.logout();
    res.status(200).json({ message: 'Log out success! 🐫' });
});


router.get('/api/checklogin', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Nobody logged in. 🥒' });
      return;
    }

    // Clear the encryptedPassword before sending
    // (not from the database, just from the object)
    req.user.encryptedPassword = undefined;

    res.status(200).json(req.user);
});

router.get('/api/finduser', (req,res,next)=>{
  console.log(req.body);
  if(!req.body.name && !req.body.id){
    UserModel.find((err, userArr)=>{
      if(err){
        res.status(500).json({message: 'serverfailed'});
      }
      res.status(200).json(userArr);
    });
  }
  else if(req.body.name){
    UserModel.find(
      {name:{ "$regex": req.body.name, "$options": "i" }},
      (err, userArr)=>{
        if(err){
          res.status(500).json({message: 'serverfailed'});
        }
        res.status(200).json(userArr);
    });
  }
  else if(req.body.id){
    UserModel.find(
      { _id : req.body.id },
      (err, userArr)=>{
        if(err){
          res.status(500).json({message: 'serverfailed'});
        }
        res.status(200).json(userArr);
    });
  }
});

router.patch('/api/newalarm',(req,res,next)=>{

  UserModel.findByIdAndUpdate(req.body.id,
    {
          currentAlarm:{
            timeSet: req.body.alarm,
            alarmCreatedAt: req.body.now
          }
    },
    (err,updatedUser)=>{
      if(err){
        res.status(500).json({message: 'serverfailed'});
      }
      res.status(200).json(updatedUser);
    }
  );

});


module.exports = router;
