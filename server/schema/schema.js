const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

const Article = require('../models/article');
const User = require('../models/user');

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.find({ email: parent.userEmail });
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    articles: {
      type: new GraphQLList(ArticleType),
      resolve(parent, args) {
        return Article.find({ userEmail: parent.email });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    article: {
      type: ArticleType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Article.findById(args.id);
      }
    },
    articles: {
      type: new GraphQLList(ArticleType),
      resolve(parent, args) {
        return Article.find({});
      }
    },
    user: {
      type: UserType,
      args: { email: { type: GraphQLString } },
      resolve(parent, args) {
        return User.find({ email: args.email });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let user = new User({
          name: args.name,
          email: args.email
        });
        return user.save();
      }
    },
    addArticle: {
      type: ArticleType,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        userEmail: { type: GraphQLString }
      },
      resolve(parent, args) {
        let article = new Article({
          title: args.title,
          content: args.content,
          userEmail: args.userEmail
        });
        return article.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
