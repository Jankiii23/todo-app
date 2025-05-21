import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    me: User
    todos: [Todo!]!
  }

  type Mutation {
    signup(username: String!, password: String!): User
    login(username: String!, password: String!): User
    addTodo(title: String!): Todo
    toggleTodo(id: ID!): Todo
    deleteTodo(id: ID!): Boolean
  }
`;
