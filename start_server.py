import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    # Find free port if 8000 is busy
    port = PORT
    for attempt in range(10):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}"
                print("=" * 60)
                print(f"🔥 Rizzsembly Dating Web App is LIVE!")
                print(f"🌐 URL: {url}")
                print(f"📁 Root: {DIRECTORY}")
                print("=" * 60)
                print("Press Ctrl+C to stop the server.")
                try:
                    webbrowser.open(url)
                except Exception:
                    pass
                httpd.serve_forever()
                break
        except OSError:
            print(f"Port {port} in use, trying next port...")
            port += 1

if __name__ == "__main__":
    run()
