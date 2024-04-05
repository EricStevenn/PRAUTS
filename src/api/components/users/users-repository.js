const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

async function updatePassword(id, new_password){
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        new_password,
      },
    }
  );
}

/** *
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/** *
 * check email user
 * @param {string} email
 * @returns {Promise}
 */

async function isEmailUsed(email) {
  try {
    const user = await User.findOne({ email: email });
    return !!user; // Mengembalikan true jika user ditemukan, false jika tidak
  } catch (error) {
    console.error('Error checking email:', error);
    return false; // Mengembalikan false jika terjadi kesalahan
  }
}

//changePassword
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  isEmailUsed,
  getUserByEmail,
  updatePassword,
};
