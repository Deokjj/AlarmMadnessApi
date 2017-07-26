const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


const UserModel = require('../models/userModel');


// Save the user's ID in the bowl (called when user logs in)
passport.serializeUser((userFromDb, next) => {
    next(null, userFromDb._id);
});


// Retrieve the user's info from the DB with the ID we got from the bowl
passport.deserializeUser((idFromBowl, next) => {
    UserModel.findById(
      idFromBowl,
      (err, userFromDb) => {
          if (err) {
            next(err);
            return;
          }

          next(null, userFromDb);
      }
    );
});


// email & password login strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'name',    // sent through AJAX from Angular
    passwordField: 'password'  // sent through AJAX from Angular
  },
  (name, password, next) => {

      UserModel.findOne(
        { name: name },
        (err, userFromDb) => {
            if (err) {
              next(err);
              return;
            }

            if (userFromDb === null) {
              next(null, false, { message: 'This name does not exist' });
              return;
            }

            if (bcrypt.compareSync(password, userFromDb.encryptedPassword) === false) {
              next(null, false, { message: 'Incorrect password' });
              return;
            }

            next(null, userFromDb);
        }
      ); // close UserModel.findOne()

  } // close (theEmail, thePassword, next) => {
));
