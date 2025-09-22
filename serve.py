#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 5174
BUILD_DIR = os.path.join(os.path.dirname(__file__), 'dist')

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BUILD_DIR, **kwargs)

    def end_headers(self):
        # Basic caching headers for static assets
        if self.path.endswith(('.js', '.css')):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        super().end_headers()

    def send_head(self):
        # Fallback to index.html for SPA routes
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            for index in ("index.html", "index.htm"):
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
        if not os.path.exists(path):
            path = os.path.join(BUILD_DIR, 'index.html')
        return http.server.SimpleHTTPRequestHandler.send_head(self)

with socketserver.TCPServer(("", PORT), SPARequestHandler) as httpd:
    print(f"Serving dist/ on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
