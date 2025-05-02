import { UserGetParamsType, UserListQueryType, UserPostBodyType, UserPutBodyType, userGetParamsSchema, userListQuerySchema, userPostBodySchema, userPutBodySchema, userResponseSchema } from "./userSchemas";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function routes (fastify: FastifyInstance) {
    const { userRepository } = fastify;

    fastify.get(
        '/ping',
        async (request: FastifyRequest, reply: FastifyReply) => {
            return 'hello world';
        }
    );


    fastify.get(
        '/users',
        {
            onRequest: [fastify.authenticate],
            schema: {
                querystring: userListQuerySchema,
                response: {
                    200: {
                        type: 'array',
                        items: userResponseSchema
                    }    
                }
            }
        },
        async (request: FastifyRequest<{Querystring: UserListQueryType}>, reply: FastifyReply) => {
            const { search, sortBy = 'lastName', sortOrder = 'asc' } = request.query;
            return await userRepository.searchAndFilter(search, sortBy, sortOrder);
        }
    )

    fastify.get(
        '/users/:userId', 
        {
            onRequest: [fastify.authenticate],
            schema: {
                params: userGetParamsSchema,
                response: {
                    200: userResponseSchema,
                    404: {           
                        description: 'User not found',
                        type: 'object',
                        properties: {
                          message: { type: 'string' }
                        }
                    }
                }
            }
        }, 
        async (request: FastifyRequest<{ Params: UserGetParamsType}>, reply: FastifyReply) => {
            const result = await userRepository.get(request.params.userId)
            return result ? result : reply.callNotFound()
        }
    )

    fastify.post(
        '/users',
        {
            onRequest: [fastify.authenticate],
            schema: {
                body: userPostBodySchema,
                response: {
                    200: userResponseSchema,
                }
            }
        },
        async (request: FastifyRequest<{Body: UserPostBodyType}>, reply: FastifyReply) => {
            return await userRepository.insert(request.body)
        }
    )

    fastify.put(
        '/users/:userId', 
        {
            onRequest: [fastify.authenticate],
            schema: {
                body: userPutBodySchema,
                response: {
                    200: userResponseSchema,
                    404: {
                        description: 'User not found',
                        type: 'object',
                        properties: {
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        async (request: FastifyRequest<{Body: UserPutBodyType}>, reply: FastifyReply) => {
            const result = await userRepository.updateOne(request.body.id, request.body)
            return result ? result : reply.callNotFound()
        }
    )

    fastify.delete(
        '/users/:userId', 
        {
            onRequest: [fastify.authenticate],
            schema: {
                body: userPutBodySchema,
                response: {
                    204: {
                        description: 'User deleted successfully',
                        type: 'null'
                    },
                    404: {
                        description: 'User not found',
                        type: 'object',
                        properties: {
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        async (request: FastifyRequest<{Body: UserPutBodyType}>, reply: FastifyReply) => {
            const result = await userRepository.deleteOne(request.body.id)
            return result ? reply.code(204).send() : reply.callNotFound()
        }
    )
}

export default routes;