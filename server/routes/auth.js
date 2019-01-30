const router = require('express').Router();
const passport = require('passport');

// /auth

router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/logout', (req, res, next) => {
  req.logout();
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
