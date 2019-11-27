//Fluent ffmpeg function for converting video files to HLS format
//Author : NB

var path = require('path');
var ffmpeg = require('fluent-ffmpeg')
var fs = require('fs');

// FFmpeg convert function 
var ffmpegHLS = function (inputPath, outputPath, cb) {
  return ffmpeg(inputPath, { timeout: 432000 }).addOptions([
    '-profile:v baseline',
    '-level 3.0',
    '-s 640x360',
    '-start_number 0',
    '-hls_time 10',
    '-hls_list_size 0',
    '-f hls'
  ]).output(outputPath).on('start', function() {
        console.log('Start processing file: '+ inputPath)
    }).on('progress', function(progresspercent) {
        console.log('Processing: ' + progresspercent.percent + '% done')
    }).on('end', function() {
        console.log('Finished processing file : ' + inputPath)
	console.log(outputPath + ' recorded in /HLS.\n')
    }).run() 
}


//Convert all files in  directory
const directoryPath = path.join(__dirname, "test")
 
fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.log("Error getting directory information.")
  }else {
    console.log('\nStart converting files ... : \n')
    files.forEach(function(file) {
	switch (path.extname(file)) {
		case '.mp4':
			ffmpegHLS(file, 'out.m3u8', function () {
				return ;
			})
		break;
	case '.m3u8':
		console.log('The file : '+ file +' is already in HLS format.' )
		console.log(file +': Conversion Aborted.\n' )
		break;
	default:
		console.log('Unknown extension type in file : ' + file)
		console.log(file +': Conversion Aborted.\n' )
	}
  }); 
 }
});  
