module.exports = function (express, app, formidable, fs, os) {
  var router = express.Router();

  router.get('/', function (req, res, next) {
    res.render('index', {host:app.get('host')});
  });

  router.post('/upload', function (req, res, next) {
    // File upload
    function generateFileName(filename) {
      var ext_regex = /(?:\.([^.]+))?$/;
      var ext = ext_regex.exec(filename)[1];
      var date = new Date().getTime();
      var charBank = "abcdefghijklmnopqrstuvwxyz";
      var fstring = '';
      for (var i = 0; i < 15; i++) {
        fstring += charBank[parseInt(Math.random()*26)];
      }
      return (fstring += date + '.' + ext);
    }

    var tmpFile, nfile, fname;
    var newForm = new formidable.IncomingForm();
    newForm.keepExtensions = true;
    newForm.parse(req, function (err, fields, files) {
      tmpFile = files.upload.path;
      fname = generateFileName(files.upload.name);
      nfile = os.tmpDir() + '/' + fname;
      res.writeHead(200, {'content-type':'text/plain'});
      res.end();
    });

    newForm.on('end', function () {
      fs.rename(tmpFile, nfile, function () {
        // Resize the image and upload this file into the S3 bucket
        
      });
    })
  });

  app.use('/', router);
}
