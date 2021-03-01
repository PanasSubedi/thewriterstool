from flask import Flask

app = Flask(__name__)

DATABASE = 'writersFriendDB'
DATABASE_HOST = 'mongodb://localhost:27017/'

from crud_routes import *
from page_routes import *
from tab_routes import *

if __name__ == '__main__':
    app.run(debug=True)
