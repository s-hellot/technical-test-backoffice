import { FromSchema } from "json-schema-to-ts";


export const authPostBodySchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {type: 'string'},
        password: {type: 'string'},
    },
    additionalProperties: false,
} as const

export type AuthPostBodyType = FromSchema<typeof authPostBodySchema>
