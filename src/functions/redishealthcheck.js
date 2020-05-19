const redis = require("redis");

const { REDISHOST, REDISPORT, REDISPASSWORD } = process.env;

const RedisClient = redis.createClient({
  host: REDISHOST,
  port: REDISPORT,
  password: REDISPASSWORD,
});

let errs = [];

RedisClient.on("error", (err) => {
  errs.push(err);
  console.log("Error " + err);
});

RedisClient.on("connect", (err) => {
  console.log("Connected to redis ☄" + err);
});

exports.handler = async (event, context) => {
  errs.push(REDISHOST);

  return { statusCode: 200, body: JSON.stringify(errs) };

  // console.log(res);
};
