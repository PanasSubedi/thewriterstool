from app.respond import respond

from app import app

@app.errorhandler(404)
def not_found_error(error):
    return app.send_static_file('index.html')

@app.errorhandler(500)
def internal_error(error):
    return respond({'message': 'Internal error occurred.'}, 500)
