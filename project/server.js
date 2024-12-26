const http = require('http');
const fs = require('fs');
var formidable = require('D:\\node-v18.19.0-win-x64\\node_global\\node_modules\\formidable');
const path = require('path');

http.createServer((req, res) => {
    if (req.url === '/') {
        // 返回 HTML 页面
        const filePath = path.join(__dirname, 'uploadpdf.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Error reading HTML file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading HTML file.');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/fileupload' && req.method.toLowerCase() === 'post') {
        const form = new formidable.IncomingForm();

        // 设置上传目录
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        form.uploadDir = uploadDir;
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error parsing the file.');
                return;
            }

            console.log('Fields:', fields); // 调试用
            console.log('Files:', files);   // 调试用

            const uploadedFile = files.filetoupload;
            if (!uploadedFile) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('No file uploaded.');
                return;
            }

            const oldPath = uploadedFile.filepath;
            const newPath = path.join(uploadDir, uploadedFile.originalFilename);

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error('Error moving file:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error moving the file.');
                    return;
                }

                console.log('File uploaded successfully!');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('File uploaded successfully!');
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}).listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
