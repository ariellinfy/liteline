import io from "socket.io-client";
const serverUrl = "https://liteline.onrender.com/";
const socket = io(serverUrl, {
  autoConnect: false,
  withCredentials: true,
});
export default socket;
