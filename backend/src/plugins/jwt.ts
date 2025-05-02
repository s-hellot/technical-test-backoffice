import fastifyPlugin from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';


async function jwtPlugin(fastify: FastifyInstance) {
    fastify.register(fastifyJwt, {
        secret: 'supersecret'
      })
      
    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })

}

export default fastifyPlugin(jwtPlugin)