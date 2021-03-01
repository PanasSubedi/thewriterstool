from respond import respond

from writersfriend import app, DATABASE
from mongoapi import MongoAPI

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
