const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const proxyOptions = {
  target: "https://liteline.onrender.com",
  changeOrigin: true,
  ws: true,
  secure: true,
};

const proxyMiddleware = createProxyMiddleware(proxyOptions);

app.use(proxyMiddleware);

app.listen(5000);
