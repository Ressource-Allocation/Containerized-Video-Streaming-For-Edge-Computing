//Web server node js => Serve HLS files
//Author : A.M
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
		consoltext/csse.error(err);
		response.writeHead(404, { 'Content-Type': 'text/plain' });
		response.write('404 - file not found');
      	} else {
		response.writeHead(200, { 'Content-Type': 'text/html' });
		response.write(data.toString());
      		}
	response.end();
  	})
}

//Send stat.html pagel
function sendStatHtml(response){
	pathname = '/stats.html';		
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


//Send stat file
function sendStatContents(response){
  let uploadDir = path.join(__dirname, 'stats');
  if (!fs.existsSync(uploadDir)){
    	fs.mkdirSync(uploadDir);
	}
  var fileLoc = path.resolve(uploadDir);
  fileLoc = path.join(fileLoc, "generated_stats.txt");
  console.log(fileLoc)

    var stream = fs.createReadStream(fileLoc);
    stream.on('error', function(error) {
    	response.writeHead(404, 'Not Found');
        response.end();
        });
    stream.pipe(response);
}

//Send list of files in /catalogue
function sendListOfFiles(response){
  let uploadDir = path.join(__dirname, 'catalogue');
  if (!fs.existsSync(uploadDir)){
    	fs.mkdirSync(uploadDir);
	}
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
      //create json objects
        var dict = {}
	var sources = []
        var videolist = []
	for( var i = 0; i < files.length; i++){ 
		dict["src"] = files[i]
		dict["type"] = "temp"
		sources.push(dict)	
	}
      console.log(JSON.stringify(dict))
      console.log(JSON.stringify(sources))
      for ( var i = 0; i < sources.length; i++){ 
		videolist["sources"] = sources[i]	
	}
      console.log(JSON.stringify(videolist))

      response.writeHead(200, {'Content-Type': 'application/json'});
      response.write(JSON.stringify(files));
      response.end();
    }
  })
}
//Send playlist of videos available on the cdn
function sendCdnPlaylist(response){
  let uploadDir = path.join(__dirname, 'catalogue');
  if (!fs.existsSync(uploadDir)){
    	fs.mkdirSync(uploadDir);
	}
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

// open the file in writing mode, adding a callback function where we do the actual writing
function OpenAndWrite(path, buffer){
	fs.open(path, 'a', function(err, fd) {
	    if (err) {
		console.log(err);
	    }
	 fs.writeFile(fd, new Buffer(buffer), (err) => {
    		if (err) throw err;
	}); 
	});
}

//Create web server
http.createServer(function (request, response) {
	var uri = url.parse(request.url).pathname;

	if (uri == '/' || uri == '/index.html' ) {
		sendIndexHtml(response);
	}else if (uri === '/list'){
		sendListOfFiles(response)
		console.log('Sending list of files in /catalogue');
	}else if (uri === '/raw_stats'){
		sendStatContents(response)
		console.log('sending stats');
	}else if (uri === '/stats'){
		sendStatHtml(response)
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
			var now = new Date();
			var jsonDate = now.toJSON();
                        OpenAndWrite("stats/generated_stats.txt", filename + ", \t"+ jsonDate + ";\n")
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
			case '.js':
				var stream = fs.createReadStream(filename,
				{ bufferSize: 64 * 1024 });
				stream.pipe(response);
				break;
			case '.css':
				var stream = fs.createReadStream(filename,
				{ bufferSize: 64 * 1024 });
				stream.pipe(response);
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
