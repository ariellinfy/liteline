const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const servers = [
  "https://liteline.onrender.com",
  "https://liteline-api01.onrender.com",
  "https://liteline02.onrender.com",
];

let currentServer = 0;

const getServer = () => {
  currentServer = (currentServer + 1) % servers.length;
  return servers[currentServer];
};

const proxyOptions = {
  target: getServer(),
  changeOrigin: true,
  ws: true,
  secure: true,
};

const proxyMiddleware = createProxyMiddleware(proxyOptions);

app.use(proxyMiddleware);

app.listen(5000);
