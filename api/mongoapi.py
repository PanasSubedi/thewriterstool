from pymongo import MongoClient
from flask import json

from thewriterstool import DATABASE_HOST

class MongoAPI:

    def __init__(self, database, collection):
        self.client = MongoClient(DATABASE_HOST)

        self.cursor = self.client[database]
        self.collection = self.cursor[collection]
        self.collection_name = collection

    def exists(self, filter):
        return self.collection.count_documents(filter) > 0

    def read_one(self, id):
        if self.collection.count_documents({'_id': int(id)}) < 1:
            return {'error': 'No document found'}
        else:
            return self.collection.find({'_id': int(id)})[0]

    def read(self, filter=None):
        documents = self.collection.find(filter)
        output = [{item: data[item] for item in data} for data in documents]
        return output

    def write_raw(self, document):
        self.collection.insert_one(document)

    def write(self, document):

        def get_next_id(cursor, collection):
            resp = cursor['counters'].update_one({
                '_id': collection + '_id'
            }, {
                '$inc': {'sequence_value': 1}
            }, upsert=True)

            return cursor['counters'].find({'_id': collection+'_id'})[0].get('sequence_value')

        document['_id'] = get_next_id(self.cursor, self.collection_name)
        response = self.collection.insert_one(document)
        output = {
            'status': 'Successfully Inserted',
            '_id': str(response.inserted_id)
        }
        return output

    def update(self, filter, new_data):
        updated_data = {'$set': new_data}
        response = self.collection.update_one(filter, updated_data)
        output = {
            'Status': 'Successfully Updated' if response.modified_count > 0 else 'Nothing was updated.'
        }
        return output

    def delete(self, filter):
        response = self.collection.delete_one(filter)
        output = {
            'Status': 'Successfully Deleted' if response.deleted_count > 0 else 'Document not found.'
        }
        return output
