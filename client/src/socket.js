import io from "socket.io-client";

// const serverUrl = "https://liteline.onrender.com/";
const proxyUrl = "https://liteline-proxy-v48s.onrender.com/";

// const proxyUrl = "http://localhost:5000/";

const socket = io(proxyUrl, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
