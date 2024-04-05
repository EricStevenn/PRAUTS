const usersRepository = require('./users-repository');
const { hashPassword } = require('../../../utils/password');
const { passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check user's email
 * @param {string} email - email users
 * @returns {boolean}
 */
async function checkUserEmail(email) {
  try {
    const checkEmail = await usersRepository.isEmailUsed(email);
    if (!checkEmail) {
      return false; // Email belum terdaftar
    } else {
      return true; // Email sudah terdaftar
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return false; // Mengembalikan false jika terjadi kesalahan
  }
}


async function checkOldPassword(email, oldPassword) {
  try {
    const user = await usersRepository.getUserByEmail(email);

    // Pastikan user ditemukan
    if (!user) {
      throw new Error('User not found');
    }

    // Bandingkan password lama dengan password yang tersimpan dalam database
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    return isPasswordCorrect;
  } catch (error) {
    console.error('Error checking old password:', error);
    throw error;
  }
}

//update password
async function updatePassword(id, new_password) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updatePassword(id, new_password);
  } catch (err) {
    return null;
  }

  return true;
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkUserEmail,
  checkOldPassword,
  updatePassword,
};
