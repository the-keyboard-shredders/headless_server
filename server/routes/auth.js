const router = require('express').Router();
const passport = require('passport');

// /auth

router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['email']
  })
);

router.get('/me', (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else {
    res.send(req.user.id);
  }
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
    res.redirect('/');
  }
);

module.exports = router;
