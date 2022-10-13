import "./online.css";

const Online = ({ user }) => {
  return (
    <li key={user.id} className="rightbarFriend">
      <div className="rightbarProfileContainer">
        <img src={user.profilePicture} alt="" className="rightbarFriendImg" />
        <div className="dotOnline"></div>
      </div>
      <span className="rightbarFriendName">{user.username}</span>
    </li>
  );
};

export default Online;
