const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const allServers = [
  "https://liteline.onrender.com",
  "https://liteline-api01.onrender.com",
  "https://liteline-api02-test.onrender.com",
];

const healthyServers = new Set();

const checkHealthyServers = async () => {
  for (const server of allServers) {
    try {
      await axios.get(server + "/health");
      // update health list
      healthyServers.add(server);
    } catch (error) {
      console.log("Server unhealthy: ", server);
    }
  }
};

let currentServer = 0;

const updateCurrentServer = () => {
  // check current server health
  if (!healthyServers.has(allServers[currentServer])) {
    // find next healthy server
    for (let i = 0; i < allServers.length; i++) {
      const nextServer = (currentServer + i) % allServers.length;
      if (healthyServers.has(allServers[nextServer])) {
        currentServer = nextServer;
        break;
      }
    }
  }
};

const proxyOptions = {
  target: allServers[currentServer],
  changeOrigin: true,
  ws: true,
  secure: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      /* handle proxyReq */
      if (healthyServers.size === 0) {
        res.status(500).send({
          message: "No healthy servers",
        });
      }
    },
    proxyRes: (proxyRes, req, res) => {
      /* handle proxyRes */
    },
    error: (err, req, res) => {
      /* handle error */
    },
  },
};

const proxyMiddleware = createProxyMiddleware(proxyOptions);

app.use(proxyMiddleware);

// Update health periodically
setInterval(checkHealthyServers, 5000);
setInterval(updateCurrentServer, 5000);

app.listen(5000);
