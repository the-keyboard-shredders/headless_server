import express from 'express';
import expressGraphQL from 'express-graphql';
import mongoose, { Query } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || '4000';

const db = require('../secrets');
// const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

// allow cross origin requests
// app.use(cors());

// Connect to MongoDB with Mongoose.
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(
  '/',
  cors(),
  bodyParser.json(),
  expressGraphQL({
    schema,
    graphiql: true
  })
);

// app.use(
//   '/',
//   graphqlHTTP({
//     schema,
//     graphiql: true
//   })
// );

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
