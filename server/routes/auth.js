const router = require('express').Router();
const passport = require('passport');

// /auth

router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['email']
  })
);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
};

router.get('/me', authCheck, (req, res, next) => {
  res.send(req.user.id);
});

router.get('/loggedin', authCheck, (req, res, next) => {
  res.send('You have successfully logged in!');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});

router.get(
  '/google/redirect',
  passport.authenticate('google'),
  (req, res, next) => {
    res.redirect('/auth/loggedin');
  }
);

module.exports = router;
