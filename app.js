const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    let html = fs.readFileSync(__dirname + "/index.html", "utf8");
    const message = "Hello world ...";
    html = html.replace("{Message}", message);
    res.end(html);
  })
  .listen(1337, "127.0.0.1");

// Using pipe like below is more performant
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(__dirname + "/indexpipe.html").pipe(res);
  })
  .listen(1338, "127.0.0.1");
