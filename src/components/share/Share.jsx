import "./share.css";
import PermMedia from "@material-ui/icons/PermMedia";
import LabelIcon from "@material-ui/icons/Label";
import RoomIcon from "@material-ui/icons/Room";
import EmojiEmotions from "@material-ui/icons/EmojiEmotions";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import axiosClient from "../../apiClient/apiClient";
import CancelIcon from "@material-ui/icons/Cancel";
const Share = () => {
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);
  const handleShare = async () => {
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = file.name; // abc.jpg
      data.append("file", file);
      data.append("name", fileName);
      newPost.img = fileName; // abc.jpg
      try {
        await axiosClient.post("upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    await axiosClient.post("posts", newPost);
    window.location.reload();
  };
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePicture.includes("http")
                ? user.profilePicture
                : `http://localhost:8800/images/${user.profilePicture}`
            }
            alt=""
            className="shareProfileImg"
          />
          <input
            ref={desc}
            type="text"
            className="shareInput"
            placeholder={`${user.lastName}, ơi bạn đang nghĩ gì thế`}
          />
        </div>
        <div className="shareHr"></div>
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <CancelIcon
              className="shareImgCancel"
              onClick={() => setFile(null)}
            />
          </div>
        )}

        <div className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Ảnh/Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                name=""
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <LabelIcon htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Thẻ</span>
            </div>
            <div className="shareOption">
              <RoomIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Vị trí</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Cảm xúc</span>
            </div>
          </div>
          <button onClick={handleShare} className="shareButton">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Share;
