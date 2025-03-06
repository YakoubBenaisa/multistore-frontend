import { createSlice } from "@reduxjs/toolkit";

interface UserProps {
    isAuthenticated: boolean;
   
}

const initialState: UserProps = {
  isAuthenticated: localStorage.getItem("accessToken") ? true : false, 
}

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state) => {
          state.isAuthenticated = true;
        },
        logoutAction: (state) => {
          state.isAuthenticated = false;
        }  
    }
})

export const { loginSuccess, logoutAction} = userSlice.actions ;
export default userSlice.reducer;
