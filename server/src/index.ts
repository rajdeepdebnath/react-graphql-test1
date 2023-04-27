import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

let allBooks = [
  { title: "b", author: "b" },
  { title: "c", author: "c" },
];

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }
  
  input  Arr1 {
    arr1:[Int!]
    arr2:[Int!]
  }
  
  type Query {
    books: [Book],
    booksByTitle(title:String): [Book]
  }

  type Mutation {
    addBook(title: String, author: String): [Book],
    calculate(arr:Arr1):[Int!]
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => allBooks,
    booksByTitle: (_, { title }) => allBooks.filter((b) => b.title === title),
  },

  Mutation: {
    addBook: (_, { title, author }) => {
      allBooks.push({ title, author });
      return allBooks;
    },
    calculate: (_, { arr: { arr1, arr2 } }) => {
      let arr = [];
      let l = null;
      arr1.forEach((e1: number, i: number) => {
        let v = (arr2[i] + e1) / 2;
        arr.push(v);
        if (!l || v > l) l = v;
      });

      //   console.log(arr);
      arr = arr.map((e) => e * (255 / l));

      return arr;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
