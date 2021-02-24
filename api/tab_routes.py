from flask import Response, json, request

from respond import respond
from writersfriend import app
from mongoapi import MongoAPI

@app.route('/api/tabs', methods=['POST'])
def add_tab():
    data = request.json

    if data is None or data == {}:
        return respond({'error': 'please provide some data'}, 400)

    if 'title' not in data and 'singular' not in data and 'page_id' not in data:
        return respond({'error': 'please provided title, the singular value, and the page id of the parent'}, 400)

    pagesDB = MongoAPI('writersFriendDB', 'pages')
    if not pagesDB.exists(data['page_id']):
        return respond({'error': 'page_id is invalid'}, 400)

    tabsDB = MongoAPI('writersFriendDB', 'tabs')
    response = tabsDB.write({
            'title': data['title'],
            'singular': data['singular'],
            'page_id': int(data['page_id'])
        })

    return respond(response, 200)
