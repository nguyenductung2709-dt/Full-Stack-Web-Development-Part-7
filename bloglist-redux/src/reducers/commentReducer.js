import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const commentSlice = createSlice({
    name: "comment",
    initialState: [],
    reducers: {
        setComments: (state, action) => {
            return action.payload;
        }
    }
})

export const { setComments } = commentSlice.actions;
export default commentSlice.reducer;
export const initializeComments = (id) => {
    return async (dispatch) => {
      const comments = await blogService.getComments(id)
      dispatch(setComments(comments))
    }
  }