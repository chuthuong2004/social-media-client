import "./topbar.css";
import SearchIcon from "@material-ui/icons/Search";
import PersonIcon from "@material-ui/icons/Person";
import ChatIcon from "@material-ui/icons/Chat";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../apiClient/apiClient";
import { io } from "socket.io-client";
const Topbar = () => {
  let navigate = useNavigate();
  const socket = useRef();
  const { user, dispatch } = useContext(AuthContext);
  useEffect(() => {
    socket.current = io.connect("http://localhost:8900");
    socket.current.on("request-logout", (data) => {
      console.log("có người đăng nhật", data);
      if (data.userId === user._id && data.requestLogout) {
        alert("Đã có người đăng nhập ở thiết bị khác ! Hãy kiểm tra lại.");
        localStorage.removeItem("user");
        dispatch({ type: "RESET_USER", payload: null });
        socket.current.emit("logout", { logged: false });
        navigate("/login");
      }
    });
  }, []);
  const handleLogout = async () => {
    socket.current.emit("logout", { logged: false, userId: user._id });
    try {
      await axiosClient.put(`/users/${user._id}`, {
        userId: user._id,
        logged: false,
        loggedAt: Date.now(),
      });
    } catch (error) {}
    localStorage.removeItem("user");
    dispatch({ type: "RESET_USER", payload: null });
    navigate("/login");
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/">
          <span className="logo">CHUCHU</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <SearchIcon className="searchIcon" />
          <input
            type="text"
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <PersonIcon />
            <span className="topbarIconBadge">1</span>
          </div>
          <div
            onClick={() => navigate("/messenger")}
            className="topbarIconItem"
          >
            <ChatIcon />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <NotificationsIcon />
            <span className="topbarIconBadge">3</span>
          </div>
        </div>
        <Link className="profile" to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture.includes("http")
                ? user.profilePicture
                : `http://localhost:8800/images/${user.profilePicture}`
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        <div onClick={handleLogout} className="logout">
          Đăng xuất
        </div>
      </div>
    </div>
  );
};

export default Topbar;
