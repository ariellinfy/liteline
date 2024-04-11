const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

class Queue {
  constructor() {
    this.items = [];
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    return item + " inserted";
  }
  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }
  peek() {
    return this.items[this.frontIndex];
  }
  size() {
    return this.backIndex - this.frontIndex;
  }
  get printQueue() {
    return this.items;
  }
}

const allServers = new Queue();

allServers.enqueue("http://localhost:8000");
allServers.enqueue("http://localhost:8001");

// const healthyServers = new Set();
// let currentServer = 0;
// let serverChanged = false;
let hasHealthyServer = true;

const checkHealthyServers = async () => {
  console.log("size: ", allServers.size());
  for (let i = 0; i < allServers.size(); i++) {
    try {
      await axios.get(allServers.peek() + "/health");
      hasHealthyServer = true;
      console.log("Healthy: ", allServers.peek());
      break;
    } catch (error) {
      let inactive = allServers.dequeue();
      allServers.enqueue(inactive);
    }
  }

  if (hasHealthyServer) return;
  hasHealthyServer = false;
  console.log("No healthy servers");
};

// const checkCurrentServer = () => {
//   // check current server health
//   if (!healthyServers.has(allServers[currentServer])) {
//     // find next healthy server
//     for (let i = 0; i < allServers.length; i++) {
//       const nextServer = (currentServer + i) % allServers.length;
//       if (healthyServers.has(allServers[nextServer])) {
//         currentServer = nextServer;
//         console.log("Current server changed to: ", allServers[currentServer]);
//         serverChanged = true;
//         break;
//       }
//     }
//   }
// };

const reRoute = (req, res) => {
  return allServers.peek();
};

const proxyOptions = {
  target: "",
  changeOrigin: true,
  ws: true,
  secure: true,
  router: reRoute,
  on: {
    proxyReq: (proxyReq, req, res) => {
      /* handle proxyReq */
      console.log("on proxyReq", req.url);

      if (!hasHealthyServer) {
        proxyReq.end();
        return res.status(500).send({
          message: "No healthy servers",
        });
      }

      console.log("Current server - http: ", allServers.peek());
    },
    proxyReqWs: (proxyReq, req, socket, options, head) => {
      /* handle proxyReq */
      console.log("on proxyReqWs", req.url);
      if (!hasHealthyServer) {
        console.log("No healthy servers - proxyReqWs");
      }
      console.log("Current server - ws: ", allServers.peek());
    },

    proxyRes: (proxyRes, req, res) => {
      /* handle proxyRes */
      console.log("on proxyRes", proxyRes.statusCode);
    },
    error: async (err, req, res) => {
      /* handle error */
      console.log("on error", err.code);
      await checkHealthyServers();
    },
  },
};

const proxyMiddleware = createProxyMiddleware(proxyOptions);

app.use(proxyMiddleware);

// Update health periodically
setInterval(checkHealthyServers, 10000);

app.listen(5000);

// implement a queue class
