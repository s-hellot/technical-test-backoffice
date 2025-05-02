import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {authPostBodySchema, AuthPostBodyType} from './authSchemas';

async function routes (fastify: FastifyInstance) {
    fastify.post(
        '/login', 
        {
            schema: {
                body: authPostBodySchema
            }
        },
        async (request: FastifyRequest<{Body: AuthPostBodyType}>, reply: FastifyReply) => {
            const { username, password } = request.body;
            if (username === 'admin' && password === 'admin123') {
                const token = fastify.jwt.sign({ username });
                return { token };
            } else {
                reply.code(401).send({ message: 'Invalid password' });
            }
        });
}

export default routes;