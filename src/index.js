// src/index.js
import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express4';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const PORT = process.env.PORT || 4000;

async function start() {
  // 1) Connect MongoDB first
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err?.message);
    process.exit(1);
  }

  // 2) Create Express + HTTP server
  const app = express();
  const httpServer = http.createServer(app);

  // 3) Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // 4) Start Apollo Server
  await server.start();

  // 5) Mount /graphql with middleware + JWT context
  app.use(
    '/graphql',
    cors(),
    // CHANGED: allow bigger JSON payloads (base64 images)
    express.json({ limit: '10mb' }), // was: express.json()
    expressMiddleware(server, {
      context: async ({ req }) => {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;

        if (!token) return { userId: null };

        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          return { userId: payload.userId };
        } catch {
          return { userId: null };
        }
      },
    })
  );

  app.get('/test', (req, res) => res.send('Express is working'));

  // 6) Start listening
  await new Promise((resolve) => httpServer.listen(PORT, resolve));
  console.log(`Server ready at http://localhost:${PORT}/graphql`);
}

start();
