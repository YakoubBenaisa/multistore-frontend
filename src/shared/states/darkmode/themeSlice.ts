import { createSlice } from "@reduxjs/toolkit";

interface themeProps {
    darkMode: boolean;
}

const initialState: themeProps = {
  darkMode: false, 
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
          state.darkMode = !state.darkMode;
          localStorage.setItem("darkMode", state.darkMode.toString());
        }
    }
})

export const { toggleDarkMode} = themeSlice.actions ;
export default themeSlice.reducer;
