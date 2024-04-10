import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import Authenticator from "../components/authenticator/Authenticator";

const LandingPage = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <Route
      render={(props) =>
        userInfo ? (
          <div className="container-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
            <Authenticator />
          </div>
        ) : (
          <Redirect to="/chatroom" />
        )
      }
    />
  );
};

export default LandingPage;
