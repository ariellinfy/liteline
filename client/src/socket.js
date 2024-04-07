import io from "socket.io-client";
// const serverUrl = "https://liteline.onrender.com/";
const proxyUrl = "https://liteline-proxy-v48s.onrender.com/";
const socket = io(proxyUrl, {
  autoConnect: false,
  withCredentials: true,
});
export default socket;
