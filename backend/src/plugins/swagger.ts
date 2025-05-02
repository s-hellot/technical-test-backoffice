import { FastifyInstance } from "fastify";
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPlugin from 'fastify-plugin'

async function swaggerPlugin(fastify: FastifyInstance) {
    fastify.register(fastifySwagger, {
        openapi: {
          info: {
            title: "Backoffice",
            description: 'Documentation for backoffice',
            version: '1.0.0'
          },
          components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            }
          },
          security: [
            { bearerAuth: [] },
          ],
        }
      })
      
    fastify.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) { next() },
            preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true
    })
}

export default fastifyPlugin(swaggerPlugin)