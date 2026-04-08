const { createClient } = require("redis");

let redisClient;

if (process.env.REDIS_PORT_URL) {
  redisClient = createClient({
    url: process.env.REDIS_PORT_URL
  });

  redisClient.connect()
    .then(() => console.log("✅ Redis Connected"))
    .catch(err => console.error("Redis Error:", err));
} else {
  console.log("⚠️ Redis not configured - OTP will use in-memory storage");
  redisClient = {
    isOpen: false,
    get: async () => null,
    set: async () => {},
    del: async () => {}
  };
}

module.exports = redisClient;
