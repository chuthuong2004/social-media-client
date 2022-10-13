import { Feed } from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import "./profile.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../apiClient/apiClient";

const Profile = () => {
  const location = useLocation();
  const username = location.pathname.split("/")[2];
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosClient.get(`/users?username=${username}`);
      setUser(res);
    };
    fetchData();
  }, [username]);
  return (
    <div>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={
                  user.coverPicture?.includes("http")
                    ? user.coverPicture
                    : `http://localhost:8800/images/${user.coverPicture}`
                }
                alt=""
                className="profileCoverImg"
              />
              <img
                src={
                  user.profilePicture?.includes("http")
                    ? user.profilePicture
                    : `http://localhost:8800/images/${user.profilePicture}`
                }
                alt=""
                className="profileUserImg"
              />
            </div>
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">{`${user.firstName} ${user.lastName}`}</h4>
            <span className="profileInfoDesc">{user.desc}</span>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
