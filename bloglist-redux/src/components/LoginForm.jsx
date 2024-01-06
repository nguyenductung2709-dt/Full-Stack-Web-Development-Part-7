import { setNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { setUsers } from "../reducers/userReducer";
import { useSelector } from "react-redux";


const LoginForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user)

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    event.target.username.value = "";
    event.target.password.value = "";

    try {
      await dispatch(setUsers(username, password));
    } catch (error) {
      dispatch(setNotification(`Error logging in: ${error.message}`, 2000));
    }
  };

  if (user != null) {
    window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
   }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Username"
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );
};

export default LoginForm;
