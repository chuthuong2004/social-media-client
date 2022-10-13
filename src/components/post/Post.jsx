import "./post.css";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import GroupIcon from "@material-ui/icons/Group";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../apiClient/apiClient";
const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLike, setIsLike] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  useEffect(() => {
    setIsLike(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosClient.get(`/users?userId=${post.userId}`);
      setUser(res);
    };
    fetchData();
  }, []);
  const handleLike = () => {
    axiosClient.put(`/posts/${post._id}/like`, { userId: currentUser._id });
    setLike(isLike ? like - 1 : like + 1);
    setIsLike(!isLike);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link
              onClick={() =>
                window.scrollTo({
                  top: 10,
                  left: 10,
                  behavior: "smooth",
                })
              }
              to={`/profile/${user.username}`}
            >
              <img
                src={
                  user.profilePicture?.includes("http")
                    ? user.profilePicture
                    : `http://localhost:8800/images/${user.profilePicture}`
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <div className="postInfoUser">
              <Link
                onClick={() =>
                  window.scrollTo({
                    top: 10,
                    left: 10,
                    behavior: "smooth",
                  })
                }
                to={`/profile/${user.username}`}
                className="postUsername"
              >
                {user.firstName + " " + user.lastName}
              </Link>
              <div className="postInfo">
                <span className="postDate">
                  {format(post.createdAt, "en_US")}
                </span>
                <GroupIcon className="postFriendIcon" />
              </div>
            </div>
          </div>
          <div className="postTopRight">
            <MoreHorizIcon />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          {post.img && (
            <img
              src={`http://localhost:8800/images/${post.img}`}
              alt=""
              className="postCenterImg"
            />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              onClick={handleLike}
              src="/assets/like.png"
              alt=""
            />
            <img
              className="likeIcon"
              onClick={handleLike}
              src="/assets/heart.png"
              alt=""
            />
            <span className="postLikeCounter">{like}</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {post.comment || 0} bình luận
            </span>
            {/* <span className="postCommentText">2 lượt chia sẻ</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
