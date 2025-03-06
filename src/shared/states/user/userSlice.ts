import { createSlice } from "@reduxjs/toolkit";

interface UserProps {
    user?: {
      username: string;   
      email: string;
      id: string;
      storeId: string;
    } | null;
}

const initialState: UserProps = {
  user: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
          state.user = action.payload;
        },
        removeUser: (state) => {
          state.user = null;
        },
        setStore: (state, action) => {
          if (state.user) {
            state.user.storeId = action.payload;
          }
        }
        
    }
})

export const { setUser, removeUser, setStore} = userSlice.actions ;
export default userSlice.reducer;
