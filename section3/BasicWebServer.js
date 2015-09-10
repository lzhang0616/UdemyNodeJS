var http = require('http');
var fs = require('fs');
var path = require('path');
var host = '127.0.0.1';
var port = '9000';

var mimes = {
  ".html" : "text/html",
  ".css"  : "text/css",
  ".js"   : "text/javascript",
  ".gif"  : "image/gif",
  ".jpg"  : "image/jpeg",
  ".png"  : "image/png"
};

var server = http.createServer(function(req, res){
  var filepath = (req.url === '/') ? ('./index.html') : ('.' + req.url);
  var contentType = mimes[path.extname(filepath)];

  fs.exists(filepath, function(file_exists){
    if (file_exists) {
      // Read and Serve
      // fs.readFile(filepath, function(error, content){
      //   if (error) {
      //     res.writeHead(500);
      //     res.end();
      //   } else {
      //     res.writeHead(200, { 'Content-Type' :contentType });
      //     res.end(content, 'utf-8');
      //   }
      // })

      res.writeHead(200, {'Content-Type' : contentType});
      var streamFile = fs.createReadStream(filepath).pipe(res);

      streamFile.on('error', function(){
        res.writeHead(500);
        res.end();
      })
    } else {
      res.writeHead(404);
      res.end("Sorry we could not find the file you requested !");
    }
  })
}).listen(port, host, function(){
  console.log('Server Running on http://' + host + ':' + port);
});
