const got = require('got');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const items = [
    {
        id: 1,
        price: 16000.00,
        name: 'Apple Watch',
        description: 'Smart watches from Apple',
        likes: 5,
        available: true,
    },
    {
        id: 2,
        price: 12000.00,
        name: 'Samsung Watch',
        description: 'Smart watches from Samsung',
        likes: 19,
        available: false,
    },
    {
        id: 3,
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
    id: Int,
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
app.use(cors());

server.applyMiddleware({ app, path: "/graphql" });

// Start the server
app.listen({ port: 3000 }, () => {
  console.log('GraphQL shop API is available at http://localhost:3000/graphql');
});


// Helpers

async function changeCurrency(origItems, currency) {
    let items = [];

    currency = currency || 'rub';
    
    // Fetching currency from CRB and changing it in response
    let rbcResponse = await got('https://www.cbr-xml-daily.ru/daily_json.js', { json: true });
    let rate;
    if (currency == 'rub') {
        rate = 1;
    } else {
        rate = rbcResponse.body.Valute[currency.toUpperCase()].Value;
    }

    for (let i = 0; i < origItems.length; ++i) {
        items[i] = {};
        Object.assign(items[i], origItems[i]);

        if (currency != 'rub') {
            items[i].price = items[i].price / rate;
        }
        items[i].currency = currency;
    }
    return items;
}