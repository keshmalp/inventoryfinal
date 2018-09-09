const fs = require('fs');
const database = require('./database.js');
const products = require('./model/products.js');
const login = require('./model/login.js');
var mongoose = require('mongoose');



var addCategory = (name, product, quantity) => {
  const database = require('./database.js');
  var found = false;
  products.products.findOne({
    $and: [{
      'name': name
    }, {
      'product': product
    }]
  }, 'name', function(err, company) {
    if (company === null) {
      console.log("Not Found");
      found = false;
      database.addCategory(name, product, quantity);
    } else {
      found = true;
    }
  });
  // return true;
};

var Removequantity = (name, product, quantity) => {
  var found = false;
  var myquery = {
    name: name,
    product: product
  };
  var newvalues = {
    $inc: {
      quantity: -quantity
    }
  };
  products.products.updateOne(myquery, newvalues, function(err, res) {
    if (res.n === 0) {
      console.log(err);
    } else {
      console.log(res);
      found = true;
    }
  });
  return true;
};

var Addquantity = (name, product, quantity) => {

  var found = false;
  var myquery = {
    name: name,
    product: product
  };
  var newvalues = {
    $inc: {
      quantity: quantity
    }
  };
  products.products.updateOne(myquery, newvalues, function(err, res) {
    if (res.n === 0) {
      found = false;
      console.log('There was some error');
    } else {
      found = true;
      console.log(res);
    }
  });
  return true;

};

var checklogin = (uname, pwd) => {

 login.login.find({
    
  }, {}, function(err, log) {
    if (log === null) {
      console.log(log);
    } else {
      console.log(log);
    }
    return log;
  });




};


module.exports = {
  addCategory,
  Removequantity,
  Addquantity,
  checklogin
}
