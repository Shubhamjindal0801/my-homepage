import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router";
import { message } from "antd";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      message.success(`Welcome back ${user.displayName}`);
      navigate("/landing");
    }
  }, [user, loading]);
  return <div></div>;
};

export default Header;
