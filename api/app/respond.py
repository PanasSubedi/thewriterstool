from flask import Response, json

def respond_with_pagination(total, data, collection, page, per_page, status_code=200):

    prev_page = '/api/{}?page={}'.format(collection, page-1) if page > 1 else None
    next_page = '/api/{}?page={}'.format(collection, page+1) if page * per_page < total else None

    response = {}
    response['links'] = {
        'self': '/api/{}?page={}'.format(collection, page),
        'prev_page': prev_page,
        'next_page': next_page,
    }
    response['total_items'] = total
    response['items'] = data

    return respond(response, 200)

def respond(response, status_code=200):
    return Response(
        response=json.dumps(response),
        status=status_code,
        mimetype='application/json'
    )
