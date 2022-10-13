import "./message.css";
import { format } from "timeago.js";
const Message = ({ message, own, logged, loading }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {!own && (
          <div className="messageImgContainer">
            <img
              src={
                message?.sender?.profilePicture?.includes("http")
                  ? message.sender.profilePicture
                  : `http://localhost:8800/images/${message?.sender?.profilePicture}`
              }
              alt=""
              className="messageImg"
            />
            <div
              className={
                logged ? "dotOnlineMessage" : "dotOnlineMessage logged"
              }
            ></div>
          </div>
        )}
        <div className="messageText">
          {loading && message?.isLoading ? (
            <div className="loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            message.text
          )}
        </div>
      </div>
      {!(loading && message.isLoading) && (
        <div className="messageBottom">
          {format(message.createdAt, "en_US")}
        </div>
      )}
    </div>
  );
};

export default Message;
