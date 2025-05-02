import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'
import { FastifyInstance } from 'fastify'

async function dbConnector(fastify: FastifyInstance) {
    fastify.register(fastifyMongo, {
        url: 'mongodb://root:example@mongo:27017/backoffice?authSource=admin'
    })
}

export default fastifyPlugin(dbConnector)