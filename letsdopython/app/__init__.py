import os
import gevent.pywsgi

from flask import Flask
from platformshconfig import Config

app = Flask(__name__)
from app import routes

config = Config()

if config.is_valid_platform():
    port = int(config.port)
else:
    port = int(os.getenv('PORT', 3000))

if __name__ == "app":
    http_server = gevent.pywsgi.WSGIServer(('127.0.0.1', port), app)
    http_server.serve_forever()