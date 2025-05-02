import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {authPostBodySchema, AuthPostBodyType} from './authSchemas';
import { comparePassword } from "../../utils/authUtils";

async function routes (fastify: FastifyInstance) {
    fastify.post(
        '/login', 
        {
            schema: {
                body: authPostBodySchema
            }
        },
        async (request: FastifyRequest<{Body: AuthPostBodyType}>, reply: FastifyReply) => {
            const { email, password } = request.body;
            const user = await fastify.userRepository.getByEmail(email)
            if (user && await comparePassword(password, user.password)) {
                const token = fastify.jwt.sign({ email });
                return { token };
            } else {
                reply.code(401).send({ message: 'Invalid password' });
            }
        });
}

export default routes;