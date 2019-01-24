const path = require('path');
const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8080;
const app = express();

const createApp = () => {
  app.use(morgan('dev'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', require('./api'));

  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
};

async function bootApp() {
  await createApp();
  await startListening();
}

bootApp();
