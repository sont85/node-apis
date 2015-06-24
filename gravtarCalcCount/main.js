var fs = require("fs"),
    http = require("http"),
    request = require('request'),
    url = require('url'),
    exec = require("child_process").exec,
    md5 = require("MD5");

var math = {
  "+": function(a,b) {
    return a+b;
  },
    "-": function(a,b) {
    return a-b;
  },
    "*": function(a,b) {
    return a*b;
  },
    "/": function(a,b) {
    return a/b;
  }
}
http.createServer(responseHandler).listen(8888);
function responseHandler(req, res) {
  if (req.url.match("fav")) {
    res.end("");
    return;
  }
  req.url = req.url.toLowerCase()
  if (req.url === "/") {
    res.writeHead(200, {"Content-Type": "text/html"});
    fs.readFile('index.html', 'utf8', function (err,data) {
      res.end(data);
    });
  } else if (req.url.substr(0,13) === "/gravatarurl/"){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Gravatar URL: http://www.gravatar.com/avatar/"+md5(req.url.substr(13)))
  } else if (req.url.substr(0,6) === "/calc/") {
    res.writeHead(200, {"Content-Type": "text/plain"});
    req.url = req.url.substr(6);
    var arithmeticExpression = req.url ;
    var firstNumber = parseInt(req.url.match(/^\d+/));
    var secondNumber = parseInt(req.url.match(/\d+$/));
    var answer = math[req.url.replace(/\d+/g, "")](firstNumber,secondNumber).toString()
    res.end(arithmeticExpression +"= "+ answer);
  } else if (req.url.substr(0,8) === "/counts/") {
    res.writeHead(200, {"Content-Type": "text/plain"});
    req.url = decodeURI(req.url);
    req.url = req.url.substr(8);
    console.log(req.url);
    var letterCount = req.url.match(/[A-z]/g).length;
    var spaceCount = req.url.match(/\s/g).length;
    var wordCount = req.url.match(/\w+/g).length;
    var count = {"letterCount": letterCount, "spaceCount": spaceCount, "wordCount": wordCount};
    res.end(JSON.stringify(count));
  } else {
    res.writeHead(200, {"Content-Type": "text/plain"});
    request('http://points.agilelabs.com'+req.url+'.json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.end(body);
      }
    });
  }
}
