const crypto = require('crypto');

const hmacHash = (key, message) => {
  return crypto.createHmac('sha256', key).update(message).digest('hex');
};

// numericBucket: convert hex to number in [0, 10000)
const hexToBucket = (hex, buckets = 10000) => {
  // take first 12 chars to avoid huge ints, parse as hex then mod
  const sub = hex.slice(0, 12);
  const num = parseInt(sub, 16);
  return num % buckets;
};

module.exports = { hmacHash, hexToBucket };
