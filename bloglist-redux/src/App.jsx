import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import UsersPage from "./components/UsersPage";
import UserPage from "./components/UserPage";
import SingleBlogPage from "./components/SingleBlogPage";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import { Navbar, Nav } from 'react-bootstrap';
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

  const Menu = () => {
    const menuStyle = {
      color: 'white'
    };
  
    const padding = {
      color: 'white',
      paddingRight: 20
    };

    const padding_p = {
      paddingTop: 8,
      paddingRight: 20
    };
  
    const logoutButtonStyle = {
      marginLeft: '10px'
    };
  
    return (
      <div style = {menuStyle}>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <a href ="/" style={padding} className="nav-link">
                blogs
              </a>
            </Nav.Item>
            <Nav.Item>
              <a href ="/users" style={padding} className="nav-link">
                users
              </a>
            </Nav.Item>
            <Nav.Item>
              <p style={padding_p}>{user.name} logged in</p>
            </Nav.Item>
            <Nav.Item>
              <button onClick={handleLogout} style={logoutButtonStyle} className="btn btn-outline-light">
              logout
            </button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      </div>
    );

    /*
    return (
      <div style={menuStyle}>
        <a href='/' style={padding}>blogs</a>
        <a href='/users' style={padding}>users</a>
        <p style={padding}>{user.name} logged in</p>
        <button onClick={handleLogout} style={logoutButtonStyle}>logout</button>
      </div>
    );*/
  };
  
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
        {Menu()}
        <h2>blog app</h2>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
            {blogForm()}
            <Blog blogs={blogs} username={user.username} />
            </>
          } />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserPage/>} />
          <Route path="/blogs/:id" element={<SingleBlogPage username={user.username} />} />
        </Routes>
      </Router>
      </div>
    );
  }
};

export default App;
