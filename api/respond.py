from flask import Response, json

def respond(response, status_code):
    return Response(
        response=json.dumps(response),
        status=status_code,
        mimetype='application/json'
    )
