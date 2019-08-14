import os
import re
import gevent.pywsgi
import json
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import logging

from dotenv import load_dotenv
from kafka import KafkaConsumer, KafkaProducer
from elasticsearch import Elasticsearch
from platformshconfig import Config

load_dotenv(verbose=True)
logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

config = Config()

if config.is_valid_platform():
    googleApiKey = config.variable('GOOGLE_API_KEY')
    kafkaCredentials = config.credentials('kafka')
    esCredentials = config.credentials('elasticsearch')
    esHost = "http://" + esCredentials['host'] + ":" + str(esCredentials['port'])
    brokers = kafkaCredentials['host'] + ":" + str(kafkaCredentials['port'])
else:
    port = int(os.getenv('PORT', 3000))
    brokers = os.getenv('KAFKA_HOST', 'kafka:9092')
    esHost = os.getenv('ELASTICSEARCH_HOST', 'http://localhost:9200')
    googleApiKey = os.getenv('GOOGLE_API_KEY', '')
    
consumer = KafkaConsumer('NewUrl',  group_id='videos-group',  bootstrap_servers=[brokers])
producer = KafkaProducer(bootstrap_servers=[brokers], value_serializer=lambda v: json.dumps(v).encode('utf-8'))

pattern = re.compile("(.*)\.youtube\.com\/watch\?v=(.*)")
youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=googleApiKey)
elasticsearch = Elasticsearch(esHost)

for msg in consumer:    
   themessage = json.loads(msg.value.decode('utf-8'))
   url = themessage['url']
   matches = pattern.match(url)
   if matches:
       ytId = matches.group(2)
       request = youtube.videos().list(
         part="snippet,contentDetails,statistics",
         id=ytId
       )
       response = request.execute()
       item = response['items'][0]
       ytid = response['items'][0]['id']

       res = elasticsearch.index(index="youtube", id=ytid, body=item)
       #print(res)
       dic = {
           "type": "youtube",
            "url": url,
            "content": item
       }
       #msg =  json.dumps(dic, ensure_ascii=False)
       producer.send('NewContent', dic)
      
   else:
       print("not yt")