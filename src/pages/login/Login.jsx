import "./login.css";
import CloseIcon from "@material-ui/icons/Close";
import { useContext, useEffect, useRef, useState } from "react";
import { loginCall } from "../../apiClient/apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import axiosClient from "../../apiClient/apiClient";
import io from "socket.io-client";
const Login = () => {
  const [openRegister, setOpenRegister] = useState(false);
  const [success, setSuccess] = useState(false);
  const emailLogin = useRef();
  const passwordLogin = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const emailRegister = useRef();
  const passwordRegister = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect("http://localhost:8900");
  }, []);
  useEffect(() => {}, [user]);

  const handleSubmit = async (action) => {
    if (action === "login") {
      loginCall(
        {
          email: emailLogin.current.value,
          password: passwordLogin.current.value,
        },
        dispatch,
        socket.current
      );
    } else {
      const user = {
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        email: emailRegister.current.value,
        password: passwordRegister.current.value,
      };
      try {
        await axiosClient.post("/auth/register", user);
        setSuccess(true);
        setOpenRegister(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const Login = () => {
    return (
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Facebook</h3>
            <span className="loginDesc">
              Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống
              của bạn.
            </span>
          </div>
          <div className="loginRight">
            <div className={success ? "success error" : "error"}>
              {success ? "Đăng ký tài khoản thành công !" : error.message || ""}
            </div>
            <div className="loginBox">
              <input
                ref={emailLogin}
                type="email"
                placeholder="Email của bạn"
                className="loginInput"
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="loginInput"
                ref={passwordLogin}
                required
                minLength="6"
              />
              <button
                onClick={() => handleSubmit("login")}
                className="loginButton"
              >
                {isFetching ? (
                  <CircularProgress color="primary" size="20px" />
                ) : (
                  "Đăng nhập"
                )}
              </button>
              <span className="loginForgot">Quên mật khẩu?</span>
              <div className="loginHr"></div>
              <button
                onClick={() => setOpenRegister(true)}
                className="loginRegisterButton"
              >
                Tạo tài khoản mới
              </button>
            </div>
            <div className="loginCreatePage">
              <b>Tạo Trang</b> dành cho người nổi tiếng, thương hiệu hoặc doanh
              nghiệp.
            </div>
          </div>
        </div>
      </div>
    );
  };
  const Register = () => {
    return (
      <div className="register">
        <div className="registerWrapper">
          <div className="registerTop">
            <div className="signup">
              <h2 className="signupTitle">Đăng ký</h2>
              <span className="signupDesc">Nhanh chóng và dễ dàng</span>
            </div>
            <CloseIcon
              className="registerIcon"
              onClick={() => setOpenRegister(false)}
            />
          </div>
          <hr className="registerHr" />
          <form className="registerForm">
            <div className="registerInputName">
              <input
                ref={firstName}
                type="text"
                placeholder="Họ"
                className="registerInput"
              />
              <input
                ref={lastName}
                type="text"
                placeholder="Tên"
                className="registerInput"
              />
            </div>
            <input
              type="email"
              placeholder="Email của bạn"
              className="registerInput"
              ref={emailRegister}
            />
            <input
              ref={passwordRegister}
              required
              minLength="6"
              type="password"
              placeholder="Mật khẩu mới"
              className="registerInput"
            />
          </form>
          <button
            onClick={() => handleSubmit("register")}
            className="registerButton"
          >
            Đăng ký
          </button>
        </div>
      </div>
    );
  };
  return (
    <>
      <Login />
      {openRegister && <Register />}
    </>
  );
};

export default Login;
