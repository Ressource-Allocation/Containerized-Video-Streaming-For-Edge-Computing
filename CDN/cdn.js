//Web server node js => Serve HLS files
//Author : N.B
//browse to to eg. http://localhost:8000 , http://localhost:8000/list , http://localhost:8000/playlist_name.m3u8

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
	//Deleting the files with no m3u8 extension from the list
	for( var i = 0; i < files.length; i++){ 
	   if ( path.extname(files[i]) != ".m3u8") {
	     files.splice(i, 1); 
	     i--;
	   }
	}
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
	response.write('File not found: ' + JSON.stringify(filename));
	response.end(); 
}

//Send page not found
function PageNotFound(response, pagename){
	console.log('Page not found: ' + pagename);
	response.writeHead(404, { 'Content-Type': 'text/plain' });
	response.write('This is not the page you are looking for.');
	response.end(); 
}
//Create web server
http.createServer(function (request, response) {
	var uri = url.parse(request.url).pathname;

	if (uri == '/' || uri == '/index.html' ) {
		sendIndexHtml(response);

	}else if (uri === '/list'){
		sendListOfFiles(response)
		console.log('Sending list of files in /catalogue');
	}else{
		var filename = path.join("./", uri);
		if (path.extname(filename) === "") {
			fs.exists(filename, function (exists) {
				if (!exists) {
				PageNotFound(response, filename)
				}
			});
		} else {
			fs.exists(filename, function (exists) {
			if (!exists) {
				FileNotFound(response, filename)	
			} else{
			console.log('Sending file: ' + filename);
			switch (path.extname(uri)) {
			case '.m3u8':
				fs.readFile(filename, function (err, contents) {
				if (err) {
   					console.log('error ' + filename);
					response.writeHead(500);
					response.end();
				} else if (contents) {
					response.writeHead(200,{'Content-Type':
					'application/vnd.apple.mpegurl'});
					var regx = request.headers['accept-encoding'];
					if (regx.match(/\bgzip\b/)) {
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
							console.log('The playlist is empty !');
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
 }
}).listen(PORT);
console.log('Node.js HLS server running on port ' + PORT);
