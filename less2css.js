var http = require("http");
var url = require("url");
var multipart = require("c:/program files/nodejs/node_modules/multipart");
var util = require("util");
var fs = require("fs");
var less = require("c:/program files/nodejs/node_modules/less");
var log = require("c:/program files/nodejs/node_modules/ain");

var server = http.createServer(function(req, res) {
    // Simple path-based request dispatcher
    switch (url.parse(req.url).pathname) {
        case '/':
            display_form(req, res);
            break;
        case '/upload':
            upload_file(req, res);
            break;
        default:
            show_404(req, res);
            break;
    }
});

// Server would listen on port 8000
server.listen(8000);

/*
 * Display upload form
 */
function display_form(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(
        '<form action="/upload" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="upload-file">'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
    res.end();
}

/*
 * Create multipart parser to parse given request
 */
function parse_multipart(req) {
    var parser = multipart.parser();

    // Make parser use parsed request headers
    parser.headers = req.headers;

    // Add listeners to request, transfering data to parser

    req.addListener("data", function(chunk) {
        parser.write(chunk);
    });

    req.addListener("end", function() {
        parser.close();
    });

    return parser;
}

/*
 * Handle file upload
 */
function upload_file(req, res) {
    // Request body is binary
    req.setEncoding("binary");

    // Handle request as multipart
    var stream = parse_multipart(req);

    var fileName = null;
    var data = "";

    // Set handler for a request part received
    stream.onPartBegin = function(part) {
        util.debug("Started part, name = " + part.name + ", filename = " + part.filename);
        log.log("Started part, name = " + part.name + ", filename = " + part.filename);
        // Construct file name
        fileName = "./uploads/" + stream.part.filename;
    };

    // Set handler for a request part body chunk received
    stream.onData = function(chunk) {
        // Pause receiving request data (until current chunk is written)
        req.pause();

        // Write chunk to file
        // Note that it is important to write in binary mode
        // Otherwise UTF-8 characters are interpreted
        util.debug("Writing chunk");
        log.log("Writing chunk");
        
        data += chunk;
    };

    // Set handler for request completed
    stream.onEnd = function() {
        var parser = new(less.Parser);

        parser.parse(data, function (err, tree) {
            if (err) { 
                show_500(req, res, err); 
                util.debug("Error = " + err);
                log.error("Error = " + err);
                return ;
            }
            upload_complete(res, tree.toCSS());
        });
        
        /*
        less.render('.class { width: 1 + 1 }', function (e, css) {
            console.log(css);
        });
        */
        
    
    };
}

function upload_complete(res, data) {
    util.debug("Request complete");
    log.log("Request complete");

    // Render response
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(data);
    res.end();

    util.puts("\n=> Done");
}

/*
 * Handles page not found error
 */
function show_404(req, res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("You r doing it rong!");
    res.end();
}

/*
 * Handles page not found error
 */
function show_500(req, res, msg) {
    res.writeHead(500, {"Content-Type": "text/plain"});
    res.write(msg);
    res.end();
}