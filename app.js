const http = require("http");
const fs = require("fs");
// Invoking express right away IS NOT convention so that you can instantiate multiple apps
const express = require("express");
// Used to parse browser cookies
const cookieParser = require("cookie-parser");
// Used to parse body
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
// Popular library for authenticating user (works with OAuth)
const passport = require("passport");

// Convention for pulling port form .env
const port = process.env.PORT || 3000;

// The word "app" is purely convention
const app = express();

// For NPM packages, add ^ to keep package up to date for minor releases and patches
// For NPM packages, add ~ to keep package up to date for patches only
// npm update will update all packages based on ^ and ~node
const moment = require("moment");
// Output day, time and AM/PM (e.g. Wed, 8PM)
console.log(moment().format("ddd, hA"));

const jsonObj = { firstname: "bob", lastname: "ross" };

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
      res.end(JSON.stringify(jsonObj));
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.createReadStream(__dirname + "/indexPipe.html").pipe(res);
    }
  })
  .listen(2003, "127.0.0.1");

// Express port
app.listen(port);

// Express templating engine
// EJS is similar to ruby's ERB (ice cream cones and squids)
app.set("view engine", "ejs");

// Express middleware
// Any static file in public will be available by using "/assets" or whatever you name the path
// <link rel="stylesheet" href="assets/style.css"> added to indexPipe.html
app.use("/assets", express.static(__dirname + "/public"));

// cookie-parser middleware
app.use(cookieParser());

// To make your own middleware
// Leave off route ("/") to run code inside use for every request
app.use("/", (req, res, next) => {
  console.log("Request URL: " + req.url);
  // Cookie coming from cookie-parser
  console.log("Cookie: " + JSON.stringify(req.cookies));
  // Next tells it to run the next middleware
  next();
});

// Express get
app.get("/test", (req, res) => {
  // res.send("<html></html>") can have html passed directly in
  // res.sendFile can take a path to a file
  res.sendFile(__dirname + "/indexPipe.html");
});

app.get("/api", (req, res) => {
  res.json(jsonObj);
});

app.get("/person/test/:id", (req, res) => {
  // :id is a param
  res.send(req.params.id);
});

// Express post
app.post("/", (req, res) => {
  // Multiple http verbs can be used by same endpoints to run different code
});

// Using EJS templating engine
app.get("/", (req, res) => {
  // Render will look in views folder
  res.render("index");
});

app.get("/person/:id", (req, res) => {
  // Render also takes a second argument of and object that can be used to map data to views
  // This object is typically referred to as the model
  res.render("person", { ID: req.params.id });
});

// Query string example
app.get("/querystring/person/:id", (req, res) => {
  // query strings accessible through req object
  res.render("person", { ID: req.params.id, Qstr: req.query.qstr });
});

// body-parser body example
app.post("/person", urlencodedParser, (req, res) => {
  res.send("Thank you!");
  // urlencodedParser from body-parser is creating body object used in logs
  console.log("parsed body" + req.body.firstname);
  console.log("parsed body" + req.body.lastname);
});

// body-parser JSON example
app.post("/personjson", jsonParser, (req, res) => {
  res.send("Thank you for the JSON Data!");
  // urlencodedParser from body-parser is creating body object used in logs
  console.log("parsed JSON" + req.body.firstname);
  console.log("parsed JSON" + req.body.lastname);
});

// RESTful API example
// get from database
app.get("/api/person/:id");
// save to database
app.post("/api/person");
// delete from database
app.delete("/api/person/:id");
