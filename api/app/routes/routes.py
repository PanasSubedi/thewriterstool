from app.respond import respond

from app import app
from app.mongoapi import MongoAPI

from flask import send_from_directory

import os

@app.route('/api/pages/<id>/content', methods=['GET'])
def get_page_content(id):
    db = MongoAPI('pages')

    page = db.read_one(id)

    if 'error' in page:
        return respond(page, 400)

    response = {}

    if page['type'] == 'list':
        # gets content within the tabs
        tabsDB = MongoAPI('tabs')
        _, tabs = tabsDB.read(filter={'page_id': int(id)})

        for tab in tabs:
            _, pages_in_tab = db.read(filter={'tab_id': tab['_id']})
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
    db = MongoAPI('tabs')
    _, data = db.read(filter={'page_id': int(id)})

    return respond(data, 200)

@app.route('/api/initializeDatabase', methods=['GET'])
def initialize_database():
    pages_db = MongoAPI('pages')
    if not pages_db.exists({'_id': 0}):
        pages_db.write_raw({'_id': 0, 'title': 'The Writer\'s Tool', 'type': 'list'})

        tabs_db = MongoAPI('tabs')
        tabs_db.write({'title': 'Stories', 'singular': 'Story', 'page_id': 0})
        tabs_db.write({'title': 'Ideas', 'singular': 'Idea', 'page_id': 0})

    return respond({}, 200)
