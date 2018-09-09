const Promise = require("bluebird");
const User = require("../model/login");
require("dotenv").config();

// /**
//  * @function addUser
//  * @param {Object}
//  */
module.exports.addUser = userDetails => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({
        email: userDetails.email
      })
        .exec()
        .then(user => {
          let newUser = new User(userDetails);
          if (user) {
            return reject(new Error("User already registered"));
          }
          newUser.password = newUser.generateHash(userDetails.password);
          newUser.save().then(savedUser => resolve(savedUser));
        })
        .catch(err => reject(err));
    } catch (error) {
      return reject(error);
    }
  });
};
