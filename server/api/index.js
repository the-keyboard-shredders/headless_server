const router = require('express').Router();
module.exports = router;

// /api

router.use('/articles', (req, res, next) => {
  res.send('hello');
});
