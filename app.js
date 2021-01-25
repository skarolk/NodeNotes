const http = require("http");
const fs = require("fs");
// Invoking express right away IS NOT convention so that you can instantiate multiple apps
const express = require("express");
const port = process.env.PORT || 3000;

// The word "app" is purely convention
const app = express();

// For NPM packages, add ^ to keep package up to date for minor releases and patches
// For NPM packages, add ~ to keep package up to date for patches only
// npm update will update all packages based on ^ and ~node
const moment = require("moment");
// Output day, time and AM/PM (e.g. Wed, 8PM)
console.log(moment().format("ddd, hA"));

// Basic node server
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    let html = fs.readFileSync(__dirname + "/index.html", "utf8");
    const message = "Hello world ... nodemon";
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

// Express port
app.listen(port);

// Express get
app.get("/", (req, res) => {
  // res.send("<html></html>") can have html passed directly in
  // res.sendFile can take a path to a file
  res.sendFile(__dirname + "/indexPipe.html");
});

// Express post
app.post("/", (req, res) => {});
