from respond import respond

from thewriterstool import app, DATABASE
from mongoapi import MongoAPI

@app.route('/api/initializeDatabase', methods=['GET'])
def initialize_database():
    pages_db = MongoAPI(DATABASE, 'pages')
    if not pages_db.exists({'_id': 0}):
        pages_db.write_raw({'_id': 0, 'title': 'The Writer\'s Tool', 'type': 'list'})

        tabs_db = MongoAPI(DATABASE, 'tabs')
        tabs_db.write({'title': 'Stories', 'singular': 'Story', 'page_id': 0})
        tabs_db.write({'title': 'Ideas', 'singular': 'Idea', 'page_id': 0})

    return respond({}, 200)
