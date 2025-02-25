import { createSlice } from "@reduxjs/toolkit";

interface isLoggedProps {
    isLogged: boolean;
}

const initialState: isLoggedProps = {
  isLogged: localStorage.getItem("isLogged") === 'true', 
}

const isLoggedSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        toggleIsLogged: (state) => {
          state.isLogged = !state.isLogged
          localStorage.setItem("isLogged", state.isLogged.toString());
        }
    }
})

export const { toggleIsLogged} = isLoggedSlice.actions ;
export default isLoggedSlice.reducer;
