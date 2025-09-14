

export const typeDefs = `#graphql
type Game {
  id: ID!
  title: String!
  platform: [String!]!
}

type Book {
  id: ID!
  Author: String!
  Price: Int!
  CreatedAt: String!   # store as ISO string
  Rating: Int!
  Verified: Boolean
}
type Game {
  id: ID!
  title: String!
  platform: [String]!
}
type Book {
  id: ID!
  Author: String!
  Price: Int!
  CreatedAt: String!
  Rating: Int!
  Verified: Boolean
  games: [Game]   # 👈 multiple games
}

type Query {
  Games: [Game]
  Game(id:ID!):Game
  Books: [Book]
  Book(Price:Int!):[Book]
}
type Mutation {
  addBook(Author: String!, Price: Int!, Rating: Int!, Verified: Boolean, GameID: Int): Book
  # DeleteGame(id: ID!): Boolean
   DeleteGame(id: ID!): Game
    UpdateBook(id: ID!, Author: String, Price: Int, Rating: Int, Verified: Boolean, GameID: Int): Book
}
`;
