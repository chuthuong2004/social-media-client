import "./chatOnline.css";

const ChatOnline = () => {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            src="https://scontent.fsgn2-1.fna.fbcdn.net/v/t39.30808-6/272272345_1103541183782082_2260967379827568989_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=JzD6uKv4WSYAX_1rVug&tn=qY22Xxzy04WyFQLv&_nc_ht=scontent.fsgn2-1.fna&oh=00_AT9b9zzUoW0kxsMIQcr8SkgreZ-MPz78i0_Yny1glr3s1g&oe=62D1D20A"
            alt=""
            className="chatOnlineImg"
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <div className="chatOnlineName">Chu Thương</div>
      </div>
    </div>
  );
};

export default ChatOnline;
