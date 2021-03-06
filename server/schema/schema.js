const graphql = require('graphql');

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
    url: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.find({ googleId: parent.googleId });
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
    thumbnail: { type: GraphQLString },
    googleId: { type: GraphQLString },
    articles: {
      type: new GraphQLList(ArticleType),
      resolve(parent, args) {
        return Article.find({ googleId: parent.googleId });
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
    userArticles: {
      type: new GraphQLList(ArticleType),
      args: { googleId: { type: GraphQLString } },
      resolve(parent, args) {
        return Article.find({ googleId: args.googleId });
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addArticle: {
      type: ArticleType,
      args: {
        googleId: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let article = new Article({
          googleId: args.googleId,
          url: args.url,
          title: args.title,
          content: args.content
        });
        return article.save();
      }
    },
    deleteArticle: {
      type: ArticleType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        try {
          await Article.deleteOne({ "_id": args.id })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
