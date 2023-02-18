const redis = require("redis");

const redisClient = redis.createClient(); // add {url: } if redis is on the cloud
const EXP_TIME = 3600; // expire in 6 mins

module.exports = getOrSetRedisCache = (key, callback) => {
  return new Promise((resolve, reject)=>{
    redisClient.get(key, async (err, result) => {
      if (err) return reject(err);
      if (result) {
        console.log("Cache Hit!");
        return resolve(JSON.parse(result));
      } else {
        console.log("Cache Miss");
        const freshData = await callback();
        redisClient.setex(key, EXP_TIME, JSON.stringify(freshData));
        return resolve(freshData);
      } 
    })
  })
}