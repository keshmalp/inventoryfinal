const mongoose = require("mongoose");


var login = mongoose.model('login',{
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["Distributor", "Customer"],
    default: "Customer"
  },
  company:{
    type: String,
    enum:["Adidas","Super-Dry","Puma","Nike","Reebok"]
  }
});



module.exports = {
  login:login
}
