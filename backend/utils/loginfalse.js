const redisClient = require('./redisClient');

async function incrementLoginFail(identifier) {
  const key = `login_fail:${identifier}`;
  const count = await redisClient.incr(key);
  await redisClient.expire(key, 1800);
  return count;
}

async function getLoginFailCount(identifier) {
  const key = `login_fail:${identifier}`;
  const count = await redisClient.get(key);
  return parseInt(count) || 0;
}

async function resetLoginFail(identifier) {
  const key = `login_fail:${identifier}`;
  await redisClient.del(key);
}

module.exports = {
  incrementLoginFail,
  getLoginFailCount,
  resetLoginFail
};
