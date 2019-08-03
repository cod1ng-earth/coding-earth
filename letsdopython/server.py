import traceback
import uuid
import sys

from http.server import BaseHTTPRequestHandler, HTTPServer

from platformshconfig import Config
config = Config()

class myHandler(BaseHTTPRequestHandler):

    def do_GET(self):

        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.end_headers()
        self.wfile.write(bytes(str('hello'), "utf8"))
        return

if __name__ == "__main__":
    server_address = ('127.0.0.1', int(config.port))
    httpd = HTTPServer(server_address, myHandler)
    httpd.serve_forever()
