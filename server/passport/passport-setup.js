const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const User = require('../models/user');

if (process.env.NODE_ENV !== 'production') require('../../secrets')

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.callbackURL,
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret:
        process.env.GOOGLE_CLIENTSECRET
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            thumbnail: profile._json.image.url
          })
            .save()
            .then(newUser => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
