import http.server
import socketserver
import mimetypes

PORT = 8080

# Ensure .js files are served as application/javascript (or text/javascript)
# Windows registry often defaults .js to text/plain, which breaks ES Modules.
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    ".js": "application/javascript",
})

print(f"Serving HTTP on 0.0.0.0 port {PORT} with fixed MIME types...")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()
