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
    id: {type: GraphQLID},
    url: {type: GraphQLString},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.find({email: parent.userEmail});
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    thumbnail: {type: GraphQLString},
    googleId: {type: GraphQLString},
    articles: {
      type: new GraphQLList(ArticleType),
      resolve(parent, args) {
        return Article.find({userId: parent.id});
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    article: {
      type: ArticleType,
      args: {id: {type: GraphQLID}},
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
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return User.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    //not currently using addUser, please note this and maybe delete later
    // addUser: {
    //   type: UserType,
    //   args: {
    //     name: {type: new GraphQLNonNull(GraphQLString)},
    //     email: {type: new GraphQLNonNull(GraphQLString)}
    //   },
    //   resolve(parent, args) {
    //     let user = new User({
    //       name: args.name,
    //       email: args.email
    //     });
    //     return user.save();
    //   }
    // },
    addArticle: {
      type: ArticleType,
      args: {
        userId: {type: GraphQLString},
        url: {type: GraphQLString},
        title: {type: GraphQLString},
        content: {type: GraphQLString}
      },
      resolve(parent, args) {
        let article = new Article({
          userId: args.userId,
          url: args.url,
          title: args.title,
          content: args.content
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
