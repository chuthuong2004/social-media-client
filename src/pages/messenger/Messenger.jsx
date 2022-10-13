import "./messenger.css";
import Topbar from "./../../components/topbar/Topbar";
import Conversations from "../../components/conversations/Conversations";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import GifBoxRoundedIcon from "@material-ui/icons/GifRounded";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import EmojiEmotionsRoundedIcon from "@material-ui/icons/EmojiEmotionsRounded";
import LabelIcon from "@material-ui/icons/Label";
import SendIcon from "@material-ui/icons/Send";
import CallIcon from "@material-ui/icons/Call";
import VideocamIcon from "@material-ui/icons/Videocam";
import InfoIcon from "@material-ui/icons/Info";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import axiosClient from "./../../apiClient/apiClient";
import io from "socket.io-client";
import { format } from "timeago.js";
// const socket = io.connect("http://localhost:8900");
const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [userFriend, setUserFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [latestMessage, setLatestMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(null);

  const [logged, setLogged] = useState(false);
  const [loggedUser, setLoggedUser] = useState("");

  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const messageInput = useRef();
  const socket = useRef();
  const fetchUser = async (userId) => {
    try {
      const res = await axiosClient.get(`/users?userId=${userId}`);
      setUserFriend(res);
      setLogged(res.logged);
      setLoggedUser(res._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    socket.current = io.connect("http://localhost:8900");

    socket.current.on("getMessage", (data) => {
      const getUserSender = async () => {
        try {
          const resUser = await axiosClient.get(
            `/users?userId=${data.senderId}`
          );
          setArrivalMessage({
            sender: resUser,
            text: data.text,
            createdAt: Date.now(),
          });
          await axiosClient.put(`/conversations/update/${data.conversationId}`);
          const resConversation = await axiosClient.get(
            `/conversations/${user._id}`
          );
          setConversations(resConversation);
        } catch (error) {}
      };
      getUserSender();
    });
    socket.current.on("logged", (data) => {
      fetchUser(data.userId);
      setLoggedUser(data.userId);
    });
  }, []);
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {});
  }, [user]);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender._id) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  useEffect(() => {
    if (
      currentChat?.members?.includes(arrivalMessage?.sender?._id) &&
      currentChat?.members?.includes(user._id)
    ) {
      updateSeenMessage(currentChat?._id, userFriend?._id);
    }
  }, [arrivalMessage]);
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosClient.get(`/conversations/${user._id}`);
        setConversations(res);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user._id]);
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        try {
          const res = await axiosClient.get(`/messages/${currentChat._id}`);
          setMessages(res);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMessages();
    if (currentChat) {
      const userIdFriend = currentChat.members.find(
        (member) => member !== user._id
      );
      fetchUser(userIdFriend);
    }
    socket.current.on("loading", (data) => {
      setConversationLoading(data);
      if (currentChat && currentChat?._id === data.conversationId) {
        setLoading(data.onKeyUp);
        setMessages((prev) => {
          const messageIncludeSender = prev.find(
            (message) => message.sender?._id === data.senderId
          );
          if (prev.find((message) => message.isLoading)) {
            return [...prev];
          }
          if (messageIncludeSender?.conversationId === data.conversationId) {
            return [
              ...prev,
              {
                _id: "19h1120035",
                sender: messageIncludeSender?.sender,
                text: "",
                isLoading: true,
              },
            ];
          }
          return [...prev];
        });
        setTimeout(() => {
          setLoading(false);
          setMessages((prev) => {
            const newMessage = prev.filter(
              (message) => message._id !== "19h1120035"
            );
            return newMessage;
          });
        }, 1500);
      }
    });
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    const latestMessage = messages[messages.length - 1];
    setLatestMessage(latestMessage);
  }, [messages]);
  const handleSendMessage = async () => {
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage,
      conversationId: currentChat._id,
    });
    try {
      const res = await axiosClient.post(`/messages`, message);
      setNewMessage("");
      messageInput.current.focus();
      setMessages([...messages, res]);
    } catch (error) {
      console.log(error);
    }
  };
  const updateSeenMessage = async (conversationId, receiverId) => {
    try {
      const res = await axiosClient.put(
        `/messages/seen/${conversationId}/${receiverId}`
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickConversation = (conversation) => {
    const receiverId = conversation.members.find(
      (member) => member !== user._id
    );

    updateSeenMessage(conversation._id, receiverId);
    setCurrentChat(conversation);
  };
  const handleKeyUp = () => {
    socket.current.emit("keyup", {
      onKeyUp: true,
      senderId: user._id,
      conversationId: currentChat._id,
      receiverId: userFriend._id,
    });
  };
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="chatMenuTitle">
              <h1>Chat</h1>
              <div className="chatMenuIcons">
                <div className="chatMenuIcon">
                  <MoreHorizIcon />
                </div>
                <div className="chatMenuIcon">
                  <VideoCallIcon />
                </div>
                <div className="chatMenuIcon">
                  <EditIcon />
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm trên Messenger"
              className="chatMenuInput"
            />
            <div className="conversations">
              {conversations ? (
                conversations.map((conversation) => {
                  return (
                    <div
                      onClick={() => handleClickConversation(conversation)}
                      key={conversation._id}
                    >
                      <Conversations
                        conversation={conversation}
                        latestMessageChange={messages}
                        arrivalMessage={arrivalMessage}
                        currentChat={currentChat}
                        loggedUser={loggedUser}
                        conversationLoading={
                          conversationLoading?.conversationId ===
                          conversation._id
                            ? conversationLoading
                            : null
                        }
                      />
                    </div>
                  );
                })
              ) : (
                <div>Không có tin nhắn nào</div>
              )}
            </div>
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTitle">
                  <div className="chatBoxTitleInfo">
                    <div className="titleInfoImg">
                      <img
                        src={
                          userFriend?.profilePicture.includes("http")
                            ? userFriend?.profilePicture
                            : `http://localhost:8800/images/${userFriend?.profilePicture}`
                        }
                        alt=""
                        className="chatBoxInfoImg"
                      />
                      <div
                        className={
                          logged && loggedUser === userFriend?._id
                            ? "dotOnline"
                            : "dotOnline logged"
                        }
                      ></div>
                    </div>
                    <div className="titleInfoChatBox">
                      <h3 className="userChatBox">
                        {userFriend?.firstName + " " + userFriend?.lastName}
                      </h3>
                      <span className="activeText">
                        {logged && loggedUser === userFriend?._id
                          ? "Active"
                          : format(userFriend?.loggedAt) === "just now"
                          ? "Active now"
                          : "Active " + format(userFriend?.loggedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="chatBoxOptions">
                    <CallIcon className="chatBoxOptionIcon" />
                    <VideocamIcon className="chatBoxOptionIcon" />
                    <InfoIcon className="chatBoxOptionIcon" />
                  </div>
                </div>
                <div className="chatBoxTop">
                  {messages.map((message, i) => (
                    <div key={i} ref={scrollRef}>
                      <Message
                        key={i}
                        message={message}
                        own={message?.sender?._id === user._id}
                        logged={
                          logged && currentChat.members.includes(loggedUser)
                        }
                        loading={loading && currentChat?._id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <AddCircleIcon className="chatBoxBottomIcon" />
                  <LabelIcon className="chatBoxBottomIcon" />
                  <AttachFileRoundedIcon className="chatBoxBottomIcon" />
                  <GifBoxRoundedIcon className="chatBoxBottomIcon" />
                  <div className="chatInput">
                    <textarea
                      ref={messageInput}
                      className="chatMessageInput"
                      name="message"
                      rows={1}
                      placeholder="Aa"
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                      onKeyUp={handleKeyUp}
                    />
                    <EmojiEmotionsRoundedIcon className="chatBoxBottomIcon emojiIcon" />
                  </div>

                  <button onClick={handleSendMessage} className="chatSubmitBtn">
                    <SendIcon />
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Chọn cuộc hội thoại để chat đi em !
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
