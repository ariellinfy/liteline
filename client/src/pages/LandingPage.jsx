import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Authenticator from "../components/authenticator/Authenticator";

const LandingPage = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {userInfo ? (
        <div className="container-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
          <Authenticator />
        </div>
      ) : (
        <Navigate to="/chatroom" />
      )}
    </>
  );
};

export default LandingPage;
