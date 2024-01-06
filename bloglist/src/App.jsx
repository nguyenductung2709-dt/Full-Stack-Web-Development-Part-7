import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { setNotification } from "./reducers/notificationReducer";
import { useSelector, useDispatch } from 'react-redux';
import { initializeBlogs } from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [nameOfCreator, setNameOfCreator] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("");

  useEffect(() => {
    dispatch(initializeBlogs()) 
  }, [])

  const blogs = useSelector(state => state.blog)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      setLoggedInUsername(user.username);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setLoggedInUsername(user.username);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("wrong username or password", 2000));
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      window.localStorage.removeItem("loggedBlogappUser");
      blogService.setToken(null);
      setUser(null);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("Error logging out", 2000));
    }
  };

  const blogFormRef = useRef();

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm/>
    </Togglable>
  );

  if (user === null) {
    return (
      <>
        <Notification />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              placeholder="Username"
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Password"
            />
          </div>
          <button id="login-button" type="submit">
            login
          </button>
        </form>
      </>
    );
  } else {
    return (
      <div>
        <Notification />
        <h2>blogs</h2>
        <p>{user.name} logged in</p>{" "}
        <button onClick={handleLogout}>logout</button>
        {blogForm()}
        <Blog
          blogs={blogs}
          nameOfCreator={nameOfCreator}
          username={loggedInUsername}
        />
      </div>
    );
  }
}


export default App;
