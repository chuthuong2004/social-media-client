import axiosClient from "./apiClient";
export const loginCall = async (userCredential, dispatch, socket) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axiosClient.post("auth/login", userCredential);
    console.log(res);
    localStorage.setItem("user", JSON.stringify(res.user));
    dispatch({ type: "LOGIN_SUCCESS", payload: res.user });
    socket.emit("login", { logged: true, userId: res.user._id });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
  }
};
