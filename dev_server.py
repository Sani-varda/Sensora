import os
import sys
from urllib.parse import urlparse
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Import contact handler if available
try:
    from api.contact import handler as ContactHandler
except Exception as e:
    ContactHandler = None
    print(f"[Warning] Could not import api.contact: {e}", flush=True)

PORT = 8000

class DevServerHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        parsed = urlparse(self.path)
        if parsed.path.rstrip('/') == '/api/contact' and ContactHandler:
            ContactHandler.do_OPTIONS(self)
        else:
            self.send_response(200)
            self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path.rstrip('/') == '/api/contact' and ContactHandler:
            ContactHandler.do_POST(self)
        else:
            self.send_error(404, "Endpoint not found")

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path.rstrip('/') == '/api/contact' and ContactHandler:
            ContactHandler.do_GET(self)
            return

        local_path = self.translate_path(self.path)

        # If direct path does not exist, check if appending .html matches a file
        if not os.path.exists(local_path) and not local_path.endswith('.html'):
            if os.path.exists(local_path + '.html'):
                query_str = f"?{parsed.query}" if parsed.query else ""
                self.path = parsed.path + '.html' + query_str

        super().do_GET()

def run(port=PORT):
    for p in [port, 8080, 8081, 5000]:
        try:
            server_address = ('', p)
            httpd = HTTPServer(server_address, DevServerHandler)
            print(f"Sensora website running at: http://localhost:{p}", flush=True)
            print(f"Serving directory: {os.path.abspath(os.getcwd())}", flush=True)
            print("Ready to serve requests...", flush=True)
            httpd.serve_forever()
            break
        except OSError as e:
            if "address already in use" in str(e).lower() or e.errno == 10048:
                print(f"Port {p} is in use, trying next port...", flush=True)
                continue
            raise

# Export handler and app for compatibility
handler = DevServerHandler
app = DevServerHandler

if __name__ == '__main__':
    run()

