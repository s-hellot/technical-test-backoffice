import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin'
import { UserRepository } from '../repository/userRepository';

async function repositoryPlugin(fastify: FastifyInstance) {
    const userRepository = new UserRepository()
    await userRepository.initialize(fastify)

    fastify.decorate('userRepository', userRepository)
}

export default fastifyPlugin(repositoryPlugin);