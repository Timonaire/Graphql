const {
    ApolloServer
} = require("apollo-server");
const fs = require('fs');
const path = require('path');
const {
    PrismaClient
} = require('@prisma/client')
const {
    getUserId
} = require('./utils');
const resolvers = require('./resolvers/resolver')

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({
        req
    }) => {
        return {
            ...req,
            prisma,
            userId: req && req.headers.authorization ?
                getUserId(req) : null
        };
    }
});

server
    .listen()
    .then(({
            url
        }) =>
        console.log(`server is running on ${url}`)
    );