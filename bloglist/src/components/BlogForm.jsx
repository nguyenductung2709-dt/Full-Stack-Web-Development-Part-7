import { useDispatch } from 'react-redux'
import { createBlogs } from "../reducers/blogReducer"; 
import { setNotification} from "../reducers/notificationReducer"; 

const BlogForm = () => {
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault();
    const title = event.target.title.value
    const author = event.target.author.value 
    const url = event.target.url.value
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    dispatch(createBlogs(title, author, url))
    dispatch(
      setNotification(
        `a blog ${title} by ${author} added`,
        2000,
      ),
    );
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Title"
        />
      </div>
      <div>
        author:
        <input
          id="author"
          type="text"
          name="author"
          placeholder="Author"
        />
      </div>
      <div>
        url:
        <input
          id="url"
          type="text"
          name="url"
          placeholder="Url"
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};
export default BlogForm;
