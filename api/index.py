import json
from http.server import BaseHTTPRequestHandler
from api.contact import handler as ContactHandler

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = {
            "status": "healthy",
            "service": "Sensora API",
            "version": "1.0.0",
            "endpoints": {
                "/api": "Sensora API Status (GET)",
                "/api/contact": "Sensora Contact Form Processing (POST, GET)"
            }
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        # Route POST directly through ContactHandler
        ContactHandler.do_POST(self)

app = handler
application = handler
