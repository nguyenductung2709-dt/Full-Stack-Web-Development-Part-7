import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import UsersPage from "./components/UsersPage";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import { setNotification } from "./reducers/notificationReducer";
import { useSelector, useDispatch } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { setUsers, logOutUser } from "./reducers/userReducer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  Navigate,
} from "react-router-dom";

const App = () => {
  const blogs = useSelector((state) => state.blog);
  const user = useSelector((state) => state.user);
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
      <BlogForm />
    </Togglable>
  );

  if (user === null) {
    return (
      <>
        <Notification />
        <h2>Log in to application</h2>
        <LoginForm />
      </>
    );
  } else {
    return (
      <div>
        <Notification />
        <h2>blogs</h2>
        <p>{user.name} logged in</p>{" "}
        <button onClick={handleLogout}>logout</button>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
            {blogForm()}
            <Blog blogs={blogs} username={user.username} />
            </>
          } />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </Router>
      </div>
    );
  }
};

export default App;
