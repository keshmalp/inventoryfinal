var mongoose=require('mongoose');
const products=require('./model/products.js');
const _ = require('lodash');
const yargs = require('yargs');
const express = require('express');

var addCategory=(name,product,quantity) =>
{
  var newProduct=new products.products({
    name: name,
    product: product,
    quantity: quantity
  });

  newProduct.save().then((doc)=>
  {
    console.log(JSON.stringify(doc,undefined,2));
  },
  (e)=>
  {
    console.log('Unable to save');
  });
};

module.exports=
{
  addCategory:addCategory
}
