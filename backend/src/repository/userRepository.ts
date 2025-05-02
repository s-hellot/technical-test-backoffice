import {AbstractRepository} from './abstractRepository'
import { IndexSpecification, CreateIndexesOptions, ObjectId, SortDirection, Sort, Filter, OptionalId} from 'mongodb'
import { FastifyInstance } from "fastify";
import { hashPassword } from '../utils/authUtils';

type UserDocument = {
    _id?: ObjectId,
    firstName: string
    lastName: string
    email: string
    birthDate: string
    password: string
}

export class UserRepository extends AbstractRepository<UserDocument> {
    public indexes:  Array<[IndexSpecification, CreateIndexesOptions?]> = [
        [{ email: 1 }, { unique: true }],
        [{ email: -1 }, { unique: true }],
        [{ lastName: 1, firstName: 1 }, {}],
        [{ lastName: -1, firstName: -1 }, {}],
        [{ birthDate: 1 }, {}],
        [{ birthDate: -1 }, {}]
    ]

    public tableName: string = "frontoffice_users";

    
    public async initialize(fastify: FastifyInstance): Promise<void> {
        await super.initialize(fastify);
        const existing = await this.collection.findOne({ email: 'admin@admin.com' });

        // make sure there is a user to log to
        if (!existing) {
            const hashedPassword = await hashPassword('admin');
            await this.collection.insertOne({
                email: 'admin@admin.com',
                password: hashedPassword,
                firstName: 'Super',
                lastName: 'Admin',
                birthDate: '01/01/1970'
            });
            fastify.log.info('Default super user created');
        }
    }

    public async insert(document: OptionalId<UserDocument>): Promise<Omit<UserDocument, '_id'> & { id: string; }> {
        document.password = await hashPassword(document.password);
        return super.insert(document)
    }

    public async updateOne(id: string, document: Partial<UserDocument>): Promise<(Omit<UserDocument, '_id'> & { id: string; }) | null> {
        if (document.password) {
            document.password = await hashPassword(document.password);
        }
        return super.updateOne(id, document)
    }

    public async getByEmail(email: string): Promise<UserDocument | null> {
        const result = await this.getCollection().findOne({email})
        return result ? this.mapMongoId(result) : null
    }

    public async searchAndFilter(
        nameSearch: string | undefined, 
        sortBy: Sort | string = 'lastName', 
        sortOrder: SortDirection
    ) {
        let filter: Filter<UserDocument> = {}
        let trimmedSearch = nameSearch?.trim()
        if (trimmedSearch) {
            filter = {
                $or: [
                    {
                        $expr: {
                            $regexMatch: {
                            input: { $concat: ["$firstName", " ", "$lastName"] },
                            regex: trimmedSearch,
                            options: "i"
                            }
                        }  
                    },
                    {
                        email: {$regex: trimmedSearch, $options: 'i'}
                    },
                    {
                        $expr: {
                            $regexMatch: {
                            input: { $concat: ["$lastName", " ", "$firstName"] },
                            regex: trimmedSearch,
                            options: "i"
                            }
                        }  
                    },
                ]
            }
        }

        return await this.getFiltered(filter, sortBy, sortOrder)
    }

}
