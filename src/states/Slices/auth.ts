import { createSlice } from "@reduxjs/toolkit";

interface UserProps {
    isLogged: boolean;
    user: string | null;
    store: string | null;
}

const initialState: UserProps = {
  isLogged: localStorage.getItem("isLogged") === 'true', 
  user: null,
  store: null
}

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        toggleIsLogged: (state) => {
          state.isLogged = !state.isLogged
          localStorage.setItem("isLogged", state.isLogged.toString());
        }
    }
})

export const { toggleIsLogged} = userSlice.actions ;
export default userSlice.reducer;
