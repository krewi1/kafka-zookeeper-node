const zookeeper = require("node-zookeeper-client");
const config = require("../config/config");

let client;

const getClient = async () => {
  return new Promise(resolve => {
    client = zookeeper.createClient(config.zookeeper);
    client.connect();
    client.once("connected", () => resolve(client));
  });
};

const write = async (path, data) => {
  return new Promise((res, rej) => {
    client.create(
      path,
      data ? Buffer.from(data) : null,
      zookeeper.CreateMode.PERSISTENT,
      err => {
        if (err) rej(err);
        res();
      }
    );
  });
};

const getData = async path => {
  return new Promise((res, rej) => {
    client.getData(path, undefined, (err, data) => {
      if (err) rej(err);
      res(data.toString("utf8"));
    });
  });
};

const watch = async () => {
  await client.getChildren(
    "/test",
    event => {
      console.log(event.toString());
    },
    () => undefined
  );
};

const init = async () => {
  return new Promise(res => {
    client.exists("/test", (err, stat) => {
      if (stat) {
        res();
      } else {
        write("/test").then(res);
      }
    });
  });
};

module.exports = {
  getClient,
  write,
  getData,
  init,
  watch
};
