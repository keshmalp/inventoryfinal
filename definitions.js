const fs = require('fs');

const products = require('./model/products.js');
const login = require('./model/login.js');
var mongoose = require('mongoose');



var addCategory = (name, product, quantity) => {

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
      var newProduct=new products.products({
        name: name,
        product: product,
        quantity: quantity
      });

  newProduct.save()
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

var newuser={
  name:uname,
  password:pwd
};

 login.login.findOne({name:uname}, function(err, docs) {
      if(docs)
      {
        console.log(docs);
        res.render('register.hbs');
      }
      else {
        var newuser1=new login.login(newuser);
        newuser1.save()

      }
    });
  };

  var Buy = (name, product, quantity) => {
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

module.exports = {
  addCategory,
  Removequantity,
  Addquantity,
  checklogin,
  Buy
}
