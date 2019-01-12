const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const items = [
    {
        price: 16000.00,
        name: 'Apple Watch',
        description: 'Smart watches from Apple',
        likes: 5,
        available: true,
    },
    {
        price: 12000.00,
        name: 'Samsung Watch',
        description: 'Smart watches from Samsung',
        likes: 19,
        available: false,
    },
    {
        price: 9700.00,
        name: 'Xiaomi Watch',
        description: 'Smart watches from Xiaomi',
        likes: 13,
        available: true,
    },
];

// The GraphQL schema in string form
const typeDefs = gql`
  type Query { items(currency: String): [Item] }
  type Item {
    price: Float,
    name: String,
    description: String,
    likes: Int,
    available: Boolean,
    currency: String
  }
`;

// The resolvers
const resolvers = {
    Query: { 
      items: (parent, args) => {
            let processedItems = changeCurrency(items, args.currency);
            return processedItems;
        } 
    },
};


const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers,
});

// Initialize the Express app
const app = express();

server.applyMiddleware({ app, path: "/graphql" });

// Start the server
app.listen({ port: 3000 }, () => {
  console.log('GraphQL shop API is available at http://localhost:3000/graphql');
});


// Helpers

function changeCurrency(items, currency) {
    currency = currency || 'rub';
    
    // Fetching currency from CRB and changing it in response
    // ...
    let rate = 1;

    for (let i = 0; i < items.length; ++i) {
        if (currency != 'rub') {
            items[i].price = items[i].price / rate;
        }
        items[i].currency = currency;
    }
    return items;
}