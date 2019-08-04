import os
import gevent.pywsgi
import json
import logging

from elasticsearch import Elasticsearch
from flask import Flask
from platformshconfig import Config

#logging.basicConfig(level=logging.DEBUG) 

logger = logging.getLogger(__name__)

config = Config()

if config.is_valid_platform():
    port = int(config.port)
    esCredentials = config.credentials('elasticsearch')
    print(esCredentials)
    esHost = "http://" + esCredentials.host + ":" + esCredentials.port
else:
    port = int(os.getenv('PORT', 3000))
    esHost = os.getenv('ELASTICSEARCH_HOST', 'http://localhost:9288')

app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    return "Hello, World yay!"


if __name__ == "app":
    http_server = gevent.pywsgi.WSGIServer(('127.0.0.1', port), app)
    http_server.serve_forever()