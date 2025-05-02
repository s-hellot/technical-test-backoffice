import {AbstractRepository} from './abstractRepository'
import { IndexSpecification, CreateIndexesOptions, ObjectId, SortDirection, Sort, Filter} from 'mongodb'


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
