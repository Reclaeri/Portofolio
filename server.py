"""Local static server that serves ES modules with the required JavaScript MIME type."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


class PortfolioHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript; charset=utf-8",
        ".mjs": "text/javascript; charset=utf-8",
        ".svg": "image/svg+xml",
    }


if __name__ == "__main__":
    os.chdir(Path(__file__).resolve().parent)
    host, port = "127.0.0.1", 8000
    print(f"Portfolio available at http://{host}:{port}")
    ThreadingHTTPServer((host, port), PortfolioHandler).serve_forever()
