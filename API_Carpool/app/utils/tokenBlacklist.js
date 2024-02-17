const invalidTokens = new Set();

function addTokenToBlacklist(token) {
  invalidTokens.add(token);
}

function isTokenInvalid(token) {
  return invalidTokens.has(token);
}

module.exports = {
  addTokenToBlacklist,
  isTokenInvalid,
};
