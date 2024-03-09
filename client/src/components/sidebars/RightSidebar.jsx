import RoomSettings from "../popups/RoomSettings";
import ShareRoom from "../popups/ShareRoom";
import Member from "../member/Member";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../SocketProvider";

const RightSidebar = (props) => {
  const roomId = props.roomid;
  const socket = useContext(SocketContext);

  const [roomMembers, setRoomMembers] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [offlineMembers, setOfflineMembers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("online", (data) => {
      if (data) {
        // console.log("Right side bar: ", data);
        setOnlineMembers(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    axios.get("/rooms/getRoomUsers/" + roomId).then((res) => {
      const members = res.data;
      if (members) {
        setRoomMembers(members);
      }
    });
  }, [roomId]);

  useEffect(() => {
    // console.log("room members", roomMembers)
    const offline = roomMembers.filter((member) => {
      if (onlineMembers.some(on => on.uid === member.uid)) {
        return false;
      } else {
        return true
      }
    });
    
    setOfflineMembers(offline);
  }, [roomMembers, onlineMembers]);

  return (
    <div className="flex flex-col justify-between h-full w-1/5 min-w-fit">
      <h1 className="text-lg mt-4 text-center">Current Members</h1>
      <div className="p-4 text-gray-900 h-[74%] overflow-y-hidden">
        {/* Scrollable Container for People Components */}
        <div
          id="memberContainer"
          className="overflow-y-auto flex flex-col items-stretch space-y-3 h-full"
        >
          {onlineMembers.map((member) => (
            <Member
              key={member.uid}
              name={member.username}
              isOwner={member.owner}
              isOnline={true}
            />
          ))}
          {offlineMembers.map((member) => (
            <Member
              key={member.uid}
              name={member.username}
              isOwner={member.owner}
              isOnline={false}
            />
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between">
        <hr className="my-6 border-gray-200 dark:border-gray-400" />

        {/* Button for Room Settings */}
        {/* <RoomSettings /> */}

        <hr className="my-6 border-gray-200 dark:border-gray-400" />

        {/* Button for Sharing */}
        {/* <ShareRoom /> */}
      </div>
    </div>
  );
};

export default RightSidebar;
