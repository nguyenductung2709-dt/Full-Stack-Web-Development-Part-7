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
import { setUsers, logOutUser } from './reducers/userReducer'


const App = () => {
  const blogs = useSelector(state => state.blog);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if (user && user.token) {
        blogService.setToken(user.token);
      }
    }
  }, []);
  

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const username = event.target.username.value;
      const password = event.target.password.value;
      event.target.username.value = "";
      event.target.password.value = "";
      await dispatch(setUsers(username, password));
    } catch (error) {
      dispatch(setNotification(`Error logging in: ${error.message}`, 2000));
    }
  };

  if (user != null) {
    window.localStorage.setItem(
      "loggedBlogappUser",
      JSON.stringify(user)
    );
  }
  
  const handleLogout = () => {
    try {
      window.localStorage.removeItem("loggedBlogappUser");
      blogService.setToken(null);
      dispatch(logOutUser());
    } catch (error) {
      dispatch(setNotification(`Error logging out: ${error.message}`, 2000));
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
          username = {user.username}
        />
      </div>
    );
  }
}


export default App;
