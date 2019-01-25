export default `
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Query {
    user(id: String!): User
    users: [User]
  }
  type Mutation {
    addUser(name: String!, email: String!): User
    editUser(id: String, name: String, email: String): User
    deleteUser(id: String, name: String, email: String): User
  }
`;
