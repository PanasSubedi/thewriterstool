from flask import Flask

app = Flask(__name__)

from page_routes import *
from tab_routes import *

if __name__ == '__main__':
    app.run(debug=True)
