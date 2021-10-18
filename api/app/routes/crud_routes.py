from flask import request
from app.respond import respond, respond_with_pagination

from app import app
from app.mongoapi import MongoAPI

from app.helpers.cleanup_input import cleanup_input

from collections import namedtuple

CRUD_COLLECTIONS = ['pages', 'tabs']

# note: digit values are automatically converted to int on create or update
REQUIRED_FIELDS = {
    'pages': ['title', 'tab_id', 'type'],
    'tabs': ['title', 'singular', 'page_id']
}

UPDATEABLE_FIELDS = {
    'pages': ['title', 'text'],
    'tabs': ['title', 'singular']
}

WRITEABLE_FIELDS = {
    'pages': ['text'],
    'tabs': []
}

NON_MODIFIABLE = {
    'pages': [0],
    'tabs': [1, 2]
}

existence_check = namedtuple('ExistenceCheck', ['collection', 'field_name'])
# collection to search the data in
# field_name in which the data is stored

EXISTENCE_CHECKS_BEFORE_DELETE = {
    'pages': [existence_check('tabs', 'page_id')],
    'tabs': [existence_check('pages', 'tab_id')]
}

@app.route('/api/<collection>/<id>', methods=['DELETE'])
def delete_object(collection, id):
    id = int(id)

    if collection not in CRUD_COLLECTIONS:
        return respond({'error': 'Page not found'}, 404)

    if id in NON_MODIFIABLE[collection]:
        return respond({'error': 'Cannot be modified'}, 400)

    db = MongoAPI(collection)
    if not db.exists({'_id': id}):
        return respond({'error': 'The collection has no record with the provided ID'}, 400)

    for check in EXISTENCE_CHECKS_BEFORE_DELETE[collection]:
        child_db = MongoAPI(check.collection)
        if child_db.exists({check.field_name: id}):
            return respond({'error': 'Please first remove all the {} for this entity'.format(check.collection)}, 400)

    response = db.delete({'_id': id})
    return respond(response, 200)

@app.route('/api/<collection>/<id>', methods=['PUT'])
def update_object(collection, id):
    id = int(id)

    if collection not in CRUD_COLLECTIONS:
        return respond({'error': 'Page not found'}, 404)

    if id in NON_MODIFIABLE[collection]:
        return respond({'error': 'Cannot be modified'}, 400)

    data = request.json
    if data is None or data == {}:
        return respond({'error': 'Please provide the data to update'}, 400)

    db = MongoAPI(collection)
    if not db.exists({'_id': id}):
        return respond({'error': 'The collection has no record with the provided ID'}, 400)

    content_to_update = {}
    for field_name in UPDATEABLE_FIELDS[collection]:
        if field_name in data:
            content_to_update[field_name] = int(data[field_name]) if type(data[field_name]) == str and data[field_name].isdigit() else data[field_name]

    (status, final_data) = cleanup_input(collection, content_to_update)

    if not status:
        return respond(final_data, 400)

    if len(content_to_update) > 0:
        response = db.update({'_id': id}, final_data)
        return respond(response, 200)
    else:
        return respond({'error': 'You can only update {} for {}'.format(', '.join(UPDATEABLE_FIELDS[collection]), collection)}, 400)

@app.route('/api/<collection>', methods=['POST'])
def add_object(collection):
    if collection not in CRUD_COLLECTIONS:
        return respond({'error': 'Page not found'}, 404)

    data = request.json
    if data is None or data == {}:
        return respond({'error': 'Please provide the data to add'}, 400)

    content_to_add = {}

    for field_name in REQUIRED_FIELDS[collection]:
        if field_name not in data:
            return respond({'error': 'Please provide {}'.format(field_name)}, 400)
        else:
            content_to_add[field_name] = int(data[field_name]) if type(data[field_name]) == str and data[field_name].isdigit() else data[field_name]

    for field_name in WRITEABLE_FIELDS[collection]:
        if field_name in data:
            content_to_add[field_name] = int(data[field_name]) if type(data[field_name]) == str and data[field_name].isdigit() else data[field_name]

    (status, final_data) = cleanup_input(collection, content_to_add)

    if not status:
        return respond(final_data, 400)

    db = MongoAPI(collection)
    response = db.write(final_data)
    return respond(response, 200)

@app.route('/api/<collection>/<id>', methods=['GET'])
def get_object(collection, id):
    if collection not in CRUD_COLLECTIONS:
        return respond({'error': 'Page not found'}, 404)

    db = MongoAPI(collection)
    response = db.read_one(id)
    return respond(response, 200)

@app.route('/api/<collection>', methods=['GET'])
def get_objects(collection):

    if collection not in CRUD_COLLECTIONS:
        return respond({'error': 'Page not found'}, 404)

    page = int(request.args.get('page', 1))
    per_page = app.config['ITEMS_PER_PAGE']

    db = MongoAPI(collection)

    total, data = db.read(page=page, per_page=per_page)

    return respond_with_pagination(total, data, collection, page, per_page, 200)
