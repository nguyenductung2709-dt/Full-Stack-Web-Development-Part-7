import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blog',
    initialState: [],
    reducers: {
        setBlogs: (state,action) => {
            return action.payload
        },
        createBlog: (state,action) => {
            state.push(action.payload)
        },
    }
})

export const { createBlog, setBlogs } = blogSlice.actions
export default blogSlice.reducer
export const initializeBlogs = () => {
    return async(dispatch) => {
        const blogs = await blogService.getAll()
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
        dispatch(setBlogs(sortedBlogs))
    }
}

export const createBlogs = (title, author, url) => {
    return async(dispatch) => {
        const newBlog = await blogService.createNew(title,author,url)
        dispatch(createBlog(newBlog))
    }
}
