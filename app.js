const http = require("http");
const fs = require("fs");

// Basic node server
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    let html = fs.readFileSync(__dirname + "/index.html", "utf8");
    const message = "Hello world ...";
    html = html.replace("{Message}", message);
    res.end(html);
  })
  .listen(2000, "127.0.0.1");

// Using pipe like below is more performant
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(__dirname + "/indexPipe.html").pipe(res);
  })
  .listen(2001, "127.0.0.1");

// Handling JSON data
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    const obj = { firstname: "bob", lastname: "ross" };
    res.end(JSON.stringify(obj));
  })
  .listen(2002, "127.0.0.1");

// Specifying URL behavior - routing
http
  .createServer((req, res) => {
    if (req.url === "/api") {
      res.writeHead(200, { "Content-Type": "application/json" });
      const obj = { firstname: "bob", lastname: "ross" };
      res.end(JSON.stringify(obj));
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.createReadStream(__dirname + "/indexPipe.html").pipe(res);
    }
  })
  .listen(2003, "127.0.0.1");
