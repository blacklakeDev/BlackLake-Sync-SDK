const jsSHA = require("jssha");

exports.hashPassword = password => {
  const sha = new jsSHA('SHA3-224', 'TEXT');
  sha.update(password);
  return sha.getHash('HEX');
};
