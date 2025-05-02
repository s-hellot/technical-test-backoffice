import fastifyPlugin from 'fastify-plugin';
import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: 'http://localhost:5173',
    credentials: true
  });
}

export default fastifyPlugin(corsPlugin);
