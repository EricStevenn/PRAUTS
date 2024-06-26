const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { User } = require('../../../models');


/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;
  const password_confirm = request.body.password_confirm;
  
  try {
    const emailAlreadyTaken = await usersService.checkUserEmail(email);
    if (emailAlreadyTaken) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'EMAIL_ALREADY_TAKEN'
      )
    }

    const pass = await password;
    const passConfirm = await password_confirm;
    if(passConfirm != pass){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'INVALID_PASSWORD'
      )
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }
    return response.status(200).json({ name, email });
   } catch (error) {
    return next(error);
  }
}


/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  const id = request.params.id;
  const name = request.body.name;
  const email = request.body.email;
  
  try {
    const emailAlreadyTaken = await usersService.checkUserEmail(email);
    if (emailAlreadyTaken) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'EMAIL_ALREADY_TAKEN'
      )
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        response.status(409)
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

//change password
async function changePassword(request, response, next) {
  const id = request.params.id;
  const old_password = request.body.old_password;
  const new_password = request.body.new_password;
  const password_confirm = request.body.password_confirm;
  
  try {
    const correctOldPassword = await usersService.checkOldPassword(id, old_password);
    if(!correctOldPassword){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'INVALID_OLD_PASSWORD'
      )
    }

    const newPass = await new_password;
    const passConfirm = await password_confirm;
    if(passConfirm != newPass){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'INVALID_CONFIRM_PASSWORD'
      )
    }

    const password = await new_password;
    const success = await usersService.updatePassword(id, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }
    return response.status(200).json({ id });
   } catch (error) {
    return next(error);
  }
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
