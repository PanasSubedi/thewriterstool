from flask import request

from respond import respond

from writersfriend import app, DATABASE
from mongoapi import MongoAPI

@app.route('/api/pages', methods=['DELETE'])
def delete_page():
    data = request.json
    if data is None or data == {}:
        return respond({"error": "Please provide delete filter"}, 400)

    db = MongoAPI(DATABASE, 'pages')
    response = db.delete(data['filter'])
    return respond(response, 200)

@app.route('/api/pages/<id>/text', methods=['PUT'])
def update_page_text(id):
    data = request.json

    if data is None or data == {}:
        return respond({'error': 'Please provide data'}, 400)

    if 'page_id' not in data or 'text' not in data:
        return respond({'error': 'Please provide page_id and text'}, 400)

    db = MongoAPI(DATABASE, 'pages')
    if not db.exists(id):
        return respond({'error': 'The page ID does not exist'}, 400)

    page = db.read_one(id)
    if page['type'] != 'text':
        return respond({'error': 'The provided page is not a text-based page.'}, 400)

    response = db.update({'_id': int(id)}, {'text': data['text']})
    return respond(response, 200)

@app.route('/pages', methods=['PUT'])
def edit_page():
    data = request.json

    if data is None or data == {}:
        return respond({'Error': 'Please provide the data to enter'}, 400)

    db = MongoAPI(DATABASE, 'pages')
    response = db.update(data['filter'], data['data'])

    return respond(response, 200)

@app.route('/api/pages', methods=['POST'])
def add_page():
    data = request.json
    if data is None or data == {}:
        return respond({'Error': 'Please provide the data to enter'}, 400)

    if 'title' not in data or 'tab_id' not in data or 'type' not in data:
        return respond({'Error': 'Please provide the title, tab_id, and type for the page'}, 400)

    db = MongoAPI(DATABASE, 'pages')
    response = db.write({
        'title': data['title'],
        'tab_id': int(data['tab_id']),
        'type': data['type']
    })
    return respond(response, 200)

@app.route('/api/pages/<id>/content', methods=['GET'])
def get_page_content(id):
    db = MongoAPI(DATABASE, 'pages')

    page = db.read_one(id)

    if 'error' in page:
        return respond(page, 400)

    response = {}

    if page['type'] == 'list':
        # gets content within the tabs
        tabsDB = MongoAPI(DATABASE, 'tabs')
        tabs = tabsDB.read({'page_id': int(id)})

        for tab in tabs:
            pages_in_tab = db.read({'tab_id': tab['_id']})
            for page_in_tab in pages_in_tab:
                response[tab['_id']] = response.get(tab['_id'], []) + [{'id': page_in_tab['_id'], 'title': page_in_tab['title']}]

    if page['type'] == 'text':
        if 'text' in page:
            response['text'] = page['text']
        else:
            response['text'] = ''

    return respond(response, 200)

@app.route('/api/pages/<id>/tabs', methods=['GET'])
def get_page_tabs(id):
    db = MongoAPI(DATABASE, 'tabs')
    response = db.read({'page_id': int(id)})

    return respond(response, 200)

@app.route('/api/pages/<id>', methods=['GET'])
def get_page(id):
    db = MongoAPI(DATABASE, 'pages')
    response = db.read_one(id)
    return respond(response, 200)

@app.route('/api/pages', methods=['GET'])
def get_pages():
    db = MongoAPI(DATABASE, 'pages')
    response = db.read()
    return respond(response, 200)
