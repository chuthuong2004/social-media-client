import { useContext } from "react";
import { Feed } from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProvider } from "../../context/AuthContext";
import "./home.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed username={user.username} />
        <Rightbar />
      </div>
    </div>
  );
};

export default Home;
