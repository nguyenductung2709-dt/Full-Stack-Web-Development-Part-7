import React, { useState } from "react";
import {
  handleLike,
  initializeBlogs,
  removeBlog,
} from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { useSelector, useDispatch } from "react-redux";

const Blog = ({ blogs, username }) => {
  const [visibleBlogs, setVisibleBlogs] = useState({});

  const dispatch = useDispatch();

  const increaseLike = (id) => {
    const blogToLike = blogs.find((blog) => blog.id === id);
    if (blogToLike) {
      dispatch(handleLike(id));
      dispatch(
        setNotification(
          `Liked blog: ${blogToLike.title} by ${blogToLike.author}`,
          2000,
        ),
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
          2000,
        ),
      );
    }
  };

  const toggleVisibility = (blogId) => {
    setVisibleBlogs((prevVisibleBlogs) => ({
      ...prevVisibleBlogs,
      [blogId]: !prevVisibleBlogs[blogId],
    }));
  };

  const blogStyle = {
    display: "flex",
    alignItems: "center",
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <>
      {blogs.map((singleBlog, index) => {
        const likeButtonId = `like-button-${index + 1}`;
        return (
          <div key={singleBlog.id} style={blogStyle} id="all_blogs">
            <div id="blog-post">
              <p>
                {singleBlog.title} by {singleBlog.author}
                {!visibleBlogs[singleBlog.id] ? (
                  <button
                    onClick={() => toggleVisibility(singleBlog.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    view
                  </button>
                ) : (
                  <button
                    onClick={() => toggleVisibility(singleBlog.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    hide
                  </button>
                )}
              </p>
              {visibleBlogs[singleBlog.id] && (
                <div>
                  <p>{singleBlog.url}</p>
                  <p>
                    Likes: {singleBlog.likes}{" "}
                    <button
                      id={likeButtonId}
                      onClick={() => increaseLike(singleBlog.id)}
                    >
                      like
                    </button>
                  </p>
                  {singleBlog.user && username === singleBlog.user.username && (
                    <button onClick={() => deleteBlog(singleBlog.id)}>
                      remove
                    </button>
                  )}
                  {singleBlog.user && singleBlog.user.name ? (
                    <p>{singleBlog.user.name}</p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Blog;
