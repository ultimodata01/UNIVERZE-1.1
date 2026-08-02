import http.server
import socketserver
import json
import sys
import os
import cgi
from urllib.parse import parse_qs, urlparse

PORT = 12345

class BridgeHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stderr.write("[Bridge] %s - %s\n" % (self.address_string(), format % args))

    def _send_json(self, code, payload):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/connect':
            self._send_json(200, {'status': 'connected', 'bridge': 'univerze', 'version': '1.1'})
        elif parsed.path == '/ping':
            self._send_json(200, {'pong': True})
        elif parsed.path == '/status':
            self._send_json(200, {'running': True, 'port': PORT})
        else:
            self._send_json(404, {'error': 'not found'})

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            data = json.loads(body.decode('utf-8'))
        except Exception:
            data = {}

        if parsed.path == '/ai':
            self._send_json(200, {
                'received': True,
                'source': data.get('source', 'unknown'),
                'prompt': data.get('prompt', ''),
                'response': 'Univerze bridge received your AI payload.'
            })
        elif parsed.path == '/unity':
            self._send_json(200, {'forwarded_to_unity': True, 'payload': data})
        else:
            self._send_json(404, {'error': 'not found'})

def run(port=PORT):
    with socketserver.TCPServer(('', port), BridgeHandler) as httpd:
        print(f'[Bridge] Listening on http://localhost:{port}')
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n[Bridge] Shutting down.')
            httpd.shutdown()

if __name__ == '__main__':
    p = PORT
    if len(sys.argv) > 1:
        try:
            p = int(sys.argv[1])
        except ValueError:
            pass
    run(p)