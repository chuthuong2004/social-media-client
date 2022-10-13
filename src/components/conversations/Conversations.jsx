import { memo, useContext, useEffect, useRef, useState } from "react";
import "./conversations.css";
import axiosClient from "./../../apiClient/apiClient";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";
import { format } from "timeago.js";

const Conversations = ({
  conversation,
  latestMessageChange,
  arrivalMessage,
  currentChat,
  loggedUser: currentLoggedUser,
  conversationLoading,
}) => {
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(currentUser);
  const [latestMessage, setLatestMessage] = useState(null);
  const [logged, setLogged] = useState(false);
  const [loggedUser, setLoggedUser] = useState(currentLoggedUser);
  const [loading, setLoading] = useState(false);
  const friendId = conversation.members.find(
    (member) => member !== currentUser._id
  );
  const socket = useRef();
  useEffect(() => {
    socket.current = io.connect("http://localhost:8900");
    socket.current.on("logged", (data) => {
      console.log("logged");
      setLogged(data.logged);
      setLoggedUser(data.userId);
      getUser();
    });
  }, []);
  const getUser = async () => {
    try {
      const res = await axiosClient.get(`/users?userId=${friendId}`);
      setUser(res);
      setLogged(res.logged);
      setLoggedUser(res._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosClient.get(
          `/messages/latest/${conversation._id}`
        );
        setLatestMessage(res);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
    getUser();
  }, [conversation, currentUser, latestMessageChange, arrivalMessage]);
  useEffect(() => {
    if (conversationLoading) {
      setLoading(true);
    }
    const timeout = setTimeout(() => {
      setLoading(false);
      conversationLoading = null;
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [conversationLoading]);
  return (
    <div
      className={
        !latestMessage?.seen && latestMessage?.sender?._id !== currentUser?._id
          ? "conversation notSee"
          : "conversation"
      }
    >
      <div className="imgContainer">
        <img
          src={
            user.profilePicture?.includes("http")
              ? user.profilePicture
              : `http://localhost:8800/images/${user.profilePicture}`
          }
          // src=""
          alt=""
          className="conversationImg"
        />
        <div
          className={
            logged && conversation.members.includes(loggedUser)
              ? "dotOnlineConversation"
              : "dotOnlineConversation logged"
          }
        ></div>
      </div>
      <div className="contentMessage">
        <h3 className="username">{user?.firstName + " " + user?.lastName}</h3>
        <div className="arrivalMessage">
          {loading ? (
            <div className="loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <span className="latestMessage">
              {!(latestMessage?.sender?._id === user._id) && "Bạn: "}
              {latestMessage?.text}
            </span>
          )}

          <span className="messageTime">
            <p className="dotCenter"></p>
            {format(latestMessage?.createdAt).replace("ago", "")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
