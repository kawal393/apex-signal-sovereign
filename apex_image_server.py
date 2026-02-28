#!/usr/bin/env python3
"""
APEX Image Server - Allows sharing images with the AI
Run this, then drag & drop images to see them
"""
import http.server
import socketserver
import os
import json
from pathlib import Path
from urllib.parse import urlparse, parse_qs

PORT = 9999
UPLOAD_DIR = Path(__file__).parent / "shared_images"

# Create upload directory
UPLOAD_DIR.mkdir(exist_ok=True)

class ImageHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>APEX Image Share</title>
                <style>
                    body { 
                        font-family: system-ui; 
                        max-width: 800px; 
                        margin: 50px auto; 
                        padding: 20px;
                        background: #000;
                        color: #fff;
                    }
                    .drop-zone {
                        border: 2px dashed #666;
                        padding: 50px;
                        text-align: center;
                        margin: 20px 0;
                    }
                    .drop-zone.dragover {
                        border-color: #00ff88;
                        background: #001100;
                    }
                    .gallery {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, 200px);
                        gap: 20px;
                        margin-top: 30px;
                    }
                    .gallery img {
                        width: 100%;
                        border-radius: 8px;
                    }
                    .gallery a {
                        color: #00ff88;
                        text-decoration: none;
                    }
                    h1 { color: #00ff88; }
                </style>
            </head>
            <body>
                <h1>📸 APEX Image Share</h1>
                <p>Drop images here to share with AI</p>
                <div class="drop-zone" id="dropZone">
                    Drop image here or click to upload
                    <input type="file" id="fileInput" accept="image/*" style="display:none">
                </div>
                <div class="gallery" id="gallery"></div>
                <script>
                    const dropZone = document.getElementById('dropZone');
                    const fileInput = document.getElementById('fileInput');
                    
                    dropZone.onclick = () => fileInput.click();
                    
                    dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('dragover'); };
                    dropZone.ondragleave = () => dropZone.classList.remove('dragover');
                    
                    dropZone.ondrop = (e) => {
                        e.preventDefault();
                        dropZone.classList.remove('dragover');
                        handleFiles(e.dataTransfer.files);
                    };
                    
                    fileInput.onchange = () => handleFiles(fileInput.files);
                    
                    function handleFiles(files) {
                        for (const file of files) {
                            const formData = new FormData();
                            formData.append('image', file);
                            
                            fetch('/upload', {
                                method: 'POST',
                                body: formData
                            }).then(r => r.json()).then(data => {
                                if (data.url) {
                                    addToGallery(data.url, file.name);
                                }
                            });
                        }
                    }
                    
                    function addToGallery(url, name) {
                        const gallery = document.getElementById('gallery');
                        const div = document.createElement('div');
                        div.innerHTML = `<a href="${url}" target="_blank"><img src="${url}"><br>${name}</a>`;
                        gallery.prepend(div);
                    }
                    
                    // Load existing images
                    fetch('/list').then(r => r.json()).then(files => {
                        files.forEach(f => addToGallery('/images/' + f, f));
                    });
                </script>
            </body>
            </html>
            """
            self.wfile.write(html.encode())
        
        elif self.path == '/upload':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                # Get filename from Content-Disposition
                import cgi
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={
                        'REQUEST_METHOD': 'POST',
                        'CONTENT_TYPE': self.headers.get('Content-Type'),
                    }
                )
                if 'image' in form:
                    file_item = form['image']
                    filename = os.path.basename(file_item.filename)
                    # Add timestamp to make unique
                    import time
                    unique_name = f"{int(time.time())}_{filename}"
                    filepath = UPLOAD_DIR / unique_name
                    filepath.write_bytes(file_item.file.read())
                    self.wfile.write(json.dumps({
                        'success': True, 
                        'url': f'/images/{unique_name}',
                        'filename': unique_name
                    }).encode())
                    return
            
            self.wfile.write(json.dumps({'success': False}).encode())
        
        elif self.path == '/list':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            files = [f.name for f in UPLOAD_DIR.iterdir() if f.is_file()]
            self.wfile.write(json.dumps(files).encode())
        
        else:
            # Serve images
            super().do_GET()
    
    def log_message(self, format, *args):
        print(f"[APEX Image] {format % args}")

print(f"""
╔══════════════════════════════════════════════════════════════╗
║           📸 APEX IMAGE SERVER RUNNING                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Open in browser: http://localhost:{PORT}                   ║
║                                                              ║
║   Drop images here, then share the URL with AI              ║
║   AI can fetch: http://localhost:{PORT}/images/filename      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
""")

with socketserver.TCPServer(("", PORT), ImageHandler) as httpd:
    httpd.serve_forever()
