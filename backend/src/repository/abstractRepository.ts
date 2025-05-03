import { Collection, IndexSpecification, CreateIndexesOptions, Document } from 'mongodb'
import { FastifyInstance } from "fastify";
import {ObjectId, Filter, OptionalUnlessRequiredId, SortDirection, Sort} from 'mongodb';

export type WithId<T> = Omit<T, "_id"> & { id: string }

export abstract class AbstractRepository<T extends Document> {
    abstract indexes: Array<[IndexSpecification, CreateIndexesOptions?]>;
    abstract tableName: string;

    protected collection!: Collection<T>;

    public async initialize(fastify: FastifyInstance): Promise<void> {
        this.collection = fastify.mongo.db!.collection(this.tableName)
        for(const indexOpts of this.indexes) {
            await this.collection.createIndex(...indexOpts);
        }
    }

    public getCollection(): Collection<T> {
        return this.collection
    }

    public mapMongoId(document: any): WithId<T> {
        const { _id, ...others } = document;
        return { ...others, id: _id.toString() };    
    }

    public mapArray(documents: Array<any>): Array<WithId<T>> {
        return documents.map(this.mapMongoId)
    }

    public async getAll(): Promise<Array<WithId<T>>> {
        const result = await this.collection.find().toArray();
        return this.mapArray(result)
    }

    public async get(id: string): Promise<WithId<T> | null> {
        if (ObjectId.isValid(id)) {
            const result = await this.collection.findOne({ _id: new ObjectId(id)} as Filter<T>)
            return result ? this.mapMongoId(result) : null
        } else {
            return null
        }
    }

    public async insert(document: OptionalUnlessRequiredId<T>): Promise<WithId<T> | null> {
        const { insertedId } = await this.collection.insertOne(document)
        return await this.get(insertedId.toString())
    }

    public async updateOne(id: string, document: Partial<T>): Promise<WithId<T> | null> {
        const result = await this.collection.updateOne(
            { _id: new ObjectId(id) as Filter<T>}, 
            { $set: document }
        )
        if (result.matchedCount > 0) {
            return await this.get(id)
        } else {
            return null;
        }
    }

    public async deleteOne(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) as Filter<T>})
        return result.deletedCount > 0
    }

    public async getFiltered(
        filters: Filter<T> = {}, 
        sortBy:  Sort | string, 
        sortOrder: SortDirection = 'asc'
    ): Promise<Array<WithId<T>>> {
        const result = await this.collection.find(filters).sort(sortBy, sortOrder).toArray();
        return this.mapArray(result);
    }
}