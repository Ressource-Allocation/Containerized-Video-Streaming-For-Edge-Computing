//Web server node js => Serve HLS files
//Author : NB
//browse to to http://<hostname>:PORT/ eg. http://localhost:8000

var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var zlib = require('zlib');
var ffmpeg = require('fluent-ffmpeg')

//Http port
PORT = 8000

//Send index.html pagel
function sendIndexHtml(response){
	pathname = '/index.html';		
	fs.readFile(pathname.substr(1), (err, data) => {
	if (err) {
		console.error(err);
		response.writeHead(404, { 'Content-Type': 'text/plain' });
		response.write('404 - file not found');
      	} else {
		console.log(pathname.substr(1));
		response.writeHead(200, { 'Content-Type': 'text/html' });
		response.write(data.toString());
      		}
	response.end();
  	})
}

//Send list of files in /catalogue
function sendListOfFiles(response){
  let uploadDir = path.join(__dirname, 'catalogue');
  fs.readdir(uploadDir, (err, files) => {
    if(err){
      console.log(err);
      response.writeHead(400, {'Content-Type': 'application/json'});
      response.write(JSON.stringify(err.message));
      response.end();
    }else{
      console.log('Sending list of files in /catalogue');
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.write(JSON.stringify(files));
      response.end();
    }
  })
}

//Send file not found
function FileNotFound(response, filename){
	console.log('File not found: ' + filename);
	response.writeHead(404, { 'Content-Type': 'text/plain' });
	response.write('File not found: %s\n', filename);
	response.end(); 
}
//Create web server
http.createServer(function (request, response) {
	var uri = url.parse(request.url).pathname;

	if (uri == '/') {
		sendIndexHtml(response);

	}else if (uri === '/list'){
		sendListOfFiles(response)

	}else{
		var filename = path.join("./", uri);
		fs.exists(filename, function (exists) {
		if (!exists) {
			FileNotFound(response, filename)
		} else {
			console.log('Sending file: ' + filename);
			switch (path.extname(uri)) {
			case '.m3u8':
				fs.readFile(filename, function (err, contents) {
				if (err) {
					response.writeHead(500);
					response.end();
				} else if (contents) {
					response.writeHead(200,{'Content-Type':
					'application/vnd.apple.mpegurl'});
					var ae = request.headers['accept-encoding'];
					if (ae.match(/\bgzip\b/)) {
						zlib.gzip(contents, function (err, zip) {
						if (err) throw err;
						response.writeHead(200,
							{'content-encoding': 'gzip'});
							response.end(zip);
							});
						} else {
							response.end(contents, 'utf-8');
							}
						} else {
							console.log('Emptly playlist');
							response.writeHead(500);
							response.end();
						}
					});
					break;
			case '.ts':
				response.writeHead(200, { 'Content-Type':
				'video/MP2T' });
				var stream = fs.createReadStream(filename,
				{ bufferSize: 64 * 1024 });
				stream.pipe(response);
				break;
			default:
				console.log('Unknown file type: ' +
				path.extname(uri));
				response.writeHead(500);
				response.end();
			}
		}
	});
}
}).listen(PORT);
console.log('Node.js HLS server running on port ' + PORT);
