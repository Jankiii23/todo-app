import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typeDefs/index.js';
import { resolvers } from './resolvers/index.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true for HTTPS production
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
    userId: req.session.userId || null,
  }),
});

await server.start();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Backend running at http://localhost:4000${server.graphqlPath}`);
});

