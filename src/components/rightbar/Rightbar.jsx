import "./rightbar.css";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import SearchIcon from "@material-ui/icons/Search";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import axiosClient from "./../../apiClient/apiClient";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
const Rightbar = ({ user: userProfile }) => {
  const [user, setUser] = useState(userProfile);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const location = useLocation();
  const username = location.pathname.split("/")[2];
  const [friendList, setFriendList] = useState([]);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );
  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [user]);
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList =
          user && (await axiosClient.get(`users/friends/${username}`));
        setFriendList(friendList);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
    const getUsers = async () => {
      try {
        const user = await axiosClient.get(`users?username=${username}`);
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };
    username && getUsers();
  }, [username]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchUser = await axiosClient.get(
          `users?userId=${currentUser._id}`
        );
        dispatch({ type: "UPDATE_USER", payload: fetchUser });
      } catch (error) {}
    };
    getUsers();
  }, [followed, username]);
  const handleFollow = async () => {
    // handle unfollow
    try {
      await axiosClient.put(
        `users/${user._id}/${followed ? "unfollow" : "follow"}`,
        { userId: currentUser._id }
      );
      setFollowed(!followed);
    } catch (error) {
      console.log(error);
    }
  };
  const HomeRightbar = () => {
    return (
      <>
        <span className="birthdayTitle">Sinh nh???t</span>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="/assets/gift.png" alt="" />
          <span className="birthdayText">
            H??m nay l?? sinh nh???t c???a <b>Nguy???n V??n L???c</b> v??
            <b> 3 ng?????i kh??c</b>
          </span>
        </div>
        <div className="lineHr"></div>
        <div className="rightbarOnline">
          <h4 className="rightbarTitle">Ng?????i li??n h???</h4>
          <div className="rightbarOnlineIcons">
            <VideoCallIcon className="rightbarOnlineIcon" />
            <SearchIcon className="rightbarOnlineIcon" />
            <MoreHorizIcon className="rightbarOnlineIcon" />
          </div>
        </div>
        <ul className="rightbarFriendList">
          {Users.map((user) => (
            <Online key={user.id} user={user} />
          ))}
        </ul>
      </>
    );
  };
  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button onClick={handleFollow} className="btnFollow">
            {followed ? <RemoveIcon /> : <AddIcon />}
            <span className="statusFollow">
              {followed ? "H???y theo d??i" : "Theo d??i"}
            </span>
          </button>
        )}
        <h4 className="rightbarTitle">Th??ng tin ng?????i d??ng</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">S???ng t???i: </span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">?????n t???: </span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">M???i quan h???: </span>
            <span className="rightbarInfoValue">{user.relationship}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">B???n b??</h4>
        <div className="rightbarFollowings">
          {friendList &&
            friendList.map((friend) => (
              <Link
                to={`/profile/${friend.username}`}
                onClick={() =>
                  window.scrollTo({
                    top: 10,
                    left: 10,
                    behavior: "smooth",
                  })
                }
                key={friend._id}
                className="rightbarFollowing"
              >
                <img
                  src={
                    friend.profilePicture.includes("http")
                      ? friend.profilePicture
                      : `http://localhost:8800/images/${friend.profilePicture}`
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">
                  {friend.firstName + " " + friend.lastName}
                </span>
              </Link>
            ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {username ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;
