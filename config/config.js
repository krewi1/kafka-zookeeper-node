const env = process.env;

console.log("loaded:", env.ZOOKEEPER, env.KAFKA);
module.exports = {
  zookeeper: env.ZOOKEEPER,
  kafka: env.KAFKA
};
