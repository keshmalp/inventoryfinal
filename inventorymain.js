const fs = require("fs");
const _ = require("lodash");
const request = require("request");
const yargs = require("yargs");
var querystring = require("querystring");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const login = require("./model/login.js");
const app = express();
const products = require("./model/products.js");
var crypto = require("crypto");
var http = require("http");
const definitions = require("./definitions.js");
var meraname = "Adidas";
var mName = "Adidas";

//Initiating blockchain

var chain_init = {
  host: "localhost",
  port: "3000",
  path: "/create",
  method: "POST"
};

var chain_add = {
  host: "localhost",
  port: "3000",
  path: "/addblock",
  method: "POST"
};

var post_req = http.request(chain_init, function(res) {
  res.setEncoding("utf8");
});
var post_req2 = http.request(chain_add, function(res) {
  res.setEncoding("utf8");
});

var data = products.products.find({});
var Content = querystring.stringify(data);
hbs.registerPartials(__dirname + "/views/partials");
mongoose.connect(
  "mongodb://localhost/inventory",
  { useNewUrlParser: "true" }
);

app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerHelper("screamIt", text => {
  return text.toUpperCase();
});

app.post("/", function(req, res) {
  var newpass = crypto
    .createHash("sha256")
    .update(req.body.password, "utf8")
    .digest("hex");
  console.log(newpass);
  var check = {
    email: req.body.email,
    password: newpass
  };
  login.login.findOne({ email: req.body.email, password: newpass }, function(
    err,
    docs
  ) {
    console.log(docs);
    //console.log(docs.company);
    if (docs) {
      if (docs.role === "Distributor") {
        products.products.find({ name: docs.company }, {}, function(
          err,
          docs2
        ) {
          meraname = docs.company;
          console.log(docs2);
          res.render("home.hbs", {
            pageTitle: meraname,
            productlist: docs2
          });
        });
      } else if (docs.role === "Customer") {
        products.products.find({}, {}, function(err, docs) {
          //<% %>
          console.log(docs);
          res.render("homecustomer.hbs", {
            pageTitle: "Inventory",
            productlist: docs
          });
        });
      }
    } else {
      res.render("loginpage.hbs");
    }
  });
});

app.get("/logout", (req, res) => {
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
    // console.log(docs);
    res.render("home.hbs", {
      pageTitle: meraname,
      productlist: docs
    });
  });
});
app.get("/homecustomer", (req, res) => {
  products.products.find({}, {}, function(err, docs) {
    // console.log(docs);
    res.render("homecustomer.hbs", {
      pageTitle: "Inventory",
      productlist: docs
    });
  });
});

app.get("/buy", (req, res) => {
  res.render("buyquantity.hbs", {
    pageTitle: "What do you want to buy?"
  });
});

app.get("/register", (req, res, next) => {
  res.render("register.hbs");
});

app.post("/register", function(req, res, next) {
  login.login.findOne({ email: req.body.email }, function(err, docs) {
    console.log(docs);
    console.log(req.body.type);
    var newpass = crypto
      .createHash("sha256")
      .update(req.body.password, "utf8")
      .digest("hex");
    if (docs) {
      res.render("register.hbs");
    } else {
      if (req.body.type === "Distributor") {
        var newuser = {
          name: req.body.username,
          email: req.body.email,
          role: req.body.type,
          password: newpass,
          company: req.body.company
        };
      } else {
        var newuser = {
          name: req.body.username,
          email: req.body.email,
          role: req.body.type,
          password: newpass
        };
      }
      var newuser1 = new login.login(newuser);
      newuser1.save();
      res.render("loginpage.hbs");
    }
  });
});
app.get("/addcategory", (req, res) => {
  // post_req.write(Content);
  // post_req.end();
  // post_req2.write("Adidas");
  // var value = products.products.find({});
  // console.log(Content);
  // post_req2.end();
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

app.post("/addcategory", function(req, res) {
  // Prepare output in JSON format
  var bool = definitions.addCategory(
    meraname,
    req.body.product,
    parseInt(req.body.quantity)
  );

  var value = querystring.stringify(req.body);
  console.log(value);
  request.post("http://localhost:3000/addblock", { form: { key: value } });
  console.log("Returned: " + bool);
  var message = bool
    ? "Product Category was added"
    : "This product already exists";
  console.log(req.body.name);
  res.render("commonresponse.hbs", {
    pageTitle: message
  });
});
app.post("/addq", function(req, res) {
  var bool = definitions.Addquantity(
    meraname,
    req.body.product,
    parseInt(req.body.quantity)
  );
  var message = bool ? "Quantity was added" : "No such product found";
  console.log(message);
  res.render("commonresponse.hbs", {
    pageTitle: message
  });
});

app.post("/removeq", function(req, res) {
  var bool = definitions.Removequantity(
    meraname,
    req.body.product,
    parseInt(req.body.quantity)
  );
  var message = bool ? "Quantity was removed" : "No such product exists";
  console.log(message);
  res.render("commonresponse.hbs", {
    pageTitle: message
  });
});

app.post("/buy", function(req, res) {
  var bool = definitions.Buy(
    meraname,
    req.body.product,
    parseInt(req.body.quantity)
  );
  var message = bool ? "Payment Successful" : "No such product exists";
  console.log(message);
  res.render("commonresponsecustomer.hbs", {
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
  //console.log("Data: Name " + req.body.name);
  console.log("Name: " + meraname);
  products.products.find({ name: meraname }, {}, function(err, docs) {
    console.log(docs);
    res.send(docs);
  });
});

app.get("/dataquantity", (req, res) => {
  //fs.readFile(__dirname + "/" + "categories.json", 'utf8', (err, data) => {
  console.log(res);
  products.products.find({}, {}, function(err, docs) {
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
