const fs = require("fs");
const _ = require("lodash");
const yargs = require("yargs");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const database = require(path.join(__dirname, ".", "services", "user"));
const app = express();
const auth = require(path.join(__dirname, ".", "middleware", "authentication"));

mongoose.connect(
  "mongodb://localhost/SEBS",
  { useNewUrlParser: "true" }
);

app.use(
  session({
    secret: "Ferrari",
    resave: false,
    saveUninitialized: false
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require("./config/passport")(passport);

const products = require("./model/products.js");

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: true
});

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/views"));
const definitions = require("./definitions.js");

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now} ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile("server.log", log + "\n", error => {
    if (error) {
      console.log("There was an error");
    }
  });
  next();
});
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

hbs.registerHelper("screamIt", text => {
  return text.toUpperCase();
});

app.get("/test", auth.isLoggedIn, (req, res) => {
  res.send("Loggedin");
});

app.post(
  "/",
  passport.authenticate("login", {
    successRedirect: "/test",
    failureRedirect: "/",
    failureFlash: true
  })
);

app.get("/logout", auth.isLoggedIn, (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("loginpage.hbs", {
    pageTitle: "Inventory"
  });
});

app.get("/home", (req, res) => {
  products.products.find({}, {}, function(err, docs) {
    console.log(docs);
    res.render("home.hbs", {
      pageTitle: "Inventory",
      productlist: docs
    });
  });
});

app.get("/register", (req, res, next) => {
  res.render("register");
});

app.post("/register", function(req, res, next) {
  return database
    .addUser(req.body)
    .then(function() {
      passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/register",
        failureFlash: true
      })(req, res, function() {
        res.redirect("/");
      });
    })
    .catch(next);
});
app.get("/addcategory", (req, res) => {
  res.render("addcategory.hbs", {
    pageTitle: "Add Category"
  });
});
app.get("/addquantity", (req, res) => {
  res.render("addquantity.hbs", {
    pageTitle: "Add Quantity"
  });
});
app.get("/removequantity", (req, res) => {
  res.render("removequantity.hbs", {
    pageTitle: "Remove Quantity"
  });
});

app.post("/addcategory", urlencodedParser, function(req, res) {
  // Prepare output in JSON format

  var log = definitions.addCategory(
    req.body.name,
    req.body.product,
    parseInt(req.body.quantity)
  );
  console.log("Returned: " + log);
  var message = bool
    ? "Product Category was added"
    : "This product already exists";
  console.log(req.body.name);
  res.render("commonresponse.hbs", {
    pageTitle: message
  });
});
app.post("/addq", urlencodedParser, function(req, res) {
  var bool = definitions.Addquantity(
    req.body.name,
    req.body.product,
    parseInt(req.body.quantity)
  );
  var message = bool ? "Quantity was added" : "No such product found";
  console.log(message);
  res.render("commonresponse.hbs", {
    pageTitle: message
  });
});

app.post("/removeq", urlencodedParser, function(req, res) {
  var bool = definitions.Removequantity(
    req.body.name,
    req.body.product,
    parseInt(req.body.quantity)
  );
  var message = bool ? "Quantity was removed" : "No such product exists";
  console.log(message);
  res.render("commonresponse.hbs", {
    pageTitle: message
  });
});

app.get("/list", (req, res) => {
  fs.readFile(__dirname + "/" + "categories.json", "utf8", (err, data) => {
    res.end(data);
  });
});

//view
app.get("/data", (req, res) => {
  //fs.readFile(__dirname + "/" + "categories.json", 'utf8', (err, data) => {
  products.products.find({}, {}, function(err, docs) {
    res.send(docs);
  });
});

app.get("/dataquantity", (req, res) => {
  //fs.readFile(__dirname + "/" + "categories.json", 'utf8', (err, data) => {

  products.products.find({ name: "Adidas" }, {}, function(err, docs) {
    console.log(docs);
    res.send(docs);
  });
});

app.get("/view", (req, res) => {
  res.sendfile(__dirname + "/" + "view.html");
});

app.listen(port, () => {
  console.log(`The server is on at ${port} port`);
});
