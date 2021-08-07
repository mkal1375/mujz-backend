const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function generateToken(user) {
  const token = jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: "180d",
  });
  return token;
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function checkPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

async function verifyToken(token) {
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  return payload;
}

exports.generateToken = generateToken;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.verifyToken = verifyToken;
