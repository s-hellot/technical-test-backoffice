import Fastify, { FastifyInstance } from 'fastify'
import mongoPlugin from './plugins/mongo';
import jwtPlugin from './plugins/jwt';
import routes from './routes/routes';
import swaggerPlugin from './plugins/swagger';
import repository from './plugins/repository';

const fastify: FastifyInstance = Fastify({
  logger: true
})

const start = async () => {
  try {
    await fastify.register(swaggerPlugin)
    await fastify.register(jwtPlugin)
    await fastify.register(mongoPlugin)
    await fastify.register(repository)

    for (const route of routes) {
      await fastify.register(route);
    }
    
    await fastify.listen({ host: '0.0.0.0', port: 3000 })
    fastify.log.info('Server listening')
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
