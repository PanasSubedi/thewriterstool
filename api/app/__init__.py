from flask import Flask
from config import Config

import os

app = Flask(__name__, static_folder=os.path.join('client', 'build'), static_url_path='')
app.config.from_object(Config)

from app.routes import crud_routes, routes
from app import errors
