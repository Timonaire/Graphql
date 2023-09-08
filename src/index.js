const {
    ApolloServer
} = require("apollo-server");
const resolvers = require('./graphql/resolver')
const typeDefs = require('./graphql/typeDefs')


const server = new ApolloServer({
    typeDefs,
    resolvers
});

server
    .listen()
    .then(({
            url
        }) =>
        console.log(`server is running on ${url}`)
    );