const express = require('express');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Query } = mongoose;

const app = express();
const PORT = process.env.PORT || '4000';

const db = process.env.MONGODB_URI || require('../secrets');

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
