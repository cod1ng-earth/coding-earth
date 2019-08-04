import os
import gevent.pywsgi
import json
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import logging

from kafka import KafkaConsumer
from elasticsearch import Elasticsearch
from flask import Flask
from platformshconfig import Config

#logging.basicConfig(level=logging.DEBUG) 

logger = logging.getLogger(__name__)

config = Config()

if config.is_valid_platform():
    port = int(config.port)
    googleApiKey = config.variable('GOOGLE_API_KEY')
    kafkaCredentials = config.credentials('kafka')
    esCredentials = config.credentials('elasticsearch')
    esHost = "http://" + esCredentials.host + ":" + esCredentials.port
    brokers = kafkaCredentials.host + ":" + kafkaCredentials.port
else:
    port = int(os.getenv('PORT', 3000))
    brokers = os.getenv('KAFKA_HOST', 'localhost:9092')
    esHost = os.getenv('ELASTICSEARCH_HOST', 'http://localhost:9288')
    googleApiKey = os.getenv('GOOGLE_API_KEY', '')
    
consumer = KafkaConsumer('NewUrl',  bootstrap_servers=[brokers])

for msg in consumer:
   print(msg)
    #hemessage = json.loads(message.value.decode('utf-8'))
    #logger.info(themessage)


app = Flask(__name__)
from app import routes

if __name__ == "app":
    http_server = gevent.pywsgi.WSGIServer(('127.0.0.1', port), app)
    http_server.serve_forever()