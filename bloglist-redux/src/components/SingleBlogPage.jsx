import React, { useState, useEffect } from "react";
import {
  handleLike,
  initializeBlogs,
  removeBlog,
} from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const SingleBlogPage = ({ username }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const blogs = useSelector((state) => state.blog);
  const [visibleBlog, setVisibleBlog] = useState(null);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const blog = blogs.find((blog) => blog.id === id);
    setVisibleBlog(blog);
  }, [blogs, id]);

  const increaseLike = (id) => {
    const blogToLike = blogs.find((blog) => blog.id === id);
    if (blogToLike) {
      dispatch(handleLike(id));
      dispatch(
        setNotification(
          `Liked blog: ${blogToLike.title} by ${blogToLike.author}`,
          2000
        )
      );
      dispatch(initializeBlogs());
    }
  };

  const deleteBlog = (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id);
    if (blogToDelete) {
      dispatch(removeBlog(id));
      dispatch(
        setNotification(
          `Deleted blog: ${blogToDelete.title} by ${blogToDelete.author}`,
          2000
        )
      );
    }
  };

  const toggleVisibility = () => {
    setVisibleBlog((prevVisibleBlog) => ({
      ...prevVisibleBlog,
      visible: !prevVisibleBlog.visible,
    }));
  };

  if (!visibleBlog) {
    return <p>Loading...</p>;
  }

  return (
    <div key={visibleBlog.id} id="single-blog">
      <div id="blog-post">
        <p>
          <h1> {visibleBlog.title} by {visibleBlog.author} </h1>
        </p>
        <p>
          {visibleBlog.likes} likes 
          <button onClick={() => increaseLike(visibleBlog.id)}>Like</button>
        </p>
        {visibleBlog.user && (
          <p> added by {visibleBlog.user.name} </p>
        )}
        {visibleBlog.user && username === visibleBlog.user.username && (
          <button onClick={() => deleteBlog(visibleBlog.id)}>Delete</button>
        )}
      </div>
    </div>
  );
};

export default SingleBlogPage;
