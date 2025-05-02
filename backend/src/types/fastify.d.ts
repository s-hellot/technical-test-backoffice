import { FastifyInstance } from 'fastify'
import { UserRepository } from '../repository/userRepository';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>
    userRepository: UserRepository
  }
}