import { FromSchema } from "json-schema-to-ts";

export const userResponseSchema = {
    type: 'object',
    properties: {
        id: {type: 'string'},
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        birthDate: { type: 'string' },
    },
    required: ['id', 'firstName', 'lastName', 'email', 'birthDate'],
    additionalProperties: false
} as const;

export type UserResponseType = FromSchema<typeof userResponseSchema>;

export const userGetParamsSchema = {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'string' },
    },
    additionalProperties: false,
  } as const

export type UserGetParamsType = FromSchema<typeof userGetParamsSchema>


export const userPostBodySchema = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'birthDate', 'password'],
    properties: {
        firstName: { type: 'string'},
        lastName: { type: 'string'},
        email: { type: 'string', format: 'email'},
        birthDate: { type: 'string', format: 'date'},
        password: { type: 'string'}
    },
    additionalProperties: false,
} as const

export type UserPostBodyType = FromSchema<typeof userPostBodySchema>

export const userPutBodySchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'string'},
        firstName: { type: 'string'},
        lastName: { type: 'string'},
        email: { type: 'string', format: 'email'},
        birthDate: { type: 'string', format: 'date'},
        password: { type: 'string'}
    },
    additionalProperties: false,
    anyOf: [
        { required: ['firstName'] },
        { required: ['lastName'] },
        { required: ['email'] },
        { required: ['birthDate'] },
        { required: ['password'] }
    ]
} as const

export type UserPutBodyType = FromSchema<typeof userPutBodySchema>


export const userListQuerySchema = {
    type: 'object',
    properties: {
      search: { type: 'string' },
      sortBy: { type: 'string', enum: ['firstName', 'lastName', 'email', 'birthDate'] },
      sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'asc' }
    },
    additionalProperties: false
  } as const;
  
  export type UserListQueryType = FromSchema<typeof userListQuerySchema>;

export const userIdParamsSchema = {
    type: 'object',
    properties: {
        userId: { type: 'string' }
    },
    required: ['userId']
} as const;

export type UserIdParamsType = FromSchema<typeof userIdParamsSchema>;
