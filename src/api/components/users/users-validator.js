const joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      password_confirm : joi.string().min(6).max(32).required().label('Password_Confirm'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword: {
    body: {
      old_password: joi.string().min(6).max(32).required().label('PwLama'),
      new_password: joi.string().min(6).max(32).required().label('PwBaru'),
      password_confirm : joi.string().min(6).max(32).required().label('Password_Confirm'),
    },
  },
};
